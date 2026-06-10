import React, { useState, useEffect } from 'react';
import NewSaleForm from './components/NewSaleForm';
import CustomerManagement from './components/CustomerManagement';
import PaddyTypeManagement from './components/PaddyTypeManagement';
import SalesHistory from './components/SalesHistory';
import Dashboard from './components/Dashboard';
import SalesReport from './components/SalesReport';
import Settings from './components/Settings';
import { 
  User, 
  Home, 
  ShoppingCart, 
  Users, 
  Wheat, 
  FileText, 
  DollarSign, 
  Settings as LucideSettings, 
  LogOut,
  History
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  createdAt: string;
}

interface PaddyType {
  id: string;
  name: string;
  description: string;
  defaultRate: number;
  createdAt: string;
}

interface PaddyEntry {
  id: string;
  bundles: number;
  weight: number;
}

interface Sale {
  id: string;
  billNumber: string;
  customerId: string;
  paddyTypeId: string;
  entries: PaddyEntry[];
  rate: number;
  totalBundles: number;
  totalWeight: number;
  totalAmount: number;
  date: string;
  createdAt: string;
}

export type ActivePage = 'dashboard' | 'sales' | 'customers' | 'paddyType' | 'salesHistory' | 'salesReport' | 'expenses' | 'settings';

function App() {
  const { t, i18n } = useTranslation();
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');

  useEffect(() => {
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  // Sample data - in a real app, this would come from a database
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Dilshan Pathum',
      phone: '+94 77 123 4567',
      address: 'Colombo 03',
      email: 'dilshan@email.com',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Kamal Silva',
      phone: '+94 71 987 6543',
      address: 'Kandy',
      email: 'kamal@email.com',
      createdAt: '2024-01-20T14:15:00Z'
    },
    {
      id: '3',
      name: 'Nimal Perera',
      phone: '+94 76 555 1234',
      address: 'Galle',
      email: 'nimal@email.com',
      createdAt: '2024-02-01T09:45:00Z'
    },
    {
      id: '4',
      name: 'Sunil Fernando',
      phone: '+94 75 444 5678',
      address: 'Matara',
      email: 'sunil@email.com',
      createdAt: '2024-02-10T16:20:00Z'
    }
  ]);

  const [paddyTypes, setPaddyTypes] = useState<PaddyType[]>([
    {
      id: '1',
      name: 'Samba',
      description: 'Traditional long grain rice variety',
      defaultRate: 120.00,
      createdAt: '2024-01-10T08:00:00Z'
    },
    {
      id: '2',
      name: 'Nadu',
      description: 'Medium grain rice variety',
      defaultRate: 115.00,
      createdAt: '2024-01-10T08:15:00Z'
    },
    {
      id: '3',
      name: 'Keeri Samba',
      description: 'Premium short grain rice',
      defaultRate: 140.00,
      createdAt: '2024-01-10T08:30:00Z'
    },
    {
      id: '4',
      name: 'Red Rice',
      description: 'Nutritious red rice variety',
      defaultRate: 160.00,
      createdAt: '2024-01-10T08:45:00Z'
    }
  ]);

  // Sample sales data
  const [sales, setSales] = useState<Sale[]>([
    {
      id: '1',
      billNumber: 'INV24120101',
      customerId: '1',
      paddyTypeId: '1',
      entries: [
        { id: '1', bundles: 5, weight: 250 },
        { id: '2', bundles: 3, weight: 150 }
      ],
      rate: 120.00,
      totalBundles: 8,
      totalWeight: 400,
      totalAmount: 48000,
      date: '2024-12-01',
      createdAt: '2024-12-01T10:30:00Z'
    },
    {
      id: '2',
      billNumber: 'INV24120102',
      customerId: '2',
      paddyTypeId: '2',
      entries: [
        { id: '3', bundles: 10, weight: 500 }
      ],
      rate: 115.00,
      totalBundles: 10,
      totalWeight: 500,
      totalAmount: 57500,
      date: '2024-12-01',
      createdAt: '2024-12-01T14:15:00Z'
    },
    {
      id: '3',
      billNumber: 'INV24120201',
      customerId: '3',
      paddyTypeId: '3',
      entries: [
        { id: '4', bundles: 2, weight: 100 },
        { id: '5', bundles: 4, weight: 200 },
        { id: '6', bundles: 3, weight: 150 }
      ],
      rate: 140.00,
      totalBundles: 9,
      totalWeight: 450,
      totalAmount: 63000,
      date: '2024-12-02',
      createdAt: '2024-12-02T09:45:00Z'
    },
    {
      id: '4',
      billNumber: 'INV24120202',
      customerId: '4',
      paddyTypeId: '4',
      entries: [
        { id: '7', bundles: 6, weight: 300 }
      ],
      rate: 160.00,
      totalBundles: 6,
      totalWeight: 300,
      totalAmount: 48000,
      date: '2024-12-02',
      createdAt: '2024-12-02T16:20:00Z'
    },
    {
      id: '5',
      billNumber: 'INV24120301',
      customerId: '1',
      paddyTypeId: '2',
      entries: [
        { id: '8', bundles: 8, weight: 400 },
        { id: '9', bundles: 2, weight: 100 }
      ],
      rate: 115.00,
      totalBundles: 10,
      totalWeight: 500,
      totalAmount: 57500,
      date: '2024-12-03',
      createdAt: '2024-12-03T11:00:00Z'
    }
  ]);

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: t('nav.dashboard') },
    { id: 'sales', icon: ShoppingCart, label: t('nav.sales') },
    { id: 'customers', icon: Users, label: t('nav.customers') },
    { id: 'paddyType', icon: Wheat, label: t('nav.paddyType') },
    { id: 'salesHistory', icon: History, label: t('nav.salesHistory') },
    { id: 'salesReport', icon: FileText, label: t('nav.salesReport') },
    { id: 'expenses', icon: DollarSign, label: t('nav.expenses') },
    { id: 'settings', icon: LucideSettings, label: t('nav.settings') },
    { id: 'logout', icon: LogOut, label: t('nav.logout') }
  ];

  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  // Customer management functions
  const handleAddCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const handleUpdateCustomer = (id: string, customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id 
        ? { ...customer, ...customerData }
        : customer
    ));
  };

  const handleDeleteCustomer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(customer => customer.id !== id));
    }
  };

  // Paddy type management functions
  const handleAddPaddyType = (paddyTypeData: Omit<PaddyType, 'id' | 'createdAt'>) => {
    const newPaddyType: PaddyType = {
      ...paddyTypeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setPaddyTypes(prev => [...prev, newPaddyType]);
  };

  const handleUpdatePaddyType = (id: string, paddyTypeData: Omit<PaddyType, 'id' | 'createdAt'>) => {
    setPaddyTypes(prev => prev.map(paddyType => 
      paddyType.id === id 
        ? { ...paddyType, ...paddyTypeData }
        : paddyType
    ));
  };

  const handleDeletePaddyType = (id: string) => {
    if (window.confirm('Are you sure you want to delete this paddy type?')) {
      setPaddyTypes(prev => prev.filter(paddyType => paddyType.id !== id));
    }
  };

  // Sales management functions
  const handleAddSale = (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    const newSale: Sale = {
      ...saleData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setSales(prev => [newSale, ...prev]);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'sales':
        return (
          <NewSaleForm 
            customers={customers} 
            paddyTypes={paddyTypes}
            onAddSale={handleAddSale}
          />
        );
      case 'customers':
        return (
          <CustomerManagement
            customers={customers}
            onAddCustomer={handleAddCustomer}
            onUpdateCustomer={handleUpdateCustomer}
            onDeleteCustomer={handleDeleteCustomer}
          />
        );
      case 'paddyType':
        return (
          <PaddyTypeManagement
            paddyTypes={paddyTypes}
            onAddPaddyType={handleAddPaddyType}
            onUpdatePaddyType={handleUpdatePaddyType}
            onDeletePaddyType={handleDeletePaddyType}
          />
        );
      case 'salesHistory':
        return (
          <SalesHistory
            sales={sales}
            customers={customers}
            paddyTypes={paddyTypes}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            sales={sales}
            customers={customers}
            paddyTypes={paddyTypes}
          />
        );
      case 'salesReport':
        return (
          <SalesReport
            sales={sales}
            customers={customers}
            paddyTypes={paddyTypes}
          />
        );
      case 'expenses':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-600">Expenses</h2>
              <p className="text-gray-500 mt-2">Coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <Settings />
        );
      default:
        return (
          <Dashboard
            sales={sales}
            customers={customers}
            paddyTypes={paddyTypes}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-green-600 to-green-800 text-white shadow-2xl">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-wide">{t('brand')}</h1>
        </div>
        {/* Language Switcher */}
        <div className="px-6 flex gap-2">
          <button onClick={() => changeLang('en')} className={`px-2 py-1 text-xs rounded ${i18n.language==='en' ? 'bg-white text-green-700 font-semibold' : 'bg-green-700'}`}>{t('lang.english')}</button>
          <button onClick={() => changeLang('si')} className={`px-2 py-1 text-xs rounded ${i18n.language==='si' ? 'bg-white text-green-700 font-semibold' : 'bg-green-700'}`}>{t('lang.sinhala')}</button>
        </div>
        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePage(item.id as ActivePage)}
              className={`flex items-center px-6 py-4 cursor-pointer transition-all duration-200 hover:bg-green-700 ${
                activePage === item.id ? 'bg-green-700 border-r-4 border-green-300' : ''
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-gray-800">{t('appTitle')}</h1>
            </div>
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </header>
        {/* Content */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;