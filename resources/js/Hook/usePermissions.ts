import PermissionService from '@/Services/PermissionService';

// hook que verifica si el usuario tiene permiso para ver el contenido
export default function usePermissions() {
	const permissionService = PermissionService.getInstance();

	return {
		hasPermission: (permission: string[]) => {
			// obtiene si el usuario tiene permiso para ver el contenido
			return permissionService.hasPermission(permission);
		},
		hasRole: (role: string[]) => {
			// obtiene si el usuario tiene un rol
			return permissionService.hasRole(role);
		},
		fetchPermissions: () => permissionService.fetchPermissions(),
		refreshPermissions: () => permissionService.refreshPermissions(),
		clearPermissions: () => permissionService.clearPermissions(),
	};
}
