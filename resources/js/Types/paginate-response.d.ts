declare interface paginateResponse<T> {
	current_page: number;
	data: [T];
	first_page_url: string;
	from: number;
	last_page: number;
	last_page_url: string;
	links: [
		{
			url:  string | URL;
			label: string;
			active: boolean;
		},
	];
	next_page_url: null | string;
	path: string;
	per_page: number;
	prev_page_url: null | string;
	to: number;
	total: number;
}
