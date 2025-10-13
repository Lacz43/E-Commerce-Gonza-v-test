<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Settings\OrderSettings;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ExpireOrders extends Command
{
    protected $signature = 'orders:expire';

    protected $description = 'Expire orders that have not been paid within the allowed time';

    public function handle()
    {
        $settings = app(OrderSettings::class);
        $hours = $settings->max_payment_wait_time_hours;

        if ($hours === null) {
            $this->info('Order expiry is disabled.');
            return;
        }

        $expiredAt = Carbon::now()->subHours($hours);

        $expiredOrders = Order::where('status', 'pending')
            ->where('created_at', '<', $expiredAt)
            ->update(['status' => 'expired']);

        $this->info("Expired {$expiredOrders} orders.");
    }
}
