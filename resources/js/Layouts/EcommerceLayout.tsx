import ApplicationLogo from "@/Components/ApplicationLogo";
import Navbar from "@/Components/Navbar";
import { Link } from "@inertiajs/react";
import { useState, lazy, Suspense, type PropsWithChildren } from "react";

const CartModal = lazy(() => import("@/Components/CartModal"));

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

			<Suspense>
				<CartModal show={open} setOpen={setOpen} />
			</Suspense>
		</div>
	);
}
