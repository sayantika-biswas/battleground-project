// src/pages/StoreLinks.jsx
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ExternalLink, Smartphone } from "lucide-react";
import axiosInstance from "../utils/axios"; // ✅ use centralized axios with token

const API_BASE = "/store-links"; // axiosInstance already has baseURL

const StoreLinks = () => {
  const [links, setLinks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState({
    type: "google",
    url: "",
  });

  // ✅ Fetch store links from backend
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await axiosInstance.get(API_BASE);
      setLinks(res.data);
    } catch (err) {
      console.error("Error fetching store links:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLink) {
        // ✅ Update link
        await axiosInstance.put(`${API_BASE}/${editingLink._id}`, formData)
      } else {
        // ✅ Create new link
        await axiosInstance.post(API_BASE, formData)

      }
      await fetchLinks();
      handleCancel();
    } catch (err) {
      console.error("Save store link error:", err);
    }
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setFormData({
      type: link.type,
      url: link.url,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this store link?")) {
      try {
        await axiosInstance.delete(`${API_BASE}/${id}`);
        setLinks(links.filter((link) => link._id !== id));
      } catch (err) {
        console.error("Delete store link error:", err);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ type: "google", url: "" });
    setEditingLink(null);
    setIsModalOpen(false);
  };

  const PlatformIcon = ({ type }) => {
    if (type === "google") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 text-green-600"
        >
          <path d="M12.5 8.5 15 6M6 16l2.5-2.5M16 6l-2.5 2.5M8.5 16 6 13.5M20 8v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2Z" />
        </svg>
      );
    } else if (type === "apple") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 text-gray-700 dark:text-gray-300"
        >
          <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
          <path d="M10 2c1 .5 2 2 2 5" />
        </svg>
      );
    } else {
      return <Smartphone className="w-8 h-8 text-blue-600" />;
    }
  };

  const getPlatformName = (type) =>
    type === "google" ? "Google Play Store" : "Apple App Store";

  return (
    <div className="flex-1 min-h-[calc(100dvh-4rem)] h-[calc(100dvh-4rem)] p-6 w-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Store Links Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          Add New Link
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {links.map((link) => (
          <div
            key={link._id}
            className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 dark:border-zinc-700/30 hover:shadow-xl transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="shrink-0 p-2 bg-gray-100/80 dark:bg-zinc-700/80 rounded-lg">
                  <PlatformIcon type={link.type} />
                </div>
                <span className="font-semibold text-gray-800 dark:text-white truncate">
                  {getPlatformName(link.type)}
                </span>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(link)}
                  className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-all"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(link._id)}
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Store URL
                </p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 break-words transition-colors"
                >
                  {link.url}
                </a>
              </div>

              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Store Page
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full p-6 border border-white/20 dark:border-zinc-700/30">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              {editingLink ? "Edit Store Link" : "Add New Store Link"}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Store type radio buttons */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  Store Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-zinc-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors">
                    <input
                      type="radio"
                      value="google"
                      checked={formData.type === "google"}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                    />
                    <span>Google Play</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-zinc-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors">
                    <input
                      type="radio"
                      value="apple"
                      checked={formData.type === "apple"}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                    />
                    <span>App Store</span>
                  </label>
                </div>
              </div>

              {/* URL input */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  Store URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white/50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm"
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md"
                >
                  {editingLink ? "Update Link" : "Add Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreLinks;
