import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Wheat, 
  Receipt, 
  DollarSign,
  Calendar,
  Package,
  BarChart3,
  PieChart,
  Activity
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

interface DashboardProps {
  sales: Sale[];
  customers: Customer[];
  paddyTypes: PaddyType[];
}

const Dashboard: React.FC<DashboardProps> = ({
  sales,
  customers,
  paddyTypes
}) => {
  // Calculate statistics
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalWeight = sales.reduce((sum, sale) => sum + sale.totalWeight, 0);
  const totalBundles = sales.reduce((sum, sale) => sum + sale.totalBundles, 0);
  const totalCustomers = customers.length;
  const totalPaddyTypes = paddyTypes.length;

  // Calculate today's sales
  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(sale => sale.date === today);
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  // Calculate this month's sales
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
  });
  const monthRevenue = monthSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  // Calculate average sale value
  const averageSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Get top customers by purchase amount
  const customerSales = customers.map(customer => {
    const customerSalesData = sales.filter(sale => sale.customerId === customer.id);
    const totalAmount = customerSalesData.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalTransactions = customerSalesData.length;
    return {
      ...customer,
      totalAmount,
      totalTransactions
    };
  }).sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 5);

  // Get paddy type sales distribution
  const paddyTypeSales = paddyTypes.map(paddyType => {
    const typeSales = sales.filter(sale => sale.paddyTypeId === paddyType.id);
    const totalAmount = typeSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalWeight = typeSales.reduce((sum, sale) => sum + sale.totalWeight, 0);
    const totalTransactions = typeSales.length;
    return {
      ...paddyType,
      totalAmount,
      totalWeight,
      totalTransactions
    };
  }).sort((a, b) => b.totalAmount - a.totalAmount);

  // Get recent sales (last 5)
  const recentSales = sales.slice(0, 5);

  // Get sales trend for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const salesTrend = last7Days.map(date => {
    const daySales = sales.filter(sale => sale.date === date);
    const dayRevenue = daySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    return {
      date,
      sales: daySales.length,
      revenue: dayRevenue
    };
  });

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getPaddyTypeName = (paddyTypeId: string) => {
    const paddyType = paddyTypes.find(p => p.id === paddyTypeId);
    return paddyType ? paddyType.name : 'Unknown Type';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Sales</p>
              <p className="text-3xl font-bold">{totalSales}</p>
              <p className="text-blue-100 text-xs mt-1">All time transactions</p>
            </div>
            <Receipt className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold">Rs.{(totalRevenue / 1000).toFixed(0)}K</p>
              <p className="text-green-100 text-xs mt-1">All time earnings</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Total Weight</p>
              <p className="text-3xl font-bold">{(totalWeight / 1000).toFixed(1)}T</p>
              <p className="text-yellow-100 text-xs mt-1">Paddy sold (tons)</p>
            </div>
            <Wheat className="w-12 h-12 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Active Customers</p>
              <p className="text-3xl font-bold">{totalCustomers}</p>
              <p className="text-purple-100 text-xs mt-1">Registered customers</p>
            </div>
            <Users className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Sales</p>
              <p className="text-2xl font-bold text-gray-900">{todaySales.length}</p>
              <p className="text-sm text-indigo-600 font-medium">Rs.{todayRevenue.toLocaleString()}</p>
            </div>
            <Calendar className="w-8 h-8 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{monthSales.length}</p>
              <p className="text-sm text-orange-600 font-medium">Rs.{monthRevenue.toLocaleString()}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Sale Value</p>
              <p className="text-2xl font-bold text-gray-900">Rs.{averageSaleValue.toFixed(0)}</p>
              <p className="text-sm text-teal-600 font-medium">Per transaction</p>
            </div>
            <Activity className="w-8 h-8 text-teal-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Sales Trend (Last 7 Days)
          </h3>
          <div className="space-y-3">
            {salesTrend.map((day, index) => {
              const maxRevenue = Math.max(...salesTrend.map(d => d.revenue));
              const widthPercentage = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
              
              return (
                <div key={day.date} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-gray-600">
                    {new Date(day.date).toLocaleDateString('en-GB', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{day.sales} sales</span>
                      <span className="text-sm text-gray-500">Rs.{day.revenue.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${widthPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Top Customers
          </h3>
          <div className="space-y-4">
            {customerSales.map((customer, index) => (
              <div key={customer.id} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{customer.name}</span>
                    <span className="text-sm font-bold text-gray-900">Rs.{customer.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{customer.phone}</span>
                    <span>{customer.totalTransactions} transactions</span>
                  </div>
                </div>
              </div>
            ))}
            {customerSales.length === 0 && (
              <p className="text-center text-gray-500 py-4">No customer data available</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paddy Type Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-yellow-600" />
            Paddy Type Sales
          </h3>
          <div className="space-y-4">
            {paddyTypeSales.map((paddyType, index) => {
              const maxAmount = Math.max(...paddyTypeSales.map(p => p.totalAmount));
              const widthPercentage = maxAmount > 0 ? (paddyType.totalAmount / maxAmount) * 100 : 0;
              const colors = ['bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-red-500'];
              
              return (
                <div key={paddyType.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                      <span className="font-medium text-gray-900">{paddyType.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">Rs.{paddyType.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${colors[index % colors.length]}`}
                      style={{ width: `${widthPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{paddyType.totalWeight} kg</span>
                    <span>{paddyType.totalTransactions} sales</span>
                  </div>
                </div>
              );
            })}
            {paddyTypeSales.length === 0 && (
              <p className="text-center text-gray-500 py-4">No paddy type data available</p>
            )}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-green-600" />
            Recent Sales
          </h3>
          <div className="space-y-4">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{sale.billNumber}</span>
                    <span className="text-sm font-bold text-gray-900">Rs.{sale.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{getCustomerName(sale.customerId)}</span>
                    <span>{new Date(sale.date).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {getPaddyTypeName(sale.paddyTypeId)} • {sale.totalWeight} kg
                  </div>
                </div>
              </div>
            ))}
            {recentSales.length === 0 && (
              <p className="text-center text-gray-500 py-4">No recent sales</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Package className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{totalBundles}</div>
            <div className="text-sm text-gray-600">Total Bundles</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Wheat className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{totalPaddyTypes}</div>
            <div className="text-sm text-gray-600">Paddy Types</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <DollarSign className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">Rs.{(totalRevenue / totalWeight).toFixed(0)}</div>
            <div className="text-sm text-gray-600">Avg Rate/kg</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Activity className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{(totalWeight / totalBundles).toFixed(1)}</div>
            <div className="text-sm text-gray-600">Avg kg/Bundle</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;