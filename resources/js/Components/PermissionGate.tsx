import usePermissions from "@/Hook/usePermissions";
import type React from "react";

interface Props {
    permission: string,
    children: React.ReactNode,
}

export default function PermissionGate({permission, children}: Props) {
    const { hasPermission } = usePermissions();

    if(!hasPermission(permission)) return null;

    return <>{children}</>
}
