
import { router } from "@inertiajs/react";

// Tipos para manejar errores de validación (código 422) que devuelve Inertia
type InertiaError = Record<string, string[]>;

// Conjunto de métodos HTTP que soportamos
type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

/**
 * Función asíncrona para hacer llamadas HTTP con Inertia.js
 *
 * @param method  Método HTTP (“get” | “post” | “put” | “patch” | “delete”)
 * @param route   Ruta o nombre de ruta Inertia a la que se enviará la solicitud
 * @param data    Datos a enviar (opcional; por defecto es objeto vacío)
 * @returns       Promesa que se resuelve con los props devueltos por Inertia o se rechaza con los errores de validación
 */
export default function routerAsync<R = any>(
  method: HttpMethod,
  route: string,
  data: Record<string, any> = {}
): Promise<R> {
  return new Promise((resolve, reject) => {
    // Construimos las opciones para Inertia.visit()
    const options: Record<string, any> = {
      method,
      data,

      // onSuccess recibe un objeto “page” (de tipo any) donde buscamos “props”
      onSuccess: (page: any) => {
        // Extraemos “props” y resolvemos la promesa como R
        // Si no existiera “page.props”, fallback a objeto vacío
        const props = (page.props ?? {}) as R;
        resolve(props);
      },

      // onError recibe directamente un Record<string, string[]> con los errores
      onError: (errors: InertiaError) => {
        reject(errors);
      },

      // Podrías agregar más callbacks/flags de Inertia aquí si los necesitas:
      // onStart?: () => void,
      // onFinish?: () => void,
      // preserveScroll?: boolean,
      // preserveState?: boolean,
      // replace?: boolean,
      // only?: string[] | string,
    };

    // Llamamos a router.visit() con la ruta y las opciones construidas
    router.visit(route, options);
  });
}

