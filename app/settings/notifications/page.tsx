// app/settings/notifications/page.tsx - Notifications Settings Page (10000% Design - Ultimate Card View)
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../../../components/layouts/Layout';
import { 
  ArrowLeft, Bell, Plus, Search, Filter, Edit, Trash2, X, Loader2, Info, 
  Mail, Smartphone, MessageSquare, CheckCircle, XCircle, ChevronRight, Volume2, 
  Tag, Clock, Briefcase, Package, User, CheckSquare,
  List, LayoutGrid // Added for view toggle
} from 'lucide-react';
import Toast from '../../../components/common/Toast'; // Reuse Toast component

// --- Dummy Data ---
const dummyNotifications = [
  { id: 'notif001', message: 'Mashruuca "Furniture Project A" wuu dib u dhacay!', type: 'Overdue Project', date: '2025-07-24T09:30:00Z', read: false, details: 'Deadline-kii wuu dhaafay 3 maalmood.' },
  { id: 'notif002', message: 'Alaabta "Screws" stock-geedu waa yar yahay.', type: 'Low Stock', date: '2025-07-23T14:00:00Z', read: false, details: 'Kaliya 30 sanduuq ayaa hadhay, min-stock waa 50.' },
  { id: 'notif003', message: 'Lacag cusub ayaa la diiwaan geliyay: $5000.', type: 'New Payment', date: '2025-07-22T11:00:00Z', read: true, details: 'Lacagta mashruuca "Office Setup B" ayaa la helay.' },
  { id: 'notif004', message: 'User cusub "Cali Xasan" ayaa isku diiwaan geliyay.', type: 'User Activity', date: '2025-07-21T16:45:00Z', read: true, user: 'Cali Xasan', details: 'Email: cali.h@example.com, Role: Member.' },
  { id: 'notif005', message: 'Kharash cusub "Fuel for Vehicle A" ayaa la diiwaan geliyay.', type: 'New Expense', date: '2025-07-20T10:00:00Z', read: false, details: 'Qiimaha: $500, Gaariga: Vehicle A.' },
  { id: 'notif006', message: 'User "Faadumo Maxamed" ayaa wax ka beddelay profile-keeda.', type: 'User Activity', date: '2025-07-19T08:00:00Z', read: true, user: 'Faadumo Maxamed', details: 'Beddelka: Email-ka ayaa la cusboonaysiiyay.' },
  { id: 'notif007', message: 'Account "Ebirr Account" ayaa la cusboonaysiiyay.', type: 'System Activity', date: '2025-07-18T15:00:00Z', read: false, details: 'Balance-ka cusub: $12,500.' },
  { id: 'notif008', message: 'Hantida "CNC Machine" ayaa la meelayay "Factory".', type: 'System Activity', date: '2025-07-17T09:00:00Z', read: false, details: 'Meelaynta hore: Office.' },
];

// --- Notification Card Component (for both Desktop & Mobile Card View) ---
const NotificationCard: React.FC<{ notification: typeof dummyNotifications[0]; onMarkRead: (id: string) => void; onDelete: (id: string) => void }> = ({ notification, onMarkRead, onDelete }) => (
  <div className={`bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md animate-fade-in-up border-l-4 ${!notification.read ? 'border-primary' : 'border-lightGray dark:border-gray-700'} relative`}>
    <div className="flex justify-between items-start mb-3">
      <h4 className="font-semibold text-darkGray dark:text-gray-100 text-lg flex items-center space-x-2">
        {!notification.read ? <CheckCircle size={20} className="text-primary"/> : <CheckCircle size={20} className="text-mediumGray"/>}
        <span>{notification.message}</span>
      </h4>
      <div className="flex space-x-2 flex-shrink-0">
        {!notification.read && (
          <button onClick={() => onMarkRead(notification.id)} className="p-1 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors duration-200" title="Mark as Read">
            <CheckCircle size={16} />
          </button>
        )}
        <button onClick={() => onDelete(notification.id)} className="p-1 rounded-full bg-redError/10 text-redError hover:bg-redError hover:text-white transition-colors duration-200" title="Delete Notification">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
    <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
      <Tag size={14} className="text-secondary"/> <span>Nooca: {notification.type}</span>
    </p>
    <p className="text-sm text-mediumGray dark:text-gray-400 mb-1 flex items-center space-x-2">
      <Clock size={14}/> <span>Taariikhda: {new Date(notification.date).toLocaleString()}</span>
    </p>
    {notification.details && ( // Display detailed message if available
      <p className="text-sm text-darkGray dark:text-gray-200 mt-2 p-2 bg-lightGray dark:bg-gray-700 rounded-lg border border-lightGray dark:border-gray-600">
        <Info size={14} className="inline mr-1 text-primary"/> {notification.details}
      </p>
    )}
    {notification.user && ( // Display user if available (for User Activity)
      <p className="text-sm text-mediumGray dark:text-gray-400 mt-1 flex items-center space-x-2">
        <User size={14}/> <span>User: {notification.user}</span>
      </p>
    )}
  </div>
);


// Main Notifications Page Component
export default function NotificationsSettingsPage() {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterReadStatus, setFilterReadStatus] = useState('All');
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards'); // Default to cards view


  // Notification Preferences (from Personalization page, simulated here)
  const [emailNotif, setEmailNotif] = useState(true);
  const [inAppNotif, setInAppNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [lowStockNotif, setLowStockNotif] = useState(true);
  const [overdueProjectsNotif, setOverdueProjectsNotif] = useState(true);
  const [notificationSound, setNotificationSound] = useState('default'); // 'default', 'alert1', 'chime'

  // Statistics
  const totalNotifications = notifications.length;
  const unreadNotifications = notifications.filter(notif => !notif.read).length;

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notif.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (notif.user && notif.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (notif.details && notif.details.toLowerCase().includes(searchTerm.toLowerCase())); // Include details in search
    const matchesType = filterType === 'All' || notif.type === filterType;
    const matchesReadStatus = filterReadStatus === 'All' || (filterReadStatus === 'Unread' && !notif.read) || (filterReadStatus === 'Read' && notif.read);
    return matchesSearch && matchesType && matchesReadStatus;
  });

  const notificationTypes = ['All', 'Overdue Project', 'Low Stock', 'New Payment', 'User Activity', 'New Expense', 'System Activity']; 
  const readStatuses = ['All', 'Read', 'Unread'];
  const notificationSounds = ['default', 'alert1', 'chime'];

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, read: true } : notif));
    setToastMessage({ message: 'Digniinta waa la akhriyay!', type: 'success' });
  };

  const handleDeleteNotification = (id: string) => {
    if (window.confirm('Ma hubtaa inaad tirtirto digniintan?')) { 
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      setToastMessage({ message: 'Digniinta waa la tirtiray!', type: 'success' });
    }
  };

  const handleClearAllNotifications = () => {
    if (window.confirm('Ma hubtaa inaad tirtirto dhammaan digniinaha?')) { 
      setNotifications([]);
      setToastMessage({ message: 'Dhammaan digniinaha waa la tirtiray!', type: 'success' });
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setToastMessage({ message: 'Dhammaan digniinaha waa la akhriyay!', type: 'success' });
  };

  const handleSavePreferences = () => {
    console.log("Saving Notification Preferences:", { emailNotif, inAppNotif, smsNotif, lowStockNotif, overdueProjectsNotif, notificationSound });
    setToastMessage({ message: 'Dejinta digniinaha waa la badbaadiyay!', type: 'success' });
  };


  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-darkGray dark:text-gray-100">
          <Link href="/settings" className="text-mediumGray dark:text-gray-400 hover:text-primary transition-colors duration-200 mr-4">
            <ArrowLeft size={28} className="inline-block" />
          </Link>
          Notifications
        </h1>
        <button onClick={handleSavePreferences} className="bg-primary text-white py-2.5 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-200 shadow-md flex items-center">
          <CheckCircle size={20} className="mr-2" /> Badbaadi Dejinta
        </button>
      </div>

      {/* Notification Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in-up">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Wadarta Digniinaha</h4>
          <p className="text-3xl font-extrabold text-primary">{totalNotifications}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-mediumGray dark:text-gray-400">Digniinaha Aan La Akhrin</h4>
          <p className="text-3xl font-extrabold text-redError">{unreadNotifications}</p>
        </div>
      </div>

      {/* Notification Preferences Section */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md mb-8 animate-fade-in-up">
        <h3 className="text-2xl font-bold text-darkGray dark:text-gray-100 mb-6 flex items-center space-x-3">
          <Bell size={28} className="text-primary"/> <span>Dejinta Digniinaha</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery Channels */}
          <div>
            <h4 className="text-lg font-semibold text-darkGray dark:text-gray-300 mb-3">Habka Gaarsiinta</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="prefEmail" className="text-darkGray dark:text-gray-300 text-md font-medium flex items-center space-x-2"><Mail size={18}/><span>Email</span></label>
                <input type="checkbox" id="prefEmail" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} className="h-5 w-5 text-primary rounded border-mediumGray dark:border-gray-600 focus:ring-primary"/>
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="prefInApp" className="text-darkGray dark:text-gray-300 text-md font-medium flex items-center space-x-2"><Smartphone size={18}/><span>App-ka Gudihiisa</span></label>
                <input type="checkbox" id="prefInApp" checked={inAppNotif} onChange={(e) => setInAppNotif(e.target.checked)} className="h-5 w-5 text-primary rounded border-mediumGray dark:border-gray-600 focus:ring-primary"/>
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="prefSMS" className="text-darkGray dark:text-gray-300 text-md font-medium flex items-center space-x-2"><MessageSquare size={18}/><span>SMS (Lacag dheeraad ah)</span></label>
                <input type="checkbox" id="prefSMS" checked={smsNotif} onChange={(e) => setSmsNotif(e.target.checked)} className="h-5 w-5 text-primary rounded border-mediumGray dark:border-gray-600 focus:ring-primary"/>
              </div>
            </div>
          </div>
          {/* Specific Event Types */}
          <div>
            <h4 className="text-lg font-semibold text-darkGray dark:text-gray-300 mb-3">Noocyada Digniinaha</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="prefLowStock" className="text-darkGray dark:text-gray-300 text-md font-medium flex items-center space-x-2"><Package size={18}/><span>Alaab Yar</span></label>
                <input type="checkbox" id="prefLowStock" checked={lowStockNotif} onChange={(e) => setLowStockNotif(e.target.checked)} className="h-5 w-5 text-primary rounded border-mediumGray dark:border-gray-600 focus:ring-primary"/>
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="prefOverdueProjects" className="text-darkGray dark:text-gray-300 text-md font-medium flex items-center space-x-2"><Briefcase size={18}/><span>Mashaariic Dib U Dhacday</span></label>
                <input type="checkbox" id="prefOverdueProjects" checked={overdueProjectsNotif} onChange={(e) => setOverdueProjectsNotif(e.target.checked)} className="h-5 w-5 text-primary rounded border-mediumGray dark:border-gray-600 focus:ring-primary"/>
              </div>
              {/* Notification Sound Selector */}
              <div>
                <label htmlFor="notifSound" className="block text-md font-medium text-darkGray dark:text-gray-300 mb-2">Codka Digniinta</label>
                <select id="notifSound" value={notificationSound} onChange={(e) => setNotificationSound(e.target.value)} className="w-full p-3 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:ring-primary appearance-none">
                  {notificationSounds.map(sound => <option key={sound} value={sound}>{sound}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-fade-in">
      </div>
        <div className="flex justify-between items-center p-6 border-b border-lightGray dark:border-gray-700">
          <h3 className="text-xl font-semibold text-darkGray dark:text-gray-100">Diiwaanka Digniinaha</h3>
          <div className="flex space-x-3">
            <button onClick={handleMarkAllRead} className="bg-primary/10 text-primary py-2 px-4 rounded-lg font-semibold flex items-center hover:bg-primary hover:text-white transition duration-200">
                <CheckSquare size={18} className="mr-2"/> Dhammaan Akhri
            </button>
            <button onClick={handleClearAllNotifications} className="bg-redError/10 text-redError py-2 px-4 rounded-lg font-semibold flex items-center hover:bg-redError hover:text-white transition duration-200">
                <Trash2 size={18} className="mr-2"/> Tirtir Dhammaan
            </button>
          </div>
        </div>

        {/* Filters for History */}
        <div className="p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 border-b border-lightGray dark:border-gray-700">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
            <input type="text" placeholder="Search notifications..." className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 placeholder-mediumGray focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"/>
          </div>
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 appearance-none">
              {notificationTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-mediumGray dark:text-gray-400"><ChevronRight className="transform rotate-90" size={20} /></div>
          </div>
          <div className="relative w-full md:w-48">
            <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mediumGray dark:text-gray-400" size={20} />
            <select value={filterReadStatus} onChange={(e) => setFilterReadStatus(e.target.value)} className="w-full p-3 pl-10 border border-lightGray dark:border-gray-700 rounded-lg bg-lightGray dark:bg-gray-700 text-darkGray dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 appearance-none">
              {readStatuses.map(status => <option key={status} value={status}>{status}</option>)}
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


        {/* Notifications View */}
        {filteredNotifications.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center text-mediumGray dark:text-gray-400 animate-fade-in">
                Ma jiraan digniino la helay.
            </div>
        ) : viewMode === 'list' ? (
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md animate-fade-in">
                <table className="min-w-full divide-y divide-lightGray dark:divide-gray-700">
                    <thead className="bg-lightGray dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Fariin</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Nooca</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Taariikhda</th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-mediumGray dark:text-gray-400 uppercase tracking-wider">Ficillo</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-lightGray dark:divide-gray-700">
                        {filteredNotifications.map(notif => (
                            <tr key={notif.id}>
                                <td className="px-4 py-3 text-darkGray dark:text-gray-100">{notif.message}</td>
                                <td className="px-4 py-3 text-mediumGray dark:text-gray-400">{notif.type}</td>
                                <td className="px-4 py-3 text-mediumGray dark:text-gray-400">{new Date(notif.date).toLocaleString()}</td>
                                <td className="px-4 py-3 text-right">
                                    {!notif.read && (
                                        <button onClick={() => handleMarkRead(notif.id)} className="text-primary hover:underline mr-2">
                                            Mark as Read
                                        </button>
                                    )}
                                    <button onClick={() => handleDeleteNotification(notif.id)} className="text-redError hover:underline">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Pagination Placeholder */}
                <div className="p-4 flex justify-between items-center border-t border-lightGray dark:border-gray-700">
                    <button className="text-sm text-mediumGray dark:text-gray-400 hover:text-primary transition">Hore</button>
                    <span className="text-sm text-darkGray dark:text-gray-100">Bogga 1 ee {Math.ceil(filteredNotifications.length / 10) || 1}</span>
                    <button className="text-sm text-mediumGray dark:text-gray-400 hover:text-primary transition">Xiga</button>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {filteredNotifications.map(notif => (
                    <NotificationCard 
                        key={notif.id} 
                        notification={notif} 
                        onMarkRead={handleMarkRead} 
                        onDelete={handleDeleteNotification} 
                    />
                ))}
            </div>
        )}

      {toastMessage && (
        <Toast message={toastMessage.message} type={toastMessage.type} onClose={() => setToastMessage(null)} />
      )}
    </Layout>
  );
}
