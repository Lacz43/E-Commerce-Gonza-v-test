import { Link, usePage } from "@inertiajs/react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { IconButton, type IconButtonProps } from "@mui/material";
import Badge, { badgeClasses } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Avatar from "@/Components/Avatar";
import { useModal } from "@/Context/Modal";
import { paths } from "@/paths";
import shoppingCart from "@/shoppingCart";
import CartModal from "./CartModal";

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

const AvatarIcon = styled(IconButton)<IconButtonProps>(() => ({
	padding: "0",
}));

export default function Navbar({ ref }: { ref?: React.Ref<HTMLDivElement> }) {
	const { openModal } = useModal();
	const user = (usePage().props as unknown as Auth).auth.user;
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
		<div
			ref={ref}
			className="bg-white w-full px-5 py-2 max-md:py-1 sm:px-20 sticky top-0 z-50 mb-4 flex justify-end items-center shadow-xl"
		>
			<div className="mr-auto">
				<IconButton
					id="shopping-cart"
					onClick={() =>
						openModal(({ closeModal }) => <CartModal onClose={closeModal} />)
					}
				>
					<ShoppingCartIcon />
					<CartBadge badgeContent={total} color="primary" overlap="circular" />
				</IconButton>
			</div>
			<ul className="flex gap-4">
				{!user ? (
					<>
						<li>
							<Link href={route(paths.auth.children?.login.path ?? "")}>
								{paths.auth.children?.login.name}
							</Link>
						</li>
						<li>
							<Link href={route(paths.auth.children?.register.path ?? "")}>
								{paths.auth.children?.register.name}
							</Link>
						</li>
					</>
				) : (
					<Link href={route(paths.home.path)}>
						<AvatarIcon>
							<Avatar>{user.name}</Avatar>
						</AvatarIcon>
					</Link>
				)}
			</ul>
		</div>
	);
}
