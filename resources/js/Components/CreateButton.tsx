import { router } from "@inertiajs/react";
import { Button } from "@mui/material";
import PermissionGate from "@/Components/PermissionGate";

type Props = {
	permissions?: string[];
	route?: string;
	onAction?: () => void;
    label?: string;
};

export default function CreateButton({ permissions, route, onAction, label }: Props) {
	const handleClick = () => {
        onAction?.();
		if (route !== undefined) router.visit(route);
	};
	return (
		<PermissionGate permission={permissions}>
			<Button variant="contained" size="small" onClick={() => handleClick()}>
				<b>{label ?? "Nuevo"}</b>
			</Button>
		</PermissionGate>
	);
}
