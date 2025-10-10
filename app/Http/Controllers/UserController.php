<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\QueryFilters;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $users = (new QueryFilters($request))->apply(
            User::query()
                ->with('roles')
                ->withCount('roles')
        );

        $filtersAvailable = User::getFilterableFields();
        $sortAvailable = User::getSortableFields();

        return Inertia::render('User/Index', [
            'users' => $users,
            'filtersAvailable' => $filtersAvailable,
            'sortAvailable' => $sortAvailable,
        ]);
    }

    public function roles()
    {
        return Role::all();
    }

    public function permissions()
    {
        $user = Auth::user();
        return response()->json([
            'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
            'roles' => $user->getRoleNames()->toArray(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['nullable', 'integer', 'exists:roles,id'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]);

        if (!empty($validated['role'])) {
            $role = Role::find($validated['role']);
            if ($role) {
                $user->assignRole($role);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Usuario creado exitosamente',
            'user' => $user->load('roles'),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'string', 'min:6'],
            'role' => ['nullable', 'integer', 'exists:roles,id'],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        if (!empty($validated['password'])) {
            $user->password = $validated['password'];
        }
        $user->save();

        // Prevenir cambio de roles para el propio usuario o usuario principal
        if (array_key_exists('role', $validated)) {
            $currentRoleId = $user->roles->first()?->id;

            // Solo bloquear si realmente se está cambiando el rol
            $roleChanging = $currentRoleId !== $validated['role'];

            if ($roleChanging) {
                // No permitir cambiar roles del propio usuario
                if (auth()->check() && $user->id === auth()->id()) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'No puedes modificar tus propios permisos/roles',
                    ], 403);
                }

                // No permitir cambiar roles del usuario principal (ID 1)
                if ($user->id === 1) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'No se pueden modificar los permisos del usuario principal del sistema',
                    ], 403);
                }
            }

            if ($validated['role']) {
                $role = Role::find($validated['role']);
                if ($role) {
                    $user->syncRoles([$role]);
                }
            } else {
                $user->syncRoles([]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Usuario actualizado exitosamente',
            'user' => $user->load('roles'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Usuario eliminado exitosamente',
        ]);
    }
}
