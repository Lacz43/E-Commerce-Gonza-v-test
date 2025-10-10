import axios from "axios";
import { useEffect, useState } from "react";

interface GeneralSettings {
	company_name: string;
	company_logo_url: string | null;
	company_phone: string;
	company_address: string;
	company_email: string;
}

export function useGeneralSettings() {
	const [settings, setSettings] = useState<GeneralSettings>({
		company_name: "Gonza Go",
		company_logo_url: null,
		company_phone: "",
		company_address: "",
		company_email: "",
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSettings = async () => {
			try {
				const response = await axios.get(route("settings.public"));
				setSettings(response.data);
			} catch (error) {
				console.warn("Could not load general settings:", error);
				// Keep default values if API fails
			} finally {
				setLoading(false);
			}
		};

		fetchSettings();
	}, []);

	return { settings, loading };
}
