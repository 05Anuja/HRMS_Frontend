const fs = require('fs');

const file = '/Users/salt-tech/Desktop/projects/Hrms/Admin/src/pages/Candidates.jsx';
let content = fs.readFileSync(file, 'utf8');

// The replacement logic
const startMarker1 = "{/* If status is In Progress (Full-Width Interactive Form with Glassy Effect) */}";
const endMarker1 = "{/* If candidate is ALREADY evaluated (Show Read-Only Evaluation Summary in Full Width) */}";

const startMarker2 = "{evalLoading ? (";
const endMarker2 = "No evaluation record found.";

const inProgressUI = `
            {/* If status is In Progress (Full-Width Interactive Form with Glassy Effect) */}
            {selectedCandidate.status === 'In Progress' && (
              <div className="w-full space-y-5 animate-in fade-in duration-300">
                {/* Section Evals Loop - Show completed sections */}
                {sectionEvals.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-200/60 pb-1.5 flex items-center gap-1.5">
                      Completed Rounds
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {sectionEvals.map((sec, idx) => (
                        <div key={idx} className="p-3 bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800 rounded-xl">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-[9px] font-bold text-zinc-450 uppercase">{sec.roundName}</p>
                              <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">{sec.interviewer?.name}</p>
                            </div>
                            <span className="px-2 py-0.5 bg-zinc-900 text-white text-[9px] font-bold rounded">
                              {sec.averageScore} / 5
                            </span>
                          </div>
                          {sec.comments && <p className="text-[9px] text-zinc-500 italic mt-1 bg-white p-1.5 rounded border border-zinc-100">"{sec.comments}"</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit New Section Form */}
                <div className="w-full p-5 backdrop-blur-xl bg-white/85 dark:bg-zinc-900/85 border border-zinc-200/80 dark:border-zinc-800 rounded-xl shadow-sm space-y-4">
                  <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-xs">Interview Parameter Matrix</h3>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Submit New Section</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide block mb-1">Select Section to Evaluate</label>
                      <select
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        className="w-full md:w-1/3 p-2 bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-zinc-900 focus:bg-white"
                      >
                        <option value="">-- Choose Section --</option>
                        <option value="communication">Communication Skills</option>
                        <option value="technical">Technical Assessment</option>
                        <option value="behavioral">Behavioral Fitment</option>
                      </select>
                    </div>

                    {selectedSection && (
                      <form onSubmit={handleSubmitSection} className="space-y-4 border-t border-zinc-100 pt-4">
                        <div className="flex justify-between items-center bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                           <span className="text-[10px] font-bold text-zinc-500 uppercase">Live Section Score</span>
                           <span className="text-xs font-bold font-mono">{calculateRealTimeAverage()} / 5.0</span>
                        </div>
                        
                        {selectedSection === 'communication' && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-0.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">Communication</label>
                              <RatingSelector value={sectionForm.communication} onChange={(val) => setSectionForm(prev => ({ ...prev, communication: val }))} />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">Confidence</label>
                              <RatingSelector value={sectionForm.confidence} onChange={(val) => setSectionForm(prev => ({ ...prev, confidence: val }))} />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">Clarity</label>
                              <RatingSelector value={sectionForm.clarity} onChange={(val) => setSectionForm(prev => ({ ...prev, clarity: val }))} />
                            </div>
                          </div>
                        )}

                        {selectedSection === 'technical' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                            <div className="space-y-0.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">Technical Knowledge</label>
                              <RatingSelector value={sectionForm.technicalKnowledge} onChange={(val) => setSectionForm(prev => ({ ...prev, technicalKnowledge: val }))} />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">Practical Knowledge</label>
                              <RatingSelector value={sectionForm.practicalKnowledge} onChange={(val) => setSectionForm(prev => ({ ...prev, practicalKnowledge: val }))} />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">Problem Solving</label>
                              <RatingSelector value={sectionForm.problemSolving} onChange={(val) => setSectionForm(prev => ({ ...prev, problemSolving: val }))} />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">Expertise</label>
                              <RatingSelector value={sectionForm.expertise} onChange={(val) => setSectionForm(prev => ({ ...prev, expertise: val }))} />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">Language Fluency</label>
                              <RatingSelector value={sectionForm.languageFluency} onChange={(val) => setSectionForm(prev => ({ ...prev, languageFluency: val }))} />
                            </div>
                          </div>
                        )}

                        {selectedSection === 'behavioral' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-0.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">Attitude</label>
                              <RatingSelector value={sectionForm.attitude} onChange={(val) => setSectionForm(prev => ({ ...prev, attitude: val }))} />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">Team Collaboration</label>
                              <RatingSelector value={sectionForm.teamCollaboration} onChange={(val) => setSectionForm(prev => ({ ...prev, teamCollaboration: val }))} />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">Leadership</label>
                              <RatingSelector value={sectionForm.leadershipPotential} onChange={(val) => setSectionForm(prev => ({ ...prev, leadershipPotential: val }))} />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">Adaptability</label>
                              <RatingSelector value={sectionForm.adaptability} onChange={(val) => setSectionForm(prev => ({ ...prev, adaptability: val }))} />
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Section Remarks / Comments</label>
                          <textarea
                            placeholder="Add observations about this section..."
                            rows={2}
                            value={sectionForm.comments}
                            onChange={(e) => setSectionForm(prev => ({ ...prev, comments: e.target.value }))}
                            className="w-full p-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-zinc-900 transition-all"
                          />
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            disabled={sectionLoading}
                            className="px-5 py-2 bg-zinc-900 text-white text-[9px] font-bold uppercase rounded-lg shadow-sm"
                          >
                            {sectionLoading ? 'Submitting...' : 'Submit Section'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>

                {/* Final Decision Form */}
                <form onSubmit={handleSubmitFinalEvaluation} className="w-full p-5 backdrop-blur-xl bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-4">
                  <h4 className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest border-b border-zinc-200/80 pb-1.5">
                    Placement & Final Interview Outcome
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Final Decision *</label>
                      <select
                        required
                        value={finalForm.decision}
                        onChange={(e) => setFinalForm(prev => ({ ...prev, decision: e.target.value }))}
                        className="w-full p-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-zinc-900"
                      >
                        <option value="">Select Outcome</option>
                        <option value="Selected">Approved (Selected)</option>
                        <option value="Rejected">Not Selected (Rejected)</option>
                        <option value="Hold">Pending Review (Hold)</option>
                        <option value="Second Round">Additional: Second Round</option>
                        <option value="Final Round">Additional: Final Round</option>
                      </select>
                    </div>

                    {finalForm.decision === 'Selected' && (
                      <>
                        <div>
                          <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Recommended Dept</label>
                          <input
                            type="text"
                            placeholder="e.g. Technology"
                            value={finalForm.recommendedDepartment}
                            onChange={(e) => setFinalForm(prev => ({ ...prev, recommendedDepartment: e.target.value }))}
                            className="w-full p-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-zinc-900"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Recommended Salary</label>
                          <input
                            type="number"
                            placeholder="CTC (e.g. 550000)"
                            value={finalForm.recommendedSalary}
                            onChange={(e) => setFinalForm(prev => ({ ...prev, recommendedSalary: e.target.value }))}
                            className="w-full p-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-zinc-900"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Joining Availability</label>
                          <input
                            type="date"
                            value={finalForm.joiningAvailability}
                            onChange={(e) => setFinalForm(prev => ({ ...prev, joiningAvailability: e.target.value }))}
                            className="w-full p-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold focus:outline-none focus:border-zinc-900"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {finalForm.decision === 'Selected' ? (
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Candidate Strengths & Core Advantages</label>
                      <textarea
                        placeholder="List key positive markers, expertise skills, or cultural advantages..."
                        rows={2}
                        value={finalForm.strengths}
                        onChange={(e) => setFinalForm(prev => ({ ...prev, strengths: e.target.value }))}
                        className="w-full p-2.5 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-zinc-900 font-semibold"
                      />
                    </div>
                  ) : finalForm.decision && finalForm.decision !== 'Selected' ? (
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Reasoning / Comments</label>
                      <textarea
                        placeholder="Provide reason for rejection or holding..."
                        rows={2}
                        required
                        value={finalForm.rejectionReason}
                        onChange={(e) => setFinalForm(prev => ({ ...prev, rejectionReason: e.target.value }))}
                        className="w-full p-2.5 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-zinc-900 font-semibold"
                      />
                    </div>
                  ) : null}

                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-zinc-950 text-white text-[10px] font-bold uppercase rounded-lg shadow-sm"
                    >
                      Complete Final Decision
                    </button>
                  </div>
                </form>
              </div>
            )}
`;

const summaryUI = `
                {evalLoading ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-2">
                    <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] text-zinc-400 font-semibold">Fetching evaluation record...</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Overall Outcome Banner */}
                    {existingEval && (
                      <div className="p-4 bg-zinc-950 text-white dark:bg-zinc-900 rounded-xl flex items-center justify-between border border-zinc-950/80 shadow-md">
                        <div className="space-y-0.5">
                          <p className="text-[8px] font-bold text-zinc-450 uppercase tracking-widest">PLACEMENT DECISION</p>
                          <p className="font-bold text-white text-sm tracking-wide capitalize">{existingEval.decision}</p>
                        </div>
                      </div>
                    )}

                    {/* Section Evaluations Loop */}
                    {sectionEvals.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-200/60 pb-1.5 flex items-center gap-1.5">
                          Interview Round Tracking
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {sectionEvals.map((sec, idx) => (
                            <div key={idx} className="p-3 bg-zinc-50/50 rounded-xl border border-zinc-200/60 shadow-sm space-y-2">
                              <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                                <div>
                                  <p className="text-[10px] font-bold text-zinc-800 uppercase">{sec.roundName}</p>
                                  <p className="text-[9px] font-semibold text-zinc-500 mt-0.5">By {sec.interviewer?.name} • {new Date(sec.conductedAt).toLocaleString('en-IN')}</p>
                                </div>
                                <span className="px-2 py-1 bg-zinc-900 text-white rounded text-[10px] font-bold">
                                  {sec.averageScore} / 5
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-y-1 pt-1">
                                {Object.entries(sec.scores).filter(([k,v]) => v > 0).map(([k, v]) => (
                                  <div key={k} className="flex justify-between items-center pr-2">
                                    <span className="text-[9px] font-semibold text-zinc-650 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <RenderStars count={v} />
                                  </div>
                                ))}
                              </div>
                              {sec.comments && (
                                <p className="text-[9px] text-zinc-600 bg-white p-2 rounded-lg mt-2 border border-zinc-100 italic">"{sec.comments}"</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Decision Details readout */}
                    {existingEval && (
                      <div className="p-4 bg-zinc-50/30 border border-zinc-200 rounded-xl space-y-4">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-200/60 pb-1.5 flex items-center gap-1.5">
                          Final Placement Details
                        </h4>
                        
                        {existingEval.decision === 'Selected' ? (
                          <>
                            {existingEval.strengths && (
                              <div className="space-y-1">
                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Candidate Strengths & Core Advantages</p>
                                <p className="font-semibold text-zinc-700 bg-white border border-zinc-150 p-2.5 rounded-lg text-[10px]">{existingEval.strengths}</p>
                              </div>
                            )}

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-[10px]">
                              <div>
                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Recommended Dept</p>
                                <p className="font-bold text-zinc-800 mt-0.5 capitalize">{existingEval.recommendedDepartment || '—'}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Recommended Salary</p>
                                <p className="font-bold text-zinc-800 mt-0.5">
                                  {existingEval.recommendedSalary ? '₹' + Number(existingEval.recommendedSalary).toLocaleString() : '—'}
                                </p>
                              </div>
                              <div>
                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Joining Availability</p>
                                <p className="font-bold text-zinc-800 mt-0.5">
                                  {existingEval.joiningAvailability ? new Date(existingEval.joiningAvailability).toLocaleDateString('en-IN') : '—'}
                                </p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Reasoning / Comments</p>
                            <p className="font-semibold text-zinc-700 bg-white border border-zinc-150 p-2.5 rounded-lg text-[10px]">{existingEval.rejectionReason || 'No reasoning provided.'}</p>
                          </div>
                        )}
                        
                        {existingEval.interviewer && (
                          <div className="pt-2">
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Final Decision By</p>
                            <p className="font-bold text-zinc-950 mt-0.5 uppercase tracking-wide">{existingEval.interviewer.name} • {new Date(existingEval.createdAt).toLocaleString('en-IN')}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {!existingEval && sectionEvals.length === 0 && (
                      <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-center italic text-zinc-400 text-[10px]">
                        No evaluation record found.
                      </div>
                    )}
`;

const startIndex1 = content.indexOf(startMarker1);
const endIndex1 = content.indexOf(endMarker1);

if (startIndex1 !== -1 && endIndex1 !== -1) {
  content = content.substring(0, startIndex1) + inProgressUI + '\n            ' + content.substring(endIndex1);
}

const startIndex2 = content.indexOf(startMarker2);
const endIdxRaw = content.indexOf(endMarker2);

if (startIndex2 !== -1 && endIdxRaw !== -1) {
    const endIndex2 = content.indexOf('</div>', endIdxRaw) + '</div>'.length;
    // We also need to skip the closing tag of the `)` for the ternary: `)}`
    const endTernary = content.indexOf(')}', endIndex2) + ')}'.length;
    
    content = content.substring(0, startIndex2) + summaryUI + '\n                ' + content.substring(endTernary);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully replaced code blocks via scratch script');
