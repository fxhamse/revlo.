// app/dashboard/page.tsx - Dashboard Page (10000% Design - Ultimate Enhancement)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/layouts/Layout';
import { 
  DollarSign, Briefcase, Banknote, ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown,
  CheckCircle, Clock, XCircle, Plus, Info, MessageSquare, User, Package, Bell, CalendarCheck,
  LineChart as LineChartIcon, BarChart as BarChartIcon, PieChart as PieChartIcon,
  Eye, Edit, Trash2,
  Activity, Zap, Target, Award, // General icons
  Coins, // For potential profit
  CheckSquare, // For completed projects profit
} from 'lucide-react';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';


// --- Dashboard Data Interfaces ---
interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
  totalBankBalance: number;
  totalMobileMoneyBalance: number;
  totalCashBalance: number;
  lowStockItems: number;
  overdueProjects: number;
  realizedProfitFromCompletedProjects: number;
  potentialProfitFromActiveProjects: number;
  monthlyFinancialData: { month: string; income: number; expenses: number; profit: number }[];
  projectStatusBreakdown: { name: string; value: number; color: string }[];
  recentActivities: { id: string; type: string; description: string; amount?: number; date: string; user: string }[];
}

interface DashboardCardProps {
  title: string;
  value: string;
  trend?: 'up' | 'down'; 
  colorClass: string; 
  icon: React.ReactNode;
  description?: string; // Optional detailed description
}

interface ActivityItemProps {
  activity: {
    id: string;
    type: string;
    description: string;
    amount?: number;
    date: string;
    user: string;
  };
}

// Helper for chart colors
const CHART_COLORS = ['#3498DB', '#2ECC71', '#F39C12', '#E74C3C', '#9B59B6', '#1ABC9C', '#34495E', '#A0A0A0'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-sm font-semibold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
// ...existing code...


// Dashboard Card Component

interface DashboardCardProps {
  title: string;
  value: string;
  trend?: 'up' | 'down'; 
  colorClass: string; 
  icon: React.ReactNode;
  description?: string; // Optional detailed description
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, trend, colorClass, icon, description }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between animate-fade-in-up transform hover:-translate-y-1">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-mediumGray dark:text-gray-400">{title}</h3>
      <div className={`text-3xl ${colorClass}`}>{icon}</div>
    </div>
    <div className="flex items-center justify-between">
      <p className={`text-4xl font-extrabold ${colorClass}`}>{value}</p>
      {trend && (
        <span className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
          {description || ''}
        </span>
      )}
    </div>
    {description && !trend && ( 
        <p className="text-sm text-mediumGray dark:text-gray-500 mt-2">{description}</p>
    )}
  </div>
);

// Recent Activity Item
interface ActivityItemProps {
  activity: {
    id: string;
    type: string;
    description: string;
    amount?: number;
    date: string;
    user: string;
  };
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
    let icon: React.ReactNode;
    let iconBgClass = '';
    let iconColorClass = '';
    let amountDisplay = null;

    switch (activity.type) {
        case 'expense':
            icon = <DollarSign size={18} />;
            iconBgClass = 'bg-redError/10';
            iconColorClass = 'text-redError';
            amountDisplay = <span className="font-semibold text-redError">-${Math.abs(activity.amount || 0).toLocaleString()}</span>;
            break;
        case 'project':
            icon = <Briefcase size={18} />;
            iconBgClass = 'bg-primary/10';
            iconColorClass = 'text-primary';
            amountDisplay = activity.amount ? <span className="font-semibold text-secondary">+$ {activity.amount.toLocaleString()}</span> : null;
            break;
        case 'income': 
            icon = <Banknote size={18} />;
            iconBgClass = 'bg-secondary/10';
            iconColorClass = 'text-secondary';
            amountDisplay = <span className="font-semibold text-secondary">+$ {Math.abs(activity.amount || 0).toLocaleString()}</span>;
            break;
        case 'system':
            icon = <Bell size={18} />;
            iconBgClass = 'bg-accent/10';
            iconColorClass = 'text-accent';
            break;
        default:
            icon = <Info size={18} />;
            iconBgClass = 'bg-mediumGray/10';
            iconColorClass = 'text-mediumGray';
    }

    return (
        <li className="flex items-center justify-between py-3 border-b border-lightGray dark:border-gray-700 last:border-b-0 group">
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${iconBgClass} ${iconColorClass} transition-all duration-200 group-hover:scale-110`}>
                    {icon}
                </div>
                <div>
                    <p className="text-darkGray dark:text-gray-100 font-medium">{activity.description}</p>
                    <p className="text-sm text-mediumGray dark:text-gray-400">
                        {activity.user && <span>by {activity.user} &bull; </span>}
                        {new Date(activity.date).toLocaleString()}
                    </p>
                </div>
            </div>
            {amountDisplay}
        </li>
    );
};



export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/dashboard/stats");
        if (!res.ok) throw new Error("Server error");
        const json = await res.json();
        setStats(json);
      } catch (err: any) {
        setError(err.message || "Error fetching dashboard stats");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><span className="text-primary text-lg">Dashboard loading...</span></div>;
  if (error) return <div className="text-red-500 text-center p-6">{error}</div>;
  if (!stats) return null;

  const {
    totalIncome, totalExpenses, netProfit, totalProjects, activeProjects, completedProjects, onHoldProjects,
    totalBankBalance, totalMobileMoneyBalance, totalCashBalance, lowStockItems, overdueProjects,
    monthlyFinancialData, projectStatusBreakdown, recentActivities,
    realizedProfitFromCompletedProjects, potentialProfitFromActiveProjects
  } = stats;

  const currentTotalBalance = totalBankBalance + totalMobileMoneyBalance + totalCashBalance;

  return (
    <Layout>
      <h1 className="text-4xl font-bold text-darkGray dark:text-gray-100 mb-8">Dashboard Overview</h1>
      {/* Financial Overview Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
        <DashboardCard 
          title="Net Faa'iidada Shirkadda"
          value={`$${netProfit.toLocaleString()}`}
          trend={netProfit >= 0 ? 'up' : 'down'}
          description={netProfit >= 0 ? "Waa faa'iido guud" : "Waa khasaare guud"}
          colorClass={netProfit >= 0 ? 'text-secondary' : 'text-redError'} 
          icon={<Banknote />} 
        />
        <DashboardCard 
          title="Wadarta Kharashyada" 
          value={`$${totalExpenses.toLocaleString()}`} 
          trend="down"
          description="Kharashyada guud"
          colorClass="text-redError" 
          icon={<DollarSign />} 
        />
        <DashboardCard 
          title="Wadarta Lacagta" 
          value={`$${currentTotalBalance.toLocaleString()}`} 
          trend={currentTotalBalance >= 0 ? 'up' : 'down'}
          description="Accounts-ka oo dhan"
          colorClass="text-primary" 
          icon={<Banknote />} 
        />
        <DashboardCard 
          title="Mashaariicda Firfircoon" 
          value={activeProjects.toLocaleString()} 
          description="Mashaariic socota"
          colorClass="text-accent" 
          icon={<Briefcase />} 
        />
      </div>

      {/* Project Profit Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in-up">
        <DashboardCard
          title="Faa'iido Dhab ah (Mashaariic Dhammaystiran)"
          value={`$${realizedProfitFromCompletedProjects.toLocaleString()}`}
          description="Faa'iidada laga helay mashaariicda la soo gabagabeeyay."
          colorClass="text-secondary"
          icon={<CheckSquare />}
        />
        <DashboardCard
          title="Faa'iido Suurtagal ah (Mashaariic Firfircoon)"
          value={`$${potentialProfitFromActiveProjects.toLocaleString()}`}
          description="Lacagta laga filayo mashaariicda hadda socota marka la dhammaystiro."
          colorClass="text-primary"
          icon={<Coins />}
        />
      </div>

      {/* Alerts and Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in-up">
        {lowStockItems > 0 && (
          <div className="bg-redError/10 p-6 rounded-xl shadow-md border border-redError flex items-center space-x-4 animate-pulse-subtle group">
            <Package size={32} className="text-redError flex-shrink-0 group-hover:scale-110 transition-transform duration-200"/>
            <div>
              <h4 className="text-lg font-semibold text-darkGray dark:text-gray-100">Digniin: Alaab Yar!</h4>
              <p className="text-sm text-mediumGray dark:text-gray-400">
                <span className="font-bold">{lowStockItems} Alaab</span> ayaa stock-geedu hooseeyaa. Fadlan dib u buuxi.
              </p>
              <Link href="/inventory/store?status=Low Stock" className="text-primary text-sm font-medium hover:underline mt-2 block">Fiiri &rarr;</Link>
            </div>
          </div>
        )}
        {overdueProjects > 0 && (
          <div className="bg-redError/10 p-6 rounded-xl shadow-md border border-redError flex items-center space-x-4 animate-pulse-subtle group">
            <XCircle size={32} className="text-redError flex-shrink-0 group-hover:scale-110 transition-transform duration-200"/>
            <div>
              <h4 className="text-lg font-semibold text-darkGray dark:text-gray-100">Digniin: Mashaariic Dib U Dhacday!</h4>
              <p className="text-sm text-mediumGray dark:text-gray-400">
                <span className="font-bold">{overdueProjects} Mashruuc</span> ayaa deadline-kiisa dhaafay.
              </p>
              <Link href="/projects?status=Overdue" className="text-primary text-sm font-medium hover:underline mt-2 block">Fiiri &rarr;</Link>
            </div>
          </div>
        )}
        {/* New Insight: Healthy Profit Margin */}
        {netProfit > totalExpenses * 0.1 && (
            <div className="bg-secondary/10 p-6 rounded-xl shadow-md border border-secondary flex items-center space-x-4 animate-fade-in group">
                <Zap size={32} className="text-secondary flex-shrink-0 group-hover:scale-110 transition-transform duration-200"/>
                <div>
                    <h4 className="text-lg font-semibold text-darkGray dark:text-gray-100">Faa'iido Wanaagsan!</h4>
                    <p className="text-sm text-mediumGray dark:text-gray-400">
                        Ganacsigaagu wuxuu ku socdaa waddo sax ah. Sii wad shaqada wanaagsan!
                    </p>
                    <Link href="/reports/profit-loss" className="text-primary text-sm font-medium hover:underline mt-2 block">Fiiri Warbixinta Faa'iidada &rarr;</Link>
                </div>
            </div>
        )}
        {/* New Insight: Upcoming Payments */}
        {(projectStatusBreakdown.find(s => s.name === 'Upcoming')?.value ?? 0) > 0 && (
            <div className="bg-primary/10 p-6 rounded-xl shadow-md border border-primary flex items-center space-x-4 animate-fade-in group">
                <Clock size={32} className="text-primary flex-shrink-0 group-hover:scale-110 transition-transform duration-200"/>
                <div>
                    <h4 className="text-lg font-semibold text-darkGray dark:text-gray-100">Lacago Soo Socda!</h4>
                    <p className="text-sm text-mediumGray dark:text-gray-400">
                        Waxaa jira <span className="font-bold">{projectStatusBreakdown.find(s => s.name === 'Upcoming')?.value} Lacag</span> oo la sugayo.
                    </p>
                    <Link href="/reports/payment-schedule" className="text-primary text-sm font-medium hover:underline mt-2 block">Fiiri Jadwalka Lacagaha &rarr;</Link>
                </div>
            </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Financial Trend Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md animate-fade-in-up">
            <h3 className="text-xl font-semibold text-darkGray dark:text-gray-100 mb-4">Dhaqdhaqaaqa Lacagta Bishiiba</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={monthlyFinancialData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" vertical={false} />
                        <XAxis dataKey="month" stroke="#7F8C8D" className="dark:text-gray-400 text-sm" />
                        <YAxis stroke="#7F8C8D" className="dark:text-gray-400 text-sm" />
                        <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }} labelStyle={{ color: '#2C3E50', fontWeight: 'bold' }} itemStyle={{ color: '#2C3E50' }} />
                        <Legend />
                        <Line type="monotone" dataKey="income" stroke={CHART_COLORS[1]} name="Dakhliga" />
                        <Line type="monotone" dataKey="expenses" stroke={CHART_COLORS[3]} name="Kharashyada" />
                        <Line type="monotone" dataKey="profit" stroke={CHART_COLORS[0]} name="Net Faa'iidada" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Project Status Breakdown Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md animate-fade-in-up">
            <h3 className="text-xl font-semibold text-darkGray dark:text-gray-100 mb-4">Qaybinta Xaaladda Mashruuca</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={projectStatusBreakdown}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={120}
                            dataKey="value"
                        >
                            {projectStatusBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }}
                            labelStyle={{ color: '#2C3E50', fontWeight: 'bold' }}
                            itemStyle={{ color: '#2C3E50' }}
                        />
                        <Legend align="right" verticalAlign="middle" layout="vertical" wrapperStyle={{ paddingLeft: '20px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md animate-fade-in-up">
        <h3 className="text-xl font-semibold text-darkGray dark:text-gray-100 mb-4">Dhaqdhaqaaqa Dhawaan</h3>
        <ul className="space-y-3">
          {recentActivities.length > 0 ? (
            recentActivities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          ) : (
            <p className="text-mediumGray dark:text-gray-400">Ma jiraan dhaqdhaqaaq dhawaan ah.</p>
          )}
        </ul>
        <Link href="/accounting" className="mt-4 block text-primary hover:underline text-sm font-medium">Fiiri Dhammaan Dhaqdhaqaaqa &rarr;</Link>
      </div>

      {/* Quick Add Floating Button (already in Layout.tsx) */}
    </Layout>
  );
// ...existing code...
}
