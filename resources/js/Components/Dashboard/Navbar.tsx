import Dropdown from "@/Components/Dropdown";
import { usePage } from "@inertiajs/react";
import { Menu } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Avatar from "@/Components/Avatar";

export default function Navbar() {
	const user = (usePage().props as unknown as Auth).auth.user;

	function openSideNav() {
		const sideNav = document.getElementById("side-nav");
		if (sideNav) sideNav.classList.add("show-sideNav");
	}

	return (
		<nav className="border-b border-gray-300 bg-white">
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
									<IconButton>
										<Avatar>{user.name}</Avatar>
									</IconButton>
								</Dropdown.Trigger>

								<Dropdown.Content>
									<Dropdown.Link href={route("profile.edit")}>
										Profile
									</Dropdown.Link>
									<Dropdown.Link
										href={route("logout")}
										method="post"
										as="button"
									>
										Log Out
									</Dropdown.Link>
								</Dropdown.Content>
							</Dropdown>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
