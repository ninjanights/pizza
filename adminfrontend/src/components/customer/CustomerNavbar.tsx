import { Link } from "react-router-dom";

export default function CustomerNavbar() {
  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      <Link to="/menu" className="font-bold">
        🍕 Pizza Loom
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/menu">
          Menu
        </Link>

        <Link to="/cart">
          Cart
        </Link>

        <Link to="/walkinorders">
          My Orders
        </Link>
      </div>
    </nav>
  );
}