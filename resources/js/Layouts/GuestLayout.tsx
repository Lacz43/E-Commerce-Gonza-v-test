import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import type { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
	return (
		<div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
			<div className="bg-white p-10 items-center flex flex-col rounded-lg border border-gray-400 w-100 shadow-2xl">
				<div className="mb-8">
					<Link href="/">
						<ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
					</Link>
				</div>

				{children}
			</div>
		</div>
	);
}
