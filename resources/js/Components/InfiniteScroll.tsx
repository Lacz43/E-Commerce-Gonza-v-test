import {
	useEffect,
	useState,
	type ReactNode,
	type HTMLAttributes,
	useCallback,
} from "react";
import axios from "axios";

type Props = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
	url: string;
	response: (data: any) => any;
	children: {
		card: (item: Item) => ReactNode;
		loading: ReactNode;
	};
};

// url: tipo string que contiene la url de la api
// children: tipo function que recibe un array de items y devuelve un ReactNode
// classname: clases heredadas

export default function InfiniteScroll({
	url,
	children,
	response,
	className,
	...props
}: Props) {
	const [items, setItems] = useState<Item[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const loadMoreItems = useCallback(async () => {
		if (loading || !hasMore) return;

		setLoading(true);
		try {
			const { data } = await axios.get(url, { params: { page: page } });
			const obj = response(data);

			setItems((prev) => [...prev, ...obj.data]); // añade los items cargados a un array
			setPage((prev) => prev + 1);
			setHasMore(obj.current_page < obj.last_page); // esto rivisa si hay los suficientes elementos para seguir la carga
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}, [url, loading, hasMore, page, response]);

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
