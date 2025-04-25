import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { paths } from "@/paths";

import { styled } from "@mui/material/styles";
import Button, { type ButtonProps } from "@mui/material/Button";
import { blue } from "@mui/material/colors";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Stack } from "@mui/material";

interface ColorButtonProps extends ButtonProps {
	active?: boolean;
}

const ColorButton = styled(Button)<ColorButtonProps>(({ theme, active }) => ({
	color: theme.palette.getContrastText(blue[500]),
	backgroundColor: active ? blue[900] : "#00000000",
	width: "100%",
	justifyContent: "start",
	padding: "0.5rem 1.5rem",
	boxShadow: "none",
	textTransform: "none",
	"&:hover": {
		backgroundColor: blue[900],
	},
	"& .MuiButton-endIcon": {
		marginLeft: "auto",
	},
}));

export default function SideNavItem() {
	const [active, setActive] = useState("");

	useEffect(() => {
		// obtner el path actual
		const path = window.location.pathname.split("/").filter(Boolean);
		setActive(path[0]); // setear el path actual (solo el primer elemento)
	}, []);

	const list = Object.entries(paths).map(([clave, valor]) => {
		const [display, setDisplay] = useState(false);

		if (valor.hide === true) return;
		return (
			<div key={clave}>
				{!valor.children ? (
					<Link href={route(valor.path)}>
						<ColorButton
							variant="contained"
							startIcon={valor.icon}
							active={active === valor.path}
						>
							{valor.name}
						</ColorButton>
					</Link>
				) : (
					<>
						<ColorButton
							variant="contained"
							startIcon={valor.icon}
							endIcon={
								<KeyboardArrowDownIcon
									className={display ? "rotate-180" : "rotate-0"}
								/>
							}
							active={active === valor.path}
							onClick={() => {
								setDisplay(!display);
							}}
						>
							{valor.name}
						</ColorButton>
						<Stack
							direction="column"
							spacing={0.5}
							display={"none"}
							className={`ml-5 mt-1 border border-blue-900 p-1 rounded-md menu-item ${display ? "visible" : ""}`}
						>
							{Object.entries(valor.children).map(([key, value]) => (
								<Link key={key} href={route(value.path)}>
									<ColorButton startIcon={valor.icon}>{value.name}</ColorButton>
								</Link>
							))}
						</Stack>
					</>
				)}
			</div>
		);
	});

	return <>{list}</>;
}
