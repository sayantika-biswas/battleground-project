// src/pages/Reviews.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Star, Upload, X } from 'lucide-react';
import axiosInstance from "../utils/axios";

const API_BASE = "/reviews";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    game: '',
    comment: '',
    rating: 5,
    avatar: '',
    date: new Date().toLocaleDateString('en-GB')
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploadFile, setUploadFile] = useState(null);

  // ✅ Fetch all reviews from backend
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axiosInstance.get(API_BASE);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  // ✅ Add / Update review
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("game", formData.game);
      fd.append("comment", formData.comment);
      fd.append("rating", formData.rating);
      fd.append("date", formData.date);
      if (uploadFile) fd.append("avatar", uploadFile);

      if (editingReview) {
        // Update review
        await axiosInstance.put(`${API_BASE}/${editingReview._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Create new review
        await axiosInstance.post(API_BASE, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await fetchReviews();
      handleCancel();
    } catch (err) {
      console.error("Save review error:", err);
    }
  };

  // ✅ Delete review
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axiosInstance.delete(`${API_BASE}/${id}`);
        setReviews(reviews.filter(r => r._id !== id));
      } catch (err) {
        console.error("Delete review error:", err);
      }
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      game: review.game,
      comment: review.comment,
      rating: review.rating,
      avatar: review.avatar,
      date: review.date,
    });
    setAvatarPreview(review.avatar);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      game: '',
      comment: '',
      rating: 5,
      avatar: '',
      date: new Date().toLocaleDateString('en-GB')
    });
    setAvatarPreview('');
    setUploadFile(null);
    setEditingReview(null);
    setIsModalOpen(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const removeAvatar = () => {
    setAvatarPreview('');
    setUploadFile(null);
    setFormData({ ...formData, avatar: '' });
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="flex-1 min-h-[calc(100dvh-4rem)] h-[calc(100dvh-4rem)] p-6 w-full 
                    bg-gradient-to-br from-blue-200 via-purple-200 to-pink-100 
                    dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700">

      {/* Header + Add button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Reviews Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 
                     rounded transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          Add New Review
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map(review => (
          <div key={review._id} 
               className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 
                          border border-white/20 dark:border-zinc-700/30 hover:shadow-xl transition-all overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-100 dark:ring-blue-500/20 shrink-0">
                  <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800 dark:text-white truncate">{review.name}</h3>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{review.game}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(review)}
                  className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 
                             dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-all"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200 
                             dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{review.comment}</p>
              </div>

              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                Posted on: {review.date}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {reviews.length === 0 && (
        <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl shadow-lg 
                        p-8 border border-white/20 dark:border-zinc-700/30 text-center max-w-md mx-auto mt-12">
          <div className="bg-blue-100/50 dark:bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No reviews yet</h3>
          <p className="text-gray-600 dark:text-gray-400">Add your first review to get started</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center 
                        z-50 p-4 overflow-y-auto">
          <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-2xl shadow-2xl 
                          max-w-md w-full p-6 my-8 border border-white/20 dark:border-zinc-700/30">
            <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
              {editingReview ? 'Edit Review' : 'Add New Review'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  Avatar Image
                </label>
                <div className="p-4 bg-white/50 dark:bg-zinc-800/50 rounded-lg border border-gray-200 dark:border-zinc-700">
                  <div className="flex items-center gap-4">
                    {avatarPreview ? (
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-blue-100 dark:ring-blue-500/20">
                          <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={removeAvatar}
                          className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center ring-2 ring-gray-200 dark:ring-zinc-600">
                        <Upload className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="inline-flex items-center gap-2 cursor-pointer bg-blue-100 hover:bg-blue-200 
                                   dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 
                                   px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Image
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                        Recommended: Square image, 400x400px or larger
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 
                             rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 
                             dark:focus:border-blue-500 transition-all dark:text-white"
                  placeholder="Reviewer name"
                  required
                />
              </div>

              {/* Game */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  Game
                </label>
                <input
                  type="text"
                  value={formData.game}
                  onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 
                             rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 
                             dark:focus:border-blue-500 transition-all dark:text-white"
                  placeholder="Game title"
                  required
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  Rating
                </label>
                <div className="flex items-center gap-2 bg-white/50 dark:bg-zinc-800/50 p-3 rounded-lg border border-gray-200 dark:border-zinc-700">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none transform hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Comment
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg 
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-700 dark:text-white"
                  placeholder="Write your review here..."
                  rows="4"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editingReview ? 'Update Review' : 'Add Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
