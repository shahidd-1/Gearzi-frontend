import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart, LogOut, Menu, X, Home } from 'lucide-react';
// import { useAuth } from '../context/AuthContext'; // Uncomment this to use your logout logic

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // const { logout } = useAuth(); // Uncomment when auth is fully wired up

  // Define your admin routes here
  const navItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/inventory', icon: <Package size={20} />, label: 'Inventory' },
    { path: '/admin/analytics', icon: <BarChart size={20} />, label: 'Analytics' },
  ];

  return (
    <div className="flex h-screen bg-[#000000] text-white overflow-hidden">
      
      {/* ========================================= */}
      {/* MOBILE TOP NAVIGATION BAR                 */}
      {/* ========================================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#121212] border-b border-[#ffffff]/10 flex items-center justify-between px-4 z-40 shadow-md">
        <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white italic tracking-tighter">Gearzi</span>
            <span className="text-[#00DF81] text-[10px] font-bold uppercase tracking-widest mt-1">Admin</span>
        </div>
        
        {/* Hamburger Menu Button */}
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="text-[#ffffff]/80 hover:text-[#00DF81] transition-colors p-2"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* ========================================= */}
      {/* MOBILE SIDEBAR BACKDROP OVERLAY           */}
      {/* ========================================= */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ========================================= */}
      {/* MAIN SIDEBAR (Responsive)                 */}
      {/* ========================================= */}
      <div className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-[#ffffff]/10 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* Sidebar Header / Logo */}
        <div className="h-16 md:h-20 flex items-center justify-between px-6 border-b border-[#ffffff]/10">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white italic tracking-tighter">Gearzi</span>
              <span className="text-[#ffffff]/40 text-[10px] font-bold uppercase tracking-widest mt-1">Admin</span>
            </div>
            
            {/* Mobile Close 'X' Button */}
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="md:hidden text-[#ffffff]/60 hover:text-white p-1"
            >
              <X size={20} />
            </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)} // Auto-close sidebar on mobile after clicking a link
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#00DF81]/10 text-[#00DF81] border border-[#00DF81]/20' 
                    : 'text-[#ffffff]/60 hover:bg-[#ffffff]/5 hover:text-white border border-transparent'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ========================================= */}
        {/* BOTTOM ACTIONS (Exit & Logout)            */}
        {/* ========================================= */}
        <div className="p-4 border-t border-[#ffffff]/10 space-y-2 pb-6">
          
          {/* 1. Exit Admin (Go back to Store without logging out) */}
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-[#ffffff]/70 hover:bg-[#ffffff]/5 hover:text-white transition-all duration-200"
          >
            <Home size={20} />
            Exit Admin
          </button>

          {/* 2. Full Logout */}
          <button 
            onClick={() => {
                // logout(); // Call your logout function here
                navigate('/');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-[#ff4444]/80 hover:bg-[#ff4444]/10 hover:text-[#ff4444] transition-all duration-200"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* ========================================= */}
      {/* MAIN DASHBOARD CONTENT AREA                 */}
      {/* ========================================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden pt-16 md:pt-0">
          <main className="flex-1 overflow-y-auto bg-[#121212] p-4 md:p-8">
            
            {/* The active page component gets injected here */}
            <Outlet />

          </main>
      </div>
      
    </div>
  );
};

export default AdminLayout;