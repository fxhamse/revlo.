// app/expenses/add/page.tsx - Add Expense Page (10000% Design with Dynamic Forms & OCR Placeholder)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/layouts/Layout';
import { 
  X, DollarSign, Tag, Calendar, MessageSquare, FileUp, Camera, Upload, 
  Info, ReceiptText, Briefcase, Users, HardHat, Truck, Home, CreditCard, Clock, Plus, Loader2, CheckCircle, XCircle, ChevronRight, ArrowLeft,
  Package, MinusCircle, Building, User, Coins // Added new icons for Company Expense types
} from 'lucide-react';
import Toast from '../../../components/common/Toast'; // Reuse Toast component


export default function AddExpensePage() {
  const router = useRouter();
  // Expense type: 'project' or 'company'
  // Description field for company material expense
  const [description, setDescription] = useState('');
  const [expenseType, setExpenseType] = useState<'project' | 'company'>('company');
  const [category, setCategory] = useState(''); // For project expense
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Common fields for all expense types
  const [amount, setAmount] = useState<number | ''>(''); // This will be conditionally rendered/calculated
  const [paidFrom, setPaidFrom] = useState('Cash'); 
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]); 
  const [note, setNote] = useState('');
  const [selectedProject, setSelectedProject] = useState(''); 

  // Specific fields for different categories
  const [materials, setMaterials] = useState([{ id: 1, name: '', qty: '', price: '', unit: '' }]); 
  const [employeeName, setEmployeeName] = useState(''); 
  const [workDescription, setWorkDescription] = useState('');
  const [wage, setWage] = useState<number | ''>('');
  const [laborPaidAmount, setLaborPaidAmount] = useState<number | ''>('');
  const [transportType, setTransportType] = useState(''); 
  
  // Company Expense specific fields (now includes Debt/Repayment)
  const [companyExpenseType, setCompanyExpenseType] = useState(''); 
  // Salary specific fields
  const [selectedEmployeeForSalary, setSelectedEmployeeForSalary] = useState('');
  const [salaryPaymentAmount, setSalaryPaymentAmount] = useState<number | ''>('');
  // Office Rent specific fields
  const [officeRentPeriod, setOfficeRentPeriod] = useState(''); // e.g., 'Monthly', 'Quarterly'
  // Electricity specific fields
  const [electricityMeterReading, setElectricityMeterReading] = useState('');
  // Fuel specific fields
  const [fuelVehicle, setFuelVehicle] = useState('');
  const [fuelLiters, setFuelLiters] = useState<number | ''>('');
  // Marketing specific fields
  const [marketingCampaignName, setMarketingCampaignName] = useState('');
  // Debt specific fields (now under Company Expense)
  const [lenderName, setLenderName] = useState(''); 
  const [loanDate, setLoanDate] = useState('');
  const [debtRepaymentAmount, setDebtRepaymentAmount] = useState<number | ''>(''); 
  const [selectedDebt, setSelectedDebt] = useState(''); 

  const [receiptImage, setReceiptImage] = useState<File | null>(null); 

  // Dynamic data from API
  const [projects, setProjects] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [debts, setDebts] = useState<any[]>([]); // If you have a debts API
  const paidFromOptions = ['Cash', 'CBE', 'Ebirr'];
  // Project expense categories: used when expenseType === 'project'
  const projectExpenseCategories = [
  { value: '', label: '-- Dooro Nooca Kharashka Mashruuca --' },
  { value: 'Material', label: 'Alaab (Mashruuc)' },
  { value: 'Labor', label: 'Shaqaale (Mashruuc)' },
  { value: 'Transport', label: 'Transport (Mashruuc)' },
  { value: 'Consultancy', label: 'La-talin (Mashruuc)' },
  { value: 'Equipment Rental', label: 'Kirada Qalabka (Mashruuc)' },
];
// Equipment Rental fields
const [equipmentName, setEquipmentName] = useState('');
const [rentalPeriod, setRentalPeriod] = useState('');
const [rentalFee, setRentalFee] = useState('');
const [supplierName, setSupplierName] = useState('');
const [selectedBankAccount, setSelectedBankAccount] = useState('');

// ...existing code...

// In your main return/render block, add this where category-specific fields are rendered:
// {category === 'Equipment Rental' && expenseType === 'project' && (
//   <>
//     <div className="mb-4">
//       <label className="block text-sm font-medium mb-1">Magaca Qalabka</label>
//       <input type="text" value={equipmentName} onChange={e => setEquipmentName(e.target.value)} className="input input-bordered w-full" required />
//     </div>
//     <div className="mb-4">
//       <label className="block text-sm font-medium mb-1">Muddada Kirada</label>
//       <input type="text" value={rentalPeriod} onChange={e => setRentalPeriod(e.target.value)} className="input input-bordered w-full" required />
//     </div>
//     <div className="mb-4">
//       <label className="block text-sm font-medium mb-1">Lacagta Kirada</label>
//       <input type="number" value={rentalFee} onChange={e => setRentalFee(e.target.value)} className="input input-bordered w-full" required />
//     </div>
//     <div className="mb-4">
//       <label className="block text-sm font-medium mb-1">Magaca Kiriyaha</label>
//       <input type="text" value={supplierName} onChange={e => setSupplierName(e.target.value)} className="input input-bordered w-full" required />
//     </div>
//     <div className="mb-4">
//       <label className="block text-sm font-medium mb-1">Mashruuca loo kireeyay</label>
//       <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="input input-bordered w-full" required>
//         <option value="">Dooro Mashruuca</option>
//         {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
//       </select>
//     </div>
//     <div className="mb-4">
//       <label className="block text-sm font-medium mb-1">Bankiga laga jari doono</label>
//       <select value={selectedBankAccount} onChange={e => setSelectedBankAccount(e.target.value)} className="input input-bordered w-full" required>
//         <option value="">Dooro Bank Account</option>
//         {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
//       </select>
//     </div>
//   </>
// )}
// Consultancy fields
const [consultantName, setConsultantName] = useState('');
const [consultancyType, setConsultancyType] = useState('');
const [consultancyFee, setConsultancyFee] = useState('');
  // Company expense categories: used when expenseType === 'company'
  const companyExpenseCategories = [
    { value: '', label: '-- Dooro Nooca Kharashka Shirkadda --' },
    { value: 'Salary', label: 'Mushahar' },
    { value: 'Office Rent', label: 'Kirada Xafiiska' },
    { value: 'Electricity', label: 'Koronto' },
    { value: 'Fuel', label: 'Shidaal' },
    { value: 'Utilities', label: 'Adeegyada Guud' },
    { value: 'Marketing', label: 'Suuqgeyn' },
    { value: 'Material', label: 'Alaab (Kharashka Shirkadda)' }, 
    { value: 'Debt', label: 'Deyn (La Qaatay)' }, 
    { value: 'Debt Repayment', label: 'Dib U Bixin Deynta' }, 
    { value: 'Other', label: 'Kale' },
  ];
  const materialUnits = ['pcs', 'sq ft', 'sq m', 'Liter', 'kg', 'box', 'm']; 
  const officeRentPeriods = ['Monthly', 'Quarterly', 'Annually'];

  // Fetch options from API
  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data.projects || []));
    fetch('/api/accounting/accounts')
      .then(res => res.json())
      .then(data => setAccounts(data.accounts || []));
    fetch('/api/employees')
      .then(res => res.json())
      .then(data => setEmployees(data.employees || []));
    // Fetch customers with outstanding debt for Debt Repayment
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => setDebts(data.customers || []));
  }, []);


  // --- Calculations ---
  const totalMaterialCost = materials.reduce((sum, item) => {
    const qty = parseFloat(item.qty as string) || 0;
    const price = parseFloat(item.price as string) || 0;
    return sum + (qty * price);
  }, 0);

  const laborRemainingAmount = (typeof wage === 'number' ? wage : 0) - (typeof laborPaidAmount === 'number' ? laborPaidAmount : 0);

  const selectedEmployeeData = employees.find(emp => emp.id === selectedEmployeeForSalary);
  const currentSalaryRemaining = selectedEmployeeData ? (selectedEmployeeData.monthlySalary - (selectedEmployeeData.paidThisMonth || selectedEmployeeData.salaryPaidThisMonth || 0)) : 0;
  const newSalaryRemaining = currentSalaryRemaining - (typeof salaryPaymentAmount === 'number' ? salaryPaymentAmount : 0);


  // --- Validation Logic ---
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!category) errors.category = 'Fadlan dooro nooca kharashka.';
    if (!paidFrom) errors.paidFrom = 'Akoonka lacagta laga bixiyay waa waajib.';
    if (!expenseDate) errors.expenseDate = 'Taariikhda kharashka waa waajib.';
      // Project expenseType: projectId is required
      if (expenseType === 'project' && (!selectedProject || selectedProject === '')) {
        errors.selectedProject = 'Fadlan dooro mashruuca.';
      }

    // Amount validation: only for categories that require it directly
      if (category === 'Consultancy') {
        if (typeof consultancyFee !== 'string' || isNaN(Number(consultancyFee)) || Number(consultancyFee) <= 0) {
          errors.consultancyFee = 'Qiimaha la-talin waa inuu noqdaa nambar wanaagsan.';
        }
      } else if (category === 'Equipment Rental') {
        if (!equipmentName.trim()) errors.equipmentName = 'Magaca qalabka waa waajib.';
        if (!rentalPeriod.trim()) errors.rentalPeriod = 'Muddada kirada waa waajib.';
        if (typeof rentalFee !== 'string' || isNaN(Number(rentalFee)) || Number(rentalFee) <= 0) errors.rentalFee = 'Lacagta kirada waa inuu noqdaa nambar wanaagsan.';
        if (!supplierName.trim()) errors.supplierName = 'Magaca kiriyaha waa waajib.';
        if (!selectedProject) errors.selectedProject = 'Mashruuca waa waajib.';
        if (!selectedBankAccount) errors.selectedBankAccount = 'Bank account waa waajib.';
      } else {
        const requiresCommonAmount = !['Material', 'Labor', 'Company Expense'].includes(category); 
        if (requiresCommonAmount && (typeof amount !== 'number' || amount <= 0)) {
          errors.amount = 'Qiimaha waa inuu noqdaa nambar wanaagsan.';
        }
      }

    switch (category) {
      case 'Material':
        if (materials.length === 0) { errors.materials = 'Fadlan ku dar ugu yaraan hal alaab.'; }
        materials.forEach((mat, index) => {
          if (!mat.name.trim()) errors[`materialName_${index}`] = 'Magaca alaabta waa waajib.';
          if (typeof parseFloat(mat.qty as string) !== 'number' || parseFloat(mat.qty as string) <= 0) errors[`materialQty_${index}`] = 'Quantity waa inuu noqdaa nambar wanaagsan.';
          if (typeof parseFloat(mat.price as string) !== 'number' || parseFloat(mat.price as string) <= 0) errors[`materialPrice_${index}`] = 'Qiimaha waa inuu noqdaa nambar wanaagsan.';
          if (!mat.unit) errors[`materialUnit_${index}`] = 'Unit waa waajib.'; 
        });
        break;
      case 'Labor':
        if (!employeeName.trim()) errors.employeeName = 'Magaca shaqaalaha waa waajib.';
        if (!workDescription.trim()) errors.workDescription = 'Sharaxaadda shaqada waa waajib.';
        // Wage validation: allow readonly wage from previous contract
        const selectedEmp = employees.find(emp => emp.fullName === employeeName);
        const lastContract = selectedEmp?.laborRecords?.length ? selectedEmp.laborRecords[selectedEmp.laborRecords.length - 1] : null;
        if (lastContract && lastContract.agreedWage != null) {
          // Wage is readonly and valid
        } else {
          if (typeof wage !== 'number' || wage <= 0) errors.wage = 'Mushaharku waa inuu noqdaa nambar wanaagsan.';
        }
        if (typeof laborPaidAmount !== 'number' || laborPaidAmount < 0) errors.laborPaidAmount = 'Lacagta la bixiyay waa inuu noqdaa nambar wanaagsan.';
        if (typeof laborPaidAmount === 'number' && typeof wage === 'number' && laborPaidAmount > wage) errors.laborPaidAmount = 'Lacagta la bixiyay ma dhaafi karto mushaharka.';
        break;
      case 'Transport':
        if (!transportType.trim()) errors.transportType = 'Nooca gaadiidka waa waajib.';
        break;
      case 'Company Expense':
        if (!companyExpenseType) errors.companyExpenseType = 'Nooca kharashka shirkadda waa waajib.';
        switch (companyExpenseType) { 
            case 'Salary':
                if (!selectedEmployeeForSalary) errors.selectedEmployeeForSalary = 'Fadlan dooro shaqaale.';
                if (typeof salaryPaymentAmount !== 'number' || salaryPaymentAmount <= 0) errors.salaryPaymentAmount = 'Qiimaha mushaharka waa waajib.';
                if (typeof salaryPaymentAmount === 'number' && salaryPaymentAmount > currentSalaryRemaining) errors.salaryPaymentAmount = 'Lacagta la bixiyay ma dhaafi karto lacagta hadhay.';
                break;
            case 'Office Rent':
                if (typeof amount !== 'number' || amount <= 0) errors.amount = 'Qiimaha waa waajib.';
                if (!officeRentPeriod) errors.officeRentPeriod = 'Muddada kirada waa waajib.';
                break;
            case 'Electricity':
                if (typeof amount !== 'number' || amount <= 0) errors.amount = 'Qiimaha waa waajib.';
                if (!electricityMeterReading.trim()) errors.electricityMeterReading = 'Akhriska mitirka waa waajib.';
                break;
            case 'Fuel':
                if (typeof amount !== 'number' || amount <= 0) errors.amount = 'Qiimaha waa waajib.';
                if (!fuelVehicle) errors.fuelVehicle = 'Gaariga waa waajib.';
                if (typeof fuelLiters !== 'number' || fuelLiters <= 0) errors.fuelLiters = 'Litir waa waajib.';
                break;
            case 'Marketing':
                if (typeof amount !== 'number' || amount <= 0) errors.amount = 'Qiimaha waa waajib.';
                if (!marketingCampaignName.trim()) errors.marketingCampaignName = 'Magaca ololaha waa waajib.';
                break;
            case 'Material': 
                if (materials.length === 0) { errors.materials = 'Fadlan ku dar ugu yaraan hal alaab.'; }
                materials.forEach((mat, index) => {
                    if (!mat.name.trim()) errors[`materialName_${index}`] = 'Magaca alaabta waa waajib.';
                    if (typeof parseFloat(mat.qty as string) !== 'number' || parseFloat(mat.qty as string) <= 0) errors[`materialQty_${index}`] = 'Quantity waa inuu noqdaa nambar wanaagsan.';
                    if (typeof parseFloat(mat.price as string) !== 'number' || parseFloat(mat.price as string) <= 0) errors[`materialPrice_${index}`] = 'Qiimaha waa inuu noqdaa nambar wanaagsan.';
                    if (!mat.unit) errors[`materialUnit_${index}`] = 'Unit waa waajib.';
                });
                break;
            case 'Debt': 
                if (typeof amount !== 'number' || amount <= 0) errors.amount = 'Qiimaha waa waajib.';
                if (!lenderName.trim()) errors.lenderName = 'Magaca deyn bixiyaha waa waajib.';
                if (!loanDate) errors.loanDate = 'Taariikhda deynta waa waajib.';
                break;
            case 'Debt Repayment': 
                if (typeof debtRepaymentAmount !== 'number' || debtRepaymentAmount <= 0) errors.debtRepaymentAmount = 'Qiimaha dib u bixinta waa waajib.';
                if (!selectedDebt) errors.selectedDebt = 'Fadlan dooro deyn jirta.';
                break;
            case 'Other':
                if (typeof amount !== 'number' || amount <= 0) errors.amount = 'Qiimaha waa waajib.';
                break;
        }
        break; 
      case 'Other':
        if (typeof amount !== 'number' || amount <= 0) errors.amount = 'Qiimaha waa waajib.';
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --- Handlers ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptImage(file);
      setToastMessage({ message: 'Rasiidka waxaanu u baaraynaa si aanu u buuxino foomka...', type: 'info' });
      setTimeout(() => {
        setAmount(Math.floor(Math.random() * 500) + 50); 
        setNote('Alaabta xafiiska');
        setExpenseDate('2025-07-24');
        setCategory('Company Expense');
        setCompanyExpenseType('Office Rent'); 
        setToastMessage({ message: 'Rasiidka waa la baaray foomkuna waa la buuxiyay!', type: 'success' });
      }, 1500);
    }
  };

  const handleAddMaterial = () => {
    setMaterials([...materials, { id: materials.length + 1, name: '', qty: '', price: '', unit: '' }]);
  };

  const handleRemoveMaterial = (id: number) => {
    setMaterials(materials.filter(mat => mat.id !== id));
  };

  const handleMaterialChange = (id: number, field: string, value: string | number) => {
    setMaterials(materials.map(mat => 
      mat.id === id ? { ...mat, [field]: value } : mat
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setValidationErrors({});
    setToastMessage(null);


    if (!validateForm()) {
      setLoading(false);
      setToastMessage({ message: 'Fadlan sax khaladaadka foomka.', type: 'error' });
      return;
    }

    // Build description based on category/subtype, matching backend requirements
    let description = '';
    if (category === 'Labor') {
      description = workDescription.trim();
    } else if (category === 'Material') {
      description = `Material expense - ${expenseDate}`;
    } else if (category === 'Company Expense' && companyExpenseType === 'Salary') {
      const emp = employees.find(emp => emp.id === selectedEmployeeForSalary);
      description = `Salary payment${emp ? ' for ' + emp.name : ''} - ${expenseDate}`;
    } else {
      description = '';
    }

    const expenseData: any = {
      paidFrom: category === 'Equipment Rental' && expenseType === 'project' ? selectedBankAccount : paidFrom,
      expenseDate,
      note: note.trim() === '' ? undefined : note,
      projectId: expenseType === 'project' ? selectedProject : undefined,
      category,
      description: description || undefined,
    };

    // Set main amount based on category and sub-category
    switch (category) {
      case 'Material':
        expenseData.amount = totalMaterialCost;
        expenseData.materials = materials.map(m => ({ name: m.name, qty: parseFloat(m.qty as string), price: parseFloat(m.price as string), unit: m.unit }));
        // Always send description for material expenses
        expenseData.description = description && description.trim() !== '' ? description.trim() : `Material expense - ${expenseDate}`;
        // If company expense, force projectId to null and add required fields
        if (expenseType === 'company') {
          expenseData.projectId = null;
          expenseData.category = 'Material';
          expenseData.expenseDate = expenseDate;
          expenseData.paidFrom = paidFrom;
          expenseData.note = note.trim() === '' ? undefined : note;
          // PATCH: Always set description for company material expense
          expenseData.description = description && description.trim() !== '' ? description.trim() : `Material expense - ${expenseDate}`;
        }
        break;
      case 'Labor':
        // For Labor, amount should be the paid amount (lacagta la bixiyay)
        const paidValue = Number(laborPaidAmount);
        expenseData.amount = !isNaN(paidValue) && paidValue > 0 ? paidValue : 0;
        expenseData.employeeName = employeeName;
        expenseData.workDescription = workDescription;
        expenseData.wage = wage;
        expenseData.laborPaidAmount = laborPaidAmount;
        // Add employeeId for project Labor expense
        if (expenseType === 'project') {
          const empObj = employees.find(emp => emp.fullName === employeeName);
          if (empObj && empObj.id) expenseData.employeeId = empObj.id;
        }
        // Extra validation for Labor
        if (!expenseData.amount || !expenseData.paidFrom || !expenseData.expenseDate || !expenseData.projectId || !expenseData.employeeId || !expenseData.employeeName || !expenseData.workDescription) {
          setLoading(false);
          setToastMessage({ message: 'Foomka shaqaalaha mashruuca: dhammaan xogaha waa waajib.', type: 'error' });
          console.error('Labor expense missing fields:', {
            amount: expenseData.amount,
            paidFrom: expenseData.paidFrom,
            expenseDate: expenseData.expenseDate,
            projectId: expenseData.projectId,
            employeeId: expenseData.employeeId,
            employeeName: expenseData.employeeName,
            workDescription: expenseData.workDescription
          });
          return;
        }
        break;
      case 'Transport':
        expenseData.amount = amount;
        expenseData.transportType = transportType;
        break;
      case 'Consultancy':
        expenseData.amount = consultancyFee ? Number(consultancyFee) : 0;
        expenseData.consultantName = consultantName;
        expenseData.consultancyType = consultancyType;
        expenseData.consultancyFee = consultancyFee ? Number(consultancyFee) : 0;
        break;
        case 'Equipment Rental':
          expenseData.amount = rentalFee ? Number(rentalFee) : 0;
          expenseData.equipmentName = equipmentName;
          expenseData.rentalPeriod = rentalPeriod;
          expenseData.rentalFee = rentalFee ? Number(rentalFee) : 0;
          expenseData.supplierName = supplierName;
          expenseData.projectId = selectedProject;
          expenseData.bankAccountId = selectedBankAccount;
          break;
      case 'Company Expense':
        expenseData.category = 'Company Expense';
        expenseData.companyExpenseType = companyExpenseType;
        switch (companyExpenseType) {
          case 'Salary':
            expenseData.amount = salaryPaymentAmount;
            expenseData.employeeId = selectedEmployeeForSalary;
            expenseData.subCategory = 'Salary';
            break;
          case 'Office Rent':
            expenseData.amount = amount;
            expenseData.officeRentPeriod = officeRentPeriod;
            break;
          case 'Electricity':
            expenseData.amount = amount;
            expenseData.electricityMeterReading = electricityMeterReading;
            break;
          case 'Fuel':
            expenseData.amount = amount;
            expenseData.fuelVehicle = fuelVehicle;
            expenseData.fuelLiters = fuelLiters;
            break;
          case 'Marketing':
            expenseData.amount = amount;
            expenseData.marketingCampaignName = marketingCampaignName;
            break;
          case 'Material':
            // For company Material expense, send as category: 'Material', projectId: null
            expenseData.amount = totalMaterialCost;
            expenseData.materials = materials.map(m => ({ name: m.name, qty: parseFloat(m.qty as string), price: parseFloat(m.price as string), unit: m.unit }));
            expenseData.category = 'Material';
            expenseData.projectId = null;
            // PATCH: Always set description for company material expense
            expenseData.description = description && description.trim() !== '' ? description.trim() : `Material expense - ${expenseDate}`;
            break;
          case 'Debt':
            expenseData.amount = amount;
            expenseData.subCategory = 'Debt';
            expenseData.lenderName = lenderName;
            expenseData.loanDate = loanDate;
            if (selectedDebt) expenseData.customerId = selectedDebt;
            break;
          case 'Debt Repayment':
            expenseData.amount = debtRepaymentAmount;
            expenseData.subCategory = 'Debt Repayment';
            expenseData.selectedDebt = selectedDebt;
            if (selectedDebt) expenseData.customerId = selectedDebt;
            break;
          default:
            expenseData.amount = amount;
            break;
        }
        break;
      default:
        expenseData.amount = amount;
        break;
    }

    // Handle receipt image upload if exists (requires FormData for API)
    if (receiptImage) {
      // expenseData.receiptImage = receiptImage; // Send as FormData to API
    }

    // Add debug log for Labor project expense submission
    if (category === 'Labor' && expenseType === 'project') {
      console.log('Labor Project Expense Submission:', {
        category,
        amount: expenseData.amount,
        paidFrom: expenseData.paidFrom,
        expenseDate: expenseData.expenseDate,
        projectId: expenseData.projectId,
        employeeId: expenseData.employeeId,
        employeeName: expenseData.employeeName,
        workDescription: expenseData.workDescription,
        wage: expenseData.wage,
        laborPaidAmount: expenseData.laborPaidAmount
      });
    }
    console.log('Submitting Expense Data:', expenseData);

    // --- API Integration ---
    try {
      const endpoint = expenseType === 'project' ? '/api/expenses/project' : '/api/expenses';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to record expense');
      }

      setToastMessage({ message: data.message || 'Kharashka si guul leh ayaa loo diiwaan geliyay!', type: 'success' });

      // Clear form
      setCategory(''); setAmount(''); setPaidFrom('Cash'); setExpenseDate(new Date().toISOString().split('T')[0]); setNote(''); setSelectedProject('');
      setMaterials([{ id: 1, name: '', qty: '', price: '', unit: '' }]);
      setEmployeeName(''); setWorkDescription(''); setWage(''); setLaborPaidAmount(''); setTransportType('');
      setCompanyExpenseType(''); setLenderName(''); setLoanDate(''); setDebtRepaymentAmount(''); setSelectedDebt(''); setReceiptImage(null);
      setSelectedEmployeeForSalary(''); setSalaryPaymentAmount('');
      setOfficeRentPeriod(''); setElectricityMeterReading(''); setFuelVehicle(''); setFuelLiters(''); setMarketingCampaignName('');
      setValidationErrors({});

      router.push('/expenses'); // Redirect to expenses list
    } catch (error: any) {
      console.error('Expense submission error:', error);
      setToastMessage({ message: error.message || 'Cilad ayaa dhacday marka kharashka la diiwaan gelinayay.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-darkGray dark:text-gray-100">
          <Link href="/expenses" className="text-mediumGray dark:text-gray-400 hover:text-primary transition-colors duration-200 mr-4">
            <ArrowLeft size={28} className="inline-block" />
          </Link>
          Ku Dar Kharash Cusub
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md animate-fade-in-up">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Receipt Upload & OCR Placeholder */}
          <div className="border border-dashed border-mediumGray dark:border-gray-600 rounded-lg p-6 text-center bg-lightGray dark:bg-gray-700 animate-fade-in">
            <input 
              type="file" 
              id="receiptUpload" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="hidden" 
            />
            <label htmlFor="receiptUpload" className="cursor-pointer text-primary hover:text-blue-700 font-semibold flex flex-col items-center justify-center space-y-2">
              <FileUp size={48} />
              <span className="text-lg">Dhig sawirka rasiidka halkan, ama guji si aad u soo shubto</span>
              <span className="text-sm text-mediumGray dark:text-gray-400">(Sawirka waxaanu u isticmaali doonaa OCR si aanu si toos ah u buuxino foomka)</span>
            </label>
            {receiptImage && (
              <p className="mt-3 text-sm text-darkGray dark:text-gray-100">Shubay: {receiptImage.name}</p>
            )}
          </div>

          {/* Expense Type Toggle Buttons */}
          <div className="flex space-x-3 mb-6">
            <button
              type="button"
              className={`flex items-center px-6 py-2 rounded-lg font-bold text-lg border transition-colors duration-200 ${expenseType === 'project' ? 'bg-primary text-white border-primary' : 'bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 border-lightGray dark:border-gray-700'}`}
              onClick={() => { setExpenseType('project'); setCategory(''); setCompanyExpenseType(''); }}
            >
              <Briefcase className="mr-2" size={20} /> project-Exp
            </button>
            <button
              type="button"
              className={`flex items-center px-6 py-2 rounded-lg font-bold text-lg border transition-colors duration-200 ${expenseType === 'company' ? 'bg-primary text-white border-primary' : 'bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 border-lightGray dark:border-gray-700'}`}
              onClick={() => { setExpenseType('company'); setCategory(''); setCompanyExpenseType(''); }}
            >
              <Building className="mr-2" size={20} /> Company-Exp
            </button>
          </div>
          {/* Expense Category Select (depends on expenseType) */}
          <div>
            {expenseType === 'company' && (
              <select
                className="w-full p-3 border border-lightGray dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 mb-4"
                value={companyExpenseType}
                onChange={e => {
                  setCompanyExpenseType(e.target.value);
                  setCategory(e.target.value ? 'Company Expense' : '');
                }}
                title="Dooro Nooca Kharashka Shirkadda"
              >
                {companyExpenseCategories.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
            {expenseType === 'project' && (
              <select
                className="w-full p-3 border border-lightGray dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 mb-4"
                value={category}
                onChange={e => setCategory(e.target.value)}
                title="Dooro Nooca Kharashka Mashruuca"
              >
                {projectExpenseCategories.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
          </div>




          {/* Dynamic Fields based on Category */}
          {expenseType === 'project' && category === 'Consultancy' && (
            <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 animate-fade-in">
              <h3 className="text-lg font-bold text-primary dark:text-blue-300 mb-2">Faahfaahinta La-talin Mashruuca</h3>
              <div className="mb-4">
                <label htmlFor="consultantName" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Magaca La-taliyaha <span className="text-redError">*</span></label>
                <input
                  type="text"
                  id="consultantName"
                  value={consultantName}
                  onChange={e => setConsultantName(e.target.value)}
                  placeholder="Tusaale: Dr. Ahmed"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="consultancyType" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Nooca La-talin <span className="text-redError">*</span></label>
                <input
                  type="text"
                  id="consultancyType"
                  value={consultancyType}
                  onChange={e => setConsultancyType(e.target.value)}
                  placeholder="Tusaale: Injineernimo, Maamul, iwm"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="consultancyFee" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Lacagta La-talin ($) <span className="text-redError">*</span></label>
                <input
                  type="number"
                  id="consultancyFee"
                  value={consultancyFee}
                  onChange={e => setConsultancyFee(e.target.value)}
                  placeholder="Tusaale: 500"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="selectedProject" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Mashruuca La Xiriira *</label>
                <select
                  id="selectedProject"
                  value={selectedProject}
                  onChange={e => setSelectedProject(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">-- No Project --</option>
                  {projects.map(proj => (
                    <option key={proj.id} value={proj.id}>{proj.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="paidFrom" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Akoonka Laga Jarayo *</label>
                <select
                  id="paidFrom"
                  value={paidFrom}
                  onChange={e => setPaidFrom(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">-- Dooro Akoonka --</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {category === 'Material' && (
            <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 animate-fade-in">
              <h3 className="text-lg font-bold text-primary dark:text-blue-300 mb-4">Faahfaahinta Alaabta</h3>
              {/* Project select */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Mashruuca la xariira</label>
                <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="input input-bordered w-full" required title="Dooro Mashruuca">
                  <option value="">Dooro Mashruuca</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              {/* Account select */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Akoonka lacagta laga jarayo</label>
                <select value={paidFrom} onChange={e => setPaidFrom(e.target.value)} className="input input-bordered w-full" required title="Dooro Akoonka">
                  <option value="">Dooro Akoonka</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              {/* Material Item Headers */}
              <div className="grid grid-cols-4 gap-4 mb-2 text-sm font-semibold text-mediumGray dark:text-gray-400">
                <span>Magaca Alaabta</span>
                <span>Quantity</span>
                <span>Qiimaha Unit ($)</span>
                <span>Unit</span>
              </div>
              {materials.map((material, index) => (
                <div key={material.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-3 rounded-lg bg-white dark:bg-gray-700 border border-lightGray dark:border-gray-600 relative">
                  {materials.length > 1 && (
                    <button type="button" title="Tirtir Alaab" onClick={() => handleRemoveMaterial(material.id)} className="absolute top-2 right-2 text-redError hover:text-red-700 transition-colors">
                      <MinusCircle size={20} />
                    </button>
                  )}
                  <div>
                    <label htmlFor={`materialName_${material.id}`} className="sr-only">Magaca Alaabta</label>
                    <input type="text" id={`materialName_${material.id}`} value={material.name} onChange={(e) => handleMaterialChange(material.id, 'name', e.target.value)} placeholder="Oak Wood" className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors[`materialName_${index}`] ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}/>
                    {validationErrors[`materialName_${index}`] && <p className="text-redError text-xs mt-1"><Info size={14} className="inline mr-1"/>{validationErrors[`materialName_${index}`]}</p>}
                  </div>
                  <div>
                    <label htmlFor={`materialQty_${material.id}`} className="sr-only">Quantity</label>
                    <input type="number" id={`materialQty_${material.id}`} value={material.qty} onChange={(e) => handleMaterialChange(material.id, 'qty', e.target.value)} placeholder="20" className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors[`materialQty_${index}`] ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}/>
                    {validationErrors[`materialQty_${index}`] && <p className="text-redError text-xs mt-1"><Info size={14} className="inline mr-1"/>{validationErrors[`materialQty_${index}`]}</p>}
                  </div>
                  <div>
                    <label htmlFor={`materialPrice_${material.id}`} className="sr-only">Qiimaha Unit</label>
                    <input type="number" id={`materialPrice_${material.id}`} value={material.price} onChange={(e) => handleMaterialChange(material.id, 'price', e.target.value)} placeholder="15.00" className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors[`materialPrice_${index}`] ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}/>
                    {validationErrors[`materialPrice_${index}`] && <p className="text-redError text-xs mt-1"><Info size={14} className="inline mr-1"/>{validationErrors[`materialPrice_${index}`]}</p>}
                  </div>
                  <div>
                    <label htmlFor={`materialUnit_${material.id}`} className="sr-only">Unit</label>
                    <select id={`materialUnit_${material.id}`} value={material.unit} onChange={(e) => handleMaterialChange(material.id, 'unit', e.target.value)} className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary appearance-none ${validationErrors[`materialUnit_${index}`] ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}>
                      <option value="">Unit</option>
                      {materialUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                    {validationErrors[`materialUnit_${index}`] && <p className="text-redError text-xs mt-1"><Info size={14} className="inline mr-1"/>{validationErrors[`materialUnit_${index}`]}</p>}
                  </div>
                  <div className="col-span-full flex items-center justify-between mt-auto pt-2 border-t border-lightGray dark:border-gray-600">
                    <span className="text-sm font-semibold text-mediumGray dark:text-gray-400">Total for this item:</span>
                    <span className="text-lg font-bold text-darkGray dark:text-gray-100">${((parseFloat(material.qty as string) || 0) * (parseFloat(material.price as string) || 0)).toLocaleString()}</span>
                  </div>
                </div>
              ))}
              <button type="button" onClick={handleAddMaterial} className="bg-primary/10 text-primary py-2 px-4 rounded-lg font-semibold flex items-center hover:bg-primary hover:text-white transition-colors duration-200">
                <Plus size={18} className="mr-2"/> Ku Dar Alaab Kale
              </button>
              {validationErrors.materials && <p className="text-redError text-sm mt-1 flex items-center"><Info size={16} className="mr-1"/>{validationErrors.materials}</p>}
              <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg flex justify-between items-center mt-4">
                  <span className="text-lg font-semibold text-primary dark:text-blue-300">Wadarta Qiimaha Alaabta:</span>
                  <span className="text-2xl font-extrabold text-primary dark:text-blue-300">${totalMaterialCost.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Project Expense: Add new categories and forms */}
          {expenseType === 'project' && category === 'Transport' && (
            <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 animate-fade-in">
              <h3 className="text-lg font-bold text-primary dark:text-blue-300 mb-2">Faahfaahinta Transport-ka Mashruuca</h3>
              <div className="mb-4">
                <label htmlFor="transportType" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Nooca Gaadiidka *</label>
                <input
                  type="text"
                  id="transportType"
                  value={transportType}
                  onChange={e => setTransportType(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tusaale: Delivery Truck"
                  required
                />
                {validationErrors.transportType && (
                  <span className="text-red-500 text-sm">{validationErrors.transportType}</span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Qiimaha ($) *</label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tusaale: 100.00"
                  required
                />
                {validationErrors.amount && (
                  <span className="text-red-500 text-sm">{validationErrors.amount}</span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="paidFrom" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Akoonka Laga Jarayo *</label>
                <select
                  id="paidFrom"
                  value={paidFrom}
                  onChange={e => setPaidFrom(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">-- Dooro Akoonka --</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
                {validationErrors.paidFrom && (
                  <span className="text-red-500 text-sm">{validationErrors.paidFrom}</span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="expenseDate" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Taariikhda Kharashka *</label>
                <input
                  type="date"
                  id="expenseDate"
                  value={expenseDate}
                  onChange={e => setExpenseDate(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                {validationErrors.expenseDate && (
                  <span className="text-red-500 text-sm">{validationErrors.expenseDate}</span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="selectedProject" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Mashruuca La Xiriira (Optional)</label>
                <select
                  id="selectedProject"
                  value={selectedProject}
                  onChange={e => setSelectedProject(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- No Project --</option>
                  {projects.map(proj => (
                    <option key={proj.id} value={proj.id}>{proj.name}</option>
                  ))}
                </select>
                {validationErrors.selectedProject && (
                  <span className="text-red-500 text-sm">{validationErrors.selectedProject}</span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="note" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Fiiro Gaar Ah (Optional)</label>
                <textarea
                  id="note"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Wixi faahfaahin dheeraad ah ee kharashka..."
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Project Expense: Add new categories (example: Equipment, Subcontract, Miscellaneous) */}
          {category === 'Equipment' && (
            <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 animate-fade-in">
              <h3 className="text-lg font-bold text-primary dark:text-blue-300 mb-2">Faahfaahinta Qalabka</h3>
              <div>
                <label htmlFor="equipmentName" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Magaca Qalabka <span className="text-redError">*</span></label>
                <input
                  type="text"
                  id="equipmentName"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Tusaale: Generator"
                  className="w-full p-3 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100"
                />
              </div>
            </div>
          )}
          {category === 'Subcontract' && (
            <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 animate-fade-in">
              <h3 className="text-lg font-bold text-primary dark:text-blue-300 mb-2">Faahfaahinta Qandaraaslaha</h3>
              <div>
                <label htmlFor="subcontractorName" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Magaca Qandaraaslaha <span className="text-redError">*</span></label>
                <input
                  type="text"
                  id="subcontractorName"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Tusaale: ABC Construction"
                  className="w-full p-3 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100"
                />
              </div>
            </div>
          )}
          {category === 'Miscellaneous' && (
            <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 animate-fade-in">
              <h3 className="text-lg font-bold text-primary dark:text-blue-300 mb-2">Faahfaahinta Kharashyada Kale</h3>
              <div>
                <label htmlFor="miscNote" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Faahfaahin <span className="text-redError">*</span></label>
                <input
                  type="text"
                  id="miscNote"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Tusaale: Kharash kale oo aan kor ku xusin"
                  className="w-full p-3 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100"
                />
              </div>
            </div>
          )}

          {category === 'Labor' && (
            <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 animate-fade-in">
              <h3 className="text-lg font-bold text-primary dark:text-blue-300 mb-4">Faahfaahinta Shaqaalaha (Mashruuc)</h3>
              <div className="mb-4">
                <label htmlFor="employeeName" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Magaca Shaqaalaha <span className="text-redError">*</span></label>
                <select
                  id="employeeName"
                  value={employeeName}
                  onChange={e => setEmployeeName(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">-- Dooro Shaqaale --</option>
                  {employees.map(emp => (
                    <option key={emp.fullName || emp.name || emp.id} value={emp.fullName || emp.name}>{emp.fullName || emp.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="workDescription" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Sharaxaadda Shaqada <span className="text-redError">*</span></label>
                <input
                  type="text"
                  id="workDescription"
                  value={workDescription}
                  onChange={e => setWorkDescription(e.target.value)}
                  placeholder="Tusaale: Dhismaha, Nadiifinta, iwm"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="wage" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Mushaharka La Ogolaaday ($) <span className="text-redError">*</span></label>
                <input
                  type="number"
                  id="wage"
                  value={wage}
                  onChange={e => setWage(Number(e.target.value))}
                  placeholder="Tusaale: 500"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="laborPaidAmount" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Lacagta La Bixiyay ($) <span className="text-redError">*</span></label>
                <input
                  type="number"
                  id="laborPaidAmount"
                  value={laborPaidAmount}
                  onChange={e => setLaborPaidAmount(Number(e.target.value))}
                  placeholder="Tusaale: 300"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="paidFrom_labor" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Akoonka Laga Jarayo <span className="text-redError">*</span></label>
                <select
                  id="paidFrom_labor"
                  value={paidFrom}
                  onChange={e => setPaidFrom(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">-- Dooro Akoonka --</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="expenseDate_labor" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Taariikhda Kharashka <span className="text-redError">*</span></label>
                <input
                  type="date"
                  id="expenseDate_labor"
                  value={expenseDate}
                  onChange={e => setExpenseDate(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
          )}

          {category === 'Equipment Rental' && expenseType === 'project' && (
            <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 animate-fade-in">
              <h3 className="text-lg font-bold text-primary dark:text-blue-300 mb-2">Faahfaahinta Kirada Qalabka</h3>
              <div>
                <label className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Magaca Qalabka <span className="text-redError">*</span></label>
                <input type="text" value={equipmentName} onChange={e => setEquipmentName(e.target.value)} className="w-full p-3 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100" required placeholder="Magaca Qalabka" title="Magaca Qalabka" />
              </div>
              <div>
                <label className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Muddada Kirada <span className="text-redError">*</span></label>
                <input type="text" value={rentalPeriod} onChange={e => setRentalPeriod(e.target.value)} className="w-full p-3 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100" required placeholder="Muddada Kirada" title="Muddada Kirada" />
              </div>
              <div>
                <label className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Lacagta Kirada <span className="text-redError">*</span></label>
                <input type="number" value={rentalFee} onChange={e => setRentalFee(e.target.value)} className="w-full p-3 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100" required placeholder="Lacagta Kirada" title="Lacagta Kirada" />
              </div>
              <div>
                <label className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Magaca Kiriyaha <span className="text-redError">*</span></label>
                <input type="text" value={supplierName} onChange={e => setSupplierName(e.target.value)} className="w-full p-3 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100" required placeholder="Magaca Kiriyaha" title="Magaca Kiriyaha" />
              </div>
              <div>
                <label className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Mashruuca loo kireeyay <span className="text-redError">*</span></label>
                <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="w-full p-3 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100" required title="Dooro Mashruuca">
                  <option value="">Dooro Mashruuca</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Bankiga laga jari doono <span className="text-redError">*</span></label>
                <select value={selectedBankAccount} onChange={e => setSelectedBankAccount(e.target.value)} className="w-full p-3 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100" required title="Dooro Bank Account">
                  <option value="">Dooro Bank Account</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Transport form only shown for project expenses, not duplicated */}

          {category === 'Company Expense' && (
            <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 animate-fade-in">
              <h3 className="text-lg font-bold text-primary dark:text-blue-300 mb-2">Faahfaahinta Kharashka Shirkadda</h3>
              <div>
                <label htmlFor="companyExpenseType" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Nooca Kharashka Shirkadda <span className="text-redError">*</span></label>
                <select
                  id="companyExpenseType"
                  required
                  value={companyExpenseType}
                  onChange={(e) => setCompanyExpenseType(e.target.value)}
                  className={`w-full p-3 border rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ${validationErrors.companyExpenseType ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                >
                  <option value="">-- Dooro Nooca Kharashka Shirkadda --</option>
                  {companyExpenseCategories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                </select>
                {validationErrors.companyExpenseType && <p className="text-redError text-sm mt-1 flex items-center"><Info size={16} className="mr-1"/>{validationErrors.companyExpenseType}</p>}
              </div>

              {/* NEW: Salary Specific Fields */}
              {companyExpenseType === 'Salary' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-3 border border-dashed border-primary/30 rounded-lg bg-primary/5 animate-fade-in">
                    <h4 className="col-span-full text-base font-bold text-primary dark:text-blue-300 mb-2">Faahfaahinta Mushaharka</h4>
                    {/* PaidFrom field inside Salary */}
                    <div className="md:col-span-2">
                      <label htmlFor="paidFrom_salary" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Akoonka Laga Jarayo <span className="text-redError">*</span></label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={18} />
                        <select
                          id="paidFrom_salary"
                          required
                          value={paidFrom}
                          onChange={(e) => setPaidFrom(e.target.value)}
                          className={`w-full p-2 pl-8 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ${validationErrors.paidFrom ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        >
                          <option value="">-- Dooro Akoonka --</option>
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name} {acc.balance !== undefined ? `($${Number(acc.balance).toLocaleString()})` : ''}</option>
                          ))}
                        </select>
                        <ChevronRight className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400 transform rotate-90" size={18} />
                      </div>
                      {validationErrors.paidFrom && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.paidFrom}</p>}
                    </div>
                    <div>
                        <label htmlFor="selectedEmployeeForSalary" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Dooro Shaqaale <span className="text-redError">*</span></label>
                        <select
                            id="selectedEmployeeForSalary"
                            required
                            value={selectedEmployeeForSalary}
                            onChange={(e) => setSelectedEmployeeForSalary(e.target.value)}
                            className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary appearance-none ${validationErrors.selectedEmployeeForSalary ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        >
                            <option value="">-- Dooro Shaqaale --</option>
                            {employees.map(emp => (
                              <option key={emp.id} value={emp.id}>{emp.fullName || emp.name}</option>
                            ))}
                        </select>
                        {validationErrors.selectedEmployeeForSalary && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.selectedEmployeeForSalary}</p>}
                    </div>
                    <div>
                        <label htmlFor="salaryPaymentAmount" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Lacagta La Bixinayo ($) <span className="text-redError">*</span></label>
                        <input
                            type="number"
                            id="salaryPaymentAmount"
                            required
                            value={salaryPaymentAmount}
                            onChange={(e) => setSalaryPaymentAmount(parseFloat(e.target.value) || '')}
                            placeholder="Tusaale: 500"
                            className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors.salaryPaymentAmount ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        />
                        {validationErrors.salaryPaymentAmount && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.salaryPaymentAmount}</p>}
                    </div>
                    {selectedEmployeeData && (
                        <div className="col-span-full p-2 bg-primary/10 dark:bg-primary/20 rounded-lg flex justify-between items-center text-sm font-semibold">
                            <span className="text-primary dark:text-blue-300">Mushaharka Bisha: ${selectedEmployeeData.monthlySalary?.toLocaleString()}</span>
                            <span className="text-primary dark:text-blue-300">Hore La Bixiyay: ${((selectedEmployeeData.paidThisMonth || selectedEmployeeData.salaryPaidThisMonth || 0).toLocaleString())}</span>
                            <span className="text-primary dark:text-blue-300">Hada Hadhay: ${(newSalaryRemaining).toLocaleString()}</span>
                        </div>
                    )}
                </div>
              )}

              {/* NEW: Office Rent Specific Fields */}
              {companyExpenseType === 'Office Rent' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-3 border border-dashed border-primary/30 rounded-lg bg-primary/5 animate-fade-in">
                    <h4 className="col-span-full text-base font-bold text-primary dark:text-blue-300 mb-2">Faahfaahinta Kirada Xafiiska</h4>
                    {/* PaidFrom field inside Office Rent */}
                    <div className="md:col-span-2">
                      <label htmlFor="paidFrom_officerent" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Akoonka Laga Jarayo <span className="text-redError">*</span></label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={18} />
                        <select
                          id="paidFrom_officerent"
                          required
                          value={paidFrom}
                          onChange={(e) => setPaidFrom(e.target.value)}
                          className={`w-full p-2 pl-8 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ${validationErrors.paidFrom ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        >
                          <option value="">-- Dooro Akoonka --</option>
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name} {acc.balance !== undefined ? `($${Number(acc.balance).toLocaleString()})` : ''}</option>
                          ))}
                        </select>
                        <ChevronRight className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400 transform rotate-90" size={18} />
                      </div>
                      {validationErrors.paidFrom && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.paidFrom}</p>}
                    </div>
                    <div>
                        <label htmlFor="officeRentAmount" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Qiimaha Kirada ($) <span className="text-redError">*</span></label>
                        <input
                            type="number"
                            id="officeRentAmount"
                            required
                            value={amount} // Re-use common amount
                            onChange={(e) => setAmount(parseFloat(e.target.value) || '')}
                            placeholder="Tusaale: 1500"
                            className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors.amount ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        />
                        {validationErrors.amount && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.amount}</p>}
                    </div>
                    <div>
                        <label htmlFor="officeRentPeriod" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Muddada Kirada <span className="text-redError">*</span></label>
                        <select
                            id="officeRentPeriod"
                            required
                            value={officeRentPeriod}
                            onChange={(e) => setOfficeRentPeriod(e.target.value)}
                            className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary appearance-none ${validationErrors.officeRentPeriod ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        >
                            <option value="">-- Dooro Muddada --</option>
                            {officeRentPeriods.map(period => <option key={period} value={period}>{period}</option>)}
                        </select>
                        {validationErrors.officeRentPeriod && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.officeRentPeriod}</p>}
                    </div>
                </div>
              )}

              {/* NEW: Electricity Specific Fields */}
              {companyExpenseType === 'Electricity' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-3 border border-dashed border-primary/30 rounded-lg bg-primary/5 animate-fade-in">
                    <h4 className="col-span-full text-base font-bold text-primary dark:text-blue-300 mb-2">Faahfaahinta Korontada</h4>
                    {/* PaidFrom field inside Electricity */}
                    <div className="md:col-span-2">
                      <label htmlFor="paidFrom_electricity" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Akoonka Laga Jarayo <span className="text-redError">*</span></label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={18} />
                        <select
                          id="paidFrom_electricity"
                          required
                          value={paidFrom}
                          onChange={(e) => setPaidFrom(e.target.value)}
                          className={`w-full p-2 pl-8 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ${validationErrors.paidFrom ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        >
                          <option value="">-- Dooro Akoonka --</option>
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name} {acc.balance !== undefined ? `($${Number(acc.balance).toLocaleString()})` : ''}</option>
                          ))}
                        </select>
                        <ChevronRight className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400 transform rotate-90" size={18} />
                      </div>
                      {validationErrors.paidFrom && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.paidFrom}</p>}
                    </div>
                    <div>
                        <label htmlFor="electricityAmount" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Qiimaha Korontada ($) <span className="text-redError">*</span></label>
                        <input
                            type="number"
                            id="electricityAmount"
                            required
                            value={amount} // Re-use common amount
                            onChange={(e) => setAmount(parseFloat(e.target.value) || '')}
                            placeholder="Tusaale: 250"
                            className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors.amount ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        />
                        {validationErrors.amount && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.amount}</p>}
                    </div>
                    <div>
                        <label htmlFor="electricityMeterReading" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Akhriska Mitirka <span className="text-redError">*</span></label>
                        <input
                            type="text"
                            id="electricityMeterReading"
                            required
                            value={electricityMeterReading}
                            onChange={(e) => setElectricityMeterReading(e.target.value)}
                            placeholder="Tusaale: 12345 (Current Reading)"
                            className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors.electricityMeterReading ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        />
                        {validationErrors.electricityMeterReading && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.electricityMeterReading}</p>}
                    </div>
                </div>
              )}

              {/* NEW: Fuel Specific Fields */}
              {companyExpenseType === 'Fuel' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-3 border border-dashed border-primary/30 rounded-lg bg-primary/5 animate-fade-in">
                    <h4 className="col-span-full text-base font-bold text-primary dark:text-blue-300 mb-2">Faahfaahinta Shidaalka</h4>
                    {/* PaidFrom field inside Fuel */}
                    <div className="md:col-span-2">
                      <label htmlFor="paidFrom_fuel" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Akoonka Laga Jarayo <span className="text-redError">*</span></label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={18} />
                        <select
                          id="paidFrom_fuel"
                          required
                          value={paidFrom}
                          onChange={(e) => setPaidFrom(e.target.value)}
                          className={`w-full p-2 pl-8 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ${validationErrors.paidFrom ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        >
                          <option value="">-- Dooro Akoonka --</option>
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name} {acc.balance !== undefined ? `($${Number(acc.balance).toLocaleString()})` : ''}</option>
                          ))}
                        </select>
                        <ChevronRight className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400 transform rotate-90" size={18} />
                      </div>
                      {validationErrors.paidFrom && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.paidFrom}</p>}
                    </div>
                    <div>
                        <label htmlFor="fuelVehicle" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Gaariga <span className="text-redError">*</span></label>
                        <select
                            id="fuelVehicle"
                            required
                            value={fuelVehicle}
                            onChange={(e) => setFuelVehicle(e.target.value)}
                            className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary appearance-none ${validationErrors.fuelVehicle ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        >
                            <option value="">-- Dooro Gaariga --</option>
                            {/* If you have vehicles in API, map here */}
                        </select>
                        {validationErrors.fuelVehicle && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.fuelVehicle}</p>}
                    </div>
                    <div>
                        <label htmlFor="fuelLiters" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Litir <span className="text-redError">*</span></label>
                        <input
                            type="number"
                            id="fuelLiters"
                            required
                            value={fuelLiters}
                            onChange={(e) => setFuelLiters(parseFloat(e.target.value) || '')}
                            placeholder="Tusaale: 40"
                            className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors.fuelLiters ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        />
                        {validationErrors.fuelLiters && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.fuelLiters}</p>}
                    </div>
                    <div>
                        <label htmlFor="fuelAmount" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Qiimaha Shidaalka ($) <span className="text-redError">*</span></label>
                        <input
                            type="number"
                            id="fuelAmount"
                            required
                            value={amount} // Re-use common amount
                            onChange={(e) => setAmount(parseFloat(e.target.value) || '')}
                            placeholder="Tusaale: 500"
                            className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors.amount ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        />
                        {validationErrors.amount && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.amount}</p>}
                    </div>
                </div>
              )}

              {/* NEW: Marketing Specific Fields */}
              {companyExpenseType === 'Marketing' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-3 border border-dashed border-primary/30 rounded-lg bg-primary/5 animate-fade-in">
                    <h4 className="col-span-full text-base font-bold text-primary dark:text-blue-300 mb-2">Faahfaahinta Suuqgeynta</h4>
                    {/* PaidFrom field inside Marketing */}
                    <div className="md:col-span-2">
                      <label htmlFor="paidFrom_marketing" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Akoonka Laga Jarayo <span className="text-redError">*</span></label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={18} />
                        <select
                          id="paidFrom_marketing"
                          required
                          value={paidFrom}
                          onChange={(e) => setPaidFrom(e.target.value)}
                          className={`w-full p-2 pl-8 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ${validationErrors.paidFrom ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        >
                          <option value="">-- Dooro Akoonka --</option>
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name} {acc.balance !== undefined ? `($${Number(acc.balance).toLocaleString()})` : ''}</option>
                          ))}
                        </select>
                        <ChevronRight className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400 transform rotate-90" size={18} />
                      </div>
                      {validationErrors.paidFrom && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.paidFrom}</p>}
                    </div>
                    <div>
                        <label htmlFor="marketingCampaignName" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Magaca Ololaha <span className="text-redError">*</span></label>
                        <input
                            type="text"
                            id="marketingCampaignName"
                            required
                            value={marketingCampaignName}
                            onChange={(e) => setMarketingCampaignName(e.target.value)}
                            placeholder="Tusaale: Summer Sale Campaign"
                            className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors.marketingCampaignName ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        />
                        {validationErrors.marketingCampaignName && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.marketingCampaignName}</p>}
                    </div>
                    <div>
                        <label htmlFor="marketingAmount" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Qiimaha Ololaha ($) <span className="text-redError">*</span></label>
                        <input
                            type="number"
                            id="marketingAmount"
                            required
                            value={amount} // Re-use common amount
                            onChange={(e) => setAmount(parseFloat(e.target.value) || '')}
                            placeholder="Tusaale: 1000"
                            className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors.amount ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        />
                        {validationErrors.amount && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.amount}</p>}
                    </div>
                </div>
              )}

              {/* NEW: Material under Company Expense */}
              {companyExpenseType === 'Material' && (
                <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 animate-fade-in">
                  <h3 className="text-lg font-bold text-primary dark:text-blue-300 mb-4">Faahfaahinta Alaabta (Kharashka Shirkadda)</h3>
                  {/* Sharaxaad (Description) field */}
                  <div className="mb-4">
                    <label htmlFor="description_material" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Sharaxaad <span className="text-redError">*</span></label>
                    <input
                      type="text"
                      id="description_material"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Tusaale: Kharashka alaabta shirkadda ee {expenseDate}"
                      className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors.description ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                      required
                    />
                    {validationErrors.description && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.description}</p>}
                  </div>
                  {/* PaidFrom field inside Material (Company Expense) */}
                  <div className="mb-4">
                    <label htmlFor="paidFrom_material" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Akoonka Laga Jarayo <span className="text-redError">*</span></label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={18} />
                      <select
                        id="paidFrom_material"
                        required
                        value={paidFrom}
                        onChange={(e) => setPaidFrom(e.target.value)}
                        className={`w-full p-2 pl-8 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ${validationErrors.paidFrom ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                      >
                        <option value="">-- Dooro Akoonka --</option>
                        {accounts.map(acc => (
                          <option key={acc.id} value={acc.id}>{acc.name} {acc.balance !== undefined ? `($${Number(acc.balance).toLocaleString()})` : ''}</option>
                        ))}
                      </select>
                      <ChevronRight className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400 transform rotate-90" size={18} />
                    </div>
                    {validationErrors.paidFrom && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.paidFrom}</p>}
                  </div>
                  {/* Material Item Headers */}
                  <div className="grid grid-cols-4 gap-4 mb-2 text-sm font-semibold text-mediumGray dark:text-gray-400">
                    <span>Magaca Alaabta</span>
                    <span>Quantity</span>
                    <span>Qiimaha Unit ($)</span>
                    <span>Unit</span>
                  </div>
                  {materials.map((material, index) => (
                    <div key={material.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-3 rounded-lg bg-white dark:bg-gray-700 border border-lightGray dark:border-gray-600 relative">
                      {/* Remove button for multiple items */}
                      {materials.length > 1 && (
                        <button type="button" title="Tirtir Alaab" onClick={() => handleRemoveMaterial(material.id)} className="absolute top-2 right-2 text-redError hover:text-red-700 transition-colors">
                          <MinusCircle size={20} />
                        </button>
                      )}
                      {/* Material Name */}
                      <div>
                        <label htmlFor={`materialName_comp_${material.id}`} className="sr-only">Magaca Alaabta</label>
                        <input type="text" id={`materialName_comp_${material.id}`} value={material.name} onChange={(e) => handleMaterialChange(material.id, 'name', e.target.value)} placeholder="Oak Wood" className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors[`materialName_${index}`] ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}/>
                        {validationErrors[`materialName_${index}`] && <p className="text-redError text-xs mt-1"><Info size={14} className="inline mr-1"/>{validationErrors[`materialName_${index}`]}</p>}
                      </div>
                      {/* Quantity */}
                      <div>
                        <label htmlFor={`materialQty_comp_${material.id}`} className="sr-only">Quantity</label>
                        <input type="number" id={`materialQty_comp_${material.id}`} value={material.qty} onChange={(e) => handleMaterialChange(material.id, 'qty', e.target.value)} placeholder="20" className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors[`materialQty_${index}`] ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}/>
                        {validationErrors[`materialQty_${index}`] && <p className="text-redError text-xs mt-1"><Info size={14} className="inline mr-1"/>{validationErrors[`materialQty_${index}`]}</p>}
                      </div>
                      {/* Price per Unit */}
                      <div>
                        <label htmlFor={`materialPrice_comp_${material.id}`} className="sr-only">Qiimaha Unit</label>
                        <input type="number" id={`materialPrice_comp_${material.id}`} value={material.price} onChange={(e) => handleMaterialChange(material.id, 'price', e.target.value)} placeholder="15.00" className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors[`materialPrice_${index}`] ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}/>
                        {validationErrors[`materialPrice_${index}`] && <p className="text-redError text-xs mt-1"><Info size={14} className="inline mr-1"/>{validationErrors[`materialPrice_${index}`]}</p>}
                      </div>
                      {/* Unit Selection */}
                      <div>
                        <label htmlFor={`materialUnit_comp_${material.id}`} className="sr-only">Unit</label>
                        <select id={`materialUnit_comp_${material.id}`} value={material.unit} onChange={(e) => handleMaterialChange(material.id, 'unit', e.target.value)} className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary appearance-none ${validationErrors[`materialUnit_${index}`] ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}>
                          <option value="">Unit</option>
                          {materialUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                        </select>
                        {validationErrors[`materialUnit_${index}`] && <p className="text-redError text-xs mt-1"><Info size={14} className="inline mr-1"/>{validationErrors[`materialUnit_${index}`]}</p>}
                      </div>
                      {/* Total for this item */}
                      <div className="col-span-full flex items-center justify-between mt-auto pt-2 border-t border-lightGray dark:border-gray-600">
                        <span className="text-sm font-semibold text-mediumGray dark:text-gray-400">Total for this item:</span>
                        <span className="text-lg font-bold text-darkGray dark:text-gray-100">${((parseFloat(material.qty as string) || 0) * (parseFloat(material.price as string) || 0)).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={handleAddMaterial} className="bg-primary/10 text-primary py-2 px-4 rounded-lg font-semibold flex items-center hover:bg-primary hover:text-white transition-colors duration-200">
                    <Plus size={18} className="mr-2"/> Ku Dar Alaab Kale
                  </button>
                  {validationErrors.materials && <p className="text-redError text-sm mt-1 flex items-center"><Info size={16} className="mr-1"/>{validationErrors.materials}</p>}
                  <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg flex justify-between items-center mt-4">
                      <span className="text-lg font-semibold text-primary dark:text-blue-300">Wadarta Qiimaha Alaabta:</span>
                      <span className="text-2xl font-extrabold text-primary dark:text-blue-300">${totalMaterialCost.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* NEW: Debt Specific Fields (Moved from Top-Level) */}
              {companyExpenseType === 'Debt' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-3 border border-dashed border-primary/30 rounded-lg bg-primary/5 animate-fade-in">
                    <h4 className="col-span-full text-base font-bold text-primary dark:text-blue-300 mb-2">Faahfaahinta Deynta (La Qaatay)</h4>
                    {/* PaidFrom field inside Debt */}
                    <div className="md:col-span-2">
                      <label htmlFor="paidFrom_debt" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Akoonka Laga Jarayo <span className="text-redError">*</span></label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={18} />
                        <select
                          id="paidFrom_debt"
                          required
                          value={paidFrom}
                          onChange={(e) => setPaidFrom(e.target.value)}
                          className={`w-full p-2 pl-8 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ${validationErrors.paidFrom ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        >
                          <option value="">-- Dooro Akoonka --</option>
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name} {acc.balance !== undefined ? `($${Number(acc.balance).toLocaleString()})` : ''}</option>
                          ))}
                        </select>
                        <ChevronRight className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400 transform rotate-90" size={18} />
                      </div>
                      {validationErrors.paidFrom && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.paidFrom}</p>}
                    </div>
                    <div>
                        <label htmlFor="lenderName" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Magaca Deynta Bixiyaha <span className="text-redError">*</span></label>
                        <input type="text" id="lenderName" required value={lenderName} onChange={(e) => setLenderName(e.target.value)} placeholder="Tusaale: Bank X" className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors.lenderName ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}/>
                        {validationErrors.lenderName && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.lenderName}</p>}
                    </div>
                    <div>
                        <label htmlFor="loanDate" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Taariikhda Deynta <span className="text-redError">*</span></label>
                        <input type="date" id="loanDate" required value={loanDate} onChange={(e) => setLoanDate(e.target.value)} className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors.loanDate ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}/>
                        {validationErrors.loanDate && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.loanDate}</p>}
                    </div>
                    <div>
                        <label htmlFor="debtAmount" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Qiimaha Deynta ($) <span className="text-redError">*</span></label>
                        <input
                            type="number"
                            id="debtAmount"
                            required
                            value={amount} // Re-use common amount
                            onChange={(e) => setAmount(parseFloat(e.target.value) || '')}
                            placeholder="Tusaale: 5000"
                            className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors.amount ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        />
                        {validationErrors.amount && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.amount}</p>}
                    </div>
                </div>
              )}

              {/* NEW: Debt Repayment Specific Fields (Moved from Top-Level) */}
              {companyExpenseType === 'Debt Repayment' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-3 border border-dashed border-primary/30 rounded-lg bg-primary/5 animate-fade-in">
                    <h4 className="col-span-full text-base font-bold text-primary dark:text-blue-300 mb-2">Faahfaahinta Dib U Bixinta Deynta</h4>
                    {/* PaidFrom field inside Debt Repayment */}
                    <div className="md:col-span-2">
                      <label htmlFor="paidFrom_debtrepay" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Akoonka Laga Jarayo <span className="text-redError">*</span></label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={18} />
                        <select
                          id="paidFrom_debtrepay"
                          required
                          value={paidFrom}
                          onChange={(e) => setPaidFrom(e.target.value)}
                          className={`w-full p-2 pl-8 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ${validationErrors.paidFrom ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        >
                          <option value="">-- Dooro Akoonka --</option>
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name} {acc.balance !== undefined ? `($${Number(acc.balance).toLocaleString()})` : ''}</option>
                          ))}
                        </select>
                        <ChevronRight className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400 transform rotate-90" size={18} />
                      </div>
                      {validationErrors.paidFrom && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.paidFrom}</p>}
                    </div>
                    <div>
                        <label htmlFor="selectedCustomer" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Dooro Macmiilka <span className="text-redError">*</span></label>
                        <select
                            id="selectedCustomer"
                            required
                            value={selectedDebt}
                            onChange={(e) => setSelectedDebt(e.target.value)}
                            className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary appearance-none ${validationErrors.selectedDebt ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        >
                            <option value="">-- Dooro Macmiilka --</option>
                            {debts.map(customer => (
                              <option key={customer.id} value={customer.id}>{customer.name} {customer.outstandingDebt > 0 ? `(Lagu leeyahay: $${customer.outstandingDebt})` : ''}</option>
                            ))}
                        </select>
                        {selectedDebt && debts.length > 0 && (() => {
                          const cust = debts.find(c => c.id === selectedDebt);
                          if (!cust) return null;
                          return (
                            <div className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                              <Link href={`/customers/${cust.id}`} className="underline text-primary hover:text-blue-700" target="_blank">Eeg Macmiilkan</Link>
                              {cust.outstandingDebt > 0 && (
                                <span className="ml-2 text-orange-600 dark:text-orange-400 font-semibold">Macmiilkan waxaa lagu leeyahay: ${cust.outstandingDebt}</span>
                              )}
                            </div>
                          );
                        })()}
                        {validationErrors.selectedDebt && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.selectedDebt}</p>}
                    </div>
                    <div>
                        <label htmlFor="debtRepaymentAmount" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Qiimaha Dib U Bixinta ($) <span className="text-redError">*</span></label>
                        <input type="number" id="debtRepaymentAmount" required value={debtRepaymentAmount} onChange={(e) => setDebtRepaymentAmount(parseFloat(e.target.value) || '')} placeholder="Tusaale: 500" className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors.debtRepaymentAmount ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}/>
                        {validationErrors.debtRepaymentAmount && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.debtRepaymentAmount}</p>}
                    </div>
                </div>
              )}

              {/* NEW: Other Company Expense (General) */}
              {companyExpenseType === 'Other' && (
                <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 animate-fade-in">
                    <h4 className="text-base font-bold text-primary dark:text-blue-300 mb-2">Faahfaahin Kale</h4>
                    {/* PaidFrom field inside Other */}
                    <div className="mb-4">
                      <label htmlFor="paidFrom_other" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Akoonka Laga Jarayo <span className="text-redError">*</span></label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={18} />
                        <select
                          id="paidFrom_other"
                          required
                          value={paidFrom}
                          onChange={(e) => setPaidFrom(e.target.value)}
                          className={`w-full p-2 pl-8 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ${validationErrors.paidFrom ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        >
                          <option value="">-- Dooro Akoonka --</option>
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name} {acc.balance !== undefined ? `($${Number(acc.balance).toLocaleString()})` : ''}</option>
                          ))}
                        </select>
                        <ChevronRight className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400 transform rotate-90" size={18} />
                      </div>
                      {validationErrors.paidFrom && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.paidFrom}</p>}
                    </div>
                    <div>
                        <label htmlFor="otherCompanyExpenseAmount" className="block text-sm font-medium text-darkGray dark:text-gray-300 mb-1">Qiimaha ($) <span className="text-redError">*</span></label>
                        <input
                            type="number"
                            id="otherCompanyExpenseAmount"
                            required
                            value={amount} // Re-use common amount
                            onChange={(e) => setAmount(parseFloat(e.target.value) || '')}
                            placeholder="Tusaale: 100"
                            className={`w-full p-2 border rounded-lg bg-lightGray dark:bg-gray-800 text-darkGray dark:text-gray-100 focus:ring-primary ${validationErrors.amount ? 'border-redError' : 'border-lightGray dark:border-gray-700'}`}
                        />
                        {validationErrors.amount && <p className="text-redError text-xs mt-1 flex items-center"><Info size={14} className="inline mr-1"/>{validationErrors.amount}</p>}
                    </div>
                </div>
              )}
            </div>
          )}

          {/* General Notes */}
          <div>
            <label htmlFor="note" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Fiiro Gaar Ah (Optional)</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Wixii faahfaahin dheeraad ah ee kharashka..."
              className="w-full p-3 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-secondary text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-green-600 transition duration-200 shadow-md transform hover:scale-105 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : (
              <Plus className="mr-2" size={20} />
            )}
            {loading ? 'Diiwaan Gelinaya Kharashka...' : 'Diiwaan Geli Kharashka'}
          </button>
        </form>
      </div>

      {toastMessage && (
        <Toast message={toastMessage.message} type={toastMessage.type} onClose={() => setToastMessage(null)} />
      )}
    </Layout>
  );
}


