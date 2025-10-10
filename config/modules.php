<?php

return [
    'modules' => [
        'dashboard',
        'products',
        'product_categories',
        'product_brands',
        'product_inventory',
        'settings',
        'backups',
        'sales',
        'users',
        'orders'
    ],
    'model_names' => [
        'ProductInventory' => 'Inventario',
        'ProductImage' => 'Imagenes de Productos',
        'Setting' => 'Configuración',
        'Product' => 'Productos',
        'Brand' => 'Marcas',
        'Category' => 'Categorías',
        'ProductCategory' => 'Categorías de Productos',
        'ProductBrand' => 'Marcas de Productos',
        'Order' => 'Ventas',
        'User' => 'Usuarios',
        'InventoryMovement' => 'Movimientos de Inventario',
        'Attachment' => 'Archivos',
    ],
];
