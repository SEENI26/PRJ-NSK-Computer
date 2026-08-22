<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Editorial & marketing content: services, portfolio, blog, testimonials, FAQ.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name', 160);
            $table->string('slug', 180)->unique();
            $table->string('summary', 400);
            $table->text('description');
            $table->string('image_path')->nullable();
            $table->string('icon', 60)->default('Wrench');
            $table->unsignedInteger('starting_at')->nullable();
            $table->string('turnaround', 160)->nullable();
            $table->json('deliverables')->nullable();       // string[]
            $table->json('process')->nullable();            // [{step, detail}]
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->string('meta_title', 180)->nullable();
            $table->string('meta_description', 320)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('portfolio_projects', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->string('slug', 220)->unique();
            $table->string('category', 80)->index();
            $table->string('client', 180);
            $table->string('location', 180);
            $table->unsignedSmallInteger('year');

            $table->string('summary', 500);
            $table->text('challenge');
            $table->text('solution');
            $table->text('outcome');

            $table->string('cover_path');
            $table->string('before_path')->nullable();
            $table->string('after_path')->nullable();
            $table->json('stats')->nullable();              // [{label, value}]

            $table->boolean('is_published')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->unsignedSmallInteger('sort_order')->default(0);

            $table->string('meta_title', 180)->nullable();
            $table->string('meta_description', 320)->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_published', 'category', 'year']);
        });

        Schema::create('portfolio_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_project_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->string('alt', 255);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name', 80)->unique();
            $table->string('slug', 100)->unique();
            $table->timestamps();
        });

        // Polymorphic — one tag vocabulary shared by portfolio projects and posts.
        Schema::create('taggables', function (Blueprint $table) {
            $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
            $table->morphs('taggable');
            $table->primary(['tag_id', 'taggable_id', 'taggable_type'], 'taggables_primary');
        });

        Schema::create('blog_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 80)->unique();
            $table->string('slug', 100)->unique();
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blog_category_id')->constrained()->restrictOnDelete();
            $table->foreignId('author_id')->constrained('users')->restrictOnDelete();

            $table->string('title', 250);
            $table->string('slug', 270)->unique();
            $table->string('excerpt', 600);
            $table->json('body');                            // ArticleBlock[]
            $table->string('cover_path');

            $table->enum('status', ['draft', 'scheduled', 'published', 'archived'])->default('draft')->index();
            $table->boolean('is_featured')->default(false);
            $table->unsignedSmallInteger('read_minutes')->default(5);
            $table->unsignedBigInteger('view_count')->default(0);

            $table->timestamp('published_at')->nullable()->index();

            $table->string('meta_title', 180)->nullable();
            $table->string('meta_description', 320)->nullable();
            $table->string('canonical_url')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'published_at']);
            $table->fullText(['title', 'excerpt']);
        });

        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_project_id')->nullable()->constrained()->nullOnDelete();
            $table->text('quote');
            $table->string('name', 160);
            $table->string('role', 160);
            $table->string('company', 180);
            $table->string('avatar_path')->nullable();
            $table->unsignedTinyInteger('rating')->default(5);
            $table->string('project_label', 200)->nullable();
            $table->boolean('is_published')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('category', 60)->index();         // Buying | Builds | Service | Business
            $table->string('question', 400);
            $table->text('answer');
            $table->boolean('is_published')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('newsletter_subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email', 180)->unique();
            $table->string('confirmation_token', 64)->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('newsletter_subscribers');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('blog_posts');
        Schema::dropIfExists('blog_categories');
        Schema::dropIfExists('taggables');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('portfolio_images');
        Schema::dropIfExists('portfolio_projects');
        Schema::dropIfExists('services');
    }
};
