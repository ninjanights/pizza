import { PrismaClient } from "./../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const menuItems = [
  {
    name: "Margherita Pizza",
    description: "Classic pizza with tomato, mozzarella and fresh basil.",
    price: 299,
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
    inventory: 20,
  },
  {
    name: "Pepperoni Pizza",
    description: "Loaded with pepperoni and melted mozzarella.",
    price: 399,
    imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e",
    inventory: 15,
  },
  {
    name: "Farmhouse Pizza",
    description: "A delicious combination of fresh vegetables and cheese.",
    price: 349,
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    inventory: 12,
  },
  {
    name: "Chicken Burger",
    description: "Crispy chicken patty with lettuce, tomato and sauce.",
    price: 249,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    inventory: 25,
  },
  {
    name: "Cheese Burger",
    description: "Juicy beef patty topped with melted cheese.",
    price: 279,
    imageUrl: "https://images.unsplash.com/photo-1561758033-d89a9ad46330",
    inventory: 18,
  },
  {
    name: "French Fries",
    description: "Crispy golden fries seasoned with salt.",
    price: 129,
    imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",
    inventory: 30,
  },
  {
    name: "Garlic Bread",
    description: "Toasted bread with garlic butter and herbs.",
    price: 149,
    imageUrl: "https://images.unsplash.com/photo-1573140401552-3fab0b24306f",
    inventory: 20,
  },
  {
    name: "Coca Cola",
    description: "Chilled Coca Cola.",
    price: 79,
    imageUrl: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e",
    inventory: 50,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("blurrypizza", 12);

  await prisma.admin.upsert({
    where: {
      email: "pizza@pizza.com",
    },
    update: {},
    create: {
      email: "pizza@pizza.com",
      passwordHash,
    },
  });
  console.log("🍕 Seeded");
  console.log("Seeding menu... 🍀");

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: {
        name: item.name,
      },
      update: {
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        inventory: item.inventory,
      },
      create: item,
    });
  }

  console.log(`🍀 Seeded ${menuItems.length} menu items`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
