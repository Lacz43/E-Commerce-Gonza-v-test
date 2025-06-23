import { useEffect, useState, type ReactNode, useCallback } from "react";
import axios from "axios";

// PaginationResponse: tipo object que contiene la respuesta de la api
// T: tipo de los items
// K: tipo string con el nombre del objeto de la api
// se usa Record porque la api devuelve un objeto con una propiedad que es un objeto inderminado con la informacion de la pagina
type PaginationResponse<T, K extends string> = Record<K, paginateResponse<T>>;

// Props: tipo object que contiene las propiedades del componente
export type InfiniteScrollProps<T, K extends string> = {
	url: string;
	className?: string;
	transformResponse: (
		data: PaginationResponse<T, K>,
	) => PaginationResponse<T, K>[K]; //[K] es para que se pueda usar el nombre del objeto de la api
	children: {
		card: (item: T) => ReactNode;
		loading: ReactNode;
	};
};

// GenericInfiniteScroll: Tipo generico de InfiniteScrollProps para defenir elementos react
export type GenericInfiniteScroll = <T, K extends string>(
	props: InfiniteScrollProps<T, K>,
) => React.ReactElement | null;

// url: tipo string que contiene la url de la api
// children: tipo function que recibe un array de items y devuelve un ReactNode
// transformResponse: tipo function que recibe un objeto de la api y devuelve un objeto con los datos transformados
// classname: clases heredadas
export default function InfiniteScroll<T, K extends string>({
	url,
	children,
	transformResponse,
	className,
	...props
}: InfiniteScrollProps<T, K>) {
	const [items, setItems] = useState<T[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const loadMoreItems = useCallback(async () => {
		if (loading || !hasMore) return;

		setLoading(true);
		try {
			const { data } = await axios.get(url, { params: { page: page } });
			const obj = transformResponse(data);

			setItems([...items, ...obj.data]); // añade los items cargados a un array
			setPage((prev) => prev + 1);
			setHasMore(obj.current_page < obj.last_page); // esto rivisa si hay los suficientes elementos para seguir la carga
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}, [url, loading, hasMore, page, transformResponse, items]);

	useEffect(() => {
		if (!hasMore) return;
		const handleScroll = () => {
			// funcion para detectar posicion del scroll
			if (
				window.innerHeight + Number(document.documentElement.scrollTop) >=
				document.documentElement.offsetHeight - 100
			) {
				loadMoreItems();
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [loadMoreItems, hasMore]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		loadMoreItems();
	}, []);

	return (
		<div {...props} className={`${className}`}>
			{typeof children.card === "function" && items.length > 0 ? (
				items.map((item) => children.card(item))
			) : (
				<div className="text-center text-gray-500">No hay productos</div>
			)}
			{loading && children.loading}
		</div>
	);
}
