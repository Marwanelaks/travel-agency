<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/users",
     *     summary="List all users (SuperAdmin only)",
     *     tags={"User Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="List of users")
     * )
     */
    public function index()
    {
        \Illuminate\Support\Facades\Gate::authorize('viewAny', User::class);
        return User::with('roles')->paginate(20);
    }

    /**
     * @OA\Post(
     *     path="/api/users",
     *     summary="Create a new user (SuperAdmin or Seller)",
     *     tags={"User Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email","password","role"},
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="password", type="string", format="password"),
     *             @OA\Property(property="role", type="string", enum={"Seller","SuperAdmin","Random buyer"})
     *         )
     *     ),
     *     @OA\Response(response=201, description="User created")
     * )
     */
    public function store(Request $request)
    {
        \Illuminate\Support\Facades\Gate::authorize('create', User::class);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => ['required', Rule::in(['Seller', 'SuperAdmin', 'Random buyer'])],
        ]);
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);
        $user->assignRole($validated['role']);
        return response()->json($user->load('roles'), 201);
    }

    /**
     * @OA\Get(
     *     path="/api/users/{id}",
     *     summary="Get user details",
     *     tags={"User Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="User details")
     * )
     */
    public function show($id)
    {
        $user = User::with('roles')->findOrFail($id);
        $this->authorize('view', $user);
        return $user;
    }

    /**
     * @OA\Put(
     *     path="/api/users/{id}",
     *     summary="Update a user (SuperAdmin, Seller for own clients, self)",
     *     tags={"User Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="password", type="string", format="password"),
     *             @OA\Property(property="role", type="string", enum={"Seller","SuperAdmin","Random buyer"})
     *         )
     *     ),
     *     @OA\Response(response=200, description="User updated")
     * )
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $this->authorize('update', $user);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes','email',Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
            'role' => ['sometimes', Rule::in(['Seller', 'SuperAdmin', 'Random buyer'])],
        ]);
        if (isset($validated['name'])) $user->name = $validated['name'];
        if (isset($validated['email'])) $user->email = $validated['email'];
        if (isset($validated['password'])) $user->password = Hash::make($validated['password']);
        $user->save();
        if (isset($validated['role'])) {
            $user->syncRoles([$validated['role']]);
        }
        return response()->json($user->load('roles'));
    }

    /**
     * @OA\Delete(
     *     path="/api/users/{id}",
     *     summary="Delete a user (SuperAdmin, Seller for own clients)",
     *     tags={"User Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=204, description="User deleted")
     * )
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $this->authorize('delete', $user);
        $user->delete();
        return response()->json(null, 204);
    }

    /**
     * @OA\Post(
     *     path="/api/users/{id}/approve",
     *     summary="Approve a client (Seller only)",
     *     tags={"User Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="User approved")
     * )
     */
    public function approve($id)
    {
        $user = User::findOrFail($id);
        // Seller-specific approval logic (e.g., set status)
        $user->status = 'approved';
        $user->save();
        return response()->json($user);
    }

    /**
     * @OA\Get(
     *     path="/api/roles",
     *     summary="List available roles",
     *     tags={"User Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="List of roles")
     * )
     */
    public function roles()
    {
        return Role::all(['id', 'name']);
    }

    /**
     * Toggle the user's status between 'active' and 'inactive'.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        // Optionally: $this->authorize('update', $user);
        $user->status = $user->status === 'active' ? 'inactive' : 'active';
        $user->save();
        return response()->json($user);
    }
}
