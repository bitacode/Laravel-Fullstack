<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\CityResource;
use App\Models\City;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function index()
    {
        $cities = City::withCount('officeSpace')->paginate(3);

        return response()->json([
            'data' => CityResource::collection($cities),
            'next_page_url' => $cities->nextPageUrl(),
            'current_page' => $cities->currentPage(),
            'last_page' => $cities->lastPage()
        ]);
    }

    public function show(City $city)
    {
        $city->load(['officeSpace.city', 'officeSpace.category', 'officeSpace.photos']);
        $city->loadCount('officeSpace');
        return new CityResource($city);
    }
}
