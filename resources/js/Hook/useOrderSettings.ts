import axios from "axios";
import { useEffect, useState } from "react";

interface OrderSettings {
	max_payment_wait_time_hours: number | null;
	max_guest_orders_per_hour: number;
	max_guest_order_amount: number | null;
	max_guest_order_items: number | null;
}

// Global cache to load settings only once
let globalSettings: OrderSettings | null = null;
let globalLoading = true;
let fetchPromise: Promise<void> | null = null;
const subscribers = new Set<
	(settings: OrderSettings, loading: boolean) => void
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
					max_payment_wait_time_hours: 2,
					max_guest_orders_per_hour: 3,
					max_guest_order_amount: 1000.00,
					max_guest_order_items: 10,
				},
				globalLoading,
			);
		}
	}

	fetchPromise = axios
		.get(route("settings.order.public"))
		.then((response) => {
			globalSettings = response.data as OrderSettings;
			globalLoading = false;
			for (const callback of subscribers) {
				callback(globalSettings, globalLoading);
			}
		})
		.catch((error) => {
			console.warn("Could not load order settings:", error);
			globalLoading = false;
			const fallbackSettings = globalSettings || {
				max_payment_wait_time_hours: 2,
				max_guest_orders_per_hour: 3,
				max_guest_order_amount: 1000.00,
				max_guest_order_items: 10,
			};
			for (const callback of subscribers) {
				callback(fallbackSettings, globalLoading);
			}
		});

	return fetchPromise;
}

export function useOrderSettings() {
	const [settings, setSettings] = useState<OrderSettings>(
		globalSettings || {
			max_payment_wait_time_hours: 2,
			max_guest_orders_per_hour: 3,
			max_guest_order_amount: 1000.00,
			max_guest_order_items: 10,
		},
	);
	const [loading, setLoading] = useState(globalLoading);

	useEffect(() => {
		const callback = (newSettings: OrderSettings, newLoading: boolean) => {
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
