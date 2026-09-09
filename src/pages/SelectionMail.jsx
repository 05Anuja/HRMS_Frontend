// import Axios from "@/utils/axiosConfig";
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// const SelectionMail = () => {
//   const navigate = useNavigate();

//   // ============================================================
//   // GET CANDIDATE ID FROM URL
//   // Example:
//   // /selection-mail/12345
//   // ============================================================

//   const { id } = useParams();

//   console.log("Candidate ID:", id);

//   // ============================================================
//   // STATES
//   // ============================================================

//   const [evaluation, setEvaluation] = useState(null);

//   const [loading, setLoading] = useState(true);

//   const [sending, setSending] = useState(false);

//   // ============================================================
//   // FORM DATA
//   // ============================================================

//   const [formData, setFormData] = useState({
//     to: "",
//     subject:
//       "Congratulations! Job Offer & Onboarding Instructions - Silgate Solutions",
//     body: "",
//   });

//   // ============================================================
//   // FETCH EVALUATION
//   // ============================================================

//   const fetchEvaluation = async () => {
//     if (!id) {
//       console.error("Candidate ID is missing");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await Axios.get(`/evaluations/candidate/${id}`);

//       console.log("Evaluation API Response:", response.data);

//       if (!response.data?.success && !response.data?.data) {
//         throw new Error(
//           response.data?.message || "Failed to fetch candidate evaluation.",
//         );
//       }

//       setEvaluation(response.data.data);
//     } catch (error) {
//       console.error("Error fetching evaluation:", error);

//       alert(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to fetch candidate evaluation.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ============================================================
//   // FETCH WHEN ID CHANGES
//   // ============================================================

//   useEffect(() => {
//     fetchEvaluation();
//   }, [id]);

//   // ============================================================
//   // EVALUATION DATA
//   // ============================================================

//   const recommendedDepartment =
//     evaluation?.recommendedDepartment || "Not Available";

//   const recommendedSalary = evaluation?.recommendedSalary ?? "Not Available";

//   const joiningAvailability = evaluation?.joiningAvailability
//     ? new Date(evaluation.joiningAvailability).toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "long",
//         year: "numeric",
//       })
//     : "Not Available";

//   // ============================================================
//   // AUTO FILL EMAIL + MESSAGE
//   // ============================================================

//   useEffect(() => {
//     if (!evaluation) {
//       return;
//     }

//     const candidate = evaluation?.candidate;

//     if (!candidate) {
//       console.error("Candidate data not found inside evaluation.");
//       return;
//     }

//     const candidateName =
//       candidate.fullName ||
//       candidate.firstName ||
//       candidate.name ||
//       "Candidate";

//     const candidateEmail = candidate.email || "";

//     const department = evaluation.recommendedDepartment || "Not Available";

//     const salary = evaluation.recommendedSalary ?? "Not Available";

//     const joiningDate = evaluation.joiningAvailability
//       ? new Date(evaluation.joiningAvailability).toLocaleDateString("en-IN", {
//           day: "2-digit",
//           month: "long",
//           year: "numeric",
//         })
//       : "Not Available";

//     // ==========================================================
//     // AUTO GENERATED CUSTOM MESSAGE
//     // ==========================================================

//     const customMessage = `Date: ${new Date().toLocaleDateString("en-IN")}

// Congratulations ${candidateName}!

// We are delighted to inform you that you have been selected for the position of ${department} at Silgate Solutions Ltd.

// Your offered salary will be INR ${salary} per annum.

// Your joining date will be ${joiningDate}.

// Please submit your required onboarding documents within 3 business days using the link provided by the HR team.

// We are excited to have you join our team and look forward to your valuable contribution to the organization.

// Please confirm your acceptance of this offer and your availability to join on the mentioned date.

// Regards,

// HR Team
// Silgate Solutions Ltd.`;

//     // ==========================================================
//     // SET FORM DATA
//     // ==========================================================

//     setFormData({
//       to: candidateEmail,

//       subject:
//         "Congratulations! Job Offer & Onboarding Instructions - Silgate Solutions",

//       body: customMessage,
//     });
//   }, [evaluation]);

//   // ============================================================
//   // HANDLE INPUT CHANGE
//   // ============================================================

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // ============================================================
//   // SEND SELECTION EMAIL
//   // ============================================================

//   const handleSendEmail = async (e) => {
//     e.preventDefault();

//     // ----------------------------------------------------------
//     // VALIDATE CANDIDATE ID
//     // ----------------------------------------------------------

//     if (!id) {
//       alert("Candidate ID is missing.");
//       return;
//     }

//     // ----------------------------------------------------------
//     // VALIDATE EMAIL
//     // ----------------------------------------------------------

//     if (!formData.to) {
//       alert("Candidate email is required.");
//       return;
//     }

//     // ----------------------------------------------------------
//     // VALIDATE MESSAGE
//     // ----------------------------------------------------------

//     if (!formData.body.trim()) {
//       alert("Mail message is required.");
//       return;
//     }

//     try {
//       setSending(true);

//       // ========================================================
//       // BACKEND PAYLOAD
//       // ========================================================
//       //
//       // Backend expects:
//       //
//       // {
//       //   subject: "...",
//       //   customMessage: "..."
//       // }
//       //
//       // Candidate ID is already sent in the URL.
//       // ========================================================

//       const payload = {
//         subject: formData.subject,
//         customMessage: formData.body,
//       };

//       console.log("Selection Email Payload:", payload);

//       // ========================================================
//       // API CALL
//       // ========================================================

//       const response = await Axios.post(
//         `/candidates/${id}/send-selection-mail`,
//         payload,
//       );

//       console.log("Send Selection Email Response:", response.data);

//       // ========================================================
//       // SUCCESS
//       // ========================================================

//       if (response.data?.success === false) {
//         throw new Error(
//           response.data?.message || "Failed to send selection email.",
//         );
//       }

//       alert("Selection email sent successfully!");

//       navigate("/candidates");
//     } catch (error) {
//       console.error("Send Selection Email Error:", error);

//       alert(
//         error.response?.data?.message ||
//           error.message ||
//           "Something went wrong while sending email.",
//       );
//     } finally {
//       setSending(false);
//     }
//   };

//   // ============================================================
//   // LOADING SCREEN
//   // ============================================================

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gray-100">
//         <div className="rounded-xl bg-white px-8 py-6 shadow-md">
//           <p className="text-gray-600">Loading selection details...</p>
//         </div>
//       </div>
//     );
//   }

//   // ============================================================
//   // UI
//   // ============================================================

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="mx-auto max-w-5xl">
//         {/* ====================================================
//             HEADER
//         ==================================================== */}

//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">
//             Send Selection Email
//           </h1>

//           <p className="mt-1 text-sm text-gray-500">
//             Review and edit the selection letter before sending it to the
//             candidate.
//           </p>
//         </div>

//         {/* ====================================================
//             FORM
//         ==================================================== */}

//         <form
//           onSubmit={handleSendEmail}
//           className="rounded-xl bg-white p-6 shadow-md"
//         >
//           <div className="space-y-5">
//             {/* ==================================================
//                 TO
//             ================================================== */}

//             <div>
//               <label className="mb-2 block text-sm font-semibold text-gray-700">
//                 To
//               </label>

//               <input
//                 type="email"
//                 name="to"
//                 value={formData.to}
//                 onChange={handleChange}
//                 placeholder="Candidate email"
//                 className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 required
//               />
//             </div>

//             {/* ==================================================
//                 CANDIDATE NAME
//             ================================================== */}

//             <div>
//               <label className="mb-2 block text-sm font-semibold text-gray-700">
//                 Candidate Name
//               </label>

//               <input
//                 type="text"
//                 value={
//                   evaluation?.candidate?.fullName ||
//                   evaluation?.candidate?.firstName ||
//                   evaluation?.candidate?.name ||
//                   ""
//                 }
//                 disabled
//                 className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-600 outline-none"
//               />
//             </div>

//             {/* ==================================================
//                 SUBJECT
//             ================================================== */}

//             <div>
//               <label className="mb-2 block text-sm font-semibold text-gray-700">
//                 Subject
//               </label>

//               <input
//                 type="text"
//                 name="subject"
//                 value={formData.subject}
//                 onChange={handleChange}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />
//             </div>

//             {/* ==================================================
//                 MAIL BODY
//             ================================================== */}

//             <div>
//               <label className="mb-2 block text-sm font-semibold text-gray-700">
//                 Mail Body
//               </label>

//               <textarea
//                 name="body"
//                 value={formData.body}
//                 onChange={handleChange}
//                 rows={22}
//                 className="w-full resize-y rounded-lg border border-gray-300 px-4 py-4 font-sans text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />
//             </div>
//           </div>

//           {/* ====================================================
//               SELECTION DETAILS
//           ==================================================== */}

//           <div className="mt-6 rounded-lg bg-gray-50 p-4">
//             <h3 className="mb-3 text-sm font-semibold text-gray-700">
//               Selection Details
//             </h3>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//               {/* Department */}
//               <div>
//                 <p className="text-xs text-gray-500">Recommended Department</p>

//                 <p className="font-medium text-gray-800">
//                   {recommendedDepartment}
//                 </p>
//               </div>

//               {/* Salary */}
//               <div>
//                 <p className="text-xs text-gray-500">Recommended Salary</p>

//                 <p className="font-medium text-gray-800">
//                   INR {recommendedSalary}
//                 </p>
//               </div>

//               {/* Joining Date */}
//               <div>
//                 <p className="text-xs text-gray-500">Joining Date</p>

//                 <p className="font-medium text-gray-800">
//                   {joiningAvailability}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* ====================================================
//               BUTTONS
//           ==================================================== */}

//           <div className="mt-6 flex justify-end gap-3">
//             {/* Cancel */}
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
//             >
//               Cancel
//             </button>

//             {/* Send */}
//             <button
//               type="submit"
//               disabled={sending}
//               className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {sending ? "Sending..." : "Send Selection Email"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SelectionMail;

import Axios from "@/utils/axiosConfig";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SelectionMail = () => {
  const navigate = useNavigate();

  // ============================================================
  // GET CANDIDATE ID FROM URL
  // Example:
  // /selection-mail/12345
  // ============================================================

  const { id } = useParams();

  console.log("Candidate ID:", id);

  // ============================================================
  // STATES
  // ============================================================

  const [evaluation, setEvaluation] = useState(null);

  const [loading, setLoading] = useState(true);

  const [sending, setSending] = useState(false);

  // ============================================================
  // FORM DATA
  // ============================================================

  const [formData, setFormData] = useState({
    to: "",
    subject:
      "Congratulations! Job Offer & Onboarding Instructions - Silgate Solutions",
    body: "",
  });

  // ============================================================
  // FETCH EVALUATION
  // ============================================================

  const fetchEvaluation = async () => {
    if (!id) {
      console.error("Candidate ID is missing");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await Axios.get(`/evaluations/candidate/${id}`);

      console.log("Evaluation API Response:", response.data);

      if (!response.data?.success && !response.data?.data) {
        throw new Error(
          response.data?.message || "Failed to fetch candidate evaluation.",
        );
      }

      setEvaluation(response.data.data);
    } catch (error) {
      console.error("Error fetching evaluation:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch candidate evaluation.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FETCH WHEN ID CHANGES
  // ============================================================

  useEffect(() => {
    fetchEvaluation();
  }, [id]);

  // ============================================================
  // EVALUATION DATA
  // ============================================================

  const recommendedDepartment =
    evaluation?.recommendedDepartment || "Not Available";

  const recommendedSalary = evaluation?.recommendedSalary ?? "Not Available";

  const joiningAvailability = evaluation?.joiningAvailability
    ? new Date(evaluation.joiningAvailability).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Not Available";

  // ============================================================
  // AUTO FILL EMAIL + MESSAGE
  // ============================================================

  useEffect(() => {
    if (!evaluation) {
      return;
    }

    const candidate = evaluation?.candidate;

    console.log(candidate);

    if (!candidate) {
      console.error("Candidate data not found inside evaluation.");
      return;
    }

    const candidateFirstName = candidate.fullName?.split(" ")[0];

    const candidateName =
      candidate.fullName ||
      candidate.firstName ||
      candidate.name ||
      "Candidate";

    const candidateEmail = candidate.email || "";

    const department = evaluation.recommendedDepartment || "Not Available";

    const salary = evaluation.recommendedSalary ?? "Not Available";

    const joiningDate = evaluation.joiningAvailability
      ? new Date(evaluation.joiningAvailability).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "Not Available";

    // ==========================================================
    // AUTO GENERATED CUSTOM MESSAGE
    // ==========================================================

    const customMessage = `Date: ${new Date().toLocaleDateString("en-IN")}

Congratulations ${candidateFirstName}!

We are delighted to inform you that you have been selected for the position of ${department} at Silgate Solutions Ltd.
Your offered salary will be INR ${salary} per annum.
Your joining date will be ${joiningDate}.
Please submit your required onboarding documents within 3 business days using the link provided by the HR team.
We are excited to have you join our team and look forward to your valuable contribution to the organization.
Please confirm your acceptance of this offer and your availability to join on the mentioned date.

Regards,
HR Team
Silgate Solutions Ltd.`;

    // ==========================================================
    // SET FORM DATA
    // ==========================================================

    setFormData({
      to: candidateEmail,

      subject:
        "Congratulations! Job Offer & Onboarding Instructions - Silgate Solutions",

      body: customMessage,
    });
  }, [evaluation]);

  // ============================================================
  // HANDLE INPUT CHANGE
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // SEND SELECTION EMAIL
  // ============================================================

  const handleSendEmail = async (e) => {
    e.preventDefault();

    // ----------------------------------------------------------
    // VALIDATE CANDIDATE ID
    // ----------------------------------------------------------

    if (!id) {
      alert("Candidate ID is missing.");
      return;
    }

    // ----------------------------------------------------------
    // VALIDATE EMAIL
    // ----------------------------------------------------------

    if (!formData.to) {
      alert("Candidate email is required.");
      return;
    }

    // ----------------------------------------------------------
    // VALIDATE MESSAGE
    // ----------------------------------------------------------

    if (!formData.body.trim()) {
      alert("Mail message is required.");
      return;
    }

    try {
      setSending(true);

      // ========================================================
      // BACKEND PAYLOAD
      // ========================================================

      const payload = {
        subject: formData.subject,
        customMessage: formData.body,
      };

      console.log("Selection Email Payload:", payload);

      // ========================================================
      // API CALL
      // ========================================================

      const response = await Axios.post(
        `/candidates/${id}/send-selection-mail`,
        payload,
      );

      console.log("Send Selection Email Response:", response.data);

      // ========================================================
      // SUCCESS
      // ========================================================

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "Failed to send selection email.",
        );
      }

      // ============================================================
      // SAVE SENT MAIL STATUS
      // ============================================================

      // const sentMails = JSON.parse(
      //   localStorage.getItem("selectionMailsSent") || "{}",
      // );

      // sentMails[id] = true;

      // localStorage.setItem("selectionMailsSent", JSON.stringify(sentMails));

      alert("Selection email sent successfully!");

      navigate("/candidates");
    } catch (error) {
      console.error("Send Selection Email Error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong while sending email.",
      );
    } finally {
      setSending(false);
    }
  };

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <span className="text-2xl">✉</span>
          </div>

          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <h2 className="text-base font-bold text-slate-800">
            Loading Selection Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Please wait while we prepare the selection email...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-5 sm:px-5 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* ======================================================
            PAGE HEADER
        ====================================================== */}

        <div className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 shadow-lg">
          <div className="px-5 py-5 sm:px-7 sm:py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Header Left */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-2xl text-white shadow-inner backdrop-blur-sm">
                  ✉
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Send Selection Email
                  </h1>

                  <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                    Review and customize the selection letter before sending it.
                  </p>
                </div>
              </div>

              {/* Candidate Status */}
              <div className="flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.8)]" />
                Selected Candidate
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            MAIN FORM
        ====================================================== */}

        <form
          onSubmit={handleSendEmail}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50"
        >
          {/* ====================================================
              EMAIL HEADER
          ==================================================== */}

          <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                ✉
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-800 sm:text-base">
                  Email Details
                </h2>

                <p className="text-xs text-slate-500">
                  Candidate and message information
                </p>
              </div>
            </div>
          </div>

          {/* ====================================================
              FORM CONTENT
          ==================================================== */}

          <div className="space-y-6 p-4 sm:p-6 lg:p-7">
            {/* ==================================================
                TO + CANDIDATE NAME
            ================================================== */}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* TO */}

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  {/* <span className="text-blue-600">To</span> */}
                  <span>Candidate Email</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                    Auto-filled
                  </span>
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    @
                  </span>

                  <input
                    type="email"
                    // name="to"
                    // value={formData.to}
                    value={evaluation?.candidate?.email}
                    onChange={handleChange}
                    placeholder="candidate@example.com"
                    disabled
                    className="
                      w-full rounded-xl
                      border border-slate-200
                      bg-slate-100
                      py-3 pl-10 pr-4
                      text-sm font-medium
                      text-slate-600
                      shadow-sm
                      outline-none
                      cursor-not-allowed
                    "
                  />
                </div>
              </div>

              {/* CANDIDATE NAME */}

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span>Candidate Name</span>

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                    Auto-filled
                  </span>
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                    👤
                  </span>

                  <input
                    type="text"
                    value={evaluation?.candidate?.fullName || ""}
                    disabled
                    className="
                      w-full rounded-xl
                      border border-slate-200
                      bg-slate-100
                      py-3 pl-10 pr-4
                      text-sm font-medium
                      text-slate-600
                      shadow-sm
                      outline-none
                      cursor-not-allowed
                    "
                  />
                </div>
              </div>
            </div>

            {/* ==================================================
                SUBJECT
            ================================================== */}

            <div>
              <label className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>Subject</span>

                <span className="text-xs font-normal text-slate-400">
                  Editable
                </span>
              </label>

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="
                  w-full rounded-xl
                  border border-slate-200
                  bg-white
                  px-4 py-3
                  text-sm font-medium
                  text-slate-800
                  shadow-sm
                  outline-none
                  transition-all duration-200
                  hover:border-slate-300
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                "
              />
            </div>

            {/* ==================================================
                MAIL BODY
            ================================================== */}

            <div>
              <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Mail Body
                </label>

                <span className="text-xs text-slate-400">
                  You can edit the message before sending
                </span>
              </div>

              <div
                className="
                  overflow-hidden rounded-xl
                  border border-slate-200
                  bg-white
                  shadow-sm
                  transition-all duration-200
                  focus-within:border-blue-500
                  focus-within:ring-4
                  focus-within:ring-blue-500/10
                "
              >
                {/* Decorative Toolbar */}

                {/* <div className="flex items-center gap-1 border-b border-slate-100 bg-slate-50 px-3 py-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-slate-500">
                    B
                  </div>

                  <div className="flex h-7 w-7 items-center justify-center rounded-md text-xs italic text-slate-500">
                    I
                  </div>

                  <div className="mx-1 h-4 w-px bg-slate-200" />

                  <span className="text-xs text-slate-400">
                    Selection Letter
                  </span>
                </div> */}

                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  rows={18}
                  className="
                    min-h-[350px]
                    w-full
                    resize-none
                    border-0
                    bg-white
                    px-4
                    py-4
                    font-sans
                    text-sm
                    leading-7
                    text-slate-700
                    outline-none
                    sm:min-h-[420px]
                  "
                />
              </div>
            </div>
          </div>

          {/* ====================================================
              ACTION FOOTER
          ==================================================== */}

          <div className="border-t border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-6">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {/* CANCEL */}

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  border border-slate-300
                  bg-white
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-slate-700
                  shadow-sm
                  transition-all duration-200
                  hover:border-slate-400
                  hover:bg-slate-50
                  hover:shadow
                  active:scale-[0.98]
                  sm:w-auto
                "
              >
                Cancel
              </button>

              {/* SEND */}

              <button
                type="submit"
                disabled={sending}
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-600
                  to-indigo-600
                  px-7
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-md
                  shadow-blue-500/20
                  transition-all duration-200
                  hover:from-blue-700
                  hover:to-indigo-700
                  hover:shadow-lg
                  hover:shadow-blue-500/25
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:w-auto
                "
              >
                {sending ? (
                  <>
                    <span
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white
                        border-t-transparent
                      "
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <span className="text-base">✉</span>
                    Send Selection Email
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* ======================================================
            FOOTER NOTE
        ====================================================== */}

        <div className="px-2 py-4 text-center">
          <p className="text-[11px] text-slate-400">
            Please review the email content carefully before sending it to the
            candidate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectionMail;
