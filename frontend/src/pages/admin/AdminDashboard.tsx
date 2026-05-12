import React from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Users
} from 'lucide-react';
import { useSpinners } from '../../context/SpinnerContext';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Sidebar } from '../../components/layout/Sidebar';
import { Navbar } from '../../components/layout/Navbar';

const DATA = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-white/5 group hover:border-primary/20 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        {Math.abs(trend)}%
      </div>
    </div>
    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</p>
    <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
  </div>
);

const AdminDashboard: React.FC = () => {
  const { purchases, spinners } = useSpinners();
  
  const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);
  const totalUsers = new Set(purchases.map(p => p.userId)).size;

  return (
    <div className="min-h-screen bg-[#0b0c10] flex text-foreground">
      <Sidebar />
      
      <main className="flex-1 ml-64 min-h-screen">
        <Navbar />
        
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Overview</h2>
              <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
            </div>
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold border border-primary/20">
              Live Updates Active
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Users" 
              value={totalUsers + 1240} 
              icon={Users} 
              trend={12} 
              color="blue" 
            />
            <StatCard 
              title="Total Purchases" 
              value={purchases.length + 850} 
              icon={ShoppingBag} 
              trend={8} 
              color="purple" 
            />
            <StatCard 
              title="Total Revenue" 
              value={`₹${(totalRevenue + 45200).toLocaleString()}`} 
              icon={DollarSign} 
              trend={24} 
              color="green" 
            />
            <StatCard 
              title="Active Spinners" 
              value={spinners.filter(s => s.enabled).length} 
              icon={TrendingUp} 
              trend={0} 
              color="orange" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Area */}
            <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-white">Revenue Analytics</h3>
                <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-gray-400">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={DATA}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#aa3bff" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#aa3bff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 12 }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 12 }} 
                      tickFormatter={(value) => `₹${value/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
                      itemStyle={{ color: '#aa3bff' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#aa3bff" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRev)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-6">Recent Purchases</h3>
              <div className="space-y-6">
                {[...purchases].slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                      {p.userEmail[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{p.userEmail}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-black">
                        {spinners.find(s => s.id === p.spinnerId)?.title}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">₹{p.amount}</p>
                      <p className="text-[10px] text-gray-500">{new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
                {purchases.length === 0 && (
                  <div className="text-center py-8 text-gray-600">
                    No recent activity
                  </div>
                )}
              </div>
              <button className="w-full mt-8 py-3 rounded-xl border border-white/5 text-gray-400 text-sm font-medium hover:bg-white/5 transition-all">
                View All Transactions
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
