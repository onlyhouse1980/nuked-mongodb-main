import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    // As soon as the page loads, validate the token
    const validateToken = async () => {
      if (!token) {
        setMessage({ text: "No token provided.", type: "error" });
        setIsCheckingToken(false);
        return;
      }

      try {
        // Call an API endpoint to verify the token
        const response = await fetch("/api/verify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setIsTokenValid(true);
          setMessage({
            text: "Token verified. Please enter your new password.",
            type: "info",
          });
        } else {
          const result = await response.json();
          setMessage({
            text: result.message || "Invalid or expired token.",
            type: "error",
          });
        }
      } catch (error) {
        setMessage({
          text: "Network error. Could not verify token.",
          type: "error",
        });
      } finally {
        setIsCheckingToken(false);
      }
    };

    if (token) {
      validateToken();
    } else {
      setIsCheckingToken(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "error" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const result = await response.json();

      if (response.ok) {
        setMessage({
          text: "Password has been reset successfully. Redirecting to login...",
          type: "success",
        });
        // Redirect to login page after a short delay
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setMessage({
          text: result.message || "Failed to reset password. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setMessage({ text: "Network error. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageBoxClasses = () => {
    if (!message.text) return "hidden";
    switch (message.type) {
      case "success":
        return "bg-green-100 text-green-700";
      case "error":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  if (isCheckingToken) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Verifying token...</p>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl text-center">
          <p className="text-red-700">{message.text}</p>
          <a
            href="/forgot-password"
            className="mt-4 inline-block font-medium text-blue-600 hover:text-blue-500"
          >
            Request a new reset link
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Reset Password - Meter Read Dash</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 font-['Inter']">
            Set a New Password
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Enter and confirm your new password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400"
            >
              {isLoading ? "Saving..." : "Reset Password"}
            </button>
          </form>

          <div
            className={`mt-6 p-4 rounded-md text-sm font-medium ${getMessageBoxClasses()}`}
          >
            {message.text}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
