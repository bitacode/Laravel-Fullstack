<?php

namespace Filament\Http\Middleware;

use App\Models\ApiKey;
use Closure;
use Filament\Facades\Filament;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class EnsureHasApiKey
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is(Filament::getLoginUrl())) {
            return $next($request);
        }
            
        $user = Filament::auth()->user();

        if (!$user) {
            return $this->cleanRedirect();
        }

        if($this->isAdminUser($user)) {
            session()->put('current_role', 'admin');
            return $next($request);
        }

        $apiKey = ApiKey::where('user_id', $user->id)
            ->where(function($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->whereNull('deleted_at')
            ->latest()
            ->first();

        if (!$apiKey) {
            return $this->cleanRedirect();
        }

        session()->put('current_role', $apiKey->role);
        $request->session()->save();

        return $next($request);

    }

    protected function isAdminUser($user): bool
    {
        if (!method_exists($user, 'apiKey')) {
            Log::error('User model missing apiKey relationship', ['user_id' => $user->id]);
            return false;
        }

        return $user->apiKey && $user->apiKey->role === 'admin' && $this->isKeyValid($user->apiKey);
    }

    protected function cleanRedirect()
    {
        Filament::auth()->logout();
        session()->invalidate();
        session()->regenerateToken();
        
        return redirect()->to(Filament::getLoginUrl())
            ->with('error', 'Access requires an active API key');
    }

    protected function isKeyValid(?ApiKey $apiKey): bool
    {
        if (!$apiKey) return false;
        
        return is_null($apiKey->expires_at) || $apiKey->expires_at > now();
    }
}