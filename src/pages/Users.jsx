import React, { useState, useEffect } from 'react';
import DynamicTable from '../components/common/DynamicTable';
import DynamicForm from '../components/common/DynamicForm';
import Axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { ArrowLeft, UserPlus } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await Axios.get('/users/hr');
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = () => {
    setSelectedUser(null);
    setView('form');
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setView('form');
  };

  const handleSubmit = async (formData) => {
    if ((!selectedUser || formData.password) && formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      let response;
      if (selectedUser) {
        response = await Axios.put(`/users/hr/${selectedUser._id}`, formData);
      } else {
        response = await Axios.post('/users/hr', formData);
      }
      
      if (response.data.success) {
        toast.success(`HR user ${selectedUser ? 'updated' : 'created'} successfully`);
        setView('list');
        fetchUsers();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const response = await Axios.patch(`/users/hr/${user._id}/status`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchUsers();
      }
    } catch (error) {
    }
  };

  const columns = [
    { 
      key: 'fullName', 
      label: 'Full Name',
      render: (val) => <span className="font-bold text-zinc-900 dark:text-white capitalize">{val}</span>
    },
    { key: 'email', label: 'Email' },
    { key: 'mobileNumber', label: 'Mobile' },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (val, row) => (
        <button 
          onClick={() => handleToggleStatus(row)}
          className={`px-2.5 py-0.5 rounded text-xs font-bold cursor-pointer transition-all border uppercase tracking-wider ${
            val 
              ? 'bg-zinc-950 border-zinc-950 text-white hover:bg-zinc-850' 
              : 'bg-zinc-50 border-zinc-250 text-zinc-400 hover:bg-zinc-100'
          }`}
        >
          {val ? 'ACTIVE' : 'INACTIVE'}
        </button>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Created At',
      render: (val) => new Date(val).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    },
  ];

  const formFields = [
    { name: 'fullName', label: 'Full Name', required: true, placeholder: 'Enter full name' },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Enter email address' },
    { 
      name: 'mobileNumber', 
      label: 'Mobile Number', 
      required: true,
      placeholder: 'Enter 10-digit mobile',
      minLength: { value: 10, message: 'Mobile number must be 10 digits' },
      maxLength: { value: 10, message: 'Mobile number must be 10 digits' },
      pattern: { value: /^[0-9]+$/, message: 'Please enter only numbers' }
    },
    { 
      name: 'password', 
      label: selectedUser ? 'New Password (leave blank to keep unchanged)' : 'Password', 
      type: 'password', 
      required: !selectedUser, 
      placeholder: selectedUser ? 'Enter new password' : 'Password' 
    },
    { 
      name: 'confirmPassword', 
      label: selectedUser ? 'Confirm New Password' : 'Confirm Password', 
      type: 'password', 
      required: !selectedUser, 
      placeholder: selectedUser ? 'Confirm new password' : 'Confirm Password' 
    },
  ];

  const filteredUsers = users.filter(user => 
    (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.mobileNumber && user.mobileNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const tableData = filteredUsers.map(u => ({
    ...u,
    onEdit: () => handleEdit(u),
  }));

  return (
    <div className="p-4 min-h-screen bg-[#FAF9F6] dark:bg-zinc-950 text-xs text-zinc-800">
      {view === 'list' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-end pb-2 border-b border-zinc-200/60">
            <div>
              <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-100">HR Management</h1>
              <p className="text-zinc-500 text-xs mt-0.5">Manage HR user system credentials and permissions.</p>
            </div>
            <button 
              onClick={handleCreate}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" /> Add HR User
            </button>
          </div>
          
          <DynamicTable
            title="Registered HR Admins"
            columns={columns}
            data={tableData}
            loading={loading}
            actions={['edit']}
            onSearch={(term) => setSearchTerm(term)}
          />
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-300">
          <button 
            onClick={() => setView('list')}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition-colors text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to HR Admins List
          </button>
          
          <DynamicForm
            title={selectedUser ? `Edit HR: ${selectedUser.fullName}` : 'Create New HR User'}
            fields={formFields}
            defaultValues={selectedUser}
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel={selectedUser ? 'Update HR' : 'Create HR'}
          />
        </div>
      )}
    </div>
  );
};

export default Users;
