import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { User, Users, Briefcase, FileText, Pencil } from "lucide-react";
import { formatDate } from "../../utils/formatters";

const ReviewForm = ({ setStage, setStep }) => {
  const { watch } = useFormContext();

  const selfieValue = watch("selfie");
  const [selfiePreview, setSelfiePreview] = useState(null);

  useEffect(() => {
    const file = Array.isArray(selfieValue) ? selfieValue[0] : selfieValue;

    if (!file) {
      setSelfiePreview(null);
      return;
    }

    // If it is a File/Blob selected during this registration flow, create a
    // temporary browser URL so the photo can be displayed on the Review step.
    if (file instanceof Blob) {
      const url = URL.createObjectURL(file);
      setSelfiePreview(url);
      return () => URL.revokeObjectURL(url);
    }

    // Also support a URL string if the form is ever pre-populated.
    if (typeof file === "string") {
      setSelfiePreview(file);
    }
  }, [selfieValue]);

  const renderField = (label, value) => (
    <div className="space-y-1.5">
      <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">
        {label}
      </p>
      <p className="text-sm font-bold text-zinc-900">{value || "—"}</p>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="space-y-2 text-center">
        <h2 className="text-xl lg:text-2xl font-black text-zinc-900 tracking-tight">
          Review Application
        </h2>
        <p className="text-zinc-450 text-xs lg:text-sm font-bold uppercase tracking-wider">
          Double check your information before final submission.
        </p>
      </div>

      <div className="space-y-6">
        {/* SECTION 1: PERSONAL & ADDRESSES */}
        <div className="p-6 lg:p-8 bg-zinc-50/60 rounded-xl border border-zinc-200 space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-black uppercase tracking-widest">
                Personal Profile
              </h3>
              <button
                type="button"
                onClick={() => {
                  setStage("form");
                  setStep(1);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-zinc-200 text-xs font-black text-zinc-700 uppercase tracking-widest hover:border-black hover:text-black transition-all shadow-sm active:scale-95"
              >
                <Pencil className="w-3 h-3 text-black" /> Edit
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {[
                ["First Name", watch("firstName")],
                ["Middle Name", watch("middleName")],
                ["Last Name", watch("lastName")],
                ["Gender", watch("gender")],
                ["DOB", formatDate(watch("dateOfBirth"))],
                ["Age", `${watch("age")} Yrs`],
                ["Mobile", watch("mobileNumber")],
                ["WhatsApp", watch("whatsAppNumber")],
                ["Email", watch("email")],
                ["City", watch("city")],
                ["Marital", watch("maritalStatus")],
                [
                  "Languages Known",
                  (watch("languagesKnown") || []).join(", ") +
                    (watch("languagesKnown")?.includes("Others")
                      ? ` (${watch("otherLanguage")})`
                      : ""),
                ],
              ].map(([l, v]) => (
                <div key={l} className="space-y-1.5">
                  <p className="text-sm font-black text-zinc-600 uppercase tracking-widest">
                    {l}
                  </p>
                  <p className="font-extrabold text-zinc-900 text-base break-words">
                    {v || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CANDIDATE PHOTO */}
          <div className="p-6 lg:p-8 bg-zinc-50/60 rounded-xl border border-zinc-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-black text-black uppercase tracking-[0.3em]">
                Candidate Photo
              </h3>
              <button
                type="button"
                onClick={() => {
                  setStage("form");
                  setStep(1);
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-zinc-200 text-xs font-black text-zinc-700 uppercase tracking-widest hover:border-black hover:text-black transition-all shadow-sm active:scale-95"
              >
                <Pencil className="w-3 h-3 text-black" /> Edit
              </button>
            </div>

            {selfiePreview ? (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={selfiePreview}
                  alt="Candidate"
                  className="w-36 h-36 lg:w-44 lg:h-44 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
                <div>
                  <p className="text-sm font-black text-zinc-900">
                    Photo selected successfully
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    This photo will be submitted with the candidate
                    registration.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-white rounded-xl border border-dashed border-zinc-300 text-center">
                <p className="text-sm font-bold text-zinc-500">
                  No candidate photo selected.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6 pt-10 border-t border-zinc-150">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-black text-black uppercase tracking-[0.3em]">
                Address & Residency
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-white rounded-xl border border-zinc-200 space-y-4">
                <p className="text-sm font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-black" /> Current
                  Address
                </p>
                <div className="space-y-2 text-sm font-bold text-zinc-800">
                  <p>
                    <span className="text-zinc-400 font-semibold uppercase tracking-wider text-xs block">
                      Line 1:
                    </span>{" "}
                    {watch("addressLine1")}
                  </p>
                  {watch("addressLine2") && (
                    <p>
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider text-xs block">
                        Line 2:
                      </span>{" "}
                      {watch("addressLine2")}
                    </p>
                  )}
                  {watch("addressLine3") && (
                    <p>
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider text-xs block">
                        Line 3:
                      </span>{" "}
                      {watch("addressLine3")}
                    </p>
                  )}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100">
                    <div>
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider text-xs block">
                        Pincode
                      </span>
                      <span>{watch("pincode")}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider text-xs block">
                        Type
                      </span>
                      <span>{watch("addressType")}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider text-xs block">
                        Staying Since
                      </span>
                      <span>{watch("stayingSince")} Yrs</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5 bg-white rounded-xl border border-zinc-200">
                <p className="text-sm font-black text-zinc-650 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />{" "}
                  Permanent Address
                </p>
                <p className="font-bold text-zinc-800 leading-relaxed text-sm lg:text-base">
                  {watch("permanentAddress")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: FAMILY */}
        <div className="p-6 bg-zinc-50/60 rounded-xl border border-zinc-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-black uppercase tracking-[0.3em]">
              Family Details
            </h3>
            <button
              type="button"
              onClick={() => {
                setStage("form");
                setStep(1);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-zinc-200 text-xs font-black text-zinc-700 uppercase tracking-widest hover:border-black hover:text-black transition-all shadow-sm active:scale-95"
            >
              <Pencil className="w-3 h-3 text-black" /> Edit
            </button>
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden lg:block overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50">
                  <th className="p-4 text-xs font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-150">
                    SN
                  </th>
                  <th className="p-4 text-xs font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-150">
                    Name
                  </th>
                  <th className="p-4 text-xs font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-150">
                    Relation
                  </th>
                  <th className="p-4 text-xs font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-150">
                    Age
                  </th>
                  <th className="p-4 text-xs font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-150">
                    Occupation
                  </th>
                  <th className="p-4 text-xs font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-150">
                    Designation
                  </th>
                </tr>
              </thead>
              <tbody>
                {(watch("familyDetails") || [])
                  .filter((f) => f.name)
                  .map((f, i) => (
                    <tr
                      key={i}
                      className="hover:bg-zinc-50/50 transition-colors border-b border-zinc-100 last:border-0"
                    >
                      <td className="p-4 font-black text-zinc-400 text-xs">
                        {i + 1}
                      </td>
                      <td className="p-4 font-extrabold text-zinc-900">
                        {f.name}
                      </td>
                      <td className="p-4 text-sm text-zinc-700 font-bold">
                        {f.relation}
                      </td>
                      <td className="p-4 text-sm text-zinc-700 font-bold">
                        {f.age} Years
                      </td>
                      <td className="p-4 text-sm text-zinc-700 font-bold">
                        {f.occupation}
                      </td>
                      <td className="p-4 text-sm text-zinc-700 font-bold">
                        {f.designation || "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS (CLEAN MINIMALIST) */}
          <div className="lg:hidden space-y-4">
            {(watch("familyDetails") || [])
              .filter((f) => f.name)
              .map((f, i) => (
                <div
                  key={i}
                  className="p-6 bg-white rounded-2xl border border-zinc-200 space-y-6"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-zinc-150">
                    <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                      Member {i + 1}
                    </span>
                    <span className="text-xs font-black text-black uppercase tracking-widest">
                      {f.relation}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                        Full Name
                      </p>
                      <p className="font-extrabold text-zinc-900 text-base">
                        {f.name}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                          Age
                        </p>
                        <p className="font-extrabold text-zinc-900 text-sm">
                          {f.age} Years
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                          Occupation
                        </p>
                        <p className="font-extrabold text-zinc-900 text-sm">
                          {f.occupation}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                          Designation
                        </p>
                        <p className="font-extrabold text-zinc-900 text-sm">
                          {f.designation || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        {/* SECTION 3: EDUCATION */}
        <div className="p-6 bg-zinc-50/60 rounded-xl border border-zinc-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-black uppercase tracking-[0.3em]">
              Education Background
            </h3>
            <button
              type="button"
              onClick={() => {
                setStage("form");
                setStep(2);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-zinc-200 text-xs font-black text-zinc-700 uppercase tracking-widest hover:border-black hover:text-black transition-all shadow-sm active:scale-95"
            >
              <Pencil className="w-3 h-3 text-black" /> Edit
            </button>
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden lg:block overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50">
                  <th className="p-4 text-xs font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-150">
                    Qualification
                  </th>
                  <th className="p-4 text-xs font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-150">
                    University/Board
                  </th>
                  <th className="p-4 text-xs font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-150">
                    Year
                  </th>
                  <th className="p-4 text-xs font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-150">
                    Score (%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {(watch("educationDetails") || []).map((e, i) => (
                  <tr
                    key={i}
                    className="hover:bg-zinc-50/50 transition-colors border-b border-zinc-100 last:border-0"
                  >
                    <td className="p-4 font-extrabold text-zinc-900">
                      {e.qualification}
                    </td>
                    <td className="p-4 text-sm text-zinc-700 font-bold">
                      {e.university}
                    </td>
                    <td className="p-4 text-sm text-zinc-700 font-bold">
                      {e.yearOfPassing}
                    </td>
                    <td className="p-4 text-sm font-black text-black">
                      {e.score || e.percentage
                        ? `${e.score || e.percentage}%`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS (CLEAN MINIMALIST) */}
          <div className="lg:hidden space-y-4">
            {(watch("educationDetails") || []).map((e, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-2xl border border-zinc-200 space-y-6"
              >
                <div className="flex justify-between items-center pb-4 border-b border-zinc-150">
                  <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                    {e.qualification}
                  </span>
                  <span className="text-xs font-black text-zinc-900 uppercase tracking-widest">
                    {e.yearOfPassing}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                      University / Board
                    </p>
                    <p className="font-extrabold text-zinc-900 text-base">
                      {e.university}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                      Final Score
                    </p>
                    <p className="font-black text-black text-xl">
                      {e.score || e.percentage
                        ? `${e.score || e.percentage}%`
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: EXPERIENCE */}
        <div className="p-6 bg-zinc-50/60 rounded-xl border border-zinc-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-black uppercase tracking-[0.3em]">
              Work Experience
            </h3>
            <button
              type="button"
              onClick={() => {
                setStage("form");
                setStep(2);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-zinc-200 text-xs font-black text-zinc-700 uppercase tracking-widest hover:border-black hover:text-black transition-all shadow-sm active:scale-95"
            >
              <Pencil className="w-3 h-3 text-black" /> Edit
            </button>
          </div>

          <div className="space-y-4">
            {(watch("experienceDetails") || []).filter((ex) => ex.company)
              .length > 0 ? (
              <>
                {/* DESKTOP TABLE */}
                <div className="hidden lg:block overflow-hidden rounded-xl border border-zinc-200 bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50">
                        <th className="p-4 text-xs font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-150">
                          Company
                        </th>
                        <th className="p-4 text-xs font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-150">
                          Designation
                        </th>
                        <th className="p-4 text-xs font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-150">
                          Notice
                        </th>
                        <th className="p-4 text-xs font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-150">
                          Salary (CTC)
                        </th>
                        <th className="p-4 text-xs font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-150">
                          Reason for Leaving
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(watch("experienceDetails") || [])
                        .filter((ex) => ex.company)
                        .map((ex, i) => (
                          <tr
                            key={i}
                            className="hover:bg-zinc-50/50 transition-colors border-b border-zinc-100 last:border-0"
                          >
                            <td className="p-4 font-extrabold text-zinc-900">
                              {ex.company}
                            </td>
                            <td className="p-4 text-sm text-zinc-700 font-bold">
                              {ex.designation}
                            </td>
                            <td className="p-4 text-sm text-zinc-700 font-bold">
                              {ex.noticePeriod} Days
                            </td>
                            <td className="p-4 text-sm font-black text-zinc-900">
                              {ex.salary}
                            </td>
                            <td className="p-4 text-sm text-zinc-700 font-bold">
                              {ex.reasonToLeave}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE CARDS (CLEAN MINIMALIST) */}
                <div className="lg:hidden space-y-4">
                  {(watch("experienceDetails") || [])
                    .filter((ex) => ex.company)
                    .map((ex, i) => (
                      <div
                        key={i}
                        className="p-6 bg-white rounded-2xl border border-zinc-200 space-y-6"
                      >
                        <div className="pb-4 border-b border-zinc-150">
                          <p className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-1">
                            {ex.designation}
                          </p>
                          <p className="font-extrabold text-zinc-900 text-base">
                            {ex.company}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                              Salary
                            </p>
                            <p className="font-extrabold text-zinc-900 text-sm">
                              {ex.salary}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                              Notice
                            </p>
                            <p className="font-extrabold text-zinc-900 text-sm">
                              {ex.noticePeriod} Days
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                            Reason for Leaving
                          </p>
                          <p className="font-extrabold text-zinc-900 text-sm">
                            {ex.reasonToLeave}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <p className="text-sm font-bold text-zinc-400 px-4 italic">
                Fresher / No experience added
              </p>
            )}
          </div>
        </div>

        {/* SECTION 4.1: REFERENCE & SOURCE DETAILS */}
        <div className="p-6 bg-zinc-50/60 rounded-xl border border-zinc-200 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-black uppercase tracking-[0.3em]">
              Reference & Source Details
            </h3>
            <button
              type="button"
              onClick={() => {
                setStage("form");
                setStep(2);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-zinc-200 text-xs font-black text-zinc-700 uppercase tracking-widest hover:border-black hover:text-black transition-all shadow-sm active:scale-95"
            >
              <Pencil className="w-3 h-3 text-black" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white rounded-xl border border-zinc-200 space-y-4 col-span-1 md:col-span-2">
              <p className="text-xs font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-black block" />{" "}
                References
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(watch("references") || []).map((ref, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2 text-xs font-bold text-zinc-800"
                  >
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      Reference #{idx + 1}
                    </p>
                    <p>
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[11px] block">
                        Name:
                      </span>{" "}
                      {ref.name || "—"}
                    </p>
                    <p>
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[11px] block">
                        Contact:
                      </span>{" "}
                      {ref.contact || "—"}
                    </p>
                    <p>
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[11px] block">
                        Relation:
                      </span>{" "}
                      {ref.relation || "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl border border-zinc-200 space-y-4">
              <p className="text-xs font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-black block" />{" "}
                Source Tracking
              </p>
              <div className="space-y-2 text-xs font-bold text-zinc-800">
                <p>
                  <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[11px] block">
                    Source:
                  </span>{" "}
                  {watch("source") || "—"}
                </p>
                <p>
                  <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[11px] block">
                    Remarks / Details:
                  </span>{" "}
                  {watch("sourceRemarks") || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: RESUME */}
        <div className="p-5 lg:p-8 bg-zinc-50/60 rounded-xl border border-zinc-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-black uppercase tracking-[0.3em]">
              Resume Status
            </h3>
            <button
              type="button"
              onClick={() => {
                setStage("form");
                setStep(3);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-zinc-200 text-[9px] font-black text-zinc-700 uppercase tracking-widest hover:border-black hover:text-black transition-all shadow-sm active:scale-95"
            >
              <Pencil className="w-3 h-3 text-black" /> Edit
            </button>
          </div>
          <div className="inline-flex items-center gap-4 p-4 bg-white rounded-xl border border-zinc-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="font-bold text-zinc-900 text-sm truncate max-w-[300px]">
                {watch("resume")?.[0]?.name || "No resume uploaded"}
              </p>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                {watch("resume")?.[0]
                  ? `${(watch("resume")[0].size / 1024 / 1024).toFixed(2)} MB • READY FOR SUBMISSION`
                  : "NOT UPLOADED"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
