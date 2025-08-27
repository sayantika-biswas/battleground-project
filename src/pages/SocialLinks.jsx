// src/pages/SocialLinks.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react';
import axiosInstance from "../utils/axios";

const API_BASE = "/social-links";

const SocialLinks = () => {
  const [links, setLinks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState({
    type: 'instagram',
    url: ''
  });

  // ✅ Fetch links from backend
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await axiosInstance.get(API_BASE);
      setLinks(res.data);
    } catch (err) {
      console.error("Error fetching links:", err);
    }
  };

  // ✅ Add / Update link
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLink) {
        // Update
        await axiosInstance.put(`${API_BASE}/${editingLink._id}`, formData);
      } else {
        // Add new
        await axiosInstance.post(API_BASE, formData);
      }
      await fetchLinks();
      handleCancel();
    } catch (err) {
      console.error("Save social link error:", err);
    }
  };

  // ✅ Delete link
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this social link?')) {
      try {
        await axiosInstance.delete(`${API_BASE}/${id}`);
        setLinks(links.filter(link => link._id !== id));
      } catch (err) {
        console.error("Delete social link error:", err);
      }
    }
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setFormData({
      type: link.type,
      url: link.url
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setFormData({ type: 'instagram', url: '' });
    setEditingLink(null);
    setIsModalOpen(false);
  };

  // Platform icon component
  const PlatformIcon = ({ type, className = "w-8 h-8" }) => {
    switch (type) {
      case 'instagram': return <Instagram className={`${className} text-pink-600`} />;
      case 'facebook': return <Facebook className={`${className} text-blue-600`} />;
      case 'youtube': return <Youtube className={`${className} text-red-600`} />;
      case 'discord': return <MessageCircle className={`${className} text-indigo-600`} />;
      default: return <ExternalLink className={`${className} text-gray-600`} />;
    }
  };

  const getPlatformName = (type) => {
    switch (type) {
      case 'instagram': return 'Instagram';
      case 'facebook': return 'Facebook';
      case 'youtube': return 'YouTube';
      case 'discord': return 'Discord';
      default: return 'Social Media';
    }
  };

  const getPlatformColor = (type) => {
    switch (type) {
      case 'instagram': return 'bg-pink-500';
      case 'facebook': return 'bg-blue-500';
      case 'youtube': return 'bg-red-500';
      case 'discord': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100dvh-4rem)] h-[calc(100dvh-4rem)] p-6 w-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Social Links Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          Add New Link
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {links.map(link => (
          <div key={link._id} className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 dark:border-zinc-700/30 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${getPlatformColor(link.type)} bg-opacity-10 ring-2 ring-white/20 dark:ring-zinc-700/30`}>
                  <PlatformIcon type={link.type} />
                </div>
                <span className="font-semibold text-gray-800 dark:text-white">{getPlatformName(link.type)}</span>
              </div>
              <div className="flex gap-2">
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
              <div className="bg-gray-50/50 dark:bg-zinc-900/50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Profile URL</p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 break-words transition-colors"
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
                Visit Profile
              </a>
            </div>
          </div>
        ))}
      </div>

      {links.length === 0 && (
        <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20 dark:border-zinc-700/30 text-center max-w-md mx-auto mt-12">
          <div className="bg-blue-100/50 dark:bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No social links yet</h3>
          <p className="text-gray-600 dark:text-gray-400">Add your first social media link to get started</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full p-6 border border-white/20 dark:border-zinc-700/30">
            <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
              {editingLink ? 'Edit Social Link' : 'Add New Social Link'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  Platform Type
                </label>
                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all dark:text-white appearance-none"
                    required
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="youtube">YouTube</option>
                    <option value="discord">Discord</option>
                  </select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <PlatformIcon type={formData.type} className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  Profile URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all dark:text-white"
                    placeholder={`https://${formData.type}.com/...`}
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  Enter the complete URL of your {getPlatformName(formData.type)} profile
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  {editingLink ? 'Update Link' : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialLinks;
