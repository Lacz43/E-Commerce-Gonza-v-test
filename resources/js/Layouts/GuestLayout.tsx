import { Link } from "@inertiajs/react";
import type { PropsWithChildren } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { useGeneralSettings } from "@/Hook/useGeneralSettings";
import { imageUrl } from "@/utils";

export default function Guest({ children }: PropsWithChildren) {
	const { settings } = useGeneralSettings();
	return (
		<div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
			<div className="bg-white p-10 items-center flex flex-col rounded-lg border border-gray-400 w-100 shadow-2xl">
				<div className="mb-8">
					<Link href="/">
						{settings.company_logo_url ? (
							<img
								src={imageUrl(settings.company_logo_url)}
								alt={`Logo de ${settings.company_name}`}
								className="h-50 w-50 object-contain"
							/>
						) : (
							<ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
						)}
					</Link>
				</div>

				{children}
			</div>
		</div>
	);
}
