declare interface User {
	id: number;
	name: string;
	email: string;
	email_verified_at?: string;
    roles: string[];
    permissions: string[];
}

declare interface Auth {
	auth: { user: User };
}
