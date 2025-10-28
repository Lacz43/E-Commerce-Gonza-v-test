<?php

$modules = config('modules.modules');

return [
    'admin' => $modules,
    'seller' => ['sales', 'orders', 'product_inventory', 'products', 'product_categories', 'product_brands'],
];
