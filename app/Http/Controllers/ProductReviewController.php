<?php

namespace App\Http\Controllers;

use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProductReviewController extends Controller
{
    /**
     * Store a newly created review in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'review' => 'nullable|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $userId = Auth::id();

        $existingReview = ProductReview::where('product_id', $request->product_id)
            ->where('user_id', $userId)
            ->first();

        if ($existingReview) {
            return response()->json(['message' => 'Ya has dejado una reseña para este producto.'], 422);
        }

        $review = ProductReview::create([
            'product_id' => $request->product_id,
            'user_id' => $userId,
            'review' => $request->review,
            'rating' => $request->rating,
        ]);

        return response()->json($review, 201);
    }

    /**
     * Update the specified review in storage.
     */
    public function update(Request $request, ProductReview $review)
    {
        if ($review->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $request->validate([
            'review' => 'nullable|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $review->update([
            'review' => $request->review,
            'rating' => $request->rating,
        ]);

        return response()->json($review);
    }

    /**
     * Remove the specified review from storage.
     */
    public function destroy(ProductReview $review)
    {
        if ($review->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'Reseña eliminada.']);
    }

    /**
     * Get reviews for a product.
     */
    public function index(Request $request, \App\Models\Product $product)
    {
        $reviews = ProductReview::with('user:id,name')
            ->where('product_id', $product->id);

        if ($request->has('user_id')) {
            $reviews->where('user_id', $request->query('user_id'));
        }

        $reviews = $reviews->get();

        return response()->json($reviews);
    }
}
