import ApplicationLogo from "../ApplicationLogo";
import SideNavItem from "./SideNavItem";

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
