import { GroupOrder, GroupTabEntry, GroupOrderMember } from './types';

export const calculateMemberSubtotal = (items: GroupOrderMember['items']) =>
  items.reduce((sum, item) => sum + item.qty * item.pricePerUnit, 0);

export const calculateGroupSubtotal = (order: GroupOrder) =>
  order.members.reduce((sum, member) => sum + member.subtotal, 0);

export const computeSplitPreview = (
  order: GroupOrder
): { member: string; subtotal: number; deliveryShare: number; total: number }[] => {
  const subtotal = calculateGroupSubtotal(order);
  const memberCount = Math.max(order.members.length, 1);
  const results = order.members.map((member) => {
    if (order.splitMode === 'even') {
      const share = (subtotal + order.deliveryFee) / memberCount;
      return { member: member.name, subtotal: member.subtotal, deliveryShare: share - member.subtotal, total: share };
    }
    const ratio = subtotal > 0 ? member.subtotal / subtotal : 1 / memberCount;
    const deliveryShare = order.deliveryFee * ratio;
    const total = member.subtotal + deliveryShare;
    return { member: member.name, subtotal: member.subtotal, deliveryShare, total };
  });

  return results.length
    ? results
    : [
        {
          member: 'You',
          subtotal: 0,
          deliveryShare: order.deliveryFee / memberCount,
          total: order.deliveryFee / memberCount,
        },
      ];
};

export const computeNetBalances = (tabs: GroupTabEntry[]) => {
  const balances: Record<string, number> = {};

  tabs
    .filter((t) => !t.settled)
    .forEach((tab) => {
      tab.splits.forEach((split) => {
        balances[split.member] = (balances[split.member] || 0) - split.amount;
      });
      balances[tab.payer] = (balances[tab.payer] || 0) + tab.total;
    });

  return balances;
};
