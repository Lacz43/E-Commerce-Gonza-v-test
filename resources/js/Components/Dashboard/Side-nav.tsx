import { Link } from "@inertiajs/react";
import { Close } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { lazy, Suspense } from "react";
import { useGeneralSettings } from "@/Hook/useGeneralSettings";
import { imageUrl } from "@/utils";
import ApplicationLogo from "../ApplicationLogo";
import SideSkeleton from "./Side-skeleton";

const SideNavItem = lazy(() => import("./SideNavItem"));

export default function SideNav() {
	const { settings } = useGeneralSettings();

	function closeSideNav() {
		const sideNav = document.getElementById("side-nav");
		if (sideNav) sideNav.classList.remove("show-sideNav");
	}

	return (
		<aside
			id="side-nav"
			className="w-[20rem] max-sm:w-full fixed top-0 h-screen z-1100 flex flex-col side-nav bg-gradient-to-br from-emerald-50/80 via-white to-orange-50/80 text-slate-700 border-r border-emerald-200/50 shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl"
		>
			<header className="relative flex items-center gap-3 px-6 py-5 border-b border-emerald-200/50 bg-gradient-to-r from-white/90 to-emerald-50/50 backdrop-blur-sm">
				<Link href="/" className="flex items-center gap-3">
					{settings.company_logo_url ? (
						<img
							src={imageUrl(settings.company_logo_url)}
							alt="Logo de la empresa"
							className="h-12 w-12 object-contain rounded-lg shadow-sm"
						/>
					) : (
						<ApplicationLogo />
					)}
					<div className="flex flex-col">
						<b className="font-bold text-lg tracking-tight text-slate-800 leading-tight">
							{settings.company_name}
						</b>
						<span className="text-xs text-emerald-600 font-medium">
							Panel de Control
						</span>
					</div>
				</Link>
				<IconButton
					aria-label="Cerrar"
					size="small"
					onClick={closeSideNav}
					className="md:!hidden ml-auto bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
				>
					<Close fontSize="small" />
				</IconButton>
			</header>
			<Stack
				spacing={0.5}
				direction="column"
				className="px-4 py-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-transparent"
			>
				<Suspense fallback={<SideSkeleton />}>
					<SideNavItem />
				</Suspense>
			</Stack>
			<footer className="mt-auto px-6 py-4 border-t border-emerald-200/50 bg-gradient-to-r from-white/90 to-emerald-50/50 backdrop-blur-sm">
				<div className="flex flex-col gap-1">
					<span className="text-xs font-semibold text-emerald-700">
						{settings.company_name}
					</span>
					<span className="text-[10px] text-slate-500">
						© {new Date().getFullYear()} Todos los derechos reservados
					</span>
				</div>
			</footer>
		</aside>
	);
}
