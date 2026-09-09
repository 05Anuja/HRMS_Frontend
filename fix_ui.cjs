const fs = require('fs');
const file = './src/pages/Candidates.jsx';
let content = fs.readFileSync(file, 'utf8');

// The block to replace starts around line 958 and ends around 1165.
// We will use regex to replace specific sections.

// 1. Remove ESSENTIAL DATA HEADER and start the MASTER CARD
content = content.replace(
  /\{\/\* ESSENTIAL DATA HEADER: Glassy Combo of White & Black \*\/\}([\s\S]*?)\{\/\* MIDDLE SECTION: FULL-WIDTH EVALUATION FORM \/ ASSESSMENT REPORT \(Glassy Design\) \*\/\}\s*<div className="w-full">/m,
  `{/* SINGLE MASTER CARD FOR EVALUATION PAGE */}
          <div className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-md overflow-hidden">
            {/* 1. Header Area: Basic Info & Status */}
            <div className="p-6 bg-gradient-to-r from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950 border-b border-zinc-200/60 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  {selectedCandidate.fullName?.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-bold text-zinc-955 dark:text-zinc-50 capitalize tracking-tight">{selectedCandidate.fullName}</h2>
                    <span className="text-xs font-bold text-zinc-400 font-mono tracking-tight bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                      {selectedCandidate.candidateId}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-semibold text-zinc-500">
                    <span>Applied: {new Date(selectedCandidate.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-zinc-650">
                <div>
                  <span className={\`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all shadow-sm \${{
                    'Selected': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-black',
                    'Approved': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-bold',
                    'Rejected': 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-bold',
                    'Hold': 'bg-orange-500/10 text-orange-650 dark:text-orange-400 border-orange-500/20 font-bold',
                    'In Progress': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 animate-pulse font-black',
                    'Completed': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 font-bold',
                    'Second Round': 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20 font-bold',
                    'Final Round': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 font-bold'
                  }[selectedCandidate.status] || 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    }\`}>
                    {selectedCandidate.status || 'Waiting'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Full Candidate Profile */}
            <div className="p-6">
              {renderCandidateProfileDetails(false)}
            </div>

            {/* 3. Action / Status Areas (Waiting, Approved, In Progress, Outcome) */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
`
);

// 2. Modify Waiting State
content = content.replace(
  /\{\/\* ── WAITING STATE: Single Full-Detail Approval Card ── \*\/\}([\s\S]*?)\{renderCandidateProfileDetails\(false\)\}([\s\S]*?)\{\/\* Divider \*\/\}/m,
  `{/* ── WAITING STATE ── */}
            {(selectedCandidate.status === 'Waiting' || selectedCandidate.status === 'submitted' || !selectedCandidate.status) && (
              <div className="p-6">`
);

content = content.replace(
  /\{\/\* Approval CTA \*\/\}([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*\)\}/m,
  `{/* Approval CTA */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-amber-500" /> Ready to approve this candidate profile?</p>
                      <p className="text-xs text-zinc-500 font-medium leading-relaxed max-w-md">
                        Approving confirms that all candidate data has been reviewed and verified. This action will unlock the <span className="font-bold text-zinc-700 dark:text-zinc-300">Interview Pipeline</span>.
                      </p>
                    </div>
                    <button
                      onClick={handleApproveCandidate}
                      disabled={approveLoading}
                      className="flex-shrink-0 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
                    >
                      {approveLoading ? (
                        <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Approving...</>
                      ) : (
                        <><CheckCircle2 className="w-4 h-4" /> Approve Candidate Data</>
                      )}
                    </button>
                  </div>
              </div>
            )}`
);

// 3. Modify Approved State
content = content.replace(
  /\{\/\* ── APPROVED STATE: Show approver info \+ Start Interview ── \*\/\}([\s\S]*?)\{\/\* If status is In Progress \(Full-Width Interactive Form with Glassy Effect\) \*\/\}/m,
  `{/* ── APPROVED STATE: Show approver info + Start Interview ── */}
            {selectedCandidate.status === 'Approved' && (
              <div className="p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200/60 dark:border-emerald-800/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200/80 dark:border-emerald-700/40 flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-widest">Data Verified & Approved By</p>
                        <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 capitalize">
                          {selectedCandidate.approvedBy?.fullName || selectedCandidate.updatedBy?.fullName || 'HR Administrator'}
                          {(selectedCandidate.approvedBy?.role || selectedCandidate.updatedBy?.role) && (
                            <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest ml-1.5">
                              ({selectedCandidate.approvedBy?.role || selectedCandidate.updatedBy?.role})
                            </span>
                          )}
                        </p>
                        {(selectedCandidate.approvedAt || selectedCandidate.updatedAt) && (
                          <p className="text-[10px] text-zinc-500 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(selectedCandidate.approvedAt || selectedCandidate.updatedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleStartInterview}
                      className="flex-shrink-0 px-6 py-2.5 bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" /> Start Interview Now
                    </button>
                  </div>
              </div>
            )}

            {/* If status is In Progress (Full-Width Interactive Form with Glassy Effect) */}`
);

// 4. Modify In Progress State
content = content.replace(
  /\{selectedCandidate\.status === 'In Progress' && \([\s\S]*?\{renderCandidateProfileDetails\(true\)\}/m,
  `{selectedCandidate.status === 'In Progress' && (
              <div className="p-6 space-y-5 animate-in fade-in duration-300">`
);

// 5. Modify Outcome State (Selected, Rejected, etc)
content = content.replace(
  /\{renderCandidateProfileDetails\(true\)\}/g,
  `` // Remove all other references since it's now global
);

// 6. Close the new wrappers at the end of the view
content = content.replace(
  /\{\/\* MODAL: RESUME QUICK PREVIEW \*\/\}/,
  `    </div>
          </div>
        </div>
      )}

      {/* MODAL: RESUME QUICK PREVIEW */}`
);

// Note: Removing the old `</div>\n        </div>\n      )}` that was before MODAL
content = content.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*\)\}\s*\{\/\* MODAL: RESUME QUICK PREVIEW \*\/\}/m,
  `            </div>
          </div>
        </div>
      )}

      {/* MODAL: RESUME QUICK PREVIEW */}`
);


fs.writeFileSync(file, content, 'utf8');
console.log("Replaced successfully!");
