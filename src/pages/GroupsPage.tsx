import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppState } from '../state/AppState';

export default function GroupsPage() {
  const { groups, addGroup, startGroupOrder } = useAppState();
  const [name, setName] = useState('');
  const [members, setMembers] = useState('');
  const navigate = useNavigate();

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    const memberList = members
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);
    addGroup(name || 'New group', memberList);
    setName('');
    setMembers('');
  };

  const handleStartOrder = (groupId: string) => {
    const order = startGroupOrder(groupId, new Date(Date.now() + 10 * 60 * 1000).toISOString());
    navigate(`/group/${order.id}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Groups</h1>
        <p className="text-slate-600">Manage flatmates or office pods and start a shared order.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {groups.map((group) => (
            <div key={group.id} className="card p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{group.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {group.members.map((member) => (
                      <span key={member} className="badge">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-primary flex-1" onClick={() => handleStartOrder(group.id)}>
                  Start order
                </button>
                <Link to={`/tab/${group.id}`} className="btn-secondary flex-1 text-center">
                  View tab
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <h3 className="text-lg font-semibold">Create a new group</h3>
        <form className="space-y-3" onSubmit={handleCreate}>
          <div>
            <label className="text-sm font-medium">Group name</label>
            <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Housemates" />
          </div>
          <div>
            <label className="text-sm font-medium">Members</label>
            <input
              className="input mt-1"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              placeholder="Aisha, Rohan, Zoya"
            />
            <p className="text-xs text-slate-500 mt-1">Comma-separated names.</p>
          </div>
          <button type="submit" className="btn-primary w-full">
            Save group
          </button>
        </form>
      </div>
    </div>
  );
}
