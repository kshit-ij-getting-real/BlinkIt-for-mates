import { useMemo, useState } from 'react';
import { categories } from '../data/products';
import { Product } from '../state/types';
import ProductCard from './ProductCard';

type Props = {
  products: Product[];
  onAdd: (product: Product) => void;
  ctaText?: string;
};

export default function ProductList({ products, onAdd, ctaText }: Props) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          className="input"
          placeholder="Search snacks, groceries, beverages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setCategory('All')}
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            category === 'All' ? 'bg-brand text-white' : 'bg-white border border-slate-200 text-slate-700'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              category === cat ? 'bg-brand text-white' : 'bg-white border border-slate-200 text-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} ctaText={ctaText} />
        ))}
      </div>
    </div>
  );
}
