export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  relation: string;
}

export interface Family {
  id: string;
  cardNumber: string;
  members: FamilyMember[];
  allocatedStock: {
    rice: number;
    wheat: number;
    sugar: number;
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
}

export interface Transaction {
  id: string;
  familyId: string;
  memberName: string;
  items: {
    name: string;
    quantity: number;
  }[];
  date: string;
}