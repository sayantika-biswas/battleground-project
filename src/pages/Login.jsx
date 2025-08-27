import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";


function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const validateForm = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    let valid = true;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Enter a valid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const authToken = response.data.token;
      localStorage.setItem("authToken", authToken);

      navigate("/"); // Redirect after everything is done
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <section className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700">
      {/* Right - Form */}
      <div className="w-full max-w-md">
        <div className="space-y-8 p-8 rounded-2xl shadow-xl bg-white/70 dark:bg-zinc-800/50 backdrop-blur-lg border border-white/20 dark:border-zinc-700/30">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-900 dark:text-blue-400">
              Welcome Back
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Please sign in to continue
            </p>
          </div>

          <form className="space-y-6" onSubmit={validateForm} noValidate>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                className={`mt-1 w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-zinc-800/50 backdrop-blur border ${emailError
                    ? "border-red-500"
                    : "border-blue-100 dark:border-zinc-700"
                  } text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-all duration-200`}
                required
              />
              {emailError && (
                <p className="text-sm text-red-500 mt-1">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  className={`mt-1 w-full px-4 py-3 pr-10 rounded-xl bg-white/50 dark:bg-zinc-800/50 backdrop-blur border ${passwordError
                      ? "border-red-500"
                      : "border-blue-100 dark:border-zinc-700"
                    } text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-all duration-200`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible((prev) => !prev)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-zinc-500 dark:text-zinc-300"
                >
                  {passwordVisible ? "Hide" : "Show"}
                </button>
              </div>
              {passwordError && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end text-sm">
              <Link
                to="/forgot-password"
                className="text-zinc-600 dark:text-zinc-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-zinc-800 dark:text-white font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
