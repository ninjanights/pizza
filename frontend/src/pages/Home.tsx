import { useNavigate } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="flex w-full max-w-3xl flex-col items-center text-center">
          <img src="/pizza.svg" alt="Pizza" className="mb-5 h-20 w-20 sm:h-24 sm:w-24" />

          <h1 className="mb-8 text-5xl sm:text-[120px] font-black leading-none text-zinc-900">
            Pizza Loom
          </h1>

          <p className="mb-6 text-sm font-medium text-zinc-800">
            Wrapped in warmth, topped with love.
          </p>

          <div className="w-full max-w-md text-left">
            <AdminLogin />
          </div>

          <div className="mt-6 h-px w-full max-w-md bg-neutral-400"></div>
          <p className="mt-4 text-sm font-black text-neutral-500">
            Just here for a bite? Come on in!
          </p>

          <button
            onClick={() => navigate("/menu")}
            className="home-walk-card mt-4 w-full max-w-md rounded-xl px-6 py-5 text-center text-lg font-bold text-zinc-900"
          >
            Walk In
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
