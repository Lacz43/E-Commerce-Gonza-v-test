import { Link } from "@inertiajs/react";
import { IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function Navbar() {
	return (
		<div className="bg-white w-full px-5 py-2 sm:px-20 sticky top-0 z-1000 mb-4 flex justify-end items-center">
			<div className="mr-auto">
				<IconButton id="shopping-cart">
					<ShoppingCartIcon />
				</IconButton>
			</div>
			<ul className="flex gap-4">
				<li>
					<Link href="/login">Login</Link>
				</li>
				<li>
					<Link href="/register">Register</Link>
				</li>
			</ul>
		</div>
	);
}
