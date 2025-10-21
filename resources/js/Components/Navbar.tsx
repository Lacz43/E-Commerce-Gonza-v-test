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
	background-color: rgba(93, 155, 5, 0.6);
  }
`;

const AvatarIcon = styled(IconButton)<IconButtonProps>(() => ({
	padding: "0",
}));

export default function Navbar({ ref }: { ref?: React.Ref<HTMLDivElement> }) {
	const { openModal } = useModal();
	const user = (usePage().props as unknown as Auth).auth.user;
	const [total, setTotal] = useState(0);
	const [scrolled, setScrolled] = useState(false);

	function updateQuantity() {
		const cart = new shoppingCart();
		setTotal(cart.items.reduce((cur, sum) => cur + (sum.quantity ?? 1), 0));
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		updateQuantity();
		addEventListener("addCart", () => {
			updateQuantity();
		});
		const onScroll = () => setScrolled(window.scrollY > 8);
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => {
			removeEventListener("addCart", () => {});
			window.removeEventListener("scroll", onScroll);
		};
	}, []);

	const wrapperBase =
		"w-full sticky top-0 z-50 backdrop-blur-sm transition-all duration-300 border-b";
	const wrapperStyle = scrolled
		? "bg-white/90 shadow-md border-orange-100/70 py-2"
		: "bg-white/60 shadow-sm border-transparent py-4";

	const linkBase =
		"text-sm font-medium tracking-wide text-slate-600 hover:text-slate-900 px-2 py-1 rounded-md transition-colors";

	return (
		<div ref={ref} className={`${wrapperBase} ${wrapperStyle}`}>
			<div className="w-full max-w-7xl mx-auto flex items-center gap-6 px-4">
				<div className="mr-auto flex items-center gap-2">
					<Link
						href={route(paths.home.path)}
						className="hidden sm:inline-flex items-center font-semibold text-slate-700 tracking-tight text-lg"
					>
						Gonza
					</Link>
					<IconButton
						id="shopping-cart"
						onClick={() =>
							openModal(({ closeModal }) => <CartModal onClose={closeModal} user={user} />)
						}
						size="small"
						className="relative group"
					>
						<ShoppingCartIcon className="transition-colors group-hover:text-emerald-600" />
						<CartBadge
							badgeContent={total}
							sx={{
								backgroundColor: "rgba(31, 71, 0, 1)",
							}}
							overlap="circular"
						/>
					</IconButton>
				</div>
				<ul className="flex items-center gap-2 sm:gap-4">
					{!user ? (
						<>
							<li>
								<Link
									className={linkBase}
									href={route(paths.auth.children?.login.path ?? "")}
								>
									{paths.auth.children?.login.name}
								</Link>
							</li>
							<li>
								<Link
									className={linkBase}
									href={route(paths.auth.children?.register.path ?? "")}
								>
									{paths.auth.children?.register.name}
								</Link>
							</li>
						</>
					) : (
						<li>
							<Link href={route(paths.home.path)} className="inline-flex">
								<AvatarIcon>
									<Avatar>{user.name}</Avatar>
								</AvatarIcon>
							</Link>
						</li>
					)}
				</ul>
			</div>
		</div>
	);
}
