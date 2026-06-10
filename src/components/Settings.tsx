import React, { useState, useEffect } from 'react';
import { Printer, Monitor, Sliders, Save, Moon, Sun, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TABS = [
  { id: 'device', label: 'Device (Printer) Management', icon: Printer },
  { id: 'appearance', label: 'Appearance', icon: Monitor },
  { id: 'all', label: 'All Settings', icon: Sliders },
];

const PRINTERS = [
  'Printer 1',
  'Printer 2',
  'Printer 3',
];

const PREFERRED_PRINTER_KEY = 'preferredPrinter';
const BUSINESS_SETTINGS_KEY = 'businessSettings';
const THEME_KEY = 'theme';

interface BusinessSettings {
  name: string;
  address: string;
  phone: string;
  gstin: string;
  paperSize: '80mm' | '58mm';
}

const DEFAULT_SETTINGS: BusinessSettings = {
  name: 'NIMSARA SAHAL',
  address: 'KOLLAM, KERALA.',
  phone: '+94 77 123 4567',
  gstin: '32IDNAP1991T1Z8',
  paperSize: '80mm'
};

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('device');
  const [preferredPrinter, setPreferredPrinter] = useState<string>('');
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(DEFAULT_SETTINGS);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [saveStatus, setSaveStatus] = useState<string>('');

  useEffect(() => {
    // Load settings from localStorage
    const savedPrinter = localStorage.getItem(PREFERRED_PRINTER_KEY);
    if (savedPrinter) setPreferredPrinter(savedPrinter);

    const savedBusiness = localStorage.getItem(BUSINESS_SETTINGS_KEY);
    if (savedBusiness) {
      setBusinessSettings(JSON.parse(savedBusiness));
    }

    const savedTheme = localStorage.getItem(THEME_KEY) as 'light' | 'dark';
    if (savedTheme) setTheme(savedTheme);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  }, []);

  useEffect(() => {
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const handlePrinterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferredPrinter(e.target.value);
    localStorage.setItem(PREFERRED_PRINTER_KEY, e.target.value);
  };

  const handleSettingChange = (field: keyof BusinessSettings, value: string) => {
    setBusinessSettings(prev => ({ ...prev, [field]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem(BUSINESS_SETTINGS_KEY, JSON.stringify(businessSettings));
    setSaveStatus('Settings saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleTestPrint = () => {
    window.print();
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'device':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Printer Management</h3>
              {saveStatus && <span className="text-green-600 text-sm font-medium animate-fade-in">{saveStatus}</span>}
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
              {/* Printer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Printer</label>
                <div className="flex gap-4">
                  <select
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    value={preferredPrinter}
                    onChange={handlePrinterChange}
                  >
                    <option value="">-- Select Printer --</option>
                    {PRINTERS.map(printer => (
                      <option key={printer} value={printer}>{printer}</option>
                    ))}
                  </select>
                  <button
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    onClick={handleTestPrint}
                  >
                    Test Print
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Note: Browser security prevents direct printer selection. This setting is for reference.
                </p>
              </div>

              <div className="border-t dark:border-gray-700 pt-6">
                <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Receipt Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Name</label>
                    <input
                      type="text"
                      value={businessSettings.name}
                      onChange={(e) => handleSettingChange('name', e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="text"
                      value={businessSettings.phone}
                      onChange={(e) => handleSettingChange('phone', e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
                    <input
                      type="text"
                      value={businessSettings.address}
                      onChange={(e) => handleSettingChange('address', e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GSTIN / Tax ID</label>
                    <input
                      type="text"
                      value={businessSettings.gstin}
                      onChange={(e) => handleSettingChange('gstin', e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paper Size</label>
                    <select
                      value={businessSettings.paperSize}
                      onChange={(e) => handleSettingChange('paperSize', e.target.value as '80mm' | '58mm')}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="80mm">80mm (Standard)</option>
                      <option value="58mm">58mm (Small)</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={saveSettings}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <Save className="w-4 h-4" />
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'appearance':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Appearance</h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
              
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  {theme === 'light' ? <Sun className="w-6 h-6 text-orange-500" /> : <Moon className="w-6 h-6 text-blue-400" />}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">App Theme</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark mode</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    theme === 'dark' ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Language Selection */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Language</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred language</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      i18n.language === 'en' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage('si')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      i18n.language === 'si' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    Sinhala
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      case 'all':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">All Settings</h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-6">Access and manage all available settings for the POS and management system.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setActiveTab('device')}
                  className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <Printer className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Device (Printer) Management</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Configure printers and receipt details</div>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveTab('appearance')}
                  className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <Monitor className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Appearance</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Theme and language settings</div>
                  </div>
                </button>

                <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg opacity-60 cursor-not-allowed">
                  <Sliders className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">System Info</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Coming soon</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Settings</h2>
      <div className="flex flex-wrap gap-4 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === tab.id 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-green-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>
      <div>{renderTabContent()}</div>
    </div>
  );
};

export default Settings;