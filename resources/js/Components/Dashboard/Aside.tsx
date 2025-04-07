import ApplicationLogo from "../ApplicationLogo";

export default function Aside() {
	return (
		<aside className="w-[23rem] bg-[#121621] text-white flex flex-col max-md:hidden">
			<header className="p-5 border-b border-b-gray-500 flex justify-center">
				<ApplicationLogo />
				<b className="ml-2">Gonza</b>
			</header>
			<div className="px-4 py-4">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste mollitia
				asperiores exercitationem sit voluptas fuga facere maxime sed voluptatum
				enim voluptates minima deserunt non vitae obcaecati optio ut, aliquid
				dolore.
			</div>
			<footer className="border-t border-t-gray-500 p-3 mt-auto">footer</footer>
		</aside>
	);
}
