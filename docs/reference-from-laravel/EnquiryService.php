<?php

namespace App\Services;

use App\Enums\EnquirySource;
use App\Enums\EnquiryStatus;
use App\Enums\Priority;
use App\Mail\EnquiryAutoReply;
use App\Mail\EnquiryReceived;
use App\Models\ActivityLog;
use App\Models\Attachment;
use App\Models\Customer;
use App\Models\Enquiry;
use App\Models\EnquiryStatusHistory;
use App\Models\User;
use App\Models\WebsiteSetting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

/**
 * All enquiry creation flows through here — contact form, product enquiry,
 * PC builder and AI assistant. Centralising it means reference numbering,
 * customer de-duplication, notification and audit logging cannot drift apart.
 */
class EnquiryService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, ?UploadedFile $attachment = null): Enquiry
    {
        $source = EnquirySource::from($data['source'] ?? 'contact');

        // The reference counter and the insert must be atomic, otherwise two
        // simultaneous submissions can claim the same number.
        $enquiry = DB::transaction(function () use ($data, $source, $attachment) {
            $customer = Customer::findOrCreateFrom($data);

            $enquiry = Enquiry::create([
                'reference' => Enquiry::nextReference(),
                'customer_id' => $customer->id,
                'product_id' => $data['product_id'] ?? null,
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'company' => $data['company'] ?? null,
                'source' => $source,
                'status' => EnquiryStatus::New,
                'priority' => $this->derivePriority($data, $source),
                'product_interest' => $data['product'] ?? null,
                'budget_range' => $data['budget'] ?? null,
                'message' => $data['message'],
                'requirements' => $data['requirements'] ?? null,
                'ip_address' => request()->ip(),
                'user_agent' => substr((string) request()->userAgent(), 0, 500),
                'page_url' => $data['page_url'] ?? null,
                'utm_source' => $data['utm_source'] ?? null,
                'utm_medium' => $data['utm_medium'] ?? null,
                'utm_campaign' => $data['utm_campaign'] ?? null,
            ]);

            EnquiryStatusHistory::create([
                'enquiry_id' => $enquiry->id,
                'user_id' => null,
                'from_status' => null,
                'to_status' => EnquiryStatus::New->value,
                'note' => "Created from {$source->value}",
            ]);

            if ($attachment) {
                $this->storeAttachment($enquiry, $attachment);
            }

            return $enquiry;
        });

        $this->notify($enquiry);

        ActivityLog::record(
            action: 'created',
            description: "Enquiry {$enquiry->reference} received from {$source->value}",
            subject: $enquiry,
            new: $enquiry->only(['reference', 'name', 'email', 'source', 'priority'])
        );

        return $enquiry;
    }

    /**
     * Budget is the strongest available intent signal, so it can raise the
     * source-derived default. It never lowers it.
     */
    private function derivePriority(array $data, EnquirySource $source): Priority
    {
        $default = $source->defaultPriority();

        $highValue = in_array($data['budget'] ?? null, ['5l-10l', 'above-10l'], true)
            || (int) ($data['budget_amount'] ?? 0) >= 500_000;

        if ($highValue) {
            return Priority::Urgent;
        }

        // A named company is a weak but real B2B signal.
        if (filled($data['company'] ?? null) && $default === Priority::Medium) {
            return Priority::High;
        }

        return $default;
    }

    private function storeAttachment(Enquiry $enquiry, UploadedFile $file): void
    {
        $disk = config('filesystems.default');
        $path = $file->store("enquiries/{$enquiry->id}", $disk);

        Attachment::create([
            'attachable_type' => Enquiry::class,
            'attachable_id' => $enquiry->id,
            'disk' => $disk,
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size_bytes' => $file->getSize(),
            'checksum' => hash_file('sha256', $file->getRealPath()),
        ]);
    }

    /**
     * Mail failures must never fail the request — the lead is already saved,
     * and losing it because SMTP is down would be the worse outcome.
     */
    private function notify(Enquiry $enquiry): void
    {
        try {
            $recipients = collect(explode(',', (string) WebsiteSetting::get('smtp', 'notification_recipients', config('mail.sales_address'))))
                ->map(fn (string $email) => trim($email))
                ->filter()
                ->all();

            if ($recipients) {
                Mail::to($recipients)->queue(new EnquiryReceived($enquiry));
            }

            Mail::to($enquiry->email)->queue(new EnquiryAutoReply($enquiry));
        } catch (\Throwable $e) {
            Log::error('Enquiry notification failed', [
                'enquiry' => $enquiry->reference,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /** Status change with transition validation and timeline recording. */
    public function changeStatus(Enquiry $enquiry, EnquiryStatus $next, ?User $actor = null, ?string $note = null): Enquiry
    {
        $current = $enquiry->status;

        if (! $current->canTransitionTo($next)) {
            throw new \DomainException("Cannot move an enquiry from {$current->value} to {$next->value}.");
        }

        DB::transaction(function () use ($enquiry, $current, $next, $actor, $note) {
            $enquiry->update([
                'status' => $next,
                'closed_at' => $next->isTerminal() ? now() : null,
                // The first move off "new" is the first human response.
                'first_response_at' => $enquiry->first_response_at ?? now(),
            ]);

            EnquiryStatusHistory::create([
                'enquiry_id' => $enquiry->id,
                'user_id' => $actor?->id,
                'from_status' => $current->value,
                'to_status' => $next->value,
                'note' => $note,
            ]);
        });

        ActivityLog::record(
            action: 'updated',
            description: "Enquiry {$enquiry->reference}: {$current->label()} → {$next->label()}",
            subject: $enquiry,
            old: ['status' => $current->value],
            new: ['status' => $next->value]
        );

        return $enquiry->refresh();
    }

    public function assign(Enquiry $enquiry, User $assignee, ?User $actor = null): Enquiry
    {
        $previous = $enquiry->assignee?->name ?? 'nobody';
        $enquiry->update(['assigned_to' => $assignee->id]);

        ActivityLog::record(
            action: 'assigned',
            description: "Enquiry {$enquiry->reference} reassigned from {$previous} to {$assignee->name}",
            subject: $enquiry,
            old: ['assigned_to' => $previous],
            new: ['assigned_to' => $assignee->name]
        );

        return $enquiry->refresh();
    }
}
