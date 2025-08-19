// app/reports/debts/page.tsx - Debts Overview Report Page (10000% Design - Final Update)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../../components/layouts/Layout';
import { 
  ArrowLeft, Scale, Plus, Search, Filter, Calendar, List, LayoutGrid, 
  DollarSign, User, Briefcase, CheckCircle, XCircle, ChevronRight, 
  TrendingUp, TrendingDown, Eye, Edit, Trash2, CreditCard, Clock as ClockIcon,
  Download, Upload, FileText, Bell, Tag, Info as InfoIcon // Added InfoIcon for status
} from 'lucide-react';
import Toast from '../../../components/common/Toast'; // Reuse Toast component

// --- Types ---
type Debt = {
  id: string;
  lender: string;
  type: string;
  amount: number;
  paid: number;
  remaining: number;
  issueDate: string;
  dueDate: string;
  status: 'Active' | 'Upcoming' | 'Overdue' | 'Paid';
};

type Receivable = {
  id: string;
  client: string;
  project: string;
  amount: number;
  received: number;
  remaining: number;
  dueDate: string;
  status: 'Upcoming' | 'Overdue' | 'Paid';
};

// --- Debt Table Row Component ---
const DebtRow: React.FC<{ debt: Debt; onRecordPayment: (id: string) => void; onDelete: (id: string) => void }> = ({ debt, onRecordPayment, onDelete }) => {
  let statusClass = '';
  let statusBgClass = '';
  let statusIcon: React.ReactNode;
  switch (debt.status) {
    case 'Overdue':
      statusClass = 'text-redError';
      statusBgClass = 'bg-redError/10';
      statusIcon = <XCircle size={16} />;
      break;
    case 'Upcoming':
      statusClass = 'text-primary';
      statusBgClass = 'bg-primary/10';
      statusIcon = <ClockIcon size={16} />;
      break;
    case 'Active':
      statusClass = 'text-accent';
      statusBgClass = 'bg-accent/10';
      statusIcon = <InfoIcon size={16} />;
      break;
    case 'Paid':
      statusClass = 'text-secondary';
      statusBgClass = 'bg-secondary/10';
      statusIcon = <CheckCircle size={16} />;
      break;
    default:
      statusClass = 'text-mediumGray';
      statusBgClass = 'bg-mediumGray/10';
      statusIcon = <InfoIcon size={16} />;
  }

  return (
    <tr className="hover:bg-lightGray dark:hover:bg-gray-700 transition-colors duration-150 border-b border-lightGray dark:border-gray-700 last:border-b-0">
      <td className="p-4 text-darkGray dark:text-gray-100 font-medium flex items-center space-x-2 w-[15%]"> {/* Fixed width */}
          <User size={18} className="text-primary"/> <span>{debt.lender}</span>
      </td>
      <td className="p-4 text-mediumGray dark:text-gray-300 flex items-center space-x-2 w-[12%]"> {/* Fixed width */}
          <Tag size={16} className="text-secondary"/> <span>{debt.type}</span>
      </td>
      <td className="p-4 text-darkGray dark:text-gray-100 font-semibold text-right w-[10%]">${debt.amount.toLocaleString()}</td> {/* Right aligned */}
      <td className="p-4 text-mediumGray dark:text-gray-300 text-right w-[10%]">${debt.paid.toLocaleString()}</td> {/* Right aligned */}
      <td className="p-4 text-redError font-semibold text-right w-[10%]">${debt.remaining.toLocaleString()}</td> {/* Right aligned */}
      <td className="p-4 text-mediumGray dark:text-gray-300 text-right w-[12%]">{new Date(debt.dueDate).toLocaleDateString()}</td> {/* Right aligned */}
      <td className="p-4 text-center w-[10%]"> {/* Centered */}
        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center justify-center space-x-1 ${statusClass} ${statusBgClass}`}>
          {statusIcon} <span>{debt.status}</span>
        </span>
      </td>
      <td className="p-4 text-right w-[15%]"> {/* Fixed width for actions */}
        <div className="flex items-center justify-end space-x-2">
          {debt.status !== 'Paid' && (
            <button onClick={() => onRecordPayment(debt.id)} className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors duration-200" title="Record Repayment">
              <CreditCard size={18} />
            </button>
          )}
          <button onClick={() => onDelete(debt.id)} className="p-2 rounded-full bg-redError/10 text-redError hover:bg-redError hover:text-white transition-colors duration-200" title="Delete Debt Record">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

// --- Receivable Table Row Component ---
const ReceivableRow: React.FC<{ receivable: Receivable; onRecordReceipt: (id: string) => void; onSendReminder: (id: string) => void }> = ({ receivable, onRecordReceipt, onSendReminder }) => {
    let statusClass = '';
    let statusBgClass = '';
    let statusIcon: React.ReactNode;

    switch (receivable.status) {
        case 'Overdue':
            statusClass = 'text-redError';
            statusBgClass = 'bg-redError/10';
            statusIcon = <XCircle size={16} />;
            break;
        case 'Upcoming':
            statusClass = 'text-primary';
            statusBgClass = 'bg-primary/10';
            statusIcon = <ClockIcon size={16} />;
            break;
        case 'Paid':
            statusClass = 'text-secondary';
            statusBgClass = 'bg-secondary/10';
            statusIcon = <CheckCircle size={16} />;
            break;
        default:
            statusClass = 'text-mediumGray';
            statusBgClass = 'bg-mediumGray/10';
            statusIcon = <InfoIcon size={16} />;
    }

    return (
        <tr className="hover:bg-lightGray dark:hover:bg-gray-700 transition-colors duration-150 border-b border-lightGray dark:border-gray-700 last:border-b-0">
            <td className="p-4 text-darkGray dark:text-gray-100 font-medium flex items-center space-x-2 w-[15%]"> {/* Fixed width */}
                <User size={18} className="text-primary"/> <span>{receivable.client}</span>
            </td>
            <td className="p-4 text-mediumGray dark:text-gray-300 flex items-center space-x-2 w-[12%]"> {/* Fixed width */}
                <Briefcase size={16}/> <span>{receivable.project}</span>
            </td>
            <td className="p-4 text-darkGray dark:text-gray-100 font-semibold text-right w-[10%]">${receivable.amount.toLocaleString()}</td> {/* Right aligned */}
            <td className="p-4 text-secondary font-semibold text-right w-[10%]">${receivable.received.toLocaleString()}</td> {/* Right aligned */}
            <td className={`p-4 font-semibold text-redError text-right w-[10%]`}>${receivable.remaining.toLocaleString()}</td> {/* Right aligned */}
            <td className="p-4 text-mediumGray dark:text-gray-300 text-right w-[12%]">{new Date(receivable.dueDate).toLocaleDateString()}</td> {/* Right aligned */}
            <td className="p-4 text-center w-[10%]"> {/* Centered */}
                <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center justify-center space-x-1 ${statusClass} ${statusBgClass}`}>
                    {statusIcon} <span>{status}</span>
                </span>
            </td>
            <td className="p-4 text-right w-[15%]"> {/* Fixed width for actions */}
                <div className="flex items-center justify-end space-x-2">
                    {receivable.status !== 'Paid' && (
                        <button onClick={() => onRecordReceipt(receivable.id)} className="p-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-colors duration-200" title="Record Receipt">
                            <CreditCard size={18} />
                        </button>
                    )}
                    {receivable.remaining > 0 && (
                        <button onClick={() => onSendReminder(receivable.id)} className="p-2 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors duration-200" title="Send Reminder">
                            <Bell size={18} />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

// --- Debt Card Component (for Mobile View) ---
const DebtCard: React.FC<{ debt: Debt; onRecordPayment: (id: string) => void; onDelete: (id: string) => void }> = ({ debt, onRecordPayment, onDelete }) => {
    const remaining = debt.remaining;
    let statusClass = '';
    let statusBgClass = '';

    switch (debt.status) {
        case 'Overdue': statusClass = 'text-redError'; statusBgClass = 'bg-redError/10'; break;
        case 'Upcoming': statusClass = 'text-primary'; statusBgClass = 'bg-primary/10'; break;
        case 'Active': statusClass = 'text-accent'; statusBgClass = 'bg-accent/10'; break;
        case 'Paid': statusClass = 'text-secondary'; statusBgClass = 'bg-secondary/10'; break;
        default: statusClass = 'text-mediumGray'; statusBgClass = 'bg-mediumGray/10';
    }

    return (
        <div className={`bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md animate-fade-in-up border-l-4 ${remaining > 0 ? 'border-redError' : 'border-secondary'} relative`}>
            <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-darkGray dark:text-gray-100 text-lg flex items-center space-x-2">
                    <User size={20} className="text-primary"/> <span>{debt.lender}</span>
                </h4>
                <div className="flex space-x-2 flex-shrink-0">
                    {debt.status !== 'Paid' && (
                        <button onClick={() => onRecordPayment(debt.id)} className="p-1 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors duration-200" title="Record Repayment">
                            <CreditCard size={16} />
                        </button>
                    )}
                    <button onClick={() => onDelete(debt.id)} className="p-1 rounded-full bg-redError/10 text-redError hover:bg-redError hover:text-white transition-colors duration-200" title="Delete">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
                <Tag size={14} className="text-secondary"/> <span>Nooca: {debt.type}</span>
            </p>
            <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
                <DollarSign size={14} className="text-darkGray"/> <span>Qiimaha: ${debt.amount.toLocaleString()}</span>
            </p>
            <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
                <DollarSign size={14} className="text-secondary"/> <span>La Bixiyay: ${debt.paid.toLocaleString()}</span>
            </p>
            <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
                <DollarSign size={14} className="text-redError"/> <span>Hadhay: ${remaining.toLocaleString()}</span>
            </p>
            <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
                <Calendar size={14}/> <span>La Sugayo: {new Date(debt.dueDate).toLocaleDateString()}</span>
            </p>
            <div className={`mt-2 px-2 py-1 rounded-full text-xs font-semibold flex items-center justify-center space-x-1 ${statusClass} ${statusBgClass}`}>
                <span>{debt.status}</span>
            </div>
        </div>
    );
};

// --- Receivable Card Component (for Mobile View) ---
const ReceivableCard: React.FC<{ receivable: Receivable; onRecordReceipt: (id: string) => void; onSendReminder: (id: string) => void }> = ({ receivable, onRecordReceipt, onSendReminder }) => {
    const remaining = receivable.remaining;
    let statusClass = '';
    let statusBgClass = '';

    switch (receivable.status) {
        case 'Overdue': statusClass = 'text-redError'; statusBgClass = 'bg-redError/10'; break;
        case 'Upcoming': statusClass = 'text-primary'; statusBgClass = 'bg-primary/10'; break;
        case 'Paid': statusClass = 'text-secondary'; statusBgClass = 'bg-secondary/10'; break;
        default: statusClass = 'text-mediumGray'; statusBgClass = 'bg-mediumGray/10';
    }

    return (
        <div className={`bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md animate-fade-in-up border-l-4 ${remaining > 0 ? 'border-redError' : 'border-secondary'} relative`}>
            <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-darkGray dark:text-gray-100 text-lg flex items-center space-x-2">
                    <User size={20} className="text-primary"/> <span>{receivable.client}</span>
                </h4>
                <div className="flex space-x-2 flex-shrink-0">
                    {receivable.status !== 'Paid' && (
                        <button onClick={() => onRecordReceipt(receivable.id)} className="p-1 rounded-full bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-colors duration-200" title="Record Receipt">
                            <CreditCard size={16} />
                        </button>
                    )}
                    {remaining > 0 && (
                        <button onClick={() => onSendReminder(receivable.id)} className="p-1 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors duration-200" title="Send Reminder">
                            <Bell size={16} />
                        </button>
                    )}
                </div>
            </div>
            <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
                <Briefcase size={14}/> <span>Mashruuc: {receivable.project}</span>
            </p>
            <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
                <DollarSign size={14} className="text-darkGray"/> <span>Qiimaha: ${receivable.amount.toLocaleString()}</span>
            </p>
            <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
                <DollarSign size={14} className="text-secondary"/> <span>La Helay: ${receivable.received.toLocaleString()}</span>
            </p>
            <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
                <DollarSign size={14} className="text-redError"/> <span>Hadhay: ${remaining.toLocaleString()}</span>
            </p>
            <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
                <Calendar size={14}/> <span>La Sugayo: {new Date(receivable.dueDate).toLocaleDateString()}</span>
            </p>
            <div className={`mt-2 px-2 py-1 rounded-full text-xs font-semibold flex items-center justify-center space-x-1 ${statusClass} ${statusBgClass}`}>
                <span>{receivable.status}</span>
            </div>
        </div>
    );
};


// Main Debts Overview Page Component
export default function DebtsOverviewReportPage() {
  const [activeTab, setActiveTab] = useState('Debts Owed'); // 'Debts Owed' or 'Receivables'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDateRange, setFilterDateRange] = useState('All');
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null); // Added 'info' type
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list'); // Default to list view
  const [debts, setDebts] = useState<Debt[]>([]);
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debtTypes: string[] = ['All', 'Loan', 'Supplier Credit', 'Investor Loan', 'Other'];
  const debtStatuses: string[] = ['All', 'Active', 'Upcoming', 'Overdue', 'Paid'];
  const receivableStatuses: string[] = ['All', 'Upcoming', 'Overdue', 'Paid'];
  const dateRanges: string[] = ['All', 'Today', 'This Week', 'This Month', 'This Quarter', 'This Year'];


  useEffect(() => {
    async function fetchDebts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/reports/debts');
        if (!res.ok) throw new Error('Failed to fetch debts data');
        const data = await res.json();
        // Map companyDebts and projectDebts to Debt[]
        // Group debts by vendor, sum DEBT_TAKEN and DEBT_REPAID
        const vendorMap: Record<string, any> = {};
        [...(data.companyDebts || []), ...(data.projectDebts || [])].forEach((d: any) => {
          const key = d.vendor?.id || d.vendorId || d.id;
          if (!vendorMap[key]) {
            vendorMap[key] = {
              id: d.id,
              lender: d.vendor?.name || 'Unknown Vendor',
              type: d.type,
              amount: 0,
              paid: 0,
              remaining: 0,
              issueDate: d.transactionDate || '',
              dueDate: d.transactionDate || '',
              status: 'Active',
            };
          }
          if (d.type === 'DEBT_TAKEN') vendorMap[key].amount += Number(d.amount);
          if (d.type === 'DEBT_REPAID') vendorMap[key].paid += Number(d.amount);
        });
        Object.values(vendorMap).forEach((v: any) => {
          v.remaining = v.amount - v.paid;
          // Status calculation
          if (v.remaining <= 0) v.status = 'Paid';
          else if (new Date(v.dueDate) < new Date()) v.status = 'Overdue';
          else v.status = 'Active';
        });
        const debts = Object.values(vendorMap);

        // Group receivables by customer, sum DEBT_TAKEN and DEBT_REPAID
        const clientMap: Record<string, any> = {};
        [...(data.clientReceivables || []), ...(data.projectReceivables || [])].forEach((r: any) => {
          const key = r.customer?.id || r.customerId || r.id;
          if (!clientMap[key]) {
            clientMap[key] = {
              id: r.id,
              client: r.customer?.name || 'Unknown Client',
              project: r.project?.name || '',
              amount: 0,
              received: 0,
              remaining: 0,
              dueDate: r.transactionDate || '',
              status: 'Upcoming',
            };
          }
          if (r.type === 'DEBT_TAKEN') clientMap[key].amount += Number(r.amount);
          if (r.type === 'DEBT_REPAID') clientMap[key].received += Number(r.amount);
        });
        Object.values(clientMap).forEach((c: any) => {
          c.remaining = c.amount - c.received;
          // Status calculation
          if (c.remaining <= 0) c.status = 'Paid';
          else if (new Date(c.dueDate) < new Date()) c.status = 'Overdue';
          else c.status = 'Upcoming';
        });
        const receivables = Object.values(clientMap);
        setDebts(debts);
        setReceivables(receivables);
      } catch (err: any) {
        setError(err.message || 'Error fetching debts data');
      } finally {
        setLoading(false);
      }
    }
    fetchDebts();
  }, []);

  // Statistics for Debts Owed
  const totalDebtsOwed = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const remainingDebtsOwed = debts.reduce((sum, debt) => sum + debt.remaining, 0);
  const overdueDebtsOwed = debts.filter(debt => debt.status === 'Overdue').reduce((sum, debt) => sum + debt.remaining, 0);

  // Statistics for Receivables
  const totalReceivableAmount = receivables.reduce((sum, rec) => sum + rec.amount, 0);
  const remainingReceivableAmount = receivables.reduce((sum, rec) => sum + rec.remaining, 0);
  const overdueReceivableAmount = receivables.filter(rec => rec.status === 'Overdue').reduce((sum, rec) => sum + rec.remaining, 0);


  const filteredDebts = debts.filter(debt => {
    const matchesSearch = debt.lender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          debt.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || debt.type === filterType;
    const matchesStatus = filterStatus === 'All' || debt.status === filterStatus;
    const matchesDate = filterDateRange === 'All' ? true : true;
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const filteredReceivables = receivables.filter(rec => {
    const matchesSearch = rec.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rec.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || rec.status === filterStatus;
    const matchesDate = filterDateRange === 'All' ? true : true;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleRecordRepayment = (id: string) => {
    const debtToUpdate = debts.find(d => d.id === id);
    if (debtToUpdate) {
      if (debtToUpdate.remaining <= 0) {
        setToastMessage({ message: 'Deyntan horey ayaa loo bixiyay!', type: 'info' });
        return;
      }
      // Simulate recording full repayment for simplicity
      setToastMessage({ message: `Deyn bixin ayaa loo diiwaan geliyay ${debtToUpdate.lender}!`, type: 'success' });
      // In a real app, update the debt status/remaining via API
    }
  };

  const handleRecordReceipt = (id: string) => {
    const receivableToUpdate = receivables.find(r => r.id === id);
    if (receivableToUpdate) {
        if (receivableToUpdate.remaining <= 0) {
            setToastMessage({ message: 'Lacagtan horey ayaa loo helay!', type: 'info' });
            return;
        }
        setToastMessage({ message: `Lacagta laga sugayay ${receivableToUpdate.client} waa la helay!`, type: 'success' });
        // In a real app, update the receivable status/remaining via API
    }
  };

  const handleSendReminder = (id: string) => {
    const receivable = receivables.find(r => r.id === id);
    if (receivable) {
      console.log(`Sending reminder for receivable ID: ${id} to client ${receivable.client}`);
      setToastMessage({ message: `Xasuusin ayaa loo diray macmiilka "${receivable.client}"!`, type: 'success' });
    }
  };

  const handleDeleteDebt = (id: string) => {
    if (window.confirm('Ma hubtaa inaad tirtirto diiwaanka deyntan?')) {
      console.log('Deleting debt:', id);
      setToastMessage({ message: 'Diiwaanka deynta waa la tirtiray!', type: 'success' });
      // In real app, delete via API
    }
  };

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center min-h-[400px] text-darkGray dark:text-gray-100">
        <span className="animate-spin mr-3"><Scale size={32} className="text-primary" /></span> Warbixinta Deymaha & Lacagaha la sugayo ayaa soo dhacaya...
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
          Debts Overview
        </h1>
        <div className="flex space-x-3">
          <button className="bg-primary text-white py-2.5 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-200 shadow-md flex items-center">
            <Plus size={20} className="mr-2" /> Diiwaan Geli Deyn Cusub
          </button>
          <button className="bg-secondary text-white py-2.5 px-6 rounded-lg font-bold text-lg hover:bg-green-600 transition duration-200 shadow-md flex items-center">
            <Download size={20} className="mr-2" /> Soo Deji PDF
          </button>
        </div>
      </div>

      {/* Debt Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in-up">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Deynaha La Nagu Leeyahay</h4>
          <p className="text-3xl font-extrabold text-redError">-${remainingDebtsOwed.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Deynaha Dib U Dhacay</h4>
          <p className="text-3xl font-extrabold text-redError">-${overdueDebtsOwed.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Lacagaha La Sugayo</h4>
          <p className="text-3xl font-extrabold text-secondary">${remainingReceivableAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Lacagaha La Sugayo ee Dib U Dhacay</h4>
          <p className="text-3xl font-extrabold text-redError">${overdueReceivableAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs for Debts Owed vs. Receivables */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-fade-in-up mb-8">
        <div className="border-b border-lightGray dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6 md:px-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('Debts Owed')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg focus:outline-none transition-colors duration-200
                          ${activeTab === 'Debts Owed' 
                            ? 'border-primary text-primary dark:text-gray-100' 
                            : 'border-transparent text-mediumGray dark:text-gray-400 hover:text-darkGray dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
            >
              Deynaha La Nagu Leeyahay
            </button>
            <button
              onClick={() => setActiveTab('Receivables')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg focus:outline-none transition-colors duration-200
                          ${activeTab === 'Receivables' 
                            ? 'border-primary text-primary dark:text-gray-100' 
                            : 'border-transparent text-mediumGray dark:text-gray-400 hover:text-darkGray dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
            >
              Lacagaha La Sugayo
            </button>
          </nav>
        </div>

        {/* Filters for Current Tab */}
        <div className="p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 border-b border-lightGray dark:border-gray-700">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
            <input type="text" placeholder={`Search by ${activeTab === 'Debts Owed' ? 'lender or type' : 'client or project'}...`} className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 placeholder-mediumGray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"/>
          </div>
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 appearance-none">
              {activeTab === 'Debts Owed' ? (
                debtTypes.map((type: string) => <option key={type} value={type}>{type}</option>)
              ) : (
                <option value="All">Dhammaan Noocyada</option> // Receivables don't have types in dummy data
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400"><ChevronRight className="transform rotate-90" size={20} /></div>
          </div>
          <div className="relative w-full md:w-48">
            <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 appearance-none">
              {activeTab === 'Debts Owed' ? (
                debtStatuses.map((status: string) => <option key={status} value={status}>{status}</option>)
              ) : (
                receivableStatuses.map((status: string) => <option key={status} value={status}>{status}</option>)
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400"><ChevronRight className="transform rotate-90" size={20} /></div>
          </div>
          <div className="relative w-full md:w-48">
            <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" />
            <select value={filterDateRange} onChange={(e) => setFilterDateRange(e.target.value)} className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 appearance-none">
              {dateRanges.map((range: string) => <option key={range} value={range}>{range}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400"><ChevronRight className="transform rotate-90" size={20} /></div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex space-x-2 w-full justify-center mb-6">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-lightGray dark:bg-gray-700 text-mediumGray dark:text-gray-400'} hover:bg-primary/80 dark:hover:bg-gray-600 transition-colors duration-200`}>
                <List size={20} />
            </button>
            <button onClick={() => setViewMode('cards')} className={`p-2 rounded-lg ${viewMode === 'cards' ? 'bg-primary text-white' : 'bg-lightGray dark:bg-gray-700 text-mediumGray dark:text-gray-400'} hover:bg-primary/80 dark:hover:bg-gray-600 transition-colors duration-200`}>
                <LayoutGrid size={20} />
            </button>
        </div>

        {/* Debts/Receivables View */}
        {activeTab === 'Debts Owed' ? (
            filteredDebts.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center text-mediumGray dark:text-gray-400 animate-fade-in">
                    Ma jiraan deymo la nagugu leeyahay.
                </div>
            ) : viewMode === 'list' ? (
                <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md animate-fade-in">
                    <table className="min-w-full divide-y divide-lightGray dark:divide-gray-700">
                        <thead className="bg-lightGray dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider w-[15%]">Deynta Bixiyaha</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider w-[12%]">Nooca</th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider w-[10%]">Qiimaha</th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider w-[10%]">La Bixiyay</th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider w-[10%]">Hadhay</th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider w-[12%]">Taariikhda La Sugayo</th>
                                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider w-[10%]">Xaaladda</th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider w-[15%]">Ficillo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-lightGray dark:divide-gray-700">
                            {filteredDebts.map(debt => (
                                <DebtRow key={debt.id} debt={debt} onRecordPayment={handleRecordRepayment} onDelete={handleDeleteDebt} />
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination Placeholder */}
                    <div className="p-4 flex justify-between items-center border-t border-lightGray dark:border-gray-700">
                        <button className="text-sm text-mediumGray dark:text-gray-400 hover:text-primary transition">Hore</button>
                        <span className="text-sm text-darkGray dark:text-gray-100">Bogga 1 ee {Math.ceil(filteredDebts.length / 10) || 1}</span>
                        <button className="text-sm text-mediumGray dark:text-gray-400 hover:text-primary transition">Xiga</button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {filteredDebts.map(debt => (
                        <DebtCard key={debt.id} debt={debt} onRecordPayment={handleRecordRepayment} onDelete={handleDeleteDebt} />
                    ))}
                </div>
            )
        ) : ( /* Receivables Tab Content */
            filteredReceivables.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center text-mediumGray dark:text-gray-400 animate-fade-in">
                    Ma jiraan lacago la sugayo.
                </div>
            ) : viewMode === 'list' ? (
                <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md animate-fade-in">
                    <table className="min-w-full divide-y divide-lightGray dark:divide-gray-700">
                        <thead className="bg-lightGray dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Macmiilka</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Mashruuc</th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Qiimaha</th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">La Helay</th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Hadhay</th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Taariikhda La Sugayo</th>
                                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Xaaladda</th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Ficillo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-lightGray dark:divide-gray-700">
                            {filteredReceivables.map(receivable => (
                                <ReceivableRow key={receivable.id} receivable={receivable} onRecordReceipt={handleRecordReceipt} onSendReminder={handleSendReminder} />
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination Placeholder */}
                    <div className="p-4 flex justify-between items-center border-t border-lightGray dark:border-gray-700">
                        <button className="text-sm text-mediumGray dark:text-gray-400 hover:text-primary transition">Hore</button>
                        <span className="text-sm text-darkGray dark:text-gray-100">Bogga 1 ee {Math.ceil(filteredReceivables.length / 10) || 1}</span>
                        <button className="text-sm text-mediumGray dark:text-gray-400 hover:text-primary transition">Xiga</button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                            {filteredReceivables.map(receivable => (
                                <ReceivableCard key={receivable.id} receivable={receivable} onRecordReceipt={handleRecordReceipt} onSendReminder={handleSendReminder} />
                            ))}
                        </div>
                    )
                )}
            </div>
        );

      {toastMessage && (
        <Toast message={toastMessage.message} type={toastMessage.type} onClose={() => setToastMessage(null)} />
      )}
    </Layout>
  );
}
