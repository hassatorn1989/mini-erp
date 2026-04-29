<?php

namespace App\Providers;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\ServiceProvider;

class BlueprintMacroServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Blueprint::macro('auditFields', function (bool $softDeletes = false, bool $isActive = false) {
            /** @var Blueprint $this */

            if ($isActive) {
                $this->boolean('is_active')->default(true)->index();
            }

            $this->foreignUuid('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $this->foreignUuid('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $this->timestamps();

            if ($softDeletes) {
                $this->foreignUuid('deleted_by')
                    ->nullable()
                    ->constrained('users')
                    ->nullOnDelete();

                $this->softDeletes();
            }
        });

        Blueprint::macro('supplierSnapshotFields', function () {
            /** @var Blueprint $this */
            // snapshot supplier info
            $this->string('supplier_name')->nullable();
            $this->string('supplier_branch_name')->nullable();
            $this->string('supplier_contact')->nullable();
            $this->string('supplier_email')->nullable();
            $this->string('supplier_phone')->nullable();
            $this->text('supplier_address')->nullable();
        });

        Blueprint::macro('customerSnapshotFields', function () {
            /** @var Blueprint $this */
            // snapshot customer info
            $this->string('customer_name')->nullable();
            $this->string('customer_branch_name')->nullable();
            $this->string('customer_contact')->nullable();
            $this->string('customer_email')->nullable();
            $this->string('customer_phone')->nullable();
            $this->text('customer_address')->nullable();
        });

        Blueprint::macro('moneySummaryFields', function () {
            /** @var Blueprint $this */
            $this->decimal('subtotal', 15, 2)->default(0);

            // Item-level discounts
            $this->decimal('item_discount_total', 15, 2)->default(0);

            // Bill-level discounts
            $this->string('bill_discount_type')->default('amount');
            $this->decimal('bill_discount_value', 15, 2)->default(0);
            $this->decimal('bill_discount_amount', 15, 2)->default(0);

            $this->decimal('discount_total', 15, 2)->default(0);

            $this->decimal('vat_rate', 5, 2)->default(7.00);
            $this->decimal('taxable_amount', 15, 2)->default(0);
            $this->decimal('vat_total', 15, 2)->default(0);

            $this->decimal('grand_total', 15, 2)->default(0);
        });

        Blueprint::macro('moneyLineSummaryFields', function () {
            /** @var Blueprint $this */
            $this->decimal('line_subtotal', 15, 2)->default(0);

            $this->string('discount_type')->default('amount');
            $this->decimal('discount_value', 15, 2)->default(0);
            $this->decimal('discount_amount', 15, 2)->default(0);

            $this->decimal('allocated_bill_discount', 15, 2)->default(0);

            $this->enum('vat_type', [
                'none',
                'exclusive',
                'inclusive',
                'zero_rated',
                'exempt',
            ])->default('exclusive');

            $this->decimal('vat_rate', 5, 2)->default(7.00);
            $this->decimal('vat_amount', 15, 2)->default(0);

            $this->decimal('net_amount', 15, 2)->default(0);
            $this->decimal('line_total', 15, 2)->default(0);
        });
    }
}
