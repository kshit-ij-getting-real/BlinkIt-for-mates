import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppState } from '../state/AppState';
import { computeNetBalances } from '../state/calculations';

export default function GroupTabPage() {
  const { groupId } = useParams();
  const { groupTabs, groups, toggleTabSettled } = useAppState();

  const tabs = groupTabs.filter((tab) => (groupId === 'all' ? true : tab.groupId === groupId));
  const group = groups.find((g) => g.id === groupId);

  const balances = useMemo(() => computeNetBalances(tabs), [tabs]);
  const memberList = group
    ? group.members
    : Array.from(new Set(tabs.flatMap((t) => [t.payer, ...t.splits.map((s) => s.member)])));

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-500">Tabs / ledger</div>
          <h1 className="text-2xl font-bold">{group ? group.name : 'All groups'}</h1>
          {group && (
            <div className="flex flex-wrap gap-2 mt-1">
              {group.members.map((member) => (
                <span key={member} className="badge">
                  {member}
                </span>
              ))}
            </div>
          )}
        </div>
        <Link to="/groups" className="btn-secondary">
          Manage groups
        </Link>
      </div>

      <div className="space-y-3">
        {tabs.length === 0 && <p className="text-slate-600">No tab entries yet.</p>}
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`card p-4 ${tab.settled ? 'opacity-70' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-500">{new Date(tab.createdAt).toLocaleString()}</div>
                <div className="text-lg font-semibold">₹{tab.total} • {tab.payer} paid</div>
                <div className="text-sm text-slate-600">
                  {tab.splits.map((split) => `${split.member} owes ₹${split.amount}`).join(', ')}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-secondary" onClick={() => toggleTabSettled(tab.id)}>
                  {tab.settled ? 'Mark active' : 'Mark settled'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {memberList.length > 0 && (
        <div className="card p-4 space-y-2">
          <div className="text-lg font-semibold">Net balances (unsettled)</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {memberList.map((member) => {
              const balance = balances[member] || 0;
              return (
                <div key={member} className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{member}</span>
                  <span className={balance >= 0 ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                    {balance >= 0 ? `Should receive ₹${balance.toFixed(0)}` : `Should pay ₹${Math.abs(balance).toFixed(0)}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
