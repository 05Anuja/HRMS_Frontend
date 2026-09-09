import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  CheckCircle2,
  User,
  Briefcase,
  FileText,
  Eye,
  AlertCircle,
} from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import Axios from "../utils/axiosConfig";
import { toast } from "react-toastify";
import logoImg from "../assets/Silgate_Solutions_Logo.svg";

// Custom subcomponents
import Step1Personal from "../components/CandidateRegistration/Step1Personal";
import Step2Professional from "../components/CandidateRegistration/Step2Professional";
import Step3Resume from "../components/CandidateRegistration/Step3Resume";
import ReviewForm from "../components/CandidateRegistration/ReviewForm";
import NavigationButtons from "../components/CandidateRegistration/NavigationButtons";

const CandidateRegistration = () => {
  const [stage, setStage] = useState("splash"); // splash, welcome, form, review, success
  const [step, setStep] = useState(1);
  const [candidateId, setCandidateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [acknowledged, setAcknowledged] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const methods = useForm({
    defaultValues: {
      registrationDate: new Date().toISOString().split("T")[0],
      familyDetails: [{}, {}, {}, {}, {}],
      educationDetails: [{}],
      experienceDetails: [{}],
      references: [{}],
      permanentAddressType: "same_as_current",
      languagesKnown: [],
      sameAsMobile: false,
      whatsAppNumber: "",
      pincode: "",
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      addressType: "",
      stayingSince: "",
      otherLanguage: "",
      source: "",
      sourceRemarks: "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = methods;

  const watchDOB = watch("dateOfBirth");
  const watchAddressType = watch("permanentAddressType");
  const watchCurrentAddress = watch("currentAddress");
  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (watchAddressType === "same_as_current") {
      setValue("permanentAddress", watchCurrentAddress, {
        shouldValidate: true,
      });
    }
  }, [watchAddressType, watchCurrentAddress, setValue]);

  useEffect(() => {
    if (watchDOB) {
      const today = new Date();
      const birthDate = new Date(watchDOB);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setValue("age", age);
    }
  }, [watchDOB, setValue]);

  // WhatsApp Number auto-fill from mobile number
  const watchMobileNumber = watch("mobileNumber");
  const watchSameAsMobile = watch("sameAsMobile");
  useEffect(() => {
    if (watchSameAsMobile) {
      setValue("whatsAppNumber", watchMobileNumber, { shouldValidate: true });
    }
  }, [watchSameAsMobile, watchMobileNumber, setValue]);

  // Pincode auto-fetch city details
  const watchPincode = watch("pincode");
  useEffect(() => {
    if (watchPincode && watchPincode.length === 6) {
      const fetchCity = async () => {
        try {
          const res = await Axios.get(`/pincodes/${watchPincode}`);
          const data = res.data;
          if (data.success && data.data) {
            setValue("city", data.data.city, { shouldValidate: true });
          }
        } catch (e) {
          console.error("Failed to fetch city details from pincode", e);
        }
      };
      fetchCity();
    }
  }, [watchPincode, setValue]);

  // Combine address lines into currentAddress field
  const watchAddress1 = watch("addressLine1");
  const watchAddress2 = watch("addressLine2");
  const watchAddress3 = watch("addressLine3");
  const watchCity = watch("city");
  useEffect(() => {
    let cityPincodePart = "";
    if (watchCity && watchPincode) {
      cityPincodePart = `${watchCity} - ${watchPincode}`;
    } else if (watchCity) {
      cityPincodePart = watchCity;
    } else if (watchPincode) {
      cityPincodePart = watchPincode;
    }
    const parts = [
      watchAddress1,
      watchAddress2,
      watchAddress3,
      cityPincodePart,
    ].filter(Boolean);
    const combined = parts.join(", ");
    setValue("currentAddress", combined, { shouldValidate: true });
  }, [
    watchAddress1,
    watchAddress2,
    watchAddress3,
    watchCity,
    watchPincode,
    setValue,
  ]);

  useEffect(() => {
    if (stage === "splash") {
      const timer = setTimeout(() => setStage("welcome"), 2000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onSubmit = async (data) => {
    if (step === 1) {
      // Check if at least one family member has been started/filled
      // We filter out completely empty entries first
      const filledFamilyMembers = (data.familyDetails || []).filter(
        (f) =>
          f.name?.trim() ||
          f.age ||
          f.relation?.trim() ||
          f.occupation?.trim() ||
          f.designation?.trim(),
      );

      if (filledFamilyMembers.length > 0) {
        const allFilledMembersAreComplete = filledFamilyMembers.every(
          (f) =>
            f.name?.trim() &&
            f.age &&
            f.relation?.trim() &&
            f.occupation?.trim(),
        );

        // Family validations - removed
        // if (!allFilledMembersAreComplete) {
        //   toast.error(
        //     "Please complete all details for any family member you have started filling (Name, Age, Relation, Occupation)",
        //   );
        //   return;
        // }
      }
    }

    if (step === 2) {
      // Validate that at least one reference is fully filled
      const filledReferences = (data.references || []).filter(
        (r) => r.name?.trim() || r.contact?.trim() || r.relation?.trim(),
      );

      if (filledReferences.length === 0) {
        toast.error("Please add at least one reference.");
        return;
      }

      const allFilledReferencesAreComplete = filledReferences.every(
        (r) => r.name?.trim() && r.contact?.trim() && r.relation?.trim(),
      );

      if (!allFilledReferencesAreComplete) {
        toast.error(
          "Please complete all fields for the references you have started filling (Name, Contact, Relation).",
        );
        return;
      }
    }

    if (step < 3) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (stage === "form") {
      setStage("review");
      return;
    }

    // Final Submission
    setLoading(true);
    try {
      const submissionData = { ...data };
      if (
        submissionData.educationDetails &&
        Array.isArray(submissionData.educationDetails)
      ) {
        submissionData.educationDetails = submissionData.educationDetails.map(
          (edu) => {
            const val = edu.score || edu.percentage;
            return {
              ...edu,
              score: val || "",
              percentage: val || "",
            };
          },
        );
      }

      const formData = new FormData();
      console.log(formData);

      // Append all JSON data as fields
      Object.keys(submissionData).forEach((key) => {
        if (key === "resume" && submissionData[key][0]) {
          formData.append("resume", submissionData[key][0]);
        } else if (key === "selfie") {
          if (submissionData[key]?.[0] instanceof File) {
            formData.append("selfie", submissionData[key][0]);
          }
        } else if (typeof submissionData[key] === "object") {
          formData.append(key, JSON.stringify(submissionData[key]));
        } else {
          formData.append(key, submissionData[key]);
        }
      });

      const response = await Axios.post("/candidates/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percentCompleted);
        },
      });

      if (response.data.success) {
        setCandidateId(response.data.data.candidateId);
        setStage("success");
      }
    } catch (error) {
      // Axios interceptor handles toast
    } finally {
      setLoading(false);
    }
  };

  if (stage === "splash") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-zinc-100)_0%,_transparent_40%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--color-zinc-100)_0%,_transparent_40%)] opacity-20" />

        <div className="flex flex-col items-center animate-in zoom-in fade-in duration-1000">
          <div className="flex items-center justify-center mb-2 hover:scale-105 transition-transform duration-500">
            <img
              src={logoImg}
              alt="Silgate Solutions"
              className="w-32 lg:w-44 object-contain"
            />
          </div>
          <div className="text-center space-y-2">
            <p className="text-zinc-500 dark:text-zinc-400 font-bold text-base lg:text-lg max-w-md uppercase tracking-wider">
              Thank you for visiting Silgate Solutions Ltd. <br />
              <span className="text-xs font-black text-zinc-600 uppercase tracking-widest mt-2 block">
                Please complete your interview registration form
              </span>
            </p>
            <div className="loader-track max-w-xs mx-auto h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-8">
              <div className="h-full bg-black dark:bg-white rounded-full animate-premium-loader" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "welcome") {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        <div className="max-w-xl w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-150 p-8 lg:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center mb-1">
              <img
                src={logoImg}
                alt="Silgate Solutions"
                className="h-8 lg:h-10 object-contain"
              />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-widest uppercase">
                Welcome
              </h1>
              <p className="text-xs text-zinc-400 font-bold leading-relaxed uppercase tracking-wider">
                Thank you for visiting{" "}
                <span className="text-black dark:text-white font-black underline decoration-2 underline-offset-4">
                  Silgate Solutions Ltd.
                </span>
                <br />
                Please complete your interview registration form.
              </p>
            </div>
          </div>

          <div className="bg-zinc-50/50 rounded-xl p-5 border border-zinc-150 space-y-4">
            <h3 className="text-xs font-black text-black uppercase tracking-[0.2em] flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-black" />
              Important Guidelines
            </h3>
            <div className="space-y-3">
              {[
                "Connect to the corporate WiFi network first.",
                "Fill all fields marked with (*) carefully.",
                "Upload resume in PDF/Word format (Max 5MB).",
                "Review all entered details before submission.",
                "Once submitted, changes cannot be made.",
                "Wait in the designated interview area.",
              ].map((text, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 shrink-0" />
                  <p className="text-xs font-bold text-zinc-650 uppercase tracking-widest leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStage("form")}
            className="w-full py-3.5 bg-black hover:bg-zinc-900 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-zinc-950/10 transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
          >
            Start Registration
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  if (stage === "success") {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/60 dark:border-zinc-800 p-10 text-center space-y-6 animate-in zoom-in duration-500">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30 mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-widest">
              Registration Successful!
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
              Thank you for registering. Your candidate ID is:
            </p>
            <div className="inline-block px-8 py-4 bg-black text-white dark:bg-white dark:text-black rounded-xl text-3xl font-black tracking-[0.25em] shadow-xl shadow-zinc-950/20">
              #{candidateId}
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider leading-relaxed">
            Please wait for your turn in the interview area. Our team will call
            you shortly.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs font-black text-zinc-400 hover:text-black dark:hover:text-white uppercase tracking-widest transition-colors block mx-auto underline decoration-2 underline-offset-4"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, label: "Personal", icon: User },
    { id: 2, label: "Professional", icon: Briefcase },
    { id: 3, label: "Resume", icon: FileText },
    { id: 4, label: "Review", icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] selection:bg-primary selection:text-white pb-32 lg:pb-10">
      {/* MODERN STICKY HEADER */}
      <header className="sticky top-0 z-[60] bg-white/70 backdrop-blur-2xl border-b border-slate-100 px-4 py-3 lg:px-20 lg:py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={logoImg}
            alt="Silgate Solutions"
            className="h-9 lg:h-11 w-auto object-contain transition-transform hover:scale-105 duration-300"
          />
        </div>
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
            Registration Portal
          </span>
        </div>
      </header>
      <main className="max-w-[95%] mx-auto pt-20 pb-20">
        {/* PROGRESS STEPPER — BOLD & CLEAR */}
        <div className="mb-10 lg:mb-20 px-4 lg:px-10">
          <div className="max-w-3xl mx-auto">
            {/* Step nodes + connecting line */}
            <div className="flex items-start">
              {steps.map((s, i) => {
                const isCompleted =
                  stage === "review" ? s.id <= 3 : step > s.id;
                const isActive =
                  stage === "review" ? s.id === 4 : step === s.id;
                return (
                  <React.Fragment key={s.id}>
                    {/* Node */}
                    <div className="flex flex-col items-center gap-2.5 relative z-10">
                      <div
                        className={`
                          w-11 h-11 lg:w-13 lg:h-13
                          flex items-center justify-center rounded-xl
                          transition-all duration-500 ease-in-out
                          ${
                            isCompleted
                              ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/30"
                              : isActive
                                ? "bg-white border-2 border-zinc-900 text-zinc-900 shadow-lg shadow-zinc-900/20"
                                : "bg-zinc-100 border-2 border-zinc-200 text-zinc-400"
                          }
                        `}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <s.icon
                            className={`w-5 h-5 ${isActive ? "text-zinc-900" : "text-zinc-400"}`}
                          />
                        )}
                      </div>
                      {/* Label — always visible, bold black */}
                      <span
                        className={`
                        text-xs font-black uppercase tracking-widest whitespace-nowrap
                        ${isCompleted || isActive ? "text-zinc-900" : "text-zinc-400"}
                      `}
                      >
                        {s.label}
                      </span>
                    </div>

                    {/* Connector — sits between nodes, vertically centered to icon */}
                    {i < steps.length - 1 && (
                      <div className="flex-1 mx-2 mt-5 h-[3px] bg-zinc-200 rounded-full relative overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-zinc-900 rounded-full transition-all duration-700 ease-in-out"
                          style={{
                            width:
                              stage === "review" || step > s.id ? "100%" : "0%",
                          }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* MAIN FORM CARD */}
        <div className="bg-white rounded-2xl shadow-xl border border-zinc-150 overflow-hidden p-6 lg:p-10 relative z-10 mx-4 lg:mx-0">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="animate-in fade-in slide-in-from-bottom-8 duration-1000"
            >
              {/* STAGE CONTAINER (UNWRAPPED) */}
              <div className="relative">
                {stage === "form" && step === 1 && (
                  <Step1Personal isMobile={isMobile} />
                )}

                {stage === "form" && step === 2 && <Step2Professional />}

                {stage === "form" && step === 3 && <Step3Resume />}

                {stage === "review" && (
                  <ReviewForm setStage={setStage} setStep={setStep} />
                )}

                <NavigationButtons
                  stage={stage}
                  step={step}
                  setStage={setStage}
                  setStep={setStep}
                  loading={loading}
                />
              </div>
            </form>
          </FormProvider>
        </div>

        {/* PAGE FOOTER */}
        <div className="mt-20 text-center space-y-4">
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">
            &copy; 2026 SILGATE SOLUTIONS LTD • INTERVIEW PORTAL
          </p>
          <div className="flex justify-center gap-10 text-[9px] font-black text-zinc-300 uppercase tracking-[0.2em]">
            <span className="hover:text-black cursor-pointer transition-colors">
              Privacy
            </span>
            <span className="hover:text-black cursor-pointer transition-colors">
              Terms
            </span>
            <span className="hover:text-black cursor-pointer transition-colors">
              Support
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidateRegistration;
