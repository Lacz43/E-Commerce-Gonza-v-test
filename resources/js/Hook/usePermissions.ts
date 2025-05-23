import { usePage } from "@inertiajs/react";

// hook que verifica si el usuario tiene permiso para ver el contenido
export default function usePermissions() {
	const { auth } = usePage().props as unknown as Auth;

	return {
		hasPermission: (permission: string[]) => {
			// obtiene si el usuario tiene permiso para ver el contenido
			return permission.some((element) => auth.permissions?.includes(element));
		},
		hasRole: (role: string[]) => {
			// obtiene si el usuario tiene un rol
			return role.some((element) => auth.roles?.includes(element));
		},
	};
}
