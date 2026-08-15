export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string | null;
  inventory: number;
  isAvailable: boolean;
};