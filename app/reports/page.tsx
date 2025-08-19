// app/reports/page.tsx - Reports Overview (10000% Design - Global Standard)
'use client';

import React from 'react';
import Link from 'next/link';
import Layout from '../../components/layouts/Layout';
import { 
  ArrowLeft, LineChart, DollarSign, Warehouse, Scale, CreditCard, Banknote, CalendarCheck, FileText, Plus, ArrowRight,
  TrendingUp, TrendingDown, Briefcase, Building, Users, Clock, Download, Share2, Printer, Mail, MessageSquare, Send, Bell, XCircle, Info, PlayCircle // New icons for sharing
} from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

// --- API-driven Data States ---
import { useState, useEffect } from 'react';

interface OverviewStats {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
  companyExpenses: number;
  projectExpenses: number;
  outstandingDebts: number;
  receivableDebts: number;
  fixedAssetsValue: number;
  totalBankBalance: number;
  totalCashBalance: number;
  shareholdersEquity: number;
}
interface ProjectPerformanceItem { month: string; started: number; completed: number; }
interface DailyReport {
  date: string;
  todayIncome: number;
  todayExpenses: number;
  todayNetFlow: number;
  newTransactions: number;
  projectsStartedToday: number;
  projectsCompletedToday: number;
  newUsersToday: number;
}

export default function ReportsOverviewPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [projectPerformance, setProjectPerformance] = useState<ProjectPerformanceItem[]>([]);
  const [dailyReport, setDailyReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, perfRes, dailyRes] = await Promise.all([
          fetch('/api/accounting/reports/overview'),
          fetch('/api/accounting/reports/project-performance'),
          fetch('/api/accounting/reports/daily'),
        ]);
        if (!statsRes.ok) throw new Error('Failed to fetch overview stats');
        if (!perfRes.ok) throw new Error('Failed to fetch project performance');
        if (!dailyRes.ok) throw new Error('Failed to fetch daily report');
        const statsData = await statsRes.json();
        const perfData = await perfRes.json();
        const dailyData = await dailyRes.json();
        setStats(statsData.stats || statsData);
        setProjectPerformance(perfData.performance || perfData);
        setDailyReport(dailyData.dailyReport || dailyData);
      } catch (err: any) {
        setError(err.message || 'Error fetching reports data');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

// --- Main Reports Overview Page Component ---
  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center min-h-[400px] text-darkGray dark:text-gray-100">
        <span className="animate-spin mr-3"><DollarSign size={32} className="text-primary" /></span> Warbixinada ayaa soo dhacaya...
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
  if (!stats || !dailyReport) return null;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-darkGray dark:text-gray-100">
          <Link href="/dashboard" className="text-mediumGray dark:text-gray-400 hover:text-primary transition-colors duration-200 mr-4">
            <ArrowLeft size={28} className="inline-block" />
          </Link>
          Reports & Analytics
        </h1>
        <button className="bg-primary text-white py-2.5 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-200 shadow-md flex items-center">
          <Plus className="mr-2" size={20} /> Generate Custom Report
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Dakhliga</h4>
          <p className="text-3xl font-extrabold text-secondary">${stats.totalIncome?.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Kharashyada</h4>
          <p className="text-3xl font-extrabold text-redError">${stats.totalExpenses?.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Net Faa'iidada</h4>
          <p className={`text-3xl font-extrabold ${stats.netProfit >= 0 ? 'text-secondary' : 'text-redError'}`}>${stats.netProfit?.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Hantida Shirkadda</h4>
          <p className="text-3xl font-extrabold text-primary">${stats.fixedAssetsValue?.toLocaleString()}</p>
        </div>
      </div>

      {/* Detailed Expense Breakdown & Debt Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in-up">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-darkGray dark:text-gray-100 mb-4 flex items-center space-x-2">
            <DollarSign size={24} className="text-redError"/> <span>Faahfaahinta Kharashyada</span>
          </h3>
          <div className="space-y-3 text-mediumGray dark:text-gray-400">
            <div className="flex justify-between items-center">
              <span>Kharashyada Mashruuca:</span>
              <span className="font-semibold text-darkGray dark:text-gray-100">-${stats.projectExpenses?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Kharashyada Shirkadda:</span>
              <span className="font-semibold text-darkGray dark:text-gray-100">-${stats.companyExpenses?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg pt-2 border-t border-lightGray dark:border-gray-700">
              <span>Wadarta Guud:</span>
              <span className="text-redError">-${stats.totalExpenses?.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-darkGray dark:text-gray-100 mb-4 flex items-center space-x-2">
            <Scale size={24} className="text-accent"/> <span>Deynaha & Lacagaha La Sugayo</span>
          </h3>
          <div className="space-y-3 text-mediumGray dark:text-gray-400">
            <div className="flex justify-between items-center">
              <span>Deynaha La Nagu Leeyahay:</span>
              <span className="font-semibold text-redError">-${stats.outstandingDebts?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Lacagaha La Sugayo (Macaamiisha):</span>
              <span className="font-semibold text-secondary">${stats.receivableDebts?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg pt-2 border-t border-lightGray dark:border-gray-700">
              <span>Wadarta Saamiga Saamileyda:</span>
              <span className="text-primary">${stats.shareholdersEquity?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Performance & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in-up">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-darkGray dark:text-gray-100 mb-4 flex items-center space-x-2">
            <Briefcase size={24} className="text-primary"/> <span>Waxqabadka Mashruuca</span>
          </h3>
          <div className="space-y-3 text-mediumGray dark:text-gray-400">
            <div className="flex justify-between items-center">
              <span>Wadarta Mashaariicda:</span>
              <span className="font-semibold text-darkGray dark:text-gray-100">{stats.totalProjects}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Mashaariicda Firfircoon:</span>
              <span className="font-semibold text-primary">{stats.activeProjects}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Mashaariicda Dhammaystiran:</span>
              <span className="font-semibold text-secondary">{stats.completedProjects}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Mashaariicda Hakadka Ku Jirta:</span>
              <span className="font-semibold text-accent">{stats.onHoldProjects}</span>
            </div>
          </div>
          {/* Project Performance Chart */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-darkGray dark:text-gray-100 mb-3">Mashaariicda La Bilaabay vs. La Dhammaystiray (Bishiiba)</h4>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <BarChart data={projectPerformance} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="dark:stroke-gray-700" />
                  <XAxis dataKey="month" stroke="#7F8C8D" className="dark:text-gray-400 text-sm" />
                  <YAxis stroke="#7F8C8D" className="dark:text-gray-400 text-sm" />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }} labelStyle={{ color: '#2C3E50', fontWeight: 'bold' }} itemStyle={{ color: '#2C3E50' }} />
                  <Legend />
                  <Bar dataKey="started" fill="#3498DB" name="La Bilaabay" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="completed" fill="#2ECC71" name="La Dhammaystiray" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Project Alerts/Insights */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-darkGray dark:text-gray-100 mb-4 flex items-center space-x-2">
            <Bell size={24} className="text-redError"/> <span>Digniinaha Mashruuca</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 bg-redError/10 p-3 rounded-lg border border-redError animate-pulse-subtle">
              <XCircle size={20} className="text-redError flex-shrink-0"/>
              <p className="text-sm text-darkGray dark:text-gray-100">
                <span className="font-bold">2 Mashruuc</span> ayaa dib u dhacay. Fadlan dib u eeg!
              </p>
              <Link href="/projects?status=Overdue" className="ml-auto text-primary hover:underline text-sm flex-shrink-0">Fiiri &rarr;</Link>
            </div>
            <div className="flex items-center space-x-3 bg-accent/10 p-3 rounded-lg border border-accent animate-fade-in" style={{ animationDelay: '100ms' }}>
              <Info size={20} className="text-accent flex-shrink-0"/>
              <p className="text-sm text-darkGray dark:text-gray-100">
                <span className="font-bold">1 Mashruuc</span> wuxuu ku dhow yahay deadline-kiisa.
              </p>
              <Link href="/projects?status=NearingDeadline" className="ml-auto text-primary hover:underline text-sm flex-shrink-0">Fiiri &rarr;</Link>
            </div>
            <div className="flex items-center space-x-3 bg-primary/10 p-3 rounded-lg border border-primary animate-fade-in" style={{ animationDelay: '200ms' }}>
              <PlayCircle size={20} className="text-primary flex-shrink-0"/>
              <p className="text-sm text-darkGray dark:text-gray-100">
                <span className="font-bold">2 Mashruuc</span> oo cusub ayaa la bilaabay bishaan.
              </p>
              <Link href="/projects?date=ThisMonth" className="ml-auto text-primary hover:underline text-sm flex-shrink-0">Fiiri &rarr;</Link>
            </div>
            {/* Add more project insights like low material for a project, etc. */}
          </div>
        </div>
      </div>


      {/* Daily Report Section */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md mb-8 animate-fade-in-up">
        <h3 className="text-2xl font-bold text-darkGray dark:text-gray-100 mb-4 flex items-center space-x-3">
          <CalendarCheck size={28} className="text-secondary"/> <span>Warbixinta Maalinlaha ah ({dailyReport.date})</span>
        </h3>
        <p className="text-mediumGray dark:text-gray-400 mb-6">
          Warbixintani waxay si otomaatig ah u diyaarinaysaa xogta maalintaas oo dhan, oo ay ku jiraan dhaqdhaqaaqa lacagta, kharashyada, iyo xaaladda mashruuca.
        </p>
        
        {/* Daily Report Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-lightGray dark:bg-gray-700 p-4 rounded-lg shadow-inner text-center">
                <h4 className="text-lg font-semibold text-darkGray dark:text-gray-100 mb-2">Dakhliga Maanta</h4>
                <p className="text-2xl font-bold text-secondary">+$ {dailyReport.todayIncome?.toLocaleString()}</p>
            </div>
            <div className="bg-lightGray dark:bg-gray-700 p-4 rounded-lg shadow-inner text-center">
                <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Kharashyada Maanta</h4>
                <p className="text-2xl font-bold text-redError">-$ {dailyReport.todayExpenses?.toLocaleString()}</p>
            </div>
            <div className="bg-lightGray dark:bg-gray-700 p-4 rounded-lg shadow-inner text-center">
                <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Net Flow Maanta</h4>
                <p className="text-2xl font-bold text-primary"> ${dailyReport.todayNetFlow?.toLocaleString()}</p>
            </div>
            <div className="bg-lightGray dark:bg-gray-700 p-4 rounded-lg shadow-inner text-center">
                <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Dhaqdhaqaaqa Cusub</h4>
                <p className="text-2xl font-bold text-darkGray dark:text-gray-100">{dailyReport.newTransactions}</p>
            </div>
            <div className="bg-lightGray dark:bg-gray-700 p-4 rounded-lg shadow-inner text-center">
                <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Projects Bilaabmay Maanta</h4>
                <p className="text-2xl font-bold text-primary">{dailyReport.projectsStartedToday}</p>
            </div>
            <div className="bg-lightGray dark:bg-gray-700 p-4 rounded-lg shadow-inner text-center">
                <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Projects Dhammaystiran Maanta</h4>
                <p className="text-2xl font-bold text-secondary">{dailyReport.projectsCompletedToday}</p>
            </div>
            <div className="bg-lightGray dark:bg-gray-700 p-4 rounded-lg shadow-inner text-center">
                <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Users Cusub Maanta</h4>
                <p className="text-2xl font-bold text-accent">{dailyReport.newUsersToday}</p>
            </div>
        </div>

        {/* Daily Report Export & Share Options */}
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button className="bg-primary text-white py-2 px-5 rounded-lg font-bold text-base hover:bg-blue-700 transition duration-200 shadow-md flex items-center">
                <Download size={18} className="mr-2"/> Soo Deji PDF
            </button>
            <button className="bg-primary text-white py-2 px-5 rounded-lg font-bold text-base hover:bg-blue-700 transition duration-200 shadow-md flex items-center">
                <Printer size={18} className="mr-2"/> Daabac
            </button>
            <button className="bg-secondary text-white py-2 px-5 rounded-lg font-bold text-base hover:bg-green-600 transition duration-200 shadow-md flex items-center">
                <Mail size={18} className="mr-2"/> U Dir Email
            </button>
            <button className="bg-secondary text-white py-2 px-5 rounded-lg font-bold text-base hover:bg-green-600 transition duration-200 shadow-md flex items-center">
                <MessageSquare size={18} className="mr-2"/> Wadaag (WhatsApp)
            </button>
            <button className="bg-secondary text-white py-2 px-5 rounded-lg font-bold text-base hover:bg-green-600 transition duration-200 shadow-md flex items-center">
                <Send size={18} className="mr-2"/> Wadaag (Telegram)
            </button>
        </div>
      </div>

      {/* Quick Reports Section (Existing links, now with more polish) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
        <Link href="/reports/profit-loss" className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center space-x-6 group">
          <div className="bg-primary/10 text-primary p-4 rounded-full group-hover:bg-primary group-hover:text-white transition-colors duration-200">
            <LineChart size={40} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-darkGray dark:text-gray-100 mb-2">Profit & Loss</h3>
            <p className="text-mediumGray dark:text-gray-400">Warbixin faa'iidada iyo khasaaraha oo faahfaahsan.</p>
          </div>
          <ArrowRight size={24} className="text-mediumGray dark:text-gray-400 group-hover:translate-x-2 transition-transform duration-200 ml-auto" />
        </Link>

        <Link href="/reports/expenses" className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center space-x-6 group">
          <div className="bg-secondary/10 text-secondary p-4 rounded-full group-hover:bg-secondary group-hover:text-white transition-colors duration-200">
            <DollarSign size={40} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-darkGray dark:text-gray-100 mb-2">Expenses Log</h3>
            <p className="text-mediumGray dark:text-gray-400">Diiwaan buuxa oo dhammaan kharashaadka.</p>
          </div>
          <ArrowRight size={24} className="text-mediumGray dark:text-gray-400 group-hover:translate-x-2 transition-transform duration-200 ml-auto" />
        </Link>

        <Link href="/reports/inventory" className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center space-x-6 group">
          <div className="bg-accent/10 text-accent p-4 rounded-full group-hover:bg-accent group-hover:text-white transition-colors duration-200">
            <Warehouse size={40} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-darkGray dark:text-gray-100 mb-2">Inventory Report</h3>
            <p className="text-mediumGray dark:text-gray-400">Warbixin ku saabsan alaabta bakhaarkaaga iyo isticmaalkeeda.</p>
          </div>
          <ArrowRight size={24} className="text-mediumGray dark:text-gray-400 group-hover:translate-x-2 transition-transform duration-200 ml-auto" />
        </Link>

        <Link href="/reports/debts" className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center space-x-6 group">
          <div className="bg-redError/10 text-redError p-4 rounded-full group-hover:bg-redError group-hover:text-white transition-colors duration-200">
            <Scale size={40} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-darkGray dark:text-gray-100 mb-2">Debts Overview</h3>
            <p className="text-mediumGray dark:text-gray-400">La socod deynaha aad leedahay iyo kuwa lagugu leeyahay.</p>
          </div>
          <ArrowRight size={24} className="text-mediumGray dark:text-gray-400 group-hover:translate-x-2 transition-transform duration-200 ml-auto" />
        </Link>

        <Link href="/reports/bank" className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center space-x-6 group">
          <div className="bg-primary/10 text-primary p-4 rounded-full group-hover:bg-primary group-hover:text-white transition-colors duration-200">
            <Banknote size={40} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-darkGray dark:text-gray-100 mb-2">Bank & Cash Flow</h3>
            <p className="text-mediumGray dark:text-gray-400">Dhaqdhaqaaqa lacagta ee xisaabaadkaaga bangiga iyo cash-ka.</p>
          </div>
          <ArrowRight size={24} className="text-mediumGray dark:text-gray-400 group-hover:translate-x-2 transition-transform duration-200 ml-auto" />
        </Link>

        <Link href="/reports/payment-schedule" className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center space-x-6 group">
          <div className="bg-secondary/10 text-secondary p-4 rounded-full group-hover:bg-secondary group-hover:text-white transition-colors duration-200">
            <CreditCard size={40} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-darkGray dark:text-gray-100 mb-2">Payment Schedule</h3>
            <p className="text-mediumGray dark:text-gray-400">Jadwal lacag-bixineed oo la sugayo iyo kuwa la bixiyay.</p>
          </div>
          <ArrowRight size={24} className="text-mediumGray dark:text-gray-400 group-hover:translate-x-2 transition-transform duration-200 ml-auto" />
        </Link>
      </div>
    </Layout>
  );
}