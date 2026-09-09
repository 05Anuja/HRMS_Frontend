import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Calendar, UserCheck, ArrowLeft } from 'lucide-react';
import Axios from '../utils/axiosConfig';

const CandidateHistoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [id]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await Axios.get(`/candidates/${id}/logs`);
      if (res.data.success) {
        setLogs(res.data.data);
        if (res.data.data.length > 0) {
          // Since standard /logs returns populated performedBy but not candidate, 
          // we might need to fetch the candidate separately if we want full details.
          // However, for just the history timeline, the logs are enough.
        }
      }
      
      // Also fetch candidate details for the header
      const candRes = await Axios.get(`/candidates/${id}`);
      if (candRes.data.success) {
        setCandidate(candRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching candidate logs', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status, action) => {
    const s = status || '';
    if (s === 'Selected') return 'before:border-emerald-500 dark:before:border-emerald-500';
    if (s === 'Rejected') return 'before:border-rose-500 dark:before:border-rose-500';
    if (s === 'Hold') return 'before:border-amber-500 dark:before:border-amber-500';
    if (s === 'Waiting') return 'before:border-blue-500 dark:before:border-blue-500';
    if (s === 'In Progress' || s === 'Second Round' || s === 'Final Round') return 'before:border-purple-500 dark:before:border-purple-500';
    if (s === 'Approved') return 'before:border-teal-500 dark:before:border-teal-500';
    
    if (action === 'Re-Interview Started') return 'before:border-blue-500 dark:before:border-blue-500';
    if (action === 'Section Evaluation Submitted') return 'before:border-indigo-500 dark:before:border-indigo-500';
    return 'before:border-zinc-400 dark:before:border-zinc-500';
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/candidate-history')}
          className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-5 h-5 text-zinc-500" /> 
            {candidate ? `${candidate.fullName}'s History` : 'Candidate History'}
          </h1>
          <p className="text-xs text-zinc-500 font-medium mt-1">
            {candidate ? `ID: ${candidate.candidateId} • Current Status: ${candidate.status}` : 'Loading candidate details...'}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden p-8">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-zinc-400 font-semibold">Loading timeline...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-20 text-center text-zinc-400 font-medium">
            No history logs found for this candidate.
          </div>
        ) : (
          <div>
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Comprehensive Timeline
            </h4>
            
            <div className="space-y-8 border-l-2 border-zinc-200 dark:border-zinc-800 ml-4">
              {logs.map((log) => (
                <div key={log._id} className={`relative pl-8 before:content-[''] before:absolute before:-left-[9px] before:top-1.5 before:w-4 before:h-4 before:rounded-full before:bg-white dark:before:bg-zinc-950 before:border-4 ${getStatusColor(log.newStatus, log.action)}`}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/20 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 transition-all hover:shadow-md">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-base font-black text-zinc-900 dark:text-zinc-100 tracking-wide">{log.action}</p>
                        {log.newStatus && (
                          <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-400 shadow-sm border border-zinc-200 dark:border-zinc-700">
                            Status: {log.oldStatus && log.oldStatus !== log.newStatus ? <span className="line-through opacity-60 mr-1">{log.oldStatus}</span> : ''}{log.newStatus}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl font-medium">
                        {log.details || 'No additional details provided.'}
                      </p>
                    </div>
                    
                    <div className="text-left md:text-right bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm min-w-[180px]">
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center md:justify-end gap-1.5 mb-1 capitalize">
                        <UserCheck className="w-3.5 h-3.5 text-zinc-400" />
                        {log.performedBy ? log.performedBy.fullName : 'System'}
                      </p>
                      <p className="text-[10px] font-semibold text-zinc-500">
                        {new Date(log.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateHistoryDetail;
