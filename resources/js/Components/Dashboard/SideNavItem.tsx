import { Link, usePage } from "@inertiajs/react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Stack } from "@mui/material";
import Button, { type ButtonProps } from "@mui/material/Button";
import { green } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { paths } from "@/paths";
import PermissionGate from "../PermissionGate";

interface ColorButtonProps extends ButtonProps {
	selected: boolean;
}

const ColorButton = styled(Button)<ColorButtonProps>(({ theme, selected }) => {
	const activeBg = green[900];
	const hoverBg = green[800];
	return {
		color: selected ? theme.palette.getContrastText(activeBg) : green[900],
		backgroundColor: selected ? activeBg : "transparent",
		width: "100%",
		justifyContent: "start",
		padding: "0.55rem 1.25rem",
		boxShadow: "none",
		textTransform: "none",
		fontWeight: selected ? 600 : 500,
		fontSize: ".92rem",
		letterSpacing: ".25px",
		borderRadius: 7,
		transition: "background-color .25s, color .25s, box-shadow .25s",
		"&:hover": {
			backgroundColor: selected ? activeBg : `${hoverBg}22`, // subtle tint when not selected
			color: selected ? theme.palette.getContrastText(activeBg) : green[900],
		},
		"& .MuiButton-startIcon": {
			color: selected ? theme.palette.getContrastText(activeBg) : green[700],
		},
		"& .MuiButton-endIcon": {
			marginLeft: "auto",
			color: selected ? theme.palette.getContrastText(activeBg) : green[600],
			transition: "transform .3s",
		},
	};
});

function subPath(url: string) {
	if (!url) return [];
	const urls = new URL(route(url));
	return urls.pathname.split("/").filter(Boolean);
}

export default function SideNavItem() {
	const [active, setActive] = useState("");
	const [toggle, setToggle] = useState("");
	const { url } = usePage();

	useEffect(() => {
		// obtner el path actual
		const path = url.split("/").filter(Boolean);
		setActive(path[0]); // setear el path actual (solo el primer elemento)
		if (path[1]) setToggle(path[1].split("?")[0]);
	}, [url]);

	const list = Object.entries(paths).map(([clave, valor]) => {
		const [display, setDisplay] = useState(false);
		useEffect(() => {
			// revisa que la ruta q se abra este activa si es selecionada esto solo cuando cambien "active"
			setDisplay(active === subPath(valor.path)[0]);
		}, [active]);

		if (valor.hide === true) return null;
		return (
			<div key={clave}>
				<PermissionGate roles={valor?.roles} permission={valor?.permissions}>
					{!valor.children ? (
						<Link href={route(valor.path)}>
							<ColorButton
								variant="contained"
								startIcon={valor.icon}
								selected={active === subPath(valor.path)[0]}
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
								selected={active === subPath(valor.path)[0]}
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
								className={`ml-5 mt-1 border border-green-800/60 p-1 rounded-lg menu-item bg-green-50/40 ${display ? "visible" : ""}`}
							>
								{Object.entries(valor.children).map(([key, value]) => (
									<PermissionGate
										key={key}
										roles={value?.roles}
										permission={value?.permissions}
									>
										<Link href={route(value.path)}>
											<ColorButton
												startIcon={value.icon ?? null}
												selected={subPath(value.path)[1] === toggle}
											>
												{value.name}
											</ColorButton>
										</Link>
									</PermissionGate>
								))}
							</Stack>
						</>
					)}
				</PermissionGate>
			</div>
		);
	});

	return <>{list}</>;
}
