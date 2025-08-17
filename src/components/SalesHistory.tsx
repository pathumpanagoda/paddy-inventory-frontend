import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Eye, 
  Printer, 
  Filter,
  ChevronDown,
  User,
  Wheat,
  Receipt,
  TrendingUp,
  Package
} from 'lucide-react';
import ReceiptBill from './ReceiptBill';

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

interface SalesHistoryProps {
  sales: Sale[];
  customers: Customer[];
  paddyTypes: PaddyType[];
}

const SalesHistory: React.FC<SalesHistoryProps> = ({
  sales,
  customers,
  paddyTypes
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [paddyTypeFilter, setPaddyTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  // Helper functions
  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getCustomer = (customerId: string) => {
    return customers.find(c => c.id === customerId);
  };

  const getPaddyTypeName = (paddyTypeId: string) => {
    const paddyType = paddyTypes.find(p => p.id === paddyTypeId);
    return paddyType ? paddyType.name : 'Unknown Type';
  };

  const getPaddyType = (paddyTypeId: string) => {
    return paddyTypes.find(p => p.id === paddyTypeId);
  };

  // Filter sales based on search and filters
  const filteredSales = sales.filter(sale => {
    const customer = getCustomer(sale.customerId);
    const paddyType = getPaddyType(sale.paddyTypeId);
    
    const matchesSearch = 
      sale.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCustomerName(sale.customerId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getPaddyTypeName(sale.paddyTypeId).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !dateFilter || sale.date === dateFilter;
    const matchesCustomer = !customerFilter || sale.customerId === customerFilter;
    const matchesPaddyType = !paddyTypeFilter || sale.paddyTypeId === paddyTypeFilter;

    return matchesSearch && matchesDate && matchesCustomer && matchesPaddyType;
  });

  // Calculate summary statistics
  const totalSales = filteredSales.length;
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalWeight = filteredSales.reduce((sum, sale) => sum + sale.totalWeight, 0);
  const totalBundles = filteredSales.reduce((sum, sale) => sum + sale.totalBundles, 0);

  const handleViewReceipt = (sale: Sale) => {
    setSelectedSale(sale);
    setShowReceipt(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter('');
    setCustomerFilter('');
    setPaddyTypeFilter('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Sales History</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 font-medium"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
            </div>
            <Receipt className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">Rs.{totalRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Weight</p>
              <p className="text-2xl font-bold text-gray-900">{totalWeight} kg</p>
            </div>
            <Wheat className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bundles</p>
              <p className="text-2xl font-bold text-gray-900">{totalBundles}</p>
            </div>
            <Package className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by bill number, customer name, or paddy type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Customer
              </label>
              <div className="relative">
                <select
                  value={customerFilter}
                  onChange={(e) => setCustomerFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
                >
                  <option value="">All Customers</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Paddy Type
              </label>
              <div className="relative">
                <select
                  value={paddyTypeFilter}
                  onChange={(e) => setPaddyTypeFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
                >
                  <option value="">All Paddy Types</option>
                  {paddyTypes.map(paddyType => (
                    <option key={paddyType.id} value={paddyType.id}>{paddyType.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bill Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paddy Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{sale.billNumber}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(sale.createdAt).toLocaleTimeString('en-GB', { hour12: false })}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {getCustomerName(sale.customerId)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Wheat className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {getPaddyTypeName(sale.paddyTypeId)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{sale.totalBundles} Bundles</div>
                      <div className="text-gray-500">{sale.totalWeight} kg</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs.{sale.rate.toFixed(2)}/kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Rs.{sale.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sale.date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewReceipt(sale)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        title="View Receipt"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewReceipt(sale)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Print Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                    {searchTerm || dateFilter || customerFilter || paddyTypeFilter
                      ? 'No sales found matching your search criteria.'
                      : 'No sales recorded yet. Start by creating your first sale.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && selectedSale && (
        <ReceiptBill
          isOpen={showReceipt}
          onClose={() => {
            setShowReceipt(false);
            setSelectedSale(null);
          }}
          customer={getCustomer(selectedSale.customerId)!}
          paddyType={getPaddyType(selectedSale.paddyTypeId)!}
          entries={selectedSale.entries}
          rate={selectedSale.rate}
          date={selectedSale.date}
          billNumber={selectedSale.billNumber}
        />
      )}
    </div>
  );
};

export default SalesHistory;