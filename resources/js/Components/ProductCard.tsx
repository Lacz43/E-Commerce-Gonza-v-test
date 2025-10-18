import { usePage } from "@inertiajs/react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import axios from "axios";
import type { HTMLAttributes } from "react";
import {
	useCallback,
	useId,
	useOptimistic,
	useState,
	useTransition,
} from "react";
import ProductDetailsModal from "@/Components/Modals/ProductDetailsModal";
import { useModal } from "@/Context/Modal";
import { imageUrl } from "@/utils";
import { useGeneralSettings } from "@/Hook/useGeneralSettings";

type CardProps = HTMLAttributes<HTMLDivElement> & {
	item: Item;
	addCart: (item: Item) => void;
};

export default function ProductCard({
	item,
	className = "",
	addCart,
	...props
}: CardProps) {
	const { openModal } = useModal();
	const { auth } = usePage().props as any;
	const reviewInputId = useId();
	const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
	const [selectedRating, setSelectedRating] = useState(
		item.average_rating || 0,
	);
	const [reviewText, setReviewText] = useState("");
	const [existingReviewId, setExistingReviewId] = useState<number | null>(null);
	const [_isPending, startTransition] = useTransition();
	const [optimisticAverage, setOptimisticAverage] = useOptimistic(
		selectedRating,
		(_state, newValue: number) => newValue,
	);
	const { settings } = useGeneralSettings();

	const handleRatingClick = useCallback(async () => {
		if (!auth.user) return;
		try {
			const { data: reviews } = await axios.get(
				`/products/${item.id}/reviews?user_id=${auth.user.id}`,
			);
			if (reviews.length > 0) {
				const userReview = reviews[0];
				setSelectedRating(userReview.rating);
				setReviewText(userReview.review || "");
				setExistingReviewId(userReview.id);
			} else {
				setSelectedRating(5);
				setReviewText("");
				setExistingReviewId(null);
			}
		} catch (error) {
			console.error("Error fetching reviews:", error);
		}
		setReviewDialogOpen(true);
	}, [auth.user, item.id]);

	const handleSubmitReview = useCallback(async () => {
		startTransition(() => {
			setOptimisticAverage(selectedRating);
		});
		try {
			if (existingReviewId) {
				await axios.put(`/products/reviews/${existingReviewId}`, {
					rating: selectedRating,
					review: reviewText,
				});
			} else {
				await axios.post(`/products/${item.id}/reviews`, {
					product_id: item.id,
					rating: selectedRating,
					review: reviewText,
				});
			}
			setReviewDialogOpen(false);
			setReviewText("");
			// Keep optimistic value
		} catch (error) {
			console.error("Error submitting review:", error);
			// On error, revert
			startTransition(() => {
				setOptimisticAverage(item.average_rating || 0);
			});
		}
	}, [
		item.id,
		selectedRating,
		reviewText,
		setOptimisticAverage,
		startTransition,
		item.average_rating,
		existingReviewId,
	]);

	if (!item?.default_image) return null;

	const priceFormatted =
		typeof item.price === "number" ? item.price.toFixed(2) : item.price;

	const handleOpenModal = () => {
		openModal(({ closeModal }) => (
			<ProductDetailsModal
				productId={Number(item.id)}
				closeModal={closeModal}
			/>
		));
	};
	return (
		<div {...props} className={`relative group ${className}`}>
			{/* Card surface con efectos mejorados */}
			<div className="relative flex flex-col h-full rounded-2xl bg-white border-2 border-orange-100/50 shadow-lg hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
				{/* Media con overlay mejorado */}
				<div
					className="relative w-full h-64 overflow-hidden cursor-pointer bg-gradient-to-br from-orange-50 to-emerald-50"
					onClick={() => handleOpenModal()}
				>
					<img
						src={imageUrl(item.default_image.image)}
						alt={item.name || "Producto"}
						className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
						loading="lazy"
					/>
					{/* Overlay con gradiente */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
					{/* Badge de nuevo (opcional) */}
					<div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-orange-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
						✨ Ver detalles
					</div>
				</div>

				{/* Content */}
				<div className="flex flex-col p-5 mt-auto">
					<div className="flex items-start justify-between gap-3 mb-3">
						<h3 className="text-lg font-bold tracking-tight text-slate-800 line-clamp-2 group-hover:text-orange-600 transition-colors">
							{item.name}
						</h3>
						{/* Dynamic rating mejorado */}
						<div
							className={`flex items-center gap-0.5 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200/50 ${auth.user ? "cursor-pointer hover:bg-amber-100 transition-colors" : ""}`}
							onClick={() => handleRatingClick()}
						>
							{Array.from({ length: 5 }).map((_, i) => (
								<StarIcon
									key={i}
									fontSize="small"
									className={
										i < Math.floor(optimisticAverage || 0)
											? "text-amber-500"
											: "text-slate-300"
									}
								/>
							))}
							{optimisticAverage > 0 && (
								<span className="ml-1 text-xs font-bold text-amber-700">
									{optimisticAverage.toFixed(1)}
								</span>
							)}
						</div>
					</div>

					<div className="flex items-baseline gap-2 mb-3">
						<span className="text-3xl font-black bg-gradient-to-r from-orange-600 to-emerald-600 bg-clip-text text-transparent">
							{priceFormatted}
						</span>
						<span className="text-sm font-medium text-slate-500">{settings.currency === "VES" ? "Bs" : "USD"}</span>
					</div>

					{item.description && (
						<p className="text-sm leading-relaxed text-slate-600 line-clamp-2 mb-4">
							{item.description}
						</p>
					)}

					{/* Placeholder extra details section (añade/activa cuando tengas datos) */}
					{/*
					<div className="mt-5 grid grid-cols-2 gap-4 text-xs text-slate-500">
						<div>
							<span className="block font-medium text-slate-400">Código</span>
							<span className="text-slate-700">{item.barcode || '—'}</span>
						</div>
						<div>
							<span className="block font-medium text-slate-400">Stock</span>
							<span className="text-slate-700">{(item as any).stock ?? '—'}</span>
						</div>
					</div>
					<div className="mt-3 flex flex-wrap gap-2">
						<span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-orange-50 text-orange-600">Nuevo</span>
						<span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-green-50 text-green-600">Eco</span>
						<span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-600">Top</span>
					</div>
					*/}

					<button
						type="button"
						onClick={() =>
							addCart({
								id: item.id,
								default_image: item.default_image,
								name: item.name,
								price: item.price,
								barcode: item.barcode,
							} as Item)
						}
						className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-emerald-500 hover:from-orange-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group-hover:scale-105"
					>
						<ShoppingCartIcon fontSize="small" />
						Añadir al Carrito
					</button>
				</div>
			</div>

			{/* Review Dialog */}
			<Dialog
				open={reviewDialogOpen}
				onClose={() => setReviewDialogOpen(false)}
				PaperProps={{
					className: "rounded-2xl border-2 border-orange-100/50 shadow-2xl",
				}}
			>
				<DialogTitle className="text-center pb-2">
					<h3 className="text-xl font-extrabold bg-gradient-to-r from-orange-600 to-emerald-600 bg-clip-text text-transparent mb-1">
						Deja tu reseña para
					</h3>
					<p className="text-slate-700 font-semibold">{item.name}</p>
				</DialogTitle>
				<DialogContent className="px-6 pb-4">
					<div className="flex items-center justify-center gap-1 mb-6 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/50">
						{Array.from({ length: 5 }).map((_, i) => (
							<StarIcon
								key={i}
								fontSize="large"
								className={`cursor-pointer transition-colors duration-200 ${i < selectedRating ? "text-amber-500 hover:text-amber-600" : "text-slate-300 hover:text-amber-400"}`}
								onClick={() => setSelectedRating(i + 1)}
							/>
						))}
						<span className="ml-3 text-sm font-semibold text-slate-700">
							{selectedRating} estrella{selectedRating !== 1 ? "s" : ""}
						</span>
					</div>
					<div className="space-y-3">
						<label
							htmlFor={reviewInputId}
							className="block text-sm font-bold text-slate-600"
						>
							📝 Reseña (opcional)
						</label>
						<TextField
							id={reviewInputId}
							multiline
							rows={4}
							fullWidth
							value={reviewText}
							onChange={(e) => setReviewText(e.target.value)}
							placeholder="Comparte tu opinión sobre este producto..."
							variant="outlined"
							sx={{
								"& .MuiOutlinedInput-root": {
									backgroundColor: "rgb(255 247 237)",
									borderRadius: "0.75rem",
									border: "2px solid rgb(253 230 138 / 0.5)",
									"& fieldset": {
										border: "none",
									},
									"&:hover": {
										backgroundColor: "rgb(255 237 213)",
										borderColor: "rgb(253 230 138)",
									},
									"&.Mui-focused": {
										backgroundColor: "rgb(255 237 213)",
										borderColor: "rgb(249 115 22)",
									},
								},
							}}
						/>
					</div>
				</DialogContent>
				<DialogActions className="px-6 pb-6 flex gap-3">
					<button
						type="button"
						onClick={() => setReviewDialogOpen(false)}
						className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-200"
					>
						Cancelar
					</button>
					<button
						type="button"
						onClick={handleSubmitReview}
						className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-emerald-500 hover:from-orange-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
					>
						Enviar Reseña
					</button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
