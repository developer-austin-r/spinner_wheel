import React from 'react';
import { 
  Settings, 
  Plus, 
  Trophy,
  RefreshCcw
} from 'lucide-react';
import { useSpinners } from '../../context/SpinnerContext';
import { Sidebar } from '../../components/layout/Sidebar';
import { Navbar } from '../../components/layout/Navbar';
import { Button } from '../../components/ui/Button';


export const SpinnerManagement: React.FC = () => {
  const { spinners, updateSpinner, setWinner, resetWinner, fetchSpinners, addSpinner } = useSpinners();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newSpinner, setNewSpinner] = React.useState({
    spinnerName: '',
    baseAmount: 0,
    setAmount: 0,
  });

  React.useEffect(() => {
    fetchSpinners();
  }, []);

  const handleToggle = (id: string, enabled: boolean) => {
    updateSpinner(id, { enabled: !enabled });
  };

  const handleAmountChange = (id: string, amount: number) => {
    updateSpinner(id, { amount });
  };

  const handleWinnerSet = (spinnerId: string, index: number) => {
    setWinner(spinnerId, index);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] flex text-foreground">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Navbar />
        
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Spinner Management</h2>
              <p className="text-gray-500 mt-1">Configure wheel settings, amounts, and winners.</p>
            </div>
            <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4" /> Add New Spinner
            </Button>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-gray-900 border border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
                <h3 className="text-2xl font-bold text-white mb-6">Create New Spinner</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Spinner Name</label>
                    <input 
                      type="text" 
                      value={newSpinner.spinnerName}
                      onChange={(e) => setNewSpinner({...newSpinner, spinnerName: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                      placeholder="e.g. Mega Wheel"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Base Amount</label>
                      <input 
                        type="number" 
                        value={newSpinner.baseAmount}
                        onChange={(e) => setNewSpinner({...newSpinner, baseAmount: Number(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Set Amount</label>
                      <input 
                        type="number" 
                        value={newSpinner.setAmount}
                        onChange={(e) => setNewSpinner({...newSpinner, setAmount: Number(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button className="flex-1" onClick={async () => {
                      await addSpinner(newSpinner);
                      setIsModalOpen(false);
                      setNewSpinner({ spinnerName: '', baseAmount: 0, setAmount: 0 });
                    }}>Save Spinner</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {spinners.map((spinner) => (
              <div key={spinner.id} className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden group hover:border-primary/20 transition-all">
                <div className="p-8 flex flex-col lg:flex-row lg:items-center gap-8">
                  {/* Preview Icon */}
                  <div className="w-24 h-24 rounded-full border-4 border-white/5 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 animate-pulse" />
                    <Settings className="w-8 h-8 text-white relative z-10" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-white">{spinner.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${spinner.enabled ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {spinner.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                        <span className="text-gray-500 mr-2">Base Amount:</span>
                        <span className="text-white font-bold">₹{spinner.amount}</span>
                      </div>
                      <div className="bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                        <span className="text-gray-500 mr-2">Segments:</span>
                        <span className="text-white font-bold">{spinner.colors.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Controls */}
                  <div className="flex items-center gap-4 border-l border-white/5 lg:pl-8">
                    <div className="space-y-4">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Set Winner Color</p>
                        <div className="flex gap-2">
                            {spinner.colors.map((color, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleWinnerSet(spinner.id, idx)}
                                    className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-125 ${spinner.winnerColorIndex === idx ? 'border-white scale-125 shadow-[0_0_10px_white]' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                    title={`Color ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex flex-col gap-1 mr-4">
                         <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Set Amount</p>
                         <input 
                            type="number" 
                            defaultValue={spinner.amount}
                            onBlur={(e) => handleAmountChange(spinner.id, Number(e.target.value))}
                            className="w-24 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-primary"
                         />
                    </div>

                    <Button 
                        variant={spinner.enabled ? 'secondary' : 'primary'}
                        onClick={() => handleToggle(spinner.id, spinner.enabled)}
                        className="gap-2"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        {spinner.enabled ? 'Disable' : 'Enable'}
                    </Button>
                    
                    <Button 
                        variant="ghost"
                        onClick={() => resetWinner(spinner.id)}
                        className="text-yellow-500 hover:bg-yellow-500/10"
                    >
                        <Trophy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SpinnerManagement;
