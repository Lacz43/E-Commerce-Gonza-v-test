import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { ThemeProvider } from "@mui/material/styles";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { theme } from "./theme";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

import { Toaster } from "react-hot-toast";
import { ModalProvider } from "./Context/Modal";

createInertiaApp({
	title: (title) => `${title} - ${appName}`,
	resolve: (name) =>
		resolvePageComponent(
			`./Pages/${name}.tsx`,
			import.meta.glob("./Pages/**/*.tsx"),
		),
	setup({ el, App, props }) {
		const root = createRoot(el);

		root.render(
			<ThemeProvider theme={theme}>
				<Toaster position="top-right" />
				<ModalProvider>
					<App {...props} />
				</ModalProvider>
			</ThemeProvider>,
		);
	},
	progress: {
		color: "#4B5563",
	},
});
