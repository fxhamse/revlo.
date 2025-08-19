// app/expenses/edit/[id]/page.tsx - Edit Expense Page (Full Company Expense Forms)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Layout from '../../../../components/layouts/Layout';
import { 
  ArrowLeft, DollarSign, Tag, Calendar, MessageSquare, FileUp, Upload, 
  Info, Briefcase, CreditCard, Loader2, Save,
  Package, MinusCircle, Plus, ChevronRight, Building, Coins, Truck, Home, HardHat, Users
} from 'lucide-react';
import Toast from '../../../../components/common/Toast';

interface MaterialItem {
  id: number;
  name: string;
  qty: string | number;
  price: string | number;
  unit: string;
}

export default function EditExpensePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Common fields
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [paidFrom, setPaidFrom] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [note, setNote] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState('');

  // Material specific
  const [materials, setMaterials] = useState<MaterialItem[]>([{ id: 1, name: '', qty: '', price: '', unit: '' }]);
  
  // Labor specific
  const [employeeName, setEmployeeName] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [wage, setWage] = useState<number | ''>('');
  const [laborPaidAmount, setLaborPaidAmount] = useState<number | ''>('');

  // Company Expense specific fields
  const [companyExpenseType, setCompanyExpenseType] = useState('');
  const [selectedEmployeeForSalary, setSelectedEmployeeForSalary] = useState('');
  const [salaryPaymentAmount, setSalaryPaymentAmount] = useState<number | ''>('');
  const [officeRentPeriod, setOfficeRentPeriod] = useState('');
  const [electricityMeterReading, setElectricityMeterReading] = useState('');
  const [fuelVehicle, setFuelVehicle] = useState('');
  const [fuelLiters, setFuelLiters] = useState<number | ''>('');
  const [marketingCampaignName, setMarketingCampaignName] = useState('');
  const [lenderName, setLenderName] = useState('');
  const [loanDate, setLoanDate] = useState('');
  const [debtRepaymentAmount, setDebtRepaymentAmount] = useState<number | ''>('');
  const [selectedDebt, setSelectedDebt] = useState('');

  // Dynamic data from API
  const [projects, setProjects] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [debts, setDebts] = useState<any[]>([]);

  // Fetch options from API
  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        const [projectsRes, accountsRes, employeesRes, debtsRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/accounting/accounts'),
          fetch('/api/employees'),
          fetch('/api/customers') // Assuming customers are lenders for debt
        ]);
        const projectsData = await projectsRes.json();
        const accountsData = await accountsRes.json();
        const employeesData = await employeesRes.json();
        const debtsData = await debtsRes.json();

        setProjects(projectsData.projects || []);
        setAccounts(accountsData.accounts || []);
        setEmployees(employeesData.employees || []);
        setDebts(debtsData.customers || []);
      } catch (error) {
        console.error("Failed to fetch related data", error);
        setToastMessage({ message: "Cilad ayaa ka dhacday soo-gelinta xogta la xiriirta.", type: 'error' });
      }
    };
    fetchRelatedData();
  }, []);

  // Fetch existing expense data to populate the form
  useEffect(() => {
    if (id) {
      const fetchExpense = async () => {
        setPageLoading(true);
        try {
          const res = await fetch(`/api/expenses/${id}`);
          if (!res.ok) throw new Error("Lama helin xogta kharashka");
          const data = await res.json();
          const expense = data.expense;

          // Populate common fields
          setCategory(expense.category);
          setPaidFrom(expense.paidFrom);
          setExpenseDate(new Date(expense.date).toISOString().split('T')[0]);
          setNote(expense.note || '');
          setDescription(expense.description || '');
          setSelectedProject(expense.project?.id || '');

          // Populate category-specific fields
          switch (expense.category) {
            case 'Material':
              setAmount(expense.amount); // total cost
              if (expense.materials) {
                setMaterials(expense.materials.map((m: any, i: number) => ({ id: i + 1, ...m })));
              }
              break;
            case 'Labor':
                setWage(expense.wage || '');
                setLaborPaidAmount(expense.laborPaidAmount || '');
                setEmployeeName(expense.employeeName || '');
                setWorkDescription(expense.workDescription || '');
                break;
            case 'Company Expense':
              setCompanyExpenseType(expense.companyExpenseType || '');
              // Populate sub-category fields
              switch (expense.companyExpenseType) {
                case 'Salary':
                  setSalaryPaymentAmount(expense.amount);
                  setSelectedEmployeeForSalary(expense.employeeId || '');
                  break;
                case 'Office Rent':
                  setAmount(expense.amount);
                  setOfficeRentPeriod(expense.officeRentPeriod || '');
                  break;
                case 'Electricity':
                   setAmount(expense.amount);
                   setElectricityMeterReading(expense.electricityMeterReading || '');
                   break;
                case 'Fuel':
                    setAmount(expense.amount);
                    setFuelVehicle(expense.fuelVehicle || '');
                    setFuelLiters(expense.fuelLiters || '');
                    break;
                case 'Marketing':
                    setAmount(expense.amount);
                    setMarketingCampaignName(expense.marketingCampaignName || '');
                    break;
                case 'Debt':
                    setAmount(expense.amount);
                    setLenderName(expense.lenderName || '');
                    setLoanDate(expense.loanDate ? new Date(expense.loanDate).toISOString().split('T')[0] : '');
                    break;
                case 'Debt Repayment':
                    setDebtRepaymentAmount(expense.amount);
                    setSelectedDebt(expense.selectedDebt || '');
                    break;
                case 'Material':
                    if (expense.materials) {
                        setMaterials(expense.materials.map((m: any, i: number) => ({ id: i + 1, ...m })));
                    }
                    break;
                default:
                  setAmount(expense.amount);
              }
              break;
            default:
              setAmount(expense.amount);
          }

        } catch (error: any) {
          setToastMessage({ message: error.message, type: 'error' });
        } finally {
          setPageLoading(false);
        }
      };
      fetchExpense();
    }
  }, [id]);
  
  // --- Calculations & Handlers (similar to add page) ---
  const totalMaterialCost = materials.reduce((sum, item) => {
    const qty = parseFloat(item.qty as string) || 0;
    const price = parseFloat(item.price as string) || 0;
    return sum + (qty * price);
  }, 0);

  const handleAddMaterial = () => setMaterials([...materials, { id: Date.now(), name: '', qty: '', price: '', unit: '' }]);
  const handleRemoveMaterial = (id: number) => setMaterials(materials.filter(mat => mat.id !== id));
  const handleMaterialChange = (id: number, field: string, value: string | number) => {
    setMaterials(materials.map(mat => mat.id === id ? { ...mat, [field]: value } : mat));
  };

  const validateForm = () => {
      // This function should be expanded to include all validation from the add page
      const errors: { [key: string]: string } = {};
      if (!category) errors.category = "Category is required.";
      // Add all other validation rules here...
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      setToastMessage({ message: 'Fadlan sax khaladaadka foomka.', type: 'error' });
      return;
    }

    let expenseData: any = {
      category,
      paidFrom,
      expenseDate,
      note: note.trim() || undefined,
      projectId: selectedProject || undefined,
      description: description.trim() || category
    };
    
    // Structure data based on category
    switch (category) {
        case 'Material':
            expenseData.amount = totalMaterialCost;
            expenseData.materials = materials.map(({id, ...rest}) => rest);
            break;
        case 'Labor':
            expenseData.amount = wage;
            expenseData.wage = wage;
            expenseData.laborPaidAmount = laborPaidAmount;
            expenseData.employeeName = employeeName;
            expenseData.workDescription = workDescription;
            break;
        case 'Company Expense':
            expenseData.companyExpenseType = companyExpenseType;
            switch(companyExpenseType) {
                case 'Salary':
                    expenseData.amount = salaryPaymentAmount;
                    expenseData.employeeId = selectedEmployeeForSalary;
                    break;
                case 'Office Rent':
                    expenseData.amount = amount;
                    expenseData.officeRentPeriod = officeRentPeriod;
                    break;
                case 'Debt Repayment':
                    expenseData.amount = debtRepaymentAmount;
                    expenseData.selectedDebt = selectedDebt;
                    break;
                // Add all other company expense types here...
                default:
                    expenseData.amount = amount;
            }
            break;
        default:
            expenseData.amount = amount;
    }

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Cusboonaysiinta kharashka way fashilantay');
      
      setToastMessage({ message: 'Kharashka si guul leh ayaa loo cusboonaysiiyay!', type: 'success' });
      router.push(`/expenses/${id}`);

    } catch (error: any) {
      setToastMessage({ message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="animate-spin mr-3 text-primary" size={32} />
          <span>Soo raridda Foomka Wax-ka-beddelka...</span>
        </div>
      </Layout>
    );
  }
  
  const materialUnits = ['pcs', 'sq ft', 'sq m', 'Liter', 'kg', 'box', 'm'];
  const companyExpenseCategories = [
    { value: 'Salary', label: 'Mushahar', icon: Users },
    { value: 'Office Rent', label: 'Kirada Xafiiska', icon: Building },
    { value: 'Electricity', label: 'Koronto', icon: Info },
    { value: 'Fuel', label: 'Shidaal', icon: Truck },
    { value: 'Utilities', label: 'Adeegyada Guud', icon: Home },
    { value: 'Marketing', label: 'Suuqgeyn', icon: DollarSign },
    { value: 'Material', label: 'Alaab (Shirkadda)', icon: Package },
    { value: 'Debt', label: 'Deyn (La Qaatay)', icon: Coins },
    { value: 'Debt Repayment', label: 'Dib U Bixin Deynta', icon: Coins },
    { value: 'Other', label: 'Kale', icon: Info },
  ];
  
  const renderCompanyExpenseForm = () => {
    switch(companyExpenseType) {
      case 'Salary':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-3 border border-dashed border-primary/30 rounded-lg bg-primary/5">
            <h4 className="col-span-full text-base font-bold text-primary dark:text-blue-300">Faahfaahinta Mushaharka</h4>
            <div>
              <label htmlFor="selectedEmployeeForSalary" className="block text-sm font-medium">Dooro Shaqaale</label>
              <select id="selectedEmployeeForSalary" value={selectedEmployeeForSalary} onChange={e => setSelectedEmployeeForSalary(e.target.value)} className="w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800">
                <option value="">-- Dooro Shaqaale --</option>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.fullName || emp.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="salaryPaymentAmount" className="block text-sm font-medium">Lacagta La Bixinayo ($)</label>
              <input type="number" id="salaryPaymentAmount" value={salaryPaymentAmount} onChange={e => setSalaryPaymentAmount(parseFloat(e.target.value) || '')} className="w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800"/>
            </div>
          </div>
        );
      case 'Office Rent':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-3 border border-dashed border-primary/30 rounded-lg bg-primary/5">
            <h4 className="col-span-full text-base font-bold text-primary dark:text-blue-300">Faahfaahinta Kirada Xafiiska</h4>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium">Qiimaha Kirada ($)</label>
              <input type="number" id="amount" value={amount} onChange={e => setAmount(parseFloat(e.target.value) || '')} className="w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800"/>
            </div>
            <div>
              <label htmlFor="officeRentPeriod" className="block text-sm font-medium">Muddada Kirada</label>
              <select id="officeRentPeriod" value={officeRentPeriod} onChange={e => setOfficeRentPeriod(e.target.value)} className="w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800">
                <option value="">-- Dooro Muddada --</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annually">Annually</option>
              </select>
            </div>
          </div>
        );
      case 'Electricity':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-3 border border-dashed border-primary/30 rounded-lg bg-primary/5">
            <h4 className="col-span-full text-base font-bold text-primary dark:text-blue-300">Faahfaahinta Korontada</h4>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium">Qiimaha Korontada ($)</label>
              <input type="number" id="amount" value={amount} onChange={e => setAmount(parseFloat(e.target.value) || '')} className="w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800"/>
            </div>
            <div>
              <label htmlFor="electricityMeterReading" className="block text-sm font-medium">Akhriska Mitirka</label>
              <input type="text" id="electricityMeterReading" value={electricityMeterReading} onChange={e => setElectricityMeterReading(e.target.value)} className="w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800"/>
            </div>
          </div>
        );
      case 'Fuel':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-3 border border-dashed border-primary/30 rounded-lg bg-primary/5">
            <h4 className="col-span-full text-base font-bold text-primary dark:text-blue-300">Faahfaahinta Shidaalka</h4>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium">Qiimaha Shidaalka ($)</label>
              <input type="number" id="amount" value={amount} onChange={e => setAmount(parseFloat(e.target.value) || '')} className="w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800"/>
            </div>
            <div>
              <label htmlFor="fuelVehicle" className="block text-sm font-medium">Gaariga</label>
              <input type="text" id="fuelVehicle" value={fuelVehicle} onChange={e => setFuelVehicle(e.target.value)} className="w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800"/>
            </div>
            <div>
              <label htmlFor="fuelLiters" className="block text-sm font-medium">Litir</label>
              <input type="number" id="fuelLiters" value={fuelLiters} onChange={e => setFuelLiters(parseFloat(e.target.value) || '')} className="w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800"/>
            </div>
          </div>
        );
      case 'Marketing':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-3 border border-dashed border-primary/30 rounded-lg bg-primary/5">
            <h4 className="col-span-full text-base font-bold text-primary dark:text-blue-300">Faahfaahinta Suuqgeynta</h4>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium">Qiimaha Ololaha ($)</label>
              <input type="number" id="amount" value={amount} onChange={e => setAmount(parseFloat(e.target.value) || '')} className="w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800"/>
            </div>
            <div>
              <label htmlFor="marketingCampaignName" className="block text-sm font-medium">Magaca Ololaha</label>
              <input type="text" id="marketingCampaignName" value={marketingCampaignName} onChange={e => setMarketingCampaignName(e.target.value)} className="w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800"/>
            </div>
          </div>
        );
      case 'Material':
        return (
          <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 space-y-4">
            <h3 className="text-lg font-bold text-primary dark:text-blue-300">Faahfaahinta Alaabta (Kharashka Shirkadda)</h3>
            {materials.map((material, index) => (
              <div key={material.id} className="grid grid-cols-1 md:grid-cols-10 gap-3 items-end relative">
                <div className="md:col-span-3"><label className="text-xs">Alaabta</label><input type="text" value={material.name} onChange={(e) => handleMaterialChange(material.id, 'name', e.target.value)} className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800"/></div>
                <div className="md:col-span-2"><label className="text-xs">Tirada</label><input type="number" value={material.qty} onChange={(e) => handleMaterialChange(material.id, 'qty', e.target.value)} className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800"/></div>
                <div className="md:col-span-2"><label className="text-xs">Qiimaha</label><input type="number" value={material.price} onChange={(e) => handleMaterialChange(material.id, 'price', e.target.value)} className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800"/></div>
                <div className="md:col-span-2"><label className="text-xs">Cutubka</label><select value={material.unit} onChange={(e) => handleMaterialChange(material.id, 'unit', e.target.value)} className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 appearance-none"><option>Unit</option>{materialUnits.map(u=><option key={u} value={u}>{u}</option>)}</select></div>
                <div className="md:col-span-1"><button type="button" onClick={() => handleRemoveMaterial(material.id)} className="text-redError p-2"><MinusCircle size={20} /></button></div>
              </div>
            ))}
            <button type="button" onClick={handleAddMaterial} className="bg-primary/10 text-primary py-2 px-4 rounded-lg"><Plus size={18} className="mr-2 inline"/>Ku Dar</button>
            <div className="p-3 bg-primary/10 rounded-lg flex justify-between items-center"><span className="font-semibold">Wadarta:</span><span className="font-extrabold">${totalMaterialCost.toLocaleString()}</span></div>
          </div>
        );
      case 'Debt':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-3 border border-dashed border-primary/30 rounded-lg bg-primary/5">
            <h4 className="col-span-full text-base font-bold text-primary dark:text-blue-300">Faahfaahinta Deynta (La Qaatay)</h4>
            <div>
              <label htmlFor="lenderName" className="block text-sm font-medium">Magaca Deynta Bixiyaha</label>
              <input type="text" id="lenderName" value={lenderName} onChange={e => setLenderName(e.target.value)} className="w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800"/>
            </div>
            <div>
              <label htmlFor="loanDate" className="block text-sm font-medium">Taariikhda Deynta</label>
              <input type="date" id="loanDate" value={loanDate} onChange={e => setLoanDate(e.target.value)} className="w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800"/>
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium">Qiimaha Deynta ($)</label>
              <input type="number" id="amount" value={amount} onChange={e => setAmount(parseFloat(e.target.value) || '')} className="w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800"/>
            </div>
          </div>
        );
      case 'Debt Repayment':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-3 border border-dashed border-primary/30 rounded-lg bg-primary/5">
            <h4 className="col-span-full text-base font-bold text-primary dark:text-blue-300">Faahfaahinta Dib U Bixinta Deynta</h4>
            <div>
              <label htmlFor="selectedDebt" className="block text-sm font-medium">Dooro Deyn</label>
              <select id="selectedDebt" value={selectedDebt} onChange={e => setSelectedDebt(e.target.value)} className="w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800">
                <option value="">-- Dooro Deyn --</option>
                {debts.map(debt => <option key={debt.id} value={debt.id}>{debt.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="debtRepaymentAmount" className="block text-sm font-medium">Qiimaha Dib U Bixinta ($)</label>
              <input type="number" id="debtRepaymentAmount" value={debtRepaymentAmount} onChange={e => setDebtRepaymentAmount(parseFloat(e.target.value) || '')} className="w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800"/>
            </div>
          </div>
        );
      case 'Other':
        return (
          <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 space-y-4">
            <h3 className="text-lg font-bold text-primary dark:text-blue-300">Faahfaahin Kale</h3>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium">Qiimaha ($)</label>
              <input type="number" id="amount" value={amount} onChange={e => setAmount(parseFloat(e.target.value) || '')} className="w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800"/>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-darkGray dark:text-gray-100 flex items-center">
          <Link href={`/expenses/${id}`} className="p-2 rounded-full bg-lightGray dark:bg-gray-700 hover:bg-primary hover:text-white transition-colors duration-200 mr-4">
            <ArrowLeft size={28} />
          </Link>
          Wax Ka Beddel Kharashka
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md animate-fade-in-up">
        <form onSubmit={handleSubmit} className="space-y-6">
        
          {/* Main Category Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Nooca Kharashka <span className="text-redError">*</span></label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray" size={20} />
                  <select id="category" required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 pl-10 border rounded-lg bg-lightGray dark:bg-gray-700 appearance-none">
                    <option value="">-- Dooro Nooca --</option>
                    <option value="Material">Alaab</option>
                    <option value="Labor">Shaqo</option>
                    <option value="Transport">Gaadiid</option>
                    <option value="Company Expense">Kharashka Shirkadda</option>
                    <option value="Other">Kale</option>
                  </select>
                  <ChevronRight className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray transform rotate-90" size={20} />
                </div>
              </div>
              <div>
                <label htmlFor="expenseDate" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Taariikhda <span className="text-redError">*</span></label>
                 <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray" size={20} />
                    <input type="date" id="expenseDate" required value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} className="w-full p-3 pl-10 border rounded-lg bg-lightGray dark:bg-gray-700"/>
                 </div>
              </div>
          </div>
          
          <hr className="dark:border-gray-600"/>

          {/* Conditional Forms Start Here */}

          {category === 'Company Expense' && (
             <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 space-y-4">
                 <h3 className="text-lg font-bold text-primary dark:text-blue-300">Faahfaahinta Kharashka Shirkadda</h3>
                 <div>
                    <label htmlFor="companyExpenseType" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Nooca Gaarka ah</label>
                    <select id="companyExpenseType" required value={companyExpenseType} onChange={(e) => setCompanyExpenseType(e.target.value)} className="w-full p-3 border rounded-lg bg-lightGray dark:bg-gray-700 appearance-none">
                        <option value="">-- Dooro Nooca Gaarka ah --</option>
                        {companyExpenseCategories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                    </select>
                 </div>
                 {renderCompanyExpenseForm()}
            </div>
          )}

          {category === 'Material' && (
             <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 space-y-4">
              <h3 className="text-lg font-bold text-primary dark:text-blue-300">Faahfaahinta Alaabta</h3>
              {materials.map((material, index) => (
                <div key={material.id} className="grid grid-cols-1 md:grid-cols-10 gap-3 items-end relative">
                  <div className="md:col-span-3"><label className="text-xs">Alaabta</label><input type="text" value={material.name} onChange={(e) => handleMaterialChange(material.id, 'name', e.target.value)} className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800"/></div>
                  <div className="md:col-span-2"><label className="text-xs">Tirada</label><input type="number" value={material.qty} onChange={(e) => handleMaterialChange(material.id, 'qty', e.target.value)} className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800"/></div>
                  <div className="md:col-span-2"><label className="text-xs">Qiimaha</label><input type="number" value={material.price} onChange={(e) => handleMaterialChange(material.id, 'price', e.target.value)} className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800"/></div>
                  <div className="md:col-span-2"><label className="text-xs">Cutubka</label><select value={material.unit} onChange={(e) => handleMaterialChange(material.id, 'unit', e.target.value)} className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 appearance-none"><option>Unit</option>{materialUnits.map(u=><option key={u} value={u}>{u}</option>)}</select></div>
                  <div className="md:col-span-1"><button type="button" onClick={() => handleRemoveMaterial(material.id)} className="text-redError p-2"><MinusCircle size={20} /></button></div>
                </div>
              ))}
              <button type="button" onClick={handleAddMaterial} className="bg-primary/10 text-primary py-2 px-4 rounded-lg"><Plus size={18} className="mr-2 inline"/>Ku Dar</button>
              <div className="p-3 bg-primary/10 rounded-lg flex justify-between items-center"><span className="font-semibold">Wadarta:</span><span className="font-extrabold">${totalMaterialCost.toLocaleString()}</span></div>
            </div>
          )}
          
           {category !== 'Material' && category !== 'Company Expense' && (
             <div>
              <label htmlFor="amount" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Qiimaha ($)</label>
              <input type="number" id="amount" value={amount} onChange={e => setAmount(parseFloat(e.target.value) || '')} className="w-full p-3 border rounded-lg bg-lightGray dark:bg-gray-700"/>
            </div>
           )}

          <hr className="dark:border-gray-600"/>
          
          {/* Common Fields at the bottom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="paidFrom" className="block text-md font-medium">Akoonka Laga Jarayo</label>
                <select id="paidFrom" required value={paidFrom} onChange={e => setPaidFrom(e.target.value)} className="w-full p-3 border rounded-lg bg-lightGray dark:bg-gray-700">
                  <option value="">-- Dooro Akoonka --</option>
                  {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="selectedProject" className="block text-md font-medium">Mashruuc La Xiriira (Ikhtiyaari)</label>
                <select id="selectedProject" value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="w-full p-3 border rounded-lg bg-lightGray dark:bg-gray-700">
                  <option value="">-- No Project --</option>
                  {projects.map(proj => <option key={proj.id} value={proj.id}>{proj.name}</option>)}
                </select>
              </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-md font-medium">Sharaxaad</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full p-3 border rounded-lg bg-lightGray dark:bg-gray-700"></textarea>
          </div>
          
          <div>
            <label htmlFor="note" className="block text-md font-medium">Fiiro Gaar Ah (Ikhtiyaari)</label>
            <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full p-3 border rounded-lg bg-lightGray dark:bg-gray-700"></textarea>
          </div>
          
          <button type="submit" className="w-full bg-secondary text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 flex items-center justify-center" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
            {loading ? 'Cusboonaysiinaya...' : 'Kaydi Isbedelada'}
          </button>
        </form>
      </div>
      {toastMessage && <Toast message={toastMessage.message} type={toastMessage.type} onClose={() => setToastMessage(null)} />}
    </Layout>
  );
}