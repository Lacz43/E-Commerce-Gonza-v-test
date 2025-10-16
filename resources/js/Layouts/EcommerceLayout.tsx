import type { PropsWithChildren } from "react";
import { useLayoutEffect, useRef } from "react";
import Navbar from "@/Components/Navbar";

export default function Ecommerce({ children }: PropsWithChildren) {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const navRef = useRef<HTMLDivElement | null>(null);

	// Establecer la altura de la barra de navegación
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
			className="flex min-h-screen flex-col items-center bg-gradient-to-br from-orange-50/40 via-white to-emerald-50/40 relative"
		>
			{/* Efectos de fondo decorativos sutiles */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
				<div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
				<div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse delay-1000"></div>
				<div className="absolute top-1/2 right-1/3 w-80 h-80 bg-amber-100/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-500"></div>
			</div>

			{/* Navbar fija siempre visible */}
			<nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-md border-b border-orange-100/50">
				<Navbar ref={navRef} />
			</nav>

			{/* Contenido principal con padding-top para compensar navbar fija */}
			<main
				className="w-full flex-1 flex flex-col items-center relative z-10"
				style={{ paddingTop: "var(--navbar-h, 64px)" }}
			>
				{children}
			</main>
		</div>
	);
}
