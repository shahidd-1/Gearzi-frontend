import React, { useState } from 'react';
import { X, Mail, Lock, User, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form States (UNCHANGED - your structure preserved)
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // ✅ UPDATED: Get real backend functions + states from context
  const { login, signup, error: authError, isLoading } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        // ✅ REAL BACKEND LOGIN: identifier can be email OR phone
        await login(emailOrPhone.trim(), password);
      } else {
        // ✅ REAL BACKEND SIGNUP: use phone if provided, else email
        const identifier = signupPhone.trim() || signupEmail.trim();
        await signup(fullName.trim(), identifier, password);
      }
      
      // ✅ Success: clear form and close modal
      setEmailOrPhone('');
      setSignupEmail('');
      setSignupPhone('');
      setPassword('');
      setFullName('');
      onClose();
    } catch (err) {
      // ✅ Error handled by AuthContext (authError state) - UI shows below
    }
  };

  return (
    // Fixed wrapper covering the entire screen, forcing content to the absolute center
    <div className="fixed inset-0 z-[100] w-screen h-screen flex items-center justify-center px-4">
      
      {/* Blurred Dark Overlay */}
      <div 
        className="absolute inset-0 bg-[#000000]/70 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div className="relative bg-[#121212] border border-[#ffffff]/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in duration-200">
        
        {/* X Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-[#ffffff]/60 hover:text-white transition-colors p-1.5 bg-[#ffffff]/5 hover:bg-[#ffffff]/10 rounded-full z-20"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-10">
          
          {/* Header Texts */}
          <div className="text-center mb-8 pt-2">
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-[#ffffff]/60 text-sm font-medium">
              {isLogin ? 'Sign in to manage your gear and rentals.' : 'Join the premier equipment rental community.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* --- SIGN UP FIELDS --- */}
            {!isLogin && (
              <>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ffffff]/40">
                    <User size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name" 
                    className="w-full bg-[#000000] border border-[#ffffff]/10 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#00DF81] text-sm text-white transition-colors"
                    required
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ffffff]/40">
                    <Smartphone size={18} />
                  </div>
                  <input 
                    type="tel" 
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="Phone Number" 
                    className="w-full bg-[#000000] border border-[#ffffff]/10 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#00DF81] text-sm text-white transition-colors"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ffffff]/40">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="Email Address" 
                    className="w-full bg-[#000000] border border-[#ffffff]/10 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#00DF81] text-sm text-white transition-colors"
                    // ✅ Optional: remove required if phone is provided
                    required={!signupPhone.trim()}
                  />
                </div>
              </>
            )}

            {/* --- SIGN IN FIELD (Combined Email/Phone) --- */}
            {isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ffffff]/40">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="Email or Mobile Number" 
                  className="w-full bg-[#000000] border border-[#ffffff]/10 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#00DF81] text-sm text-white transition-colors"
                  required
                />
              </div>
            )}

            {/* --- COMMON PASSWORD FIELD --- */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ffffff]/40">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
                className="w-full bg-[#000000] border border-[#ffffff]/10 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#00DF81] text-sm text-white transition-colors"
                required
              />
            </div>

            {/* ✅ NEW: Show real backend errors here */}
            {authError && (
              <p className="text-red-400 text-xs text-center -mt-2">
                {authError}
              </p>
            )}

            {/* ✅ NEW: Show loading state */}
            {isLoading && (
              <p className="text-[#00DF81] text-xs text-center -mt-2">
                Processing...
              </p>
            )}

            {/* Forgot Password Link (Only on Sign In) */}
            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-xs font-bold text-[#00DF81] hover:text-white transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button - disabled during loading */}
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full bg-[#00DF81] hover:bg-white text-black font-black py-3.5 rounded-xl mt-4 transition-colors shadow-[0_0_15px_rgba(0,223,129,0.2)] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Toggle View Prompts */}
          <div className="mt-8 text-center border-t border-[#ffffff]/10 pt-6">
            {isLogin ? (
              <p className="text-[#ffffff]/60 text-sm">
                New to Gearzi?{' '}
                <button 
                  onClick={() => setIsLogin(false)}
                  className="text-[#00DF81] font-bold hover:underline transition-all"
                >
                  Click here to create an account
                </button>
              </p>
            ) : (
              <p className="text-[#ffffff]/60 text-sm">
                Already have an account?{' '}
                <button 
                  onClick={() => setIsLogin(true)}
                  className="text-[#00DF81] font-bold hover:underline transition-all"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthModal;