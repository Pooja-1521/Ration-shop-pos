import { Family, InventoryItem, Transaction } from './types';

export const mockFamilies: Family[] = [
  {
    id: '1',
    cardNumber: 'TN123456',
    members: [
      { id: '1-1', name: 'SANTOSH KUMAR', age: 40, relation: 'Head' },
      { id: '1-2', name: 'SMRITHI', age: 30, relation: 'Wife' },
      { id: '1-3', name: 'POOJA SRI', age: 10, relation: 'Son' }
    ],
    allocatedStock: {
      rice: 5,
      wheat: 10,
      sugar: 5
    }
  },
  {
    id: '2',
    cardNumber: 'TN789012',
    members: [
      { id: '2-1', name: 'Sundar Rajan', age: 50, relation: 'Head' },
      { id: '2-2', name: 'Lakshmi Rajan', age: 48, relation: 'Wife' }
    ],
    allocatedStock: {
      rice: 3,
      wheat: 7,
      sugar: 1
    }
  },
  {
    id: '3',
    cardNumber: 'TN345678',
    members: [
      { id: '3-1', name: 'Anand Krishnan', age: 35, relation: 'Head' },
      { id: '3-2', name: 'Meena Krishnan', age: 32, relation: 'Wife' },
      { id: '3-3', name: 'Kavya Krishnan', age: 8, relation: 'Daughter' },
      { id: '3-4', name: 'Karthik Krishnan', age: 5, relation: 'Son' }
    ],
    allocatedStock: {
      rice: 8,
      wheat: 12,
      sugar: 3
    }
  }
];

export let mockInventory: InventoryItem[] = [
  { id: '1', name: 'Rice', quantity: 1000 },
  { id: '2', name: 'Wheat', quantity: 1500 },
  { id: '3', name: 'Sugar', quantity: 500 }
];

export let mockTransactions: Transaction[] = [
  {
    id: '1',
    familyId: '1',
    memberName: 'Rajesh Kumar',
    items: [
      { name: 'Rice', quantity: 5 },
      { name: 'Wheat', quantity: 10 },
      { name: 'Sugar', quantity: 2 }
    ],
    date: '2024-03-15'
  },
  {
    id: '2',
    familyId: '2',
    memberName: 'Sundar Rajan',
    items: [
      { name: 'Rice', quantity: 3 },
      { name: 'Wheat', quantity: 7 },
      { name: 'Sugar', quantity: 1 }
    ],
    date: '2024-03-14'
  },
  
];

export const updateInventory = (itemName: string, quantity: number) => {
  mockInventory = mockInventory.map(item => {
    if (item.name.toLowerCase() === itemName.toLowerCase()) {
      return { ...item, quantity: item.quantity - quantity };
    }
    return item;
  });
};

export const addTransaction = (transaction: Transaction) => {
  mockTransactions = [transaction, ...mockTransactions];
};