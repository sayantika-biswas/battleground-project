import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, X, ImageIcon } from 'lucide-react';
import axiosInstance from "../utils/axios";

const API_BASE = "/bgcarousel"; // ✅ axiosInstance already has baseURL

const BackgroundCarousel = () => {
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadFile, setUploadFile] = useState(null);

  // ✅ Fetch all images
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axiosInstance.get(API_BASE);
      setImages(res.data);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  // ✅ Add new image (update not supported yet in backend)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingImage) {
        alert("Update not supported in backend yet!");
      } else if (uploadFile) {
        const fd = new FormData();
        fd.append("image", uploadFile);
        await axiosInstance.post(API_BASE, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      await fetchImages();
      handleCancel();
    } catch (err) {
      console.error("Error saving image:", err);
    }
  };

  // ✅ Delete image
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await axiosInstance.delete(`${API_BASE}/${id}`);
        setImages(images.filter(image => image._id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setImagePreview(image.imageUrl);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setImagePreview('');
    setUploadFile(null);
    setEditingImage(null);
    setIsModalOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setUploadFile(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 min-h-[calc(100dvh-4rem)] h-[calc(100dvh-4rem)] p-6 w-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Background Carousel Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          <Plus className="h-5 w-5" />
          Add New Image
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map(image => (
          <div key={image._id} className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-white/20 dark:border-zinc-700/30 hover:shadow-xl transition-all">
            <div className="h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-zinc-800 dark:to-zinc-900">
              <img 
                src={image.imageUrl} 
                alt="Carousel background" 
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Carousel Image</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">#{image._id.slice(-6)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(image)}
                    className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-all"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(image._id)}
                    className="p-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50/50 dark:bg-zinc-900/50 rounded-lg p-3 space-y-2 text-sm">
                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Added: {formatDate(image.createdAt)}
                </p>
                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Updated: {formatDate(image.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20 dark:border-zinc-700/30 text-center max-w-md mx-auto mt-12">
          <div className="bg-blue-100/50 dark:bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No carousel images yet</h3>
          <p className="text-gray-600 dark:text-gray-400">Add your first background image to get started</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full p-6 my-8 border border-white/20 dark:border-zinc-700/30">
            <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
              {editingImage ? 'Edit Carousel Image' : 'Add New Carousel Image'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  Background Image
                </label>
                <div className="flex flex-col items-center gap-4">
                  {imagePreview ? (
                    <div className="relative w-full">
                      <img 
                        src={imagePreview} 
                        alt="Image preview" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-200 dark:bg-zinc-700 rounded-lg flex flex-col items-center justify-center">
                      <ImageIcon size={40} className="text-gray-400 mb-2" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No image selected</p>
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-blue-100 hover:bg-blue-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                    >
                      <Upload size={16} />
                      Upload Image
                    </label>
                  </div>
                </div>
              </div>
              
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
                  disabled={!uploadFile}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {editingImage ? 'Update Image' : 'Add Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundCarousel;
