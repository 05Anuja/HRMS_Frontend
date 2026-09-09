import React, { useState, useEffect } from 'react';
import Axios from '../utils/axiosConfig';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Award, 
  TrendingUp,
  Briefcase,
  UserCheck
} from 'lucide-react';

const Dashboard = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    totalToday: 0,
    interviewsCompleted: 0,
    selectedCandidates: 0,
    rejectedCandidates: 0,
    interviewPending: 0,
    averageInterviewScore: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async (start = startDate, end = endDate) => {
    try {
      const params = {};
      if (start) params.startDate = start;
      if (end) params.endDate = end;
      
      const response = await Axios.get('/candidates/stats', { params });
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(startDate, endDate);
    const interval = setInterval(() => fetchStats(startDate, endDate), 10000);
    return () => clearInterval(interval);
  }, [startDate, endDate]);

  const cardData = [
    {
      title: 'Total Candidates Today',
      value: stats.totalToday,
      sub: `Registered total: ${stats.total}`,
      icon: Users,
    },
    {
      title: 'Interviews Completed',
      value: stats.interviewsCompleted,
      sub: 'Evaluations submitted',
      icon: CheckCircle,
    },
    {
      title: 'Selected Candidates',
      value: stats.selectedCandidates,
      sub: 'Selected candidates',
      icon: UserCheck,
    },
    {
      title: 'Rejected Candidates',
      value: stats.rejectedCandidates,
      sub: 'Rejected candidates',
      icon: XCircle,
    },
    {
      title: 'Interview Pending',
      value: stats.interviewPending,
      sub: 'In pipeline stages',
      icon: Clock,
    },
    {
      title: 'Average Interview Score',
      value: `${stats.averageInterviewScore}/5`,
      sub: 'Assessed average',
      icon: Award,
    }
  ];

  if (loading) {
    return (
      <div className="p-4 min-h-screen bg-[#FAF9F6] dark:bg-black flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-zinc-500 font-medium text-xs">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#FAF9F6] dark:bg-zinc-950 space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/60 pb-4">
        <div>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            Recruitment Analytics
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-900 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-zinc-950"></span>
            </span>
          </h1>
          <p className="text-zinc-500 text-xs mt-0.5 font-medium">Real-time candidate metrics and pipeline details.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Picker */}
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg shadow-sm">
            <div className="flex items-center gap-1">
              <span className="text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent border-0 text-xs font-bold text-zinc-700 dark:text-zinc-300 focus:ring-0 outline-none p-0 cursor-pointer"
              />
            </div>
            <div className="h-3 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex items-center gap-1">
              <span className="text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent border-0 text-xs font-bold text-zinc-700 dark:text-zinc-300 focus:ring-0 outline-none p-0 cursor-pointer"
              />
            </div>
            {(startDate || endDate) && (
              <>
                <div className="h-3 w-px bg-zinc-200 dark:bg-zinc-800" />
                <button
                  onClick={() => { setStartDate(''); setEndDate(''); }}
                  className="text-xs font-extrabold text-rose-500 hover:text-rose-650 dark:hover:text-rose-450 uppercase tracking-wider cursor-pointer border-0 bg-transparent"
                >
                  Clear
                </button>
              </>
            )}
          </div>

          <div className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-widest self-start">
            <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
            Silgate Portal
          </div>
        </div>
      </div>

      {/* Grid: Minimal Black Theme Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cardData.map((card, index) => {
          const Icon = card.icon;
          return (
            <div 
              key={index}
              className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 transition-all duration-300 flex items-center justify-between"
            >
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{card.title}</p>
                <div className="space-y-0.5">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{card.value}</h3>
                  <p className="text-xs text-zinc-500 font-medium">{card.sub}</p>
                </div>
              </div>
              
              <div className="w-10 h-10 rounded-lg bg-zinc-900 dark:bg-zinc-800 text-white flex items-center justify-center shadow-sm">
                <Icon className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline Progress Section */}
      <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Pipeline Progression</h2>
            <p className="text-xs text-zinc-500">Recruitment stages ratio calculated across total candidates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Waiting/Registered', value: stats.interviewPending, max: stats.total, color: 'bg-zinc-600' },
            { label: 'Interviews Evaluated', value: stats.interviewsCompleted, max: stats.total, color: 'bg-zinc-800' },
            { label: 'Approved (Selected)', value: stats.selectedCandidates, max: stats.total, color: 'bg-zinc-950' },
            { label: 'Not Selected (Rejected)', value: stats.rejectedCandidates, max: stats.total, color: 'bg-zinc-400' }
          ].map((bar, i) => {
            const percentage = bar.max > 0 ? Math.round((bar.value / bar.max) * 100) : 0;
            return (
              <div key={i} className="space-y-2 p-3 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200/60 dark:border-zinc-800">
                <div className="flex justify-between items-center text-xs font-bold text-zinc-600 dark:text-zinc-400">
                  <span>{bar.label}</span>
                  <span className="font-mono text-zinc-900 dark:text-zinc-100">{percentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${bar.color} rounded-full transition-all duration-700`} 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-zinc-400">
                  <span>{bar.value} Candidates</span>
                  <span>Total: {bar.max}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
