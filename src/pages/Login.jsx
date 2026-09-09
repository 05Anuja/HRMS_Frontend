import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authcontext';
import Axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { Loader2, Lock, Mail, Eye, EyeOff, ShieldCheck, Zap, Users as UsersIcon } from 'lucide-react';
import loginBg from '../assets/login-bg.png';
import logoImg from '../assets/Silgate_Solutions_Logo.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await Axios.post('/auth/login', { email, password });
      if (response.data.success) {
        toast.success('Welcome back!');
        login(response.data.data, response.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      // toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-black overflow-hidden font-sans selection:bg-zinc-800 selection:text-white">
      {/* LEFT SIDE - BRANDING & IMAGE (Minimal Monochrome Dark) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black border-r border-zinc-200/10">
        <img 
          src={loginBg} 
          alt="Login Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="relative z-10 flex flex-col justify-between p-16 w-full text-white">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black tracking-[0.25em] text-zinc-400 uppercase">HR MANAGEMENT SYSTEM</span>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-black leading-tight tracking-tight uppercase">
              Manage your <br />
              <span className="text-zinc-400">Workforce</span> better.
            </h2>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed font-medium">
              The all-in-one platform for modern HR teams. Streamline recruitment, 
              manage users, and track performance with ease.
            </p>
          </div>

          <div className="text-zinc-600 text-xs font-bold uppercase tracking-wider">
            &copy; 2026 Silgate Solutions Ltd. All rights reserved.
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-zinc-50/50 dark:bg-black">
        <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-right-12 duration-700">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Small Logo */}
            <div className="h-12 flex items-center justify-center transition-transform hover:scale-105 duration-500">
              <img src={logoImg} alt="Silgate Solutions" className="h-full object-contain" />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-sm font-black text-zinc-900 dark:text-white tracking-[0.2em] uppercase">Welcome Back</h1>
              <p className="text-zinc-400 dark:text-zinc-500 text-xs font-black uppercase tracking-widest">
                Log in to your Silgate HR account
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none transition-transform group-focus-within:scale-110 duration-300">
                    <Mail className="w-4 h-4 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:border-black dark:focus:border-white focus:ring-0 transition-all text-zinc-800 dark:text-white placeholder:text-zinc-500 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Password</label>
                  <button type="button" className="text-xs font-black text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest">
                    Forgot?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none transition-transform group-focus-within:scale-110 duration-300">
                    <Lock className="w-4 h-4 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-2.5 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:border-black dark:focus:border-white focus:ring-0 transition-all text-zinc-800 dark:text-white placeholder:text-zinc-500 text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-3 bg-black hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black rounded-lg font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 border border-zinc-200/10 shadow-lg shadow-zinc-950/10 overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  
  );
};

export default Login;
