import React, { useState, useEffect } from "react";
import DynamicTable from "../components/common/DynamicTable";
import DynamicForm from "../components/common/DynamicForm";
import Axios from "../utils/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  GraduationCap,
  Users2,
  Briefcase,
  Check,
  Star,
  Play,
  Award,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Clock,
  MapPin,
  Phone,
  Users,
  Mail,
  Calendar,
  Upload,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Edit,
  Handshake,
  User,
  Contact,
  Languages,
} from "lucide-react";
import { IMAGE_URL } from "../../constants";

export const getCandidateDisplayStatus = (candidate) => {
  if (!candidate) return "Waiting";

  // Offer Accepted always has the highest display priority.
  // Even if documents are submitted, the candidate must continue
  // to show "Offer Accepted" after accepting the offer.
  const isOfferAccepted =
    candidate.status === "Offer Accepted" ||
    candidate.offerStatus === "Offer Accepted" ||
    candidate.offerStatus?.toLowerCase() === "accepted" ||
    candidate.undertakingAccepted === true ||
    Boolean(candidate.offerAcceptedAt);

  if (isOfferAccepted) {
    return "Offer Accepted";
  }

  // Show Documents Uploaded only when the backend confirms that
  // all required onboarding documents have been submitted.
  // Do not use uploadedDocuments.length here because a partial
  // upload must not override the candidate's existing status.
  const isDocsSubmitted =
    candidate.documentsStatus?.toLowerCase() === "submitted";

  if (isDocsSubmitted) {
    return "Documents Uploaded";
  }

  // Every other candidate status remains unchanged.
  return candidate.status || "Waiting";
};

const Candidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("list"); // 'list', 'edit', 'profile'
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [candidateLogs, setCandidateLogs] = useState([]); // Store candidate history logs

  // Added Review section
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  // Reasoning
  const [reasoning, setReasoning] = useState("");
  const [reasonings, setReasonings] = useState([]);
  // Language Fluency
  const [languageFluencyForm, setLanguageFluencyForm] = useState([]);

  // Resume quick preview states
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isReInterviewModalOpen, setIsReInterviewModalOpen] = useState(false);

  // ── Section Evaluations (per-HR, per-section) ──────────────────────────────
  const [sectionEvals, setSectionEvals] = useState([]); // submitted section evals
  const [sectionLoading, setSectionLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState(""); // 'communication' | 'technical' | 'behavioral'
  const [sectionForm, setSectionForm] = useState({
    // Communication
    communication: 0,
    confidence: 0,
    clarity: 0,
    // Technical
    technicalKnowledge: 0,
    practicalKnowledge: 0,
    problemSolving: 0,
    expertise: 0,
    languageFluency: 0,
    // Behavioral
    attitude: 0,
    teamCollaboration: 0,
    leadershipPotential: 0,
    adaptability: 0,
    comments: "",
  });

  // ── Final Placement Decision ───────────────────────────────────────────────
  const [existingEval, setExistingEval] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [finalForm, setFinalForm] = useState({
    decision: "",
    rejectionReason: "",
    strengths: "",
    recommendedDepartment: "",
    salaryExpectation: "",
    recommendedSalary: "",
    joiningAvailability: "",
  });

  // ── Approve Candidate ──────────────────────────────────────────────────────
  const [approveLoading, setApproveLoading] = useState(false);
  // Sent Mail
  // const [sentSelectionMails, setSentSelectionMails] = useState({});

  console.log(candidates?.candidateId);

  const handleSendSelectionMail = (candidate) => {
    navigate(`/selection-mail/${candidate?._id}`);
  };

  const fetchCandidates = async (page = 1, q = "") => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `/candidates?page=${page}&limit=10&q=${q}`,
      );
      if (response.data.success) {
        setCandidates(response.data.data);
        setPagination({
          page: response.data.pagination?.next?.page - 1 || page,
          limit: 10,
          total: response.data.total,
          totalPages: Math.ceil(response.data.total / 10) || 1,
        });
      }
    } catch (error) {
      console.error("Failed to fetch candidates", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates(pagination.page, searchTerm);
    // const sentMails = JSON.parse(
    //   localStorage.getItem("selectionMailsSent") || "{}",
    // );

    // setSentSelectionMails(sentMails);
  }, [pagination.page, searchTerm]);

  const handleEdit = (candidate) => {
    const formattedCandidate = { ...candidate };
    if (formattedCandidate.dateOfBirth) {
      formattedCandidate.dateOfBirth =
        formattedCandidate.dateOfBirth.split("T")[0];
    }
    if (formattedCandidate.registrationDate) {
      formattedCandidate.registrationDate =
        formattedCandidate.registrationDate.split("T")[0];
    }
    if (formattedCandidate.resumeFilePath) {
      formattedCandidate.resume = formattedCandidate.resumeFilePath;
    }
    if (Array.isArray(formattedCandidate.educationDetails)) {
      formattedCandidate.educationDetails =
        formattedCandidate.educationDetails.map((edu) => {
          const val = edu.score || edu.percentage;
          return {
            ...edu,
            score: val || "",
            percentage: val || "",
          };
        });
    }
    setSelectedCandidate(formattedCandidate);
    setView("edit");
  };

  const fetchEvaluation = async (candidateId) => {
    setEvalLoading(true);
    try {
      const [evalRes, sectionRes, logsRes] = await Promise.all([
        Axios.get(`/evaluations/candidate/${candidateId}`),
        Axios.get(`/section-evaluations/candidate/${candidateId}`),
        Axios.get(`/candidates/${candidateId}/logs`),
      ]);

      // console.log("Reasonings", evalRes.data);
      console.log(evalRes);

      if (evalRes.data.success) {
        setExistingEval(evalRes.data.data);
        setReviews(evalRes.data.data?.reviews || []);
        setReasonings(evalRes.data.data?.reasonings || []);

        // console.log(evalRes.data.data);
        // console.log(evalRes.data.data.reviews);

        // if (evalRes.data.data) {
        //   setFinalForm({
        //     decision: evalRes.data.data.decision || "",
        //     rejectionReason: evalRes.data.data.rejectionReason || "",
        //     strengths: evalRes.data.data.strengths || "",
        //     recommendedDepartment:
        //       evalRes.data.data.recommendedDepartment || "",
        //     recommendedSalary: evalRes.data.data.recommendedSalary || "",
        //     joiningAvailability: evalRes.data.data.joiningAvailability
        //       ? new Date(evalRes.data.data.joiningAvailability)
        //           .toISOString()
        //           .split("T")[0]
        //       : "",
        //   });
        // }
        if (evalRes.data.data) {
          const evaluation = evalRes.data.data;

          console.log(evaluation);

          setFinalForm({
            decision: evaluation.decision || "",
            rejectionReason: evaluation.rejectionReason || "",

            strengths: evaluation.strengths || "",

            recommendedDepartment: evaluation.recommendedDepartment || "",

            recommendedSalary: evaluation.recommendedSalary || "",

            salaryExpectation: evaluation.salaryExpectation || "",

            joiningAvailability: evaluation.joiningAvailability
              ? new Date(evaluation.joiningAvailability)
                  .toISOString()
                  .split("T")[0]
              : "",
          });
        }
      }
      if (sectionRes.data.success) {
        setSectionEvals(sectionRes.data.data);
      }
      if (logsRes.data.success) {
        setCandidateLogs(logsRes.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch evaluation data", err);
    } finally {
      setEvalLoading(false);
    }
  };

  const handleProfileView = async (candidate) => {
    try {
      const response = await Axios.get(`/candidates/${candidate._id}`);
      const candidateData = response.data?.data || candidate;
      const formattedCandidate = { ...candidate, ...candidateData };

      if (Array.isArray(formattedCandidate.educationDetails)) {
        formattedCandidate.educationDetails =
          formattedCandidate.educationDetails.map((edu) => {
            const val = edu.score || edu.percentage;
            return { ...edu, score: val || "", percentage: val || "" };
          });
      }

      console.log("Uploaded Documents:", formattedCandidate.uploadedDocuments);
      setSelectedCandidate(formattedCandidate);
      setView("profile");
      fetchEvaluation(formattedCandidate._id);
    } catch (error) {
      console.error("Failed to fetch candidate details:", error);
      const formattedCandidate = { ...candidate };
      setSelectedCandidate(formattedCandidate);
      setView("profile");
      fetchEvaluation(formattedCandidate._id);
    }

    setSectionForm({
      communication: 0,
      confidence: 0,
      clarity: 0,
      technicalKnowledge: 0,
      practicalKnowledge: 0,
      problemSolving: 0,
      expertise: 0,
      languageFluency: 0,
      attitude: 0,
      teamCollaboration: 0,
      leadershipPotential: 0,
      adaptability: 0,
      comments: "",
    });
    setFinalForm({
      decision: "",
      rejectionReason: "",
      strengths: "",
      recommendedDepartment: "",
      recommendedSalary: "",
      salaryExpectation: "",
      joiningAvailability: "",
    });
    setSelectedSection("");
  };

  const confirmReInterview = async () => {
    setIsReInterviewModalOpen(false);
    try {
      setApproveLoading(true);
      const res = await Axios.post(
        `/candidates/${selectedCandidate._id}/re-interview`,
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setSelectedCandidate(res.data.data);
        fetchEvaluation(res.data.data._id);
        fetchCandidates(pagination.page);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to initiate re-interview",
      );
    } finally {
      setApproveLoading(false);
    }
  };

  const handleAddReview = () => {
    if (!review.trim()) return;

    const newReview = {
      id: Date.now(),
      comment: review.trim(),
      reviewer: currentUser?.fullName || "You", // Replace with logged-in user
      createdAt: new Date(),
    };

    // Later replace this with API call
    setReviews((prev) => [newReview, ...prev]);
    setReview("");
  };

  const handleApproveCandidate = async () => {
    setApproveLoading(true);
    try {
      const res = await Axios.patch(
        `/candidates/${selectedCandidate._id}/status`,
        { status: "Approved" },
      );
      if (res.data.success) {
        toast.success("Candidate data approved successfully");
        setSelectedCandidate(res.data.data);
        fetchCandidates(pagination.page, searchTerm);
      }
    } catch (err) {
      toast.error("Failed to approve candidate data");
    } finally {
      setApproveLoading(false);
    }
  };

  const handleStartInterview = async () => {
    try {
      const res = await Axios.patch(
        `/candidates/${selectedCandidate._id}/status`,
        { status: "In Progress" },
      );
      if (res.data.success) {
        toast.success("Interview started: status updated to 'In Progress'");
        setSelectedCandidate(res.data.data);
        fetchCandidates(pagination.page, searchTerm);
      }
    } catch (err) {
      toast.error("Failed to start interview");
    }
  };

  const calculateRealTimeAverage = () => {
    if (!selectedSection) return 0;

    let activeKeys = [];
    if (selectedSection === "communication") {
      activeKeys = ["communication", "confidence", "clarity"];
    } else if (selectedSection === "technical") {
      activeKeys = [
        "technicalKnowledge",
        "practicalKnowledge",
        "problemSolving",
        "expertise",
        "languageFluency",
      ];
    } else if (selectedSection === "behavioral") {
      activeKeys = [
        "attitude",
        "teamCollaboration",
        "leadershipPotential",
        "adaptability",
      ];
    }

    const ratings = activeKeys.map((k) => sectionForm[k]).filter((r) => r > 0);
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((a, b) => a + b, 0);
    return parseFloat((sum / ratings.length).toFixed(1));
  };

  const renderCandidateProfileDetails = (isCollapsible = false) => {
    const detailsContent = (
      <div className="space-y-6 text-left">
        {/* Candidate Selfie */}
        {/* {selectedCandidate.selfieFilePath && (
          <div className="flex flex-col items-center justify-center pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Candidate Photo
            </p>

            <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-white dark:border-zinc-800 shadow-lg bg-zinc-100 dark:bg-zinc-900">
              <img
                src={`${IMAGE_URL}/${selectedCandidate.selfieFilePath}`}
                alt={`${selectedCandidate.fullName || "Candidate"} selfie`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(
                    "Failed to load candidate selfie:",
                    `${IMAGE_URL}/${selectedCandidate.selfieFilePath}`,
                  );
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <p className="mt-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              Candidate Selfie
            </p>
          </div>
        )} */}
        {/* Personal Info Grid */}
        <div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" /> Personal Information
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              {
                label: "Full Name",
                value: selectedCandidate.fullName,
                capitalize: true,
              },
              {
                label: "Candidate ID",
                value: selectedCandidate.candidateId,
                mono: true,
              },
              {
                label: "Date of Birth",
                value: selectedCandidate.dateOfBirth
                  ? new Date(selectedCandidate.dateOfBirth).toLocaleDateString(
                      "en-IN",
                      { day: "2-digit", month: "short", year: "numeric" },
                    )
                  : "—",
              },
              {
                label: "Age",
                value: selectedCandidate.age
                  ? `${selectedCandidate.age} Years`
                  : "—",
              },
              { label: "Gender", value: selectedCandidate.gender || "—" },
              {
                label: "Marital Status",
                value: selectedCandidate.maritalStatus || "—",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-3 bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50 space-y-0.5"
              >
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {item.label}
                </p>
                <p
                  className={`text-xs font-bold text-zinc-900 dark:text-zinc-100 ${item.capitalize ? "capitalize" : ""} ${item.mono ? "font-mono" : ""}`}
                >
                  {item.value || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Location */}
        <div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" /> Contact & Location
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Email */}
            <div className="p-3 bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50 flex items-start gap-2.5">
              <Mail className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Email
                </p>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {selectedCandidate.email || "—"}
                </p>
              </div>
            </div>

            {/* Mobile */}
            <div className="p-3 bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50 flex items-start gap-2.5">
              <Phone className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Mobile
                </p>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedCandidate.mobileNumber || "—"}
                </p>
              </div>
            </div>

            {/* Whatsapp */}
            {selectedCandidate.whatsAppNumber && (
              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200/60 dark:border-emerald-800/30 flex items-start gap-2.5">
                <Phone className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    WhatsApp
                  </p>
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {selectedCandidate.whatsAppNumber}
                  </p>
                </div>
              </div>
            )}

            {/* Current Address */}
            <div className="p-3 bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50 flex items-start gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Current Address
                </p>

                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 break-words">
                  {selectedCandidate.currentAddress ||
                    [
                      selectedCandidate.addressLine1,
                      selectedCandidate.addressLine2,
                      selectedCandidate.addressLine3,
                    ]
                      .filter(Boolean)
                      .join(", ") ||
                    "—"}
                </p>

                {selectedCandidate.addressType && (
                  <p className="text-[11px] font-semibold text-black dark:text-zinc-400 mt-1">
                    {selectedCandidate.addressType}
                  </p>
                )}

                {selectedCandidate.stayingSince && (
                  <p className="text-[11px] font-semibold text-black dark:text-zinc-400 mt-1">
                    Staying Since: {selectedCandidate.stayingSince} Years
                  </p>
                )}
              </div>
            </div>

            {/* Permanent Address */}
            <div className="p-3 bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50 flex items-start gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Permanent Address
                </p>

                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 break-words">
                  {selectedCandidate.permanentAddress ||
                    [
                      selectedCandidate.addressLine1,
                      selectedCandidate.addressLine2,
                      selectedCandidate.addressLine3,
                    ]
                      .filter(Boolean)
                      .join(", ") ||
                    "—"}
                </p>

                {selectedCandidate.addressType && (
                  <p className="text-[10px] font-semibold text-black dark:text-zinc-400 mt-1">
                    {selectedCandidate.addressType}
                  </p>
                )}

                {selectedCandidate.stayingSince && (
                  <p className="text-[10px] font-semibold text-black 500 dark:text-zinc-400 mt-1">
                    Staying Since: {selectedCandidate.stayingSince} Years
                  </p>
                )}
              </div>
            </div>

            {/* City */}
            <div className="p-3 bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50 flex items-start gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  City
                </p>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 capitalize">
                  {selectedCandidate.city || "—"}
                </p>
              </div>
            </div>

            {/* Pincode */}
            <div className="p-3 bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50 flex items-start gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Pincode
                </p>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedCandidate.pincode || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Education & Experience Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Education */}
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" /> Education Summary
            </p>
            <div className="space-y-2">
              {selectedCandidate.educationDetails?.length > 0 ? (
                selectedCandidate.educationDetails.map((e, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50"
                  >
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 capitalize">
                        {e.qualification}
                      </p>
                      <p className="text-xs text-zinc-500 font-semibold capitalize">
                        {e.university} · {e.yearOfPassing}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded-lg">
                      {e.score || e.percentage
                        ? `${e.score || e.percentage}%`
                        : "—"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-xl border border-zinc-200/60 dark:border-zinc-800 text-center">
                  <p className="text-xs text-zinc-400 font-semibold italic">
                    No education details provided
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Experience */}
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> Experience Summary
            </p>
            <div className="space-y-2">
              {selectedCandidate.experienceDetails?.length > 0 ? (
                selectedCandidate.experienceDetails.map((ex, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50"
                  >
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 capitalize">
                        {ex.company}
                      </p>
                      <p className="text-xs text-zinc-500 font-semibold">
                        {ex.designation} · Notice: {ex.noticePeriod} days
                      </p>
                    </div>
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded-lg">
                      {ex.salary
                        ? `₹${Number(ex.salary).toLocaleString()}`
                        : "Fresher"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-xl border border-zinc-200/60 dark:border-zinc-800 text-center">
                  <p className="text-xs text-zinc-400 font-semibold italic">
                    No experience listed (Fresher)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Family Details */}
        <div className="w-full md:col-span-2">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Family Details
          </p>

          {selectedCandidate.familyDetails?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedCandidate.familyDetails.map((member) => (
                <div
                  key={member._id}
                  className="p-3 bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {member.name}
                    </p>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                      {member.relation}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 text-xs">
                    <p className="text-zinc-500">
                      <span className="font-semibold">Age:</span>{" "}
                      {member.age || "—"}
                    </p>

                    <p className="text-zinc-500 truncate">
                      <span className="font-semibold">Occupation:</span>{" "}
                      {member.occupation || "—"}
                    </p>

                    {member.designation && (
                      <p className="text-zinc-500 truncate">
                        <span className="font-semibold">Designation:</span>{" "}
                        {member.designation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-xl border border-zinc-200/60 dark:border-zinc-800 text-center">
              <p className="text-xs text-zinc-400 font-semibold italic">
                No family details available
              </p>
            </div>
          )}
        </div>

        {/* References */}
        <div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Handshake className="w-3.5 h-3.5" /> References
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <div className="p-3 bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50 flex items-start gap-2.5">
              <User className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Name
                </p>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {selectedCandidate.references?.[0]?.name || "—"}
                </p>
              </div>
            </div>
            <div className="p-3 bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50 flex items-start gap-2.5">
              <Phone className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Mobile
                </p>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedCandidate.references?.[0]?.contact || "—"}
                </p>
              </div>
            </div>

            <div className="p-3 bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50 flex items-start gap-2.5">
              <Contact className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Relation
                </p>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 capitalize">
                  {selectedCandidate.references?.[0]?.relation || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Source & Languages Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50 space-y-1.5">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Source Channel
            </p>
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              {selectedCandidate.source || "—"}
            </p>
            {selectedCandidate.sourceRemarks && (
              <p className="text-xs text-zinc-500 font-semibold italic">
                {selectedCandidate.sourceRemarks}
              </p>
            )}
          </div>
          <div className="p-3.5 bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50 space-y-1.5">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Languages Known
            </p>
            <div className="flex flex-wrap gap-1.5">
              {Array.isArray(selectedCandidate.languagesKnown) &&
              selectedCandidate.languagesKnown.length > 0 ? (
                selectedCandidate.languagesKnown.map((lang, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-md text-xs font-bold uppercase tracking-wide"
                  >
                    {lang}
                  </span>
                ))
              ) : (
                <span className="text-xs text-zinc-400 italic">
                  Not specified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Resume Row */}
        {selectedCandidate.resumeFilePath && (
          <div className="flex items-center justify-between p-3.5 bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedCandidate.resumeOriginalName || "Resume Document"}
                </p>
                <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                  Attached CV/Resume
                </p>
              </div>
            </div>
            <a
              href={`${IMAGE_URL}/${selectedCandidate.resumeFilePath}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all flex items-center gap-1.5"
            >
              <FileText className="w-3 h-3" /> View Resume
            </a>
          </div>
        )}

        {/* Uploaded Onboarding Documents */}
        {Array.isArray(selectedCandidate.uploadedDocuments) &&
          selectedCandidate.uploadedDocuments.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Uploaded Documents
                </p>

                {selectedCandidate.status === "Offer Accepted" ||
                selectedCandidate.offerStatus === "Offer Accepted" ||
                selectedCandidate.offerStatus?.toLowerCase() === "accepted" ||
                selectedCandidate.undertakingAccepted === true ||
                selectedCandidate.offerAcceptedAt ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                    Offer Accepted
                  </span>
                ) : selectedCandidate.documentsStatus?.toLowerCase() ===
                  "submitted" ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Documents Uploaded
                  </span>
                ) : null}
              </div>

              <div className="space-y-2">
                {selectedCandidate.uploadedDocuments.map((document, index) => {
                  const documentNames = {
                    aadharCard: "Aadhar Card",
                    panCard: "PAN Card",
                    lightBill: "Light Bill",
                    marksheet: "Marksheet",
                    certifications: "Certifications",
                    experienceLetter: "Experience Letter",
                  };

                  const documentTitle =
                    documentNames[document.documentType] ||
                    document.documentType ||
                    `Document ${index + 1}`;

                  const documentPath = document.filePath?.replace(/\\/g, "/");
                  const documentUrl = documentPath
                    ? `${IMAGE_URL}/${documentPath.replace(/^\/+/, "")}`
                    : "";

                  return (
                    <div
                      key={`${document.documentType || "document"}-${index}`}
                      className="flex items-center justify-between gap-4 p-3.5 bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                          <FileText className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            {documentTitle}
                          </p>

                          <p
                            className="text-xs text-zinc-500 truncate max-w-[450px]"
                            title={
                              document.originalName || document.fileName || ""
                            }
                          >
                            {document.originalName ||
                              document.fileName ||
                              "Uploaded document"}
                          </p>

                          <p className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">
                            {document.mimeType || "Document"}
                          </p>
                        </div>
                      </div>

                      {documentUrl && (
                        <a
                          href={documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all flex items-center gap-1.5"
                        >
                          <FileText className="w-3 h-3" />
                          View Document
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
      </div>
    );

    if (isCollapsible) {
      return (
        <details className="group border border-zinc-200/70 dark:border-zinc-800/80 rounded-xl bg-white dark:bg-zinc-900/50 overflow-hidden shadow-sm transition-all duration-200">
          <summary className="flex items-center justify-between p-3.5 cursor-pointer select-none bg-zinc-50/50 dark:bg-zinc-900/40 font-bold text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-450 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/80 transition-colors group-open:border-b group-open:border-zinc-200/70 dark:group-open:border-zinc-800/80">
            <span className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-zinc-500" />
              Review Candidate Profile Details & CV
            </span>
            <ChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180 text-zinc-400" />
          </summary>
          <div className="p-5 space-y-6">{detailsContent}</div>
        </details>
      );
    }

    return detailsContent;
  };

  const handleSubmitSection = async (e) => {
    e.preventDefault();
    if (!selectedSection) {
      toast.error("Please select an evaluation section first.");
      return;
    }

    setSectionLoading(true);
    try {
      const payload = {
        candidateId: selectedCandidate._id,
        sectionType: selectedSection,
        scores: { ...sectionForm },
        comments: sectionForm.comments,
      };

      const res = await Axios.post("/section-evaluations", payload);
      if (res.data.success) {
        toast.success(`${selectedSection} evaluation submitted successfully`);
        // Refresh evaluations
        fetchEvaluation(selectedCandidate._id);
        // Reset section form
        setSectionForm({
          communication: 0,
          confidence: 0,
          clarity: 0,
          technicalKnowledge: 0,
          practicalKnowledge: 0,
          problemSolving: 0,
          expertise: 0,
          languageFluency: 0,
          attitude: 0,
          teamCollaboration: 0,
          leadershipPotential: 0,
          adaptability: 0,
          comments: "",
        });
        setSelectedSection("");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to submit section evaluation",
      );
    } finally {
      setSectionLoading(false);
    }
  };

  const renderLanguageFluencySection = () => {
    // Get saved language fluency from candidate or existing evaluation
    const savedFluency =
      selectedCandidate?.languageFluency &&
      selectedCandidate.languageFluency.length > 0
        ? selectedCandidate.languageFluency
        : existingEval?.languageFluency &&
            existingEval.languageFluency.length > 0
          ? existingEval.languageFluency
          : null;

    // Determine if a previous review exists
    const hasPreviousReview =
      (reviews && reviews.length > 0) ||
      Boolean(savedFluency && savedFluency.length > 0);

    // Get candidate's registered languages (fallback to English & Hindi if none specified)
    const candidateLangs =
      Array.isArray(selectedCandidate?.languagesKnown) &&
      selectedCandidate.languagesKnown.length > 0
        ? selectedCandidate.languagesKnown
        : ["English", "Hindi"];

    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4 mb-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-xs">
                Language Fluency
              </h3>
              <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                {hasPreviousReview
                  ? "Recorded Language Fluency (Read-Only)"
                  : "Rate Speak, Read & Write for candidate languages (First Review Only)"}
              </p>
            </div>
          </div>
          {hasPreviousReview ? (
            <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md text-[10px] font-bold uppercase tracking-wider border border-zinc-200 dark:border-zinc-700">
              Read-Only (First Review Recorded)
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-md text-[10px] font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
              Editable (First Review)
            </span>
          )}
        </div>

        {hasPreviousReview ? (
          /* ── READ-ONLY DISPLAY FOR SUBSEQUENT REVIEWS ── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(
              savedFluency ||
              candidateLangs.map((l) => ({
                language: l,
                speak: "",
                read: "",
                write: "",
              }))
            ).map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-zinc-50/80 dark:bg-zinc-950/60 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800 pb-1.5">
                  <span className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                    {item.language}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {["speak", "read", "write"].map((skill) => {
                    const ratingVal = item[skill] || "";
                    const colorClass =
                      ratingVal === "Good"
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                        : ratingVal === "Below Average"
                          ? "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30";

                    return (
                      <div
                        key={skill}
                        className="p-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-150 dark:border-zinc-800 space-y-1"
                      >
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                          {skill}
                        </p>
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold border ${colorClass}`}
                        >
                          {ratingVal}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── EDITABLE SELECTION FOR FIRST REVIEW ── */
          <div className="space-y-3">
            {candidateLangs.map((lang, lIdx) => {
              const currentItem = languageFluencyForm.find(
                (f) => f.language?.toLowerCase() === lang?.toLowerCase(),
              ) || {
                language: lang,
                speak: "",
                read: "",
                write: "",
              };

              const setOptionRating = (skill, val) => {
                setLanguageFluencyForm((prev) => {
                  const idx = prev.findIndex(
                    (item) =>
                      item.language?.toLowerCase() === lang?.toLowerCase(),
                  );
                  if (idx >= 0) {
                    const updated = [...prev];
                    updated[idx] = { ...updated[idx], [skill]: val };
                    return updated;
                  } else {
                    return [
                      ...prev,
                      {
                        language: lang,
                        speak: "",
                        read: "",
                        write: "",
                        [skill]: val,
                      },
                    ];
                  }
                });
              };

              return (
                <div
                  key={lIdx}
                  className="p-3.5 bg-zinc-50/80 dark:bg-zinc-950/60 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                      {lang}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {["speak", "read", "write"].map((skill) => (
                      <div
                        key={skill}
                        className="space-y-1.5 bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800"
                      >
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                          {skill}
                        </label>
                        <div className="flex gap-1">
                          {["Below Average", "Average", "Good"].map((level) => {
                            const isSelected = currentItem[skill] === level;
                            return (
                              <button
                                key={level}
                                type="button"
                                onClick={() => setOptionRating(skill, level)}
                                className={`flex-1 py-1 px-1.5 rounded text-[10px] font-bold transition-all border cursor-pointer ${
                                  isSelected
                                    ? level === "Good"
                                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm font-black"
                                      : level === "Below Average"
                                        ? "bg-rose-600 text-white border-rose-600 shadow-sm font-black"
                                        : "bg-amber-500 text-white border-amber-500 shadow-sm font-black"
                                    : "bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                }`}
                              >
                                {level === "Below Average"
                                  ? "Below Avg"
                                  : level}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const handleSubmitFinalEvaluation = async (e) => {
    e.preventDefault();
    if (!finalForm.decision) {
      toast.error("Please specify a final outcome decision!");
      return;
    }

    //   if (
    //   !Array.isArray(languageFluencyForm) ||
    //   languageFluencyForm.length === 0
    // ) {
    //   toast.error("Please add at least one language fluency");
    //   return;
    // }

    try {
      const payload = {
        candidateId: selectedCandidate._id,
        decision: finalForm.decision,
        rejectionReason: finalForm.rejectionReason,
        strengths: finalForm.strengths,
        recommendedDepartment: finalForm.recommendedDepartment,
        recommendedSalary: finalForm.recommendedSalary,
        salaryExpectation: finalForm.salaryExpectation,
        joiningAvailability: finalForm.joiningAvailability,
        review: review.trim(),
        reasoning: reasoning.trim(),
        languageFluency: languageFluencyForm,
      };

      const res = await Axios.post("/evaluations", payload);
      // console.log(res.data.success);
      // console.log(review);
      if (res.data.success) {
        // toast.success("Final placement decision submitted successfully");
        toast.success(
          finalForm.decision === "Closure"
            ? "Closure details submitted successfully"
            : "Final placement decision submitted successfully",
        );

        // Added review
        // if (review.trim()) {
        //   const currentUser = JSON.parse(localStorage.getItem("user"));
        //   setReviews((prev) => [
        //     {
        //       id: Date.now(),
        //       comment: review,
        //       reviewer: currentUser?.fullName || "HR",
        //       createdAt: new Date(),
        //     },
        //     ...prev,
        //   ]);

        //   setReview("");
        // }
        setReview("");
        setReasoning("");
        const updatedRes = await Axios.get(
          `/candidates/${selectedCandidate._id}`,
        );
        // console.log(updatedRes.data.data);
        if (updatedRes.data.success) {
          setSelectedCandidate(updatedRes.data.data);
        }
        fetchEvaluation(selectedCandidate._id);
        fetchCandidates(pagination.page, searchTerm);
        // console.log(selectedCandidate);
        // console.log(updatedRes.data.data.outcomes);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to submit final decision",
      );
    }
  };

  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      const preparedData = { ...data };
      if (typeof preparedData.languagesKnown === "string") {
        preparedData.languagesKnown = preparedData.languagesKnown
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      const formData = new FormData();
      Object.keys(preparedData).forEach((key) => {
        if (key === "resume") {
          if (preparedData[key] && preparedData[key][0] instanceof File) {
            formData.append("resume", preparedData[key][0]);
          }
        } else if (
          typeof preparedData[key] === "object" &&
          preparedData[key] !== null
        ) {
          formData.append(key, JSON.stringify(preparedData[key]));
        } else if (
          preparedData[key] !== undefined &&
          preparedData[key] !== null
        ) {
          formData.append(key, preparedData[key]);
        }
      });

      const response = await Axios.put(
        `/candidates/${selectedCandidate._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        toast.success("Candidate updated successfully");
        // setView("list");
        fetchCandidates(pagination.page, searchTerm);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const RatingSelector = ({ value = 0, onChange, disabled = false }) => {
    return (
      <div className="flex items-center gap-1 mt-1">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            disabled={disabled}
            onClick={() => onChange(num)}
            className={`w-6 h-6 rounded font-bold text-xs transition-all flex items-center justify-center border ${
              value === num
                ? "bg-zinc-900 border-zinc-900 text-white scale-105 shadow-sm"
                : value > 0 && num <= value
                  ? "bg-zinc-100 border-zinc-200 text-zinc-800"
                  : "bg-zinc-50 border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:bg-zinc-100/50"
            } ${disabled ? "cursor-not-allowed opacity-80" : "active:scale-95"}`}
          >
            {num}
          </button>
        ))}
      </div>
    );
  };

  const RenderStars = ({ count = 0 }) => {
    return (
      <div className="flex items-center gap-0.5 text-zinc-900 dark:text-zinc-100">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${i < count ? "fill-current text-zinc-900 dark:text-zinc-100" : "text-zinc-200"}`}
          />
        ))}
      </div>
    );
  };

  const getRoundTheme = (sectionType) => {
    switch (sectionType) {
      case "communication":
        return {
          border:
            "border-l-[4px] border-l-sky-500 border-zinc-200 dark:border-zinc-800",
          badge:
            "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 border-sky-100 dark:border-sky-900/50",
          title: "text-sky-750 dark:text-sky-400 font-extrabold",
          bg: "bg-sky-50/10 dark:bg-sky-950/5",
          quote:
            "border-l-[3px] border-sky-400 bg-sky-50/40 text-sky-950 dark:bg-sky-950/30 dark:text-sky-200",
        };
      case "technical":
        return {
          border:
            "border-l-[4px] border-l-violet-500 border-zinc-200 dark:border-zinc-800",
          badge:
            "bg-violet-50 text-violet-700 dark:bg-violet-955/40 dark:text-violet-400 border-violet-100 dark:border-violet-900/50",
          title: "text-violet-750 dark:text-violet-400 font-extrabold",
          bg: "bg-violet-50/10 dark:bg-violet-955/5",
          quote:
            "border-l-[3px] border-violet-400 bg-violet-50/40 text-violet-950 dark:bg-violet-955/30 dark:text-violet-200",
        };
      case "behavioral":
        return {
          border:
            "border-l-[4px] border-l-amber-500 border-zinc-200 dark:border-zinc-800",
          badge:
            "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-100 dark:border-amber-900/50",
          title: "text-amber-750 dark:text-amber-400 font-extrabold",
          bg: "bg-amber-50/10 dark:bg-amber-950/5",
          quote:
            "border-l-[3px] border-amber-400 bg-amber-50/40 text-amber-950 dark:bg-amber-955/30 dark:text-amber-200",
        };
      default:
        return {
          border:
            "border-l-[4px] border-l-zinc-500 border-zinc-200 dark:border-zinc-800",
          badge:
            "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700",
          title: "text-zinc-850 dark:text-zinc-200 font-extrabold",
          bg: "bg-zinc-50/50 dark:bg-zinc-900/50",
          quote:
            "border-l-[3px] border-zinc-400 bg-zinc-100/50 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-200",
        };
    }
  };

  const columns = [
    {
      key: "candidateId",
      label: "ID",
      className: "font-mono text-xs font-bold text-zinc-800",
    },
    {
      key: "fullName",
      label: "Candidate Name",
      render: (val) => (
        <span className="font-bold text-zinc-900 capitalize text-xs">
          {val}
        </span>
      ),
    },
    { key: "email", label: "Email", className: "text-xs" },
    { key: "mobileNumber", label: "Mobile", className: "text-xs" },
    {
      key: "age",
      label: "Age",
      render: (val) => (val ? `${val} yrs` : "-"),
      className: "text-xs",
    },
    {
      key: "status",
      label: "Status",
      render: (val, row) => {
        const displayStatus = getCandidateDisplayStatus(row);

        const statusStyles = {
          Waiting: "bg-amber-50 text-amber-700 border-amber-200",
          Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
          "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
          Completed: "bg-purple-50 text-purple-700 border-purple-200",
          Selected: "bg-emerald-50 text-emerald-700 border-emerald-200",
          Rejected: "bg-rose-50 text-rose-700 border-rose-200",
          Hold: "bg-orange-50 text-orange-700 border-orange-200",
          "Second Round": "bg-cyan-50 text-cyan-700 border-cyan-200",
          "Final Round": "bg-indigo-50 text-indigo-700 border-indigo-200",
          "Documents Uploaded": "bg-teal-50 text-teal-700 border-teal-200",
          "Document Uploaded": "bg-teal-50 text-teal-700 border-teal-200",
          "Offer Accepted": "bg-blue-50 text-blue-700 border-blue-200",
        };

        return (
          <div className="flex items-center gap-3">
            <span
              className={`
                inline-flex items-center justify-center
                h-8
                min-w-[120px]
                px-3
                rounded-md
                border
                text-[11px]
                font-semibold
                leading-none
                whitespace-nowrap
                ${
                  statusStyles[displayStatus] ||
                  "bg-zinc-50 text-zinc-700 border-zinc-200"
                }
              `}
            >
              {displayStatus}
            </span>

            {row.status === "Selected" &&
              row.documentsStatus?.toLowerCase() !== "submitted" && (
                <button
                  type="button"
                  onClick={() => handleSendSelectionMail(row)}
                  title={
                    row.selectionMailSent
                      ? "Selection mail sent"
                      : "Send selection mail to candidate"
                  }
                  className="
                    inline-flex items-center justify-center
                    h-8
                    px-3
                    rounded-md
                    border border-blue-600
                    bg-blue-600
                    text-white
                    text-[11px]
                    font-semibold
                    whitespace-nowrap
                    shadow-sm
                    transition-colors
                    hover:bg-blue-700
                    hover:border-blue-700
                    active:bg-blue-800
                  "
                >
                  {row.selectionMailSent ? "Sent" : "Send Mail"}
                </button>
              )}
          </div>
        );
      },
    },
    {
      key: "resumeFilePath",
      label: "Resume",
      render: (val) =>
        val ? (
          <a
            href={`${IMAGE_URL}/${val}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-100 text-zinc-800 rounded-md text-xs font-bold uppercase tracking-wider hover:bg-zinc-900 hover:text-white transition-all border border-zinc-200"
          >
            <FileText className="w-2.5 h-2.5" /> View CV
          </a>
        ) : (
          <span className="text-zinc-400 text-xs">No File</span>
        ),
    },
    {
      key: "createdAt",
      label: "Applied On",
      render: (val) =>
        new Date(val).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      className: "text-xs",
    },
  ];

  const formFields = [
    {
      name: "registrationDate",
      label: "Registration Date",
      type: "date",
      required: true,
      readOnly: true,
    },
    {
      name: "firstName",
      label: "First Name",
      required: true,
      placeholder: "Enter first name",
    },
    {
      name: "middleName",
      label: "Middle Name",
      placeholder: "Enter middle name",
    },
    {
      name: "lastName",
      label: "Last Name",
      required: true,
      placeholder: "Enter last name",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
    },
    {
      name: "mobileNumber",
      label: "Mobile Number",
      required: true,
    },
    {
      name: "whatsAppNumber",
      label: "WhatsApp Number",
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      required: true,
      options: [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
        { label: "Other", value: "Other" },
      ],
    },
    {
      name: "dateOfBirth",
      label: "Date of Birth",
      type: "date",
      required: true,
      max: new Date().toISOString().split("T")[0],
    },
    {
      name: "age",
      label: "Age",
      type: "number",
      required: true,
      readOnly: true,
    },
    {
      name: "maritalStatus",
      label: "Marital Status",
      type: "select",
      required: true,
      options: [
        { label: "Single", value: "Single" },
        { label: "Married", value: "Married" },
      ],
    },
    {
      name: "city",
      label: "City",
      required: true,
    },
    {
      name: "pincode",
      label: "Pincode",
      required: true,
    },
    {
      name: "addressLine1",
      label: "Address Line 1",
      required: true,
    },
    {
      name: "addressLine2",
      label: "Address Line 2",
    },
    {
      name: "addressLine3",
      label: "Address Line 3",
    },
    {
      name: "addressType",
      label: "Address Type",
      type: "select",
      required: true,
      options: [
        { label: "Rental", value: "Rental" },
        { label: "Owned", value: "Owned" },
        { label: "PG", value: "PG" },
      ],
    },
    {
      name: "stayingSince",
      label: "Staying Since (Years)",
      type: "number",
      required: true,
    },
    {
      name: "permanentAddress",
      label: "Permanent Address",
      type: "textarea",
      required: true,
    },
    {
      name: "languagesKnown",
      label: "Languages Known (comma separated)",
      required: true,
    },
    {
      name: "otherLanguage",
      label: "Other Language(s)",
    },
    {
      name: "references",
      label: "References",
      type: "array",
      fields: [
        { name: "name", label: "Reference Name", required: true },
        { name: "contact", label: "Reference Contact Number", required: true },
        { name: "relation", label: "Reference Relation", required: true },
      ],
    },
    {
      name: "source",
      label: "Source",
      type: "select",
      required: true,
      options: [
        { label: "Consultant", value: "Consultant" },
        { label: "Walk-in", value: "Walk-in" },
        { label: "Company HR", value: "Company HR" },
        { label: "Referral", value: "Referral" },
      ],
    },
    {
      name: "sourceRemarks",
      label: "Source Remarks / Details",
    },
    {
      name: "familyDetails",
      label: "Family Details (Up to 5)",
      type: "array",
      fields: [
        { name: "name", label: "Name" },
        { name: "relation", label: "Relation" },
        { name: "age", label: "Age", type: "number" },
        {
          name: "occupation",
          label: "Occupation",
          type: "select",
          options: [
            { label: "Government", value: "Government" },
            { label: "Private", value: "Private" },
            { label: "Self-employed", value: "Self-employed" },
          ],
        },
        { name: "designation", label: "Designation" },
      ],
    },
    {
      name: "educationDetails",
      label: "Education Details",
      type: "array",
      fields: [
        {
          name: "qualification",
          label: "Qualification",
          type: "select",
          required: true,
          options: [
            { label: "Below SSC", value: "Below SSC" },
            { label: "SSC", value: "SSC" },
            { label: "HSC", value: "HSC" },
            { label: "Graduate", value: "Graduate" },
            { label: "Post Graduate", value: "Post Graduate" },
          ],
        },
        { name: "university", label: "Board/University", required: true },
        { name: "yearOfPassing", label: "Year of Passing", required: true },
        { name: "percentage", label: "Percentage" },
      ],
    },
    {
      name: "experienceDetails",
      label: "Experience Details",
      type: "array",
      fields: [
        { name: "company", label: "Company Name" },
        { name: "designation", label: "Designation" },
        { name: "salary", label: "Salary/CTC" },
        { name: "noticePeriod", label: "Notice Period (Days)" },
        { name: "reasonToLeave", label: "Reason to Leave" },
      ],
    },
    {
      name: "resume",
      label: "Update Resume Document (PDF, Word)",
      type: "file",
      accept: ".pdf,.doc,.docx",
      required: false,
    },
  ];

  const tableData = candidates.map((c) => ({
    ...c,
    onEdit: c.status !== "Waiting" ? () => handleEdit(c) : undefined,
    onView: () => handleProfileView(c),
  }));

  const [exporting, setExporting] = useState(false);

  const handleExportToExcel = async () => {
    setExporting(true);
    try {
      const response = await Axios.get(`/candidates/export?q=${searchTerm}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `Candidates_Export_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Excel file exported successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export candidate ledger to Excel");
    } finally {
      setExporting(false);
    }
  };

  const outcomeMap = {};

  selectedCandidate?.outcomes?.forEach((item) => {
    outcomeMap[item.outcome] = item.hr?.fullName;
  });

  return (
    <div className="p-4 min-h-screen bg-[#FAF9F6] dark:bg-zinc-950 text-xs text-zinc-800">
      {view === "list" && (
        <div className="space-y-4">
          <div className="pb-2 border-b border-zinc-200/60 flex justify-between items-end">
            <div>
              <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Candidates
              </h1>
              <p className="text-zinc-500 text-xs mt-0.5">
                Manage and view all registered candidates.
              </p>
            </div>
            <button
              onClick={handleExportToExcel}
              disabled={exporting}
              className="px-3 py-1.5 bg-emerald-700 disabled:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              {exporting ? "Exporting..." : "Export Excel"}
            </button>
          </div>

          <DynamicTable
            title="Candidates Ledger"
            columns={columns}
            data={tableData}
            loading={loading}
            actions={["edit", "view"]}
            pagination={pagination}
            onPageChange={(page) =>
              setPagination((prev) => ({ ...prev, page }))
            }
            onSearch={setSearchTerm}
          />
        </div>
      )}

      {view === "edit" && (
        <div className="space-y-4">
          <button
            onClick={() => setView("list")}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition-colors text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to List
          </button>

          <DynamicForm
            title={`Edit: ${selectedCandidate?.fullName}`}
            fields={formFields}
            defaultValues={{
              ...selectedCandidate,
              languagesKnown: Array.isArray(selectedCandidate?.languagesKnown)
                ? selectedCandidate.languagesKnown.join(", ")
                : selectedCandidate?.languagesKnown,
            }}
            onSubmit={handleUpdate}
            loading={loading}
            submitLabel="Update Record"
          />
        </div>
      )}

      {view === "profile" && selectedCandidate && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Back button */}
          <button
            onClick={() => {
              setView("list");
              setSelectedCandidate(null);
            }}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Candidates
          </button>

          {/* SINGLE MASTER CARD FOR EVALUATION PAGE */}
          <div className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-md overflow-hidden">
            {/* 1. Header Area: Basic Info & Status */}
            <div className="p-6 bg-gradient-to-r from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950 border-b border-zinc-200/60 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-36 h-36 text-white bg-zinc-50 flex items-center justify-center font-bold text-xs">
                  {/* {selectedCandidate.fullName?.charAt(0).toUpperCase()} */}
                  {selectedCandidate?.selfieFilePath ? (
                    <img
                      src={`${IMAGE_URL}/${selectedCandidate.selfieFilePath}`}
                      alt={`${selectedCandidate.fullName} selfie`}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-white font-bold">
                      {selectedCandidate?.fullName?.charAt(0)?.toUpperCase() ||
                        "A"}
                    </span>
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-bold text-zinc-955 dark:text-zinc-50 capitalize tracking-tight">
                      {selectedCandidate.fullName}
                    </h2>
                    <span className="text-xs font-bold text-zinc-400 font-mono tracking-tight bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                      {selectedCandidate.candidateId}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-semibold text-zinc-500">
                    <span>
                      Applied:{" "}
                      {new Date(selectedCandidate.createdAt).toLocaleDateString(
                        "en-IN",
                        { day: "2-digit", month: "short", year: "numeric" },
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-zinc-650">
                <div>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all shadow-sm ${
                      {
                        Selected:
                          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-black",
                        Approved:
                          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-bold",
                        Rejected:
                          "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-bold",
                        Hold: "bg-orange-500/10 text-orange-650 dark:text-orange-400 border-orange-500/20 font-bold",
                        "In Progress":
                          "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 animate-pulse font-black",
                        Completed:
                          "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 font-bold",
                        "Second Round":
                          "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20 font-bold",
                        "Final Round":
                          "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 font-bold",
                        "Offer Accepted":
                          "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-bold",
                        "Documents Uploaded":
                          "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30 font-bold",
                        "Document Uploaded":
                          "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30 font-bold",
                      }[getCandidateDisplayStatus(selectedCandidate)] ||
                      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {getCandidateDisplayStatus(selectedCandidate)}
                  </span>
                </div>
                {selectedCandidate.status !== "Waiting" && (
                  <button
                    onClick={() => handleEdit(selectedCandidate)}
                    className="p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-amber-600 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all cursor-pointer shadow-sm flex items-center gap-1.5 px-3"
                    title="Edit Candidate"
                  >
                    <Edit className="w-3.5 h-3.5" />{" "}
                    <span className="font-bold uppercase tracking-wider text-[10px]">
                      Edit
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* 2. Full Candidate Profile */}
            <div className="p-6">{renderCandidateProfileDetails(false)}</div>

            {/* 3. Action / Status Areas (Waiting, Approved, In Progress, Outcome) */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              {/* ── WAITING STATE ── */}
              {(selectedCandidate.status === "Waiting" ||
                selectedCandidate.status === "submitted" ||
                !selectedCandidate.status) && (
                <div className="p-6">
                  <div className="border-t border-zinc-200/70 dark:border-zinc-700/50" />

                  {/* Approval CTA */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-500" /> Ready
                        to approve this candidate profile?
                      </p>
                      <p className="text-xs text-zinc-500 font-medium leading-relaxed max-w-md">
                        Approving confirms that all candidate data has been
                        reviewed and verified. This action will unlock the{" "}
                        <span className="font-bold text-zinc-700 dark:text-zinc-300">
                          Interview Pipeline
                        </span>
                        .
                      </p>
                    </div>
                    <button
                      onClick={handleApproveCandidate}
                      disabled={approveLoading}
                      className="flex-shrink-0 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
                    >
                      {approveLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Approve Candidate
                          Data
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ── APPROVED STATE: Show approver info + Start Interview ── */}
              {selectedCandidate.status === "Approved" && (
                <div className="p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200/60 dark:border-emerald-800/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200/80 dark:border-emerald-700/40 flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-widest">
                          Data Verified & Approved By
                        </p>
                        <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 capitalize">
                          {selectedCandidate.approvedBy?.fullName ||
                            selectedCandidate.updatedBy?.fullName ||
                            "HR Administrator"}
                          {(selectedCandidate.approvedBy?.role ||
                            selectedCandidate.updatedBy?.role) && (
                            <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest ml-1.5">
                              (
                              {selectedCandidate.approvedBy?.role ||
                                selectedCandidate.updatedBy?.role}
                              )
                            </span>
                          )}
                        </p>
                        {(selectedCandidate.approvedAt ||
                          selectedCandidate.updatedAt) && (
                          <p className="text-[10px] text-zinc-500 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(
                              selectedCandidate.approvedAt ||
                                selectedCandidate.updatedAt,
                            ).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleStartInterview}
                      className="flex-shrink-0 px-6 py-2.5 bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" /> Start Interview
                      Now
                    </button>
                  </div>
                </div>
              )}

              {/* IN PROGRESS OR SUBSEQUENT ROUNDS: Full-Width Interactive Form with Glassy Effect */}
              {["In Progress", "Second Round", "Final Round"].includes(
                selectedCandidate.status,
              ) && (
                <div className="p-6 space-y-5 animate-in fade-in duration-300">
                  {/* Section Evals Loop - Show completed sections */}
                  {sectionEvals.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-200/60 pb-1.5 flex items-center gap-1.5">
                        Completed Rounds
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {sectionEvals.map((sec, idx) => {
                          const theme = getRoundTheme(sec.sectionType);
                          return (
                            <div
                              key={idx}
                              className={`p-4 ${theme.bg} ${theme.border} dark:bg-zinc-900/50 rounded-xl shadow-sm space-y-3 flex flex-col transition-all duration-300 hover:shadow-md border border-zinc-200/60 dark:border-zinc-800`}
                            >
                              <div className="flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
                                <div>
                                  <p
                                    className={`text-xs font-black uppercase tracking-wider ${theme.title}`}
                                  >
                                    {sec.roundName}
                                  </p>
                                  <div className="mt-1 flex items-center gap-1.5">
                                    <span className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100">
                                      {sec.interviewer?.fullName}
                                    </span>
                                    <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                                      •{" "}
                                      {new Date(
                                        sec.conductedAt,
                                      ).toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                      })}
                                    </span>
                                  </div>
                                </div>
                                <span
                                  className={`px-2.5 py-1 ${theme.badge} border rounded-lg text-xs font-black tracking-tight shadow-sm`}
                                >
                                  {sec.averageScore} / 5
                                </span>
                              </div>
                              {sec.comments && (
                                <div
                                  className={`p-2.5 rounded-lg mt-1 ${theme.quote} italic shadow-sm relative overflow-hidden flex-shrink-0`}
                                >
                                  <p className="text-xs font-semibold leading-relaxed">
                                    "{sec.comments}"
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── Language Fluency Section (Above Add Review) ── */}
                  {renderLanguageFluencySection()}

                  {/* Submit New Section Form */}
                  <div className="w-full p-5 backdrop-blur-xl bg-white/85 dark:bg-zinc-900/85 border border-zinc-200/80 dark:border-zinc-800 rounded-xl shadow-sm space-y-4">
                    <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-xs">
                            Interview Parameter Matrix
                          </h3>
                          <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                            Submit New Section
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Review */}
                    <div className="space-y-4">
                      {/* Existing Reviews */}
                      {reviews.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase text-zinc-500">
                            Reviews ({reviews.length})
                          </h4>

                          {reviews.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                                  {item.reviewer?.fullName}
                                </span>

                                <span className="text-[11px] text-zinc-500">
                                  {new Date(item.createdAt).toLocaleString(
                                    "en-IN",
                                  )}
                                </span>
                              </div>

                              <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                                {item.comment}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {reasonings.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase text-zinc-500">
                            Reasoning / Comments ({reasonings.length})
                          </h4>

                          {reasonings.map((item, idx) => (
                            <div
                              key={item._id || idx}
                              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    {item.reviewer?.fullName}
                                  </h4>

                                  <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                                    {item.round}
                                  </span>
                                </div>

                                <span className="text-[11px] text-zinc-500">
                                  {new Date(item.createdAt).toLocaleString(
                                    "en-IN",
                                  )}
                                </span>
                              </div>

                              {/* Reasoning / Comment */}
                              <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                                {item.comment}
                              </p>

                              {/* CLOSURE DETAILS */}
                              {item.round === "Closure" &&
                                existingEval?.closureDetails && (
                                  <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700 space-y-2">
                                    {existingEval.closureDetails
                                      .recommendedDepartment && (
                                      <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                        <span className="font-semibold">
                                          Recommended Department:
                                        </span>{" "}
                                        {
                                          existingEval.closureDetails
                                            .recommendedDepartment
                                        }
                                      </p>
                                    )}

                                    {existingEval.closureDetails
                                      .recommendedSalary !== undefined &&
                                      existingEval.closureDetails
                                        .recommendedSalary !== null && (
                                        <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                          <span className="font-semibold">
                                            Recommended Salary:
                                          </span>{" "}
                                          ₹
                                          {Number(
                                            existingEval.closureDetails
                                              .recommendedSalary,
                                          ).toLocaleString("en-IN")}
                                        </p>
                                      )}

                                    {existingEval.closureDetails
                                      .joiningAvailability && (
                                      <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                        <span className="font-semibold">
                                          Joining Availability:
                                        </span>{" "}
                                        {new Date(
                                          existingEval.closureDetails
                                            .joiningAvailability,
                                        ).toLocaleDateString("en-IN")}
                                      </p>
                                    )}
                                  </div>
                                )}

                              {/* SECOND ROUND */}
                              {item.round === "Second Round" &&
                                existingEval?.salaryExpectation && (
                                  <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                      <span className="font-semibold">
                                        Salary Expectation:
                                      </span>{" "}
                                      {existingEval.salaryExpectation}
                                    </p>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Review */}
                      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                        <label className="block text-xs font-bold uppercase tracking-wide text-zinc-500 mb-2">
                          Add Review
                        </label>

                        <textarea
                          rows={4}
                          placeholder="Write your review..."
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        />

                        {/* <div className="flex justify-end mt-3">
                          <button
                            onClick={handleAddReview}
                            disabled={!review.trim()}
                            className="px-5 py-2 rounded-lg bg-zinc-900 text-white text-xs font-bold uppercase disabled:opacity-50"
                          >
                            Add Review
                          </button>
                        </div> */}
                      </div>
                    </div>

                    {/* Final Decision Form */}

                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 p-5 space-y-4 shadow-sm">
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-3 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" /> Final Placement
                        Decision
                      </p>

                      <form
                        onSubmit={handleSubmitFinalEvaluation}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1.5">
                              Final Decision *
                            </label>
                            <select
                              required
                              value={finalForm.decision}
                              // onChange={(e) =>
                              //   setFinalForm((prev) => ({
                              //     ...prev,
                              //     decision: e.target.value,
                              //   }))
                              // }
                              onChange={(e) => {
                                const value = e.target.value;

                                // -----------------------------------------
                                // HR selects "Selected"
                                // → copy previous HR's Closure details
                                // -----------------------------------------
                                // console.log("Selected Value", value);
                                // console.log(
                                //   "Existing Evaluation:",
                                //   existingEval,
                                // );
                                // console.log(
                                //   "Closure Details:",
                                //   existingEval?.closureDetails,
                                // );
                                if (value === "Selected") {
                                  const closure = existingEval?.closureDetails;

                                  if (closure) {
                                    setFinalForm((prev) => ({
                                      ...prev,

                                      decision: "Selected",

                                      strengths: closure.strengths || "",

                                      recommendedDepartment:
                                        closure.recommendedDepartment || "",

                                      recommendedSalary:
                                        closure.recommendedSalary ?? "",

                                      joiningAvailability:
                                        closure.joiningAvailability
                                          ? new Date(
                                              closure.joiningAvailability,
                                            )
                                              .toISOString()
                                              .split("T")[0]
                                          : "",
                                    }));

                                    return;
                                  }
                                }

                                // -----------------------------------------
                                // Other decisions
                                // -----------------------------------------
                                setFinalForm((prev) => ({
                                  ...prev,
                                  decision: value,
                                }));
                              }}
                              className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-zinc-900 transition-all"
                            >
                              <option value="">Select Outcome</option>
                              <option
                                value="Selected"
                                disabled={!!outcomeMap["Selected"]}
                              >
                                {outcomeMap["Selected"]
                                  ? `Selected (Taken by ${outcomeMap["Selected"]})`
                                  : "Selected"}
                              </option>

                              <option
                                value="Rejected"
                                disabled={!!outcomeMap["Rejected"]}
                              >
                                {outcomeMap["Rejected"]
                                  ? `Rejected (Taken by ${outcomeMap["Rejected"]})`
                                  : "Rejected"}
                              </option>

                              <option
                                value="Hold"
                                disabled={!!outcomeMap["Hold"]}
                              >
                                {outcomeMap["Hold"]
                                  ? `Hold (Taken by ${outcomeMap["Hold"]})`
                                  : "Hold"}
                              </option>

                              <option
                                value="Second Round"
                                disabled={!!outcomeMap["Second Round"]}
                              >
                                {outcomeMap["Second Round"]
                                  ? `Second Round (Taken by ${outcomeMap["Second Round"]})`
                                  : "Second Round"}
                              </option>

                              <option
                                value="Closure"
                                // disabled={!!outcomeMap["Closure"]}
                              >
                                {outcomeMap["Closure"]
                                  ? `Closure (Taken by ${outcomeMap["Closure"]})`
                                  : "Closure"}
                              </option>

                              <option
                                value="Final Round"
                                disabled={!!outcomeMap["Final Round"]}
                              >
                                {outcomeMap["Final Round"]
                                  ? `Final Round (Taken by ${outcomeMap["Final Round"]})`
                                  : "Final Round"}
                              </option>
                            </select>
                          </div>

                          {finalForm.decision === "Selected" && (
                            <>
                              <div>
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1.5">
                                  Recommended Dept
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. Technology"
                                  value={finalForm.recommendedDepartment}
                                  onChange={(e) =>
                                    setFinalForm((prev) => ({
                                      ...prev,
                                      recommendedDepartment: e.target.value,
                                    }))
                                  }
                                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-zinc-900"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1.5">
                                  Recommended Salary
                                </label>
                                <input
                                  type="number"
                                  placeholder="CTC (e.g. 550000)"
                                  value={finalForm.recommendedSalary}
                                  onChange={(e) =>
                                    setFinalForm((prev) => ({
                                      ...prev,
                                      recommendedSalary: e.target.value,
                                    }))
                                  }
                                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-zinc-900"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1.5">
                                  Joining Availability
                                </label>
                                <input
                                  type="date"
                                  value={finalForm.joiningAvailability}
                                  onChange={(e) =>
                                    setFinalForm({
                                      ...finalForm,
                                      joiningAvailability: e.target.value,
                                    })
                                  }
                                  min={new Date().toISOString().split("T")[0]}
                                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-bold focus:outline-none focus:border-zinc-900"
                                />
                              </div>
                            </>
                          )}

                          {finalForm.decision === "Closure" && (
                            <>
                              <div>
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1.5">
                                  Recommended Dept
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. Technology"
                                  value={finalForm.recommendedDepartment}
                                  onChange={(e) =>
                                    setFinalForm((prev) => ({
                                      ...prev,
                                      recommendedDepartment: e.target.value,
                                    }))
                                  }
                                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-zinc-900"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1.5">
                                  Recommended Salary
                                </label>
                                <input
                                  type="number"
                                  placeholder="CTC (e.g. 550000)"
                                  value={finalForm.recommendedSalary}
                                  onChange={(e) =>
                                    setFinalForm((prev) => ({
                                      ...prev,
                                      recommendedSalary: e.target.value,
                                    }))
                                  }
                                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-zinc-900"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1.5">
                                  Joining Availability
                                </label>
                                <input
                                  type="date"
                                  value={finalForm.joiningAvailability}
                                  onChange={(e) =>
                                    setFinalForm({
                                      ...finalForm,
                                      joiningAvailability: e.target.value,
                                    })
                                  }
                                  min={new Date().toISOString().split("T")[0]}
                                  className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-bold focus:outline-none focus:border-zinc-900"
                                />
                              </div>
                            </>
                          )}

                          {finalForm.decision === "Second Round" && (
                            <div>
                              <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1.5">
                                Salary Expectation
                              </label>

                              <input
                                type="text"
                                placeholder="e.g. ₹6 LPA / 600000 / Negotiable"
                                value={finalForm.salaryExpectation}
                                onChange={(e) =>
                                  setFinalForm((prev) => ({
                                    ...prev,
                                    salaryExpectation: e.target.value,
                                  }))
                                }
                                className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-zinc-900"
                              />
                            </div>
                          )}
                        </div>

                        {finalForm.decision === "Approved" ? (
                          <div>
                            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1.5">
                              Candidate Strengths
                            </label>
                            <textarea
                              placeholder="List key positive markers, expertise skills..."
                              rows={2}
                              value={finalForm.strengths}
                              onChange={(e) =>
                                setFinalForm((prev) => ({
                                  ...prev,
                                  strengths: e.target.value,
                                }))
                              }
                              className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-zinc-900"
                            />
                          </div>
                        ) : finalForm.decision &&
                          finalForm.decision !== "Approved" ? (
                          <div>
                            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1.5">
                              Reasoning / Comments *
                            </label>
                            <textarea
                              placeholder="Provide reason for this outcome..."
                              rows={2}
                              required
                              // value={finalForm.rejectionReason}
                              // onChange={(e) =>
                              //   setFinalForm((prev) => ({
                              //     ...prev,
                              //     rejectionReason: e.target.value,
                              //   }))
                              // }
                              value={reasoning}
                              onChange={(e) => setReasoning(e.target.value)}
                              className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-zinc-900"
                            />
                          </div>
                        ) : null}

                        <div className="flex justify-end pt-1">
                          <button
                            type="submit"
                            className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                          >
                            Submit Final Decision
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* ── EVALUATION: COMPLETED / OUTCOME ── */}
              {["Approved", "Rejected", "Hold", "Completed"].includes(
                selectedCandidate.status,
              ) && (
                <div className="px-6 py-5 space-y-5 bg-zinc-50/40 dark:bg-zinc-800/10">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.18em] flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" /> Interview Outcome Report
                    </p>
                    {["Rejected", "Hold"].includes(
                      selectedCandidate.status,
                    ) && (
                      <button
                        onClick={() => setIsReInterviewModalOpen(true)}
                        disabled={approveLoading}
                        className="px-4 py-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Clock className="w-3.5 h-3.5" /> Start Re-Interview
                      </button>
                    )}
                  </div>

                  {/* Review / Comments */}
                  {reviews.length > 0 && (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm mb-6">
                      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">
                        Reviews
                      </h3>

                      <div className="space-y-3">
                        {reviews.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-xs font-bold">
                                {item.reviewer?.fullName}
                              </p>

                              <span className="text-[10px] text-zinc-400">
                                {new Date(item.createdAt).toLocaleString(
                                  "en-IN",
                                )}
                              </span>
                            </div>

                            <p className="text-sm text-zinc-700 dark:text-zinc-300">
                              {item.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {reasonings.length > 0 && (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm mb-6">
                      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">
                        Reasoning / Comments
                      </h3>

                      <div className="space-y-3">
                        {reasonings.map((item) => (
                          <div
                            key={item._id}
                            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                  {item.reviewer?.fullName}
                                </h4>

                                <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                                  {item.round}
                                </span>
                              </div>

                              <span className="text-[11px] text-zinc-500">
                                {new Date(item.createdAt).toLocaleString(
                                  "en-IN",
                                )}
                              </span>
                            </div>

                            <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                              {item.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {evalLoading ? (
                    <div className="flex items-center justify-center py-10 gap-3">
                      <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs text-zinc-400 font-semibold">
                        Fetching evaluation record...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {existingEval &&
                        (() => {
                          const styles = {
                            Approved: "from-emerald-500 to-teal-600",
                            Rejected: "from-rose-500 to-red-600",
                            Hold: "from-amber-500 to-orange-600",
                            Completed: "from-purple-500 to-violet-600",
                            "Second Round": "from-teal-500 to-cyan-600",
                            "Final Round": "from-indigo-500 to-violet-600",
                          };
                          return (
                            <div
                              className={`p-5 bg-gradient-to-r ${styles[existingEval.decision] || "from-zinc-800 to-zinc-950"} rounded-2xl text-white flex flex-wrap items-center justify-between gap-4 shadow-md`}
                            >
                              <div>
                                <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.25em]">
                                  Final Placement Decision
                                </p>
                                <p className="text-2xl font-black tracking-wide uppercase mt-0.5">
                                  {existingEval.decision}
                                </p>
                              </div>
                              {existingEval.interviewer && (
                                <div className="text-right">
                                  <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest">
                                    Decision By
                                  </p>
                                  <p className="font-black text-white text-sm capitalize">
                                    {existingEval.interviewer.fullName}
                                  </p>
                                  <p className="text-[10px] text-white/60 font-medium">
                                    {new Date(
                                      existingEval.createdAt,
                                    ).toLocaleString("en-IN")}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                      {sectionEvals.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                            Round-by-Round Scores
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {sectionEvals.map((sec, idx) => {
                              const theme = getRoundTheme(sec.sectionType);
                              return (
                                <div
                                  key={idx}
                                  className={`p-4 rounded-xl border space-y-3 ${theme.border} ${theme.bg}`}
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p
                                        className={`text-[10px] font-black uppercase tracking-widest ${theme.title}`}
                                      >
                                        {sec.roundName}
                                      </p>
                                      <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mt-0.5">
                                        {sec.interviewer?.fullName}
                                      </p>
                                      <p className="text-[9px] text-zinc-400">
                                        {new Date(
                                          sec.conductedAt,
                                        ).toLocaleDateString("en-IN", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                        })}
                                      </p>
                                    </div>
                                    <span
                                      className={`px-2.5 py-1 ${theme.badge} border rounded-lg text-xs font-black`}
                                    >
                                      {sec.averageScore} / 5
                                    </span>
                                  </div>
                                  <div className="space-y-1 pt-2 border-t border-zinc-200/60 dark:border-zinc-700/40">
                                    {Object.entries(sec.scores || {})
                                      .filter(([, v]) => v > 0)
                                      .map(([k, v]) => (
                                        <div
                                          key={k}
                                          className="flex justify-between items-center"
                                        >
                                          <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 capitalize">
                                            {k
                                              .replace(/([A-Z])/g, " $1")
                                              .trim()}
                                          </span>
                                          <RenderStars count={v} />
                                        </div>
                                      ))}
                                  </div>
                                  {sec.comments && (
                                    <div
                                      className={`p-2 rounded-lg italic text-xs ${theme.quote}`}
                                    >
                                      "{sec.comments}"
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {existingEval && (
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-4 shadow-sm">
                          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">
                            Final Placement Details
                          </p>
                          {existingEval.decision === "Approved" ? (
                            <>
                              {existingEval.strengths && (
                                <div>
                                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                                    Candidate Strengths
                                  </p>
                                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-lg">
                                    {existingEval.strengths}
                                  </p>
                                </div>
                              )}
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                                    Recommended Dept
                                  </p>
                                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 capitalize">
                                    {existingEval.recommendedDepartment || "—"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                                    Recommended Salary
                                  </p>
                                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                                    {existingEval.recommendedSalary
                                      ? "₹" +
                                        Number(
                                          existingEval.recommendedSalary,
                                        ).toLocaleString()
                                      : "—"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                                    Joining Availability
                                  </p>
                                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                                    {existingEval.joiningAvailability
                                      ? new Date(
                                          existingEval.joiningAvailability,
                                        ).toLocaleDateString("en-IN")
                                      : "—"}
                                  </p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div>
                              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                                Reasoning / Comments
                              </p>
                              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-lg">
                                {existingEval.rejectionReason ||
                                  "No reasoning provided."}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {!existingEval && sectionEvals.length === 0 && (
                        <div className="p-5 text-center text-xs text-zinc-400 italic bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                          No evaluation record found for this candidate.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RESUME QUICK PREVIEW */}
      {isResumeOpen && selectedCandidate && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in duration-300">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-850 flex items-center justify-center border border-zinc-200/60">
                  <FileText className="w-4 h-4 text-zinc-700" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-800 dark:text-zinc-100 text-xs">
                    {selectedCandidate.fullName}'s Resume
                  </h3>
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                    Quick Preview Hub
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsResumeOpen(false)}
                className="px-3 py-1.5 bg-white border border-zinc-200 text-xs font-bold text-zinc-500 uppercase tracking-wider rounded-lg hover:border-zinc-400 hover:text-zinc-800 transition-all active:scale-95 shadow-sm"
              >
                Close Preview
              </button>
            </div>

            <div className="flex-1 bg-zinc-100 relative">
              <iframe
                src={`${IMAGE_URL}/${selectedCandidate.resumeFilePath}`}
                className="w-full h-full border-none"
                title="Resume Preview"
              />
            </div>

            <div className="p-3 bg-zinc-50 border-t border-zinc-100 text-center text-xs text-zinc-400 font-bold uppercase tracking-wider">
              Zoom and search natively inside the browser preview above (Ctrl +
              F or Cmd + F to Search)
            </div>
          </div>
        </div>
      )}
      {/* MODAL: RE-INTERVIEW CONFIRMATION */}
      {isReInterviewModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in duration-300 p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-wide">
              Start Re-Interview?
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
              Are you sure you want to re-interview{" "}
              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                {selectedCandidate?.fullName}
              </span>
              ?
              <br />
              <br />
              This will safely archive their previous evaluations and reset
              their status back to Waiting, allowing them to proceed through a
              fresh pipeline.
            </p>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setIsReInterviewModalOpen(false)}
                className="flex-1 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmReInterview}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Start Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;
