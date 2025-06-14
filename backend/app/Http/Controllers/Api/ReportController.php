<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReportControllerRequest;
use App\Http\Resources\Api\ReportResource;
use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index()
    {
        $reports = Report::with('bookingTransaction')->get();
        return ReportResource::collection($reports);
    }

    public function store(StoreReportControllerRequest $request)
    {
        $validated = $request->validated();

        if (empty($validated['name'])) {
            $validated['name'] = 'report-' . (Report::withTrashed()->count() + 1);
        }

        $validated['is_traced'] = false;

        $report = Report::create($validated);

        return new ReportResource($report->load('bookingTransaction'));
    }

    public function getByBookingTrx($bookingTransactionId)
    {
        $reports = Report::with('bookingTransaction')->where('booking_transaction_id', $bookingTransactionId)->get();

        if ($reports->isEmpty()) {
            return response()->json([
                'message' => 'No reports found for this booking transaction.',
            ], 404);
        }
        return ReportResource::collection($reports);
    }
}