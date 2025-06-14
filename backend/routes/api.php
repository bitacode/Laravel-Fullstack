<?php

use App\Http\Controllers\Api\BookingTransactionController;
use App\Http\Controllers\Api\CityController;
use App\Http\Controllers\Api\OfficeSpaceController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\RegistrationController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\UsedVoucherController;
use App\Http\Controllers\Api\VoucherController;
use App\Models\ApiKey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/generate-guest-key', function (Request $request) {
    $ip = $request->ip();

    $existingKey = ApiKey::where('ip_address', $ip)
    ->where('role', 'guest')
    ->where('expires_at', '>', now())
    ->first();

    if ($existingKey) {
        return response()->json(['key' => $existingKey->key]);
    }

    $key = ApiKey::create([
        'name' => 'guest-' . Str::random(8),
        'key' => Str::random(40),
        'ip_address' => $ip,
        'role' => 'guest',
        'expires_at' => now()->addDays(7),
    ]);

    return response()->json(['key' => $key->key]);

});

Route::middleware(['api.key'])->get('/check-role', function (Request $request) {
    return response()->json([
        'role' => $request->input('api_key_role')
    ]);
});

Route::middleware('api.key')->group(function () {
    Route::get('/city/{city:slug}', [CityController::class, 'show']);
    Route::apiResource('/cities', CityController::class);

    Route::get('/category/{category:slug}', [CategoryController::class, 'show']);
    Route::apiResource('/categories', CategoryController::class);
    
    Route::get('/office/{officeSpace:slug}', [OfficeSpaceController::class, 'show']);
    Route::apiResource('/offices', OfficeSpaceController::class);

    Route::post('/booking-transaction', [BookingTransactionController::class, 'store']);
    Route::post('/check-booking', [BookingTransactionController::class, 'booking_details']);
    
    Route::post('/send-message', [MessageController::class, 'store']);
    
    Route::post('/report', [ReportController::class, 'store']);

    Route::post('/register', [RegistrationController::class, 'store']);

});

