import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import QRScanner from './components/QRScanner';
import FamilyMembers from './components/FamilyMembers';
import StockAllocation from './components/StockAllocation';
import Inventory from './components/Inventory';
import TransactionHistory from './components/TransactionHistory';
import Navbar from './components/Navbar';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'shopkeeper'>('shopkeeper');

  if (!isAuthenticated) {
    return (
      <>
        <Login onLogin={(role) => {
          setIsAuthenticated(true);
          setUserRole(role);
        }} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar userRole={userRole} />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<QRScanner />} />
            <Route path="/family/:id" element={<FamilyMembers />} />
            <Route path="/stock/:familyId/:memberId" element={<StockAllocation />} />
            <Route path="/inventory" element={<Inventory userRole={userRole} />} />
            <Route path="/transactions" element={<TransactionHistory />} />
          </Routes>
        </div>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;