import { Link } from "@inertiajs/react";
import { IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge, { badgeClasses } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import shoppingCart from "@/shoppingCart";

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

export default function Navbar({ openCar }: { openCar?: () => void }) {
	const [total, setTotal] = useState(0);

	function updateQuantity() {
		const cart = new shoppingCart();
		setTotal(cart.items.reduce((cur, sum) => cur + (sum.quantity ?? 1), 0));
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		updateQuantity();
		addEventListener("addCart", () => {
			updateQuantity();
		});
		return () => removeEventListener("addCart", () => {});
	}, []);

	return (
		<div className="bg-white w-full px-5 py-2 max-md:py-1 sm:px-20 sticky top-0 z-50 mb-4 flex justify-end items-center shadow-xl">
			<div className="mr-auto">
				<IconButton id="shopping-cart" onClick={() => openCar?.()}>
					<ShoppingCartIcon />
					<CartBadge badgeContent={total} color="primary" overlap="circular" />
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
