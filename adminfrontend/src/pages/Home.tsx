import { useNavigate } from "react-router-dom";
import AdminLogin from "./AdminLogin";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main>
      <h1>🍕 Pizza Loom</h1>

      <p>Welcome to Pizza Loom</p>

     <AdminLogin/>

      <button onClick={() => navigate("/menu")}>
        Walk In
      </button>
    </main>
  );
}