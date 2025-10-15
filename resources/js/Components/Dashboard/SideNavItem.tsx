import { Link, usePage } from "@inertiajs/react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Collapse, Divider } from "@mui/material";
import Button, { type ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { paths, type Route } from "@/paths";
import PermissionGate from "../PermissionGate";

interface ColorButtonProps extends ButtonProps {
	selected: boolean;
}

const NavButton = styled(Button)<ColorButtonProps>(({ selected }) => {
	const activeBg = "linear-gradient(135deg, #059669 0%, #10b981 100%)";
	const activeColor = "#ffffff";
	const inactiveColor = "#064e3b";

	return {
		color: selected ? activeColor : inactiveColor,
		background: selected ? activeBg : "transparent",
		width: "100%",
		justifyContent: "start",
		padding: "0.65rem 1rem",
		boxShadow: selected ? "0 4px 12px rgba(5, 150, 105, 0.25)" : "none",
		textTransform: "none",
		fontWeight: selected ? 600 : 500,
		fontSize: "0.9rem",
		letterSpacing: "0.3px",
		borderRadius: 10,
		transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
		position: "relative",
		overflow: "hidden",
		"&:hover": {
			background: selected ? activeBg : "rgba(5, 150, 105, 0.08)",
			color: selected ? activeColor : "#047857",
			transform: "translateX(2px)",
			boxShadow: selected
				? "0 6px 16px rgba(5, 150, 105, 0.3)"
				: "0 2px 8px rgba(5, 150, 105, 0.1)",
		},
		"&:active": {
			transform: "scale(0.98)",
		},
		"& .MuiButton-startIcon": {
			color: selected ? activeColor : "#059669",
			marginRight: "12px",
			transition: "transform 0.3s ease",
		},
		"&:hover .MuiButton-startIcon": {
			transform: "scale(1.1)",
		},
		"& .MuiButton-endIcon": {
			marginLeft: "auto",
			color: selected ? activeColor : "#059669",
			transition: "transform 0.3s ease",
		},
	};
});

function subPath(url: string) {
	if (!url) return [];
	const urls = new URL(route(url));
	return urls.pathname.split("/").filter(Boolean);
}

interface NavItemProps {
	routeKey: string;
	route: Route;
	active: string;
	toggle: string;
}

function NavItem({ route: routeConfig, active, toggle }: NavItemProps) {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setIsOpen(active === subPath(routeConfig.path)[0]);
	}, [active, routeConfig.path]);

	if (routeConfig.hide) return null;

	const isActive = active === subPath(routeConfig.path)[0];
	const hasChildren =
		routeConfig.children && Object.keys(routeConfig.children).length > 0;

	return (
		<PermissionGate
			roles={routeConfig?.roles}
			permission={routeConfig?.permissions}
		>
			<div className="relative">
				{!hasChildren ? (
					<Link href={route(routeConfig.path)}>
						<NavButton
							variant="contained"
							startIcon={routeConfig.icon}
							selected={isActive}
						>
							{routeConfig.name}
						</NavButton>
					</Link>
				) : (
					<>
						<NavButton
							variant="contained"
							startIcon={routeConfig.icon}
							endIcon={
								<KeyboardArrowDownIcon
									style={{
										transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
										transition: "transform 0.3s ease",
									}}
								/>
							}
							selected={isActive}
							onClick={() => setIsOpen(!isOpen)}
						>
							{routeConfig.name}
						</NavButton>
						<Collapse in={isOpen} timeout={300}>
							<div className="ml-4 mt-2 pl-4 border-l-2 border-emerald-200 space-y-1">
								{routeConfig.children &&
									Object.entries(routeConfig.children).map(
										([key, childRoute]) => (
											<PermissionGate
												key={key}
												roles={childRoute?.roles}
												permission={childRoute?.permissions}
											>
												<Link href={route(childRoute.path)}>
													<NavButton
														startIcon={childRoute.icon ?? null}
														selected={active === subPath(childRoute.path)[0] && toggle === subPath(childRoute.path)[1]}
													>
														{childRoute.name}
													</NavButton>
												</Link>
											</PermissionGate>
										),
									)}
							</div>
						</Collapse>
					</>
				)}
				{routeConfig.divider && (
					<Divider className="!my-3 !border-emerald-200/60" />
				)}
			</div>
		</PermissionGate>
	);
}

export default function SideNavItem() {
	const [active, setActive] = useState("");
	const [toggle, setToggle] = useState("");
	const { url } = usePage();

	useEffect(() => {
		const path = url.split("/").filter(Boolean);
		setActive(path[0]);
		if (path[1]) setToggle(path[1].split("?")[0]);
	}, [url]);

	// Renderizar automáticamente todas las rutas desde paths
	return (
		<>
			{Object.entries(paths).map(([key, route]) => (
				<NavItem
					key={key}
					routeKey={key}
					route={route}
					active={active}
					toggle={toggle}
				/>
			))}
		</>
	);
}
