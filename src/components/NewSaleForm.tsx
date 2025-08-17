import React, { useState, useEffect } from 'react';
import { 
  ChevronDown,
  Calendar,
  Plus
} from 'lucide-react';
import ReceiptBill from './ReceiptBill';
import { useTranslation } from 'react-i18next';

interface PaddyEntry {
  id: string;
  bundles: number;
  weight: number;
}

interface FormData {
  customer: string;
  paddyType: string;
  date: string;
  rate: number;
  currentBundle: string;
  currentWeight: string;
}

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

interface NewSaleFormProps {
  customers: Customer[];
  paddyTypes: PaddyType[];
  onAddSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => void;
}

const NewSaleForm: React.FC<NewSaleFormProps> = ({ 
  customers, 
  paddyTypes,
  onAddSale
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    customer: '',
    paddyType: '',
    date: new Date().toISOString().split('T')[0],
    rate: 120.00,
    currentBundle: '',
    currentWeight: ''
  });

  const [paddyEntries, setPaddyEntries] = useState<PaddyEntry[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [showReceipt, setShowReceipt] = useState<boolean>(false);

  const totalBundles = paddyEntries.reduce((sum, entry) => sum + entry.bundles, 0);
  const totalWeight = paddyEntries.reduce((sum, entry) => sum + entry.weight, 0);

  useEffect(() => {
    setTotalPrice(totalWeight * formData.rate);
  }, [totalWeight, formData.rate]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaddyTypeChange = (paddyTypeId: string) => {
    const selectedPaddyType = paddyTypes.find(type => type.id === paddyTypeId);
    setFormData(prev => ({
      ...prev,
      paddyType: paddyTypeId,
      rate: selectedPaddyType ? selectedPaddyType.defaultRate : 120.00
    }));
  };

  const handleAddColumn = () => {
    if (formData.currentBundle && formData.currentWeight) {
      const newEntry: PaddyEntry = {
        id: Date.now().toString(),
        bundles: parseInt(formData.currentBundle),
        weight: parseFloat(formData.currentWeight)
      };
      
      setPaddyEntries(prev => [...prev, newEntry]);
      setFormData(prev => ({
        ...prev,
        currentBundle: '',
        currentWeight: ''
      }));
    }
  };

  const handleRemoveEntry = (id: string) => {
    setPaddyEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const generateBillNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const time = Date.now().toString().slice(-4);
    return `INV${year}${month}${day}${time}`;
  };

  const handleGenerateBill = () => {
    if (paddyEntries.length === 0 || !formData.customer || !formData.paddyType) {
      alert('Please fill all required fields and add at least one paddy entry.');
      return;
    }

    const billNumber = generateBillNumber();
    
    // Save the sale to history
    const saleData: Omit<Sale, 'id' | 'createdAt'> = {
      billNumber,
      customerId: formData.customer,
      paddyTypeId: formData.paddyType,
      entries: paddyEntries,
      rate: formData.rate,
      totalBundles,
      totalWeight,
      totalAmount: totalPrice,
      date: formData.date
    };

    onAddSale(saleData);
    setShowReceipt(true);
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    // Reset form after successful sale
    setFormData({
      customer: '',
      paddyType: '',
      date: new Date().toISOString().split('T')[0],
      rate: 120.00,
      currentBundle: '',
      currentWeight: ''
    });
    setPaddyEntries([]);
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : '';
  };

  const getPaddyTypeName = (paddyTypeId: string) => {
    const paddyType = paddyTypes.find(p => p.id === paddyTypeId);
    return paddyType ? paddyType.name : '';
  };

  const selectedCustomer = customers.find(c => c.id === formData.customer);
  const selectedPaddyType = paddyTypes.find(p => p.id === formData.paddyType);

  return (
    <div className="space-y-6">
      {/* Form Fields */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.selectCustomer')}
            </label>
            <div className="relative">
              <select
                value={formData.customer}
                onChange={(e) => handleInputChange('customer', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
              >
                <option value="">{t('form.chooseCustomer')}</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Paddy Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.paddyType')}
            </label>
            <div className="relative">
              <select
                value={formData.paddyType}
                onChange={(e) => handlePaddyTypeChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
              >
                <option value="">{t('form.choosePaddyType')}</option>
                {paddyTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.date')}
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Bundle and Weight Inputs */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.bundle')}
            </label>
            <input
              type="number"
              value={formData.currentBundle}
              onChange={(e) => handleInputChange('currentBundle', e.target.value)}
              placeholder={t('form.bundle') || 'Bundle'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.weight')}
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.currentWeight}
              onChange={(e) => handleInputChange('currentWeight', e.target.value)}
              placeholder={t('form.weight') || 'Weight'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <button
            onClick={handleAddColumn}
            disabled={!formData.currentBundle || !formData.currentWeight}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            {t('form.addColumn')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Section - Paddy Table */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paddy Bundles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weight (Kg)
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paddyEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.bundles}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.weight}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveEntry(entry.id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paddyEntries.length > 0 && (
                    <tr className="bg-blue-50 font-medium">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                        Total: {totalBundles}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                        Total: {totalWeight}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-blue-900">
                        -
                      </td>
                    </tr>
                  )}
                  {paddyEntries.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                        No entries added yet. Add your first entry above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Section - Summary */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <div className="space-y-6">
              {/* Rate Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Rate (per kg):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.rate}
                  onChange={(e) => handleInputChange('rate', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Total Price Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Price
                </label>
                <div className="text-2xl font-bold text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                  Rs. {totalPrice.toFixed(2)}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Bundles:</span>
                    <div className="font-semibold text-gray-900">{totalBundles}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Weight:</span>
                    <div className="font-semibold text-gray-900">{totalWeight} kg</div>
                  </div>
                </div>
              </div>

              {/* Selected Info */}
              {(formData.customer || formData.paddyType) && (
                <div className="border-t pt-4 space-y-2">
                  {formData.customer && (
                    <div className="text-sm">
                      <span className="text-gray-600">Customer:</span>
                      <div className="font-medium text-gray-900">{getCustomerName(formData.customer)}</div>
                    </div>
                  )}
                  {formData.paddyType && (
                    <div className="text-sm">
                      <span className="text-gray-600">Paddy Type:</span>
                      <div className="font-medium text-gray-900">{getPaddyTypeName(formData.paddyType)}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Generate Bill Button */}
              <button
                onClick={handleGenerateBill}
                disabled={paddyEntries.length === 0 || !formData.customer || !formData.paddyType}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
              >
                Generate Bill
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Bill Modal */}
      {showReceipt && selectedCustomer && selectedPaddyType && (
        <ReceiptBill
          isOpen={showReceipt}
          onClose={handleCloseReceipt}
          customer={selectedCustomer}
          paddyType={selectedPaddyType}
          entries={paddyEntries}
          rate={formData.rate}
          date={formData.date}
          billNumber={generateBillNumber()}
        />
      )}
    </div>
  );
};

export default NewSaleForm;