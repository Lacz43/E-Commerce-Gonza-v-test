import {
	useEffect,
	useState,
	type ReactNode,
	type HTMLAttributes,
	useCallback,
} from "react";
import axios from "axios";

type PaginationResponse<T, K extends string> = Record<K, {
  data: T[];
  current_page: number;
  last_page: number;
}>;

type Props<T, K extends string> = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
	url: string;
	transformResponse: (data: PaginationResponse<T, K>) => PaginationResponse<T, K>[K];
	children: {
		card: (item: T) => ReactNode;
		loading: ReactNode;
	};
};

// url: tipo string que contiene la url de la api
// children: tipo function que recibe un array de items y devuelve un ReactNode
// classname: clases heredadas

export default function InfiniteScroll<T, K extends string>({
	url,
	children,
	transformResponse,
	className,
	...props
}: Props<T, K>) {
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

			setItems((prev) => [...prev, ...obj.data]); // añade los items cargados a un array
			setPage((prev) => prev + 1);
			setHasMore(obj.current_page < obj.last_page); // esto rivisa si hay los suficientes elementos para seguir la carga
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}, [url, loading, hasMore, page, transformResponse]);

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

	if (loading) {
		return children.loading;
	}

	return (
		<div {...props} className={`${className}`}>
			{typeof children.card === "function" && items.length > 0 ? (
				items.map((item) => children.card(item))
			) : (
				<div className="text-center text-gray-500">No hay productos</div>
			)}
		</div>
	);
}
