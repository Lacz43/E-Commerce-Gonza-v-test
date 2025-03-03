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
	children: {
		card: (item: Item) => ReactNode;
		loading: ReactNode;
	};
};

// url: tipo string que contiene la url de la api
// children: tipo function que recibe un array de items y devuelve un reactNode

export default function InfiniteScroll({
	url,
	children,
	className,
	...props
}: Props) {
	const [items, setItems] = useState<Item[]>([]);
	const [loading, setLoading] = useState(false);
	// const [page, _setPage] = useState(1);

	const loadMoreItems = useCallback(async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(url);
			setItems((prev) => [...prev, ...data.products]);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}, [url]);

	useEffect(() => {
		const handleScroll = () => { // funcion para detectar posicion del scroll
			if (
				window.innerHeight + Number(document.documentElement.scrollTop) >=
				document.documentElement.offsetHeight - 100
			) {
				loadMoreItems();
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [loadMoreItems]);

	useEffect(() => {
		loadMoreItems();
	}, [loadMoreItems]);

	if (loading) {
		return children.loading;
	}

	return (
		<div {...props} className={`${className}`}>
			{typeof children.card === "function" && items.length > 0 ? (
				items.map((item) => children.card(item))
			) : (
				<div className="text-center text-gray-500">No items found</div>
			)}
		</div>
	);
}
