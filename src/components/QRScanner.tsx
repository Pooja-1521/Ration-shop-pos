import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Camera, Search } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { mockFamilies } from '../data';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (scanning) {
      scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render((decodedText) => {
        const family = mockFamilies.find(f => f.cardNumber === decodedText);
        if (family) {
          scanner?.clear();
          setScanning(false);
          navigate(`/family/${family.id}`);
        }
      }, (error) => {
        console.warn(error);
      });
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [scanning, navigate]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const family = mockFamilies.find(f => f.cardNumber === cardNumber);
    if (family) {
      navigate(`/family/${family.id}`);
    } else {
      alert('Invalid card number');
    }
  };

  return (
    <div className="max-w-md mx-auto glass-card rounded-xl overflow-hidden mt-10">
      <div className="p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full">
            <QrCode className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-white mb-2">Ration Card Scanner</h1>
        <p className="text-center text-blue-300 mb-8">Scan QR code or enter card number manually</p>
        
        <div className="space-y-6">
          <button
            onClick={() => setScanning(!scanning)}
            className="w-full flex items-center justify-center space-x-2 dispense-button py-4 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            <Camera className="w-6 h-6" />
            <span className="text-lg">{scanning ? 'Stop Scanning' : 'Start Camera Scan'}</span>
          </button>

          {scanning && (
            <div id="qr-reader" className="w-full rounded-lg overflow-hidden"></div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 glass-card text-blue-300">OR</span>
            </div>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-300 mb-1">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter card number (e.g., TN123456)"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="input-field w-full px-4 py-3 rounded-lg focus:outline-none"
                />
                <Search className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <button
              type="submit"
              className="w-full adjust-button text-white py-3 rounded-lg transition-all transform hover:scale-105 font-medium"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;