import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Axios from "@/utils/axiosConfig";

const documentList = [
  {
    key: "aadharCard",
    number: 1,
    title: "Aadhar Card",
    description: "Upload your Aadhar Card.",
    required: true,
  },
  {
    key: "panCard",
    number: 2,
    title: "PAN Card",
    description: "Upload your PAN Card.",
    required: true,
  },
  {
    key: "lightBill",
    number: 3,
    title: "Light Bill",
    description: "Upload a recent electricity/light bill.",
    required: true,
  },
  {
    key: "marksheet",
    number: 4,
    title: "Marksheet",
    description: "Upload your marksheets.",
    required: true,
  },
  {
    key: "certifications",
    number: 5,
    title: "Certifications",
    description: "Upload your certifications.",
    required: true,
  },
  {
    key: "experienceLetter",
    number: 6,
    title: "Experience Letter",
    description: "Upload your experience letter if available.",
    required: false,
  },
];

const UploadDocuments = () => {
  // ============================================================
  // TOKEN FROM URL
  // ============================================================

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  // ============================================================
  // STATES
  // ============================================================

  const [verifiedId, setVerifiedId] = useState("");

  // Selected files
  //
  // Single:
  // aadharCard
  // panCard
  // lightBill
  // experienceLetter
  //
  // Multiple:
  // marksheet
  // certifications

  const [files, setFiles] = useState({});

  // Backend document status
  const [documentsStatus, setDocumentsStatus] = useState("Pending");

  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  // Loading
  const [loading, setLoading] = useState(true);

  // Upload submitting
  const [submitting, setSubmitting] = useState(false);

  // Success
  const [submitted, setSubmitted] = useState(false);

  // ============================================================
  // VERIFY TOKEN
  // ============================================================

  const verifyToken = async () => {
    if (!token) {
      alert("Upload token is missing from the URL.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      console.log("Token from URL:", token);

      const response = await Axios.get(`/candidates/verify-token/${token}`);

      console.log("Token verification response:", response.data);

      const candidateData = response.data?.data;

      const candidateId = candidateData?.id;

      if (!candidateId) {
        throw new Error("Candidate ID was not returned by the server.");
      }

      setVerifiedId(candidateId);

      // Store backend document status
      setDocumentsStatus(candidateData?.documentsStatus || "Pending");

      // Store already uploaded documents
      setUploadedDocuments(candidateData?.uploadedDocuments || []);

      console.log("Verified candidate ID:", candidateId);

      console.log("Documents status:", candidateData?.documentsStatus);

      console.log("Uploaded documents:", candidateData?.uploadedDocuments);
    } catch (error) {
      console.error("Token verification error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Invalid or expired upload link.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // VERIFY TOKEN ON PAGE LOAD
  // ============================================================

  useEffect(() => {
    verifyToken();
  }, [token]);

  // ============================================================
  // FILE SELECTION
  // ============================================================

  const handleFileChange = (event, document) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

    // ========================================================
    // ALLOWED FILE TYPES
    // ========================================================

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    // ========================================================
    // MAX FILE SIZE - 5 MB
    // ========================================================

    const maxSize = 5 * 1024 * 1024;

    // ========================================================
    // VALIDATE EVERY FILE
    // ========================================================

    for (const file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name}: Only PDF, JPG, JPEG and PNG files are allowed.`);

        event.target.value = "";

        return;
      }

      if (file.size > maxSize) {
        alert(`${file.name} is larger than 5 MB.`);

        event.target.value = "";

        return;
      }
    }

    // ========================================================
    // STORE FILES
    // ========================================================

    setFiles((previousFiles) => {
      // Multiple files
      if (document.key === "marksheet" || document.key === "certifications") {
        return {
          ...previousFiles,
          [document.key]: [
            ...(previousFiles[document.key] || []),
            ...selectedFiles,
          ],
        };
      }

      // Single file
      return {
        ...previousFiles,
        [document.key]: selectedFiles[0],
      };
    });

    console.log(`${document.key} selected:`, selectedFiles);

    // Allows selecting same file again
    event.target.value = "";
  };

  // ============================================================
  // REMOVE FILE
  // ============================================================

  const removeFile = (documentKey, index = null) => {
    setFiles((previousFiles) => {
      const updatedFiles = {
        ...previousFiles,
      };

      // Multiple files
      if (documentKey === "marksheet" || documentKey === "certifications") {
        const updatedFilesList = [...(updatedFiles[documentKey] || [])];

        updatedFilesList.splice(index, 1);

        if (updatedFilesList.length === 0) {
          delete updatedFiles[documentKey];
        } else {
          updatedFiles[documentKey] = updatedFilesList;
        }

        return updatedFiles;
      }

      // Single file
      delete updatedFiles[documentKey];

      return updatedFiles;
    });
  };

  // ============================================================
  // VALIDATE ALL DOCUMENTS
  // ============================================================

  const validateDocuments = () => {
    const missingDocuments = [];

    documentList.forEach((document) => {
      // Optional document
      if (!document.required) {
        return;
      }

      const selectedFiles = files[document.key];

      // No file
      if (!selectedFiles) {
        missingDocuments.push(document.title);

        return;
      }

      // Multiple documents
      if (document.key === "marksheet" || document.key === "certifications") {
        if (!Array.isArray(selectedFiles) || selectedFiles.length === 0) {
          missingDocuments.push(document.title);
        }
      }
    });

    if (missingDocuments.length > 0) {
      alert(
        `Please upload all required documents:\n\n${missingDocuments.join(
          "\n",
        )}`,
      );

      return false;
    }

    return true;
  };

  // ============================================================
  // CREATE PAYLOAD
  // ============================================================

  const createPayload = () => {
    const formData = new FormData();

    documentList.forEach((document) => {
      const selectedFiles = files[document.key];

      if (!selectedFiles) {
        return;
      }

      // ====================================================
      // MULTIPLE DOCUMENTS
      // ====================================================

      if (document.key === "marksheet" || document.key === "certifications") {
        selectedFiles.forEach((file) => {
          formData.append("documentType", document.key);

          formData.append("documents", file);
        });

        return;
      }

      // ====================================================
      // SINGLE DOCUMENT
      // ====================================================

      formData.append("documentType", document.key);

      formData.append("documents", selectedFiles);
    });

    // ========================================================
    // TOKEN
    // ========================================================

    formData.append("token", token);

    return formData;
  };

  // ============================================================
  // SUBMIT DOCUMENTS
  // ============================================================

  const handleSubmitDocuments = async () => {
    // --------------------------------------------------------
    // TOKEN
    // --------------------------------------------------------

    if (!token) {
      alert("Upload token is missing.");
      return;
    }

    // --------------------------------------------------------
    // CANDIDATE
    // --------------------------------------------------------

    if (!verifiedId) {
      alert("Candidate verification failed.");
      return;
    }

    // --------------------------------------------------------
    // VALIDATE
    // --------------------------------------------------------

    const isValid = validateDocuments();

    if (!isValid) {
      return;
    }

    try {
      setSubmitting(true);

      // ====================================================
      // CREATE FORM DATA
      // ====================================================

      const formData = createPayload();

      // ====================================================
      // DEBUG PAYLOAD
      // ====================================================

      console.log("========== UPLOAD PAYLOAD ==========");

      for (const [key, value] of formData.entries()) {
        console.log(
          key,
          value instanceof File
            ? {
                name: value.name,
                type: value.type,
                size: value.size,
              }
            : value,
        );
      }

      console.log("====================================");

      // ====================================================
      // API REQUEST
      // ====================================================

      const response = await Axios.post(
        `/candidates/${verifiedId}/documents`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },

          timeout: 120000,
        },
      );

      console.log("Upload response:", response.data);

      // ====================================================
      // RESPONSE
      // ====================================================

      if (response.data?.success) {
        const status = response.data?.data?.documentsStatus || "Pending";

        const uploaded = response.data?.data?.uploadedDocuments || [];

        const missing = response.data?.data?.missingDocuments || [];

        setDocumentsStatus(status);

        setUploadedDocuments(uploaded);

        console.log("Updated documents status:", status);

        console.log("Missing documents:", missing);

        // Only show final success when
        // all required documents are submitted.
        if (status === "Submitted") {
          setSubmitted(true);
        } else {
          alert(
            "Documents uploaded successfully. Please upload the remaining required documents.",
          );
        }

        return;
      }

      throw new Error(response.data?.message || "Document upload failed.");
    } catch (error) {
      console.error("Document upload error:", error);

      console.error("Server response:", error.response?.data);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit documents.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-3">
        <div className="w-full max-w-sm rounded-2xl bg-white px-5 py-6 text-center shadow sm:px-8">
          <p className="text-gray-600">Verifying upload link...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // INVALID TOKEN
  // ============================================================

  if (!verifiedId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-3 py-5 sm:px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow sm:p-8">
          <h2 className="text-xl font-bold text-red-600">
            Invalid Upload Link
          </h2>

          <p className="mt-3 text-sm text-gray-500">
            This upload link is invalid or expired. Please contact HR.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // DOCUMENTS SUBMITTED SUCCESS
  // ============================================================

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-3 py-5 sm:px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-6 text-center shadow-lg sm:p-10">
          {/* Success Icon */}

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Heading */}

          <h1 className="mt-6 text-2xl font-bold text-slate-800">
            Documents Submitted Successfully!
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Your onboarding documents have been successfully submitted.
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Our HR team will review your documents and proceed with the next
            steps.
          </p>

          {/* Status */}

          <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 sm:mt-6">
            <p className="text-sm font-medium text-green-700">
              Document Status: Submitted
            </p>
          </div>

          {/* Candidate ID */}

          {verifiedId && (
            <p className="mt-4 text-xs text-slate-400">
              Candidate ID: {verifiedId}
            </p>
          )}

          {/* Footer */}

          <p className="mt-5 text-xs text-slate-400 sm:mt-6">
            You can now safely close this page.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN UPLOAD UI
  // ============================================================

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 px-3 py-4 sm:px-4 sm:py-8">
      <div className="mx-auto w-full max-w-5xl min-w-0">
        {/* ==================================================
                    HEADER
                ================================================== */}

        <div className="mb-5 sm:mb-6">
          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
            Upload Documents
          </h1>

          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
            Please upload all required onboarding documents.
          </p>
        </div>

        {/* ==================================================
                    STATUS
                ================================================== */}

        <div
          className={`mb-5 w-full rounded-xl border p-4 sm:mb-6 sm:p-5 ${
            documentsStatus === "Submitted"
              ? "border-green-200 bg-green-50"
              : "border-yellow-200 bg-yellow-50"
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <h3
                className={`font-semibold ${
                  documentsStatus === "Submitted"
                    ? "text-green-800"
                    : "text-yellow-800"
                }`}
              >
                Document Status
              </h3>

              <p
                className={`mt-1 text-xs leading-5 sm:text-sm ${
                  documentsStatus === "Submitted"
                    ? "text-green-700"
                    : "text-yellow-700"
                }`}
              >
                {documentsStatus === "Submitted"
                  ? "All required documents have been submitted."
                  : "Please upload all required documents before accepting the offer."}
              </p>
            </div>

            <span
              className={`shrink-0 self-start rounded-full px-3 py-1 text-xs font-semibold sm:self-auto sm:text-sm ${
                documentsStatus === "Submitted"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {documentsStatus}
            </span>
          </div>
        </div>

        {/* ==================================================
                    NOTICE
                ================================================== */}

        <div className="mb-5 w-full rounded-xl border border-yellow-200 bg-yellow-50 p-4 sm:mb-6 sm:p-5">
          <h3 className="font-semibold text-yellow-800">Important</h3>

          <p className="mt-2 text-xs leading-5 text-yellow-700 sm:text-sm">
            Selecting a document does not upload it immediately.
          </p>

          <p className="mt-1 text-xs font-medium leading-5 text-yellow-800 sm:text-sm">
            All documents will be uploaded only after clicking "Submit
            Documents".
          </p>
        </div>

        {/* ==================================================
                    DOCUMENT LIST
                ================================================== */}

        <div className="space-y-4">
          {documentList.map((document) => {
            const selectedFile = files[document.key];

            const isMultiple =
              document.key === "marksheet" || document.key === "certifications";

            return (
              <div
                key={document.key}
                className="w-full min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5"
              >
                <div className="flex min-w-0 items-start gap-2.5 sm:gap-4">
                  {/* Number */}

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white sm:h-10 sm:w-10 sm:text-sm">
                    {document.number}
                  </div>

                  {/* Content */}

                  <div className="min-w-0 flex-1">
                    <h2 className="break-words font-semibold text-slate-800">
                      {document.title}

                      {document.required ? (
                        <span className="ml-2 text-xl font-normal text-red-700">
                          *
                        </span>
                      ) : (
                        <span className="ml-2 text-xs font-normal text-slate-400">
                          Optional
                        </span>
                      )}
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                      {document.description}
                    </p>

                    {/* FILE INPUT */}

                    <div className="mt-3 sm:mt-4">
                      <input
                        id={document.key}
                        type="file"
                        multiple={isMultiple}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        disabled={submitting || submitted}
                        onChange={(event) => handleFileChange(event, document)}
                      />

                      <label
                        htmlFor={document.key}
                        className="flex min-h-28 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-3 py-5 transition hover:border-blue-400 hover:bg-blue-50 sm:px-5 sm:py-6"
                      >
                        <div className="text-center">
                          <p className="text-sm font-medium text-slate-700">
                            {isMultiple
                              ? "Click to select files"
                              : "Click to select file"}
                          </p>

                          <p className="mt-1 text-[11px] leading-4 text-slate-400 sm:text-xs">
                            {isMultiple
                              ? "You can select multiple files"
                              : "PDF, JPG, JPEG or PNG"}{" "}
                            — Max 5 MB per file
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* SELECTED FILES */}

                    {selectedFile && (
                      <div className="mt-3 space-y-2">
                        {isMultiple ? (
                          selectedFile.map((file, index) => (
                            <div
                              key={`${file.name}-${index}`}
                              className="flex w-full min-w-0 flex-col gap-2 rounded-lg bg-slate-100 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4"
                            >
                              <div className="min-w-0">
                                <p className="break-words text-sm font-medium text-slate-700">
                                  📄 {file.name}
                                </p>

                                <p className="text-xs text-slate-400">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>

                              {!submitting && !submitted && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeFile(document.key, index)
                                  }
                                  className="w-full text-left text-sm font-medium text-red-500 hover:text-red-700 sm:ml-4 sm:w-auto sm:self-auto sm:text-right"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="flex w-full min-w-0 flex-col gap-2 rounded-lg bg-slate-100 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                            <div className="min-w-0">
                              <p className="break-words text-sm font-medium text-slate-700">
                                📄 {selectedFile.name}
                              </p>

                              <p className="text-xs text-slate-400">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>

                            {!submitting && !submitted && (
                              <button
                                type="button"
                                onClick={() => removeFile(document.key)}
                                className="w-full text-left text-sm font-medium text-red-500 hover:text-red-700 sm:ml-4 sm:w-auto sm:self-auto sm:text-right"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ==================================================
                    SUBMIT
                ================================================== */}

        <div className="mt-5 flex w-full min-w-0 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="font-semibold text-slate-800">Ready to submit?</p>

            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
              Make sure all required documents are selected.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmitDocuments}
            disabled={submitting || submitted}
            className="w-full min-h-12 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 active:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-auto sm:px-7"
          >
            {submitting
              ? "Submitting..."
              : submitted
                ? "Submitted"
                : "Submit Documents"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocuments;
