// app/employees/page.tsx - Employees List Page (10000% Design - API Integration & Enhanced)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '../../components/layouts/Layout';
import { 
  Plus, Search, Filter, Calendar, List, LayoutGrid, DollarSign, Tag, User, ChevronRight, Briefcase, Mail, Phone, MapPin, Truck,
  Eye, Edit, Trash2, Loader2, Info as InfoIcon, CheckCircle, XCircle, RefreshCw,
  Clock as ClockIcon, TrendingUp, TrendingDown, Coins // Added for salary/payment tracking
} from 'lucide-react';
import Toast from '../../components/common/Toast'; // Import Toast component

// --- Employee Data Interface (Refined for API response) ---
interface Employee {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: string;
  monthlySalary?: number | null;
  salaryPaidThisMonth?: number | null;
  lastPaymentDate?: string;
  isActive: boolean;
  startDate: string;
  overpaidAmount?: number | null;
  createdAt?: string;
  updatedAt?: string;
  dailyRate?: number | null;
  earnedThisMonth?: number | null;
  daysWorkedThisMonth?: number | null;
  laborRecords?: Array<{
    id: string;
    projectId: string;
    projectName: string;
    workDescription: string;
    agreedWage: number | null;
    paidAmount: number | null;
    remainingWage: number | null;
    dateWorked: string;
  }>;
}

// --- Employee Table Row Component ---
const EmployeeRow: React.FC<{ employee: Employee; onEdit: (id: string) => void; onDelete: (id: string) => void; onRecordDailyWork: (id: string) => void; onRecordPayment: (id: string) => void }> = ({ employee, onEdit, onDelete, onRecordDailyWork, onRecordPayment }) => {
  const salaryRemaining = (employee.monthlySalary ?? 0) - (employee.salaryPaidThisMonth ?? 0);
  const isOverpaidBasedOnWork = (employee.overpaidAmount ?? 0) > 0;
  const progress = employee.monthlySalary ? ((employee.salaryPaidThisMonth ?? 0) / employee.monthlySalary) * 100 : 0;
  
  let statusClass = '';
  let statusBgClass = '';
  if (employee.isActive) {
      statusClass = 'text-secondary';
      statusBgClass = 'bg-secondary/10';
  } else {
      statusClass = 'text-mediumGray';
      statusBgClass = 'bg-mediumGray/10';
  }

  return (
    <tr className="hover:bg-lightGray dark:hover:bg-gray-700 transition-colors duration-150 border-b border-lightGray dark:border-gray-700 last:border-b-0">
      <td className="p-4 whitespace-nowrap text-darkGray dark:text-gray-100 font-medium flex items-center space-x-2">
          <User size={18} className="text-primary"/> <span>{employee.fullName}</span>
      </td>
      <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300 flex items-center space-x-2">
          <Tag size={16} className="text-accent"/> <span>{employee.role}</span>
      </td>
      <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300 flex items-center space-x-2">
          {employee.email ? <Mail size={16}/> : <XCircle size={16} className="text-redError"/>} <span>{employee.email || 'N/A'}</span>
      </td>
      <td className="p-4 whitespace-nowrap text-darkGray dark:text-gray-100 font-semibold text-right">{employee.monthlySalary != null ? `$${employee.monthlySalary.toLocaleString()}` : <span className="text-mediumGray">N/A</span>}</td>
      <td className="p-4 whitespace-nowrap text-secondary font-semibold text-right">{employee.salaryPaidThisMonth != null ? `$${employee.salaryPaidThisMonth.toLocaleString()}` : <span className="text-mediumGray">N/A</span>}</td>
      <td className={`p-4 whitespace-nowrap font-semibold text-right ${isOverpaidBasedOnWork ? 'text-redError' : 'text-primary'}`}> 
        {employee.overpaidAmount != null ? (isOverpaidBasedOnWork ? `-$${Math.abs(employee.overpaidAmount).toLocaleString()}` : `$${employee.overpaidAmount.toLocaleString()}`) : <span className="text-mediumGray">N/A</span>}
      </td>
      <td className="p-4 whitespace-nowrap text-center">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass} ${statusBgClass}`}>
          {employee.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="p-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end space-x-2">
          <button onClick={() => onRecordDailyWork(employee.id)} className="p-2 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-200" title="Record Daily Work">
            <ClockIcon size={18} />
          </button>
          <button onClick={() => onRecordPayment(employee.id)} className="p-2 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-colors duration-200" title="Record Payment">
            <Coins size={18} />
          </button>
          <Link href={`/employees/${employee.id}`} className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors duration-200" title="View Details">
            <Eye size={18} />
          </Link>
          <Link href={`/employees/edit/${employee.id}`} className="p-2 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors duration-200" title="Edit Employee">
            <Edit size={18} />
          </Link>
          <button onClick={() => onDelete(employee.id)} className="p-2 rounded-full bg-redError/10 text-redError hover:bg-redError hover:text-white transition-colors duration-200" title="Delete Employee">
            <Trash2 size={18} />
          </button>
        </div>
        {/* Show project assignments if present */}
        {employee.laborRecords && employee.laborRecords.length > 0 && (
          <div className="mt-2 text-xs text-mediumGray dark:text-gray-400">
            <strong>Projects:</strong>
            <ul className="list-disc ml-4">
              {employee.laborRecords.map(lr => (
                <li key={lr.id}>
                  <span className="font-semibold text-primary">{lr.projectName}</span> - {lr.workDescription} | Wage: {lr.agreedWage != null ? `$${lr.agreedWage}` : 'N/A'} | Paid: {lr.paidAmount != null ? `$${lr.paidAmount}` : 'N/A'} | Remaining: {lr.remainingWage != null ? `$${lr.remainingWage}` : 'N/A'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </td>
    </tr>
  );
};

// --- Employee Card Component (for Mobile View) ---
const EmployeeCard: React.FC<{ employee: Employee; onEdit: (id: string) => void; onDelete: (id: string) => void; onRecordDailyWork: (id: string) => void; onRecordPayment: (id: string) => void }> = ({ employee, onEdit, onDelete, onRecordDailyWork, onRecordPayment }) => {
  const salaryRemaining = (employee.monthlySalary ?? 0) - (employee.salaryPaidThisMonth ?? 0);
  const isOverpaidBasedOnWork = (employee.overpaidAmount ?? 0) > 0;
  const progress = employee.monthlySalary ? ((employee.salaryPaidThisMonth ?? 0) / employee.monthlySalary) * 100 : 0;

    let borderColor = 'border-lightGray dark:border-gray-700';
    if (employee.isActive) borderColor = 'border-primary';
    if (isOverpaidBasedOnWork) borderColor = 'border-redError';


    return (
    <div className={`bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md animate-fade-in-up border-l-4 ${borderColor} relative`}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-darkGray dark:text-gray-100 text-lg flex items-center space-x-2">
          <User size={20} className="text-primary"/> <span>{employee.fullName}</span>
        </h4>
        <div className="flex space-x-2 flex-shrink-0">
          <button onClick={() => onEdit(employee.id)} className="p-1 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors duration-200" title="Edit">
            <Edit size={16} />
          </button>
          <button onClick={() => onDelete(employee.id)} className="p-1 rounded-full bg-redError/10 text-redError hover:bg-redError hover:text-white transition-colors duration-200" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
        <Tag size={14}/> <span>Doorka: {employee.role}</span>
      </p>
      <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
        {employee.email ? <Mail size={14}/> : <XCircle size={14} className="text-redError"/>} <span>Email: {employee.email || 'N/A'}</span>
      </p>
      <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
        {employee.phone ? <Phone size={14}/> : <XCircle size={14} className="text-redError"/>} <span>Taleefan: {employee.phone || 'N/A'}</span>
      </p>
      <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
        <DollarSign size={14}/> <span>Mushahar Bil kasta: {employee.monthlySalary != null ? `$${employee.monthlySalary.toLocaleString()}` : 'N/A'}</span>
      </p>
      <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
        <Coins size={14}/> <span>La Bixiyay Bishaan: {employee.salaryPaidThisMonth != null ? `$${employee.salaryPaidThisMonth.toLocaleString()}` : 'N/A'}</span>
      </p>
      <p className={`text-sm mb-1 flex items-center space-x-2 ${isOverpaidBasedOnWork ? 'text-redError' : 'text-primary'}`}>
        <DollarSign size={14}/> <span>Hadhay Bishaan: {employee.overpaidAmount != null ? (isOverpaidBasedOnWork ? `-$${Math.abs(employee.overpaidAmount).toLocaleString()}` : `$${employee.overpaidAmount.toLocaleString()}`) : 'N/A'}</span>
      </p>
      {/* Show project assignments if present */}
      {employee.laborRecords && employee.laborRecords.length > 0 && (
        <div className="mt-2 text-xs text-mediumGray dark:text-gray-400">
        <strong>Projects:</strong>
        <ul className="list-disc ml-4">
          {employee.laborRecords.map(lr => (
          <li key={lr.id}>
            <span className="font-semibold text-primary">{lr.projectName}</span> - {lr.workDescription} | Wage: {lr.agreedWage != null ? `$${lr.agreedWage}` : 'N/A'} | Paid: {lr.paidAmount != null ? `$${lr.paidAmount}` : 'N/A'} | Remaining: {lr.remainingWage != null ? `$${lr.remainingWage}` : 'N/A'}
          </li>
          ))}
        </ul>
        </div>
      )}
      <div className="w-full bg-lightGray dark:bg-gray-700 rounded-full h-1.5 mt-2">
        <div className={`h-1.5 rounded-full ${progress < 100 ? 'bg-primary' : 'bg-secondary'}`} style={{ width: `${progress}%` }}></div>
      </div>
      <span className="text-xs text-mediumGray dark:text-gray-400">{progress.toFixed(0)}% Paid</span>
      <div className="flex justify-end space-x-2 mt-3">
        <button onClick={() => onRecordDailyWork(employee.id)} className="p-1 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-200" title="Record Daily Work">
          <ClockIcon size={16} />
        </button>
        <button onClick={() => onRecordPayment(employee.id)} className="p-1 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-colors duration-200" title="Record Payment">
          <Coins size={16} />
        </button>
        <Link href={`/employees/${employee.id}`} className="p-1 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors duration-200" title="View Details">
          <Eye size={16} />
        </Link>
      </div>
    </div>
    );
};


export default function EmployeesPage() {
  const router = useRouter(); 
  const [employees, setEmployees] = useState<Employee[]>([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All'); 
  const [filterStatus, setFilterStatus] = useState('All'); // Active/Inactive
  const [filterDateRange, setFilterDateRange] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list'); // Default to list view
  const [pageLoading, setPageLoading] = useState(true); 
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);


  // --- API Functions ---
  const fetchEmployees = async () => {
    setPageLoading(true);
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      // Use backend-calculated values directly for live, accurate display
      setEmployees(data.employees);
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      setToastMessage({ message: error.message || 'Cilad ayaa dhacday marka shaqaalaha la soo gelinayay.', type: 'error' });
      setEmployees([]);
    } finally {
      setPageLoading(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm('Ma hubtaa inaad tirtirto shaqaalahan? Tan lama soo celin karo!')) {
      try {
        const response = await fetch(`/api/employees/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete employee');
        
        setToastMessage({ message: data.message || 'Shaqaalaha si guul leh ayaa loo tirtiray!', type: 'success' });
        fetchEmployees(); // Re-fetch employees after deleting
      } catch (error: any) {
        console.error('Error deleting employee:', error);
        setToastMessage({ message: error.message || 'Cilad ayaa dhacday marka shaqaalaha la tirtirayay.', type: 'error' });
      }
    }
  };

  const handleEditEmployee = (id: string) => {
    router.push(`/employees/edit/${id}`); // Navigate to edit page
  };

  const handleRecordDailyWork = (id: string) => {
    setToastMessage({ message: `Simulating daily work record for employee ID: ${id}. Real implementation requires backend.`, type: 'info' });
  };

  const handleRecordPayment = (id: string) => {
    setToastMessage({ message: `Simulating payment record for employee ID: ${id}. Real implementation requires backend.`, type: 'info' });
  };


  useEffect(() => {
    fetchEmployees(); // Fetch employees on component mount
  }, []); 


  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (employee.phone && employee.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filterRole === 'All' || employee.role === filterRole;
    const matchesStatus = filterStatus === 'All' || (filterStatus === 'Active' && employee.isActive) || (filterStatus === 'Inactive' && !employee.isActive);
    const matchesDate = filterDateRange === 'All' ? true : true; 

    return matchesSearch && matchesRole && matchesStatus && matchesDate;
  });

  // Filter options
  const employeeRoles = ['All', 'Labor', 'Manager', 'Admin', 'Other']; // Example roles
  const employeeStatuses = ['All', 'Active', 'Inactive'];
  const dateRanges = ['All', 'Last 30 Days', 'This Quarter', 'This Year'];

  // Statistics
  const totalEmployeesCount = filteredEmployees.length;
  const activeEmployeesCount = filteredEmployees.filter(e => e.isActive).length;
  const laborEmployeesCount = filteredEmployees.filter(e => e.role === 'Labor').length;
  const totalMonthlySalaryCommitment = filteredEmployees.reduce((sum, e) => sum + (e.monthlySalary ?? 0), 0);
  const totalSalaryPaidThisMonth = filteredEmployees.reduce((sum, e) => sum + (e.salaryPaidThisMonth ?? 0), 0);
  const totalSalaryRemainingThisMonth = totalMonthlySalaryCommitment - totalSalaryPaidThisMonth;
  const totalOverpaidAmount = filteredEmployees.reduce((sum, e) => sum + ((e.overpaidAmount ?? 0) > 0 ? (e.overpaidAmount ?? 0) : 0), 0); // Sum only positive overpaid amounts


  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-darkGray dark:text-gray-100">Employees</h1>
        <div className="flex space-x-3">
          <Link href="/employees/add" className="bg-primary text-white py-2.5 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-200 shadow-md flex items-center">
            <Plus size={20} className="mr-2" /> Ku Dar Shaqaale
          </Link>
          <button onClick={fetchEmployees} className="bg-secondary text-white py-2.5 px-6 rounded-lg font-bold text-lg hover:bg-green-600 transition duration-200 shadow-md flex items-center">
            <RefreshCw size={20} className="mr-2" /> Cusboonaysii
          </button>
        </div>
      </div>

      {/* Employee Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Shaqaalaha</h4>
          <p className="text-3xl font-extrabold text-primary">{totalEmployeesCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Shaqaalaha Firfircoon</h4>
          <p className="text-3xl font-extrabold text-secondary">{activeEmployeesCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Mushaharka Bisha</h4>
          <p className="text-3xl font-extrabold text-accent">${totalMonthlySalaryCommitment.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Mushahar Hadhay Bishaan</h4>
          <p className={`text-3xl font-extrabold ${totalSalaryRemainingThisMonth >= 0 ? 'text-primary' : 'text-redError'}`}>${totalSalaryRemainingThisMonth.toLocaleString()}</p>
        </div>
        {totalOverpaidAmount > 0 && ( // NEW: Overpaid amount card
            <div className="bg-redError/10 p-6 rounded-xl shadow-md text-center animate-fade-in-up">
                <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Lacagta La Siidaayay</h4>
                <p className="text-3xl font-extrabold text-redError">-${totalOverpaidAmount.toLocaleString()}</p>
            </div>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 animate-fade-in-up">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search employees by name, email, or phone..."
            className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 placeholder-mediumGray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Filter by Role */}
        <div className="relative w-full md:w-48">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
          <select
            className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 appearance-none"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            {employeeRoles.map(role => <option key={role} value={role}>{role}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400">
            <ChevronRight className="transform rotate-90" size={20} />
          </div>
        </div>
        {/* Filter by Status */}
        <div className="relative w-full md:w-48">
          <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
          <select
            className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 appearance-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {employeeStatuses.map(status => <option key={status} value={status}>{status}</option>)}
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

      {/* Employees View */}
      {pageLoading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="animate-spin mr-3 text-primary" size={32} /> Loading Employees...
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center text-mediumGray dark:text-gray-400 animate-fade-in">
          Ma jiraan shaqaale la helay.
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-lightGray dark:divide-gray-700">
              <thead className="bg-lightGray dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Magaca</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Doorka</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Taleefan</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Mushahar Bil kasta</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">La Bixiyay Bishaan</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Hadhay Bishaan</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Xaaladda</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lightGray dark:divide-gray-700">
                {filteredEmployees.map(employee => (
                  <EmployeeRow key={employee.id} employee={employee} onEdit={handleEditEmployee} onDelete={handleDeleteEmployee} onRecordDailyWork={handleRecordDailyWork} onRecordPayment={handleRecordPayment} />
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Placeholder */}
          <div className="p-4 flex justify-between items-center border-t border-lightGray dark:border-gray-700">
              <button className="text-sm text-mediumGray dark:text-gray-400 hover:text-primary transition">Hore</button>
              <span className="text-sm text-darkGray dark:text-gray-100">Page 1 of {Math.ceil(filteredEmployees.length / 10) || 1}</span>
              <button className="text-sm text-mediumGray dark:text-gray-400 hover:text-primary transition">Next</button>
          </div>
        </div>
      ) : ( /* Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredEmployees.map(employee => (
                <EmployeeCard key={employee.id} employee={employee} onEdit={handleEditEmployee} onDelete={handleDeleteEmployee} onRecordDailyWork={handleRecordDailyWork} onRecordPayment={handleRecordPayment} />
            ))}
        </div>
      )}

      {toastMessage && (
        <Toast message={toastMessage.message} type={toastMessage.type} onClose={() => setToastMessage(null)} />
      )}
    </Layout>
  );
}
