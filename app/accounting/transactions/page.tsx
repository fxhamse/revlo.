// app/accounting/transactions/page.tsx - Transactions List Page (10000% Design - API Integration)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/layouts/Layout';
import { 
  ArrowLeft, Plus, Search, Filter, Calendar, List, LayoutGrid, 
  DollarSign, CreditCard, Banknote, RefreshCw, Eye, Edit, Trash2,
  TrendingUp, TrendingDown, Info as InfoIcon, CheckCircle, XCircle, Clock as ClockIcon,
  User as UserIcon, Briefcase as BriefcaseIcon, Tag as TagIcon, ChevronRight, Loader2 // General icons for tables
} from 'lucide-react';
import Toast from '../../../components/common/Toast';

// --- Transaction Data Interface (Refined for API response) ---
interface Transaction {
  id: string;
  description: string;
  amount: number; // Converted from Decimal
  type: string; // e.g., "INCOME", "EXPENSE", "TRANSFER_IN", "TRANSFER_OUT", "DEBT_TAKEN", "DEBT_REPAID"
  transactionDate: string;
  note?: string;
  account?: { name: string; }; // Primary account
  fromAccount?: { name: string; }; // For transfers
  toAccount?: { name: string; };   // For transfers
  project?: { name: string; };     // If linked to project
  expense?: { description: string; }; // If linked to expense
  customer?: { name: string; };    // If linked to customer
  vendor?: { name: string; };      // If linked to vendor
  user?: { fullName: string; };    // Who recorded
}

// --- Transaction Table Row Component ---
const TransactionRow: React.FC<{ transaction: Transaction; onEdit: (id: string) => void; onDelete: (id: string) => void }> = ({ transaction, onEdit, onDelete }) => {
  const isIncome = transaction.amount >= 0;
  const amountColorClass = isIncome ? 'text-secondary' : 'text-redError';
  const typeBadgeClass = 
    transaction.type === 'INCOME' || transaction.type === 'TRANSFER_IN' ? 'bg-secondary/10 text-secondary' :
    transaction.type === 'EXPENSE' || transaction.type === 'TRANSFER_OUT' || transaction.type === 'DEBT_REPAID' ? 'bg-redError/10 text-redError' :
    'bg-primary/10 text-primary';

  return (
    <tr className="hover:bg-lightGray dark:hover:bg-gray-700 transition-colors duration-150 border-b border-lightGray dark:border-gray-700 last:border-b-0">
      <td className="p-4 whitespace-nowrap text-darkGray dark:text-gray-100">{new Date(transaction.transactionDate).toLocaleDateString()}</td>
      <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300">{transaction.description}</td>
      <td className="p-4 whitespace-nowrap">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${typeBadgeClass}`}>
          {transaction.type}
        </span>
      </td>
      <td className={`p-4 whitespace-nowrap font-semibold ${amountColorClass}`}>
        {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
      </td>
      <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300">{transaction.account?.name || 'N/A'}</td>
      <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300">
        {transaction.project?.name || transaction.customer?.name || transaction.vendor?.name || transaction.user?.fullName || 'N/A'}
      </td>
      <td className="p-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end space-x-2">
          <button onClick={() => onEdit(transaction.id)} className="p-2 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors duration-200" title="Edit Transaction">
            <Edit size={18} />
          </button>
          <button onClick={() => onDelete(transaction.id)} className="p-2 rounded-full bg-redError/10 text-redError hover:bg-redError hover:text-white transition-colors duration-200" title="Delete Transaction">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

// --- Transaction Card Component (for Mobile View) ---
const TransactionCard: React.FC<{ transaction: Transaction; onEdit: (id: string) => void; onDelete: (id: string) => void }> = ({ transaction, onEdit, onDelete }) => {
    const isIncome = transaction.amount >= 0;
    let borderColor = 'border-lightGray dark:border-gray-700';
    if (isIncome) borderColor = 'border-secondary';
    else borderColor = 'border-redError';

    return (
        <div className={`bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md animate-fade-in-up border-l-4 ${borderColor} relative`}>
            <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-darkGray dark:text-gray-100 text-lg flex items-center space-x-2">
                    {isIncome ? <DollarSign size={20} className="text-secondary"/> : <XCircle size={20} className="text-redError"/>} <span>{transaction.description}</span>
                </h4>
                <div className="flex space-x-2 flex-shrink-0">
                    <button onClick={() => onEdit(transaction.id)} className="p-1 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors duration-200" title="Edit">
                        <Edit size={16} />
                    </button>
                    <button onClick={() => onDelete(transaction.id)} className="p-1 rounded-full bg-redError/10 text-redError hover:bg-redError hover:text-white transition-colors duration-200" title="Delete">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
                <Calendar size={14}/> <span>Taariikhda: {new Date(transaction.transactionDate).toLocaleDateString()}</span>
            </p>
            <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
                <TagIcon size={14}/> <span>Nooca: {transaction.type}</span>
            </p>
            <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
                <Banknote size={14}/> <span>Account: {transaction.account?.name || 'N/A'}</span>
            </p>
            <p className="text-sm text-mediumGray dark:text-gray-400 flex items-center space-x-2">
                <InfoIcon size={14}/> <span>La Xiriira: {transaction.project?.name || transaction.customer?.name || transaction.vendor?.name || transaction.user?.fullName || 'N/A'}</span>
            </p>
            <div className={`mt-3 text-2xl font-bold ${isIncome ? 'text-secondary' : 'text-redError'}`}>
                {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
            </div>
        </div>
    );
};


export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterAccount, setFilterAccount] = useState('All');
  const [filterDateRange, setFilterDateRange] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [pageLoading, setPageLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Dummy filter options (will be fetched from API in real app)
  const transactionTypes = ['All', 'INCOME', 'EXPENSE', 'TRANSFER_IN', 'TRANSFER_OUT', 'DEBT_TAKEN', 'DEBT_REPAID', 'OTHER'];
  const accountNames = ['All', 'CBE Account', 'Ebirr Account', 'Cash']; // Example accounts
  const dateRanges = ['All', 'Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'This Quarter', 'This Year'];

  // --- API Functions ---
  const fetchTransactions = async () => {
    setPageLoading(true);
    try {
      const response = await fetch('/api/accounting/transactions');
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data.transactions.map((trx: any) => ({ ...trx, amount: parseFloat(trx.amount) }))); // Convert Decimal to Number
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      setToastMessage({ message: error.message || 'Cilad ayaa dhacday marka dhaqdhaqaaqa lacagta la soo gelinayay.', type: 'error' });
      setTransactions([]);
    } finally {
      setPageLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Ma hubtaa inaad tirtirto dhaqdhaqaaqan lacagta ah? Tan lama soo celin karo!')) {
      try {
        const response = await fetch(`/api/accounting/transactions/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete transaction');
        
        setToastMessage({ message: data.message || 'Dhaqdhaqaaqa lacagta si guul leh ayaa loo tirtiray!', type: 'success' });
        fetchTransactions(); // Re-fetch transactions after deleting
      } catch (error: any) {
        console.error('Error deleting transaction:', error);
        setToastMessage({ message: error.message || 'Cilad ayaa dhacday marka dhaqdhaqaaqa lacagta la tirtirayay.', type: 'error' });
      }
    }
  };

  const handleEditTransaction = (id: string) => {
    router.push(`/accounting/transactions/edit/${id}`); // Navigate to edit transaction page
  };

  useEffect(() => {
    fetchTransactions(); // Fetch transactions on component mount
  }, []); 


  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (transaction.account?.name && transaction.account.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'All' || transaction.type === filterType;
    const matchesAccount = filterAccount === 'All' || transaction.account?.name === filterAccount;
    const matchesDate = filterDateRange === 'All' ? true : true; 

    return matchesSearch && matchesType && matchesAccount && matchesDate;
  });

  // Statistics
  const totalTransactionsCount = filteredTransactions.length;
  const totalIncome = filteredTransactions.filter(t => t.amount >= 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netFlow = totalIncome - totalExpenses;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-darkGray dark:text-gray-100">
          <Link href="/accounting" className="text-mediumGray dark:text-gray-400 hover:text-primary transition-colors duration-200 mr-4">
            <ArrowLeft size={28} className="inline-block" />
          </Link>
          Dhaqdhaqaaqa Lacagta
        </h1>
        <div className="flex space-x-3">
          <Link href="/accounting/transactions/add" className="bg-primary text-white py-2.5 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-200 shadow-md flex items-center">
            <Plus size={20} className="mr-2" /> Diiwaan Geli Dhaqdhaqaaq
          </Link>
          <button onClick={fetchTransactions} className="bg-secondary text-white py-2.5 px-6 rounded-lg font-bold text-lg hover:bg-green-600 transition duration-200 shadow-md flex items-center">
            <RefreshCw size={20} className="mr-2" /> Cusboonaysii
          </button>
        </div>
      </div>

      {/* Transaction Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Dhaqdhaqaaqa</h4>
          <p className="text-3xl font-extrabold text-primary">{totalTransactionsCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Dakhliga</h4>
          <p className="text-3xl font-extrabold text-secondary">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Kharashyada</h4>
          <p className="text-3xl font-extrabold text-redError">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Net Flow</h4>
          <p className={`text-3xl font-extrabold ${netFlow >= 0 ? 'text-primary' : 'text-redError'}`}>${netFlow.toLocaleString()}</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 animate-fade-in-up">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search transactions by description or type..."
            className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 placeholder-mediumGray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Filter by Type */}
        <div className="relative w-full md:w-48">
          <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" />
          <select
            className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 appearance-none"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            {transactionTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400">
            <ChevronRight className="transform rotate-90" size={20} />
          </div>
        </div>
        {/* Filter by Account */}
        <div className="relative w-full md:w-48">
          <CreditCard size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" />
          <select
            className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 appearance-none"
            value={filterAccount}
            onChange={(e) => setFilterAccount(e.target.value)}
          >
            {accountNames.map(acc => <option key={acc} value={acc}>{acc}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400">
            <ChevronRight className="transform rotate-90" size={20} />
          </div>
        </div>
        {/* Filter by Date Range */}
        <div className="relative w-full md:w-48">
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

      {/* Transactions View */}
      {pageLoading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="animate-spin mr-3 text-primary" size={32} /> Loading Transactions...
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center text-mediumGray dark:text-gray-400 animate-fade-in">
          Ma jiraan dhaqdhaqaaq lacag ah oo la helay.
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-lightGray dark:divide-gray-700">
              <thead className="bg-lightGray dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Taariikhda</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Sharaxaad</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Nooca</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Qiimaha</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Account</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">La Xiriira</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lightGray dark:divide-gray-700">
                {filteredTransactions.map(trx => (
                  <TransactionRow key={trx.id} transaction={trx} onEdit={handleEditTransaction} onDelete={handleDeleteTransaction} />
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Placeholder */}
          <div className="p-4 flex justify-between items-center border-t border-lightGray dark:border-gray-700">
              <button className="text-sm text-mediumGray dark:text-gray-400 hover:text-primary transition">Hore</button>
              <span className="text-sm text-darkGray dark:text-gray-100">Page 1 of {Math.ceil(filteredTransactions.length / 10) || 1}</span>
              <button className="text-sm text-mediumGray dark:text-gray-400 hover:text-primary transition">Next</button>
          </div>
        </div>
      ) : ( /* Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredTransactions.map(trx => (
                <TransactionCard key={trx.id} transaction={trx} onEdit={handleEditTransaction} onDelete={handleDeleteTransaction} />
            ))}
        </div>
      )}

      {toastMessage && (
        <Toast message={toastMessage.message} type={toastMessage.type} onClose={() => setToastMessage(null)} />
      )}
    </Layout>
  );
}
