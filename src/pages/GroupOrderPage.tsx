import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { useAppState, calculateGroupSubtotal, computeSplitPreview } from '../state/AppState';
import { Product } from '../state/types';

export default function GroupOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const {
    groupOrders,
    groups,
    products,
    addItemToGroupOrder,
    updateDeliveryFee,
    setSplitMode,
  } = useAppState();

  const order = groupOrders.find((o) => o.id === orderId);
  const group = groups.find((g) => g.id === order?.groupId);
  const [selectedMember, setSelectedMember] = useState('');
  const [customMember, setCustomMember] = useState('');
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!order?.expiresAt) return;
    const interval = setInterval(() => {
      const diff = new Date(order.expiresAt!).getTime() - Date.now();
      if (diff <= 0) {
        setCountdown('Expired');
        clearInterval(interval);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setCountdown(`${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [order?.expiresAt]);

  useEffect(() => {
    if (group && !selectedMember) {
      setSelectedMember(group.members[0] || '');
    }
  }, [group, selectedMember]);

  const activeMember = customMember || selectedMember;

  const handleAdd = (product: Product) => {
    if (!order) return;
    const member = activeMember || 'Guest';
    addItemToGroupOrder(order.id, member, product);
  };

  const subtotal = order ? calculateGroupSubtotal(order) : 0;
  const splitPreview = useMemo(() => (order ? computeSplitPreview(order) : []), [order]);

  if (!order || !group) {
    return (
      <div className="card p-6">
        <p className="text-slate-600">Order not found.</p>
        <Link to="/groups" className="btn-primary mt-3 inline-flex">
          Go to Groups
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Add items to {group.name}</h1>
          <p className="text-slate-600">Each item is tagged with who added it for easy splits.</p>
        </div>
        <ProductList products={products} onAdd={handleAdd} ctaText="Add to group order" />
      </div>

      <div className="card p-4 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-sm text-slate-500">Group</div>
            <div className="text-lg font-semibold">{group.name}</div>
            <div className="text-xs text-slate-500">Share link: https://demo.blinkit-for-friends.com/group/{order.id}</div>
            {order.expiresAt && <div className="text-xs text-amber-600 mt-1">Expires in {countdown}</div>}
          </div>
          <button className="btn-secondary" onClick={() => navigate('/groups')}>
            Switch group
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Who are you in this group?</label>
          <select className="input" value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}>
            <option value="">Select member</option>
            {group.members.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
          <input
            className="input"
            placeholder="Or type your name"
            value={customMember}
            onChange={(e) => setCustomMember(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Contributions</h3>
            <span className="text-sm text-slate-600">Subtotal: ₹{subtotal.toFixed(0)}</span>
          </div>
          <div className="border border-slate-100 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-600">
                  <th className="p-2">Member</th>
                  <th className="p-2">Items</th>
                  <th className="p-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.members.map((member) => (
                  <tr key={member.name} className="border-t border-slate-100">
                    <td className="p-2 font-semibold">{member.name}</td>
                    <td className="p-2 text-slate-600">{member.items.length}</td>
                    <td className="p-2 font-semibold">₹{member.subtotal.toFixed(0)}</td>
                  </tr>
                ))}
                {order.members.length === 0 && (
                  <tr>
                    <td className="p-2 text-slate-500" colSpan={3}>
                      No items yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold">Delivery fee</label>
            <input
              type="number"
              className="input w-28 text-right"
              value={order.deliveryFee}
              onChange={(e) => updateDeliveryFee(order.id, Number(e.target.value))}
            />
          </div>
          <div className="flex gap-2">
            <button
              className={`flex-1 px-3 py-2 rounded-lg border ${
                order.splitMode === 'even'
                  ? 'bg-brand text-white border-brand'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
              onClick={() => setSplitMode(order.id, 'even')}
            >
              Even split
            </button>
            <button
              className={`flex-1 px-3 py-2 rounded-lg border ${
                order.splitMode === 'proportional'
                  ? 'bg-brand text-white border-brand'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
              onClick={() => setSplitMode(order.id, 'proportional')}
            >
              Proportional
            </button>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-slate-500">Preview</div>
            {splitPreview.map((row) => (
              <div key={row.member} className="flex justify-between text-sm">
                <span>{row.member}</span>
                <span className="font-semibold">₹{row.total.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-primary w-full" onClick={() => navigate(`/group/${order.id}/review`)}>
          Review split and simulate payment
        </button>
      </div>
    </div>
  );
}
