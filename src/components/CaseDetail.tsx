import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AlertCircle, Clock, CheckCircle, User, Calendar, FileText, Send, Download } from 'lucide-react';
import FileVideoUpload from './FileVideoUpload';
import { useNotification } from '../contexts/NotificationContext';
import { generateCasePDF } from '../utils/documentGenerator';

interface Case {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in progress' | 'closed';
  createdAt: string;
  assignedTo: string;
  updates: Array<{ id: string; user: string; content: string; createdAt: string }>;
  files: Array<{ id: string; name: string; type: string; uploadedAt: string; uploadedBy: string }>;
}

const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [case_, setCase] = useState<Case | null>(null);
  const [newUpdate, setNewUpdate] = useState('');
  const { addNotification } = useNotification();

  useEffect(() => {
    // In a real application, you would fetch the case data from an API
    const fetchCase = async () => {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCase({
        id: id || '1',
        title: 'Server Outage',
        description: 'The main production server is experiencing downtime affecting all users.',
        status: 'in progress',
        createdAt: '2024-03-15T10:30:00Z',
        assignedTo: 'John Doe',
        updates: [
          { id: '1', user: 'John Doe', content: 'Investigating the root cause of the server outage. Initial findings suggest a potential network issue.', createdAt: '2024-03-15T11:45:00Z' },
          { id: '2', user: 'Jane Smith', content: 'Identified a faulty network switch. Replacing the hardware and monitoring the situation.', createdAt: '2024-03-15T12:30:00Z' },
        ],
        files: [
          { id: '1', name: 'server_logs.txt', type: 'text/plain', uploadedAt: '2024-03-15T11:00:00Z', uploadedBy: 'John Doe' },
          { id: '2', name: 'network_diagram.png', type: 'image/png', uploadedAt: '2024-03-15T12:15:00Z', uploadedBy: 'Jane Smith' },
        ]
      });
    };

    fetchCase();
  }, [id]);

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

  const handleStatusChange = (newStatus: Case['status']) => {
    if (case_) {
      setCase({ ...case_, status: newStatus });
    }
  };

  const handleAddUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (case_ && newUpdate.trim()) {
      const update = {
        id: (case_.updates.length + 1).toString(),
        user: 'Current User', // In a real app, this would be the logged-in user
        content: newUpdate,
        createdAt: new Date().toISOString()
      };
      setCase({ ...case_, updates: [...case_.updates, update] });
      setNewUpdate('');
      addNotification('Update added successfully', 'success');
    }
  };

  const handleExportCase = async () => {
    if (!case_) return;

    try {
      const pdfBlob = await generateCasePDF(case_);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Case_${case_.id}_Export.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      addNotification('Case exported successfully', 'success');
    } catch (error) {
      addNotification('Error exporting case', 'error');
    }
  };

  const handleFileUploadComplete = () => {
    addNotification('Files uploaded successfully', 'success');
    // In a real application, you would refetch the case data here to get the updated file list
  };

  if (!case_) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Case Details</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {getStatusIcon(case_.status)}
            <span className="ml-2 text-lg font-semibold capitalize">{case_.status}</span>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={case_.status}
              onChange={(e) => handleStatusChange(e.target.value as Case['status'])}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <button
              onClick={handleExportCase}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              <Download className="mr-2" size={18} />
              Export Case
            </button>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4">{case_.title}</h2>
        <p className="text-gray-600 mb-6">{case_.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <Calendar className="mr-2 text-gray-400" />
            <span className="text-sm text-gray-600">Created: {new Date(case_.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <User className="mr-2 text-gray-400" />
            <span className="text-sm text-gray-600">Assigned to: {case_.assignedTo}</span>
          </div>
        </div>
        <FileVideoUpload caseId={case_.id} onUploadComplete={handleFileUploadComplete} />
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Files and Evidence</h3>
          <ul className="space-y-2">
            {case_.files.map((file) => (
              <li key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <FileText className="mr-2 text-gray-400" size={18} />
                  <span>{file.name}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Uploaded by {file.uploadedBy} on {new Date(file.uploadedAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Case Updates</h3>
          <div className="space-y-4">
            {case_.updates.map((update) => (
              <div key={update.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <User className="mr-2 text-gray-400" />
                  <span className="font-medium">{update.user}</span>
                  <span className="text-sm text-gray-500 ml-auto">{new Date(update.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-gray-600">{update.content}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Add Update</h3>
          <form onSubmit={handleAddUpdate}>
            <textarea
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
              rows={4}
              placeholder="Enter your update here..."
              value={newUpdate}
              onChange={(e) => setNewUpdate(e.target.value)}
            ></textarea>
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
            >
              <Send className="mr-2" size={18} />
              Submit Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;