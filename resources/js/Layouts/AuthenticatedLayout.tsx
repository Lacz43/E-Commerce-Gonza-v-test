import type { PropsWithChildren, ReactNode } from "react";
import Navbar from "@/Components/Dashboard/Navbar";
import SideNav from "@/Components/Dashboard/Side-nav";
import "../../css/dashboard.css";

export default function Authenticated({
	header,
	children,
}: PropsWithChildren<{ header?: ReactNode }>) {
	return (
		<div className="bg-gray-100 flex h-full">
			<SideNav />
			<div className="w-full sm:ml-[20rem]">
				<Navbar />
				{/* {header && ( */}
				{/* 	<header className="bg-white shadow"> */}
				{/* 		<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"> */}
				{/* 			{header} */}
				{/* 		</div> */}
				{/* 	</header> */}
				{/* )} */}

				<main>{children}</main>
			</div>
		</div>
	);
}
