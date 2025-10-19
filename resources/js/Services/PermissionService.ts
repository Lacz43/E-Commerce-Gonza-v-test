import axios from 'axios';

interface UserPermissions {
    permissions: string[];
    roles: string[];
}

class PermissionService {
    private static instance: PermissionService;
    private readonly STORAGE_KEY = 'user_permissions';

    private constructor() {}

    public static getInstance(): PermissionService {
        if (!PermissionService.instance) {
            PermissionService.instance = new PermissionService();
        }
        return PermissionService.instance;
    }

    public async fetchPermissions(): Promise<void> {
        try {
            const response = await axios.get<UserPermissions>(route('user.permissions'));
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(response.data));
        } catch (error) {
            console.error('Error fetching permissions:', error);
            throw error;
        }
    }

    public async refreshPermissions(): Promise<void> {
        await this.fetchPermissions();
    }

    public clearPermissions(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    private getStoredPermissions(): UserPermissions | null {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    }

    public hasPermission(permissions: string[]): boolean {
        if(permissions.length === 0) return true;
        const stored = this.getStoredPermissions();
        if (!stored?.permissions || !Array.isArray(permissions)) return false;
        return permissions.some(permission => stored.permissions.includes(permission));
    }

    public hasRole(roles: string[]): boolean {
        const stored = this.getStoredPermissions();
        if (!stored?.roles || !Array.isArray(roles)) return false;
        return roles.some(role => stored.roles.includes(role));
    }

    public roles(): string[] {
        const stored = this.getStoredPermissions();
        return stored?.roles || [];
    }

    public permissions(): string[] {
        const stored = this.getStoredPermissions();
        return stored?.permissions || [];
    }
}

export default PermissionService;
