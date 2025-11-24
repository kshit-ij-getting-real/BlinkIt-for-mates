import { useState } from 'react';
import { Group } from '../state/types';

type Props = {
  open: boolean;
  onClose: () => void;
  groups: Group[];
  onCreateGroup: (name: string, members: string[]) => Group;
  onStartOrder: (groupId: string, expiresAt: string | null) => void;
};

export default function StartGroupModal({ open, onClose, groups, onCreateGroup, onStartOrder }: Props) {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [newGroupName, setNewGroupName] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [expiresIn, setExpiresIn] = useState<number>(10);

  if (!open) return null;

  const handleSubmit = () => {
    let groupId = selectedGroup;
    if (!groupId) {
      const members = memberInput
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);
      const group = onCreateGroup(newGroupName || 'New Group', members.length ? members : ['You']);
      groupId = group.id;
    }
    const expiresAt = expiresIn > 0 ? new Date(Date.now() + expiresIn * 60 * 1000).toISOString() : null;
    onStartOrder(groupId, expiresAt);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-40 px-4">
      <div className="card max-w-lg w-full p-6 relative">
        <button className="absolute top-3 right-3 text-slate-500" onClick={onClose}>
          ✕
        </button>
        <h3 className="text-xl font-semibold mb-3">Start BlinkIt for Friends order</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Select existing group</label>
            <select
              className="input mt-1"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">-- Choose a group --</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">New group name</label>
              <input
                className="input mt-1"
                placeholder="Flatmates, Office pod..."
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Members (comma separated)</label>
              <input
                className="input mt-1"
                placeholder="Aisha, Rohan, Karan"
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Expiry (minutes)</label>
              <input
                type="number"
                min={0}
                className="input mt-1"
                value={expiresIn}
                onChange={(e) => setExpiresIn(Number(e.target.value))}
              />
              <p className="text-xs text-slate-500 mt-1">Set 0 to keep it open.</p>
            </div>
          </div>

          <button className="btn-primary w-full" onClick={handleSubmit}>
            Start group order
          </button>
        </div>
      </div>
    </div>
  );
}
