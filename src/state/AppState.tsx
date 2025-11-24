import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { products as productCatalog } from '../data/products';
import { useLocalStorageState } from './useLocalStorageState';
import { Group, GroupOrder, GroupOrderMember, GroupTabEntry, Product } from './types';
import { calculateGroupSubtotal, calculateMemberSubtotal, computeSplitPreview } from './calculations';

export type AppStateContextValue = {
  products: Product[];
  groups: Group[];
  groupOrders: GroupOrder[];
  groupTabs: GroupTabEntry[];
  addGroup: (name: string, members: string[]) => Group;
  startGroupOrder: (groupId: string, expiresAt: string | null) => GroupOrder;
  addItemToGroupOrder: (orderId: string, memberName: string, product: Product) => void;
  updateDeliveryFee: (orderId: string, fee: number) => void;
  setSplitMode: (orderId: string, mode: 'even' | 'proportional') => void;
  markOrderPaid: (orderId: string) => void;
  createTabFromOrder: (
    orderId: string,
    payer: string,
    splits: { member: string; amount: number }[],
    total: number
  ) => void;
  toggleTabSettled: (tabId: string) => void;
  upsertMemberInGroup: (groupId: string, memberName: string) => void;
};

const initialGroups: Group[] = [
  {
    id: 'g1',
    name: 'Lower Parel Flatmates',
    members: ['Aisha', 'Rohan', 'Zoya', 'Karan'],
  },
  {
    id: 'g2',
    name: 'Office Team Sprint',
    members: ['Priya', 'Aman', 'Sahil'],
  },
];

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useLocalStorageState<Group[]>('blinkit_groups', initialGroups);
  const [groupOrders, setGroupOrders] = useState<GroupOrder[]>([]);
  const [groupTabs, setGroupTabs] = useLocalStorageState<GroupTabEntry[]>('blinkit_tabs', []);
  const products = useMemo(() => productCatalog, []);

  const addGroup = (name: string, members: string[]) => {
    const newGroup: Group = { id: uuid(), name, members };
    setGroups((prev) => [...prev, newGroup]);
    return newGroup;
  };

  const upsertMemberInGroup = (groupId: string, memberName: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId && !g.members.includes(memberName)
          ? { ...g, members: [...g.members, memberName] }
          : g
      )
    );
  };

  const startGroupOrder = (groupId: string, expiresAt: string | null) => {
    const order: GroupOrder = {
      id: uuid(),
      groupId,
      status: 'open',
      createdAt: new Date().toISOString(),
      expiresAt,
      members: [],
      deliveryFee: 29,
      splitMode: 'even',
    };
    setGroupOrders((prev) => [...prev, order]);
    return order;
  };

  const addItemToGroupOrder = (orderId: string, memberName: string, product: Product) => {
    setGroupOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const members = [...order.members];
        const memberIndex = members.findIndex((m) => m.name === memberName);
        const member: GroupOrderMember =
          memberIndex >= 0
            ? { ...members[memberIndex] }
            : { name: memberName, items: [], subtotal: 0 };

        const itemIndex = member.items.findIndex((i) => i.productId === product.id);
        if (itemIndex >= 0) {
          const updated = { ...member.items[itemIndex], qty: member.items[itemIndex].qty + 1 };
          member.items.splice(itemIndex, 1, updated);
        } else {
          member.items.push({
            productId: product.id,
            qty: 1,
            pricePerUnit: product.price,
            addedBy: memberName,
          });
        }
        member.subtotal = calculateMemberSubtotal(member.items);

        if (memberIndex >= 0) {
          members.splice(memberIndex, 1, member);
        } else {
          members.push(member);
        }

        upsertMemberInGroup(order.groupId, memberName);

        return { ...order, members };
      })
    );
  };

  const updateDeliveryFee = (orderId: string, fee: number) => {
    setGroupOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, deliveryFee: fee } : order)));
  };

  const setSplitMode = (orderId: string, mode: 'even' | 'proportional') => {
    setGroupOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, splitMode: mode } : order)));
  };

  const markOrderPaid = (orderId: string) => {
    setGroupOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: 'paid' } : order)));
  };

  const createTabFromOrder = (
    orderId: string,
    payer: string,
    splits: { member: string; amount: number }[],
    total: number
  ) => {
    const order = groupOrders.find((o) => o.id === orderId);
    if (!order) return;
    const tab: GroupTabEntry = {
      id: uuid(),
      groupId: order.groupId,
      orderId,
      payer,
      splits,
      total,
      createdAt: new Date().toISOString(),
      settled: false,
    };
    setGroupTabs((prev) => [...prev, tab]);
    markOrderPaid(orderId);
  };

  const toggleTabSettled = (tabId: string) => {
    setGroupTabs((prev) => prev.map((tab) => (tab.id === tabId ? { ...tab, settled: !tab.settled } : tab)));
  };

  const value: AppStateContextValue = useMemo(
    () => ({
      products,
      groups,
      groupOrders,
      groupTabs,
      addGroup,
      startGroupOrder,
      addItemToGroupOrder,
      updateDeliveryFee,
      setSplitMode,
      markOrderPaid,
      createTabFromOrder,
      toggleTabSettled,
      upsertMemberInGroup,
    }),
    [products, groups, groupOrders, groupTabs]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}

export { calculateGroupSubtotal, calculateMemberSubtotal, computeSplitPreview } from './calculations';

