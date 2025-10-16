<?php

$modules = config('modules.modules');

return [
    'admin' => $modules,
    'seller' => ['sales', 'orders'],
];
