import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwind_vite from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
        tailwind_vite(),
    ],
    server: {
        hmr: {
            host: 'localhost',
        },
        watch: {
            // Intenta ignorar explícitamente los archivos PHP
            ignored: [
                '**/*.php', // Esto ignora todos los archivos PHP
                // O sé más específico si es necesario:
                // 'app/**/*.php',
                // 'routes/**/*.php', // Aunque las rutas podrían ser manejadas por 'refresh'
                // 'config/**/*.php',
                // '!resources/views/**/*.blade.php' // Si quieres que Blade SÍ recargue (vía plugin)
            ],
        }
    }
});
