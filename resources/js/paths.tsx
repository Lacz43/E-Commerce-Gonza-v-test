import { Home } from "@mui/icons-material";
import type { JSX } from "react";

interface Route {
	path: string | null;
	name: string;
	icon?: JSX.Element;
	children?: Record<string, Route>;
	params?: Record<string, string>;
	permissions?: string[];
}

export const paths: Record<string, Route> = {
	home: {
		path: "dashboard",
		name: "Principal",
        icon: <Home/>,
	},
	auth: {
		path: null,
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
};
