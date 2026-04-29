<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('company_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('singleton_key')->default('default')->unique();
            $table->string('company_name');
            $table->string('legal_name')->nullable();
            $table->string('tax_id')->nullable();
            $table->string('branch_code')->nullable();
            $table->string('branch_name')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->text('address')->nullable();
            $table->string('province')->nullable();
            $table->string('postal_code')->nullable();
            $table->decimal('vat_rate', 5, 2)->default(7.00);
            $table->enum('vat_type', ['none', 'exclusive', 'inclusive'])->default('exclusive');
            $table->auditFields(false, false);
        });

        Schema::create('warehouses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('address')->nullable();
            $table->string('contact_name')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable()->index();
            $table->auditFields(true, true);
        });

        Schema::create('departments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->auditFields(true, true);
        });

        Schema::create('positions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->auditFields(true, true);
        });

        Schema::create('prefixes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->string('description')->nullable();
            $table->auditFields(true, true);
        });

        Schema::create('employees', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('department_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignUuid('position_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignUuid('prefix_id')->nullable()->constrained()->nullOnDelete();
            $table->string('code')->unique();
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('email')->nullable()->index();
            $table->string('phone')->nullable();
            $table->string('position')->nullable();
            $table->string('department')->nullable();
            $table->date('hire_date')->nullable();
            $table->date('termination_date')->nullable();
            $table->text('address')->nullable();
            $table->auditFields(true, true);
        });

        Schema::create('customers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('customer_code')->unique();
            $table->string('name');
            $table->string('contact_name')->nullable();
            $table->string('email')->nullable()->index();
            $table->string('phone')->nullable();
            $table->text('billing_address')->nullable();
            $table->text('shipping_address')->nullable();
            $table->decimal('credit_limit', 15, 2)->default(0);
            $table->integer('payment_terms_days')->default(0);
            $table->string('tax_id')->nullable()->index();
            $table->enum('type', ['individual', 'company'])->default('individual')->index();
            $table->auditFields(true, true);
        });

        Schema::create('suppliers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('supplier_code')->unique();
            $table->string('name');
            $table->string('contact_name')->nullable();
            $table->string('email')->nullable()->index();
            $table->string('phone')->nullable();
            $table->string('tax_id')->nullable()->index();
            $table->text('address')->nullable();
            $table->integer('payment_terms_days')->default(0);
            $table->enum('type', ['individual', 'company'])->default('individual')->index();
            $table->auditFields(true, true);
        });

        Schema::create('item_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('parent_id')
                ->nullable()
                ->constrained('item_categories')
                ->nullOnDelete();

            $table->string('code')->nullable()->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->auditFields(true, true);

            $table->index(['parent_id', 'is_active']);
        });

        Schema::create('units', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->string('name');
            $table->string('code')->unique();
            $table->string('symbol')->nullable();

            $table->auditFields(true, true);
        });

        Schema::create('items', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('item_category_id')
                ->nullable()
                ->constrained('item_categories')
                ->nullOnDelete();

            $table->foreignUuid('base_unit_id')
                ->nullable()
                ->constrained('units')
                ->nullOnDelete();

            $table->string('code')->unique();
            $table->string('sku')->nullable()->unique();

            $table->string('name');
            $table->text('description')->nullable();
            $table->string('image')->nullable();

            $table->string('barcode')->nullable()->unique();

            $table->decimal('purchase_price', 15, 2)->default(0);
            $table->decimal('sale_price', 15, 2)->default(0);

            $table->boolean('track_stock')->default(true)->index();

            $table->enum('type', [
                'product',
                'service',
                'spare_part',
                'bundle',
            ])->default('product')->index();

            $table->boolean('allow_sale')->default(true)->index();
            $table->boolean('allow_purchase')->default(true)->index();

            $table->decimal('reorder_level', 15, 4)->default(0);

            $table->auditFields(true, true);

            $table->index(['type', 'track_stock', 'is_active']);
        });

        Schema::create('item_uoms', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('item_id')
                ->constrained('items')
                ->cascadeOnDelete();

            $table->foreignUuid('unit_id')
                ->constrained('units')
                ->restrictOnDelete();

            $table->decimal('conversion_factor', 15, 6)->default(1);

            $table->boolean('is_base')->default(false);
            $table->boolean('is_default_sale')->default(false);
            $table->boolean('is_default_purchase')->default(false);

            $table->string('barcode')->nullable()->unique();

            $table->decimal('purchase_price', 15, 2)->default(0);
            $table->decimal('sale_price', 15, 2)->default(0);

            $table->auditFields(false, false);

            $table->unique(['item_id', 'unit_id']);

            $table->index(['item_id', 'is_base']);
            $table->index(['item_id', 'is_default_sale']);
            $table->index(['item_id', 'is_default_purchase']);
        });

        Schema::create('item_bundle_components', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('bundle_item_id')
                ->constrained('items')
                ->cascadeOnDelete();

            $table->foreignUuid('component_item_id')
                ->constrained('items')
                ->restrictOnDelete();

            $table->foreignUuid('component_uom_id')
                ->nullable()
                ->constrained('item_uoms')
                ->nullOnDelete();

            $table->decimal('quantity', 15, 4);

            $table->auditFields(false, false);

            $table->unique([
                'bundle_item_id',
                'component_item_id',
                'component_uom_id',
            ], 'bundle_component_unique');

            $table->index('bundle_item_id');
            $table->index('component_item_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignUuid('employee_id')->nullable()->constrained()->nullOnDelete()->after('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['employee_id']);
            $table->dropColumn('employee_id');
        });

        Schema::dropIfExists('item_bundle_components');
        Schema::dropIfExists('item_uoms');
        Schema::dropIfExists('items');
        Schema::dropIfExists('item_categories');
        Schema::dropIfExists('suppliers');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('employees');
        Schema::dropIfExists('prefixes');
        Schema::dropIfExists('positions');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('warehouses');
        Schema::dropIfExists('company_settings');
    }
};
