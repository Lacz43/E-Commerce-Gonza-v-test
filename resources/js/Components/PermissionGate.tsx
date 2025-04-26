import usePermissions from "@/Hook/usePermissions";
import type { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
	permission?: string[];
	roles?: string[];
}

// componente que verifica si el usuario tiene permiso para ver el contenido
export default function PermissionGate({ permission, roles, children }: Props) {
	const { hasPermission, hasRole } = usePermissions();

	// if (!roles && !permission) return null;

	if (permission?.length && !hasPermission(permission)) return null;
	if (roles?.length && !hasRole(roles)) return null;

	return <>{children}</>;
}
