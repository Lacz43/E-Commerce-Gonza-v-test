import {
	Category,
	Home,
	Inventory,
	ShoppingCart,
	Person,
	Settings,
} from "@mui/icons-material";
import type { JSX } from "react";

interface Route {
	// mover a otro archivo
	path: string;
	name: string;
	icon?: JSX.Element;
	hide?: boolean;
	children?: Record<string, Route>;
	params?: Record<string, string>;
	permissions?: string[];
	roles?: string[];
}

// rutas del sitio
export const paths: Record<string, Route> = {
	home: {
		path: "dashboard",
		name: "Principal",
		icon: <Home />,
	},
	ecommerce: {
		path: "welcome",
		name: "Ecommerce",
		icon: <ShoppingCart />,
	},
	auth: {
		path: "",
		hide: true,
		name: "Autentificar",
		children: {
			login: {
				path: "login",
				name: "Login",
			},
			register: {
				path: "register",
				name: "Regitrar",
			},
		},
	},
	products: {
		path: "products.index",
		name: "Productos",
		icon: <Category />,
		roles: ["admin"],
		children: {
			register: {
				path: "products.index",
				name: "Registro",
			},
			category: {
				path: "products.categories.index",
				name: "Categorias",
			},
			brands: {
				path: "products.brands.index",
				name: "Marcas",
			},
		},
	},
	inventory: {
		path: "inventory.index",
		name: "Inventario",
		icon: <Inventory />,
		roles: ["admin"],
		children: {
			index: {
				path: "inventory.index",
				name: "Gestión",
			},
			history: {
				path: "inventory.movements.index",
				name: "Historial de Movimientos",
			},
		},
	},
	users: {
		path: "users.index",
		name: "Usuarios",
		icon: <Person />,
		roles: ["admin"],
		children: {
			index: {
				path: "users.index",
				name: "Gestión",
			},
			activities: {
				path: "users.activities",
				name: "Bitácora",
			},
			sessions: {
				path: "users.sessions",
				name: "Sesiones",
			},
		},
	},
	settings: {
		path: "backup.index",
		name: "Configuracion",
		icon: <Settings />,
		roles: ["admin"],
		children: {
			backup: {
				path: "backup.index",
				name: "Respaldo y Restauracion",
			},
		},
	},
};
