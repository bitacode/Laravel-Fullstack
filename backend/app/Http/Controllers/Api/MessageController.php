<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\Api\MessageResource;
use Illuminate\Http\Request;
use App\Models\Message;

class MessageController extends Controller
{

    public function store(StoreMessageRequest $request) {
        $validatedData = $request->validated();

        $unrepliedMessage = Message::where('email', $request->email)->where('is_replied', false)->first();

        if ($unrepliedMessage) {
            return response()->json([
                'error' => 'You have already submitted a message. Please wait for our response.'
            ], 422);
        }

        $validatedData['is_replied'] = false;
        $validatedData['ip_address'] = $request->ip();

        $message = Message::create($validatedData);

        return new MessageResource($message);
    }

}
