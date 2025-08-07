import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

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
			<>
				<Toaster position="top-right"/>
				<ModalProvider>
					<App {...props} />
				</ModalProvider>
			</>,
		);
	},
	progress: {
		color: "#4B5563",
	},
});
