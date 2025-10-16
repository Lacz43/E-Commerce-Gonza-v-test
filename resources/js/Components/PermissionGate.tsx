import type { PropsWithChildren } from "react";
import usePermissions from "@/Hook/usePermissions";

interface Props extends PropsWithChildren {
	permission?: string[];
	roles?: string[];
	strict?: boolean; // Si true, roles vacío significa solo usuarios sin roles específicos
}

// componente que verifica si el usuario tiene permiso para ver el contenido
export default function PermissionGate({
	permission,
	roles,
	strict = false,
	children,
}: Props) {
	const { hasPermission, hasRole, roles: userRoles } = usePermissions();

	if (permission?.length && !hasPermission(permission)) return null;

	// Si strict es true y roles está definido pero vacío, significa solo para usuarios sin roles específicos
	if (strict && roles !== undefined && roles.length === 0) {
		// Verificar si el usuario tiene algún rol específico (admin, seller, etc.)
		const user_roles = userRoles() || [];
		// Si el usuario tiene roles específicos, no mostrar
		if (user_roles.length > 0) return null;
	} else if (roles?.length && !hasRole(roles)) {
		return null;
	}

	return <>{children}</>;
}
