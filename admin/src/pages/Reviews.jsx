import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { Check, X, MessageSquareReply, Trash2, Star } from "lucide-react";

export default function Reviews() {
  const queryClient = useQueryClient();

  const [replyingReview, setReplyingReview] = useState(null);
  const [replyText, setReplyText] = useState("");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await API.get("/reviews");
      return res.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return await API.put(`/reviews/${id}/status`, { status });
    },
    onSuccess: () => {
      toast.success("Review status updated");
      queryClient.invalidateQueries(["reviews"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update review status");
    },
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, reply }) => {
      return await API.post(`/reviews/${id}/reply`, { reply });
    },
    onSuccess: () => {
      toast.success("Reply posted successfully");
      queryClient.invalidateQueries(["reviews"]);
      setReplyingReview(null);
      setReplyText("");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to post reply");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await API.delete(`/reviews/${id}`);
    },
    onSuccess: () => {
      toast.success("Review deleted successfully");
      queryClient.invalidateQueries(["reviews"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete review");
    },
  });

  const handleApprove = (id) => {
    statusMutation.mutate({ id, status: "Approved" });
  };

  const handleReject = (id) => {
    statusMutation.mutate({ id, status: "Rejected" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenReplyModal = (review) => {
    setReplyingReview(review);
    setReplyText(review.reply || "");
  };

  const handlePostReply = (e) => {
    e.preventDefault();
    if (!replyText) return toast.error("Reply text cannot be empty");
    replyMutation.mutate({ id: replyingReview._id, reply: replyText });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Reviews & Moderation</h1>
        <p className="text-xs text-slate-400 mt-0.5">Approve, decline, or reply to customer product feedback logs.</p>
      </div>

      {/* Reviews Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6 overflow-hidden">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 w-[20%]">Product</th>
                  <th className="pb-3 w-[15%]">Author</th>
                  <th className="pb-3 w-[15%]">Rating</th>
                  <th className="pb-3 w-[30%]">Feedback</th>
                  <th className="pb-3 w-[10%]">Status</th>
                  <th className="pb-3 w-[10%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
                {reviews.length > 0 ? (
                  reviews.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50/50 align-top">
                      <td className="py-4 font-semibold text-slate-800">
                        {r.product?.title || "Unknown Product"}
                      </td>
                      <td className="py-4">
                        <div>
                          <span className="font-semibold text-slate-800">{r.customer.name}</span>
                          <span className="block text-xs text-slate-400">{r.customer.email}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4.5 h-4.5 ${
                                i < r.rating ? "fill-amber-400" : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <div>
                          <p className="text-slate-600 italic">"{r.comment}"</p>
                          {r.reply && (
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 mt-2 text-xs">
                              <strong className="text-indigo-600 font-bold block mb-1">Admin Reply:</strong>
                              <p className="text-slate-500 font-medium">"{r.reply}"</p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold inline-block ${
                            r.status === "Approved"
                              ? "bg-emerald-50 text-emerald-600"
                              : r.status === "Rejected"
                              ? "bg-rose-50 text-rose-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {r.status !== "Approved" && (
                            <button
                              onClick={() => handleApprove(r._id)}
                              className="p-1 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
                              title="Approve"
                            >
                              <Check className="w-4.5 h-4.5" />
                            </button>
                          )}
                          {r.status !== "Rejected" && (
                            <button
                              onClick={() => handleReject(r._id)}
                              className="p-1 rounded-lg hover:bg-rose-50 text-rose-500 transition-colors"
                              title="Decline"
                            >
                              <X className="w-4.5 h-4.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenReplyModal(r)}
                            className="p-1 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors"
                            title="Reply"
                          >
                            <MessageSquareReply className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(r._id)}
                            className="p-1 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No reviews found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyingReview && (
        <Modal
          isOpen={!!replyingReview}
          onClose={() => setReplyingReview(null)}
          title={`Reply to Review by ${replyingReview.customer.name}`}
        >
          <form onSubmit={handlePostReply} className="space-y-4">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm text-slate-600">
              <strong className="font-semibold block text-slate-800 mb-1">Customer Review:</strong>
              <p>"{replyingReview.comment}"</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                Your Reply Message
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                placeholder="Write your response to the review..."
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setReplyingReview(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs py-2 px-4 rounded-xl transition-all"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={replyMutation.isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-md transition-all"
              >
                Post Reply
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
