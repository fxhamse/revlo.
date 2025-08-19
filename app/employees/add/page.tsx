// app/employees/add/page.tsx - Add New Employee Page (10000% Design - API Integration with Dynamic Forms)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/layouts/Layout';
import { 
  Plus, X, Loader2, Info, CheckCircle, User as UserIcon, Building, Mail, Phone, MapPin, MessageSquare,
  ArrowLeft, Tag, Briefcase as BriefcaseIcon, Clock as ClockIcon, Coins, Calendar, DollarSign, ClipboardList, ChevronRight
} from 'lucide-react';
import Toast from '../../../components/common/Toast'; // Reuse Toast component

export default function AddEmployeePage() {
  const router = useRouter();
  const [employeeType, setEmployeeType] = useState<'Company' | 'Project'>('Company'); // NEW: Company or Project employee
  
  // Common fields for all employee types
  const [isActive, setIsActive] = useState(true); // Default to active

  // For selecting existing employees (Company contract)
  const [existingEmployees, setExistingEmployees] = useState<{ id: string; fullName: string }[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  // Company Employee contract fields
  // Restore original company employee fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyRole, setCompanyRole] = useState('');
  const [monthlySalary, setMonthlySalary] = useState<number | ''>('');
  const [salaryStartDate, setSalaryStartDate] = useState(new Date().toISOString().split('T')[0]);

  // Project Employee specific fields
  const [projectList, setProjectList] = useState<{ id: string; name: string }[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [employeeList, setEmployeeList] = useState<{ id: string; fullName: string }[]>([]);
  const [selectedProjectEmployeeId, setSelectedProjectEmployeeId] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [agreedWage, setAgreedWage] = useState<number | ''>(''); // Total wage for project work
  const [laborPaidAmount, setLaborPaidAmount] = useState<number | ''>(''); // Amount paid for project work (optional)
  const [dateWorked, setDateWorked] = useState(new Date().toISOString().split('T')[0]); // Date for project work

  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const companyEmployeeRoles = ['Manager', 'Admin', 'HR', 'Accountant', 'Other']; // Roles for company employees
  const projectEmployeeRoles = ['Labor', 'Supervisor', 'Specialist', 'Other']; // Roles for project employees (if distinct)

  // Dummy data for selections (will be replaced by API calls)
  const dummyProjects = [
    { id: 'proj001', name: 'Furniture Project A' },
    { id: 'proj002', name: 'Office Setup B' },
    { id: 'proj003', name: 'Restaurant Decor C' },
  ];

  // --- Calculations ---
  const laborRemainingAmount = (typeof agreedWage === 'number' ? agreedWage : 0) - (typeof laborPaidAmount === 'number' ? laborPaidAmount : 0);

  // --- Validation Logic ---
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (employeeType === 'Project') {
      if (!selectedProject) newErrors.selectedProject = 'Mashruuca waa waajib.';
      if (!selectedProjectEmployeeId) newErrors.projectEmployeeName = 'Magaca shaqaalaha waa waajib.';
      if (!workDescription.trim()) newErrors.workDescription = 'Sharaxaadda shaqada waa waajib.';
      if (typeof agreedWage !== 'number' || agreedWage <= 0) newErrors.agreedWage = 'Mushaharka la isku raacay waa waajib oo waa inuu noqdaa nambar wanaagsan.';
      // 'lacagta la bixiyay' waa optional, kaliya xad ka badan agreedWage ayaa la hubinayaa
      if (typeof laborPaidAmount === 'number' && typeof agreedWage === 'number' && laborPaidAmount > agreedWage) {
        newErrors.laborPaidAmount = 'Lacagta la bixiyay ma dhaafi karto mushaharka la isku raacay.';
      }
      if (!dateWorked) newErrors.dateWorked = 'Taariikhda shaqada waa waajib.';
    }
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Handlers ---
  useEffect(() => {
    // Fetch all existing employees for selection (Company contract)
    if (employeeType === 'Company') {
      fetch('/api/employees')
        .then(res => res.json())
        .then(data => setExistingEmployees(data.employees || []));
    }
    // Fetch all projects and employees for Project Employee
    if (employeeType === 'Project') {
      fetch('/api/projects')
        .then(res => res.json())
        .then(data => setProjectList(data.projects || []));
      fetch('/api/employees')
        .then(res => res.json())
        .then(data => setEmployeeList(data.employees || []));
    }
  }, [employeeType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});
    setToastMessage(null);

    // Validation and submit for company employee
    if (employeeType === 'Company') {
      const newErrors: { [key: string]: string } = {};
      if (!fullName.trim()) newErrors.fullName = 'Magaca buuxa waa waajib.';
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Fadlan geli email sax ah.';
      if (!companyRole) newErrors.companyRole = 'Doorka shirkadda waa waajib.';
      // Monthly salary is now optional
      if (!salaryStartDate) newErrors.salaryStartDate = 'Taariikhda bilowga mushaharka waa waajib.';
      setValidationErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        setLoading(false);
        setToastMessage({ message: 'Fadlan sax khaladaadka foomka.', type: 'error' });
        return;
      }
      // API call for adding a new company employee
      try {
        const response = await fetch('/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName,
            email: email || null,
            phone: phone || null,
            role: companyRole,
            monthlySalary: monthlySalary || null,
            isActive,
            startDate: salaryStartDate,
            category: 'COMPANY',
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to add company employee');
        setToastMessage({ message: data.message || 'Shaqaalaha shirkadda si guul leh ayaa loo daray!', type: 'success' });
        // Reset fields
        setFullName(''); setEmail(''); setPhone(''); setCompanyRole(''); setMonthlySalary(''); setSalaryStartDate(new Date().toISOString().split('T')[0]); setIsActive(true);
        setValidationErrors({});
        router.push('/employees');
      } catch (error: any) {
        setToastMessage({ message: error.message || 'Cilad shabakadeed ayaa dhacday. Fadlan isku day mar kale.', type: 'error' });
      } finally {
        setLoading(false);
      }
      return;
    }

    // Validation and submit for project employee
    if (employeeType === 'Project') {
      const newErrors: { [key: string]: string } = {};
      if (!selectedProject) newErrors.selectedProject = 'Mashruuca waa waajib.';
      if (!selectedProjectEmployeeId) newErrors.projectEmployeeName = 'Magaca shaqaalaha waa waajib.';
      if (!workDescription.trim()) newErrors.workDescription = 'Sharaxaadda shaqada waa waajib.';
      // Wage is now optional for project employee
      if (typeof laborPaidAmount === 'number' && typeof agreedWage === 'number' && laborPaidAmount > agreedWage) {
        newErrors.laborPaidAmount = 'Lacagta la bixiyay ma dhaafi karto mushaharka la isku raacay.';
      }
      if (!dateWorked) newErrors.dateWorked = 'Taariikhda shaqada waa waajib.';
      setValidationErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        setLoading(false);
        setToastMessage({ message: 'Fadlan sax khaladaadka foomka.', type: 'error' });
        return;
      }
      // API call for adding a new project employee
      try {
        const response = await fetch('/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: selectedProject,
            employeeId: selectedProjectEmployeeId,
            workDescription,
            agreedWage,
            paidAmount: laborPaidAmount || 0,
            dateWorked,
            category: 'PROJECT',
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to add project employee');
        setToastMessage({ message: data.message || 'Shaqaalaha mashruuca si guul leh ayaa loo daray!', type: 'success' });
        // Reset fields
        setSelectedProject(''); setSelectedProjectEmployeeId(''); setWorkDescription(''); setAgreedWage(''); setLaborPaidAmount(''); setDateWorked(new Date().toISOString().split('T')[0]);
        setValidationErrors({});
        router.push('/employees');
      } catch (error: any) {
        setToastMessage({ message: error.message || 'Cilad shabakadeed ayaa dhacday. Fadlan isku day mar kale.', type: 'error' });
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-darkGray dark:text-gray-100">
          <Link href="/employees" className="text-mediumGray dark:text-gray-400 hover:text-primary transition-colors duration-200 mr-4">
            <ArrowLeft size={28} className="inline-block" />
          </Link>
          Ku Dar Shaqaale Cusub
        </h1>
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md animate-fade-in-up">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Type Selection */}
          <div>
            <label htmlFor="employeeType" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Nooca Shaqaalaha <span className="text-redError">*</span></label>
            <div className="flex space-x-3">
              <button 
                type="button" 
                onClick={() => setEmployeeType('Company')} 
                className={`flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200 ${employeeType === 'Company' ? 'bg-primary text-white border-primary' : 'bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 border-lightGray dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                <Building size={20}/> <span>Shaqaalaha Shirkadda</span>
              </button>
              <button 
                type="button" 
                onClick={() => setEmployeeType('Project')} 
                className={`flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200 ${employeeType === 'Project' ? 'bg-primary text-white border-primary' : 'bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 border-lightGray dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                <BriefcaseIcon size={20}/> <span>Shaqaalaha Mashruuca</span>
              </button>
            </div>
          </div>

          {/* Dynamic Fields based on Employee Type */}
          {employeeType === 'Company' ? (
            <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 animate-fade-in space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Magaca Buuxa <span className="text-redError">*</span></label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Tusaale: Axmed Cali"
                    className={`w-full p-3 pl-10 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 placeholder-mediumGray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ${validationErrors.fullName ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                  />
                </div>
                {validationErrors.fullName && <p className="text-redError text-sm mt-1 flex items-center"><Info size={16} className="mr-1"/>{validationErrors.fullName}</p>}
              </div>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Email (Ikhtiyaari)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tusaale@ganacsi.com"
                    className={`w-full p-3 pl-10 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 placeholder-mediumGray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ${validationErrors.email ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                  />
                </div>
                {validationErrors.email && <p className="text-redError text-sm mt-1 flex items-center"><Info size={16} className="mr-1"/>{validationErrors.email}</p>}
              </div>
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Taleefan (Ikhtiyaari)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="251--------"
                    className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
                  />
                </div>
              </div>
              {/* Role */}
              <div>
                <label htmlFor="companyRole" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Doorka Shirkadda <span className="text-redError">*</span></label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
                  <select
                    id="companyRole"
                    value={companyRole}
                    onChange={(e) => setCompanyRole(e.target.value)}
                    className={`w-full p-3 pl-10 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ${validationErrors.companyRole ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                  >
                    <option value="">-- Dooro Door --</option>
                    {companyEmployeeRoles.map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                  <ChevronRight className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400 transform rotate-90" size={20} />
                </div>
                {validationErrors.companyRole && <p className="text-redError text-sm mt-1 flex items-center"><Info size={16} className="mr-1"/>{validationErrors.companyRole}</p>}
              </div>
              {/* Monthly Salary */}
              <div>
                <label htmlFor="monthlySalary" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Mushahar Bil kasta ($) <span className="text-gray-400">(Ikhtiyaari)</span></label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
                  <input
                    type="number"
                    id="monthlySalary"
                    value={monthlySalary}
                    onChange={(e) => setMonthlySalary(parseFloat(e.target.value) || '')}
                    placeholder="Tusaale: 2500"
                    className={`w-full p-3 pl-10 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 placeholder-mediumGray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ${validationErrors.monthlySalary ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                  />
                </div>
                {/* No error for monthlySalary since it's optional */}
              </div>
              {/* Salary Start Date */}
              <div>
                <label htmlFor="salaryStartDate" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Taariikhda Bilowga Mushaharka <span className="text-redError">*</span></label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
                  <input
                    type="date"
                    id="salaryStartDate"
                    value={salaryStartDate}
                    onChange={(e) => setSalaryStartDate(e.target.value)}
                    className={`w-full p-3 pl-10 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 placeholder-mediumGray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ${validationErrors.salaryStartDate ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                  />
                </div>
                {validationErrors.salaryStartDate && <p className="text-redError text-sm mt-1 flex items-center"><Info size={16} className="mr-1"/>{validationErrors.salaryStartDate}</p>}
              </div>
              {/* Is Active */}
              <div>
                <label htmlFor="isActive" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Xaaladda Shaqaalaha</label>
                <div className="flex items-center justify-between p-3 bg-lightGray dark:bg-gray-700 rounded-lg border border-lightGray dark:border-gray-600">
                  <span className="text-darkGray dark:text-gray-300">Firfircoon</span>
                  <input 
                    type="checkbox" 
                    id="isActive" 
                    checked={isActive} 
                    onChange={(e) => setIsActive(e.target.checked)} 
                    className="h-5 w-5 text-primary rounded border-mediumGray dark:border-gray-600 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border border-secondary/20 rounded-lg bg-secondary/5 animate-fade-in space-y-6">
              <h3 className="text-lg font-bold text-secondary dark:text-green-300 mb-4">Faahfaahinta Shaqaalaha Mashruuca</h3>
              {/* Project Selection */}
              <div>
                <label htmlFor="selectedProject" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Dooro Mashruuc <span className="text-redError">*</span></label>
                <div className="relative">
                  <BriefcaseIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
                  <select
                    id="selectedProject"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className={`w-full p-3 pl-10 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ${validationErrors.selectedProject ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                  >
                    <option value="">-- Dooro Mashruuc --</option>
                    {projectList.map(proj => <option key={proj.id} value={proj.id}>{proj.name}</option>)}
                  </select>
                  <ChevronRight className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400 transform rotate-90" size={20} />
                </div>
                {validationErrors.selectedProject && <p className="text-redError text-sm mt-1 flex items-center"><Info size={16} className="mr-1"/>{validationErrors.selectedProject}</p>}
              </div>
              {/* Employee Selection Dropdown */}
              <div>
                <label htmlFor="selectedProjectEmployeeId" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Dooro Shaqaale <span className="text-redError">*</span></label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
                  <select
                    id="selectedProjectEmployeeId"
                    value={selectedProjectEmployeeId}
                    onChange={e => setSelectedProjectEmployeeId(e.target.value)}
                    className={`w-full p-3 pl-10 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ${validationErrors.projectEmployeeName ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                  >
                    <option value="">-- Dooro Shaqaale --</option>
                    {employeeList.map(emp => <option key={emp.id} value={emp.id}>{emp.fullName}</option>)}
                  </select>
                  <ChevronRight className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400 transform rotate-90" size={20} />
                </div>
                {validationErrors.projectEmployeeName && <p className="text-redError text-sm mt-1 flex items-center"><Info size={16} className="mr-1"/>{validationErrors.projectEmployeeName}</p>}
              </div>

              {/* Work Description */}
              <div>
                <label htmlFor="workDescription" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Sharaxaadda Shaqada <span className="text-redError">*</span></label>
                <div className="relative">
                  <ClipboardList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
                  <input
                    type="text"
                    id="workDescription"
                    value={workDescription}
                    onChange={(e) => setWorkDescription(e.target.value)}
                    placeholder="Tusaale: Assembly & Installation"
                    className={`w-full p-3 pl-10 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 placeholder-mediumGray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ${validationErrors.workDescription ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                  />
                </div>
                {validationErrors.workDescription && <p className="text-redError text-sm mt-1 flex items-center"><Info size={16} className="mr-1"/>{validationErrors.workDescription}</p>}
              </div>

              {/* Agreed Wage & Paid Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="agreedWage" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Mushaharka La Isku Raacay ($) <span className="text-gray-400">(Ikhtiyaari)</span></label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
                    <input
                      type="number"
                      id="agreedWage"
                      value={agreedWage}
                      onChange={(e) => setAgreedWage(parseFloat(e.target.value) || '')}
                      placeholder="Tusaale: 1000"
                      className={`w-full p-3 pl-10 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors.agreedWage ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                    />
                  </div>
                  {/* No error for agreedWage since it's optional */}
                </div>
                <div>
                  <label htmlFor="laborPaidAmount" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Lacagta La Bixiyay ($)</label>
                  <div className="relative">
                    <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
                    <input
                      type="number"
                      id="laborPaidAmount"
                      value={laborPaidAmount}
                      onChange={(e) => setLaborPaidAmount(parseFloat(e.target.value) || '')}
                      placeholder="Tusaale: 800"
                      className={`w-full p-3 pl-10 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors.laborPaidAmount ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                    />
                  </div>
                  {validationErrors.laborPaidAmount && <p className="text-redError text-sm mt-1 flex items-center"><Info size={16} className="mr-1"/>{validationErrors.laborPaidAmount}</p>}
                </div>
              </div>
              {/* Remaining Wage Display */}
              <div className="p-3 bg-secondary/10 dark:bg-secondary/20 rounded-lg flex justify-between items-center mt-4">
                  <span className="text-lg font-semibold text-secondary dark:text-green-300">Lacagta Shaqada Hadhay:</span>
                  <span className="text-2xl font-extrabold text-secondary dark:text-green-300">${laborRemainingAmount.toLocaleString()}</span>
              </div>
              {/* Date Worked */}
              <div>
                <label htmlFor="dateWorked" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Taariikhda Shaqada <span className="text-redError">*</span></label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
                  <input
                    type="date"
                    id="dateWorked"
                    value={dateWorked}
                    onChange={(e) => setDateWorked(e.target.value)}
                    className={`w-full p-3 pl-10 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 placeholder-mediumGray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ${validationErrors.dateWorked ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                  />
                </div>
                {validationErrors.dateWorked && <p className="text-redError text-sm mt-1 flex items-center"><Info size={16} className="mr-1"/>{validationErrors.dateWorked}</p>}
              </div>
            </div>
          )}
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-200 shadow-md transform hover:scale-105 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : (
              <Plus className="mr-2" size={20} />
            )}
            {loading ? 'Diiwaan Gelinaya Shaqaale...' : 'Diiwaan Geli Shaqaale'}
          </button>
        </form>
      </div>
      {toastMessage && (
        <Toast message={toastMessage.message} type={toastMessage.type} onClose={() => setToastMessage(null)} />
      )}
    </Layout>
  );
}
