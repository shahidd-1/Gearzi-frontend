import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Package, Box, Users, Loader2,
  RefreshCw, ChevronDown, ChevronUp, Check, X, AlertCircle
} from 'lucide-react';
import { rentalService, productService, getApiError } from '../../api/services';

const StatCard = ({ icon: Icon, label, value, badge, isLoading }) => (
  <div className="bg-[#121212] border border-[#ffffff]/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-[#ffffff]/20 transition-colors">
    <div className="flex justify-between items-start">
      <div className="bg-[#ffffff]/5 p-3 rounded-xl border border-[#ffffff]/5">
        <Icon size={22} className="text-[#00DF81]" />
      </div>
      {badge !== undefined && (
        <span className="text-[11px] font-bold text-[#00DF81] bg-[#00DF81]/10 px-2 py-1 rounded-lg">
          {badge}
        </span>
      )}
    </div>
    <div>
      <p className="text-[11px] font-bold text-[#ffffff]/40 uppercase tracking-widest mb-1">{label}</p>
      {isLoading ? (
        <div className="h-8 w-20 bg-[#ffffff]/5 rounded-lg animate-pulse" />
      ) : (
        <p className="text-3xl font-black text-white">{value}</p>
      )}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    pending:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    approved:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
    completed: 'bg-[#00DF81]/10 text-[#00DF81] border-[#00DF81]/20',
    rejected:  'bg-red-500/10 text-red-400 border-red-500/20',
    cancelled: 'bg-[#ffffff]/5 text-[#ffffff]/40 border-[#ffffff]/10',
  };
  return (
    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border capitalize ${map[status] || map.pending}`}>
      {status}
    </span>
  );
};

const RentalRow = ({ rental, productMap, onStatusUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [form, setForm] = useState({
    admin_notes: rental.admin_notes || '',
    quoted_amount: rental.quoted_amount || '',
    advance_amount: rental.advance_amount || '',
  });

  const product = productMap[rental.product_id];
  const productName = product?.name || `Product #${rental.product_id}`;
  const dailyRate = product?.daily_rate || null;

  // Show quoted_amount if set, else show daily_rate as reference
  const displayAmount = rental.quoted_amount
    ? `₹${rental.quoted_amount}`
    : dailyRate
    ? `₹${dailyRate}/day`
    : '—';

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const handleSubmit = async (newStatus) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await rentalService.updateStatus(rental.id, {
        status: newStatus,
        admin_notes: form.admin_notes || null,
        quoted_amount: form.quoted_amount ? parseFloat(form.quoted_amount) : null,
        advance_amount: form.advance_amount ? parseFloat(form.advance_amount) : null,
      });
      onStatusUpdate();
      setIsExpanded(false);
    } catch (err) {
      setSubmitError(getApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = 'w-full bg-[#000000] border border-[#ffffff]/10 rounded-xl px-4 py-2.5 text-white text-sm font-medium placeholder-[#ffffff]/20 focus:outline-none focus:border-[#00DF81]/50 transition-colors';
  const labelClass = 'block text-[10px] font-black text-[#ffffff]/40 uppercase tracking-wider mb-1.5';

  const isPending = rental.status === 'pending';
  const isApproved = rental.status === 'approved';

  return (
    <>
      <tr
        className={`border-b border-[#ffffff]/5 transition-colors cursor-pointer ${isExpanded ? 'bg-[#ffffff]/3' : 'hover:bg-[#ffffff]/2'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td className="px-6 py-4 text-sm font-bold text-white">
          ORD-{String(rental.id).padStart(3, '0')}
        </td>
        <td className="px-6 py-4 text-sm text-[#ffffff]/70 font-medium">
          {productName}
        </td>
        <td className="px-6 py-4 text-sm text-[#ffffff]/60 font-medium">
          {formatDate(rental.start_date)} – {formatDate(rental.end_date)}
        </td>
        <td className="px-6 py-4 text-sm text-[#ffffff]/60 font-medium">
          {rental.customer_phone || '—'}
        </td>
        <td className="px-6 py-4">
          <StatusBadge status={rental.status} />
        </td>
        <td className="px-6 py-4">
          <span className={`text-sm font-black ${rental.quoted_amount ? 'text-[#00DF81]' : 'text-[#ffffff]/40'}`}>
            {displayAmount}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="text-[#ffffff]/40 hover:text-white transition-colors">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr className="border-b border-[#ffffff]/5 bg-[#000000]/40">
          <td colSpan={7} className="px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Left — Details */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-[#ffffff]/30 uppercase tracking-widest mb-3">Rental Details</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#121212] border border-[#ffffff]/5 rounded-xl p-3">
                    <p className="text-[10px] text-[#ffffff]/40 font-bold uppercase tracking-wider mb-1">Product</p>
                    <p className="text-sm font-bold text-white">{productName}</p>
                  </div>
                  <div className="bg-[#121212] border border-[#ffffff]/5 rounded-xl p-3">
                    <p className="text-[10px] text-[#ffffff]/40 font-bold uppercase tracking-wider mb-1">Daily Rate</p>
                    <p className="text-sm font-bold text-[#00DF81]">
                      {dailyRate ? `₹${dailyRate}` : '—'}
                    </p>
                  </div>
                  <div className="bg-[#121212] border border-[#ffffff]/5 rounded-xl p-3">
                    <p className="text-[10px] text-[#ffffff]/40 font-bold uppercase tracking-wider mb-1">Start Date</p>
                    <p className="text-sm font-bold text-white">
                      {new Date(rental.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="bg-[#121212] border border-[#ffffff]/5 rounded-xl p-3">
                    <p className="text-[10px] text-[#ffffff]/40 font-bold uppercase tracking-wider mb-1">End Date</p>
                    <p className="text-sm font-bold text-white">
                      {new Date(rental.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="bg-[#121212] border border-[#ffffff]/5 rounded-xl p-3">
                    <p className="text-[10px] text-[#ffffff]/40 font-bold uppercase tracking-wider mb-1">Customer Phone</p>
                    <p className="text-sm font-bold text-white">{rental.customer_phone || '—'}</p>
                  </div>
                  <div className="bg-[#121212] border border-[#ffffff]/5 rounded-xl p-3">
                    <p className="text-[10px] text-[#ffffff]/40 font-bold uppercase tracking-wider mb-1">Rental Days</p>
                    <p className="text-sm font-bold text-white">
                      {Math.ceil((new Date(rental.end_date) - new Date(rental.start_date)) / (1000 * 3600 * 24))} days
                    </p>
                  </div>
                </div>

                {rental.notes && (
                  <div className="bg-[#121212] border border-[#ffffff]/5 rounded-xl p-3">
                    <p className="text-[10px] text-[#ffffff]/40 font-bold uppercase tracking-wider mb-1">Customer Notes</p>
                    <p className="text-sm text-[#ffffff]/70 font-medium">{rental.notes}</p>
                  </div>
                )}

                {rental.admin_notes && (
                  <div className="bg-[#00DF81]/5 border border-[#00DF81]/10 rounded-xl p-3">
                    <p className="text-[10px] text-[#00DF81]/60 font-bold uppercase tracking-wider mb-1">Previous Admin Notes</p>
                    <p className="text-sm text-[#ffffff]/70 font-medium">{rental.admin_notes}</p>
                  </div>
                )}
              </div>

              {/* Right — Action Form */}
              <div>
                <p className="text-[10px] font-black text-[#ffffff]/30 uppercase tracking-widest mb-3">
                  {isPending ? 'Review & Respond' : 'Update Status'}
                </p>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Quoted Amount (₹)</label>
                      <input
                        type="number"
                        value={form.quoted_amount}
                        onChange={(e) => setForm({ ...form, quoted_amount: e.target.value })}
                        placeholder={dailyRate ? `e.g. ${dailyRate}` : 'e.g. 2500'}
                        className={inputClass}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Advance Amount (₹)</label>
                      <input
                        type="number"
                        value={form.advance_amount}
                        onChange={(e) => setForm({ ...form, advance_amount: e.target.value })}
                        placeholder="e.g. 500"
                        className={inputClass}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Admin Notes</label>
                    <textarea
                      value={form.admin_notes}
                      onChange={(e) => setForm({ ...form, admin_notes: e.target.value })}
                      placeholder="Add a note to send to customer via WhatsApp..."
                      className={`${inputClass} resize-none h-20`}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {submitError && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs font-medium">
                      <AlertCircle size={14} /> {submitError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-1">
                    {(isPending || rental.status === 'rejected') && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSubmit('approved'); }}
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#00DF81] hover:bg-[#00DF81]/90 text-black font-black text-sm py-3 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                        Approve
                      </button>
                    )}

                    {(isPending || isApproved) && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSubmit('rejected'); }}
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-black text-sm py-3 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <X size={15} />}
                        Reject
                      </button>
                    )}

                    {isApproved && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSubmit('completed'); }}
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 font-black text-sm py-3 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const Dashboard = () => {
  const [rentals, setRentals] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [rentalsData, productsData] = await Promise.all([
        rentalService.getAll(),
        productService.getAll(),
      ]);
      setRentals(rentalsData);
      setProducts(productsData);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Build product id → full product object map
  const productMap = products.reduce((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {});

  const activeRentals = rentals.filter((r) => r.status === 'approved').length;
  const pendingRentals = rentals.filter((r) => r.status === 'pending').length;
  const totalRevenue = rentals
    .filter((r) => r.quoted_amount)
    .reduce((sum, r) => sum + Number(r.quoted_amount), 0);
  const totalGear = products.filter((p) => p.is_active).length;

  const recentRentals = [...rentals]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 20);

  return (
    <div className="bg-[#000000] text-white min-h-full p-6 lg:p-10">

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Dashboard</h1>
          <p className="text-[#ffffff]/40 font-medium mt-1">Welcome to the Gearzi control center.</p>
        </div>
        <button
          onClick={fetchData}
          disabled={isLoading}
          className="flex items-center gap-2 bg-[#ffffff]/5 hover:bg-[#ffffff]/10 border border-[#ffffff]/10 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
        >
          <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={TrendingUp}
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          badge={`${activeRentals} active`}
          isLoading={isLoading}
        />
        <StatCard
          icon={Package}
          label="Active Rentals"
          value={activeRentals}
          badge={pendingRentals > 0 ? `+${pendingRentals} pending` : undefined}
          isLoading={isLoading}
        />
        <StatCard
          icon={Box}
          label="Total Gear"
          value={totalGear}
          isLoading={isLoading}
        />
        <StatCard
          icon={Users}
          label="Total Requests"
          value={rentals.length}
          isLoading={isLoading}
        />
      </div>

      <div className="bg-[#121212] border border-[#ffffff]/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#ffffff]/10 flex items-center justify-between">
          <h2 className="text-lg font-black text-white">Recent Orders</h2>
          <span className="text-[11px] font-bold text-[#ffffff]/40 uppercase tracking-wider">
            Click a row to review
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-[#00DF81]" />
          </div>
        ) : recentRentals.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-[#ffffff]/40 text-sm">No rental requests yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#ffffff]/5">
                  {['Order ID', 'Product', 'Dates', 'Phone', 'Status', 'Amount', ''].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-[10px] font-black text-[#ffffff]/30 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentRentals.map((rental) => (
                  <RentalRow
                    key={rental.id}
                    rental={rental}
                    productMap={productMap}
                    onStatusUpdate={fetchData}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;