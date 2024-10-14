import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Clock, CheckCircle, Search, Plus } from 'lucide-react';

interface Case {
  id: string;
  title: string;
  status: 'open' | 'in progress' | 'closed';
  createdAt: string;
}

const CaseList: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [casesPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingCase, setIsCreatingCase] = useState(false);
  const [newCase, setNewCase] = useState({ title: '', description: '' });

  useEffect(() => {
    // Mock data for demonstration
    const mockCases: Case[] = Array.from({ length: 50 }, (_, index) => ({
      id: (index + 1).toString(),
      title: `Case ${index + 1}`,
      status: ['open', 'in progress', 'closed'][Math.floor(Math.random() * 3)] as 'open' | 'in progress' | 'closed',
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    }));
    setCases(mockCases);
  }, []);

  useEffect(() => {
    let result = cases;
    if (statusFilter !== 'all') {
      result = result.filter(case_ => case_.status === statusFilter);
    }
    if (searchTerm) {
      result = result.filter(case_ => 
        case_.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredCases(result);
    setCurrentPage(1);
  }, [cases, statusFilter, searchTerm]);

  const getStatusIcon = (status: Case['status']) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="text-yellow-500" />;
      case 'in progress':
        return <Clock className="text-orange-500" />;
      case 'closed':
        return <CheckCircle className="text-green-500" />;
    }
  };

  // Get current cases
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = filteredCases.slice(indexOfFirstCase, indexOfLastCase);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would make an API call to create the case
    const newCaseData: Case = {
      id: (cases.length + 1).toString(),
      title: newCase.title,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setCases([newCaseData, ...cases]);
    setIsCreatingCase(false);
    setNewCase({ title: '', description: '' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cases</h1>
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-2 md:mb-0">
          <label htmlFor="status-filter" className="mr-2">Filter by status:</label>
          <select
            id="status-filter"
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search cases..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={() => setIsCreatingCase(true)}
      >
        <Plus className="inline-block mr-2" size={18} />
        Create New Case
      </button>
      {isCreatingCase && (
        <form onSubmit={handleCreateCase} className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Create New Case</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Case Title"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newCase.title}
              onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Case Description"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={newCase.description}
              onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              onClick={() => setIsCreatingCase(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Create Case
            </button>
          </div>
        </form>
      )}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCases.map((case_) => (
              <tr key={case_.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(case_.status)}
                    <span className="ml-2 text-sm text-gray-900 capitalize">{case_.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{case_.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{new Date(case_.createdAt).toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/cases/${case_.id}`} className="text-indigo-600 hover:text-indigo-900">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          {Array.from({ length: Math.ceil(filteredCases.length / casesPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                currentPage === index + 1
                  ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CaseList;