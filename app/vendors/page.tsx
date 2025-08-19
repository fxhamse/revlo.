// app/vendors/page.tsx - Vendors List Page (10000% Design - API Integration & Enhanced)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '../../components/layouts/Layout';
import { 
  Plus, Search, Filter, Calendar, List, LayoutGrid, DollarSign, Tag, User, ChevronRight, Briefcase, Mail, Phone, MapPin, Truck,
  Eye, Edit, Trash2, Loader2, Info as InfoIcon, CheckCircle, XCircle, RefreshCw
} from 'lucide-react';
import Toast from '../../components/common/Toast'; // Import Toast component

// --- Vendor Data Interface (Refined for API response) ---
interface Vendor {
  id: string;
  name: string;
  type: string; // e.g., "Material", "Labor", "Transport", "Other"
  phone?: string;
  email?: string;
  address?: string;
  productsServices?: string; // Description of products/services provided
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Vendor Table Row Component ---
const VendorRow: React.FC<{ vendor: Vendor; onEdit: (id: string) => void; onDelete: (id: string) => void }> = ({ vendor, onEdit, onDelete }) => (
  <tr className="hover:bg-lightGray dark:hover:bg-gray-700 transition-colors duration-150 border-b border-lightGray dark:border-gray-700 last:border-b-0">
    <td className="p-4 whitespace-nowrap text-darkGray dark:text-gray-100 font-medium flex items-center space-x-2">
        <User size={18} className="text-primary"/> <span>{vendor.name}</span>
    </td>
    <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300 flex items-center space-x-2">
        <Tag size={16} className="text-secondary"/> <span>{vendor.type}</span>
    </td>
    <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300 flex items-center space-x-2">
        {vendor.email ? <Mail size={16}/> : <XCircle size={16} className="text-redError"/>} <span>{vendor.email || 'N/A'}</span>
    </td>
    <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300 flex items-center space-x-2">
        {vendor.phone ? <Phone size={16}/> : <XCircle size={16} className="text-redError"/>} <span>{vendor.phone || 'N/A'}</span>
    </td>
    <td className="p-4 text-mediumGray dark:text-gray-300 truncate max-w-xs">{vendor.productsServices || 'N/A'}</td>
    <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300">{new Date(vendor.createdAt).toLocaleDateString()}</td>
    <td className="p-4 whitespace-nowrap text-right">
      <div className="flex items-center justify-end space-x-2">
        <Link href={`/vendors/${vendor.id}`} className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors duration-200" title="View Details">
          <Eye size={18} />
        </Link>
        <Link href={`/vendors/edit/${vendor.id}`} className="p-2 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors duration-200" title="Edit Vendor">
          <Edit size={18} />
        </Link>
        <button onClick={() => onDelete(vendor.id)} className="p-2 rounded-full bg-redError/10 text-redError hover:bg-redError hover:text-white transition-colors duration-200" title="Delete Vendor">
          <Trash2 size={18} />
        </button>
      </div>
    </td>
  </tr>
);

// --- Vendor Card Component (for Mobile View) ---
const VendorCard: React.FC<{ vendor: Vendor; onEdit: (id: string) => void; onDelete: (id: string) => void }> = ({ vendor, onEdit, onDelete }) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md animate-fade-in-up border-l-4 border-primary relative">
    <div className="flex justify-between items-start mb-3">
      <h4 className="font-semibold text-darkGray dark:text-gray-100 text-lg flex items-center space-x-2">
        <User size={20} className="text-primary"/> <span>{vendor.name}</span>
      </h4>
      <div className="flex space-x-2 flex-shrink-0">
        <button onClick={() => onEdit(vendor.id)} className="p-1 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors duration-200" title="Edit">
          <Edit size={16} />
        </button>
        <button onClick={() => onDelete(vendor.id)} className="p-1 rounded-full bg-redError/10 text-redError hover:bg-redError hover:text-white transition-colors duration-200" title="Delete">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
    <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
        <Tag size={14}/> <span>Nooca: {vendor.type}</span>
    </p>
    <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
        {vendor.email ? <Mail size={14}/> : <XCircle size={14} className="text-redError"/>} <span>Email: {vendor.email || 'N/A'}</span>
    </p>
    <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
        {vendor.phone ? <Phone size={14}/> : <XCircle size={14} className="text-redError"/>} <span>Taleefan: {vendor.phone || 'N/A'}</span>
    </p>
    <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
        <Briefcase size={14}/> <span>Adeegyada: {vendor.productsServices || 'N/A'}</span>
    </p>
    <p className="text-sm text-mediumGray dark:text-gray-400 flex items-center space-x-2">
        <Calendar size={14}/> <span>Diiwaan Gashan: {new Date(vendor.createdAt).toLocaleDateString()}</span>
    </p>
    <Link href={`/vendors/${vendor.id}`} className="mt-3 inline-block text-primary hover:underline text-sm font-medium">
        Fiiri Faahfaahin &rarr;
    </Link>
  </div>
);


export default function VendorsPage() {
  const router = useRouter(); 
  const [vendors, setVendors] = useState<Vendor[]>([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All'); // e.g., "Material", "Labor", "Transport", "Other"
  const [filterDateRange, setFilterDateRange] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list'); // Default to list view
  const [pageLoading, setPageLoading] = useState(true); 
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);


  // --- API Functions ---
  const fetchVendors = async () => {
    setPageLoading(true);
    try {
      const response = await fetch('/api/vendors');
      if (!response.ok) throw new Error('Failed to fetch vendors');
      const data = await response.json();
      setVendors(data.vendors); 
    } catch (error: any) {
      console.error('Error fetching vendors:', error);
      setToastMessage({ message: error.message || 'Cilad ayaa dhacday marka iibiyayaasha la soo gelinayay.', type: 'error' });
      setVendors([]);
    } finally {
      setPageLoading(false);
    }
  };

  const handleDeleteVendor = async (id: string) => {
    if (window.confirm('Ma hubtaa inaad tirtirto iibiyahan? Tan lama soo celin karo!')) {
      try {
        const response = await fetch(`/api/vendors/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete vendor');
        
        setToastMessage({ message: data.message || 'Iibiyaha si guul leh ayaa loo tirtiray!', type: 'success' });
        fetchVendors(); // Re-fetch vendors after deleting
      } catch (error: any) {
        console.error('Error deleting vendor:', error);
        setToastMessage({ message: error.message || 'Cilad ayaa dhacday marka iibiyaha la tirtirayay.', type: 'error' });
      }
    }
  };

  const handleEditVendor = (id: string) => {
    router.push(`/vendors/edit/${id}`); // Navigate to edit page
  };


  useEffect(() => {
    fetchVendors(); // Fetch vendors on component mount
  }, []); 


  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vendor.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (vendor.email && vendor.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (vendor.phone && vendor.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (vendor.productsServices && vendor.productsServices.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'All' || vendor.type === filterType;
    const matchesDate = filterDateRange === 'All' ? true : true; 

    return matchesSearch && matchesType && matchesDate;
  });

  // Filter options
  const vendorTypes = ['All', 'Material', 'Labor', 'Transport', 'Other'];
  const dateRanges = ['All', 'Last 30 Days', 'This Quarter', 'This Year'];

  // Statistics
  const totalVendorsCount = filteredVendors.length;
  const materialVendorsCount = filteredVendors.filter(v => v.type === 'Material').length;
  const laborVendorsCount = filteredVendors.filter(v => v.type === 'Labor').length;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-darkGray dark:text-gray-100">Vendors</h1>
        <div className="flex space-x-3">
          <Link href="/vendors/add" className="bg-primary text-white py-2.5 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-200 shadow-md flex items-center">
            <Plus size={20} className="mr-2" /> Ku Dar Iibiye
          </Link>
          <button onClick={fetchVendors} className="bg-secondary text-white py-2.5 px-6 rounded-lg font-bold text-lg hover:bg-green-600 transition duration-200 shadow-md flex items-center">
            <RefreshCw size={20} className="mr-2" /> Cusboonaysii
          </button>
        </div>
      </div>

      {/* Vendor Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Iibiyayaasha</h4>
          <p className="text-3xl font-extrabold text-primary">{totalVendorsCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Iibiyayaasha Alaabta</h4>
          <p className="text-3xl font-extrabold text-secondary">{materialVendorsCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Iibiyayaasha Shaqaalaha</h4>
          <p className="text-3xl font-extrabold text-accent">{laborVendorsCount}</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 animate-fade-in-up">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search vendors by name, type, email, or phone..."
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
            {vendorTypes.map(type => <option key={type} value={type}>{type}</option>)}
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

      {/* Vendors View */}
      {pageLoading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="animate-spin mr-3 text-primary" size={32} /> Loading Vendors...
        </div>
      ) : filteredVendors.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center text-mediumGray dark:text-gray-400 animate-fade-in">
          Ma jiraan iibiyayaal la helay.
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-lightGray dark:divide-gray-700">
              <thead className="bg-lightGray dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Magaca</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Nooca</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Taleefan</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Adeegyada/Alaabta</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Diiwaan Gashan</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lightGray dark:divide-gray-700">
                {filteredVendors.map(vendor => (
                  <VendorRow key={vendor.id} vendor={vendor} onEdit={handleEditVendor} onDelete={handleDeleteVendor} />
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Placeholder */}
          <div className="p-4 flex justify-between items-center border-t border-lightGray dark:border-gray-700">
              <button className="text-sm text-mediumGray dark:text-gray-400 hover:text-primary transition">Hore</button>
              <span className="text-sm text-darkGray dark:text-gray-100">Page 1 of {Math.ceil(filteredVendors.length / 10) || 1}</span>
              <button className="text-sm text-mediumGray dark:text-gray-400 hover:text-primary transition">Next</button>
          </div>
        </div>
      ) : ( /* Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredVendors.map(vendor => (
                <VendorCard key={vendor.id} vendor={vendor} onEdit={handleEditVendor} onDelete={handleDeleteVendor} />
            ))}
        </div>
      )}

      {toastMessage && (
        <Toast message={toastMessage.message} type={toastMessage.type} onClose={() => setToastMessage(null)} />
      )}
    </Layout>
  );
}
