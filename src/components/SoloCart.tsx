import { Product } from '../state/types';

type Props = {
  cart: Record<string, number>;
  products: Product[];
  onAdd: (productId: string) => void;
  onRemove: (productId: string) => void;
};

export default function SoloCart({ cart, products, onAdd, onRemove }: Props) {
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
  const total = entries.reduce((sum, [id, qty]) => {
    const product = products.find((p) => p.id === id);
    return sum + (product?.price || 0) * qty;
  }, 0);

  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Solo Cart</h3>
        <span className="text-sm text-slate-500">Demo only</span>
      </div>
      {entries.length === 0 ? (
        <p className="text-slate-500 text-sm">Add some items to see a quick total.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {entries.map(([id, qty]) => {
            const product = products.find((p) => p.id === id)!;
            return (
              <li key={id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-semibold">{product.name}</div>
                  <div className="text-slate-500">₹{product.price} × {qty}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-secondary px-2 py-1" onClick={() => onRemove(id)}>-</button>
                  <span className="font-semibold">{qty}</span>
                  <button className="btn-primary px-2 py-1" onClick={() => onAdd(id)}>+</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="font-semibold">Total</span>
        <span className="text-lg font-bold">₹{total}</span>
      </div>
    </div>
  );
}
