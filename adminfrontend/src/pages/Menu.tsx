import { useMenu } from "../context/MenuContext";

export default function Menu() {
  const { menuItems, loading, error } = useMenu();

  if (loading) {
    return <p>Loading menu...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <h1>🍕 Menu</h1>

      <div>
        {menuItems.map((item) => (
          <div key={item.id}>
            <h2>{item.name}</h2>

            <p>{item.description}</p>

            <p>₹{item.price}</p>

            <p>
              {item.inventory} Available
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}