<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Platform concerns: AI assistant transcripts, attachments, settings,
 * notifications, audit logging and queue/cache infrastructure.
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── AI assistant ──────────────────────────────────────────────────
        Schema::create('ai_conversations', function (Blueprint $table) {
            $table->id();
            $table->uuid('session_id')->unique();
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('enquiry_id')->nullable()->constrained()->nullOnDelete();

            // Details the assistant progressively collects during the conversation.
            $table->string('visitor_name', 160)->nullable();
            $table->string('visitor_email', 180)->nullable();
            $table->string('visitor_phone', 32)->nullable();

            $table->enum('status', ['active', 'converted', 'escalated', 'abandoned'])->default('active')->index();
            $table->enum('intent', ['recommendation', 'comparison', 'upgrade', 'quotation', 'support', 'general'])
                ->default('general');

            $table->unsignedSmallInteger('message_count')->default(0);
            $table->unsignedInteger('total_input_tokens')->default(0);
            $table->unsignedInteger('total_output_tokens')->default(0);

            $table->boolean('escalated_to_human')->default(false);
            $table->timestamp('escalated_at')->nullable();
            $table->foreignId('escalated_to')->nullable()->constrained('users')->nullOnDelete();

            $table->ipAddress('ip_address')->nullable();
            $table->string('entry_page', 500)->nullable();
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
        });

        Schema::create('chat_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ai_conversation_id')->constrained()->cascadeOnDelete();
            $table->enum('role', ['user', 'assistant', 'system', 'tool']);
            $table->longText('content');

            // Structured payloads the UI renders as rich cards.
            $table->json('recommendations')->nullable();     // [{slug,name,price,image,reason}]
            $table->json('quote_payload')->nullable();       // {total, items[]}
            $table->json('tool_calls')->nullable();

            $table->string('model', 80)->nullable();
            $table->unsignedInteger('input_tokens')->default(0);
            $table->unsignedInteger('output_tokens')->default(0);
            $table->unsignedInteger('latency_ms')->default(0);

            $table->timestamp('created_at')->useCurrent();

            $table->index(['ai_conversation_id', 'created_at']);
        });

        // ── Attachments (polymorphic) ─────────────────────────────────────
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();
            $table->morphs('attachable');                    // enquiries, quotes, products…
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();

            $table->string('disk', 40)->default('s3');
            $table->string('path');
            $table->string('original_name', 255);
            $table->string('mime_type', 120);
            $table->unsignedBigInteger('size_bytes');
            $table->string('checksum', 64)->nullable();      // sha256, for de-duplication

            $table->timestamps();
        });

        // ── Settings ──────────────────────────────────────────────────────
        Schema::create('website_settings', function (Blueprint $table) {
            $table->id();
            $table->string('group', 60)->index();            // company | seo | smtp | social | integrations
            $table->string('key', 120);
            $table->longText('value')->nullable();
            $table->enum('type', ['string', 'text', 'integer', 'boolean', 'json', 'encrypted'])->default('string');
            $table->boolean('is_public')->default(false);    // safe to expose to the frontend?
            $table->string('label', 160)->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['group', 'key']);
        });

        // ── Notifications ─────────────────────────────────────────────────
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->morphs('notifiable');
            $table->text('data');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['notifiable_type', 'notifiable_id', 'read_at'], 'notifications_unread_index');
        });

        // ── Audit log ─────────────────────────────────────────────────────
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action', 80)->index();           // created | updated | deleted | exported | logged_in
            $table->nullableMorphs('subject');               // the record acted upon
            $table->string('description', 500);

            // Before/after diff — only changed keys, never full row dumps.
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();

            $table->ipAddress('ip_address')->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['user_id', 'created_at']);
        });

        // ── Analytics (first-party page views; no third-party cookie) ─────
        Schema::create('page_views', function (Blueprint $table) {
            $table->id();
            $table->string('path', 500);
            $table->string('referrer', 500)->nullable();
            $table->string('session_hash', 64)->index();     // salted hash, not an identifier
            $table->string('country', 2)->nullable();
            $table->enum('device', ['desktop', 'tablet', 'mobile'])->default('desktop');
            $table->timestamp('created_at')->useCurrent();

            $table->index(['path', 'created_at']);
        });

        // ── Framework infrastructure ──────────────────────────────────────
        Schema::create('cache', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->mediumText('value');
            $table->integer('expiration');
        });

        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->string('owner');
            $table->integer('expiration');
        });

        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('queue')->index();
            $table->longText('payload');
            $table->unsignedTinyInteger('attempts');
            $table->unsignedInteger('reserved_at')->nullable();
            $table->unsignedInteger('available_at');
            $table->unsignedInteger('created_at');
        });

        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->text('connection');
            $table->text('queue');
            $table->longText('payload');
            $table->longText('exception');
            $table->timestamp('failed_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('failed_jobs');
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('cache_locks');
        Schema::dropIfExists('cache');
        Schema::dropIfExists('page_views');
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('website_settings');
        Schema::dropIfExists('attachments');
        Schema::dropIfExists('chat_history');
        Schema::dropIfExists('ai_conversations');
    }
};
