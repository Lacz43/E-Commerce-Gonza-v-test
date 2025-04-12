import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { paths } from "@/paths";

export default function SideNavItem() {
	const [active, setActive] = useState("");

	useEffect(() => {
		const path = window.location.pathname.split("/").filter(Boolean);
		setActive(path[0]);
	}, []);

	const list = Object.entries(paths).map(([clave, valor]) => {
		if (valor.hide === true) return;
		return (
			<Link
				key={clave}
				href={route(valor.path)}
				className={`flex items-center px-4 py-2 rounded-md ${valor.path === active ? "bg-blue-700" : ""}`}
			>
				<div className="pr-2">{valor.icon}</div>
				{valor.name}
			</Link>
		);
	});

	return <>{list}</>;
}
