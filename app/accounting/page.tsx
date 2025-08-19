// app/accounting/page.tsx - Accounting Overview Page (10000% Design - API Integration & Enhanced)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '../../components/layouts/Layout';
import { 
  ArrowLeft, Landmark, Plus, Search, Filter, Calendar, List, LayoutGrid, 
  DollarSign, CreditCard, Banknote, RefreshCw, Eye, Edit, Trash2,
  TrendingUp, TrendingDown, Info as InfoIcon, CheckCircle, XCircle, Clock as ClockIcon,
  User as UserIcon, Briefcase as BriefcaseIcon, Tag as TagIcon,
  Coins, Repeat, ReceiptText, Users, Building, Package, Scale, Truck, Mail, Phone // Added specific icons for dynamic fields
} from 'lucide-react';
import Toast from '../../components/common/Toast';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// --- Data Interfaces (Refined for API response) ---
interface Account {
  id: string;
  name: string;
  type: string; // e.g., "BANK", "CASH", "MOBILE_MONEY"
  balance: number; // Converted from Decimal
  currency: string;
}

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
  employee?: { fullName: string; }; // If linked to employee
}

interface OverviewStats {
  totalBalance: number;
  totalIncomeThisMonth: number;
  totalExpensesThisMonth: number;
  netFlowThisMonth: number;
  totalBankAccounts: number;
  totalCashAccounts: number;
  totalMobileMoneyAccounts: number; // Added Mobile Money count
  // For charts
  monthlyCashFlow: { month: string; income: number; expense: number; net: number }[];
  accountDistribution: { name: string; value: number; }[];
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

// --- Account Table Row Component ---
const AccountRow: React.FC<{ account: Account; onEdit: (id: string) => void; onDelete: (id: string) => void }> = ({ account, onEdit, onDelete }) => (
  <tr className="hover:bg-lightGray dark:hover:bg-gray-700 transition-colors duration-150 border-b border-lightGray dark:border-gray-700 last:border-b-0">
    <td className="p-4 whitespace-nowrap text-darkGray dark:text-gray-100 font-medium flex items-center space-x-2">
        <Banknote size={18} className="text-primary"/> <span>{account.name}</span>
    </td>
    <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300">{account.type}</td>
    <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300">{account.currency}</td>
    <td className="p-4 whitespace-nowrap text-darkGray dark:text-gray-100 font-semibold text-right">${account.balance.toLocaleString()}</td>
    <td className="p-4 whitespace-nowrap text-right">
      <div className="flex items-center justify-end space-x-2">
        <Link href={`/accounting/accounts/${account.id}`} className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors duration-200" title="View Details">
          <Eye size={18} />
        </Link>
        <button onClick={() => onEdit(account.id)} className="p-2 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors duration-200" title="Edit Account">
          <Edit size={18} />
        </button>
        <button onClick={() => onDelete(account.id)} className="p-2 rounded-full bg-redError/10 text-redError hover:bg-redError hover:text-white transition-colors duration-200" title="Delete Account">
          <Trash2 size={18} />
        </button>
      </div>
    </td>
  </tr>
);

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
        {transaction.project?.name || transaction.customer?.name || transaction.vendor?.name || transaction.user?.fullName || transaction.employee?.fullName || 'N/A'}
      </td>
      <td className="p-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end space-x-2">
          <Link href={`/accounting/transactions/${transaction.id}`} className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors duration-200" title="View Details">
            <Eye size={18} />
          </Link>
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


export default function AccountingPage() {
  const router = useRouter();
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // --- API Functions ---
  const fetchAccountingData = async () => {
    setPageLoading(true);
    try {
      const [statsResponse, accountsResponse, transactionsResponse] = await Promise.all([
        fetch('/api/accounting/reports'), // Fetch overview stats from new reports API
        fetch('/api/accounting/accounts'),
        fetch('/api/accounting/transactions?limit=5') // Fetch only recent 5 transactions
      ]);

      const statsData = await statsResponse.json();
      const accountsData = await accountsResponse.json();
      const transactionsData = await transactionsResponse.json();

      if (!statsResponse.ok) throw new Error(statsData.message || 'Failed to fetch overview stats');
      if (!accountsResponse.ok) throw new Error(accountsData.message || 'Failed to fetch accounts');
      if (!transactionsResponse.ok) throw new Error(transactionsData.message || 'Failed to fetch transactions');

      setOverviewStats({
        totalBalance: statsData.totalBalance,
        totalIncomeThisMonth: statsData.totalIncomeThisMonth,
        totalExpensesThisMonth: statsData.totalExpensesThisMonth,
        netFlowThisMonth: statsData.netFlowThisMonth,
        totalBankAccounts: statsData.totalBankAccounts,
        totalCashAccounts: statsData.totalCashAccounts,
        totalMobileMoneyAccounts: statsData.totalMobileMoneyAccounts, // Use actual data
        monthlyCashFlow: statsData.monthlyCashFlow, // From reports API
        accountDistribution: statsData.accountDistribution, // From reports API
      });
      setAccounts(accountsData.accounts); // Data already converted to Number in API
      setRecentTransactions(transactionsData.transactions); // Data already converted to Number in API

    } catch (error: any) {
      console.error('Error fetching accounting data:', error);
      setToastMessage({ message: error.message || 'Cilad ayaa dhacday marka xogta accounting-ga la soo gelinayay.', type: 'error' });
      setOverviewStats(null);
      setAccounts([]);
      setRecentTransactions([]);
    } finally {
      setPageLoading(false);
    }
  };

  const handleEditAccount = (id: string) => {
    router.push(`/accounting/accounts/edit/${id}`); // Navigate to edit account page
  };

  const handleDeleteAccount = async (id: string) => {
    if (window.confirm('Ma hubtaa inaad tirtirto account-kan? Tan lama soo celin karo!')) {
      try {
        const response = await fetch(`/api/accounting/accounts/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete account');
        
        setToastMessage({ message: data.message || 'Account-ka si guul leh ayaa loo tirtiray!', type: 'success' });
        fetchAccountingData(); // Re-fetch all data after deleting
      } catch (error: any) {
        console.error('Error deleting account:', error);
        setToastMessage({ message: error.message || 'Cilad ayaa dhacday marka account-ka la tirtirayay.', type: 'error' });
      }
    }
  };

  const handleEditTransaction = (id: string) => {
    router.push(`/accounting/transactions/edit/${id}`); // Navigate to edit transaction page
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
        fetchAccountingData(); // Re-fetch all data after deleting
      } catch (error: any) {
        console.error('Error deleting transaction:', error);
        setToastMessage({ message: error.message || 'Cilad ayaa dhacday marka dhaqdhaqaaqa lacagta la tirtirayay.', type: 'error' });
      }
    }
  };


  useEffect(() => {
    fetchAccountingData();
  }, []);

  // Chart Data for Monthly Cash Flow (from overviewStats)
  const monthlyCashFlowData = overviewStats?.monthlyCashFlow || [];
  const accountDistributionData = overviewStats?.accountDistribution || [];

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-darkGray dark:text-gray-100">
          <Link href="/dashboard" className="text-mediumGray dark:text-gray-400 hover:text-primary transition-colors duration-200 mr-4">
            <ArrowLeft size={28} className="inline-block" />
          </Link>
          Accounting & Finance
        </h1>
        <div className="flex space-x-3">
          <Link href="/accounting/transactions/add" className="bg-primary text-white py-2.5 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-200 shadow-md flex items-center">
            <Plus size={20} className="mr-2" /> Diiwaan Geli Dhaqdhaqaaq
          </Link>
          <button onClick={fetchAccountingData} className="bg-secondary text-white py-2.5 px-6 rounded-lg font-bold text-lg hover:bg-green-600 transition duration-200 shadow-md flex items-center">
            <RefreshCw size={20} className="mr-2" /> Cusboonaysii
          </button>
        </div>
      </div>

      {/* Overview Statistics Cards */}
      {overviewStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Lacagta</h4>
            <p className="text-3xl font-extrabold text-primary">${overviewStats.totalBalance.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Dakhliga Bishaan</h4>
            <p className="text-3xl font-extrabold text-secondary">${overviewStats.totalIncomeThisMonth.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Kharashyada Bishaan</h4>
            <p className="text-3xl font-extrabold text-redError">${overviewStats.totalExpensesThisMonth.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Net Flow Bishaan</h4>
            <p className={`text-3xl font-extrabold ${overviewStats.netFlowThisMonth >= 0 ? 'text-primary' : 'text-redError'}`}>${overviewStats.netFlowThisMonth.toLocaleString()}</p>
          </div>
          {/* New cards for account types */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Accounts-ka Bankiga</h4>
            <p className="text-3xl font-extrabold text-blue-500">{overviewStats.totalBankAccounts}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Accounts-ka Cash-ka</h4>
            <p className="text-3xl font-extrabold text-green-500">{overviewStats.totalCashAccounts}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Accounts-ka Mobile Money</h4>
            <p className="text-3xl font-extrabold text-purple-500">{overviewStats.totalMobileMoneyAccounts}</p>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Cash Flow Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md animate-fade-in-up">
            <h3 className="text-xl font-semibold text-darkGray dark:text-gray-100 mb-4">Dhaqdhaqaaqa Lacagta Bishiiba</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    {monthlyCashFlowData.length > 0 ? (
                        <LineChart data={monthlyCashFlowData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" vertical={false} />
                            <XAxis dataKey="month" stroke="#7F8C8D" className="dark:text-gray-400 text-sm" />
                            <YAxis stroke="#7F8C8D" className="dark:text-gray-400 text-sm" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }}
                                labelStyle={{ color: '#2C3E50', fontWeight: 'bold' }}
                                itemStyle={{ color: '#2C3E50' }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="income" stroke={CHART_COLORS[1]} name="Dakhli" />
                            <Line type="monotone" dataKey="expense" stroke={CHART_COLORS[3]} name="Kharash" />
                            <Line type="monotone" dataKey="net" stroke={CHART_COLORS[0]} name="Net Flow" />
                        </LineChart>
                    ) : (
                        <div className="flex items-center justify-center h-full text-mediumGray dark:text-gray-500">No data for Monthly Cash Flow Chart.</div>
                    )}
                </ResponsiveContainer>
            </div>
        </div>

        {/* Account Distribution Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md animate-fade-in-up">
            <h3 className="text-xl font-semibold text-darkGray dark:text-gray-100 mb-4">Qaybinta Lacagta Accounts-ka</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    {accountDistributionData.length > 0 ? (
                        <PieChart>
                            <Pie
                                data={accountDistributionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={120}
                                dataKey="value"
                            >
                                {accountDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }}
                                labelStyle={{ color: '#2C3E50', fontWeight: 'bold' }}
                                itemStyle={{ color: '#2C3E50' }}
                            />
                            <Legend align="right" verticalAlign="middle" layout="vertical" wrapperStyle={{ paddingLeft: '20px' }} />
                        </PieChart>
                    ) : (
                        <div className="flex items-center justify-center h-full text-mediumGray dark:text-gray-500">No data for Account Distribution Chart.</div>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Tabs for Accounting Sections */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-fade-in-up">
        <div className="border-b border-lightGray dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6 md:px-8" aria-label="Tabs">
            {['Overview', 'Transactions', 'Accounts', 'Reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg focus:outline-none transition-colors duration-200
                            ${activeTab === tab 
                              ? 'border-primary text-primary dark:text-gray-100' 
                              : 'border-transparent text-mediumGray dark:text-gray-400 hover:text-darkGray dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8">
          {activeTab === 'Overview' && (
            <div>
              <h3 className="text-2xl font-bold text-darkGray dark:text-gray-100 mb-4">Guudmarka Maaliyadda</h3>
              <p className="text-mediumGray dark:text-gray-400">
                Halkan waxaad ka arki kartaa guudmarka maaliyadda shirkaddaada, oo ay ku jiraan dhaqdhaqaaqa lacagta iyo xaaladda accounts-ka.
              </p>
              {/* Placeholder for charts or more detailed overview */}
              <div className="mt-6 p-4 bg-lightGray dark:bg-gray-700 rounded-lg text-mediumGray dark:text-gray-400">
                <p>Charts-ka iyo falanqaynta dheeraadka ah ayaa halkan lagu soo bandhigi doonaa.</p>
              </div>
            </div>
          )}

          {activeTab === 'Transactions' && (
            <div>
              <h3 className="text-2xl font-bold text-darkGray dark:text-gray-100 mb-4">Dhaqdhaqaaqa Lacagta Dhawaan</h3>
              {recentTransactions.length === 0 ? (
                <p className="text-mediumGray dark:text-gray-400">Ma jiraan dhaqdhaqaaq lacag ah oo dhawaan ah.</p>
              ) : (
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
                      {recentTransactions.map(trx => (
                        <TransactionRow key={trx.id} transaction={trx} onEdit={handleEditTransaction} onDelete={handleDeleteTransaction} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <Link href="/accounting/transactions" className="mt-4 inline-block text-primary hover:underline text-sm font-medium">
                Fiiri Dhammaan Dhaqdhaqaaqa &rarr;
              </Link>
            </div>
          )}

          {activeTab === 'Accounts' && (
            <div>
              <h3 className="text-2xl font-bold text-darkGray dark:text-gray-100 mb-4">Accounts-ka Lacagta</h3>
              {accounts.length === 0 ? (
                <p className="text-mediumGray dark:text-gray-400">Ma jiraan accounts lacag ah oo la helay.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-lightGray dark:divide-gray-700">
                    <thead className="bg-lightGray dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Magaca Account-ka</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Nooca</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Currency</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Balance</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-lightGray dark:divide-gray-700">
                      {accounts.map(acc => (
                        <AccountRow key={acc.id} account={acc} onEdit={handleEditAccount} onDelete={handleDeleteAccount} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <Link href="/accounting/accounts/add" className="mt-4 bg-primary text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-700 transition duration-200 w-fit">
                  <Plus size={18} className="mr-2"/> Ku Dar Account Cusub
              </Link>
            </div>
          )}

          {activeTab === 'Reports' && (
            <div>
              <h3 className="text-2xl font-bold text-darkGray dark:text-gray-100 mb-4">Warbixinada Maaliyadda</h3>
              <p className="text-mediumGray dark:text-gray-400 mb-4">
                Halkan waxaad ka heli kartaa warbixino maaliyadeed oo faahfaahsan.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/reports/profit-loss" className="bg-lightGray dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center space-x-3">
                  <TrendingUp size={24} className="text-primary"/> <span className="font-semibold text-darkGray dark:text-gray-100">Profit & Loss Report</span>
                </Link>
                <Link href="/reports/bank" className="bg-lightGray dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center space-x-3">
                  <Banknote size={24} className="text-secondary"/> <span className="font-semibold text-darkGray dark:text-gray-100">Bank & Cash Flow Report</span>
                </Link>
                <Link href="/reports/expenses" className="bg-lightGray dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center space-x-3">
                  <DollarSign size={24} className="text-redError"/> <span className="font-semibold text-darkGray dark:text-gray-100">Expenses Report</span>
                </Link>
                {/* Add more report links here */}
              </div>
            </div>
          )}
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage.message} type={toastMessage.type} onClose={() => setToastMessage(null)} />
      )}
    </Layout>
  );
}
