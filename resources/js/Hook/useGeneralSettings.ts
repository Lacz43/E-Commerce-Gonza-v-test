import axios from "axios";
import { useEffect, useState } from "react";

interface GeneralSettings {
	company_name: string;
	company_logo_url: string | null;
	company_phone: string;
	company_address: string;
	company_email: string;
	currency: "VES" | "USD";
}

// Global cache to load settings only once
let globalSettings: GeneralSettings | null = null;
let globalLoading = true;
let fetchPromise: Promise<void> | null = null;
const subscribers = new Set<
	(settings: GeneralSettings, loading: boolean) => void
>();

function fetchSettings(force = false) {
	if (!force && fetchPromise) return fetchPromise;

	if (force) {
		fetchPromise = null;
		globalSettings = null;
		globalLoading = true;
		// Notify subscribers that we're reloading
		for (const callback of subscribers) {
			callback(
				globalSettings || {
					company_name: "Gonza Go",
					company_logo_url: null,
					company_phone: "",
					company_address: "",
					company_email: "",
					currency: "VES",
				},
				globalLoading,
			);
		}
	}

	fetchPromise = axios
		.get(route("settings.public"))
		.then((response) => {
			globalSettings = response.data as GeneralSettings;
			globalLoading = false;
			for (const callback of subscribers) {
				callback(globalSettings, globalLoading);
			}
		})
		.catch((error) => {
			console.warn("Could not load general settings:", error);
			globalLoading = false;
			const fallbackSettings = globalSettings || {
				company_name: "Gonza Go",
				company_logo_url: null,
				company_phone: "",
				company_address: "",
				company_email: "",
				currency: "VES",
			};
			for (const callback of subscribers) {
				callback(fallbackSettings, globalLoading);
			}
		});

	return fetchPromise;
}

export function useGeneralSettings() {
	const [settings, setSettings] = useState<GeneralSettings>(
		globalSettings || {
			company_name: "Gonza Go",
			company_logo_url: null,
			company_phone: "",
			company_address: "",
			company_email: "",
			currency: "VES",
		},
	);
	const [loading, setLoading] = useState(globalLoading);

	useEffect(() => {
		const callback = (newSettings: GeneralSettings, newLoading: boolean) => {
			setSettings(newSettings);
			setLoading(newLoading);
		};

		subscribers.add(callback);

		if (globalSettings === null && globalLoading) {
			fetchSettings();
		} else if (globalSettings) {
			setSettings(globalSettings);
			setLoading(false);
		}

		return () => {
			subscribers.delete(callback);
		};
	}, []);

	return { settings, loading, reload: () => fetchSettings(true) };
}
