import React, { useState, useEffect } from 'react';
import { Clock, Search, ChevronDown, ChevronUp, Calendar, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Axios from '../utils/axiosConfig';

const CandidateHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await Axios.get('/candidates/logs/all');
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching candidate logs', err);
    } finally {
      setLoading(false);
    }
  };

  // Group logs by candidate
  const groupedCandidates = Object.values(
    logs.reduce((acc, log) => {
      if (!log.candidate) return acc;
      const cid = log.candidate._id;
      if (!acc[cid]) {
        acc[cid] = {
          candidate: log.candidate,
          logs: [],
          // Since logs are sorted newest first, the first log we encounter for a candidate has their latest status
          latestStatus: log.newStatus || 'Waiting',
          latestUpdate: log.createdAt,
        };
      }
      acc[cid].logs.push(log);
      return acc;
    }, {})
  );

  const filteredCandidates = groupedCandidates.filter(group => {
    const term = searchTerm.toLowerCase();
    return (
      group.candidate.fullName?.toLowerCase().includes(term) ||
      group.candidate.candidateId?.toLowerCase().includes(term)
    );
  });

  const handleRowClick = (id) => {
    navigate(`/candidate-history/${id}`);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-5 h-5 text-zinc-500" /> Candidate History
          </h1>
          <p className="text-xs text-zinc-500 font-medium mt-1">
            System-wide tracking of candidate statuses and interview histories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              type="text"
              placeholder="Search candidate name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-zinc-900 transition-colors shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">Candidate</th>
                <th className="p-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">Contact Info</th>
                <th className="p-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">Current Status</th>
                <th className="p-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">Latest Update</th>
                <th className="p-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs text-zinc-400 font-semibold">Loading candidates...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-xs text-zinc-400 font-semibold">
                    No candidates found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((group) => (
                  <React.Fragment key={group.candidate._id}>
                    <tr 
                      onClick={() => handleRowClick(group.candidate._id)}
                      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors cursor-pointer"
                    >
                      <td className="p-4 whitespace-nowrap">
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 capitalize">{group.candidate.fullName}</p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{group.candidate.candidateId}</p>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <p className="text-xs text-zinc-700 dark:text-zinc-300">{group.candidate.email}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{group.candidate.phone}</p>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm border ${
                          group.latestStatus === 'Selected' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900' :
                          group.latestStatus === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900' :
                          group.latestStatus === 'Hold' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900' :
                          'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
                        }`}>
                          {group.latestStatus}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          {new Date(group.latestUpdate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                          {new Date(group.latestUpdate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                      <td className="p-4 text-right">
                        <button className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-colors shadow-sm">
                          View History
                        </button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CandidateHistory;
