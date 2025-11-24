import { Product } from '../state/types';

type Props = {
  product: Product;
  onAdd: (product: Product) => void;
  ctaText?: string;
};

export default function ProductCard({ product, onAdd, ctaText = 'Add to cart' }: Props) {
  return (
    <div className="card p-3 flex flex-col gap-2">
      <div className="h-32 bg-slate-100 rounded-lg overflow-hidden">
        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <div className="text-xs uppercase tracking-wide text-slate-500">{product.brand}</div>
        <div className="font-semibold text-slate-900 line-clamp-2">{product.name}</div>
        <div className="text-lg font-bold text-slate-900">₹{product.price}</div>
      </div>
      <button onClick={() => onAdd(product)} className="btn-primary w-full text-center">
        {ctaText}
      </button>
    </div>
  );
}
