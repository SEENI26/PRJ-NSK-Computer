<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Product catalogue: brands, categories, products and their specifications.
 *
 * Specifications live in a dedicated table (not a JSON blob) so they remain
 * queryable — "show me every board with 5 M.2 slots" has to be a WHERE clause,
 * not an application-layer filter.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120)->unique();
            $table->string('slug', 140)->unique();
            $table->string('logo_path')->nullable();
            $table->text('description')->nullable();
            $table->string('website')->nullable();
            $table->boolean('is_partner')->default(false);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('name', 120);
            $table->string('slug', 140)->unique();
            $table->string('group', 60)->index();            // Systems | Components | Peripherals
            $table->text('description')->nullable();
            $table->string('image_path')->nullable();
            $table->string('icon', 60)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);

            // SEO
            $table->string('meta_title', 180)->nullable();
            $table->string('meta_description', 320)->nullable();

            $table->timestamps();
            $table->index(['is_active', 'sort_order']);
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->foreignId('brand_id')->constrained()->restrictOnDelete();

            $table->string('name', 200);
            $table->string('slug', 220)->unique();
            $table->string('sku', 80)->unique();
            $table->string('tagline', 255)->nullable();
            $table->text('description');
            $table->json('highlights')->nullable();          // string[]

            // Money stored as integer paise-free rupees; currency fixed to INR.
            $table->unsignedInteger('price');
            $table->unsignedInteger('compare_at_price')->nullable();
            $table->unsignedInteger('cost_price')->nullable(); // never exposed publicly

            $table->enum('stock_status', ['in-stock', 'low-stock', 'pre-order', 'out-of-stock'])->default('in-stock');
            $table->unsignedInteger('stock_quantity')->default(0);
            $table->string('lead_time', 120)->nullable();
            $table->string('warranty', 160)->nullable();

            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->string('badge', 60)->nullable();

            $table->decimal('rating_value', 2, 1)->default(0);
            $table->unsignedInteger('rating_count')->default(0);
            $table->unsignedBigInteger('view_count')->default(0);

            // SEO
            $table->string('meta_title', 180)->nullable();
            $table->string('meta_description', 320)->nullable();
            $table->string('canonical_url')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_active', 'is_featured']);
            $table->index(['category_id', 'is_active', 'price']);
            $table->index(['brand_id', 'is_active']);
            $table->fullText(['name', 'tagline', 'description']);
        });

        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->string('alt', 255);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_primary')->default(false);
            $table->timestamps();

            $table->index(['product_id', 'sort_order']);
        });

        Schema::create('product_specifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('group', 120);                    // "Core platform", "Storage & power"
            $table->string('label', 160);
            $table->string('value', 500);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['product_id', 'group', 'sort_order']);
        });

        Schema::create('product_features', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('title', 160);
            $table->text('description');
            $table->string('icon', 60)->default('Circle');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('product_downloads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('label', 200);
            $table->enum('type', ['PDF', 'ZIP', 'EXE'])->default('PDF');
            $table->string('path');
            $table->unsignedBigInteger('size_bytes')->default(0);
            $table->unsignedInteger('download_count')->default(0);
            $table->timestamps();
        });

        // Self-referencing many-to-many for "related products".
        Schema::create('product_related', function (Blueprint $table) {
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('related_product_id')->constrained('products')->cascadeOnDelete();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->primary(['product_id', 'related_product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_related');
        Schema::dropIfExists('product_downloads');
        Schema::dropIfExists('product_features');
        Schema::dropIfExists('product_specifications');
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('brands');
    }
};
