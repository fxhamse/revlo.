// app/expenses/[id]/page.tsx - Expense Details Page (10000% Enhanced Design)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Layout from '../../../components/layouts/Layout';
import {
  ArrowLeft, Edit, Trash2, Calendar, Tag, DollarSign, Briefcase, CreditCard,
  MessageSquare, Paperclip, CheckCircle, XCircle, Loader2, Info, User, Printer, Download, Package
} from 'lucide-react';
import Toast from '../../../components/common/Toast';

// Interface la mid ah kan bogga liiska kharashaadka
interface Expense {
  id: string;
  date: string;
  project?: {
    id: string;
    name: string;
  };
  category: string;
  description: string;
  amount: number;
  paidFrom: string;
  note?: string;
  approved?: boolean;
  receiptUrl?: string; // URL-ka rasiidhka haddii la heli karo
  materials?: { name: string; qty: number; price: number; unit: string }[]; // Wixii kharash ah oo alaab ah
  employee?: {
    name: string;
  }; // Wixii kharash ah oo shaqo ah
}

// Qayb yar oo loogu talagalay badhamada waxqabadka
const ActionButtons: React.FC<{ expenseId: string; onDelete: () => void; onPrint: () => void }> = ({ expenseId, onDelete, onPrint }) => (
  <div className="flex items-center space-x-3">
    <button onClick={onPrint} className="flex items-center bg-gray-200 dark:bg-gray-600 text-darkGray dark:text-gray-100 py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-200 shadow-sm">
        <Printer className="mr-2" size={18} /> Daabac
    </button>
    <Link href={`/expenses/edit/${expenseId}`} className="flex items-center bg-accent/10 text-accent py-2.5 px-4 rounded-lg font-semibold hover:bg-accent hover:text-white transition duration-200 shadow-sm">
      <Edit className="mr-2" size={18} /> Wax Ka Beddel
    </Link>
    <button onClick={onDelete} className="flex items-center bg-redError/10 text-redError py-2.5 px-4 rounded-lg font-semibold hover:bg-redError hover:text-white transition duration-200 shadow-sm">
      <Trash2 className="mr-2" size={18} /> Tirtir
    </button>
  </div>
);

// Qayb yar oo loogu talagalay bandhigidda faahfaahinta
const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: React.ReactNode; isLink?: boolean; href?: string }> = ({ icon: Icon, label, value, isLink = false, href = "#" }) => {
  if (!value) return null;
  return (
    <div className="flex items-start space-x-4 bg-lightGray/50 dark:bg-gray-700/50 p-4 rounded-lg">
      <Icon className="text-primary flex-shrink-0 mt-1" size={22} />
      <div className="flex-1">
        <p className="text-sm font-medium text-mediumGray dark:text-gray-400">{label}</p>
        {isLink ? (
            <Link href={href} className="text-base font-semibold text-darkGray dark:text-gray-100 hover:text-primary dark:hover:text-blue-300 transition-colors duration-200">
                {value}
            </Link>
        ) : (
            <p className="text-base font-semibold text-darkGray dark:text-gray-100">{value}</p>
        )}
      </div>
    </div>
  );
};


export default function ExpenseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    if (id) {
      const fetchExpenseDetails = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/expenses/${id}`);
          if (!response.ok) {
            throw new Error('Khasab ma ahan in la helo faahfaahinta kharashka');
          }
          const data = await response.json();
          setExpense(data.expense);
        } catch (error: any) {
          console.error("Error fetching expense details:", error);
          setToastMessage({ message: error.message || 'Cilad ayaa dhacday.', type: 'error' });
        } finally {
          setLoading(false);
        }
      };
      fetchExpenseDetails();
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Ma hubtaa inaad rabto inaad tirtirto kharashkan? Lama soo celin karo.')) {
      setLoading(true);
      try {
        const response = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Khasab ma ahan in la tirtiro kharashka.');
        setToastMessage({ message: 'Kharashka si guul leh ayaa loo tirtiray!', type: 'success' });
        router.push('/expenses');
      } catch (error: any) {
        setToastMessage({ message: error.message || 'Cilad ayaa ka dhacday tirtiridda.', type: 'error' });
        setLoading(false);
      }
    }
  };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="animate-spin mr-3 text-primary" size={32} />
          <span>Soo raridda Faahfaahinta Kharashka...</span>
        </div>
      </Layout>
    );
  }

  if (!expense) {
    return (
      <Layout>
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Info size={48} className="mx-auto text-redError mb-4" />
            <h2 className="text-2xl font-bold text-darkGray dark:text-gray-100">Kharash Lama Helin</h2>
            <p className="text-mediumGray dark:text-gray-400 mt-2">Waan ka xunnahay, laakiin kharashka aad raadineyso ma jiro ama waa la tirtiray.</p>
            <Link href="/expenses" className="mt-6 inline-block bg-primary text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200">
                Ku laabo Liiska Kharashyada
            </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {toastMessage && <Toast message={toastMessage.message} type={toastMessage.type} onClose={() => setToastMessage(null)} />}
      
      {/* Madaxa Bogga */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div className="flex items-center space-x-4">
            <Link href="/expenses" className="p-2 rounded-full bg-lightGray dark:bg-gray-700 hover:bg-primary hover:text-white transition-colors duration-200" aria-label="Ku laabo liiska kharashyada">
                <ArrowLeft size={24} />
            </Link>
            <h1 className="text-4xl font-bold text-darkGray dark:text-gray-100">Faahfaahinta Kharashka</h1>
        </div>
        <ActionButtons expenseId={expense.id} onDelete={handleDelete} onPrint={handlePrint} />
      </div>

      {/* Qaybta Hero Section oo la qurxiyay */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg mb-8 animate-fade-in-up border-l-8 border-redError">
          <div className="flex justify-between items-start">
              <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold flex items-center">
                      <Tag size={14} className="mr-1.5"/>
                      {expense.category}
                    </span>
                    <span className="text-sm text-mediumGray dark:text-gray-400 flex items-center">
                      <Calendar size={14} className="mr-1.5"/>
                      {new Date(expense.date).toLocaleDateString('so-SO', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-2xl font-semibold text-darkGray dark:text-gray-200 mb-2">{expense.description}</p>
                  <p className="text-6xl font-extrabold text-redError tracking-tighter">
                    -${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
              </div>
              <div className={`flex-shrink-0 px-4 py-2 rounded-full text-white font-bold text-sm flex items-center shadow-md ${expense.approved ? 'bg-green-500' : 'bg-yellow-500'}`}>
                  {expense.approved ? <CheckCircle size={18} className="mr-2"/> : <XCircle size={18} className="mr-2"/>}
                  {expense.approved ? 'La Ansixiyay' : 'Sugaya Ansixin'}
              </div>
          </div>
      </div>

      {/* Qaab dhismeedka Grid-ka ee cusub */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Tiirka Bidix: Faahfaahinta & Alaabta */}
        <div className="lg:col-span-3 space-y-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-darkGray dark:text-gray-100 mb-4">Macluumaadka Dheeraadka ah</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailItem icon={CreditCard} label="Laga Bixiyay" value={expense.paidFrom} />
                    <DetailItem icon={Briefcase} label="Mashruuc" value={expense.project?.name} isLink={true} href={`/projects/${expense.project?.id}`} />
                    <DetailItem icon={User} label="Shaqaale" value={expense.employee?.name} />
                    <DetailItem icon={MessageSquare} label="Fiiro Gaar Ah" value={expense.note} />
                </div>
            </div>

            {expense.materials && expense.materials.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold text-darkGray dark:text-gray-100 mb-4 flex items-center"><Package className="mr-3 text-primary"/>Alaabta La Iibiyay</h3>
                  <div className="overflow-x-auto">
                      <table className="min-w-full">
                          <thead className="bg-lightGray dark:bg-gray-700">
                              <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Alaabta</th>
                                  <th className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Tirada</th>
                                  <th className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Qiimaha</th>
                                  <th className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Wadarta</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-lightGray dark:divide-gray-700">
                              {expense.materials.map((item, index) => (
                                  <tr key={index} className="hover:bg-lightGray/50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                      <td className="px-4 py-3 font-medium text-darkGray dark:text-gray-100">{item.name}</td>
                                      <td className="px-4 py-3 text-right text-mediumGray dark:text-gray-300">{item.qty} {item.unit}</td>
                                      <td className="px-4 py-3 text-right text-mediumGray dark:text-gray-300">${item.price.toLocaleString()}</td>
                                      <td className="px-4 py-3 text-right font-semibold text-darkGray dark:text-gray-100">${(item.qty * item.price).toLocaleString()}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
            )}
        </div>

        {/* Tiirka Midig: Rasiidhka */}
        <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-full">
                <h3 className="text-xl font-bold text-darkGray dark:text-gray-100 mb-4">Rasiidhka lifaaqan</h3>
                {expense.receiptUrl ? (
                    <div>
                        <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer" className="block border-2 border-dashed border-lightGray dark:border-gray-600 rounded-lg p-2 hover:border-primary transition-colors duration-200">
                            <img src={expense.receiptUrl} alt="Receipt" className="w-full h-auto rounded-md object-cover max-h-96" />
                        </a>
                         <a href={expense.receiptUrl} download target="_blank" className="mt-4 w-full flex items-center justify-center bg-secondary text-white py-2.5 px-4 rounded-lg font-bold hover:bg-green-600 transition duration-200 shadow-md">
                            <Download size={18} className="mr-2"/> Soo Degso Rasiidhka
                        </a>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-lightGray dark:border-gray-600 rounded-lg h-full min-h-[200px] p-8 text-center">
                      <Paperclip size={40} className="text-mediumGray dark:text-gray-500 mb-3"/>
                      <p className="text-mediumGray dark:text-gray-500 font-semibold">Rasiidh lama soo gudbin.</p>
                      <p className="text-sm text-mediumGray dark:text-gray-500 mt-1">Haddii loo baahdo, wax ka beddel kharashka si aad u soo geliso rasiidh.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </Layout>
  );
}