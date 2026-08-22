<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * CRM: customers, enquiries, build requests, quotations and the enquiry timeline.
 *
 * `enquiry_status_history` exists because "what happened to this lead and when"
 * is the single most common question a sales manager asks, and reconstructing it
 * from an audit log after the fact is unreliable.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 160);
            $table->string('email', 180)->index();
            $table->string('phone', 32)->index();
            $table->string('company', 180)->nullable();
            $table->string('location', 180)->nullable();
            $table->string('gstin', 20)->nullable();
            $table->enum('type', ['individual', 'business', 'institution'])->default('individual');
            $table->unsignedInteger('lifetime_value')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // A person may enquire repeatedly; email+phone identifies them.
            $table->unique(['email', 'phone']);
        });

        Schema::create('enquiries', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 32)->unique();       // ENQ-2026-1847
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();

            // Denormalised contact snapshot — the customer record may change later,
            // but the enquiry must preserve what was actually submitted.
            $table->string('name', 160);
            $table->string('email', 180);
            $table->string('phone', 32);
            $table->string('company', 180)->nullable();

            $table->enum('source', ['contact', 'product', 'builder', 'service', 'ai-assistant'])->index();
            $table->enum('status', ['new', 'contacted', 'quotation-sent', 'won', 'lost', 'closed'])->default('new')->index();
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium')->index();

            $table->string('product_interest', 200)->nullable();
            $table->string('budget_range', 80)->nullable();
            $table->text('message');
            $table->text('requirements')->nullable();

            // Attribution & anti-abuse
            $table->ipAddress('ip_address')->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->string('page_url', 500)->nullable();
            $table->string('utm_source', 120)->nullable();
            $table->string('utm_medium', 120)->nullable();
            $table->string('utm_campaign', 120)->nullable();

            $table->timestamp('first_response_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'created_at']);
            $table->index(['assigned_to', 'status']);
        });

        Schema::create('enquiry_status_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enquiry_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('from_status', 32)->nullable();
            $table->string('to_status', 32);
            $table->text('note')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['enquiry_id', 'created_at']);
        });

        Schema::create('enquiry_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enquiry_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('body');
            $table->boolean('is_internal')->default(true);
            $table->timestamps();
        });

        Schema::create('build_requests', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 32)->unique();       // NSK-BUILD-2026-0231
            $table->foreignId('enquiry_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();

            $table->enum('purpose', ['gaming', 'editing', 'office', 'programming', 'ai', 'streaming', 'architecture']);
            $table->unsignedInteger('budget');
            $table->enum('brand_preference', ['intel', 'amd', 'nvidia', 'no-preference']);
            $table->enum('performance_level', ['entry', 'mid', 'high', 'extreme']);
            $table->json('accessories')->nullable();          // string[]

            // Client-side estimate is stored for comparison; server value is authoritative.
            $table->unsignedInteger('estimate_low')->nullable();
            $table->unsignedInteger('estimate_high')->nullable();
            $table->unsignedInteger('server_estimate_low')->nullable();
            $table->unsignedInteger('server_estimate_high')->nullable();

            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['purpose', 'performance_level']);
        });

        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 32)->unique();       // QT-2026-0412
            $table->foreignId('enquiry_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('customer_id')->constrained()->restrictOnDelete();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();

            $table->enum('status', ['draft', 'sent', 'accepted', 'rejected', 'expired'])->default('draft')->index();
            $table->unsignedInteger('subtotal')->default(0);
            $table->unsignedInteger('discount')->default(0);
            $table->decimal('tax_rate', 5, 2)->default(18.00);
            $table->unsignedInteger('tax_amount')->default(0);
            $table->unsignedInteger('total')->default(0);

            $table->date('valid_until')->nullable();
            $table->text('terms')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('quote_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quote_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();

            // Free-text line items are allowed (labour, custom parts, services).
            $table->string('description', 300);
            $table->unsignedSmallInteger('quantity')->default(1);
            $table->unsignedInteger('unit_price');
            $table->unsignedInteger('line_total');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quote_items');
        Schema::dropIfExists('quotes');
        Schema::dropIfExists('build_requests');
        Schema::dropIfExists('enquiry_notes');
        Schema::dropIfExists('enquiry_status_history');
        Schema::dropIfExists('enquiries');
        Schema::dropIfExists('customers');
    }
};
