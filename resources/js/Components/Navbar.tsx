import { Link } from "@inertiajs/react";

export default function Navbar() {
	return (
		<div className="bg-white w-full px-5 py-5 sm:px-20 sticky top-0 z-1000 mb-4 items-end flex justify-end">
			<ul className="flex gap-4">
				<li>
					<Link href="/login">Login</Link>
				</li>
				<li><Link href="/register">Register</Link></li>
			</ul>
		</div>
	);
}
