"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("Loading...");
  const [loading, setLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [rentalDays, setRentalDays] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("demo-online");
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  async function loadProduct() {
    if (!id) {
      setMessage("Invalid product id");
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to load product");
        return;
      }

      setProduct(data.product);
      setSeller(data.seller);
      setMessage("");
    } catch {
      setMessage("Something went wrong");
    }
  }

  async function loadReviews() {
    if (!id) return;

    try {
      const res = await fetch(`/api/reviews/product/${id}`);
      const data = await res.json();

      if (res.ok) {
        setReviews(data.reviews || []);
      }
    } catch {}
  }

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  async function placeOrder(type) {
    if (!product) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          type,
          rentalDays: type === "rent" ? rentalDays : 0,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to place order");
        setLoading(false);
        return;
      }

      setMessage("Order placed successfully");
      loadProduct();
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function submitReview(e) {
    e.preventDefault();
    setReviewMessage("");

    try {
      const res = await fetch("/api/reviews/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setReviewMessage(data.message || "Failed to submit review");
        return;
      }

      setReviewMessage(data.message);
      setReviewForm({ rating: 5, comment: "" });
      loadReviews();
    } catch {
      setReviewMessage("Something went wrong");
    }
  }

  if (message && !product) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow">
          <p>{message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow">
        {product?.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="mb-6 h-72 w-full rounded-xl object-cover"
          />
        ) : (
          <div className="mb-6 flex h-72 w-full items-center justify-center rounded-xl bg-gray-200 text-gray-500">
            No Image
          </div>
        )}

        <h1 className="text-3xl font-bold">{product?.title}</h1>
        <p className="mt-3 text-gray-700">{product?.description}</p>

        <div className="mt-6 space-y-2">
          <p>Category: {product?.category}</p>
          <p>Rent Price: ₹{product?.rentPrice}</p>
          <p>Buy Price: ₹{product?.buyPrice}</p>
          <p>Deposit: ₹{product?.deposit}</p>
          <p>Stock: {product?.stock}</p>
          <p>Condition: {product?.condition}</p>
          <p>
            Seller: {seller?.name} {seller?.email ? `(${seller.email})` : ""}
          </p>
        </div>

        <div className="mt-6">
          <label className="mb-2 block">Rental Days</label>
          <input
            type="number"
            min="1"
            value={rentalDays}
            onChange={(e) => setRentalDays(e.target.value)}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="mt-4">
          <label className="mb-2 block">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full rounded-lg border p-3"
          >
            <option value="demo-online">Demo Online Payment</option>
            <option value="cash-on-delivery">Cash on Delivery</option>
          </select>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => placeOrder("rent")}
            disabled={loading}
            className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Rent Now"}
          </button>

          <button
            onClick={() => placeOrder("buy")}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Buy Now"}
          </button>
        </div>

        {message && <p className="mt-6 text-gray-700">{message}</p>}

        <hr className="my-8" />

        <h2 className="text-2xl font-bold">Write a Review</h2>
        <form onSubmit={submitReview} className="mt-4 space-y-4">
          <select
            value={reviewForm.rating}
            onChange={(e) =>
              setReviewForm((prev) => ({ ...prev, rating: e.target.value }))
            }
            className="w-full rounded-lg border p-3"
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Bad</option>
          </select>

          <textarea
            value={reviewForm.comment}
            onChange={(e) =>
              setReviewForm((prev) => ({ ...prev, comment: e.target.value }))
            }
            placeholder="Write your review"
            className="w-full rounded-lg border p-3"
            rows="4"
          />

          <button
            type="submit"
            className="rounded-lg bg-purple-600 px-5 py-2 text-white"
          >
            Submit Review
          </button>
        </form>

        {reviewMessage && <p className="mt-3 text-gray-700">{reviewMessage}</p>}

        <div className="mt-8">
          <h2 className="text-2xl font-bold">Reviews</h2>

          {reviews.length === 0 ? (
            <p className="mt-3 text-gray-600">No reviews yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="rounded-lg border p-4">
                  <p className="font-semibold">{review.userName}</p>
                  <p>Rating: {review.rating}/5</p>
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}