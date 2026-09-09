import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Axios from "@/utils/axiosConfig";

const OfferAcceptance = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [candidate, setCandidate] = useState(null);

  const [undertaking1, setUndertaking1] = useState(false);
  const [undertaking2, setUndertaking2] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);

  // --------------------------------------------------
  // Document status
  // --------------------------------------------------

  const documentsSubmitted = candidate?.documentsStatus === "Submitted";

  const canAcceptOffer =
    documentsSubmitted && undertaking1 && undertaking2 && !submitting;

  // --------------------------------------------------
  // Verify offer token
  // --------------------------------------------------

  useEffect(() => {
    if (!token) {
      setError("Invalid offer link.");
      setLoading(false);
      return;
    }

    verifyOfferToken();
  }, [token]);

  const verifyOfferToken = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await Axios.get(
        `candidates/offer/verify-token/${token}`,
      );

      if (!response.data?.success) {
        setError(response.data?.message || "Unable to verify the offer link.");
        return;
      }

      const candidateData = response.data?.data;

      if (!candidateData) {
        setError("Candidate information not found.");
        return;
      }

      console.log("Offer verification response:", candidateData);

      // --------------------------------------------------
      // Already accepted
      // --------------------------------------------------

      if (
        candidateData.offerStatus === "Offer Accepted" ||
        candidateData.status === "Offer Accepted"
      ) {
        setAccepted(true);
        setCandidate(candidateData);
        return;
      }

      setCandidate(candidateData);
    } catch (err) {
      console.error("Offer verification error:", err);

      setError(
        err.response?.data?.message || "This offer link is invalid or expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Accept offer
  // --------------------------------------------------

  const handleAcceptOffer = async () => {
    // Frontend document check
    if (!documentsSubmitted) {
      setError(
        "Please upload all required documents before accepting the offer.",
      );
      return;
    }

    // Undertaking check
    if (!undertaking1 || !undertaking2) {
      setError("Please accept both undertakings to continue.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await Axios.post("candidates/offer/accept", {
        token,
        undertaking1,
        undertaking2,
      });

      if (!response.data?.success) {
        setError(response.data?.message || "Unable to accept the offer.");
        return;
      }

      console.log("Offer acceptance response:", response.data);

      setAccepted(true);

      // Update local candidate status
      setCandidate((previousCandidate) => ({
        ...previousCandidate,
        status: "Offer Accepted",
        offerStatus: "Offer Accepted",
      }));
    } catch (err) {
      console.error("Accept offer error:", err);

      setError(
        err.response?.data?.message ||
          "Something went wrong while accepting the offer.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Upload documents
  // --------------------------------------------------

  const handleUploadDocuments = () => {
    if (candidate?.documentUploadToken) {
      navigate(`/upload-documents?token=${candidate.documentUploadToken}`);
      return;
    }

    setError("Document upload link is not available. Please contact HR.");
  };

  // --------------------------------------------------
  // Loading screen
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            Verifying your offer
          </h2>

          <p className="text-gray-500 mt-2">
            Please wait while we verify your offer link.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Error screen
  // --------------------------------------------------

  if (error && !candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
          <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            Invalid Offer Link
          </h2>

          <p className="text-gray-500 mt-3 leading-relaxed">{error}</p>

          <p className="text-sm text-gray-400 mt-5">
            Please contact HR if you believe this link is incorrect.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Already accepted / success screen
  // --------------------------------------------------

  if (accepted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
          {/* Header */}

          <div className="bg-green-700 px-8 py-8 text-center">
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-9 h-9 text-green-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-white">Offer Accepted</h1>

            <p className="text-green-100 mt-2">
              Your offer has been successfully accepted.
            </p>
          </div>

          {/* Content */}

          <div className="p-8">
            <div className="text-center">
              <p className="text-gray-700 text-lg">
                Thank you
                {candidate?.name ? `, ${candidate.name}` : ""}.
              </p>

              <p className="text-gray-500 mt-3">
                We have successfully recorded your acceptance of the offer and
                the undertaking.
              </p>
            </div>

            {/* Acceptance details */}

            <div className="mt-8 bg-gray-50 rounded-xl p-5">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">Offer Status</span>

                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                  Accepted
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500">Undertaking</span>

                <span className="text-green-600 font-semibold">Accepted</span>
              </div>
            </div>

            {/* Error */}

            {error && (
              <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Upload documents */}

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-4">
                Your offer acceptance has been recorded successfully.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Offer Letter
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Main Offer Card */}

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Company Header */}

          <div className="border-b border-gray-200 px-6 sm:px-10 py-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  SILGATE SOLUTIONS
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Human Resources Department
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-sm text-gray-500">Offer Letter</p>

                <p className="font-semibold text-gray-800">Employment Offer</p>
              </div>
            </div>
          </div>

          {/* Offer Content */}

          <div className="px-6 sm:px-10 py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">OFFER LETTER</h2>

              <div className="w-20 h-1 bg-green-700 mx-auto mt-3 rounded-full"></div>
            </div>

            {/* Candidate Information */}

            <div className="bg-gray-50 rounded-xl p-5 mb-8">
              <h3 className="font-semibold text-gray-800 mb-4">
                Candidate Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Candidate Name</p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {candidate?.name || "Candidate"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Position</p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {candidate?.position || candidate?.jobTitle || "Position"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Joining Date</p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {candidate?.joiningDate
                      ? new Date(candidate.joiningDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          },
                        )
                      : "As communicated by HR"}
                  </p>
                </div>

                {candidate?.email && (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>

                    <p className="font-semibold text-gray-900 mt-1 break-all">
                      {candidate.email}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Letter */}

            <div className="space-y-5 text-gray-700 leading-7">
              <p>
                Dear{" "}
                <span className="font-semibold text-gray-900">
                  {candidate?.name || "Candidate"}
                </span>
                ,
              </p>

              <p>
                We are pleased to inform you that you have been selected for the
                position of{" "}
                <span className="font-semibold">
                  {candidate?.position ||
                    candidate?.jobTitle ||
                    "the offered position"}
                </span>{" "}
                at Silgate Solutions.
              </p>

              <p>
                We are delighted to extend this employment offer to you. We look
                forward to having you as a part of our organization and wish you
                success in your role.
              </p>

              <p>
                Please review the terms of this offer carefully and confirm your
                acceptance using the button provided below.
              </p>
            </div>

            {/* Offer Information */}

            <div className="mt-8 border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Offer Details</h3>
              </div>

              <div className="divide-y divide-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 px-5 py-4">
                  <span className="text-gray-500">Position</span>

                  <span className="font-medium text-gray-900">
                    {candidate?.position ||
                      candidate?.jobTitle ||
                      "As mentioned in your selection"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 px-5 py-4">
                  <span className="text-gray-500">Joining Date</span>

                  <span className="font-medium text-gray-900">
                    {candidate?.joiningDate
                      ? new Date(candidate.joiningDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          },
                        )
                      : "As communicated by HR"}
                  </span>
                </div>

                {candidate?.salary && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 px-5 py-4">
                    <span className="text-gray-500">Salary</span>

                    <span className="font-medium text-gray-900">
                      {candidate.salary}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mt-10">
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Terms &amp; Conditions
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Please read the following terms and conditions carefully
                    before accepting the offer.
                  </p>
                </div>

                <div className="px-5 sm:px-7 py-6 space-y-8 text-gray-700 leading-7">
                  <section>
                    <h4 className="font-bold text-gray-900 mb-3">
                      Introduction
                    </h4>
                    <p>
                      Silgate Solutions Ltd. is engaged in the business of
                      domestic call centre. Silgate expects each person to
                      conduct themselves at all times with proper decorum.
                      Likewise, the company has established certain rules and
                      regulations to protect it assets and goodwill. The
                      following Rules and Regulations shall apply to all persons
                      while in the premise at all times including break times
                      and work done on off-day, rest day etc.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-bold text-gray-900 mb-3">
                      1. Shift Details
                    </h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Your shift timings will be 10:00 AM to 7:00 PM,
                        reporting time will be 9:45 AM.
                      </li>
                      <li>
                        The salary cycle is 1st to 30th and the salary date is
                        any day in the 2nd week of the month.
                      </li>
                      <li>Sunday&apos;s will be weekly off.</li>
                      <li>There will be a Service Agreement of 6 months.</li>
                      <li>
                        Your CL&apos;s will start after 6 months of the
                        probation period, and PL&apos;s after completion of 1
                        year.
                      </li>
                      <li>
                        Dress code for Monday-Thursday is formals and
                        Friday-Saturday is casuals.
                      </li>
                      <li>
                        Targets and incentives are designed by operation team as
                        per the company policy. Incentives are subject to change
                        as per quality parameters and Client Rejections.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h4 className="font-bold text-gray-900 mb-3">
                      2. Code of Conduct
                    </h4>
                    <ol className="list-[upper-alpha] pl-5 space-y-2">
                      <li>
                        Threatening, attempting, or doing bodily harm to another
                        person.
                      </li>
                      <li>
                        Threatening, intimidating, interfering with, or using
                        abusive language towards others.
                      </li>
                      <li>Unauthorized possession of weapons.</li>
                      <li>
                        Making false or malicious statements concerning other
                        employees, supervisors.
                      </li>
                      <li>
                        Use of alcoholic beverages or illegal drugs during
                        working hours.
                      </li>
                      <li>
                        Reporting for work under the influence of alcoholic
                        beverages or illegal drugs.
                      </li>
                      <li>Unauthorized solicitation for any purpose.</li>
                      <li>
                        Inappropriate dress or lack of personal hygiene which
                        adversely affects proper performance of duties or
                        constitutes a health or safety hazard.
                      </li>
                      <li>
                        Unauthorized or improper use or possession of uniforms,
                        identification cards, badges, or permits.
                      </li>
                      <li>
                        Failure to exercise good judgment, or being
                        discourteous, in dealing with fellow employees or the
                        general public.
                      </li>
                      <li>
                        Smoking is strictly prohibited in the Company&apos;s
                        premise.
                      </li>
                      <li>
                        All employees are strictly prohibited to eat in the
                        Company&apos;s premise except in the cafeteria.
                      </li>
                      <li>
                        You will not carry on any business or enter for any part
                        of your time in any capacity in the services of other
                        person or persons and company or companies. You will
                        devote your whole time and attention to your duties to
                        promote the interests of our organizations and you will
                        not utilize or divulge to any person or persons any of
                        our trade secrets or confidential information.
                      </li>
                      <li>
                        You will not mislead the prospect/ Customer on any
                        service /product offered.
                      </li>
                      <li>
                        You will not mislead the prospect/ Customer about their
                        business or organization&apos;s name or falsely
                        represent themselves.
                      </li>
                      <li>
                        You will not make any false / unauthorized commitment on
                        behalf of any client for any facility / service.
                      </li>
                    </ol>
                    <p className="mt-4 font-medium text-gray-800">
                      If any employees are found guilty for any of above
                      mentioned code of conduct strict action and legal action
                      will be taken against them as per company policy.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-bold text-gray-900 mb-3">
                      3. Training Module
                    </h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Training will be un- paid or paid depends on process to
                        process.
                      </li>
                      <li>Training period depends on the process.</li>
                      <li>
                        During the said period you will undergo through a
                        certification process from client&apos;s end.
                      </li>
                      <li>
                        If you fail to clear the client certification, then you
                        will not be entitled to work further with Silgate
                        Solutions Ltd and will not be eligible for any payments
                        of training.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h4 className="font-bold text-gray-900 mb-3">
                      4. Attendance on Floor
                    </h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Your Attendance will be deducted on the basis of your
                        per day salary.
                      </li>
                      <li>
                        Your Salary will be placed on hold if you do not meet
                        the below required criteria for attendance:
                        <ul className="list-[circle] pl-5 mt-2 space-y-1">
                          <li>If you remain absent for 2 or more days.</li>
                          <li>If you remain absent between (1st- 9th).</li>
                        </ul>
                      </li>
                      <li>
                        If you remain absent for more than 2 days without any
                        prior intimation or notice, then you will be considered
                        as absconding.
                      </li>
                      <li>
                        Absconding agents will not be entitled for due salary or
                        any other benefits from the company.
                      </li>
                      <li>
                        Each day your attendance will be marked on the basis of
                        your log-in and log-out timings.
                      </li>
                      <li>
                        If you fail to log in or log-out any day, then it will
                        be counted as a login error and fine for it is rs.100/-
                        each time.
                      </li>
                      <li>
                        No leaves will be allowed during training &amp;
                        probation period.
                      </li>
                      <li>
                        Resignation during probation period will not be
                        accepted.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h4 className="font-bold text-gray-900 mb-3">
                      5. Resignation &amp; Notice Period
                    </h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Notice period after completion of the SA will be minimum
                        1 month.
                      </li>
                      <li>
                        During Resignation period or if you resign you will be
                        not be eligible for any pending incentives from client
                        and company apart from salary.
                      </li>
                      <li>
                        Your dues with the company will be cleared in the time
                        span of 45 days from your date of resignation.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h4 className="font-bold text-gray-900 mb-3">
                      6. Confidentiality
                    </h4>
                    <p>
                      You acknowledge that during the course of your employment
                      with the Company, you will become familiar with the
                      company&apos;s trade secrets and with other confidential
                      information concerning the Company and its associates and
                      related Companies and that your services will be of a
                      special unique and extraordinary value to the Company. You
                      agree that during, the term hereof and for five years
                      thereafter, you shall not directly or indirectly own,
                      manage, control, participate in, consult with, render
                      services for, or engage in any business competing with the
                      businesses of the Company or its associates, subsidiaries
                      or related Companies within India.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-bold text-gray-900 mb-3">
                      7. Data Breach or Fraud
                    </h4>
                    <p>
                      In the event of any data breach or fraudulent activity
                      involving customer data, Company reserves the right to
                      take immediate legal action. This may include initiating a
                      police complaint and pursuing civil remedies against the
                      responsible individuals. Such actions will be taken in
                      accordance with applicable laws and regulations.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-bold text-gray-900 mb-3">
                      8. Disciplinary Action
                    </h4>
                    <p>
                      Disciplinary action will be taken if you fail to abide by
                      these terms and conditions mentioned in the undertaking.
                    </p>
                  </section>

                  <section className="border-t border-gray-200 pt-6">
                    <h4 className="font-bold text-gray-900 mb-3">
                      Candidate Acknowledgement
                    </h4>
                    <p className="font-medium">
                      I have read the above mentioned terms and condition and I
                      agree to follow them as per company policy.
                    </p>
                  </section>
                </div>
              </div>
            </div>

            {/* Document Submission Status */}

            <div className="mt-10">
              <div
                className={`rounded-xl border p-5 ${
                  documentsSubmitted
                    ? "border-green-200 bg-green-50"
                    : "border-yellow-200 bg-yellow-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      documentsSubmitted ? "bg-green-100" : "bg-yellow-100"
                    }`}
                  >
                    {documentsSubmitted ? (
                      <svg
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-6 w-6 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v3m0 4h.01M10.29 3.86l-7.82 13.5A2 2 0 004.2 21h15.6a2 2 0 001.73-3.64l-7.82-13.5a2 2 0 00-3.42 0z"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3
                      className={`font-semibold ${
                        documentsSubmitted
                          ? "text-green-800"
                          : "text-yellow-800"
                      }`}
                    >
                      {documentsSubmitted
                        ? "Documents Submitted"
                        : "Documents Required"}
                    </h3>

                    {documentsSubmitted ? (
                      <p className="mt-1 text-sm text-green-700">
                        All required onboarding documents have been submitted.
                        You can proceed with accepting the offer.
                      </p>
                    ) : (
                      <>
                        <p className="mt-1 text-sm text-yellow-700">
                          You must upload all required onboarding documents
                          before accepting this offer.
                        </p>

                        <button
                          type="button"
                          onClick={handleUploadDocuments}
                          className="mt-4 rounded-lg bg-yellow-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-yellow-700"
                        >
                          Upload Required Documents
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Undertaking Section */}

            <div className="mt-10">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Candidate Undertaking
              </h3>

              <p className="text-sm text-gray-500 mb-5">
                Please read and confirm both statements before accepting the
                offer.
              </p>

              <div className="space-y-4">
                {/* Checkbox 1 */}

                <label
                  className={`flex items-start gap-4 p-5 border rounded-xl cursor-pointer transition ${
                    undertaking1
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={undertaking1}
                    onChange={(e) => setUndertaking1(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-green-700 cursor-pointer"
                  />

                  <span className="text-sm sm:text-base text-gray-700 leading-6">
                    I have read and understood the offer letter and agree to the
                    terms and conditions of the employment offer.
                  </span>
                </label>

                {/* Checkbox 2 */}

                <label
                  className={`flex items-start gap-4 p-5 border rounded-xl cursor-pointer transition ${
                    undertaking2
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={undertaking2}
                    onChange={(e) => setUndertaking2(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-green-700 cursor-pointer"
                  />

                  <span className="text-sm sm:text-base text-gray-700 leading-6">
                    I confirm that the information provided by me during the
                    recruitment process is true, complete, and accurate.
                  </span>
                </label>
              </div>
            </div>

            {/* API Error */}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Accept Button */}

            <div className="mt-8">
              <button
                type="button"
                onClick={handleAcceptOffer}
                disabled={!canAcceptOffer}
                className={`w-full py-4 rounded-xl font-bold text-lg transition duration-200 ${
                  canAcceptOffer
                    ? "bg-green-700 hover:bg-green-800 text-white shadow-md"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {submitting ? "Accepting Offer..." : "Accept the Offer"}
              </button>

              {!documentsSubmitted ? (
                <p className="text-center text-sm text-yellow-600 mt-3">
                  Please upload all required documents before accepting the
                  offer.
                </p>
              ) : !undertaking1 || !undertaking2 ? (
                <p className="text-center text-sm text-gray-400 mt-3">
                  Please accept both undertakings to continue.
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            If you have any questions regarding this offer, please contact the
            HR department.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferAcceptance;
