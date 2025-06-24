import { Head, Link } from "@inertiajs/react";
import { Button } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { lazy, memo, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import type { tableProps } from "@/Components/DataTable";
import PermissionGate from "@/Components/PermissionGate";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const DataTable = lazy(() => import("@/Components/DataTable"));
const ModalDelete = lazy(() => import("@/Components/ModalDelete"));

type Props = {
	products: paginateResponse<Item>;
};

const WrapperDataTable = memo((props: Omit<tableProps<Item>, "columns">) => {
	const columns = useMemo<GridColDef[]>(
		() => [
			{ field: "id", headerName: "ID" },
			{ field: "name", headerName: "Producto" },
			{
				field: "barcode",
				headerName: "Codigo de barras",
				width: 150,
			},
			{
				field: "price",
				headerName: "Precio",
				valueGetter: (_value, row) => `${row.price} $`,
			},
			{
				field: "description",
				headerName: "Descripción",
				width: 300,
			},
		],
		[],
	);
	return (
		<Suspense fallback={<div>Esperando...</div>}>
			<DataTable {...props} columns={columns} />
		</Suspense>
	);
});

export default function Products({ products }: Props) {
	const [product, setProduct] = useState(products);
	const [selected, setSelect] = useState<null | number>(null);
	const [loading, setLoading] = useState(false);

    useEffect(() => {
        setProduct(products);
    }, [products]);

	async function HandleDelete(id: number) {
		setLoading(true);
		try {
			axios.delete(route("products.delete", id));
			setLoading(false);
			setSelect(null);
			setProduct((prev) => ({
				...prev,
				data: prev.data.filter((item) => item.id !== id),
			}));
		} catch (e) {
			console.log(e);
		}
	}

	const handleDeleteClick = useCallback((id: number) => setSelect(id), []);

	const onEditConfig = useMemo(
		() => ({
			permissions: ["edit products"],
			hook: (id: number) => console.log("Edit:", id),
		}),
		[],
	);

	const onShowConfig = useMemo(
		() => ({
			permissions: ["show products"],
			hook: (id: number) => console.log("Show:", id),
		}),
		[],
	);

	const onDeleteConfig = useMemo(
		() => ({
			permissions: ["delete products"],
			hook: handleDeleteClick,
		}),
		[handleDeleteClick],
	);

	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					Products
				</h2>
			}
		>
			<Head title="Productos" />

			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="flex justify-end mb-3 mx-3">
						<PermissionGate permission={["create products"]}>
							<Link href={route("products.create")}>
								<Button variant="contained" size="small">
									<b>Nuevo</b>
								</Button>
							</Link>
						</PermissionGate>
					</div>
					<div className="overflow-hidden bg-white shadow-lg sm:rounded-lg">
						<div className="p-6 text-gray-900">
							<WrapperDataTable
								response={product}
								onEdit={onEditConfig}
								onDelete={onDeleteConfig}
								onShow={onShowConfig}
							/>
						</div>
					</div>
				</div>
			</div>
			<Suspense>
				<ModalDelete
					show={selected !== null}
					setOpen={() => setSelect(null)}
					id={selected}
					loading={loading}
					title={products.data.find((f) => f.id === selected)?.name ?? ""}
					onDeleteConfirm={HandleDelete}
				/>
			</Suspense>
		</AuthenticatedLayout>
	);
}
