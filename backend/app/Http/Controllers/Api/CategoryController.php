<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\Api\CategoryResource;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('officeSpace')->get();
        return CategoryResource::collection($categories);
    }

    public function show(Category $category)
    {
        $category->load(['officeSpace.category', 'officeSpace.city', 'officeSpace.photos']);
        $category->loadCount('officeSpace');
        return new CategoryResource($category);
    }
}