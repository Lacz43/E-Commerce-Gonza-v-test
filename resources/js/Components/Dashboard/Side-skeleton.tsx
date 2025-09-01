import { Skeleton, Stack } from "@mui/material";

export default function SideSkeleton() {
	return (
		<Stack
			spacing={0.6}
			direction="column"
			className="px-4 py-5 overflow-y-auto"
		>
			{Array.from({ length: 8 }).map((_, i) => (
				<Skeleton
					key={`side-skel-${i}-5`}
					variant="rounded"
					height={50}
					animation="wave"
					className="!bg-orange-100/40"
				/>
			))}
		</Stack>
	);
}
