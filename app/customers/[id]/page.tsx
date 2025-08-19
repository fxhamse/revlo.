// app/customers/[id]/page.tsx - Customer Details Page (10000% Design - API Integration)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'; // To get customer ID from URL and for navigation
import Layout from '../../../components/layouts/Layout';
import { 
  ArrowLeft, User as UserIcon, Building, Mail, Phone, MapPin, MessageSquare, Briefcase, DollarSign, Calendar,
  Eye, Edit, Trash2, Loader2, Info as InfoIcon, CheckCircle, XCircle, Plus
} from 'lucide-react';
import Toast from '../../../components/common/Toast'; // Import Toast component

// --- Customer Data Interface (Refined for API response) ---
interface Customer {
  id: string;
  name: string;
  type: 'Individual' | 'Company';
  companyName?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  projects: { id: string; name: string; status: string; agreementAmount: number; advancePaid: number; remainingAmount?: number; }[];
  payments: { id: string; amount: number; paymentDate: string; paymentType: string; receivedIn: string; projectId?: string }[];
  transactions: { id: string; description: string; amount: number; type: string; transactionDate: string; note?: string; project?: { name: string } }[];
  expenses: { id: string; amount: number; category: string; subCategory?: string; paidFrom?: string; expenseDate: string; note?: string; projectId?: string; project?: { name: string } }[];
  outstandingDebt?: number;
  projectDebts?: { id: string; name: string; status: string; agreementAmount: number; advancePaid: number; remainingAmount: number }[];
}

const CustomerDetailsPage: React.FC = () => {
  const { id } = useParams(); // Get customer ID from URL
  const router = useRouter(); // For redirection after delete
  const [customer, setCustomer] = useState<Customer | null>(null); // State for customer data
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview'); // For tab navigation
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);


  // --- API Functions ---
  const fetchCustomerDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/customers/${id}`);
      if (!response.ok) throw new Error('Failed to fetch customer details');
      const data = await response.json();
      setCustomer(data.customer); 
    } catch (error: any) {
      console.error('Error fetching customer details:', error);
      setToastMessage({ message: error.message || 'Cilad ayaa dhacday marka faahfaahinta macmiilka la soo gelinayay.', type: 'error' });
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (window.confirm('Ma hubtaa inaad tirtirto macmiilkan? Tan lama soo celin karo!')) {
      try {
        const response = await fetch(`/api/customers/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete customer');
        
        setToastMessage({ message: data.message || 'Macmiilka si guul leh ayaa loo tirtiray!', type: 'success' });
        router.push('/customers'); // Redirect to customers list after successful delete
      } catch (error: any) {
        console.error('Error deleting customer:', error);
        setToastMessage({ message: error.message || 'Cilad ayaa dhacday marka macmiilka la tirtirayay.', type: 'error' });
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchCustomerDetails(); // Fetch customer details when ID is available
    }
  }, [id]); // Re-fetch if ID changes

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px] text-darkGray dark:text-gray-100">
          <Loader2 className="animate-spin mr-3 text-primary" size={32} /> Loading Customer Details...
        </div>
      </Layout>
    );
  }

  if (!customer) {
    return (
      <Layout>
        <div className="text-center p-8 text-redError bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <InfoIcon size={32} className="inline-block mb-4 text-redError"/>
          <p className="text-xl font-bold">Macmiilka ID "{id}" lama helin.</p>
          <Link href="/customers" className="mt-4 inline-block text-primary hover:underline">Ku Noqo Macaamiisha &rarr;</Link>
        </div>
        {toastMessage && (
          <Toast message={toastMessage.message} type={toastMessage.type} onClose={() => setToastMessage(null)} />
        )}
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4 md:gap-0">
        <h1 className="text-3xl md:text-4xl font-bold text-darkGray dark:text-gray-100 flex items-center">
          <Link href="/customers" className="text-mediumGray dark:text-gray-400 hover:text-primary transition-colors duration-200 mr-4">
            <ArrowLeft size={28} className="inline-block" />
          </Link>
          {customer.name}
        </h1>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <Link href={`/projects/add?customerId=${customer.id}`} className="bg-primary text-white py-2.5 px-4 md:px-6 rounded-lg font-bold text-base md:text-lg hover:bg-blue-700 transition duration-200 shadow-md flex items-center">
            <Plus size={20} className="mr-2" /> Ku Dar Mashruuc
          </Link>
          <Link href={`/customers/edit/${customer.id}`} className="bg-accent text-white py-2.5 px-4 md:px-6 rounded-lg font-bold text-base md:text-lg hover:bg-orange-600 transition duration-200 shadow-md flex items-center">
            <Edit size={20} className="mr-2" /> Edit Macmiil
          </Link>
          <button onClick={handleDeleteCustomer} className="bg-redError text-white py-2.5 px-4 md:px-6 rounded-lg font-bold text-base md:text-lg hover:bg-red-700 transition duration-200 shadow-md flex items-center">
            <Trash2 size={20} className="mr-2" /> Delete
          </button>
        </div>
      </div>

      {/* Summary Cards - Responsive Table/Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 animate-fade-in-up">
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-md text-center flex flex-col justify-center">
          <h4 className="text-base md:text-lg font-semibold text-mediumGray dark:text-gray-400">Nooca Macmiilka</h4>
          <p className="text-2xl md:text-3xl font-extrabold text-primary">{customer.type}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-md text-center flex flex-col justify-center">
          <h4 className="text-base md:text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Mashaariicda</h4>
          <p className="text-2xl md:text-3xl font-extrabold text-secondary">{customer.projects.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-md text-center flex flex-col justify-center">
          <h4 className="text-base md:text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Lacagaha La Helay</h4>
          <p className="text-2xl md:text-3xl font-extrabold text-accent">${customer.payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-md text-center flex flex-col justify-center">
          <h4 className="text-base md:text-lg font-semibold text-mediumGray dark:text-gray-400">Total Dayn Lagu Leeyahay</h4>
          <p className={`text-2xl md:text-3xl font-extrabold ${customer.outstandingDebt && customer.outstandingDebt > 0 ? 'text-redError' : 'text-green-600'}`}>{customer.outstandingDebt ? `$${customer.outstandingDebt.toLocaleString()}` : '$0'}</p>
        </div>
      </div>

      {/* Tabs for Customer Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-fade-in-up">
        <div className="border-b border-lightGray dark:border-gray-700 overflow-x-auto">
          <nav className="-mb-px flex space-x-4 md:space-x-8 px-4 md:px-8" aria-label="Tabs">
            {['Overview', 'Projects', 'Project Debts', 'Payments', 'Transactions', 'Expenses', 'Company Debts', 'Notes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-3 md:py-4 px-2 md:px-1 border-b-2 font-medium text-base md:text-lg focus:outline-none transition-colors duration-200
                            ${activeTab === tab 
                              ? 'border-primary text-primary dark:text-gray-100' 
                              : 'border-transparent text-mediumGray dark:text-gray-400 hover:text-darkGray dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
              >
                {tab}
              </button>
            ))}
          {activeTab === 'Company Debts' && (() => {
            // Filter and calculate here so variables are always defined
            const companyDebts = (customer.expenses || []).filter(exp => exp.category === 'Company Expense' && ['Debt', 'Debt Repayment'].includes(exp.subCategory || '') && !exp.projectId);
            const totalCompanyDebt = companyDebts.reduce((sum, exp) => sum + Number(exp.amount), 0);
            return (
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-darkGray dark:text-gray-100 mb-4">Daymaha Shirkadda ee Macmiilkan</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">NOOCA</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">NODCA</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">LACAG</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">TAARIIKH</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">FIIRO</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {companyDebts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-4 text-gray-400">Ma jiro dayn shirkadeed oo la diiwaangeliyay.</td>
                        </tr>
                      ) : (
                        companyDebts.map((debt) => (
                          <tr key={debt.id}>
                            <td className="px-4 py-2 whitespace-nowrap">{debt.category} / {debt.subCategory}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{debt.id}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-red-600">{debt.amount < 0 ? `-$${Math.abs(debt.amount).toLocaleString()}` : `$${debt.amount.toLocaleString()}`}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{debt.expenseDate ? new Date(debt.expenseDate).toLocaleDateString() : ''}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{debt.note}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex flex-col md:flex-row md:items-center md:space-x-4">
                  <span className="text-lg md:text-2xl font-bold text-red-600">{`-$${totalCompanyDebt.toLocaleString()}`}</span>
                  <span className="text-gray-500 text-sm mt-1 md:mt-0">Lacagta guud ee shirkaddu ku leedahay macmiilkan</span>
                </div>
              </div>
            );
          })()}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4 md:p-8">
          {activeTab === 'Overview' && (
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-darkGray dark:text-gray-100 mb-4">Macluumaadka Guud</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-darkGray dark:text-gray-100">
                <p><span className="font-semibold text-mediumGray dark:text-gray-400">Magaca:</span> {customer.name}</p>
                <p><span className="font-semibold text-mediumGray dark:text-gray-400">Nooca:</span> {customer.type}</p>
                {customer.companyName && <p><span className="font-semibold text-mediumGray dark:text-gray-400">Magaca Shirkadda:</span> {customer.companyName}</p>}
                <p><span className="font-semibold text-mediumGray dark:text-gray-400">Email:</span> {customer.email || 'N/A'}</p>
                <p><span className="font-semibold text-mediumGray dark:text-gray-400">Taleefan:</span> {customer.phone || 'N/A'}</p>
                <p className="md:col-span-2"><span className="font-semibold text-mediumGray dark:text-gray-400">Cinwaan:</span> {customer.address || 'N/A'}</p>
              </div>
            </div>
          )}

          {activeTab === 'Project Debts' && (
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-darkGray dark:text-gray-100 mb-4">Lacagaha Ku Dhiman Mashaariicda</h3>
              {(!customer.projectDebts || customer.projectDebts.length === 0) ? (
                <p className="text-mediumGray dark:text-gray-400">Ma jiraan mashaariic lacag ku dhiman tahay.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-lightGray dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Mashruuc</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Heshiis</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Hore Loo Bixiyay</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Ku Dhiman</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-lightGray dark:divide-gray-700">
                      {customer.projectDebts.map(proj => (
                        <tr key={proj.id}>
                          <td className="px-2 py-2"><Link href={`/projects/${proj.id}`} className="text-primary hover:underline">{proj.name}</Link></td>
                          <td className="px-2 py-2">{proj.status}</td>
                          <td className="px-2 py-2">${proj.agreementAmount.toLocaleString()}</td>
                          <td className="px-2 py-2">${proj.advancePaid.toLocaleString()}</td>
                          <td className="px-2 py-2 font-bold text-redError">${proj.remainingAmount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Projects' && (
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-darkGray dark:text-gray-100 mb-4">Mashaariicda Macmiilka</h3>
              {customer.projects.length === 0 ? (
                <p className="text-mediumGray dark:text-gray-400">Macmiilkan ma laha mashaariic loo diiwaan geliyay.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-lightGray dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Mashruuc</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Heshiis</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Hore Loo Bixiyay</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-lightGray dark:divide-gray-700">
                      {customer.projects.map(proj => (
                        <tr key={proj.id}>
                          <td className="px-2 py-2"><Link href={`/projects/${proj.id}`} className="text-primary hover:underline">{proj.name}</Link></td>
                          <td className="px-2 py-2">{proj.status}</td>
                          <td className="px-2 py-2">${proj.agreementAmount?.toLocaleString?.() ?? '0'}</td>
                          <td className="px-2 py-2">${proj.advancePaid?.toLocaleString?.() ?? '0'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <Link href={`/projects/add?customerId=${customer.id}`} className="mt-4 bg-secondary text-white py-2 px-4 rounded-lg flex items-center hover:bg-green-600 transition duration-200 w-fit">
                  <Plus size={18} className="mr-2"/> Ku Dar Mashruuc
              </Link>
            </div>
          )}

          {activeTab === 'Payments' && (
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-darkGray dark:text-gray-100 mb-4">Lacagaha La Helay</h3>
              {customer.payments.length === 0 ? (
                <p className="text-mediumGray dark:text-gray-400">Ma jiraan lacago laga helay macmiilkan.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-lightGray dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Nooca</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Lacag</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Taariikh</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Mashruuc</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-lightGray dark:divide-gray-700">
                      {customer.payments.map(pay => (
                        <tr key={pay.id}>
                          <td className="px-2 py-2">{pay.paymentType}</td>
                          <td className="px-2 py-2 text-green-600 font-bold">+${pay.amount.toLocaleString()}</td>
                          <td className="px-2 py-2">{new Date(pay.paymentDate).toLocaleDateString()}</td>
                          <td className="px-2 py-2">{pay.projectId ? <Link href={`/projects/${pay.projectId}`} className="text-primary hover:underline">Eeg Mashruuc</Link> : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <button className="mt-4 bg-primary text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-700 transition duration-200 w-fit">
                  <Plus size={18} className="mr-2"/> Diiwaan Geli Lacag
              </button>
            </div>
          )}

          {activeTab === 'Transactions' && (
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-darkGray dark:text-gray-100 mb-4">Dhaqdhaqaaqa Lacagta</h3>
              {customer.transactions.length === 0 ? (
                <p className="text-mediumGray dark:text-gray-400">Ma jiraan dhaqdhaqaaq lacag ah oo la xiriira macmiilkan.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-lightGray dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Sharaxaad</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Nooca</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Lacag</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Taariikh</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Mashruuc</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Fiiro</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-lightGray dark:divide-gray-700">
                      {customer.transactions.map(trx => (
                        <tr key={trx.id}>
                          <td className="px-2 py-2">{trx.description}</td>
                          <td className="px-2 py-2">{trx.type}</td>
                          <td className={`px-2 py-2 font-bold ${trx.amount >= 0 ? 'text-secondary' : 'text-redError'}`}>{trx.amount >= 0 ? '+' : '-'}${Math.abs(trx.amount).toLocaleString()}</td>
                          <td className="px-2 py-2">{new Date(trx.transactionDate).toLocaleDateString()}</td>
                          <td className="px-2 py-2">{trx.project?.name || '-'}</td>
                          <td className="px-2 py-2">{trx.note || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Expenses' && (
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-darkGray dark:text-gray-100 mb-4">Kharashaadka Macmiilka</h3>
              {(() => {
                // Ka saar company debts
                const filteredExpenses = (customer.expenses || []).filter(exp => {
                  // Waa in aanan ahayn company debt
                  if (
                    exp.category === 'Company Expense' &&
                    ['Debt', 'Debt Repayment'].includes(exp.subCategory || '') &&
                    !exp.projectId
                  ) {
                    return false;
                  }
                  return true;
                });
                if (filteredExpenses.length === 0) {
                  return <p className="text-mediumGray dark:text-gray-400">Ma jiraan kharashaad la xiriira macmiilkan.</p>;
                }
                return (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-lightGray dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Sharaxaad</th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Nooca</th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Lacag</th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Taariikh</th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Mashruuc</th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Fiiro</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-lightGray dark:divide-gray-700">
                        {filteredExpenses.map(exp => (
                          <tr key={exp.id}>
                            <td className="px-2 py-2">{exp.category}{exp.subCategory ? ` / ${exp.subCategory}` : ''}</td>
                            <td className="px-2 py-2">{exp.paidFrom || '-'}</td>
                            <td className="px-2 py-2 font-bold text-redError">-${exp.amount.toLocaleString()}</td>
                            <td className="px-2 py-2">{new Date(exp.expenseDate).toLocaleDateString()}</td>
                            <td className="px-2 py-2">{exp.project?.name || '-'}</td>
                            <td className="px-2 py-2">{exp.note || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab === 'Notes' && (
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-darkGray dark:text-gray-100 mb-4">Fiiro Gaar Ah</h3>
              {customer.notes ? (
                <p className="text-mediumGray dark:text-gray-400 p-3 bg-lightGray dark:bg-gray-700 rounded-lg">{customer.notes}</p>
              ) : (
                <p className="text-mediumGray dark:text-gray-400">Ma jiraan fiiro gaar ah oo loo diiwaan geliyay macmiilkan.</p>
              )}
              <button className="mt-4 bg-accent text-white py-2 px-4 rounded-lg flex items-center hover:bg-orange-600 transition duration-200 w-fit">
                  <Edit size={18} className="mr-2"/> Wax ka Beddel Fiiro Gaar Ah
              </button>
            </div>
          )}

        </div>
      </div>
      {toastMessage && (
        <Toast message={toastMessage.message} type={toastMessage.type} onClose={() => setToastMessage(null)} />
      )}
    </Layout>
  );
};

export default CustomerDetailsPage;
