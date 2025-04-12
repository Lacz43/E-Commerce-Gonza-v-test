import { usePage } from "@inertiajs/react";

export default function usePermissions() {
	const { auth } = (usePage().props as unknown as Auth);

	return {
		hasPermission: (permission: string) => {
			return auth.user?.permissions?.includes(permission);
		},
		hasRole: (role: string) => {
			return auth.user?.roles?.includes(role);
		},
	};
}
