import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/ProductList';
import SoloCart from '../components/SoloCart';
import StartGroupModal from '../components/StartGroupModal';
import { useAppState } from '../state/AppState';
import { Product } from '../state/types';

export default function HomePage() {
  const { products, groups, addGroup, startGroupOrder } = useAppState();
  const [soloCart, setSoloCart] = useState<Record<string, number>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const addToSoloCart = (product: Product) => {
    setSoloCart((prev) => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }));
  };

  const removeFromSoloCart = (productId: string) => {
    setSoloCart((prev) => {
      const qty = (prev[productId] || 0) - 1;
      return { ...prev, [productId]: Math.max(0, qty) };
    });
  };

  const handleStartOrder = (groupId: string, expiresAt: string | null) => {
    const order = startGroupOrder(groupId, expiresAt);
    navigate(`/group/${order.id}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Quick-commerce picks</h1>
            <p className="text-slate-600">Blinkit-style catalog with group ordering magic.</p>
          </div>
        </div>
        <ProductList products={products} onAdd={addToSoloCart} />
      </div>
      <div className="space-y-3">
        <div className="card p-4 flex flex-col gap-3">
          <div>
            <h3 className="text-lg font-semibold">BlinkIt for Friends</h3>
            <p className="text-sm text-slate-600">
              Start a group order, let friends add items, and split like Splitwise.
            </p>
          </div>
          <button className="btn-primary w-full" onClick={() => setModalOpen(true)}>
            Start BlinkIt for Friends order
          </button>
        </div>
        <SoloCart cart={soloCart} products={products} onAdd={(id) => addToSoloCart(products.find((p) => p.id === id)!)} onRemove={removeFromSoloCart} />
      </div>
      <StartGroupModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        groups={groups}
        onCreateGroup={addGroup}
        onStartOrder={handleStartOrder}
      />
    </div>
  );
}
