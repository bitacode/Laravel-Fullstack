<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\Api\VoucherResource;
use App\Http\Controllers\Controller;
use App\Models\Voucher;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VoucherController extends Controller
{
    public function voucher_details(Request $request)
    {
        $request->validate([
            'unique_code' => 'required|string'
        ]);

        $voucher = Voucher::where('unique_code', $request->unique_code)->first();

        if (!$voucher) {
            return response()->json(['message' => 'Voucher not found or expired'], 404);
        }

        return new VoucherResource($voucher);
    }

}