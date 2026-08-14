import { useNavigate } from "react-router-dom";
import AdminLogin from "./AdminLogin";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="flex w-full max-w-3xl flex-col items-center text-center">
        <h1 className="mb-8 text-[120px] font-black leading-none text-zinc-900">
          Pizza Loom
        </h1>

        <p className="mb-6 text-lg font-medium text-zinc-800">
          Welcome to Pizza Loom
        </p>

        <div className="w-full max-w-md text-left">
          <AdminLogin />
        </div>

        <button
          onClick={() => navigate("/menu")}
          className="home-walk-card mt-4 w-full max-w-md rounded-xl px-6 py-5 text-center text-lg font-bold text-zinc-900"
        >
          Walk In
        </button>
      </div>
    </main>
  );
}