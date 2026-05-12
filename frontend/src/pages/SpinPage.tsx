import React, { useState } from 'react';
import { SpinnerWheel } from '../components/SpinnerWheel';
import { ArrowLeft, ShoppingCart, Info, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useSpinners } from '../context/SpinnerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { WinnerModal } from '../components/WinnerModal';

const SpinPage: React.FC = () => {
  const navigate = useNavigate();
  const { spinners, addPurchase } = useSpinners();
  
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [purchasePending, setPurchasePending] = useState<string | null>(null);
  const [purchasedSpinners, setPurchasedSpinners] = useState<Set<string>>(new Set());
  const [showWinner, setShowWinner] = useState<{ id: string; index: number; color: string } | null>(null);

  const handleSelect = (spinnerId: string, colorIndex: number) => {
    setSelections(prev => ({ ...prev, [spinnerId]: colorIndex }));
  };

  const handleBuyClick = (spinnerId: string) => {
    if (selections[spinnerId] === undefined) {
      alert("Please select a color section first!");
      return;
    }
    setPurchasePending(spinnerId);
  };

  const confirmPurchase = (spinnerId: string) => {
    const spinner = spinners.find(s => s.id === spinnerId);
    if (!spinner) return;

    addPurchase({
      userId: 'user_123',
      userEmail: 'user@example.com',
      spinnerId,
      amount: spinner.amount,
      selectedColorIndex: selections[spinnerId] || 0
    });

    setPurchasedSpinners(prev => new Set(prev).add(spinnerId));
    setPurchasePending(null);

    // Simulate winning check (this would normally come from backend)
    setTimeout(() => {
        // In this demo, let's say the winner is what admin set or random
        const winIdx = spinner.winnerColorIndex ?? Math.floor(Math.random() * 9);
        setShowWinner({ 
            id: spinnerId, 
            index: winIdx, 
            color: spinner.colors[winIdx] 
        });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0c10] text-foreground p-6 md:p-12 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-4 -ml-2 text-gray-500 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Logout
            </Button>
            <h1 className="text-5xl font-black tracking-tight text-gray-900 dark:text-white uppercase italic">
              Spin <span className="text-primary">&</span> Win
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Select your lucky color and purchase a spin to win big prizes.
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

        {/* Layout Grid */}
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
                 <p className="text-primary font-bold text-xl mt-1">₹{spinner.amount}</p>
              </div>

              <SpinnerWheel 
                colors={spinner.colors}
                winnerIndex={spinner.winnerColorIndex}
                onSelect={(colorIdx) => handleSelect(spinner.id, colorIdx)}
                disabled={!spinner.enabled || purchasedSpinners.has(spinner.id)}
              />

              <div className="mt-12 w-full max-w-[280px]">
                <Button 
                    className="w-full py-4 text-lg font-black uppercase tracking-widest shadow-[0_0_30px_rgba(170,59,255,0.3)] hover:shadow-[0_0_40px_rgba(170,59,255,0.5)] transition-all"
                    onClick={() => handleBuyClick(spinner.id)}
                    disabled={purchasedSpinners.has(spinner.id) || !spinner.enabled}
                >
                    {purchasedSpinners.has(spinner.id) ? 'PURCHASED' : `BUY SPIN - ₹${spinner.amount}`}
                </Button>
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
                    High stakes, high rewards. Select your section and claim the grand prize!
                 </p>
                 <div className="bg-white/5 p-6 rounded-2xl border border-white/5 inline-block mb-8">
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">Spin Amount</p>
                    <p className="text-4xl font-black text-white tracking-tighter">₹{spinner.amount}</p>
                 </div>
                 <Button 
                    className="w-full md:w-auto px-12 py-5 text-xl font-black uppercase tracking-widest bg-gradient-to-r from-primary to-accent border-none shadow-[0_0_50px_rgba(170,59,255,0.4)]"
                    onClick={() => handleBuyClick(spinner.id)}
                    disabled={purchasedSpinners.has(spinner.id) || !spinner.enabled}
                >
                    {purchasedSpinners.has(spinner.id) ? 'ALREADY PURCHASED' : 'PURCHASE MEGA SPIN'}
                </Button>
              </div>

              <div className="flex-shrink-0">
                <SpinnerWheel 
                    size={380}
                    colors={spinner.colors}
                    winnerIndex={spinner.winnerColorIndex}
                    onSelect={(colorIdx) => handleSelect(spinner.id, colorIdx)}
                    disabled={!spinner.enabled || purchasedSpinners.has(spinner.id)}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
            {purchasePending && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-gray-900 border border-white/10 p-8 rounded-3xl max-w-sm w-full shadow-2xl"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-6">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Confirm Purchase?</h3>
                        <p className="text-gray-400 mb-8">
                            You are about to spend <span className="text-white font-bold">₹{spinners.find(s => s.id === purchasePending)?.amount}</span> for a spin on <span className="text-white font-bold">{spinners.find(s => s.id === purchasePending)?.title}</span>.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="secondary" onClick={() => setPurchasePending(null)}>Cancel</Button>
                            <Button onClick={() => confirmPurchase(purchasePending)}>Confirm</Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* Winner Announcement */}
        <WinnerModal 
            isOpen={!!showWinner}
            onClose={() => setShowWinner(null)}
            winnerColor={showWinner?.color || ''}
            winnerIndex={showWinner?.index || 0}
        />
      </div>
    </div>
  );
};

export default SpinPage;
