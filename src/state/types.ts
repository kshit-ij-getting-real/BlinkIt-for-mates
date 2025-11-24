export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  category: string;
};

export type Group = {
  id: string;
  name: string;
  members: string[];
};

export type GroupOrderItem = {
  productId: string;
  qty: number;
  pricePerUnit: number;
  addedBy: string;
};

export type GroupOrderMember = {
  name: string;
  items: GroupOrderItem[];
  subtotal: number;
};

export type GroupOrder = {
  id: string;
  groupId: string;
  status: 'open' | 'locked' | 'paid';
  createdAt: string;
  expiresAt: string | null;
  members: GroupOrderMember[];
  deliveryFee: number;
  splitMode: 'even' | 'proportional';
};

export type GroupTabEntry = {
  id: string;
  groupId: string;
  orderId: string;
  payer: string;
  splits: { member: string; amount: number }[];
  total: number;
  createdAt: string;
  settled: boolean;
};
