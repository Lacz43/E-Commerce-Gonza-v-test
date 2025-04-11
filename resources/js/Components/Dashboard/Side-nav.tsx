import { paths } from "@/paths";
import ApplicationLogo from "../ApplicationLogo";
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";

function SideNavItem() {
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

export default function SideNav() {
	return (
		<aside className="w-[23rem] bg-[#121621] text-white flex flex-col max-md:hidden">
			<header className="p-5 border-b border-b-gray-500 flex justify-center">
				<ApplicationLogo />
				<b className="ml-2">Gonza Go</b>
			</header>
			<div className="px-4 py-4">
				<SideNavItem />
			</div>
			<footer className="border-t border-t-gray-500 p-3 mt-auto">footer</footer>
		</aside>
	);
}
