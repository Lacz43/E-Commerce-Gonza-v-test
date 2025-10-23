import { router, usePage } from "@inertiajs/react";
import { Menu } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Avatar from "@/Components/Avatar";
import Dropdown from "@/Components/Dropdown";
import usePermissions from "@/Hook/usePermissions";

export default function Navbar() {
	const user = (usePage().props as unknown as Auth).auth.user;
	const { clearPermissions } = usePermissions();

	function openSideNav() {
		const sideNav = document.getElementById("side-nav");
		if (sideNav) sideNav.classList.add("show-sideNav");
	}

	const handleLogout = () => {
		clearPermissions();
		router.post(route("logout"));
	};

	return (
		<nav className="border-b border-gray-300 bg-white sticky top-0 z-1000">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 justify-end">
					<div className="md:hidden mr-auto flex items-center">
						<IconButton onClick={() => openSideNav()}>
							<Menu />
						</IconButton>
					</div>
					<div className="sm:ms-6 flex sm:items-center">
						<div className="relative ms-3">
							<Dropdown>
								<Dropdown.Trigger>
									<button
										type="button"
										className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
									>
										<Avatar>{user.name}</Avatar>
										<div className="hidden md:flex flex-col items-start">
											<span className="text-sm font-semibold text-gray-900">
												{user.name}
											</span>
											<span className="text-xs text-gray-500">
												{user.email}
											</span>
										</div>
									</button>
								</Dropdown.Trigger>

								<Dropdown.Content>
									<div className="px-4 py-3 border-b border-gray-100">
										<p className="text-sm font-medium text-gray-900">
											{user.name}
										</p>
										<p className="text-xs text-gray-500 truncate">
											{user.email}
										</p>
									</div>
									<Dropdown.Link href={route("profile.edit")}>
										Perfil
									</Dropdown.Link>
									<button
										type="button"
										onClick={handleLogout}
										className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
									>
										Cerrar Sesión
									</button>
								</Dropdown.Content>
							</Dropdown>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
