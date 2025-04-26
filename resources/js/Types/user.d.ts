declare interface User {
	id: number;
	name: string;
	email: string;
	email_verified_at?: string;
	roles: [
		{
			id: number;
			name: string;
			permissions: [
				{
					id: number;
					name: string;
				},
			];
		},
	];
}

declare interface Auth {
	auth: {
		user: User;
		roles: string[];
		permissions: string[];
	};
}
