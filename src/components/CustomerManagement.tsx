import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Save, X, User } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  createdAt: string;
}

interface CustomerManagementProps {
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  onUpdateCustomer: (id: string, customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  onDeleteCustomer: (id: string) => void;
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: ''
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateCustomer(editingId, formData);
      setEditingId(null);
    } else {
      onAddCustomer(formData);
      setShowAddForm(false);
    }
    setFormData({ name: '', phone: '', address: '', email: '' });
  };

  const handleEdit = (customer: Customer) => {
    setFormData({
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      email: customer.email
    });
    setEditingId(customer.id);
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setFormData({ name: '', phone: '', address: '', email: '' });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleAddNew = () => {
    setShowAddForm(true);
    setEditingId(null);
    setFormData({ name: '', phone: '', address: '', email: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" />
          Add New Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search customers by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Customer' : 'Add New Customer'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter address"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 font-medium"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Update Customer' : 'Add Customer'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2 font-medium"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Customer List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.address || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteCustomer(customer.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    {searchTerm ? 'No customers found matching your search.' : 'No customers added yet. Add your first customer above.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;