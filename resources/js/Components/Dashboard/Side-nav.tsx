import { Close } from "@mui/icons-material";
import ApplicationLogo from "../ApplicationLogo";
import SideNavItem from "./SideNavItem";
import { Stack } from "@mui/material";

export default function SideNav() {
	function closeSideNav() {
		const sideNav = document.getElementById("side-nav");
		if (sideNav) sideNav.classList.remove("show-sideNav");
	}
	return (
		<aside
			className="w-[20rem] bg-[#121621] text-white flex flex-col z-1100 fixed top-0 h-screen side-nav max-sm:w-full"
			id="side-nav"
		>
			<header className="p-5 border-b border-b-gray-500 flex justify-center">
				<ApplicationLogo />
				<b className="ml-2">Gonza Go</b>
				<div className="md:hidden ml-auto">
					<Close onClick={() => closeSideNav()} />
				</div>
			</header>
			<Stack spacing={0.4} direction="column" className="px-4 py-4">
				<SideNavItem />
			</Stack>
			<footer className="border-t border-t-gray-500 p-3 mt-auto">footer</footer>
		</aside>
	);
}
