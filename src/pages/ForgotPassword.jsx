import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";

function ResetPassword() {
  const { token } = useParams(); // from /reset-password/:token
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match" });
      return;
    }

    try {
      const res = await await axiosInstance.post(`/api/auth/reset-password/${token}`, {
        password,
      });
      setStatus({ type: "success", message: res.data.message });

      // redirect to login after short delay
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Reset failed",
      });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-zinc-800 p-10 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Reset Password
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-500 outline-none"
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-500 outline-none"
          />

          <button
            type="submit"
            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600"
          >
            Reset Password
          </button>
        </form>

        {status && (
          <p
            className={`text-center text-sm ${status.type === "success" ? "text-green-600" : "text-red-600"
              }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </section>
  );
}

export default ResetPassword;
