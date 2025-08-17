import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  ChevronDown,
  TrendingUp,
  Users,
  Wheat,
  DollarSign,
  BarChart3,
  PieChart,
  Search,
  Printer
} from 'lucide-react';

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

interface SalesReportProps {
  sales: Sale[];
  customers: Customer[];
  paddyTypes: PaddyType[];
}

const SalesReport: React.FC<SalesReportProps> = ({
  sales,
  customers,
  paddyTypes
}) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [paddyTypeFilter, setPaddyTypeFilter] = useState('');
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'customer' | 'paddyType'>('summary');

  // Filter sales based on criteria
  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const matchesDateRange = (!fromDate || saleDate >= fromDate) && (!toDate || saleDate <= toDate);
    const matchesCustomer = !customerFilter || sale.customerId === customerFilter;
    const matchesPaddyType = !paddyTypeFilter || sale.paddyTypeId === paddyTypeFilter;

    return matchesDateRange && matchesCustomer && matchesPaddyType;
  });

  // Calculate summary statistics
  const totalSales = filteredSales.length;
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalWeight = filteredSales.reduce((sum, sale) => sum + sale.totalWeight, 0);
  const totalBundles = filteredSales.reduce((sum, sale) => sum + sale.totalBundles, 0);
  const averageSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0;
  const averageRate = totalWeight > 0 ? totalRevenue / totalWeight : 0;

  // Customer-wise analysis
  const customerAnalysis = customers.map(customer => {
    const customerSales = filteredSales.filter(sale => sale.customerId === customer.id);
    const totalAmount = customerSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalWeight = customerSales.reduce((sum, sale) => sum + sale.totalWeight, 0);
    const totalTransactions = customerSales.length;
    
    return {
      ...customer,
      totalAmount,
      totalWeight,
      totalTransactions,
      averageOrderValue: totalTransactions > 0 ? totalAmount / totalTransactions : 0
    };
  }).filter(customer => customer.totalTransactions > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount);

  // Paddy type analysis
  const paddyTypeAnalysis = paddyTypes.map(paddyType => {
    const typeSales = filteredSales.filter(sale => sale.paddyTypeId === paddyType.id);
    const totalAmount = typeSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalWeight = typeSales.reduce((sum, sale) => sum + sale.totalWeight, 0);
    const totalTransactions = typeSales.length;
    const averageRate = totalWeight > 0 ? totalAmount / totalWeight : 0;
    
    return {
      ...paddyType,
      totalAmount,
      totalWeight,
      totalTransactions,
      averageRate,
      marketShare: totalRevenue > 0 ? (totalAmount / totalRevenue) * 100 : 0
    };
  }).filter(paddyType => paddyType.totalTransactions > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount);

  // Daily sales analysis
  const dailySales = filteredSales.reduce((acc, sale) => {
    const date = sale.date;
    if (!acc[date]) {
      acc[date] = {
        date,
        sales: 0,
        revenue: 0,
        weight: 0,
        bundles: 0
      };
    }
    acc[date].sales += 1;
    acc[date].revenue += sale.totalAmount;
    acc[date].weight += sale.totalWeight;
    acc[date].bundles += sale.totalBundles;
    return acc;
  }, {} as Record<string, any>);

  const dailySalesArray = Object.values(dailySales).sort((a: any, b: any) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getPaddyTypeName = (paddyTypeId: string) => {
    const paddyType = paddyTypes.find(p => p.id === paddyTypeId);
    return paddyType ? paddyType.name : 'Unknown Type';
  };

  const clearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setCustomerFilter('');
    setPaddyTypeFilter('');
  };

  const exportReport = () => {
    // Create CSV content
    let csvContent = '';
    
    if (reportType === 'detailed') {
      csvContent = 'Bill Number,Date,Customer,Paddy Type,Bundles,Weight (kg),Rate,Total Amount\n';
      filteredSales.forEach(sale => {
        csvContent += `${sale.billNumber},${sale.date},${getCustomerName(sale.customerId)},${getPaddyTypeName(sale.paddyTypeId)},${sale.totalBundles},${sale.totalWeight},${sale.rate},${sale.totalAmount}\n`;
      });
    } else if (reportType === 'customer') {
      csvContent = 'Customer Name,Phone,Total Transactions,Total Weight (kg),Total Amount,Average Order Value\n';
      customerAnalysis.forEach(customer => {
        csvContent += `${customer.name},${customer.phone},${customer.totalTransactions},${customer.totalWeight},${customer.totalAmount},${customer.averageOrderValue.toFixed(2)}\n`;
      });
    } else if (reportType === 'paddyType') {
      csvContent = 'Paddy Type,Total Transactions,Total Weight (kg),Total Amount,Average Rate,Market Share (%)\n';
      paddyTypeAnalysis.forEach(paddyType => {
        csvContent += `${paddyType.name},${paddyType.totalTransactions},${paddyType.totalWeight},${paddyType.totalAmount},${paddyType.averageRate.toFixed(2)},${paddyType.marketShare.toFixed(2)}\n`;
      });
    } else {
      csvContent = 'Date,Sales Count,Revenue,Weight (kg),Bundles\n';
      dailySalesArray.forEach((day: any) => {
        csvContent += `${day.date},${day.sales},${day.revenue},${day.weight},${day.bundles}\n`;
      });
    }

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${reportType}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Sales Report</h2>
        <div className="flex gap-2">
          <button
            onClick={exportReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={printReport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 font-medium"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Report Filters
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer
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
              Paddy Type
            </label>
            <div className="relative">
              <select
                value={paddyTypeFilter}
                onChange={(e) => setPaddyTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
              >
                <option value="">All Types</option>
                {paddyTypes.map(paddyType => (
                  <option key={paddyType.id} value={paddyType.id}>{paddyType.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <div className="relative">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
              >
                <option value="summary">Summary</option>
                <option value="detailed">Detailed</option>
                <option value="customer">Customer Analysis</option>
                <option value="paddyType">Paddy Type Analysis</option>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">Rs.{totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
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
              <p className="text-sm font-medium text-gray-600">Avg Sale Value</p>
              <p className="text-2xl font-bold text-gray-900">Rs.{averageSaleValue.toFixed(0)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Report Content */}
      {reportType === 'summary' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Sales Summary</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Count</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bundles</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dailySalesArray.map((day: any) => (
                  <tr key={day.date} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(day.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.sales}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs.{day.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.weight}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.bundles}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'detailed' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Sales Report</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paddy Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.billNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(sale.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getCustomerName(sale.customerId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getPaddyTypeName(sale.paddyTypeId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.totalBundles} bundles<br />
                      <span className="text-gray-500">{sale.totalWeight} kg</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs.{sale.rate.toFixed(2)}/kg</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rs.{sale.totalAmount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'customer' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Analysis Report</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Order Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customerAnalysis.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.totalTransactions}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.totalWeight} kg</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rs.{customer.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs.{customer.averageOrderValue.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'paddyType' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Paddy Type Analysis Report</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paddy Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Share</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paddyTypeAnalysis.map((paddyType) => (
                  <tr key={paddyType.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{paddyType.name}</div>
                        <div className="text-sm text-gray-500">{paddyType.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paddyType.totalTransactions}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paddyType.totalWeight} kg</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rs.{paddyType.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs.{paddyType.averageRate.toFixed(2)}/kg</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paddyType.marketShare.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesReport;