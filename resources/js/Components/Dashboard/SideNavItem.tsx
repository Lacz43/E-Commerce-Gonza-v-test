import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { paths } from "@/paths";

import { styled } from "@mui/material/styles";
import Button, { type ButtonProps } from "@mui/material/Button";
import { blue } from "@mui/material/colors";

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
		if (valor.hide === true) return;
		return (
			<Link key={clave} href={route(valor.path)}>
				<ColorButton
					variant="contained"
					startIcon={valor.icon}
					active={active === valor.path}
				>
					{valor.name}
				</ColorButton>
			</Link>
		);
	});

	return <>{list}</>;
}
