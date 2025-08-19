// app/expenses/page.tsx - Expenses List Page (10000% Design with API Integration)
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Calendar, List, LayoutGrid, DollarSign, Tag, User, ChevronRight, BarChart, 
  Eye, Edit, Trash2, TrendingUp, TrendingDown, FileUp, Download, PieChart, Info, Briefcase, CreditCard,
  ChevronUp, ChevronDown, LineChart as LineChartIcon, BarChart as BarChartIcon, PieChart as PieChartIcon, AreaChart as AreaChartIcon, ScatterChart as ScatterChartIcon,
  Loader2, // Added Loader2 for loading state
  Building, CheckCircle, XCircle
} from "lucide-react";
import {
  ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend,
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart as RechartsLineChart, Line, AreaChart as RechartsAreaChart, Area, ScatterChart as RechartsScatterChart, Scatter
} from "recharts";
import Toast from "../../components/common/Toast";
import Layout from "../../components/layouts/Layout";
import Link from "next/link";

// --- Expense Data Interface (Refined for API response) ---
interface Expense {
  id: string;
  date: string;
  project?: string; // Project name from API, optional
  category: string;
  subCategory?: string;
  description: string;
  amount: number;
  paidFrom: string;
  note?: string;
  approved?: boolean; // Optional, if approval status is part of the expense
  employeeName?: string;
  customerName?: string;
  vendorName?: string;
}

const ExpenseRow: React.FC<{ expense: Expense; onDelete: (id: string) => void; onApprove: (id: string) => void }> = ({ expense, onDelete, onApprove }) => (
  <tr className="hover:bg-lightGray dark:hover:bg-gray-700 transition-colors duration-150 border-b border-lightGray dark:border-gray-700 last:border-b-0">
    <td className="p-4 whitespace-nowrap text-darkGray dark:text-gray-100">{new Date(expense.date).toLocaleDateString()}</td>
    <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300">{expense.project || 'N/A'}</td>
    <td className="p-4 whitespace-nowrap text-darkGray dark:text-gray-100 font-medium flex items-center space-x-2">
      <Tag size={16} className="text-primary"/> 
      <span>
        {expense.category === 'Company Expense' && expense.subCategory ? expense.subCategory : expense.category}
      </span>
    </td>
    <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300">
      {expense.category === 'Company Expense' && expense.subCategory && expense.description
        ? `${expense.subCategory}: ${expense.description}`
        : expense.description}
    </td>
    <td className="p-4 whitespace-nowrap text-redError font-semibold text-right">-${expense.amount.toLocaleString()}</td>
    <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300">{expense.paidFrom}</td>
    {/* Related To column */}
    <td className="p-4 whitespace-nowrap text-darkGray dark:text-gray-100">
      {expense.employeeName ? `Employee: ${expense.employeeName}` :
        expense.customerName ? `Customer: ${expense.customerName}` :
        expense.vendorName ? `Vendor: ${expense.vendorName}` :
        'Company'}
    </td>
    <td className="p-4 text-mediumGray dark:text-gray-300 truncate max-w-xs">{expense.note || 'N/A'}</td>
    <td className="p-4 whitespace-nowrap text-center">
      {expense.approved ? (
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
          <CheckCircle size={16} className="mr-1" /> Approved
        </span>
      ) : (
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
          <XCircle size={16} className="mr-1" /> Pending
        </span>
      )}
    </td>
    <td className="p-4 whitespace-nowrap text-right">
      <div className="flex items-center justify-end space-x-2">
        <Link href={`/expenses/${expense.id}`} className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors duration-200" title="View Details">
          <Eye size={18} />
        </Link>
        <Link href={`/expenses/edit/${expense.id}`} className="p-2 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors duration-200" title="Edit Expense">
          <Edit size={18} />
        </Link>
        <button onClick={() => onDelete(expense.id)} className="p-2 rounded-full bg-redError/10 text-redError hover:bg-redError hover:text-white transition-colors duration-200" title="Delete Expense">
          <Trash2 size={18} />
        </button>
        {/* Approve Button */}
        {expense.approved ? null : (
          <button onClick={() => onApprove(expense.id)} className="p-2 rounded-full bg-yellow-400/20 text-yellow-700 hover:bg-yellow-500 hover:text-white transition-colors duration-200" title="Approve Expense">
            <CheckCircle size={18} className="inline mr-1" /> Approve
          </button>
        )}
      </div>
    </td>
  </tr>
);

const ExpenseCard: React.FC<{ expense: Expense; onDelete: (id: string) => void }> = ({ expense, onDelete }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-redError animate-fade-in-up">
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-semibold text-darkGray dark:text-gray-100">{expense.description}</h4>
      <span className="text-redError font-bold text-lg">-${expense.amount.toLocaleString()}</span>
    </div>
    <p className="text-sm text-mediumGray dark:text-gray-400 mb-1">Project: {expense.project || 'N/A'}</p>
    <p className="text-sm text-mediumGray dark:text-gray-400 mb-1">Category: {expense.category}</p>
    <p className="text-sm text-mediumGray dark:text-gray-400 mb-1">
      {expense.employeeName ? `Employee: ${expense.employeeName}` :
      expense.customerName ? `Customer: ${expense.customerName}` :
      expense.vendorName ? `Vendor: ${expense.vendorName}` :
      'Company'}
    </p>
    <p className="text-sm text-mediumGray dark:text-gray-400">Date: {new Date(expense.date).toLocaleDateString()}</p>
    <div className="flex justify-end space-x-2 mt-3">
      <Link href={`/expenses/${expense.id}`} className="p-1 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors duration-200" title="View Details">
        <Eye size={16} />
      </Link>
      <Link href={`/expenses/edit/${expense.id}`} className="p-1 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors duration-200" title="Edit Expense">
        <Edit size={16} />
      </Link>
      <button onClick={() => onDelete(expense.id)} className="p-1 rounded-full bg-redError/10 text-redError hover:bg-redError hover:text-white transition-colors duration-200" title="Delete Expense">
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

// Helper function to aggregate data for charts
const aggregateExpensesByMonth = (expenses: Expense[], categories: string[]) => {
    const monthlyDataMap: { [key: string]: { month: string; total: number } & { [key: string]: number } } = {};
    
    expenses.forEach(exp => {
        const date = new Date(exp.date);
        const monthYear = date.toLocaleString('en-US', { month: 'short', year: '2-digit' }); // e.g., 'Jul 25'
        
        if (!monthlyDataMap[monthYear]) {
            monthlyDataMap[monthYear] = { month: monthYear, total: 0 } as { month: string; total: number } & { [key: string]: number };
            categories.filter(c => c !== 'All').forEach(c => monthlyDataMap[monthYear][c] = 0); // Initialize all categories
        }
        monthlyDataMap[monthYear].total += exp.amount;
        monthlyDataMap[monthYear][exp.category] = (monthlyDataMap[monthYear][exp.category] || 0) + exp.amount;
    });

    // Sort by date (simple alphabetical sort of month-year string for now, could be improved with actual date objects)
    const sortedData = Object.values(monthlyDataMap).sort((a, b) => {
        const [monthA, yearA] = a.month.split(' ');
        const [monthB, yearB] = b.month.split(' ');
        const dateA = new Date(`1 ${monthA} 20${yearA}`);
        const dateB = new Date(`1 ${monthB} 20${yearB}`);
        return dateA.getTime() - dateB.getTime();
    });

    return sortedData;
};


export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]); // All expenses
  const [companyExpenses, setCompanyExpenses] = useState<Expense[]>([]); // Only company expenses
  const [projectExpenses, setProjectExpenses] = useState<Expense[]>([]); // Only project expenses
  const [activeExpenseType, setActiveExpenseType] = useState<'company' | 'project'>('company');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterProject, setFilterProject] = useState('All');
  const [filterPaidFrom, setFilterPaidFrom] = useState('All');
  const [filterDateRange, setFilterDateRange] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list'); 
  const [showChartSection, setShowChartSection] = useState(true);
  const [activeChartType, setActiveChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [pageLoading, setPageLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);


  // --- API Functions ---
  const fetchExpenses = async () => {
    setPageLoading(true);
    try {
      const response = await fetch('/api/expenses');
      if (!response.ok) throw new Error('Failed to fetch expenses');
      const data = await response.json();
      setExpenses(data.expenses);
      // Split expenses into company and project
      setCompanyExpenses(data.expenses.filter((exp: Expense) =>
        (exp.category && exp.category.toLowerCase().includes('company')) ||
        (exp.project === 'Internal' || exp.project === '' || exp.project === null || exp.project === undefined)
      ));
      setProjectExpenses(data.expenses.filter((exp: Expense) =>
        exp.project && exp.project !== 'Internal' && exp.project !== '' && exp.project !== null && exp.project !== undefined
      ));
    } catch (error: any) {
      console.error('Error fetching expenses:', error);
      setToastMessage({ message: error.message || 'Cilad ayaa dhacday marka kharashyada la soo gelinayay.', type: 'error' });
      setExpenses([]);
      setCompanyExpenses([]);
      setProjectExpenses([]);
    } finally {
      setPageLoading(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (window.confirm('Ma hubtaa inaad tirtirto kharashkan? Tan lama soo celin karo!')) {
      try {
        const response = await fetch(`/api/expenses/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete expense');
        
        setToastMessage({ message: data.message || 'Kharashka si guul leh ayaa loo tirtiray!', type: 'success' });
        fetchExpenses(); // Re-fetch expenses after deleting
      } catch (error: any) {
        console.error('Error deleting expense:', error);
        setToastMessage({ message: error.message || 'Cilad ayaa dhacday marka kharashka la tirtirayay.', type: 'error' });
      }
    }
  };

  // Approve expense
  const handleApproveExpense = async (id: string) => {
    if (!window.confirm('Ma hubtaa inaad rabto inaad ansixiso kharashkan?')) return;
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to approve expense');
      setToastMessage({ message: 'Kharashka si guul leh ayaa loo ansixiyay!', type: 'success' });
      fetchExpenses();
    } catch (error: any) {
      setToastMessage({ message: error.message || 'Cilad ayaa dhacday marka la ansixinayay.', type: 'error' });
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);


  // Filtered expenses based on active type
  const filteredExpenses = (activeExpenseType === 'company' ? companyExpenses : projectExpenses).filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.project && expense.project.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (expense.note && expense.note.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'All' || expense.category === filterCategory;
    const matchesProject = filterProject === 'All'
      ? true
      : filterProject === 'Internal'
        ? expense.project === 'Internal'
        : expense.project === filterProject;
    const matchesPaidFrom = filterPaidFrom === 'All' || expense.paidFrom === filterPaidFrom;
    const matchesDate = filterDateRange === 'All' ? true : true;
    return matchesSearch && matchesCategory && matchesProject && matchesPaidFrom && matchesDate;
  });

  // API-driven filter options
  const [categories, setCategories] = useState<string[]>(['All']);
  const [projects, setProjects] = useState<string[]>(['All']);
  const paidFromOptions = ['All', 'CBE', 'Ebirr', 'Cash']; // Haddii ay static yihiin, waa OK
  const dateRanges = ['All', 'Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'This Quarter', 'This Year'];

  // Fetch filter options from APIs
  useEffect(() => {
    // Categories
    fetch('/api/expenses/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories) {
          setCategories(['All', ...data.categories.map((cat: any) => cat.name)]);
        }
      });
    // Projects
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.projects) {
          setProjects(['All', ...data.projects.map((proj: any) => proj.name)]);
        }
      });
  }, []);

  // Expense Statistics (per type)
  const totalExpensesAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const projectExpensesAmount = projectExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const companyExpensesAmount = companyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const expensesCount = filteredExpenses.length;
  const averageExpense = expensesCount > 0 ? filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0) / expensesCount : 0;

  // Data for Category Pie Chart (used for Pie and other charts if applicable)
  const categoryData = categories.filter(cat => cat !== 'All').map(cat => ({
    name: cat,
    value: filteredExpenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0),
  })).filter(item => item.value > 0);

  // Data for Monthly Trend Chart (Line/Bar)
  const monthlyExpensesData = aggregateExpensesByMonth(filteredExpenses, categories); 

  const PIE_COLORS = ['#3498DB', '#2ECC71', '#F39C12', '#E74C3C', '#9B59B6', '#1ABC9C', '#34495E', '#A0A0A0', '#FFD700', '#FF6347', '#4682B4']; 

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



  // --- Render Loading State ---
  if (pageLoading) {
    return (
      <Layout>
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="animate-spin mr-3 text-primary" size={32} /> Loading Expenses...
        </div>
        {toastMessage && <Toast message={toastMessage.message} type={toastMessage.type} onClose={() => setToastMessage(null)} />}
      </Layout>
    );
  }

  return (
    <Layout>
      {toastMessage && <Toast message={toastMessage.message} type={toastMessage.type} onClose={() => setToastMessage(null)} />}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <h1 className="text-4xl font-bold text-darkGray dark:text-gray-100 mb-4 md:mb-0">Expenses</h1>
        <div className="flex space-x-3">
            <Link href="/expenses/import" className="bg-primary text-white py-2.5 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-200 shadow-md flex items-center">
                <FileUp className="mr-2" size={20} /> Import Bulk
            </Link>
            <Link href="/expenses/add" className="bg-secondary text-white py-2.5 px-6 rounded-lg font-bold text-lg hover:bg-green-600 transition duration-200 shadow-md flex items-center">
                <Plus className="mr-2" size={20} /> Add New Expense
            </Link>
        </div>
      </div>

      {/* Expense Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Total Expenses (All)</h4>
              <p className="text-3xl font-extrabold text-redError">-${totalExpensesAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Project Expenses</h4>
              <p className="text-3xl font-extrabold text-primary">-${projectExpensesAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Company Expenses</h4>
              <p className="text-3xl font-extrabold text-accent">-${companyExpensesAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Average Expense</h4>
              <p className="text-3xl font-extrabold text-secondary">-${averageExpense.toFixed(2)}</p>
          </div>
      </div>

      {/* Search, Filter & View Mode Bar */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 animate-fade-in-up">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by description, project, or note..."
            className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 placeholder-mediumGray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Filter by Category */}
        <div className="relative w-full md:w-48">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
          <select
            className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 appearance-none"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400">
            <ChevronRight className="transform rotate-90" size={20} />
          </div>
        </div>
        {/* Filter by Project */}
        <div className="relative w-full md:w-48">
          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
          <select
            className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 appearance-none"
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
          >
            {projects.map(proj => <option key={proj} value={proj}>{proj}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400">
            <ChevronRight className="transform rotate-90" size={20} />
          </div>
        </div>
        {/* Filter by Paid From */}
        <div className="relative w-full md:w-48">
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
          <select
            className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 appearance-none"
            value={filterPaidFrom}
            onChange={(e) => setFilterPaidFrom(e.target.value)}
          >
            {paidFromOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400">
            <ChevronRight className="transform rotate-90" size={20} />
          </div>
        </div>
        {/* Filter by Date Range */}
        <div className="relative w-full md:w-48">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
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
        {/* View Mode Toggle */}
        <div className="flex space-x-2 w-full md:w-auto justify-center">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-lightGray dark:bg-gray-700 text-mediumGray dark:text-gray-400'} hover:bg-primary/80 dark:hover:bg-gray-600 transition-colors duration-200`}>
                <List size={20} />
            </button>
            <button onClick={() => setViewMode('cards')} className={`p-2 rounded-lg ${viewMode === 'cards' ? 'bg-primary text-white' : 'bg-lightGray dark:bg-gray-700 text-mediumGray dark:text-gray-400'} hover:bg-primary/80 dark:hover:bg-gray-600 transition-colors duration-200`}>
                <LayoutGrid size={20} />
            </button>
        </div>
      </div>

      {/* Expense Type Toggle Buttons (compact, left-aligned, no background) */}
      <div className="flex items-center mb-6 animate-fade-in-up">
        <button
          className={`flex items-center px-5 py-2 rounded-lg font-bold text-base border-2 transition-colors duration-200 mr-3 focus:outline-none ${activeExpenseType === 'company' ? 'bg-accent text-white border-accent scale-105' : 'bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 border-lightGray dark:border-gray-700 hover:scale-105'}`}
          onClick={() => setActiveExpenseType('company')}
        >
          <Building className="mr-2" size={22} /> Company Expenses
        </button>
        <button
          className={`flex items-center px-5 py-2 rounded-lg font-bold text-base border-2 transition-colors duration-200 focus:outline-none ${activeExpenseType === 'project' ? 'bg-primary text-white border-primary scale-105' : 'bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 border-lightGray dark:border-gray-700 hover:scale-105'}`}
          onClick={() => setActiveExpenseType('project')}
        >
          <Briefcase className="mr-2" size={22} /> Project Expenses
        </button>
      </div>


      {/* Expenses View */}
      {filteredExpenses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center text-mediumGray dark:text-gray-400 animate-fade-in">
          No expenses found matching your criteria.
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-lightGray dark:divide-gray-700">
              <thead className="bg-lightGray dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Project</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Paid From</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Related To</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Note</th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Approved</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lightGray dark:divide-gray-700">
                {filteredExpenses.map(expense => (
                  <ExpenseRow key={expense.id} expense={expense} onDelete={handleDeleteExpense} onApprove={handleApproveExpense} />
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Placeholder */}
          <div className="p-4 flex justify-between items-center border-t border-lightGray dark:border-gray-700">
              <button className="text-sm text-mediumGray dark:text-gray-400 hover:text-primary transition">Hore</button>
              <span className="text-sm text-darkGray dark:text-gray-100">Page 1 of {Math.ceil(filteredExpenses.length / 10) || 1}</span>
              <button className="text-sm text-mediumGray dark:text-gray-400 hover:text-primary transition">Next</button>
          </div>
        </div>
      ) : ( /* Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredExpenses.map(expense => (
                <ExpenseCard key={expense.id} expense={expense} onDelete={handleDeleteExpense} />
            ))}
        </div>
      )}
    </Layout>
  );
}
