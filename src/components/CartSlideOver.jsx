import React, { useEffect, useState } from 'react';
import { X, Trash2, Minus, Plus, ShoppingCart, ArrowRight, Check, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthProvider';
import { rentalService, getApiError } from '../api/services';

const CartSlideOver = ({ isOpen, onClose, onLoginClick }) => {
  const { cartItems, updateDays, removeFromCart, clearCart, startDate, endDate } = useCart();
  const { user } = useAuth();

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [checkoutPhone, setCheckoutPhone] = useState('');

  // Pricing
  const subtotal = cartItems.reduce((acc, item) => acc + item.dailyRate * item.days, 0);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Reset state when cart closes
  useEffect(() => {
    if (!isOpen) {
      setSubmitError(null);
      setSubmitSuccess(false);
    }
  }, [isOpen]);

  const formatDate = (date) => {
    if (!date) return '—';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleCheckoutAction = async () => {
    if (!agreedToTerms) return;

    if (!user) {
      onLoginClick();
      return;
    }

    if (!startDate || !endDate) {
      setSubmitError('Please select rental dates from the header calendar first.');
      return;
    }

    // Phone — use user.phone, fallback to manually entered phone
    const phone = user.phone || checkoutPhone;
    if (!phone) {
      setSubmitError('Please enter your WhatsApp number to continue.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const promises = cartItems.map((item) =>
        rentalService.create({
          product_id: item.id,
          customer_phone: phone,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          notes: `Rental request for ${item.title}. Duration: ${item.days} day(s).`,
        })
      );

      await Promise.all(promises);
      setSubmitSuccess(true);
      clearCart();

      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 3000);

    } catch (err) {
      setSubmitError(getApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-[#000000]/70 backdrop-blur-sm z-[998] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-[999] flex flex-col bg-[#101114] border-l border-[#ffffff]/10 shadow-2xl transform transition-transform duration-400 ease-in-out w-full sm:w-[350px] md:w-[420px] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#ffffff]/10 flex items-center justify-between bg-[#101114] z-10 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-white tracking-tight">Your Cart</h2>
            <span className="bg-[#00DF81]/10 text-[#00DF81] text-[10px] font-bold px-2 py-1 rounded-md tracking-wider uppercase">
              {cartItems.length} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#ffffff]/60 hover:text-white p-2 bg-[#ffffff]/5 hover:bg-[#ffffff]/10 rounded-full transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Success State */}
        {submitSuccess && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-[#00DF81]/10 rounded-full flex items-center justify-center mb-4 border border-[#00DF81]/30">
              <Check size={32} className="text-[#00DF81]" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Request Sent!</h3>
            <p className="text-[#ffffff]/60 text-sm leading-relaxed">
              Your rental request has been submitted. The owner will contact you via WhatsApp shortly.
            </p>
          </div>
        )}

        {/* Cart Items */}
        {!submitSuccess && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-60 mt-10">
                <ShoppingCart size={56} className="mb-4 text-[#ffffff]/40" />
                <p className="text-lg font-medium text-white">Your cart is empty.</p>
                <p className="text-sm text-[#ffffff]/60 mt-2">Add some professional gear to get started.</p>
              </div>
            ) : (
              <>
                {/* Rental Date Summary */}
                {startDate && endDate && (
                  <div className="bg-[#00DF81]/5 border border-[#00DF81]/20 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-[#ffffff]/40 font-bold uppercase tracking-wider mb-1">Rental Period</p>
                      <p className="text-sm font-bold text-white">
                        {formatDate(startDate)} → {formatDate(endDate)}
                      </p>
                    </div>
                    <div className="text-[#00DF81] text-xs font-bold bg-[#00DF81]/10 px-2 py-1 rounded-lg">
                      {Math.ceil((endDate - startDate) / (1000 * 3600 * 24))} days
                    </div>
                  </div>
                )}

                {/* Cart Items */}
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#000000] border border-[#ffffff]/5 p-4 rounded-2xl flex gap-4 hover:border-[#00DF81]/30 transition-colors"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 bg-[#121212] rounded-xl border border-[#ffffff]/5 p-2 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain drop-shadow-md"
                        />
                      ) : item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain drop-shadow-md"
                        />
                      ) : (
                        <ShoppingCart size={24} className="text-[#ffffff]/20" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-white leading-tight line-clamp-2">{item.title}</h3>
                        <p className="text-[10px] text-[#ffffff]/40 font-bold uppercase tracking-wider mt-1">
                          {item.category || 'Gear'}
                        </p>
                      </div>

                      <div className="flex justify-between items-end mt-3">
                        <div className="flex items-center bg-[#121212] border border-[#ffffff]/10 rounded-lg p-0.5">
                          <button
                            onClick={() => updateDays(item.id, -1)}
                            className="p-1.5 text-[#ffffff]/60 hover:text-white transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-bold text-xs text-white">{item.days}d</span>
                          <button
                            onClick={() => updateDays(item.id, 1)}
                            className="p-1.5 text-[#ffffff]/60 hover:text-white transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="text-right flex items-center gap-4">
                          <p className="text-[#00DF81] font-black text-sm">₹{item.dailyRate * item.days}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#ffffff]/30 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Checkout Section */}
        {!submitSuccess && cartItems.length > 0 && (
          <div className="p-6 border-t border-[#ffffff]/10 bg-[#101114] shrink-0">

            {/* Error */}
            {submitError && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
                <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-400 text-xs font-medium">{submitError}</p>
              </div>
            )}

            {/* Phone input — only shown if user has no phone on file */}
            {user && !user.phone && (
              <div className="mb-4">
                <label className="block text-[10px] font-black text-[#ffffff]/40 uppercase tracking-wider mb-1.5">
                  Your WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={checkoutPhone}
                  onChange={(e) => setCheckoutPhone(e.target.value)}
                  placeholder="+91XXXXXXXXXX"
                  className="w-full bg-[#000000] border border-[#ffffff]/10 rounded-xl px-4 py-2.5 text-white text-sm font-medium placeholder-[#ffffff]/20 focus:outline-none focus:border-[#00DF81]/50 transition-colors"
                />
              </div>
            )}

            {/* Totals */}
            <div className="space-y-3 mb-5 text-sm">
              <div className="flex justify-between text-[#ffffff]/70 font-medium">
                <span>Subtotal</span>
                <span className="text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#ffffff]/70 font-medium">
                <span>Delivery</span>
                <span className="text-[#00DF81]">Self Pickup</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-[#ffffff]/10">
                <span className="font-bold text-base text-white">Total</span>
                <span className="text-2xl font-black text-[#00DF81]">₹{subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 mb-4 cursor-pointer group">
              <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  className="peer appearance-none w-5 h-5 border-2 border-[#ffffff]/20 rounded-md checked:bg-[#00DF81] checked:border-[#00DF81] transition-all cursor-pointer"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <Check
                  size={14}
                  className="absolute text-[#000000] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                  strokeWidth={3}
                />
              </div>
              <span className="text-[#ffffff]/60 text-xs font-medium leading-relaxed group-hover:text-[#ffffff]/80 transition-colors">
                I agree to the{' '}
                <Link to="/terms" onClick={onClose} className="text-[#00DF81] hover:underline">
                  Terms and Conditions
                </Link>{' '}
                and acknowledge that ID verification is required.
              </span>
            </label>

            {/* Submit Button */}
            <button
              onClick={handleCheckoutAction}
              disabled={!agreedToTerms || isSubmitting}
              className={`w-full font-black py-4 rounded-xl text-[15px] flex items-center justify-center gap-2 transition-all ${
                agreedToTerms && !isSubmitting
                  ? 'bg-[#00DF81] text-[#000000] hover:bg-[#00DF81]/90 shadow-[0_0_20px_rgba(0,223,129,0.2)] hover:scale-[1.01] cursor-pointer'
                  : 'bg-[#ffffff]/5 text-[#ffffff]/30 cursor-not-allowed border border-[#ffffff]/10'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending Request...
                </>
              ) : user ? (
                <>
                  Send Rental Request <ArrowRight size={18} strokeWidth={2.5} />
                </>
              ) : (
                <>
                  Login to Continue <ArrowRight size={18} strokeWidth={2.5} />
                </>
              )}
            </button>

            {user && (
              <p className="text-center text-[10px] text-[#ffffff]/30 mt-3 font-medium">
                Owner will confirm via WhatsApp to{' '}
                {user.phone || checkoutPhone || 'your number'}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CartSlideOver;