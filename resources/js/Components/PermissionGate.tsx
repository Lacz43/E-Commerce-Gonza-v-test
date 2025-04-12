import usePermissions from "@/Hook/usePermissions";
import type { PropsWithChildren } from "react";

interface Props extends PropsWithChildren{
    permission: string,
}

export default function PermissionGate({permission, children}: Props) {
    const { hasPermission } = usePermissions();

    if(!hasPermission(permission)) return null;

    return <>{children}</>
}
