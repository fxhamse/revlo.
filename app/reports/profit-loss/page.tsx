// app/reports/profit-loss/page.tsx - Profit & Loss Report Page (10000% Design - Project-Centric)
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../../../components/layouts/Layout';
import { 
  ArrowLeft, LineChart, DollarSign, Plus, Search, Filter, Calendar, 
  Download, Upload, Printer, Mail, MessageSquare, Send, 
  TrendingUp, TrendingDown, CheckCircle, XCircle, Info,
  Tag, Briefcase, CreditCard, Eye, Edit, Trash2,
  List, LayoutGrid, BarChart, PieChart, Clock as ClockIcon,
  Coins, CheckSquare, Target, Share2, ChevronRight, ChevronUp, ChevronDown // New icons for project-specific insights
} from 'lucide-react';
import Toast from '../../../components/common/Toast'; // Reuse Toast component
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

// ...API-driven state and useEffect already added above...

// Helper for chart colors
const CHART_COLORS = ['#3498DB', '#2ECC71', '#F39C12', '#E74C3C', '#9B59B6', '#1ABC9C'];

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


// Main Profit & Loss Report Page Component
import { useEffect } from 'react';

interface MonthlySummaryItem {
  month: string;
  projectIncome: number;
  projectDirectCosts: number;
  operatingExpenses: number;
  netProjectProfit: number;
}
interface IncomeItem { id: string; date: string; description: string; amount: number; type: string; }
interface CostItem { id: string; date: string; description: string; amount: number; type: string; }
interface OpexItem { id: string; date: string; description: string; amount: number; type: string; }

export default function ProfitLossReportPage() {
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummaryItem[]>([]);
  const [projectIncomeItems, setProjectIncomeItems] = useState<IncomeItem[]>([]);
  const [directProjectCostItems, setDirectProjectCostItems] = useState<CostItem[]>([]);
  const [operatingExpensesItems, setOperatingExpensesItems] = useState<OpexItem[]>([]);
  const [realizedProjectProfit, setRealizedProjectProfit] = useState<number>(0);
  const [potentialProjectProfit, setPotentialProjectProfit] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDateRange, setFilterDateRange] = useState('This Year');
  const [showChartSection, setShowChartSection] = useState(true);
  const [activeChartType, setActiveChartType] = useState<'line' | 'bar'>('line');
  const [activeExpenseChartType, setActiveExpenseChartType] = useState<'pie' | 'bar'>('pie');

  useEffect(() => {
    async function fetchPL() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/accounting/reports/profit-loss');
        if (!res.ok) throw new Error('Failed to fetch profit & loss data');
        const data = await res.json();
        setMonthlySummary(data.monthlySummary || []);
        setProjectIncomeItems(data.projectIncomeItems || []);
        setDirectProjectCostItems(data.directProjectCostItems || []);
        setOperatingExpensesItems(data.operatingExpensesItems || []);
        setRealizedProjectProfit(data.realizedProjectProfit || 0);
        setPotentialProjectProfit(data.potentialProjectProfit || 0);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    }
    fetchPL();
  }, []);

  // Calculate totals based on API data
  const currentProjectIncome = projectIncomeItems.reduce((sum, item) => sum + item.amount, 0);
  const currentDirectProjectCosts = directProjectCostItems.reduce((sum, item) => sum + item.amount, 0);
  const currentOperatingExpenses = operatingExpensesItems.reduce((sum, item) => sum + item.amount, 0);
  const currentGrossProfit = currentProjectIncome - currentDirectProjectCosts;
  const currentNetProfit = currentGrossProfit - currentOperatingExpenses;

  // Data for Expense Breakdown Pie Chart (now includes direct project costs)
  const expenseBreakdownData = [
    { name: 'Kharashyada Tooska ah ee Mashruuca', value: currentDirectProjectCosts, color: CHART_COLORS[3] },
    { name: 'Kirada Xafiiska', value: operatingExpensesItems.filter((item: any) => item.type === 'Rent').reduce((sum: number, i: any) => sum + i.amount, 0), color: CHART_COLORS[0] },
    { name: 'Adeegyada Guud', value: operatingExpensesItems.filter((item: any) => item.type === 'Utilities').reduce((sum: number, i: any) => sum + i.amount, 0), color: CHART_COLORS[4] },
    { name: 'Suuqgeyn', value: operatingExpensesItems.filter((item: any) => item.type === 'Marketing').reduce((sum: number, i: any) => sum + i.amount, 0), color: CHART_COLORS[2] },
    { name: 'Kharashyo Kale oo Shaqo', value: operatingExpensesItems.filter((item: any) => !['Rent', 'Utilities', 'Marketing'].includes(item.type)).reduce((sum: number, i: any) => sum + i.amount, 0), color: CHART_COLORS[5] },
  ].filter(item => item.value > 0);

  const dateRanges = ['All', 'This Month', 'This Quarter', 'This Year', 'Last 12 Months'];

  const handleExport = (format: string) => {
    // Implement export logic here (PDF, CSV, Image)
    alert(`Exporting Profit & Loss as ${format}... (Simulation)`);
  };

  const handleShare = (platform: string) => {
    // Implement share logic here
    alert(`Sharing Profit & Loss via ${platform}... (Simulation)`);
  };

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center min-h-[400px] text-darkGray dark:text-gray-100">
        <span className="animate-spin mr-3"><LineChart size={32} className="text-primary" /></span> Warbixinta Faa'iidada & Khasaaraha ayaa soo dhacaya...
      </div>
    </Layout>
  );
  if (error) return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <XCircle size={32} className="mb-2 text-redError" />
        <div className="text-redError text-lg font-bold mb-2">{error}</div>
        <button onClick={() => window.location.reload()} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold mt-2">Reload</button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-darkGray dark:text-gray-100">
          <Link href="/reports" className="text-mediumGray dark:text-gray-400 hover:text-primary transition-colors duration-200 mr-4">
            <ArrowLeft size={28} className="inline-block" />
          </Link>
          Warbixinta Faa'iidada & Khasaaraha
        </h1>
        <div className="flex space-x-3">
          <button className="bg-primary text-white py-2.5 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-200 shadow-md flex items-center">
            <Download size={20} className="mr-2" /> Soo Deji PDF
          </button>
          <button className="bg-secondary text-white py-2.5 px-6 rounded-lg font-bold text-lg hover:bg-green-600 transition duration-200 shadow-md flex items-center">
            <Share2 size={20} className="mr-2" /> Wadaag
          </button>
        </div>
      </div>

      {/* Project Profitability Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Dakhliga Mashruuca</h4>
          <p className="text-3xl font-extrabold text-secondary">${currentProjectIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Kharashyada Tooska ah ee Mashruuca</h4>
          <p className="text-3xl font-extrabold text-redError">${currentDirectProjectCosts.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Faa'iidada Guud ee Mashruuca</h4>
          <p className="text-3xl font-extrabold text-primary">${currentGrossProfit.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Net Faa'iidada (Kadib Kharashyada Shaqada)</h4>
          <p className={`text-3xl font-extrabold ${currentNetProfit >= 0 ? 'text-secondary' : 'text-redError'}`}>${currentNetProfit.toLocaleString()}</p>
        </div>
      </div>

      {/* NEW: Realized vs. Potential Project Profit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in-up">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400 flex items-center justify-center space-x-2">
            <CheckSquare size={20} className="text-secondary"/> <span>Faa'iidada Dhabta ah (Mashaariic Dhammaystiran)</span>
          </h4>
          <p className="text-3xl font-extrabold text-secondary">${realizedProjectProfit.toLocaleString()}</p>
          <p className="text-sm text-mediumGray dark:text-gray-500 mt-2">
            Tani waa faa'iidada laga helay mashaariicdii la soo gabagabeeyay.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400 flex items-center justify-center space-x-2">
            <Coins size={20} className="text-primary"/> <span>Faa'iido Suurtagal ah (Mashaariic Firfircoon)</span>
          </h4>
          <p className="text-3xl font-extrabold text-primary">${potentialProjectProfit.toLocaleString()}</p>
          <p className="text-sm text-mediumGray dark:text-gray-500 mt-2">
            Tani waa lacagta laga filayo mashaariicda hadda socota marka la dhammaystiro.
          </p>
        </div>
      </div>


      {/* Filters & Chart Toggle */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 animate-fade-in-up">
        <div className="relative w-full md:flex-1">
          <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" />
          <select
            className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 appearance-none"
            value={filterDateRange}
            onChange={(e) => setFilterDateRange(e.target.value)}
          >
            {dateRanges.map(range => <option key={range} value={range}>{range}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400">
            <ChevronRight className="transform rotate-90" size={20} />
          </div>
        </div>
        {/* Chart Type Selectors */}
        <div className="flex space-x-2 w-full md:w-auto justify-center">
            <button onClick={() => setActiveChartType('line')} className={`p-2 rounded-lg ${activeChartType === 'line' ? 'bg-primary text-white' : 'bg-lightGray dark:bg-gray-700 text-mediumGray dark:text-gray-400'} hover:bg-primary/80 dark:hover:bg-gray-600 transition-colors duration-200`} title="Line Chart">
                <LineChart size={20} />
            </button>
            <button onClick={() => setActiveChartType('bar')} className={`p-2 rounded-lg ${activeChartType === 'bar' ? 'bg-primary text-white' : 'bg-lightGray dark:bg-gray-700 text-mediumGray dark:text-gray-400'} hover:bg-primary/80 dark:hover:bg-gray-600 transition-colors duration-200`} title="Bar Chart">
                <BarChart size={20} />
            </button>
            {/* Toggle Chart Section Visibility */}
            <button onClick={() => setShowChartSection(!showChartSection)} className="p-2 rounded-lg text-mediumGray dark:text-gray-400 hover:bg-lightGray dark:hover:bg-gray-700 transition-colors duration-200">
                {showChartSection ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
        </div>
      </div>

      {/* Charts Section */}
      {showChartSection && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in">
          {/* Monthly P&L Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md animate-fade-in-up">
            <h3 className="text-xl font-semibold text-darkGray dark:text-gray-100 mb-4">Dakhliga Mashruuca & Kharashyada Bishiiba</h3> {/* Clarified title */}
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                {activeChartType === 'line' ? (
                  <RechartsLineChart data={monthlySummary} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" vertical={false} />
                    <XAxis dataKey="month" stroke="#7F8C8D" className="dark:text-gray-400 text-sm" />
                    <YAxis stroke="#7F8C8D" className="dark:text-gray-400 text-sm" />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }} labelStyle={{ color: '#2C3E50', fontWeight: 'bold' }} itemStyle={{ color: '#2C3E50' }} />
                    <Legend />
                    <Line type="monotone" dataKey="projectIncome" stroke={CHART_COLORS[1]} name="Dakhliga Mashruuca" /> {/* Renamed */}
                    <Line type="monotone" dataKey="projectDirectCosts" stroke={CHART_COLORS[3]} name="Kharashyada Tooska ah ee Mashruuca" /> {/* Renamed */}
                    <Line type="monotone" dataKey="operatingExpenses" stroke={CHART_COLORS[0]} name="Kharashyada Shaqada" />
                    <Line type="monotone" dataKey="netProjectProfit" stroke={CHART_COLORS[2]} name="Net Faa'iidada Mashruuca" /> {/* Renamed */}
                  </RechartsLineChart>
                ) : (
                  <RechartsBarChart data={monthlySummary} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" vertical={false} />
                    <XAxis dataKey="month" stroke="#7F8C8D" className="dark:text-gray-400 text-sm" />
                    <YAxis stroke="#7F8C8D" className="dark:text-gray-400 text-sm" />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }} labelStyle={{ color: '#2C3E50', fontWeight: 'bold' }} itemStyle={{ color: '#2C3E50' }} />
                    <Legend />
                    <Bar dataKey="projectIncome" fill={CHART_COLORS[1]} name="Dakhliga Mashruuca" /> {/* Renamed */}
                    <Bar dataKey="projectDirectCosts" fill={CHART_COLORS[3]} name="Kharashyada Tooska ah ee Mashruuca" /> {/* Renamed */}
                    <Bar dataKey="operatingExpenses" fill={CHART_COLORS[0]} name="Kharashyada Shaqada" />
                    <Bar dataKey="netProjectProfit" fill={CHART_COLORS[2]} name="Net Faa'iidada Mashruuca" /> {/* Renamed */}
                  </RechartsBarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense Breakdown Pie Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md animate-fade-in-up">
            <h3 className="text-xl font-semibold text-darkGray dark:text-gray-100 mb-4">Qaybinta Kharashyada Shaqada</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <RechartsPieChart>
                  <Pie
                    data={expenseBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {expenseBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }}
                    labelStyle={{ color: '#2C3E50', fontWeight: 'bold' }}
                    itemStyle={{ color: '#2C3E50' }}
                  />
                  <Legend align="right" verticalAlign="middle" layout="vertical" wrapperStyle={{ paddingLeft: '20px' }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Detailed P&L Statement Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-fade-in-up">
        <div className="flex justify-between items-center p-6 border-b border-lightGray dark:border-gray-700">
          <h3 className="text-xl font-semibold text-darkGray dark:text-gray-100">Faahfaahinta Faa'iidada & Khasaaraha</h3>
          <div className="flex space-x-3">
            <button className="bg-lightGray dark:bg-gray-700 text-mediumGray dark:text-gray-100 py-2 px-4 rounded-lg font-semibold flex items-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm">
                <Download size={18} className="mr-2"/> Soo Deji CSV
            </button>
            <button className="bg-lightGray dark:bg-gray-700 text-mediumGray dark:text-gray-100 py-2 px-4 rounded-lg font-semibold flex items-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm">
                <Printer size={18} className="mr-2"/> Daabac
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-lightGray dark:divide-gray-700">
            <thead className="bg-lightGray dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Taariikhda</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Sharaxaad</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Nooca</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Qiimaha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lightGray dark:divide-gray-700">
              {/* Project Income */}
              <tr>
                <td colSpan={4} className="p-4 text-left font-bold text-darkGray dark:text-gray-100 bg-lightGray dark:bg-gray-700">DAKHLIGA MASHARUUCA</td> {/* Clarified title */}
              </tr>
              {projectIncomeItems.map(item => (
                <tr key={item.id} className="hover:bg-lightGray dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="p-4 whitespace-nowrap text-darkGray dark:text-gray-100">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300">{item.description}</td>
                  <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300">{item.type}</td>
                  <td className="p-4 whitespace-nowrap text-right font-semibold text-secondary">${item.amount.toLocaleString()}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="p-4 text-right font-bold text-darkGray dark:text-gray-100">Wadarta Dakhliga Mashruuca:</td> {/* Clarified title */}
                <td className="p-4 whitespace-nowrap text-right font-bold text-secondary">${currentProjectIncome.toLocaleString()}</td>
              </tr>

              {/* Direct Project Costs */}
              <tr>
                <td colSpan={4} className="p-4 text-left font-bold text-darkGray dark:text-gray-100 bg-lightGray dark:bg-gray-700">KHARASHYADA TOOSKA AH EE MASHARUUCA</td> {/* Renamed */}
              </tr>
              {directProjectCostItems.map(item => (
                <tr key={item.id} className="hover:bg-lightGray dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="p-4 whitespace-nowrap text-darkGray dark:text-gray-100">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300">{item.description}</td>
                  <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300">{item.type}</td>
                  <td className="p-4 whitespace-nowrap text-right font-semibold text-redError">-${item.amount.toLocaleString()}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="p-4 text-right font-bold text-darkGray dark:text-gray-100">Wadarta Kharashyada Tooska ah ee Mashruuca:</td> {/* Renamed */}
                <td className="p-4 whitespace-nowrap text-right font-bold text-redError">-${currentDirectProjectCosts.toLocaleString()}</td>
              </tr>

              {/* Gross Profit (from Projects) */}
              <tr>
                <td colSpan={3} className="p-4 text-right font-bold text-darkGray dark:text-gray-100 bg-lightGray dark:bg-gray-700">FAA'IIDADA GUUD EE MASHARUUCA:</td> {/* Clarified title */}
                <td className="p-4 whitespace-nowrap text-right font-bold text-primary bg-lightGray dark:bg-gray-700">${currentGrossProfit.toLocaleString()}</td>
              </tr>

              {/* Operating Expenses */}
              <tr>
                <td colSpan={4} className="p-4 text-left font-bold text-darkGray dark:text-gray-100 bg-lightGray dark:bg-gray-700">KHARASHYADA SHAQADA (OVERHEADS)</td> {/* Clarified title */}
              </tr>
              {operatingExpensesItems.map(item => (
                <tr key={item.id} className="hover:bg-lightGray dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="p-4 whitespace-nowrap text-darkGray dark:text-gray-100">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300">{item.description}</td>
                  <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300">{item.type}</td>
                  <td className="p-4 whitespace-nowrap text-right font-semibold text-redError">-${item.amount.toLocaleString()}</td>
                </tr>
              ))}
              <tr>    
                <td colSpan={3} className="p-4 text-right font-bold text-darkGray dark:text-gray-100">Wadarta Kharashyada Shaqada:</td>
                <td className="p-4 whitespace-nowrap text-right font-bold text-redError">-${currentOperatingExpenses.toLocaleString()}</td>
              </tr>

              {/* Net Profit */}
              <tr>
                <td colSpan={3} className="p-4 text-right font-bold text-darkGray dark:text-gray-100 bg-lightGray dark:bg-gray-700">NET FAA'IIDADA SHAQADA:</td>
                <td className="p-4 whitespace-nowrap text-right font-bold text-secondary bg-lightGray dark:bg-gray-700">${currentNetProfit.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW: Accounting Closure Section */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md animate-fade-in-up mt-8">
        <h3 className="text-2xl font-bold text-darkGray dark:text-gray-100 mb-4 flex items-center space-x-3">
          <CheckSquare size={28} className="text-secondary"/> <span>Xisaab Xidhka (Accounting Closure)</span>
        </h3>
        <p className="text-mediumGray dark:text-gray-400 mb-6">
          Xisaab xidhku waa habka lagu xiro xisaabaadkaaga dhamaadka bil ama sanad, si loo shaaciyo faa'iidada rasmiga ah oo loo diyaariyo warbixinada maaliyadeed.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="closurePeriod" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Dooro Muddada Xisaab Xidhka</label>
                <select id="closurePeriod" className="w-full p-3 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:ring-primary appearance-none">
                    <option value="">-- Dooro Muddada --</option>
                    <option value="monthly">Bishii</option>
                    <option value="quarterly">Saddexdii Biloodba</option>
                    <option value="yearly">Sannadkii</option>
                </select>
            </div>
            <div>
                <label htmlFor="closureDate" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Taariikhda Xisaab Xidhka</label>
                <input type="date" id="closureDate" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-3 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:ring-primary"/>
            </div>
        </div>
        <button className="mt-6 bg-primary text-white py-2 px-5 rounded-lg font-bold text-base hover:bg-blue-700 transition duration-200 shadow-md flex items-center">
            <CheckSquare size={18} className="mr-2"/> Samee Xisaab Xidh
        </button>
        <p className="text-sm text-mediumGray dark:text-gray-500 mt-4">
            <Info size={16} className="inline mr-1 text-primary"/> Fadlan ogow in xisaab xidhka uu xiri doono xisaabaadkaaga muddadaas, oo uu saameyn ku yeelan doono warbixinada mustaqbalka.
        </p>
      </div>
    </Layout>
  );
}
