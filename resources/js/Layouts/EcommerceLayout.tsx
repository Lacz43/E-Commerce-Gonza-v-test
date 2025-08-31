import type { PropsWithChildren } from "react";
import { useLayoutEffect, useRef } from "react";
import Navbar from "@/Components/Navbar";

export default function Ecommerce({ children }: PropsWithChildren) {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const navRef = useRef<HTMLDivElement | null>(null);

	useLayoutEffect(() => {
		function setNavHeight() {
			const h = navRef.current?.offsetHeight || 0;

			document.documentElement.style.setProperty("--navbar-h", `${h}px`);
			if (rootRef.current)
				rootRef.current.style.setProperty("--navbar-h", `${h}px`);
		}
		setNavHeight();
		window.addEventListener("resize", setNavHeight);
		return () => window.removeEventListener("resize", setNavHeight);
	}, []);

	return (
		<div
			ref={rootRef}
			className="flex min-h-screen flex-col items-center bg-gray-100"
		>
			<Navbar ref={navRef} />
			{children}
		</div>
	);
}
