import ApplicationLogo from "@/Components/ApplicationLogo";
import Navbar from "@/Components/Navbar";
import { Link } from "@inertiajs/react";
import { useState, type PropsWithChildren } from "react";
import CartModal from "@/Components/CartModal";

export default function Ecommerce({ children }: PropsWithChildren) {
	const [open, setOpen] = useState(false);

	return (
		<div className="flex min-h-screen flex-col items-center bg-gray-100 sm:justify-center sm:pt-0">
			<Navbar openCar={() => setOpen(true)} />
			<div>
				<Link href="/">
					<ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
				</Link>
			</div>

			{children}

			<CartModal show={open} setOpen={setOpen} />
		</div>
	);
}
