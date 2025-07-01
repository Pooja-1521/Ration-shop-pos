import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { QrCode, Package, History, Home } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isMobile = window.innerWidth <= 768;

  const navItems = [
    { path: '/', icon: <QrCode className="w-5 h-5" />, label: 'Scan QR' },
    { path: '/inventory', icon: <Package className="w-5 h-5" />, label: 'Inventory' },
    { path: '/transactions', icon: <History className="w-5 h-5" />, label: 'History' },
  ];

  return (
    <>
      <nav className={`nav-gradient text-white shadow-lg ${isMobile ? 'hidden' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors">
              <Home className="w-6 h-6" />
              <span className="font-bold text-lg">PDS System</span>
            </Link>
            <div className="flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#001845] border-t border-[#002c6a] pb-safe">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-3 px-5 ${
                  location.pathname === item.path ? 'text-blue-400' : 'text-gray-400'
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;