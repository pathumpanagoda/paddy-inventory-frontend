import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Save, X, Wheat } from 'lucide-react';

interface PaddyType {
  id: string;
  name: string;
  description: string;
  defaultRate: number;
  createdAt: string;
}

interface PaddyTypeManagementProps {
  paddyTypes: PaddyType[];
  onAddPaddyType: (paddyType: Omit<PaddyType, 'id' | 'createdAt'>) => void;
  onUpdatePaddyType: (id: string, paddyType: Omit<PaddyType, 'id' | 'createdAt'>) => void;
  onDeletePaddyType: (id: string) => void;
}

const PaddyTypeManagement: React.FC<PaddyTypeManagementProps> = ({
  paddyTypes,
  onAddPaddyType,
  onUpdatePaddyType,
  onDeletePaddyType
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    defaultRate: 120
  });

  const filteredPaddyTypes = paddyTypes.filter(paddyType =>
    paddyType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paddyType.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdatePaddyType(editingId, formData);
      setEditingId(null);
    } else {
      onAddPaddyType(formData);
      setShowAddForm(false);
    }
    setFormData({ name: '', description: '', defaultRate: 120 });
  };

  const handleEdit = (paddyType: PaddyType) => {
    setFormData({
      name: paddyType.name,
      description: paddyType.description,
      defaultRate: paddyType.defaultRate
    });
    setEditingId(paddyType.id);
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '', defaultRate: 120 });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleAddNew = () => {
    setShowAddForm(true);
    setEditingId(null);
    setFormData({ name: '', description: '', defaultRate: 120 });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Paddy Type Management</h2>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" />
          Add New Paddy Type
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search paddy types by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Paddy Type' : 'Add New Paddy Type'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paddy Type Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter paddy type name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Rate (per kg) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.defaultRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, defaultRate: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter default rate"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter description (optional)"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 font-medium"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Update Paddy Type' : 'Add Paddy Type'}
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

      {/* Paddy Type List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paddy Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Default Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
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
              {filteredPaddyTypes.map((paddyType) => (
                <tr key={paddyType.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Wheat className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{paddyType.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs. {paddyType.defaultRate.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {paddyType.description || 'No description'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(paddyType.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(paddyType)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeletePaddyType(paddyType.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPaddyTypes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    {searchTerm ? 'No paddy types found matching your search.' : 'No paddy types added yet. Add your first paddy type above.'}
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

export default PaddyTypeManagement;