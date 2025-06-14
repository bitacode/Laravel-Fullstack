<?php

namespace App\Http\Middleware;

use App\Models\ApiKey;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CheckApiKey
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $apiKey = $request->header('X-API-KEY');
            Log::info('Received X-API-KEY: ' . ($apiKey ?? 'NULL'));
            
            if (!$apiKey) {
                Log::warning('Missing X-API-KEY header');
                return response()->json(['message' => 'Unauthorized'], 401);
            }
            
            $keyRecord = ApiKey::where('key', $apiKey)->whereNull('deleted_at')->first();
            Log::info('Key Record: ' . json_encode($keyRecord));
            
            if (!$keyRecord) {
                Log::warning('Invalid API key: ' . $apiKey);
                return response()->json(['message' => 'Unauthorized or expired key'], 403);
            }

            $request->merge(['api_key_role' => $keyRecord->role]);
            return $next($request);
        } catch (\Exception $e) {
            Log::error('CheckApiKey Error: ' . $e->getMessage());
            return response()->json(['error' => 'Server Error'], 500);
        }
    }
}
