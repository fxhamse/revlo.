// app/settings/assets-register/page.tsx - Assets Register Settings Page (10000% Design)
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../../../components/layouts/Layout';
import { 
  ArrowLeft, HardDrive, Plus, Search, Filter, Edit, Trash2, X, Loader2, Info, 
  Tag, Briefcase, Calendar, DollarSign, CheckCircle, XCircle, ChevronRight,
  Building, Home, Truck, Package, RefreshCw, Download, Upload, BarChart, PieChart, LineChart as LineChartIcon, List // New icons for charts/export
} from 'lucide-react';
import Toast from '../../../components/common/Toast'; // Reuse Toast component
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

// --- Dummy Data ---
const dummyFixedAssets = [
  { id: 'asset001', name: 'CNC Machine', type: 'Machinery', value: 25000.00, purchaseDate: '2023-01-15', assignedTo: 'Factory', status: 'Active', depreciationRate: 0.15, currentBookValue: 20000.00, lastUpdated: '2025-07-20' },
  { id: 'asset002', name: 'Office Desk Set', type: 'Furniture', value: 1200.00, purchaseDate: '2024-03-01', assignedTo: 'Office', status: 'Active', depreciationRate: 0.10, currentBookValue: 1080.00, lastUpdated: '2025-07-21' },
  { id: 'asset003', name: 'Delivery Van', type: 'Vehicle', value: 18000.00, purchaseDate: '2023-06-10', assignedTo: 'Transport', status: 'Active', depreciationRate: 0.20, currentBookValue: 12000.00, lastUpdated: '2025-07-22' },
  { id: 'asset004', name: 'Drill Press', type: 'Tool', value: 500.00, purchaseDate: '2024-09-20', assignedTo: 'Furniture Project A', status: 'Assigned', depreciationRate: 0.10, currentBookValue: 450.00, lastUpdated: '2025-07-23' },
  { id: 'asset005', name: 'Laptop (Admin)', type: 'Electronics', value: 1500.00, purchaseDate: '2025-01-05', assignedTo: 'Office', status: 'Active', depreciationRate: 0.25, currentBookValue: 1200.00, lastUpdated: '2025-07-24' },
];

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

// --- Fixed Asset Table Row Component ---
const FixedAssetRow: React.FC<{ asset: typeof dummyFixedAssets[0]; onEdit: (id: string) => void; onDelete: (id: string) => void }> = ({ asset, onEdit, onDelete }) => (
  <tr className="hover:bg-lightGray dark:hover:bg-gray-700 transition-colors duration-150 border-b border-lightGray dark:border-gray-700 last:border-b-0">
    <td className="p-4 whitespace-nowrap text-darkGray dark:text-gray-100 font-medium flex items-center space-x-2 w-[15%]">
        <HardDrive size={18} className="text-primary"/> <span>{asset.name}</span>
    </td>
    <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300 flex items-center space-x-2 w-[10%]">
        <Tag size={16} className="text-secondary"/> <span>{asset.type}</span>
    </td>
    <td className="p-4 whitespace-nowrap text-darkGray dark:text-gray-100 font-semibold text-right w-[10%]">${asset.value.toLocaleString()}</td>
    <td className="p-4 whitespace-nowrap text-darkGray dark:text-gray-100 font-semibold text-right w-[10%]">${asset.currentBookValue.toLocaleString()}</td>
    <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300 text-right w-[8%]">{asset.depreciationRate * 100}%</td>
    <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300 flex items-center space-x-2 w-[12%]">
        {asset.assignedTo === 'Factory' ? <Building size={16}/> : asset.assignedTo === 'Office' ? <Home size={16}/> : asset.assignedTo === 'Transport' ? <Truck size={16}/> : <Briefcase size={16}/>}
        <span>{asset.assignedTo}</span>
    </td>
    <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300 w-[10%] text-right">{new Date(asset.purchaseDate).toLocaleDateString()}</td>
    <td className="p-4 whitespace-nowrap text-mediumGray dark:text-gray-300 w-[10%] text-right">{new Date(asset.lastUpdated).toLocaleDateString()}</td>
    <td className="p-4 whitespace-nowrap text-right w-[15%]">
      <div className="flex items-center justify-end space-x-2">
        <button onClick={() => onEdit(asset.id)} className="p-2 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors duration-200" title="Edit Asset">
          <Edit size={18} />
        </button>
        <button onClick={() => onDelete(asset.id)} className="p-2 rounded-full bg-redError/10 text-redError hover:bg-redError hover:text-white transition-colors duration-200" title="Delete Asset">
          <Trash2 size={18} />
        </button>
      </div>
    </td>
  </tr>
);


// Main Fixed Assets Register Page Component
export default function AssetsRegisterSettingsPage() {
  const [assets, setAssets] = useState(dummyFixedAssets);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterAssignedTo, setFilterAssignedTo] = useState('All');
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<typeof dummyFixedAssets[0] | null>(null);
  const [filterStatus, setFilterStatus] = useState('All'); // Add filterStatus state
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'charts'>('list'); // Default to list view

  // Statistics
  const totalAssetsCount = assets.length;
  const totalAssetsValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalBookValue = assets.reduce((sum, asset) => sum + asset.currentBookValue, 0);
  const assignedAssetsCount = assets.filter(asset => asset.status === 'Assigned').length;
  const activeAssetsCount = assets.filter(asset => asset.status === 'Active').length;

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || asset.type === filterType;
    const matchesAssignedTo = filterAssignedTo === 'All' || asset.assignedTo === filterAssignedTo;
    return matchesSearch && matchesType && matchesAssignedTo;
  });

  // Filter options
  const assetTypes = ['All', 'Machinery', 'Furniture', 'Vehicle', 'Tool', 'Electronics', 'Other'];
  const assignedOptions = ['All', 'Office', 'Factory', 'Transport', 'Furniture Project A', 'Office Setup B']; 
  const assetStatuses = ['All', 'Active', 'Assigned', 'Under Maintenance', 'Retired']; // Example statuses


  // Chart Data
  const assetValueByTypeData = assetTypes.filter(type => type !== 'All').map(type => ({
    name: type,
    value: filteredAssets.filter(asset => asset.type === type).reduce((sum, asset) => sum + asset.value, 0),
  })).filter(item => item.value > 0);

  const assetDepreciationData = filteredAssets.map(asset => ({
    name: asset.name,
    initialValue: asset.value,
    currentBookValue: asset.currentBookValue,
  }));


  const handleAddAsset = (newAssetData: any) => {
    console.log('Adding asset:', newAssetData);
    setAssets(prev => [...prev, { ...newAssetData, id: `asset${prev.length + 1}`, status: 'Active', lastUpdated: new Date().toISOString().split('T')[0], currentBookValue: newAssetData.value }]); // Simple currentBookValue for now
    setToastMessage({ message: 'Hantida si guul leh ayaa loo daray!', type: 'success' });
    setShowAddEditModal(false);
  };

  const handleEditAsset = (updatedAssetData: any) => {
    console.log('Updating asset:', updatedAssetData);
    setAssets(prev => prev.map(asset => asset.id === updatedAssetData.id ? { ...updatedAssetData, lastUpdated: new Date().toISOString().split('T')[0], currentBookValue: updatedAssetData.value } : asset)); // Simple currentBookValue update
    setToastMessage({ message: 'Hantida si guul leh ayaa loo cusboonaysiiyay!', type: 'success' });
    setShowAddEditModal(false);
    setEditingAsset(null);
  };

  const handleDeleteAsset = (id: string) => {
    if (window.confirm('Ma hubtaa inaad tirtirto hantidan?')) { 
      console.log('Deleting asset:', id);
      setAssets(prev => prev.filter(asset => asset.id !== id));
      setToastMessage({ message: 'Hantida si guul leh ayaa loo tirtiray!', type: 'success' });
    }
  };

  const openEditModal = (id: string) => {
    const assetToEdit = assets.find(asset => asset.id === id);
    if (assetToEdit) {
      setEditingAsset(assetToEdit);
      setShowAddEditModal(true);
    }
  };

    function handleDeleteItem(id: string): void {
        if (window.confirm('Are you sure you want to delete this asset?')) {
            setAssets(prevAssets => prevAssets.filter(asset => asset.id !== id));
            setToastMessage({ message: 'Asset successfully deleted!', type: 'success' });
        }
    }

    function handleEditItem(id: string): void {
        const assetToEdit = assets.find(asset => asset.id === id);
        if (assetToEdit) {
            setEditingAsset(assetToEdit);
            setShowAddEditModal(true);
        } else {
            setToastMessage({ message: 'Asset not found!', type: 'error' });
        }
    }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-darkGray dark:text-gray-100">
          <Link href="/settings" className="text-mediumGray dark:text-gray-400 hover:text-primary transition-colors duration-200 mr-4">
            <ArrowLeft size={28} className="inline-block" />
          </Link>
          Assets Register
        </h1>
        <button onClick={() => { setShowAddEditModal(true); setEditingAsset(null); }} className="bg-primary text-white py-2.5 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-200 shadow-md flex items-center">
          <Plus size={20} className="mr-2" /> Ku Dar Hantida
        </button>
      </div>

      {/* Asset Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Hantida</h4>
          <p className="text-3xl font-extrabold text-primary">{totalAssetsCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Qiimaha Gadashada</h4>
          <p className="text-3xl font-extrabold text-secondary">${totalAssetsValue.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Qiimaha Buuga (Hadda)</h4>
          <p className="text-3xl font-extrabold text-accent">${totalBookValue.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Hantida Firfircoon</h4>
          <p className="text-3xl font-extrabold text-primary">{activeAssetsCount}</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 animate-fade-in-up">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search assets by name, type, or assigned location..."
            className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 placeholder-mediumGray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Filter by Asset Type */}
        <div className="relative w-full md:w-48">
          <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" />
          <select
            className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 appearance-none"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            {assetTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400">
            <ChevronRight className="transform rotate-90" size={20} />
          </div>
        </div>
        {/* Filter by Assigned To */}
        <div className="relative w-full md:w-48">
          <Briefcase size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" />
          <select
            className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 appearance-none"
            value={filterAssignedTo}
            onChange={(e) => setFilterAssignedTo(e.target.value)}
          >
            {assignedOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400">
            <ChevronRight className="transform rotate-90" size={20} />
          </div>
        </div>
        {/* Filter by Status */}
        <div className="relative w-full md:w-48">
          <CheckCircle size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" />
          <select
            className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 appearance-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {assetStatuses.map(status => <option key={status} value={status}>{status}</option>)}
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
            <button onClick={() => setViewMode('charts')} className={`p-2 rounded-lg ${viewMode === 'charts' ? 'bg-primary text-white' : 'bg-lightGray dark:bg-gray-700 text-mediumGray dark:text-gray-400'} hover:bg-primary/80 dark:hover:bg-gray-600 transition-colors duration-200`}>
                <BarChart size={20} />
            </button>
        </div>
      </div>

      {/* Assets View */}
      {filteredAssets.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center text-mediumGray dark:text-gray-400 animate-fade-in">
          Ma jiraan hanti la helay.
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-lightGray dark:divide-gray-700">
              <thead className="bg-lightGray dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider w-[15%]">Magaca Hantida</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider w-[10%]">Nooca</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider w-[10%]">Qiimaha Gadashada</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider w-[10%]">Qiimaha Buuga (Hadda)</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider w-[8%]">Qiimaha Hoos U Dhaca</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider w-[12%]">Meelaynta</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider w-[10%]">Taariikhda Gadashada</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider w-[10%]">Last Updated</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider w-[15%]">Ficillo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lightGray dark:divide-gray-700">
                {filteredAssets.map(asset => (
                  <FixedAssetRow key={asset.id} asset={asset} onEdit={handleEditItem} onDelete={handleDeleteItem} />
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Placeholder */}
          <div className="p-4 flex justify-between items-center border-t border-lightGray dark:border-gray-700">
              <button className="text-sm text-mediumGray dark:text-gray-400 hover:text-primary transition">Hore</button>
              <span className="text-sm text-darkGray dark:text-gray-100">Bogga 1 ee {Math.ceil(filteredAssets.length / 10) || 1}</span>
              <button className="text-sm text-mediumGray dark:text-gray-400 hover:text-primary transition">Xiga</button>
          </div>
        </div>
      ) : ( /* Charts View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            {/* Asset Value by Type (Pie Chart) */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md animate-fade-in-up">
                <h3 className="text-xl font-semibold text-darkGray dark:text-gray-100 mb-4">Wadarta Qiimaha Hantida (Nooc Ahaan)</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <RechartsPieChart>
                            <Pie
                                data={assetValueByTypeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={120}
                                dataKey="value"
                            >
                                {assetValueByTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }}
                                labelStyle={{ color: '#2C3E50', fontWeight: 'bold' }}
                                itemStyle={{ color: '#2C3E50' }}
                            />
                            <Legend align="right" verticalAlign="middle" layout="vertical" wrapperStyle={{ paddingLeft: '20px' }} />
                        </RechartsPieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Asset Depreciation Chart (Bar Chart) */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md animate-fade-in-up">
                <h3 className="text-xl font-semibold text-darkGray dark:text-gray-100 mb-4">Qiimaha Hoos U Dhaca Hantida</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <RechartsBarChart data={assetDepreciationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" vertical={false} />
                            <XAxis dataKey="name" stroke="#7F8C8D" className="dark:text-gray-400 text-sm" />
                            <YAxis stroke="#7F8C8D" className="dark:text-gray-400 text-sm" />
                            <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }} labelStyle={{ color: '#2C3E50', fontWeight: 'bold' }} itemStyle={{ color: '#2C3E50' }} />
                            <Legend />
                            <Bar dataKey="initialValue" fill={CHART_COLORS[0]} name="Qiimaha Hore" radius={[5, 5, 0, 0]} />
                            <Bar dataKey="currentBookValue" fill={CHART_COLORS[1]} name="Qiimaha Hadda" radius={[5, 5, 0, 0]} />
                        </RechartsBarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      )}
    </Layout>
  );
}
