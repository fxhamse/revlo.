// app/employees/[id]/page.tsx - Employee Details Page (10000% Design - API Integration)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'; // To get employee ID from URL and for navigation
import Layout from '../../../components/layouts/Layout';
import { 
  ArrowLeft, User as UserIcon, Building, Mail, Phone, MapPin, MessageSquare, Briefcase, DollarSign, Calendar,
  Eye, Edit, Trash2, Loader2, Info as InfoIcon, CheckCircle, XCircle, Plus, Tag as TagIcon, Coins, Clock as ClockIcon,
  ClipboardList // For work description icon
} from 'lucide-react';
import Toast from '../../../components/common/Toast'; // Import Toast component

// --- Employee Data Interface (Refined for API response) ---
interface Employee {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: string; // e.g., "Labor", "Manager", "Admin"
  monthlySalary: number; // Will be number after API processing
  salaryPaidThisMonth: number; // Lacagta la bixiyay bishaan
  lastPaymentDate?: string; // Taariikhda ugu dambeysay ee mushahar la qaatay
  isActive: boolean; // Active or Inactive
  startDate: string; // Taariikhda uu shaqada bilaabay
  overpaidAmount: number; // Lacagta la siidaayay marka loo eego kasbashada (from API)
  createdAt: string;
  updatedAt: string;
  // Nested data from API includes (as per API /api/employees/[id]/route.ts)
  laborRecords: { 
    id: string; 
    employeeName: string; 
    workDescription: string; 
    agreedWage: number; 
    paidAmount: number; 
    remainingWage: number; 
    dateWorked: string; 
    projectId: string; 
    project: { name: string; }; 
  }[];
  transactions: { 
    id: string; 
    description: string; 
    amount: number; 
    type: string; 
    transactionDate: string; 
  }[];
  // Calculated fields for frontend display (derived from API data)
  category: string;
  dailyRate?: number; 
  earnedThisMonth?: number; 
  daysWorkedThisMonth?: number; 
}

interface Expense {
  id: string;
  date: string;
  category: string;
  subCategory?: string;
  amount: number;
  approved?: boolean;
  note?: string;
}

const EmployeeDetailsPage: React.FC = () => {
  // Fetch salary summary for this employee (define only once, at the top)
  const fetchSalarySummary = async () => {
    try {
      const response = await fetch('/api/employees/salary-summary');
      if (!response.ok) throw new Error('Failed to fetch salary summary');
      const data = await response.json();
      if (data.summary) {
        const summary = data.summary.find((s: any) => s.employeeId === id);
        setSalarySummary(summary || null);
      }
    } catch (error) {
      setSalarySummary(null);
    }
  };
  const { id } = useParams(); // Get employee ID from URL
  const router = useRouter(); // For redirection after delete
  const [employee, setEmployee] = useState<Employee | null>(null); // State for employee data
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview'); // For tab navigation
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [salaryExpenses, setSalaryExpenses] = useState<Expense[]>([]);
  const [expensesLoading, setExpensesLoading] = useState(false);
  const [salarySummary, setSalarySummary] = useState<any>(null);

  // Fetch all expenses for this employee (approved only)
  // Fetch only salary expenses for this employee
  const fetchSalaryExpenses = async () => {
    if (!id) return;
    setExpensesLoading(true);
    try {
      const response = await fetch(`/api/expenses?employeeId=${id}&subCategory=Salary`);
      if (!response.ok) throw new Error('Failed to fetch salary expenses');
      const data = await response.json();
      setSalaryExpenses(data.expenses || []);
    } catch (error) {
      setSalaryExpenses([]);
    } finally {
      setExpensesLoading(false);
    }
  };

  // --- API Functions ---
  const fetchEmployeeDetails = async () => {
  // fetchSalarySummary is now only defined once outside, not inside fetchEmployeeDetails
    setLoading(true);
    try {
      const response = await fetch(`/api/employees/${id}`);
      if (!response.ok) throw new Error('Failed to fetch employee details');
      const data = await response.json();
      
      // Convert Decimal fields to Number for frontend display
      const employeeData = {
        ...data.employee,
        monthlySalary: parseFloat(data.employee.monthlySalary),
        salaryPaidThisMonth: parseFloat(data.employee.salaryPaidThisMonth),
        overpaidAmount: parseFloat(data.employee.overpaidAmount), // Ensure overpaidAmount is number
        // Ensure nested Decimal values are also converted
        laborRecords: data.employee.laborRecords.map((rec: any) => ({
            ...rec,
            agreedWage: parseFloat(rec.agreedWage),
            paidAmount: parseFloat(rec.paidAmount),
            remainingWage: parseFloat(rec.remainingWage),
        })),
        transactions: data.employee.transactions.map((trx: any) => ({
            ...trx,
            amount: parseFloat(trx.amount),
        })),
      };

      // Use new category field for logic
      if (employeeData.category === 'COMPANY') {
        const today = new Date();
        const startDate = new Date(employeeData.startDate);
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

        // Calculate days worked this month based on start date and current date
        let daysWorkedThisMonth = 0;
        if (today.getMonth() === startDate.getMonth() && today.getFullYear() === startDate.getFullYear()) {
          // If start date is in the current month
          daysWorkedThisMonth = today.getDate() - startDate.getDate() + 1;
        } else {
          // If started in a previous month, assume full days up to today's date
          daysWorkedThisMonth = today.getDate();
        }
        daysWorkedThisMonth = Math.max(0, daysWorkedThisMonth); // Ensure not negative

        const dailyRate = employeeData.monthlySalary ? employeeData.monthlySalary / daysInMonth : 0;
        const earnedThisMonth = dailyRate * daysWorkedThisMonth;
        const overpaidAmountCalculated = employeeData.salaryPaidThisMonth - earnedThisMonth;

        employeeData.dailyRate = parseFloat(dailyRate.toFixed(2));
        employeeData.earnedThisMonth = parseFloat(earnedThisMonth.toFixed(2));
        employeeData.overpaidAmount = parseFloat(overpaidAmountCalculated.toFixed(2)); // Update overpaidAmount
        employeeData.daysWorkedThisMonth = daysWorkedThisMonth;
      } else {
        // For project employees, earnedThisMonth is sum of agreedWage in laborRecords
        employeeData.earnedThisMonth = employeeData.laborRecords.reduce((sum: number, record: any) => sum + record.agreedWage, 0);
      }

      setEmployee(employeeData); 
    } catch (error: any) {
      console.error('Error fetching employee details:', error);
      setToastMessage({ message: error.message || 'Cilad ayaa dhacday marka faahfaahinta shaqaalaha la soo gelinayay.', type: 'error' });
      setEmployee(null); // Set employee to null on error
      router.push('/employees'); 
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (window.confirm('Ma hubtaa inaad tirtirto shaqaalahan? Tan lama soo celin karo!')) {
      try {
        const response = await fetch(`/api/employees/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete employee');
        
        setToastMessage({ message: data.message || 'Shaqaalaha si guul leh ayaa loo tirtiray!', type: 'success' });
        router.push('/employees'); // Redirect to employees list after successful delete
      } catch (error: any) {
        console.error('Error deleting employee:', error);
        setToastMessage({ message: error.message || 'Cilad ayaa dhacday marka shaqaalaha la tirtirayay.', type: 'error' });
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchEmployeeDetails(); // Fetch employee details when ID is available
      fetchSalaryExpenses(); // Fetch only salary expenses
      fetchSalarySummary(); // Fetch salary summary
    }
  // (moved above)
    // eslint-disable-next-line
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px] text-darkGray dark:text-gray-100">
          <Loader2 className="animate-spin mr-3 text-primary" size={32} /> Loading Employee Details...
        </div>
      </Layout>
    );
  }

  if (!employee) {
    return (
      <Layout>
        <div className="text-center p-8 text-redError bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <InfoIcon size={32} className="inline-block mb-4 text-redError"/>
          <p className="text-xl font-bold">Shaqaalaha ID "{id}" lama helin.</p>
          <Link href="/employees" className="mt-4 inline-block text-primary hover:underline">Ku Noqo Shaqaalaha &rarr;</Link>
        </div>
        {toastMessage && (
          <Toast message={toastMessage.message} type={toastMessage.type} onClose={() => setToastMessage(null)} />
        )}
      </Layout>
    );
  }

  // --- Combine all relevant payments for this employee ---
  // Only use salary expenses for Payments tab (for COMPANY employees)
  const salaryExpenseTransactions = employee.category === 'COMPANY'
    ? salaryExpenses.map(e => ({
        id: e.id,
        description: e.category + (e.subCategory ? ` - ${e.subCategory}` : ''),
        amount: -Math.abs(e.amount),
        type: 'EXPENSE',
        transactionDate: e.date,
        source: 'expense',
        note: e.note || '',
      }))
    : [];
  // All transactions for other tabs (unchanged)
  const allTransactions = [
    ...employee.transactions.map(t => ({ ...t, source: 'transaction', note: '' })),
    ...salaryExpenseTransactions,
  ].sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());

  // --- Calculate Paid This Month (La Bixiyay Bishaan) ---
  // Use salary summary if available for accurate monthly data (only for COMPANY employees)
  const thisMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
  let totalPaidThisMonth = 0;
  let salaryRemaining = 0;
  let earnedThisMonth = 0;
  let overpaidAmount = 0;
  let daysPaid = 0;
  let daysWorked = 0;
  let isOverpaidDays = false;
  let isOverpaidBasedOnWork = false;
  if (employee.category === 'COMPANY') {
    if (salarySummary) {
      totalPaidThisMonth = salarySummary.paidThisMonth || 0;
      salaryRemaining = salarySummary.salaryRemaining || 0;
      earnedThisMonth = salarySummary.earnedThisMonth || 0;
      overpaidAmount = salarySummary.overpaidAmount || 0;
      daysPaid = salarySummary.daysPaid || 0;
      daysWorked = salarySummary.daysWorked || 0;
      isOverpaidDays = daysPaid > daysWorked;
      isOverpaidBasedOnWork = totalPaidThisMonth > earnedThisMonth;
    } else {
      // fallback to local calculation if summary not available
      const paidThisMonth = allTransactions.filter(
        t => t.type === 'EXPENSE' && t.transactionDate.slice(0, 7) === thisMonth
      );
      totalPaidThisMonth = paidThisMonth.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      salaryRemaining = employee && employee.monthlySalary ? employee.monthlySalary - totalPaidThisMonth : 0;
      const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      const dailyRate = employee && employee.monthlySalary ? employee.monthlySalary / daysInMonth : 0;
      daysPaid = dailyRate ? Math.floor(totalPaidThisMonth / dailyRate) : 0;
      daysWorked = employee?.daysWorkedThisMonth || 0;
      earnedThisMonth = employee?.earnedThisMonth || 0;
      isOverpaidDays = daysPaid > daysWorked;
      isOverpaidBasedOnWork = totalPaidThisMonth > earnedThisMonth;
      overpaidAmount = totalPaidThisMonth - earnedThisMonth;
    }
  } else {
    // For project employees, these fields are not relevant
    totalPaidThisMonth = 0;
    salaryRemaining = 0;
    earnedThisMonth = employee?.earnedThisMonth || 0;
    overpaidAmount = 0;
    daysPaid = 0;
    daysWorked = 0;
    isOverpaidDays = false;
    isOverpaidBasedOnWork = false;
  }

  return (
    <Layout>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-darkGray dark:text-gray-100">
          <Link href="/employees" className="text-mediumGray dark:text-gray-400 hover:text-primary transition-colors duration-200 mr-4">
            <ArrowLeft size={28} className="inline-block" />
          </Link>
          {employee.fullName}
        </h1>
        <div className="flex space-x-3">
          <Link href={`/employees/edit/${employee.id}`} className="bg-accent text-white py-2.5 px-6 rounded-lg font-bold text-lg hover:bg-orange-600 transition duration-200 shadow-md flex items-center">
            <Edit size={20} className="mr-2" /> Edit Shaqaale
          </Link>
          <button onClick={handleDeleteEmployee} className="bg-redError text-white py-2.5 px-6 rounded-lg font-bold text-lg hover:bg-red-700 transition duration-200 shadow-md flex items-center">
            <Trash2 size={20} className="mr-2" /> Delete
          </button>
        </div>
      </div>

      {/* Employee Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Nooca</h4>
          <p className="text-3xl font-extrabold text-primary">{employee.category === 'COMPANY' ? 'Company' : 'Project'}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Doorka</h4>
          <p className="text-3xl font-extrabold text-primary">{employee.role}</p>
        </div>
        {employee.category === 'COMPANY' && (
          <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Mushahar Bil kasta</h4>
              <p className="text-3xl font-extrabold text-secondary">${employee.monthlySalary?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">La Bixiyay Bishaan</h4>
              <p className="text-3xl font-extrabold text-accent">${totalPaidThisMonth.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Hadhay Bishaan</h4>
              <p className={`text-3xl font-extrabold ${salaryRemaining < 0 ? 'text-redError' : 'text-primary'}`}>
                {salaryRemaining < 0 ? `-$${Math.abs(salaryRemaining).toLocaleString()}` : `$${salaryRemaining.toLocaleString()}`}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Kasbaday Bishaan</h4>
              <p className="text-3xl font-extrabold text-primary">${earnedThisMonth.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Maalmo Shaqeeyay Bishaan</h4>
              <p className="text-3xl font-extrabold text-secondary">{employee.daysWorkedThisMonth || 0}</p>
            </div>
            {isOverpaidBasedOnWork && (
              <div className="bg-[#f5eaea] p-6 rounded-xl shadow-md text-center animate-fade-in-up md:col-span-2 border border-redError/30">
                <h4 className="flex items-center justify-center space-x-2 text-lg font-semibold text-redError mb-2">
                  <XCircle size={24} className="text-redError"/>
                  <span>Lacag La Siidaayay Marka Loo Eego Shaqada La Qabtay</span>
                </h4>
                <p className="text-3xl font-extrabold text-redError mb-1">-{`$${overpaidAmount.toLocaleString()}`}</p>
                <p className="text-sm text-mediumGray dark:text-gray-500 mt-1">
                  Shaqaaluhu wuxuu qaatay mushahar ka badan inta uu kasbaday bishaan (kasbaday: ${earnedThisMonth.toLocaleString()}, la bixiyay: ${totalPaidThisMonth.toLocaleString()}).
                </p>
              </div>
            )}
          </>
        )}
        {employee.category === 'PROJECT' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Wadar Agreed Wage</h4>
            <p className="text-3xl font-extrabold text-primary">${earnedThisMonth.toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* Tabs for Employee Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-fade-in-up">
        <div className="border-b border-lightGray dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6 md:px-8" aria-label="Tabs">
            {['Overview', 'Labor Records', 'Payments', 'Transactions'].map((tab) => (
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
              <h3 className="text-2xl font-bold text-darkGray dark:text-gray-100 mb-4">Macluumaadka Guud</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-darkGray dark:text-gray-100 mb-6">
                <p><span className="font-semibold text-mediumGray dark:text-gray-400">Magaca Buuxa:</span> {employee.fullName}</p>
                <p><span className="font-semibold text-mediumGray dark:text-gray-400">Doorka:</span> {employee.role}</p>
                <p><span className="font-semibold text-mediumGray dark:text-gray-400">Email:</span> {employee.email || 'N/A'}</p>
                <p><span className="font-semibold text-mediumGray dark:text-gray-400">Taleefan:</span> {employee.phone || 'N/A'}</p>
                <p><span className="font-semibold text-mediumGray dark:text-gray-400">Xaaladda:</span> {employee.isActive ? 'Active' : 'Inactive'}</p>
                <p><span className="font-semibold text-mediumGray dark:text-gray-400">Diiwaan Gashan:</span> {new Date(employee.createdAt).toLocaleDateString()}</p>
                <p><span className="font-semibold text-mediumGray dark:text-gray-400">Taariikhda Bilowga Shaqada:</span> {new Date(employee.startDate).toLocaleDateString()}</p>
                {employee.lastPaymentDate && <p><span className="font-semibold text-mediumGray dark:text-gray-400">Taariikhda Mushahar Ugu Dambeysay:</span> {new Date(employee.lastPaymentDate).toLocaleDateString()}</p>}
              </div>
            </div>
        )}
        {/* --- Monthly Salary/Advance Summary Section (Single, Clear, Not Duplicated) --- */}
        {employee.category === 'COMPANY' && (
          <div className="mb-6 bg-lightGray dark:bg-gray-700 rounded-xl p-5 animate-fade-in-up">
            <h3 className="text-xl font-bold text-darkGray dark:text-gray-100 mb-3">Xogta Lacagaha Mushaharka Bishaan</h3>
            <div className="flex flex-wrap gap-8">
              <div>
                <span className="block text-mediumGray dark:text-gray-400">La Bixiyay Bishaan</span>
                <span className="text-2xl font-bold text-accent">${totalPaidThisMonth.toLocaleString()}</span>
              </div>
              <div>
                <span className="block text-mediumGray dark:text-gray-400">Hadhay Bishaan</span>
                <span className={`text-2xl font-bold ${salaryRemaining < 0 ? 'text-redError' : 'text-primary'}`}>{salaryRemaining < 0 ? `-$${Math.abs(salaryRemaining).toLocaleString()}` : `$${salaryRemaining.toLocaleString()}`}</span>
              </div>
              <div>
                <span className="block text-mediumGray dark:text-gray-400">Kasbaday Bishaan</span>
                <span className="text-2xl font-bold text-primary">${earnedThisMonth.toLocaleString()}</span>
              </div>
              {isOverpaidBasedOnWork && (
                <div>
                  <span className="block text-mediumGray dark:text-gray-400">Overpaid</span>
                  <span className="text-2xl font-bold text-redError">-${overpaidAmount.toLocaleString()}</span>
                </div>
              )}
            </div>
            {isOverpaidDays && (
              <div className="mt-3 p-3 bg-redError/10 rounded-lg text-redError font-semibold">
                Shaqaalahan waxaa loo bixiyay lacag ka badan maalmaha uu shaqeeyay bishaan! (La bixiyay: {daysPaid} maalmood, Shaqeeyay: {daysWorked} maalmood)
              </div>
            )}
          </div>
        )}
      {/* <-- HALKAAS KALIYA HAL ) */}
      {activeTab === 'Labor Records' && employee.category === 'PROJECT' && (
        <div>
          <h3 className="text-2xl font-bold text-darkGray dark:text-gray-100 mb-4">Labor Records</h3>
          {employee.laborRecords && employee.laborRecords.length > 0 ? (
            <ul className="space-y-3">
              {employee.laborRecords.map((rec: any) => (
                <li key={rec.id} className="flex justify-between items-center bg-lightGray dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                  <div className="flex flex-col">
                    <span className="font-semibold text-darkGray dark:text-gray-100">{rec.projectName || 'Project'}</span>
                    <span className="text-sm text-mediumGray dark:text-gray-400">Agreed Wage: ${rec.agreedWage.toLocaleString()}</span>
                  </div>
                  <span className="text-primary font-bold">Paid: ${rec.paidAmount.toLocaleString()}</span>
                  <span className="text-sm text-mediumGray dark:text-gray-400">Remaining: ${rec.remainingWage.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-mediumGray dark:text-gray-400">No labor records found for this project employee.</p>
          )}
        </div>
      )}
      {activeTab === 'Payments' && employee.category === 'COMPANY' && (
        <div>
          <h3 className="text-2xl font-bold text-darkGray dark:text-gray-100 mb-4">Diiwaanka Mushaharka La Bixiyay</h3>
          {(() => {
            // Only show salary expenses for this employee this month
            const thisMonth = new Date().toISOString().slice(0, 7);
            const paidList = salaryExpenseTransactions.filter(
              t => t.transactionDate.slice(0, 7) === thisMonth
            );
            return paidList.length === 0 ? (
              <p className="text-mediumGray dark:text-gray-400">Ma jiraan diiwaan mushahar la bixiyay oo la helay.</p>
            ) : (
              <ul className="space-y-3">
                {paidList.map((trx: any) => (
                  <li key={trx.id} className="flex justify-between items-center bg-lightGray dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-3">
                      <Coins className="text-redError" size={20} />
                      <span className="font-semibold text-darkGray dark:text-gray-100">{trx.description}</span>
                    </div>
                    <span className="text-redError font-bold">-${Math.abs(trx.amount).toLocaleString()}</span>
                    <span className="text-sm text-mediumGray dark:text-gray-400">{new Date(trx.transactionDate).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            );
          })()}
          {/* Button to record new payment for this employee */}
          <button className="mt-4 bg-secondary text-white py-2 px-4 rounded-lg flex items-center hover:bg-green-600 transition duration-200 w-fit">
            <Plus size={18} className="mr-2"/> Diiwaan Geli Mushahar
          </button>
        </div>
      )}
      {activeTab === 'Transactions' && (
        <div>
          <h3 className="text-2xl font-bold text-darkGray dark:text-gray-100 mb-4">Dhaqdhaqaaqa Lacagta Guud</h3>
          {allTransactions.length === 0 ? (
            <p className="text-mediumGray dark:text-gray-400">Ma jiraan dhaqdhaqaaq lacag ah oo la xiriira shaqaalahan.</p>
          ) : (
            <ul className="space-y-3">
              {allTransactions.map((trx: any) => (
                <li key={trx.id} className="flex justify-between items-center bg-lightGray dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    {parseFloat(trx.amount) >= 0 ? <DollarSign className="text-secondary" size={20}/> : <XCircle className="text-redError" size={20}/>}
                    <span className="font-semibold text-darkGray dark:text-gray-100">{trx.description}</span>
                  </div>
                  <span className={`${parseFloat(trx.amount) >= 0 ? 'text-secondary' : 'text-redError'} font-bold`}>
                    {parseFloat(trx.amount) >= 0 ? '+' : '-'}${Math.abs(parseFloat(trx.amount)).toLocaleString()}
                  </span>
                  <span className="text-sm text-mediumGray dark:text-gray-400">{new Date(trx.transactionDate).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
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

export default EmployeeDetailsPage;
``