// components/StatCard.jsx
import React from "react";
import { Link } from "react-router-dom";

function StatCard({ icon: Icon, color, title, value, to = "#" }) {
  return (
    <Link
      to={to}
      className={`relative flex items-center gap-4 rounded-2xl p-6 overflow-hidden group transition-transform duration-300 ${color}`}
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        border: '2px solid transparent',
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span className="absolute inset-0 z-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400 group-hover:shadow-lg transition-all duration-300" style={{background: 'linear-gradient(120deg,rgba(59,130,246,0.08),rgba(236,72,153,0.08))'}}></span>
      <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-blue-100 via-pink-100 to-purple-100 dark:from-zinc-700 dark:via-zinc-800 dark:to-zinc-900 shadow group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-7 h-7 text-blue-600 dark:text-pink-300 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300" />
      </div>
      <div className="relative z-10 flex flex-col">
        <h5 className="text-lg font-bold text-gray-800 dark:text-white tracking-tight mb-1">{title}</h5>
        <p className="text-2xl font-extrabold text-blue-600 dark:text-pink-300 drop-shadow-sm">{value}</p>
      </div>
    </Link>
  );
}

export default StatCard;
