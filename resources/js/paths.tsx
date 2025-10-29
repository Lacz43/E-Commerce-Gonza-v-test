import {
	BarChart,
	Category,
	Home,
	Inventory,
	Person,
	Receipt,
	Settings,
} from "@mui/icons-material";
import type { JSX } from "react";

/**
 * Route configuration interface
 */
export interface Route {
	path: string;
	name: string;
	icon?: JSX.Element;
	hide?: boolean;
	children?: Record<string, Route>;
	params?: Record<string, string>;
	permissions?: string[];
	roles?: string[];
	group?: string; // Para agrupar rutas visualmente
	divider?: boolean; // Para agregar un divisor después de esta ruta
}

/**
 * Rutas del sitio
 * Las rutas se listan automáticamente en el side navigation
 */
export const paths: Record<string, Route> = {
	home: {
		path: "dashboard",
		name: "Principal",
		icon: <Home />,
		group: "main",
		roles: ["admin"],
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
				name: "Registrar",
			},
		},
	},
	products: {
		path: "products.index",
		name: "Productos",
		icon: <Category />,
		roles: ["admin", "seller"],
		group: "management",
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
		roles: ["admin", "seller"],
		group: "management",
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
		group: "management",
		children: {
			index: {
				path: "users.index",
				name: "Gestión",
			},
			sessions: {
				path: "users.sessions",
				name: "Sesiones",
			},
		},
	},
	orders: {
		path: "orders.index",
		name: "Pedidos",
		icon: <Receipt />,
		roles: ["admin", "seller"],
		group: "operations",
		divider: true,
	},
	userOrders: {
		path: "user.orders",
		name: "Mis Pedidos",
		icon: <Receipt />,
		roles: [], // Solo visible para usuarios sin roles específicos
		group: "user",
	},
	reports: {
		path: "reports.sales",
		name: "Reportes",
		icon: <BarChart />,
		roles: ["admin"],
		group: "analytics",
		children: {
			sales: {
				path: "reports.sales",
				name: "Reportes de Ventas",
			},
			inventory: {
				path: "reports.inventory",
				name: "Reportes de Inventario",
			},
			movements: {
				path: "reports.movements",
				name: "Reportes de Movimientos",
			},
		},
	},
	settings: {
		path: "backup.index",
		name: "Configuración",
		icon: <Settings />,
		roles: ["admin"],
		group: "system",
		children: {
			general: {
				path: "settings.general",
				name: "General",
			},
			order: {
				path: "settings.order",
				name: "Órdenes",
			},
			paymentMethods: {
				path: "payment-methods.index",
				name: "Métodos de Pago",
			},
			backup: {
				path: "backup.index",
				name: "Respaldo y Restauracion",
			},
			activities: {
				path: "settings.activities",
				name: "Bitácora",
			},
		},
	},
};
