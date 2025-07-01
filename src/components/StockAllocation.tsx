import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Box, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import WebSocketService from '../services/websocket';

interface Member {
  id: string;
  name: string;
}

interface Family {
  id: string;
  cardNumber: string;
  members: Member[];
  allocatedStock: Record<string, number>;
}

const StockAllocation = () => {
  const { familyId, memberId } = useParams();
  const navigate = useNavigate();
  const [family, setFamily] = useState<Family | null>(null);
  const [dispensing, setDispensing] = useState<Record<string, boolean>>({});
  const [dispensed, setDispensed] = useState<Record<string, boolean>>({});
  const websocketService = WebSocketService.getInstance();

  useEffect(() => {
    if (!familyId) return;
    
    // Fetch family details from the backend
    fetch(`http://localhost:3001/api/families/${familyId}`)
      .then((res) => res.json())
      .then((data) => setFamily(data))
      .catch(() => toast.error('Failed to load family details'));
  }, [familyId]);

  if (!family) {
    return <div className="text-white text-center mt-10">Loading family details...</div>;
  }

  const member = family.members.find(m => m.id === memberId);
  if (!member) {
    return <div className="text-white">Member not found</div>;
  }

  const handleDispense = async (item: string) => {
    setDispensing(prev => ({ ...prev, [item]: true }));

    try {
      const quantity = family.allocatedStock[item.toLowerCase()];

      // WebSocket communication with Arduino to dispense the item
      await websocketService.dispenseItem(item, quantity);

      // Update inventory (reduce stock in the backend)
      await fetch(`http://localhost:3001/api/inventory`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item, quantity: -quantity }),
      });

      // Add transaction record in the backend
      const transaction = {
        familyId: family.id,
        memberName: member.name,
        items: [{ name: item, quantity }],
        date: new Date().toISOString().split('T')[0], // Format date as YYYY-MM-DD
      };

      await fetch(`http://localhost:3001/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });

      setDispensed(prev => ({ ...prev, [item]: true }));
      toast.success(`Successfully dispensed ${quantity}kg of ${item}`);
    } catch (error) {
      console.error(error);
      toast.error(`Error dispensing ${item}`);
    }

    setDispensing(prev => ({ ...prev, [item]: false }));
  };

  const maskCardNumber = (cardNumber: string) => {
    const prefix = cardNumber.slice(0, 3);
    const suffix = cardNumber.slice(-3);
    return `${prefix}${'*'.repeat(cardNumber.length - 6)}${suffix}`;
  };

  return (
    <div className="max-w-2xl mx-auto glass-card rounded-xl overflow-hidden mt-10">
      <div className="p-8">
        <button
          onClick={() => navigate(`/family/${familyId}`)}
          className="flex items-center text-blue-400 mb-6 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Family Members
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{member.name}</h2>
          <p className="text-blue-300">Card Number: {maskCardNumber(family.cardNumber)}</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Box className="w-6 h-6 text-blue-400 mr-2" />
            <h3 className="text-xl font-semibold text-white">Current Allocations</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(family.allocatedStock).map(([item, quantity]) => (
              <div key={item} className="allocation-item p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-white capitalize">{item}</h4>
                    <div className="flex items-center mt-1">
                      <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      <p className="text-green-400">Allocated: {quantity} kg</p>
                    </div>
                  </div>
                  <button className="adjust-button px-4 py-1.5 text-white rounded-lg text-sm font-medium">
                    Adjust
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {Object.entries(family.allocatedStock).map(([item, quantity]) => (
            <div key={item} className="allocation-item rounded-lg p-4 text-center">
              <Box className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-white capitalize mb-4">{item}</h4>
              <button
                onClick={() => handleDispense(item)}
                disabled={dispensing[item] || dispensed[item]}
                className="w-full dispense-button text-white py-2.5 px-4 rounded-lg disabled:opacity-50 font-medium flex items-center justify-center"
              >
                {dispensing[item] ? (
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                ) : dispensed[item] ? (
                  'Dispensed'
                ) : (
                  'Dispense'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockAllocation;
