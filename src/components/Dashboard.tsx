import React from 'react';
import { AlertCircle, CheckCircle, Clock, Users, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data for demonstration
  const stats = {
    totalCases: 150,
    openCases: 45,
    inProgressCases: 30,
    closedCases: 75,
    totalUsers: 25,
  };

  const caseData = [
    { name: 'Open', value: stats.openCases },
    { name: 'In Progress', value: stats.inProgressCases },
    { name: 'Closed', value: stats.closedCases },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.email}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <DashboardCard title="Total Cases" value={stats.totalCases} icon={<FileText size={24} />} color="bg-blue-500" />
        <DashboardCard title="Open Cases" value={stats.openCases} icon={<AlertCircle size={24} />} color="bg-yellow-500" />
        <DashboardCard title="In Progress" value={stats.inProgressCases} icon={<Clock size={24} />} color="bg-orange-500" />
        <DashboardCard title="Closed Cases" value={stats.closedCases} icon={<CheckCircle size={24} />} color="bg-green-500" />
        <DashboardCard title="Total Users" value={stats.totalUsers} icon={<Users size={24} />} color="bg-purple-500" />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Case Status Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={caseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className={`${color} rounded-lg shadow-md p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="bg-white bg-opacity-30 rounded-full p-3">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;