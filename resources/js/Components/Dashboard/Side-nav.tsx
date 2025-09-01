import { Close } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { lazy, Suspense } from "react";
import ApplicationLogo from "../ApplicationLogo";
import SideSkeleton from "./Side-skeleton";

const SideNavItem = lazy(() => import("./SideNavItem"));

export default function SideNav() {
	function closeSideNav() {
		const sideNav = document.getElementById("side-nav");
		if (sideNav) sideNav.classList.remove("show-sideNav");
	}

	return (
		<aside
			id="side-nav"
			className="w-[20rem] max-sm:w-full fixed top-0 h-screen z-1100 flex flex-col side-nav bg-gradient-to-b from-orange-50 via-white to-emerald-50 text-slate-700 border-r border-orange-100 shadow-xl/40 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md"
		>
			<header className="relative flex items-center gap-3 px-5 py-4 border-b border-orange-100/70 bg-white/70">
				<ApplicationLogo />
				<b className="font-semibold tracking-tight text-slate-800">Gonza Go</b>
				<IconButton
					aria-label="Cerrar"
					size="small"
					onClick={closeSideNav}
					className="md:!hidden ml-auto bg-orange-100 text-orange-600 hover:bg-orange-200"
				>
					<Close fontSize="small" />
				</IconButton>
			</header>
			<Stack
				spacing={0.6}
				direction="column"
				className="px-4 py-5 overflow-y-auto"
			>
				<Suspense fallback={<SideSkeleton />}>
					<SideNavItem />
				</Suspense>
			</Stack>
			<footer className="mt-auto px-5 py-4 border-t border-emerald-100/70 bg-white/60 text-xs text-slate-500">
				<span className="font-medium text-slate-600">
					© {new Date().getFullYear()} Gonza
				</span>
			</footer>
		</aside>
	);
}
