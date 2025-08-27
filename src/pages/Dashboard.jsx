import React, { useEffect, useState } from "react";
import { Image, StoreIcon, LinkIcon, Star } from "lucide-react";
import StatCard from "../components/StatCard";
import axiosInstance from "../utils/axios";


function Dashboard() {
  const [stats, setStats] = useState({
    images: 0,
    stores: 0,
    links: 0,
    reviews: 0,
  });

  const fetchStats = async () => {
    try {
      const [imagesRes, storesRes, footerRes, socialRes, reviewsRes] = await Promise.all([
        axiosInstance.get("/bgcarousel"),
        axiosInstance.get("/store-links"),
        axiosInstance.get("/footer-links"),
        axiosInstance.get("/social-links"),
        axiosInstance.get("/reviews"),
      ]);
      setStats({
        images: imagesRes.data.length,
        stores: storesRes.data.length,
        links: footerRes.data.length + socialRes.data.length,
        reviews: reviewsRes.data.length,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5123); // 🔁 refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 min-h-[calc(100dvh-4rem)] h-[calc(100dvh-4rem)] p-6 w-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white flex items-center gap-3">
          Dashboard Overview
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Image} title="Total Images" value={stats.images} to="/background-carousel" />
          <StatCard icon={StoreIcon} title="Active Stores" value={stats.stores} to="/stores" />
          <StatCard icon={LinkIcon} title="Active Links" value={stats.links} to="/links" />
          <StatCard icon={Star} title="Reviews" value={stats.reviews} to="/reviews" />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
