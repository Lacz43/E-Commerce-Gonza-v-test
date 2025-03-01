import ApplicationLogo from "@/Components/ApplicationLogo";
import Navbar from "@/Components/Navbar";
import { Link } from "@inertiajs/react";
import type { PropsWithChildren } from "react";

export default function Ecommerce({ children }: PropsWithChildren) {
	return (
		<div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <Navbar/>
			<div>
				<Link href="/">
					<ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
				</Link>
			</div>

			{children}
		</div>
	);
}
