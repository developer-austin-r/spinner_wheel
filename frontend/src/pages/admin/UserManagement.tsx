import React from 'react';
import { 
  Search, 
  Download,
  Calendar,
  PieChart
} from 'lucide-react';
import { useSpinners } from '../../context/SpinnerContext';
import { Sidebar } from '../../components/layout/Sidebar';
import { Navbar } from '../../components/layout/Navbar';

export const UserManagement: React.FC = () => {
  const { purchases, spinners } = useSpinners();

  // Helper to get stats for a specific spinner
  const getSpinnerStats = (spinnerId: string) => {
    const spinnerPurchases = purchases.filter(p => p.spinnerId === spinnerId);
    const spinner = spinners.find(s => s.id === spinnerId);
    
    if (!spinner) return null;

    // Initialize counts for each color index
    const colorCounts: Record<number, number> = {};
    spinner.colors.forEach((_, idx) => {
      colorCounts[idx] = 0;
    });

    // Aggregate counts
    spinnerPurchases.forEach(p => {
      colorCounts[p.selectedColorIndex] = (colorCounts[p.selectedColorIndex] || 0) + 1;
    });

    return {
      spinner,
      totalPurchases: spinnerPurchases.length,
      colorCounts,
      recentPurchases: spinnerPurchases.slice(0, 5)
    };
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] flex text-foreground">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Navbar />
        
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">User Analytics</h2>
              <p className="text-gray-500 mt-1">Detailed breakdown of spinner purchases and user selections.</p>
            </div>
            <div className="flex gap-3">
               <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white transition-all">
                  <Download className="w-4 h-4" /> Export Report
               </button>
            </div>
          </div>

          {/* Spinner Statistics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {spinners.map((s) => {
              const stats = getSpinnerStats(s.id);
              if (!stats) return null;

              return (
                <div key={s.id} className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden group hover:border-primary/20 transition-all flex flex-col">
                  <div className="p-6 border-b border-white/5">
                     <div className="flex justify-between items-center mb-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                           <PieChart className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Analytics</span>
                     </div>
                     <h3 className="text-xl font-bold text-white">{s.title}</h3>
                     <p className="text-gray-500 text-sm mt-1">Total Purchases: <span className="text-white font-bold">{stats.totalPurchases}</span></p>
                  </div>

                  <div className="p-6 flex-1 space-y-6">
                    <div className="space-y-4">
                       <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Color-wise Distribution</p>
                       <div className="space-y-3">
                          {s.colors.map((color, idx) => {
                            const count = stats.colorCounts[idx] || 0;
                            const percentage = stats.totalPurchases > 0 ? (count / stats.totalPurchases) * 100 : 0;
                            
                            return (
                              <div key={idx} className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                   <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                      <span className="text-gray-400">Section {idx + 1}</span>
                                   </div>
                                   <span className="text-white font-medium">{count} users ({Math.round(percentage)}%)</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                   <div 
                                      className="h-full rounded-full transition-all duration-1000" 
                                      style={{ backgroundColor: color, width: `${percentage}%` }}
                                   />
                                </div>
                              </div>
                            );
                          })}
                       </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 mt-auto">
                     <button className="w-full py-2 text-xs font-bold text-primary hover:text-white transition-colors uppercase tracking-widest">
                        View Detailed List
                     </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Transactions Table */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden">
             <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-white">All Purchase History</h3>
                <div className="flex gap-4">
                   <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                      <Search className="w-4 h-4 text-gray-500" />
                      <input type="text" placeholder="Search user email..." className="bg-transparent border-none outline-none text-sm text-white" />
                   </div>
                </div>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="border-b border-white/5 bg-white/20">
                         <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">User</th>
                         <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Spinner</th>
                         <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount</th>
                         <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Selected Color</th>
                         <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Date & Time</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {purchases.map((p) => {
                        const spinner = spinners.find(s => s.id === p.spinnerId);
                        return (
                          <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                      {p.userEmail[0].toUpperCase()}
                                   </div>
                                   <div>
                                      <p className="text-sm font-bold text-white">{p.userEmail}</p>
                                      <p className="text-[10px] text-gray-500">ID: {p.userId}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <span className="text-sm text-gray-400">{spinner?.title || 'Unknown'}</span>
                             </td>
                             <td className="px-6 py-4">
                                <span className="text-sm font-bold text-white">₹{p.amount}</span>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                   <div 
                                      className="w-3 h-3 rounded-full border border-white/10" 
                                      style={{ backgroundColor: spinner?.colors[p.selectedColorIndex] }} 
                                   />
                                   <span className="text-xs text-gray-400">Section {p.selectedColorIndex + 1}</span>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-gray-500">
                                   <Calendar className="w-3.5 h-3.5" />
                                   <span className="text-xs">{new Date(p.timestamp).toLocaleString()}</span>
                                </div>
                             </td>
                          </tr>
                        );
                      })}
                      {purchases.length === 0 && (
                        <tr>
                           <td colSpan={5} className="px-6 py-12 text-center text-gray-600 italic">
                              No purchase records found.
                           </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
