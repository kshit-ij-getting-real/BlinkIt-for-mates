import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppState, calculateGroupSubtotal, computeSplitPreview } from '../state/AppState';

export default function GroupReviewPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { groupOrders, groups, createTabFromOrder } = useAppState();
  const order = groupOrders.find((o) => o.id === orderId);
  const group = groups.find((g) => g.id === order?.groupId);
  const [payer, setPayer] = useState<string>(group?.members[0] || '');

  const subtotal = order ? calculateGroupSubtotal(order) : 0;
  const preview = useMemo(() => (order ? computeSplitPreview(order) : []), [order]);
  const total = order ? subtotal + order.deliveryFee : 0;

  if (!order || !group) {
    return (
      <div className="card p-6">
        <p className="text-slate-600">Order not found.</p>
        <Link to="/" className="btn-primary mt-3 inline-flex">
          Back home
        </Link>
      </div>
    );
  }

  const handleSimulate = () => {
    const splits = preview
      .filter((row) => row.member !== payer)
      .map((row) => ({ member: row.member, amount: Math.max(0, Math.round(row.total)) }));
    createTabFromOrder(order.id, payer, splits, Math.round(total));
    navigate(`/tab/${group.id}`);
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-500">Review split</div>
          <h1 className="text-2xl font-bold">{group.name}</h1>
          <p className="text-slate-600">Subtotal ₹{subtotal.toFixed(0)} • Delivery ₹{order.deliveryFee}</p>
        </div>
        <Link to={`/group/${order.id}`} className="btn-secondary">
          Back to order
        </Link>
      </div>

      <div className="border border-slate-100 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="p-2">Member</th>
              <th className="p-2">Subtotal</th>
              <th className="p-2">Delivery</th>
              <th className="p-2">Total owed</th>
            </tr>
          </thead>
          <tbody>
            {preview.map((row) => (
              <tr key={row.member} className="border-t border-slate-100">
                <td className="p-2 font-semibold">{row.member}</td>
                <td className="p-2">₹{row.subtotal.toFixed(0)}</td>
                <td className="p-2">₹{row.deliveryShare.toFixed(0)}</td>
                <td className="p-2 font-bold">₹{row.total.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div className="space-y-2">
          <label className="text-sm font-medium">Who will pay now?</label>
          <select className="input" value={payer} onChange={(e) => setPayer(e.target.value)}>
            {group.members.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
        </div>
        <div className="card bg-slate-50 border-slate-200 p-4">
          <div className="text-sm text-slate-600">Group total</div>
          <div className="text-2xl font-bold">₹{total.toFixed(0)}</div>
          <div className="text-xs text-slate-500">Payer fronts the amount; everyone else owes their split.</div>
        </div>
      </div>

      <button className="btn-primary w-full" onClick={handleSimulate}>
        Simulate payment and create tab entry
      </button>
    </div>
  );
}
