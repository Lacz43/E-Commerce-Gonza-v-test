import usePermissions from "@/Hook/usePermissions";
import type { PropsWithChildren } from "react";

interface Props extends PropsWithChildren{
    permission: string,
}

// componente que verifica si el usuario tiene permiso para ver el contenido
export default function PermissionGate({permission, children}: Props) {
    const { hasPermission } = usePermissions();

    if(!hasPermission(permission)) return null;

    return <>{children}</>
}
