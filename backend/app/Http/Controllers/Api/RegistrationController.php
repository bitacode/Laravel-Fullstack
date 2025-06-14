<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRegistrationRequest;
use App\Http\Resources\Api\RegistrationResource;
use App\Models\Registration;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class RegistrationController extends Controller
{

    public function store(StoreRegistrationRequest $request)
    {
        $validatedData = $request->validated();

        $validatedData['is_approved'] = false;

        $registration = Registration::create($validatedData);

        return new RegistrationResource($registration);

    }

}
