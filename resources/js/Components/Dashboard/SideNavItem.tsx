import { Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { paths } from "@/paths";

import { styled } from "@mui/material/styles";
import Button, { type ButtonProps } from "@mui/material/Button";
import { blue } from "@mui/material/colors";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Stack } from "@mui/material";
import PermissionGate from "../PermissionGate";

interface ColorButtonProps extends ButtonProps {
	selected: boolean;
}

const ColorButton = styled(Button)<ColorButtonProps>(({ theme, selected }) => ({
	color: theme.palette.getContrastText(blue[500]),
	backgroundColor: selected ? blue[900] : "#00000000",
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
		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		useEffect(() => {
			// revisa que la ruta q se abra este activa si es selecionada esto solo cuando cambien "active"
			setDisplay(active === subPath(valor.path)[0]);
		}, [active]);

		if (valor.hide === true) return;
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
								className={`ml-5 mt-1 border border-blue-900 p-1 rounded-md menu-item ${display ? "visible" : ""}`}
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
