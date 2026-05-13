import React, { useState } from 'react';
import { SpinnerWheel } from '../components/SpinnerWheel';
import { ArrowLeft, ShoppingCart, Info, CreditCard, CheckCircle, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useSpinners } from '../context/SpinnerContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const SpinPage: React.FC = () => {
  const navigate = useNavigate();
  const { spinners, addPurchase } = useSpinners();
  const { logout } = useAuth();
  
  // Multi-select: each spinner has an array of selected color indices
  const [selections, setSelections] = useState<Record<string, number[]>>({});
  const [hasPaid, setHasPaid] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showPayConfirm, setShowPayConfirm] = useState(false);

  const handleToggleSelect = (spinnerId: string, colorIndex: number) => {
    if (hasPaid) return;
    setSelections(prev => {
      const current = prev[spinnerId] || [];
      if (current.includes(colorIndex)) {
        // Remove this color
        const next = current.filter(i => i !== colorIndex);
        const newSel = { ...prev };
        if (next.length === 0) {
          delete newSel[spinnerId];
        } else {
          newSel[spinnerId] = next;
        }
        return newSel;
      } else {
        // Add this color
        return { ...prev, [spinnerId]: [...current, colorIndex] };
      }
    });
  };

  // Calculate totals
  const getSpinnerTotal = (spinnerId: string) => {
    const spinner = spinners.find(s => s.id === spinnerId);
    const count = (selections[spinnerId] || []).length;
    return { count, amount: (spinner?.amount || 0) * count };
  };

  const totalSelectedColors = Object.values(selections).reduce((sum, arr) => sum + arr.length, 0);
  const grandTotal = Object.keys(selections).reduce((sum, id) => sum + getSpinnerTotal(id).amount, 0);

  const handlePayClick = () => {
    if (totalSelectedColors === 0) return;
    setShowPayConfirm(true);
  };

  const confirmPayment = () => {
    // Build bulk selections
    const bulkSelections = Object.entries(selections).map(([spinnerId, colorIndices]) => ({
      spinnerId,
      colorIndices,
    }));

    addBulkPurchase(bulkSelections, 'user_123', 'user@example.com');
    
    setShowPayConfirm(false);
    setHasPaid(true);

    // Trigger success popup
    setTimeout(() => {
      setShowSuccessPopup(true);
      // Fire confetti
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#aa3bff', '#c084fc', '#ffd700', '#4CD964', '#FF3B30', '#007AFF'],
      });
      // Second burst
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 120,
          origin: { x: 0.3, y: 0.6 },
          colors: ['#aa3bff', '#c084fc', '#ffd700'],
        });
        confetti({
          particleCount: 100,
          spread: 120,
          origin: { x: 0.7, y: 0.6 },
          colors: ['#FF3B30', '#4CD964', '#007AFF'],
        });
      }, 300);
    }, 400);
  };

  const handleCloseSuccess = () => {
    setShowSuccessPopup(false);
  };

  const handleNewPurchase = () => {
    setSelections({});
    setHasPaid(false);
    setShowSuccessPopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0c10] text-foreground p-6 md:p-12 font-sans overflow-x-hidden pb-48">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <Button 
              variant="ghost" 
              onClick={() => { logout(); navigate('/'); }}
              className="mb-4 -ml-2 text-gray-500 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Logout
            </Button>
            <h1 className="text-5xl font-black tracking-tight text-gray-900 dark:text-white uppercase italic">
              Spin <span className="text-primary">&</span> Win
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Select multiple colors across any spinner. Pay once for all!
            </p>
          </div>
          
          <div className="flex gap-4 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 rounded-[2rem] shadow-2xl border border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-0.5">Wallet Balance</div>
                <div className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">₹5,000.00</div>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Grid - Row 1: Spin 1 & 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32 items-start justify-items-center mb-32">
          {spinners.filter(s => s.id !== '3').map((spinner, idx) => (
            <motion.div 
              key={spinner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="w-full flex flex-col items-center"
            >
              <div className="mb-8 text-center">
                 <h2 className="text-2xl font-black text-white uppercase tracking-widest">{spinner.title}</h2>
                 <p className="text-primary font-bold text-xl mt-1">₹{spinner.amount} / color</p>
              </div>

              <SpinnerWheel 
                colors={spinner.colors}
                winnerIndex={spinner.winnerColorIndex}
                selectedIndices={selections[spinner.id] || []}
                onToggleSelect={(colorIdx) => handleToggleSelect(spinner.id, colorIdx)}
                disabled={!spinner.enabled || hasPaid}
              />

              {/* Per-spinner selection summary */}
              <div className="mt-6 w-full max-w-[280px]">
                {(selections[spinner.id]?.length || 0) > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 text-center"
                  >
                    <p className="text-sm text-gray-400">
                      <span className="text-white font-bold">{selections[spinner.id].length}</span> color{selections[spinner.id].length > 1 ? 's' : ''} × ₹{spinner.amount} = <span className="text-primary font-black text-lg">₹{selections[spinner.id].length * spinner.amount}</span>
                    </p>
                  </motion.div>
                )}
                {!spinner.enabled && (
                    <p className="text-red-500 text-xs text-center mt-2 font-bold uppercase tracking-widest">Disabled by Admin</p>
                )}
              </div>
            </motion.div>
          ))}

          {/* Row 2: Mega Jackpot */}
          {spinners.filter(s => s.id === '3').map((spinner) => (
            <motion.div 
              key={spinner.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 w-full max-w-4xl bg-gray-900/40 backdrop-blur-xl p-12 rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center gap-16 mt-8"
            >
              <div className="flex-1 text-center md:text-left">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                    <Info className="w-3 h-3" /> Mega Event
                 </div>
                 <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none mb-4 italic">
                    {spinner.title}
                 </h2>
                 <p className="text-gray-400 text-lg mb-8 max-w-md">
                    High stakes, high rewards. Select your sections and claim the grand prize!
                 </p>
                 <div className="bg-white/5 p-6 rounded-2xl border border-white/5 inline-block mb-6">
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">Per Color</p>
                    <p className="text-4xl font-black text-white tracking-tighter">₹{spinner.amount}</p>
                 </div>
                 {/* Per-spinner Mega summary */}
                 {(selections[spinner.id]?.length || 0) > 0 && (
                   <motion.div 
                     initial={{ opacity: 0, y: 5 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="bg-primary/10 backdrop-blur-md rounded-2xl border border-primary/20 p-4 max-w-xs"
                   >
                     <p className="text-sm text-gray-300">
                       <span className="text-white font-bold">{selections[spinner.id].length}</span> color{selections[spinner.id].length > 1 ? 's' : ''} × ₹{spinner.amount} = <span className="text-primary font-black text-xl">₹{selections[spinner.id].length * spinner.amount}</span>
                     </p>
                   </motion.div>
                 )}
              </div>

              <div className="flex-shrink-0">
                <SpinnerWheel 
                    size={380}
                    colors={spinner.colors}
                    winnerIndex={spinner.winnerColorIndex}
                    selectedIndices={selections[spinner.id] || []}
                    onToggleSelect={(colorIdx) => handleToggleSelect(spinner.id, colorIdx)}
                    disabled={!spinner.enabled || hasPaid}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ========== STICKY CART SUMMARY BAR ========== */}
      <AnimatePresence>
        {totalSelectedColors > 0 && !hasPaid && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <div className="bg-gray-900/95 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_60px_rgba(0,0,0,0.5)]">
              <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Cart breakdown */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.15em]">Your Cart</p>
                      <p className="text-white font-bold text-sm">{totalSelectedColors} color{totalSelectedColors > 1 ? 's' : ''} selected</p>
                    </div>
                  </div>

                  <div className="hidden md:block h-8 w-px bg-white/10" />

                  {/* Per-spinner breakdown chips */}
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selections).map(([spinnerId, colorArr]) => {
                      const spinner = spinners.find(s => s.id === spinnerId);
                      if (!spinner || colorArr.length === 0) return null;
                      return (
                        <div 
                          key={spinnerId}
                          className="bg-white/5 border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-2"
                        >
                          <div className="flex gap-0.5">
                            {colorArr.map(ci => (
                              <div key={ci} className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: spinner.colors[ci] }} />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">{spinner.title}:</span>
                          <span className="text-xs font-bold text-white">{colorArr.length} × ₹{spinner.amount} = ₹{colorArr.length * spinner.amount}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Total + Pay button */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.15em]">Total Amount</p>
                    <p className="text-3xl font-black text-white tracking-tighter">₹{grandTotal.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={handlePayClick}
                    className="relative group bg-gradient-to-r from-primary to-accent text-white font-black text-lg uppercase tracking-widest px-10 py-4 rounded-2xl shadow-[0_0_40px_rgba(170,59,255,0.4)] hover:shadow-[0_0_60px_rgba(170,59,255,0.6)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                  >
                    <span className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5" />
                      PAY ₹{grandTotal.toLocaleString()}
                    </span>
                    <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== PAY CONFIRMATION MODAL ========== */}
      <AnimatePresence>
        {showPayConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Confirm Payment</h3>
              <p className="text-gray-400 mb-6">
                You are about to pay for <span className="text-white font-bold">{totalSelectedColors} color{totalSelectedColors > 1 ? 's' : ''}</span> across {Object.keys(selections).length} spinner{Object.keys(selections).length > 1 ? 's' : ''}.
              </p>

              {/* Breakdown */}
              <div className="bg-white/5 rounded-2xl border border-white/5 p-4 mb-6 space-y-3">
                {Object.entries(selections).map(([spinnerId, colorArr]) => {
                  const spinner = spinners.find(s => s.id === spinnerId);
                  if (!spinner || colorArr.length === 0) return null;
                  return (
                    <div key={spinnerId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {colorArr.map(ci => (
                            <div key={ci} className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: spinner.colors[ci] }} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-300">{spinner.title}</span>
                      </div>
                      <span className="text-sm font-bold text-white">{colorArr.length} × ₹{spinner.amount} = ₹{colorArr.length * spinner.amount}</span>
                    </div>
                  );
                })}
                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">Grand Total</span>
                  <span className="text-xl font-black text-primary">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="secondary" onClick={() => setShowPayConfirm(false)}>Cancel</Button>
                <button
                  onClick={confirmPayment}
                  className="bg-gradient-to-r from-primary to-accent text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========== SUCCESS POPUP ========== */}
      <AnimatePresence>
        {showSuccessPopup && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
            <motion.div 
              initial={{ scale: 0.7, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-gray-900 border border-white/10 p-10 rounded-[2.5rem] max-w-md w-full shadow-[0_0_80px_rgba(170,59,255,0.3)] text-center relative overflow-hidden"
            >
              {/* Background animated glow */}
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-primary/20 blur-3xl animate-pulse" />
              <div className="absolute -bottom-20 right-0 w-40 h-40 rounded-full bg-accent/20 blur-3xl animate-pulse" />

              <div className="relative z-10">
                {/* Success icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 12 }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 mb-6 mx-auto relative"
                >
                  <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <h2 className="text-3xl font-black text-white tracking-tight">Payment Successful!</h2>
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                  </div>
                  <p className="text-gray-400 mb-8 text-lg">Your spins have been successfully purchased</p>
                </motion.div>

                {/* Receipt summary */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="bg-white/5 rounded-2xl border border-white/10 p-5 mb-8 text-left space-y-3"
                >
                  {Object.entries(selections).map(([spinnerId, colorArr]) => {
                    const spinner = spinners.find(s => s.id === spinnerId);
                    if (!spinner || colorArr.length === 0) return null;
                    return (
                      <div key={spinnerId} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {colorArr.map(ci => (
                              <div key={ci} className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: spinner.colors[ci] }} />
                            ))}
                          </div>
                          <span className="text-sm text-gray-300">{spinner.title}</span>
                        </div>
                        <span className="text-sm font-bold text-white">₹{colorArr.length * spinner.amount}</span>
                      </div>
                    );
                  })}
                  <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">Total Paid</span>
                    <span className="text-2xl font-black text-green-400">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3"
                >
                  <button
                    onClick={handleNewPurchase}
                    className="w-full bg-gradient-to-r from-primary to-accent text-white font-black text-lg uppercase tracking-widest py-4 rounded-2xl shadow-[0_0_30px_rgba(170,59,255,0.3)] hover:shadow-[0_0_50px_rgba(170,59,255,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Buy More Spins
                  </button>
                  <button 
                    onClick={handleCloseSuccess}
                    className="text-gray-500 hover:text-white transition-colors text-sm font-medium"
                  >
                    Close
                  </button>
                </motion.div>
              </div>

              {/* Close button */}
              <button 
                onClick={handleCloseSuccess}
                className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpinPage;
