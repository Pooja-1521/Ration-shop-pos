import React, { useState } from 'react';
import { Package, Plus, Archive, Search, Download } from 'lucide-react';
import { mockInventory } from '../data';
import { InventoryItem } from '../types';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface InventoryProps {
  userRole: 'admin' | 'shopkeeper';
}

const Inventory: React.FC<InventoryProps> = ({ userRole }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  const getStockStatus = (quantity: number) => {
    if (quantity > 800) return 'text-green-400';
    if (quantity > 300) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handleAddItem = () => {
    if (newItem.name && newItem.quantity > 0) {
      setInventory([
        ...inventory,
        {
          id: Date.now().toString(),
          name: newItem.name,
          quantity: newItem.quantity
        }
      ]);
      setNewItem({ name: '', quantity: 0 });
      setShowAddModal(false);
      toast.success('Item added successfully!');
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const monthlyUsageData = [
    { name: 'Jan', rice: 120, wheat: 90, sugar: 60 },
    { name: 'Feb', rice: 150, wheat: 110, sugar: 75 },
    { name: 'Mar', rice: 180, wheat: 130, sugar: 85 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="glass-card rounded-xl overflow-hidden p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full mr-4">
              <Archive className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Inventory</h2>
          </div>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 pr-4 py-2 rounded-lg w-64"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            {userRole === 'admin' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="add-button flex items-center space-x-2 text-white py-2 px-4 rounded-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Add Item</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredInventory.map(item => (
            <div
              key={item.id}
              className="inventory-card p-4 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                  <div className="flex items-center mt-2">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getStockStatus(item.quantity)}`}></span>
                    <span className={getStockStatus(item.quantity)}>{item.quantity} kg in stock</span>
                  </div>
                </div>
                <Package className="w-6 h-6 text-blue-400" />
              </div>
              <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getStockStatus(item.quantity).replace('text-', 'bg-')}`}
                  style={{ width: `${Math.min((item.quantity / 1000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0d1930] p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-white">Monthly Distribution Trends</h3>
          <LineChart width={800} height={300} data={monthlyUsageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: '#0d1930', border: '1px solid rgba(255,255,255,0.1)' }} />
            <Legend />
            <Line type="monotone" dataKey="rice" stroke="#4a90e2" />
            <Line type="monotone" dataKey="wheat" stroke="#82ca9d" />
            <Line type="monotone" dataKey="sugar" stroke="#ffc658" />
          </LineChart>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass-card p-6 rounded-lg w-96">
            <h3 className="text-2xl font-bold text-white mb-6">Add New Item</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Item Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="input-field w-full px-4 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Quantity (kg)</label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  className="input-field w-full px-4 py-2 rounded-lg"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddItem}
                  className="flex-1 add-button text-white py-2 rounded-lg font-medium"
                >
                  Add Item
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg font-medium hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;