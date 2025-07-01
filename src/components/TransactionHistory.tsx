import React, { useState, useEffect } from 'react';
import { History, Calendar, User, Package, Download, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

interface TransactionItem {
  name: string;
  quantity: number;
}

interface Transaction {
  id: number;
  memberName: string;
  date: string;
  items: TransactionItem[];
}

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch transactions from the backend API
    fetch('http://localhost:3001/api/transactions')
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to fetch transaction history');
        setLoading(false);
      });
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDate = !dateFilter || transaction.date === dateFilter;

    return matchesSearch && matchesDate;
  });

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Transaction History Report', 20, 20);

    doc.setFontSize(12);
    doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy')}`, 20, 30);

    let yPos = 50;
    filteredTransactions.forEach((transaction, index) => {
      doc.text(`Transaction #${index + 1}`, 20, yPos);
      doc.text(`Member: ${transaction.memberName}`, 30, yPos + 10);
      doc.text(`Date: ${transaction.date}`, 30, yPos + 20);

      transaction.items.forEach((item, itemIndex) => {
        doc.text(`${item.name}: ${item.quantity}kg`, 40, yPos + 30 + itemIndex * 10);
      });

      yPos += 60;

      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
    });

    doc.save('transaction-history.pdf');
    toast.success('PDF downloaded successfully!');
  };

  if (loading) {
    return <div className="text-center text-white">Loading transaction history...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto glass-card rounded-xl overflow-hidden mt-10">
      <div className="p-8">
        <div className="flex justify-between mb-8">
          <div className="flex items-center">
            <Search className="w-5 h-5 text-blue-400 mr-2" />
            <input
              type="text"
              placeholder="Search by member name or item"
              className="border-b-2 border-blue-400 bg-transparent p-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-blue-400 mr-2" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border-b-2 border-blue-400 bg-transparent p-2"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item p-4 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-xl font-medium text-white">{transaction.memberName}</h4>
                  <p className="text-sm text-blue-300">{transaction.date}</p>
                </div>
                <div className="flex items-center">
                  <History className="w-5 h-5 text-blue-400 mr-2" />
                  <button
                    onClick={handleExportPDF}
                    className="text-white py-2.5 px-4 rounded-lg font-medium flex items-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Export
                  </button>
                </div>
              </div>

              <div className="mt-4">
                {transaction.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <p className="text-white">{item.name}</p>
                    <p className="text-white">{item.quantity} kg</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
