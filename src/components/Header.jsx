import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, ShieldAlert, MapPin, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthProvider';
import { useCart } from '../context/CartContext';
import CartSlideOver from './CartSlideOver';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });

  // today reference (stable)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ✅ Dates now come from CartContext so CartSlideOver can access them
  const { cartItems, startDate, setStartDate, endDate, setEndDate } = useCart();
  const { user, logout } = useAuth();

  const calendarRef = useRef(null);
  const location = useLocation();

  const handleMobileClick = () => setIsMobileMenuOpen(false);
  const isActive = (path) => location.pathname === path;

  // Close auth modal when user logs in
  useEffect(() => {
    if (user && isAuthOpen) setIsAuthOpen(false);
  }, [user]);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
        setIsCalendarOpen(false);
        setIsMobileMenuOpen(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Click outside calendar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDatePill = (start, end) => {
    if (!start) return 'Select Dates';
    const startMonth = start.toLocaleString('en-US', { month: 'short' });
    const startDay = start.getDate();
    if (!end) return `${startDay} ${startMonth} – Add Drop-off`;
    const endMonth = end.toLocaleString('en-US', { month: 'short' });
    const endDay = end.getDate();
    if (startMonth === endMonth) {
      return `${startDay} – ${endDay} ${startMonth}`;
    }
    return `${startDay} ${startMonth} – ${endDay} ${endMonth}`;
  };

  const isSameDay = (d1, d2) =>
    d1 && d2 &&
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const handleDateClick = (dayNum) => {
    const clickedDate = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), dayNum);
    if (clickedDate < today) return;
    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (clickedDate > startDate) {
      setEndDate(clickedDate);
    } else {
      setStartDate(clickedDate);
      setEndDate(null);
    }
  };

  const handleQuickSelect = (daysToAdd) => {
    if (startDate) {
      const newEnd = new Date(startDate);
      newEnd.setDate(startDate.getDate() + daysToAdd);
      setEndDate(newEnd);
      setCurrentMonthDate(new Date(newEnd.getFullYear(), newEnd.getMonth(), 1));
    }
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    const prev = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1);
    if (
      prev.getFullYear() < today.getFullYear() ||
      (prev.getFullYear() === today.getFullYear() && prev.getMonth() < today.getMonth())
    ) return;
    setCurrentMonthDate(prev);
  };

  const renderCalendar = () => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let firstDayIndex = new Date(year, month, 1).getDay();
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const blanks = Array(firstDayIndex).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    let totalDays = 0;
    if (startDate && endDate) {
      totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    }

    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

    return (
      <div className="absolute top-full mt-3 bg-[#121212]/95 backdrop-blur-xl border border-[#ffffff]/10 rounded-3xl p-6 shadow-2xl w-[320px] z-50 left-1/2 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-0">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Rental dates</h3>
            <p className="text-[#00DF81] text-xs font-bold tracking-widest uppercase mt-1">
              {currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              disabled={isCurrentMonth}
              className={`p-1.5 rounded-full transition-colors ${isCurrentMonth ? 'text-[#ffffff]/20 cursor-not-allowed' : 'text-white hover:bg-[#ffffff]/10'}`}
            >
              <ChevronLeft size={18} />
            </button>
            <button onClick={nextMonth} className="p-1.5 text-white hover:bg-[#ffffff]/10 rounded-full transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
            <div key={d} className="text-[9px] font-black tracking-widest text-[#ffffff]/40">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2 text-center text-sm font-bold">
          {blanks.map((_, i) => <div key={`blank-${i}`} />)}
          {days.map(day => {
            const currentDate = new Date(year, month, day);
            const isPast = currentDate < today;
            const isStart = isSameDay(currentDate, startDate);
            const isEnd = isSameDay(currentDate, endDate);
            const inRange = startDate && endDate && currentDate > startDate && currentDate < endDate;
            return (
              <div key={day} className="relative flex items-center justify-center h-8">
                {inRange && <div className="absolute inset-0 bg-[#00DF81]/20" />}
                {isStart && endDate && <div className="absolute right-0 w-1/2 h-full bg-[#00DF81]/20" />}
                {isEnd && startDate && <div className="absolute left-0 w-1/2 h-full bg-[#00DF81]/20" />}
                <button
                  disabled={isPast}
                  onClick={() => handleDateClick(day)}
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isPast
                      ? 'text-[#ffffff]/20 cursor-not-allowed'
                      : (isStart || isEnd)
                      ? 'bg-[#00DF81] text-[#000000] font-black'
                      : inRange
                      ? 'text-[#00DF81]'
                      : 'text-white hover:bg-[#ffffff]/10'
                  }`}
                >
                  {day}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between gap-2 mt-6 border-t border-[#ffffff]/10 pt-5">
          {[
            { label: '2d', val: 2 },
            { label: '5d', val: 5 },
            { label: '1w', val: 7 },
            { label: '2w', val: 14 },
          ].map(quick => (
            <button
              key={quick.label}
              onClick={() => handleQuickSelect(quick.val)}
              className="flex-1 py-1.5 bg-[#ffffff]/5 hover:bg-[#ffffff]/10 border border-[#ffffff]/10 rounded-full text-xs font-bold text-[#ffffff]/80 transition-colors"
            >
              {quick.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsCalendarOpen(false)}
          className="w-full bg-[#00DF81] hover:bg-white text-black font-bold py-3.5 rounded-2xl mt-4 transition-colors shadow-[0_0_15px_rgba(0,223,129,0.2)]"
        >
          Confirm {totalDays > 0 ? `${totalDays} days` : 'Dates'}
        </button>
      </div>
    );
  };

  return (
    <div className="relative w-full">

      {/* MAIN HEADER */}
      <div className={`fixed top-6 z-50 w-full px-4 sm:px-8 lg:px-16 2xl:px-32 flex justify-center transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-[150%]'}`}>
        <header className="w-full bg-[#121212]/95 backdrop-blur-md border border-[#ffffff]/10 rounded-3xl lg:rounded-full text-[#ffffff] shadow-2xl relative" ref={calendarRef}>
          <div className="px-6 lg:px-10 py-4 flex items-center justify-between">

            {/* LEFT WING */}
            <div className="flex-1 flex items-center gap-6 lg:gap-10 justify-start">
              <Link to="/" className="cursor-pointer shrink-0">
                <span className="text-3xl font-black italic tracking-wider">
                  <span className="text-[#00DF81]">G</span><span className="text-white">earzi</span>
                </span>
              </Link>
              <nav className="hidden lg:flex items-center space-x-6 xl:space-x-10 font-bold text-[15px] tracking-wide">
                <Link to="/products" className={`transition-colors ${isActive('/products') ? 'text-[#00DF81]' : 'text-[#ffffff]/60 hover:text-white'}`}>Products</Link>
                <Link to="/how-it-works" className={`whitespace-nowrap transition-colors ${isActive('/how-it-works') ? 'text-[#00DF81]' : 'text-[#ffffff]/60 hover:text-white'}`}>How It Works</Link>
              </nav>
            </div>

            {/* CENTER WING — DATE PILL */}
            <div className="hidden lg:flex shrink-0 items-center bg-[#000000] border border-[#ffffff]/10 rounded-full pl-4 pr-2 py-2 shadow-inner relative z-20">
              <div className="flex items-center gap-2 border-r border-[#ffffff]/10 pr-4 hover:text-[#00DF81] transition-colors">
                <MapPin size={16} className="text-[#00DF81]" />
                <select className="bg-transparent text-[14px] font-bold text-white outline-none cursor-pointer focus:ring-0 appearance-none min-w-[90px]">
                  <option value="kozhikode" className="bg-[#121212]">Kozhikode</option>
                  <option value="bangalore" className="bg-[#121212]">Bangalore</option>
                </select>
              </div>
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="flex items-center gap-2 pl-4 pr-4 py-1.5 text-[14px] font-bold hover:text-[#00DF81] transition-colors whitespace-nowrap"
              >
                <CalendarIcon size={16} className={isCalendarOpen ? 'text-[#00DF81]' : 'text-[#ffffff]/60'} />
                {formatDatePill(startDate, endDate)}
              </button>
              {isCalendarOpen && renderCalendar()}
            </div>

            {/* RIGHT WING */}
            <div className="flex-1 flex items-center gap-4 lg:gap-8 justify-end">
              <nav className="hidden lg:flex items-center space-x-6 xl:space-x-10 font-bold text-[15px] tracking-wide">
                <Link to="/contact" className={`transition-colors ${isActive('/contact') ? 'text-[#00DF81]' : 'text-[#ffffff]/60 hover:text-white'}`}>Contact</Link>
                <Link to="/terms" className={`transition-colors ${isActive('/terms') ? 'text-[#00DF81]' : 'text-[#ffffff]/60 hover:text-white'}`}>Terms</Link>
              </nav>

              <div className="flex items-center space-x-5 md:space-x-6">

                {/* Cart Button */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className={`transition-colors relative ${isCartOpen ? 'text-[#00DF81]' : 'text-[#ffffff]/60 hover:text-white'}`}
                >
                  <ShoppingCart size={22} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 bg-[#00DF81] text-[#000000] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </button>

                {/* User / Login */}
                {user ? (
                  <div className="hidden sm:flex items-center space-x-3 border border-[#ffffff]/20 rounded-full pl-4 pr-5 py-2 bg-[#ffffff]/5">
                    {user.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-1.5 text-[#00DF81] font-bold text-[12px] uppercase tracking-wider pr-4 hover:text-white transition-colors border-r border-[#ffffff]/20">
                        <ShieldAlert size={16} /> Admin
                      </Link>
                    )}
                    <div className="flex items-center space-x-2 border-r border-[#ffffff]/20 pr-4">
                      <div className="text-[#00DF81]"><User size={18} /></div>
                      <span className="font-semibold text-[14px] tracking-wide truncate max-w-[100px]">{user.name}</span>
                    </div>
                    <button onClick={logout} className="text-[#ffffff]/60 hover:text-red-400 transition-colors flex items-center" title="Logout">
                      <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="hidden sm:flex items-center space-x-2 border border-[#ffffff]/20 hover:bg-[#ffffff]/10 rounded-full px-6 py-2.5 transition-colors whitespace-nowrap"
                  >
                    <span className="font-bold text-[14px] tracking-wide">Login</span>
                  </button>
                )}

                {/* Mobile Burger */}
                <button className="lg:hidden text-[#ffffff]/60 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>
          </div>

          {/* MOBILE DATE PILL */}
          <div className="lg:hidden px-4 pb-4">
            <div className="flex items-center justify-center bg-[#000000] border border-[#ffffff]/10 rounded-full py-2.5 shadow-inner w-full">
              <div className="flex items-center gap-1.5 border-r border-[#ffffff]/10 pr-3 hover:text-[#00DF81] transition-colors">
                <MapPin size={14} className="text-[#00DF81]" />
                <select className="bg-transparent text-[13px] font-bold text-white outline-none cursor-pointer focus:ring-0 appearance-none min-w-[75px]">
                  <option value="kozhikode" className="bg-[#121212]">Kozhikode</option>
                  <option value="bangalore" className="bg-[#121212]">Bangalore</option>
                </select>
              </div>
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="flex items-center gap-2 pl-3 hover:text-[#00DF81] transition-colors"
              >
                <CalendarIcon size={14} className={isCalendarOpen ? 'text-[#00DF81]' : 'text-[#ffffff]/60'} />
                <span className="text-[13px] font-bold text-white whitespace-nowrap">
                  {formatDatePill(startDate, endDate)}
                </span>
              </button>
            </div>
            {isCalendarOpen && renderCalendar()}
          </div>

          {/* MOBILE BURGER MENU */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-[#121212]/95 backdrop-blur-md border border-[#ffffff]/10 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl lg:hidden mx-2">
              <nav className="flex flex-col space-y-4">
                <Link to="/" onClick={handleMobileClick} className={`text-base font-bold transition flex items-center border-b border-[#ffffff]/10 pb-3 ${isActive('/') ? 'text-[#00DF81]' : 'text-[#ffffff]/80 hover:text-white'}`}>Home</Link>
                <Link to="/products" onClick={handleMobileClick} className={`text-base font-bold transition flex items-center border-b border-[#ffffff]/10 pb-3 ${isActive('/products') ? 'text-[#00DF81]' : 'text-[#ffffff]/80 hover:text-white'}`}>Products</Link>
                <Link to="/contact" onClick={handleMobileClick} className={`text-base font-bold transition flex items-center border-b border-[#ffffff]/10 pb-3 ${isActive('/contact') ? 'text-[#00DF81]' : 'text-[#ffffff]/80 hover:text-white'}`}>Contact</Link>
                <Link to="/how-it-works" onClick={handleMobileClick} className={`text-base font-bold transition flex items-center border-b border-[#ffffff]/10 pb-3 ${isActive('/how-it-works') ? 'text-[#00DF81]' : 'text-[#ffffff]/80 hover:text-white'}`}>How It Works</Link>
                <Link to="/terms" onClick={handleMobileClick} className={`text-base font-bold transition flex items-center border-b border-[#ffffff]/10 pb-3 ${isActive('/terms') ? 'text-[#00DF81]' : 'text-[#ffffff]/80 hover:text-white'}`}>Terms & Conditions</Link>
              </nav>

              {user ? (
                <div className="sm:hidden flex flex-col gap-3 pt-2">
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={handleMobileClick} className="flex items-center justify-center gap-2 bg-[#00DF81]/10 text-[#00DF81] border border-[#00DF81]/20 rounded-full py-2 font-bold text-sm tracking-wide">
                      <ShieldAlert size={16} /> Admin Dashboard
                    </Link>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-[#00DF81] bg-[#ffffff]/5 p-2 rounded-full border border-[#ffffff]/10">
                        <User size={18} />
                      </div>
                      <span className="font-bold text-base tracking-wide">{user.name}</span>
                    </div>
                    <button
                      onClick={() => { logout(); handleMobileClick(); }}
                      className="border border-[#ffffff]/20 hover:bg-red-500/10 hover:border-red-400 p-2 rounded-full text-white hover:text-red-400 transition-colors"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setIsAuthOpen(true); handleMobileClick(); }}
                  className="sm:hidden w-full flex items-center justify-center space-x-2 border border-[#ffffff]/20 hover:bg-[#ffffff]/10 rounded-full py-3 mt-2 transition-colors"
                >
                  <span className="font-bold text-base tracking-wide">Login / Sign Up</span>
                </button>
              )}
            </div>
          )}
        </header>
      </div>

      {/* MOBILE STICKY PILL */}
      <div className={`lg:hidden fixed top-4 z-40 w-full px-4 transition-all duration-300 ${!isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'}`}>
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center justify-center bg-[#121212]/95 backdrop-blur-xl border border-[#ffffff]/10 rounded-full px-5 py-3 shadow-2xl w-full cursor-pointer hover:border-[#ffffff]/30 transition-colors"
        >
          <div className="flex items-center gap-1.5 border-r border-[#ffffff]/10 pr-3">
            <MapPin size={14} className="text-[#00DF81]" strokeWidth={2.5} />
            <span className="text-[13px] font-bold text-white">Kozhikode</span>
          </div>
          <div className="flex items-center gap-2 pl-3">
            <CalendarIcon size={14} className="text-[#ffffff]/60" />
            <span className="text-[13px] font-bold text-white">{formatDatePill(startDate, endDate)}</span>
          </div>
        </div>
      </div>

      <CartSlideOver
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onLoginClick={() => {
          setIsCartOpen(false);
          setIsAuthOpen(true);
        }}
      />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default Header;