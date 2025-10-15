import type { PropsWithChildren, ReactNode } from "react";
import Navbar from "@/Components/Dashboard/Navbar";
import SideNav from "@/Components/Dashboard/Side-nav";
import "../../css/dashboard.css";

export default function Authenticated({
	header,
	children,
}: PropsWithChildren<{ header?: ReactNode }>) {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-orange-50/20">
			<SideNav />
			<div className="md:ml-[20rem] min-h-screen flex flex-col">
				<Navbar />
				
				{/* Header opcional con diseño moderno */}
				{/*header && (
					<header className="bg-white/80 backdrop-blur-md border-b border-emerald-200/50 shadow-sm sticky top-0 z-50">
						<div className="mx-auto max-w-7xl px-6 py-5">
							<div className="flex flex-col gap-2">
								<div className="flex items-center justify-between">
									<div className="flex flex-col">
										{header}
									</div>
								</div>
							</div>
						</div>
					</header>
				)*/}

				{/* Main content con mejor padding y animación */}
				<main className="flex-1 p-6 animate-fadeIn">
					<div className="mx-auto max-w-7xl">
						{children}
					</div>
				</main>

				{/* Footer opcional */}
				<footer className="mt-auto py-4 px-6 bg-white/60 backdrop-blur-sm border-t border-emerald-200/50">
					<div className="mx-auto max-w-7xl">
						<p className="text-center text-sm text-gray-600">
							© {new Date().getFullYear()} GonzaGo. Todos los derechos reservados.
						</p>
					</div>
				</footer>
			</div>
		</div>
	);
}
