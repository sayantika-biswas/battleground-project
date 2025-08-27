import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Download, Smartphone } from "lucide-react";
import axiosInstance from "../utils/axios";

const API_BASE = "/navbar";

const NavbarButtons = () => {
  const [links, setLinks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState({ label: "", url: "" });

  // ✅ Fetch all links on mount
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await axiosInstance.get(API_BASE);
      setLinks(res.data);
    } catch (err) {
      console.error("Error fetching navbar links:", err);
    }
  };

  // ✅ Add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLink) {
        await axiosInstance.put(`${API_BASE}/${editingLink._id}`, formData);
      } else {
        await axiosInstance.post(API_BASE, formData);
      }
      await fetchLinks();
      handleCancel();
    } catch (err) {
      console.error("Save navbar link error:", err);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      try {
        await axiosInstance.delete(`${API_BASE}/${id}`);
        setLinks(links.filter((l) => l._id !== id));
      } catch (err) {
        console.error("Delete navbar link error:", err);
      }
    }
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setFormData({ label: link.label, url: link.url });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setFormData({ label: "", url: "" });
    setEditingLink(null);
    setIsModalOpen(false);
  };

  const getPlatformFromLabel = (label) =>
    label.toLowerCase().includes("android") ? "android" : "ios";

  // Platform icon
  const PlatformIcon = ({ platform }) => {
    if (platform === "android") {
      return <Smartphone className="w-8 h-8 text-green-600" />;
    } else if (platform === "ios") {
      return <Smartphone className="w-8 h-8 text-gray-700 dark:text-gray-300" />;
    }
    return <Smartphone className="w-8 h-8 text-blue-600" />;
  };


  return (
    <div className="flex-1 min-h-[calc(100dvh-4rem)] p-6 w-full 
      bg-gradient-to-br from-blue-200 via-purple-200 to-pink-100 
      dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Download Links Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-white 
            bg-blue-600 hover:bg-blue-700 rounded-lg 
            shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-5 w-5" /> Add New Link
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {links.map(link => {
          const platform = getPlatformFromLabel(link.label);
          return (
            <div key={link._id} className="bg-white/80 dark:bg-zinc-800/80 
              backdrop-blur-sm rounded-xl shadow-lg p-6 border 
              border-white/20 dark:border-zinc-700/30 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <PlatformIcon platform={platform} />
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {platform.toUpperCase()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(link)}
                    className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 
                    dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(link._id)}
                    className="p-2 rounded-lg bg-red-100 hover:bg-red-200 
                    dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="font-medium text-gray-700 dark:text-gray-300">{link.label}</p>
              <a href={link.url} target="_blank" rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline break-words">
                {link.url}
              </a>

              <a href={link.url} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full 
                bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                text-white py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all mt-4">
                <Download size={16} /> Test Link
              </a>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {links.length === 0 && (
        <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl 
          shadow-lg p-8 border border-white/20 dark:border-zinc-700/30 
          text-center max-w-md mx-auto mt-12">
          <div className="bg-blue-100/50 dark:bg-blue-900/30 rounded-full w-16 h-16 
            flex items-center justify-center mx-auto mb-4">
            <Download className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            No download links yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add your first download link to get started
          </p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm 
            rounded-2xl shadow-2xl max-w-md w-full p-6 border 
            border-white/20 dark:border-zinc-700/30">
            <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
              {editingLink ? "Edit Download Link" : "Add New Download Link"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* radios */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Platform</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="IOS DOWNLOAD"
                      checked={formData.label === "IOS DOWNLOAD"}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })} />
                    iOS
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="ANDROID DOWNLOAD"
                      checked={formData.label === "ANDROID DOWNLOAD"}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })} />
                    Android
                  </label>
                </div>
              </div>

              {/* url */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Download URL</label>
                <input type="url" value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/50 dark:bg-zinc-800/50 border 
                  border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm 
                  focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all dark:text-white"
                  required />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 
                  hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all">
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


export default NavbarButtons;
