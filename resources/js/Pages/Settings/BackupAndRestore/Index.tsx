import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function BackupAndRestore() {
	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					Backup and Restore
				</h2>
			}
		>
			<Head title="Backup and Restore" />
			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="flex justify-end mb-3 mx-3"></div>
					<div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
						<div className="p-6 text-gray-900"></div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
