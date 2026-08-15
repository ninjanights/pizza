import React, { useState } from "react";
import { adminLogin } from "../services/admin.service";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await adminLogin(email, password);
      // keeps logged in context
      login();
      console.log("Admin logged in");
      navigate("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" w-full bg-transparent">
      <h1 className="mb-4 text-center text-sm font-bold text-neutral-800">
        Admin? Please Log in to manage the orders.
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-bold text-neutral-700">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="home-auth-input 
            font-black w-full border-4 border-neutral-400 rounded-lg px-4 py-3 text-sm
             text-neutral-900 outline-none placeholder:text-neutral-700"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-neutral-700">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="home-auth-input font-black border-4 border-neutral-400 w-full rounded-lg px-4 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-700"
          />
        </div>
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="home-login-button w-full 
          rounded-xl px-6 py-5 text-center text-lg bg-neutral-400
           font-bold text-neutral-100 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}