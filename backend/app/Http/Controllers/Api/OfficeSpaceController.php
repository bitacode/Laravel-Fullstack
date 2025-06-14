<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\OfficeSpaceResource;
use App\Models\OfficeSpace;
use Illuminate\Http\Request;

class OfficeSpaceController extends Controller
{
    public function index()
    {
        $officeSpaces = OfficeSpace::with(['city', 'category', 'user', 'registration'])->paginate(3);
        
        return response()->json([
            'data' => OfficeSpaceResource::collection($officeSpaces),
            'next_page_url' => $officeSpaces->nextPageUrl(),
        ]);
    }

    public function show(OfficeSpace $officeSpace)
    {
        $officeSpace->load(['city', 'category', 'photos', 'benefits', 'contacts', 'user', 'registration']);
        return new OfficeSpaceResource($officeSpace);
    }
}
