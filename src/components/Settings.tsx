import React, { useState, useEffect } from 'react';
import { Printer, Monitor, Sliders } from 'lucide-react';

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

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('device');
  const [preferredPrinter, setPreferredPrinter] = useState<string>('');

  useEffect(() => {
    // Load preferred printer from localStorage
    const saved = localStorage.getItem(PREFERRED_PRINTER_KEY);
    if (saved) setPreferredPrinter(saved);
  }, []);

  const handlePrinterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferredPrinter(e.target.value);
    localStorage.setItem(PREFERRED_PRINTER_KEY, e.target.value);
  };

  const handleTestPrint = () => {
    window.print();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'device':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Printer Management</h3>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-4">Select your preferred printer for billing and receipts. (Note: Browsers do not allow direct printer selection, but your choice will be saved for reference.)</p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Printer</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
                  value={preferredPrinter}
                  onChange={handlePrinterChange}
                >
                  <option value="">-- Select Printer --</option>
                  {PRINTERS.map(printer => (
                    <option key={printer} value={printer}>{printer}</option>
                  ))}
                </select>
                {preferredPrinter && (
                  <div className="mt-2 text-green-700 text-sm">Preferred: {preferredPrinter}</div>
                )}
              </div>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                onClick={handleTestPrint}
              >
                Test Print
              </button>
            </div>
          </div>
        );
      case 'appearance':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Appearance</h3>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-4">Customize the look and feel of the application.</p>
              {/* Appearance Settings Placeholder */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Theme</label>
                <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'all':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">All Settings</h3>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-4">Access and manage all available settings for the POS and management system.</p>
              {/* All Settings Placeholder */}
              <ul className="list-disc pl-6 text-gray-700">
                <li>Device (Printer) Management</li>
                <li>Appearance</li>
                <li>User Management (coming soon)</li>
                <li>Backup & Restore (coming soon)</li>
                <li>System Info (coming soon)</li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
      <div className="flex gap-4 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === tab.id ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-green-100'
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