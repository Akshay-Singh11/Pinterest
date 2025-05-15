import React, { useState } from 'react';
import { X, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register, isLoading, error, clearError } = useAuth();
  const { theme } = useTheme();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'login') {
      await login(email, password);
    } else {
      await register(name, email, password);
    }
  };

  const toggleMode = () => {
    clearError();
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className={`${theme === 'dark' ? 'bg-dark-bg' : 'bg-white'} rounded-2xl max-w-md w-full overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-4 ${theme === 'dark' ? 'border-dark-border' : 'border-gray-200'} border-b`}>
          <div className="flex items-center">
            <Logo className="h-8 w-8 text-[#E60023]" />
            <h2 className={`ml-2 text-xl font-bold ${theme === 'dark' ? 'text-dark-text' : 'text-gray-900'}`}>
              {mode === 'login' ? 'Log in to Pinterest' : 'Sign up for Pinterest'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 ${theme === 'dark' ? 'hover:bg-dark-card' : 'hover:bg-gray-100'} rounded-full transition-colors`}
          >
            <X className={`h-5 w-5 ${theme === 'dark' ? 'text-dark-text' : ''}`} />
          </button>
        </div>
        
        {/* Form */}
        <div className="p-6">
          {error && (
            <div className={`mb-4 p-3 rounded-lg flex items-start ${theme === 'dark' ? 'bg-red-900/20 text-red-200' : 'bg-red-50 text-red-600'}`}>
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="name" className={`block text-sm font-medium ${theme === 'dark' ? 'text-dark-text' : 'text-gray-700'} mb-1`}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-3 ${
                    theme === 'dark' 
                      ? 'bg-dark-card border-dark-border text-dark-text' 
                      : 'border-gray-300 text-gray-900'
                  } border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                  placeholder="Enter your name"
                  required={mode === 'register'}
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${theme === 'dark' ? 'text-dark-text' : 'text-gray-700'} mb-1`}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-3 ${
                  theme === 'dark' 
                    ? 'bg-dark-card border-dark-border text-dark-text' 
                    : 'border-gray-300 text-gray-900'
                } border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${theme === 'dark' ? 'text-dark-text' : 'text-gray-700'} mb-1`}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 ${
                  theme === 'dark' 
                    ? 'bg-dark-card border-dark-border text-dark-text' 
                    : 'border-gray-300 text-gray-900'
                } border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                placeholder={mode === 'login' ? 'Enter your password' : 'Create a password (6+ characters)'}
                required
                minLength={6}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#E60023] text-white rounded-full font-medium hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                  {mode === 'login' ? 'Logging in...' : 'Signing up...'}
                </>
              ) : (
                mode === 'login' ? 'Log in' : 'Sign up'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className={theme === 'dark' ? 'text-dark-text/70' : 'text-gray-600'}>
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={toggleMode}
                className="ml-1 text-[#E60023] hover:underline font-medium"
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
