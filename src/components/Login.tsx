import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'batman@gothamcity' && password === 'batwoman') {
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="login-container py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src='https://blogmedia.testbook.com/blog/wp-content/uploads/2023/05/seal-of-tamilnadu-9daefcb0.jpg'
              alt="TN Logo"
              className="h-12 mr-3"
            />
            <div>
              <h1 className="text-white text-xl font-semibold">Government of Tamil Nadu</h1>
              <p className="text-gray-300 text-sm">Public Distribution System</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-88px)]">
        <div className="login-card w-full max-w-md p-8 rounded-lg">
          <div className="text-center mb-8">
            <div className="bg-[#] p-4 rounded-lg inline-block mb-6">
              <img
                src='https://th.bing.com/th/id/OIP.gRgT8PSSi0vs3gNMytNqXwAAAA?w=334&h=334&rs=1&pid=ImgDetMain'
                alt="Ration Card"
                className="h-12 w-auto"
              />
            </div>
            <h2 className="text-2xl font-bold text-[#003366] mb-2">Ration Shop Management Portal</h2>
            <p className="text-gray-600">Please login to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field w-full px-4 py-2 rounded"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full px-4 py-2 rounded"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className="w-full login-button text-white py-2 rounded font-medium hover:bg-[#004080] transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            © 2024 Government of Tamil Nadu - Public Distribution System
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;