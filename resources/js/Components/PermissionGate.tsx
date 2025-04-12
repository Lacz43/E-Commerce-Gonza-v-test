import usePermissions from "@/Hook/usePermissions";
import type { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
	permission?: string;
	role?: string;
}

// componente que verifica si el usuario tiene permiso para ver el contenido
export default function PermissionGate({ permission, role, children }: Props) {
	const { hasPermission, hasRole } = usePermissions();

	if (!role && !permission) return null;

	if (permission && !hasPermission(permission)) return null;
	if (role && !hasRole(role)) return null;

	return <>{children}</>;
}
