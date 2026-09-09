import React from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import {
  Plus,
  Trash2,
  Calendar,
  Briefcase,
  GraduationCap,
  Users,
  FileText,
} from "lucide-react";
import FormLabel from "./FormLabel";
import { formatDate } from "../../utils/formatters";

const Step2Professional = () => {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "educationDetails",
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experienceDetails",
  });

  const {
    fields: referenceFields,
    append: appendReference,
    remove: removeReference,
  } = useFieldArray({
    control,
    name: "references",
  });

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-10">
      <div className="space-y-2 text-center">
        <h2 className="text-xl lg:text-2xl font-black text-zinc-900 tracking-tight">
          Professional Details
        </h2>
        <p className="text-zinc-450 text-xs lg:text-sm font-bold uppercase tracking-wider max-w-md mx-auto">
          Your educational background and work history.
        </p>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
          <h3 className="text-lg lg:text-xl font-black text-zinc-900 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-black" />
            </div>
            Education Background
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {educationFields.map((f, i) => (
            <div
              key={f.id}
              className="group relative p-6 lg:p-8 bg-zinc-50/60 rounded-xl border border-zinc-200 grid grid-cols-1 lg:grid-cols-5 gap-6 hover:bg-white hover:border-black transition-all duration-500"
            >
              <div className="lg:col-span-1">
                <FormLabel required>Qualification</FormLabel>
                <select
                  {...register(`educationDetails.${i}.qualification`, {
                    required: "Required",
                  })}
                  className={`w-full px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-900 outline-none transition-all ${errors.educationDetails?.[i]?.qualification ? "border-red-500 bg-red-50/10" : "border-zinc-200 focus:border-black"}`}
                >
                  <option value="">Select</option>
                  <option value="SSC">SSC</option>
                  <option value="HSC">HSC</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post Graduate">PostGraduate</option>
                  <option value="Below SSC">Below SSC</option>
                </select>
                {errors.educationDetails?.[i]?.qualification && (
                  <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                    {errors.educationDetails[i].qualification.message}
                  </p>
                )}
              </div>
              <div className="lg:col-span-2">
                <FormLabel required>University / Board</FormLabel>
                <input
                  {...register(`educationDetails.${i}.university`, {
                    required: "Required",
                  })}
                  placeholder="e.g. Mumbai University"
                  className={`w-full px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-900 outline-none transition-all ${errors.educationDetails?.[i]?.university ? "border-red-500 bg-red-50/10" : "border-zinc-200 focus:border-black"}`}
                />
                {errors.educationDetails?.[i]?.university && (
                  <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                    {errors.educationDetails[i].university.message}
                  </p>
                )}
              </div>
              <div className="lg:col-span-1">
                <FormLabel required>Passing Year</FormLabel>
                <input
                  type="text"
                  {...register(`educationDetails.${i}.yearOfPassing`, {
                    required: "Required",
                    min: { value: 1930, message: "Min 1930" },
                    max: {
                      value: new Date().getFullYear(),
                      message: `Max ${new Date().getFullYear()}`,
                    },
                  })}
                  placeholder="YYYY"
                  className={`w-full px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-900 outline-none transition-all ${errors.educationDetails?.[i]?.yearOfPassing ? "border-red-500 bg-red-50/10" : "border-zinc-200 focus:border-black"}`}
                />
                {errors.educationDetails?.[i]?.yearOfPassing && (
                  <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                    {errors.educationDetails[i].yearOfPassing.message}
                  </p>
                )}
              </div>
              <div className="lg:col-span-1">
                <FormLabel required>% / Score</FormLabel>
                <input
                  type="text"
                  step="0.01"
                  {...register(`educationDetails.${i}.score`, {
                    required: "Required",
                    min: { value: 0, message: "Min 0" },
                    max: { value: 100, message: "Max 100" },
                  })}
                  placeholder="e.g. 85"
                  className={`w-full px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-900 outline-none transition-all ${errors.educationDetails?.[i]?.score ? "border-red-500 bg-red-50/10" : "border-zinc-200 focus:border-black"}`}
                />
                {errors.educationDetails?.[i]?.score && (
                  <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                    {errors.educationDetails[i].score.message}
                  </p>
                )}
              </div>
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeEducation(i)}
                  className="absolute -top-2.5 -right-2.5 w-8 h-8 bg-white shadow-xl border border-zinc-200 rounded-full flex items-center justify-center text-red-500 hover:bg-red-55 transition-all active:scale-90 animate-in zoom-in-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => appendEducation({})}
          className="mt-4 px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 w-full sm:w-auto sm:inline-flex"
        >
          + Add Qualification
        </button>
      </div>

      <div className="space-y-8 pt-10 border-t border-zinc-150">
        <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
          <h3 className="text-lg lg:text-xl font-black text-zinc-900 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-black" />
            </div>
            Work Experience
          </h3>
        </div>

        <div className="space-y-8">
          {experienceFields.map((f, i) => (
            <div
              key={f.id}
              className="relative p-6 lg:p-8 bg-zinc-50/60 rounded-xl border border-zinc-200 space-y-6 hover:bg-white hover:border-black transition-all duration-500"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <FormLabel>Company</FormLabel>
                  <input
                    {...register(`experienceDetails.${i}.company`)}
                    placeholder="Current or Previous"
                    className={`w-full px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-900 outline-none transition-all focus:border-black`}
                  />
                </div>
                <div>
                  <FormLabel>Designation</FormLabel>
                  <input
                    {...register(`experienceDetails.${i}.designation`)}
                    placeholder="Job Title"
                    className={`w-full px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-900 outline-none transition-all focus:border-black`}
                  />
                </div>
                <div>
                  <FormLabel>Salary (CTC)</FormLabel>
                  <input
                    type="text"
                    {...register(`experienceDetails.${i}.salary`)}
                    placeholder="e.g. 500000"
                    className={`w-full px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-900 outline-none transition-all focus:border-black`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <FormLabel>Reason for Leaving</FormLabel>
                  <input
                    {...register(`experienceDetails.${i}.reasonToLeave`)}
                    placeholder="Why did you leave?"
                    className={`w-full px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-900 outline-none transition-all focus:border-black`}
                  />
                </div>
                <div>
                  <FormLabel>Notice Period</FormLabel>
                  <input
                    type="text"
                    {...register(`experienceDetails.${i}.noticePeriod`)}
                    placeholder="Days"
                    className={`w-full px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-900 outline-none transition-all focus:border-black`}
                  />
                </div>
              </div>
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeExperience(i)}
                  className="absolute top-6 right-6 text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => appendExperience({})}
          className="mt-4 px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 w-full sm:w-auto sm:inline-flex"
        >
          + Add Experience
        </button>
      </div>
      {/* Reference Details */}
      <div className="space-y-8 pt-10 border-t border-zinc-150">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-150 pb-4 gap-4">
          <div>
            <h3 className="text-lg lg:text-xl font-black text-zinc-900 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-black" />
              </div>
              Reference Details
            </h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-12">
              Please share one or more professional or personal references.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {referenceFields.map((field, i) => (
            <div
              key={field.id}
              className="relative p-6 bg-zinc-50/50 rounded-xl border border-zinc-200/60 space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-700">
                  {i + 1}
                </span>
                <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                  Reference #{i + 1}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                <div>
                  <FormLabel required>Reference Name</FormLabel>
                  <input
                    type="text"
                    {...register(`references.${i}.name`, {
                      required: "Required",
                    })}
                    placeholder="Enter Reference Name"
                    className={`w-full px-4 py-2 bg-white border rounded-lg text-sm font-semibold text-zinc-900 focus:outline-none focus:border-black transition-all duration-300 ${
                      errors.references?.[i]?.name
                        ? "border-red-500 bg-red-50/10"
                        : "border-zinc-200"
                    }`}
                  />
                  {errors.references?.[i]?.name && (
                    <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                      {errors.references[i].name.message}
                    </p>
                  )}
                </div>

                <div>
                  <FormLabel required>Contact Number</FormLabel>
                  <input
                    type="tel"
                    maxLength="10"
                    {...register(`references.${i}.contact`, {
                      required: "Required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Invalid (10 digits)",
                      },
                    })}
                    placeholder="10-digit mobile number"
                    className={`w-full px-4 py-2 bg-white border rounded-lg text-sm font-semibold text-zinc-900 focus:outline-none focus:border-black transition-all duration-300 ${
                      errors.references?.[i]?.contact
                        ? "border-red-500 bg-red-50/10"
                        : "border-zinc-200"
                    }`}
                  />
                  {errors.references?.[i]?.contact && (
                    <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                      {errors.references[i].contact.message}
                    </p>
                  )}
                </div>

                <div>
                  <FormLabel required>Relation</FormLabel>
                  <input
                    type="text"
                    {...register(`references.${i}.relation`, {
                      required: "Required",
                    })}
                    placeholder="Relation (e.g. Colleague, Friend)"
                    className={`w-full px-4 py-2 bg-white border rounded-lg text-sm font-semibold text-zinc-900 focus:outline-none focus:border-black transition-all duration-300 ${
                      errors.references?.[i]?.relation
                        ? "border-red-500 bg-red-50/10"
                        : "border-zinc-200"
                    }`}
                  />
                  {errors.references?.[i]?.relation && (
                    <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                      {errors.references[i].relation.message}
                    </p>
                  )}
                </div>
              </div>

              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeReference(i)}
                  className="absolute top-6 right-6 text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            appendReference({ name: "", contact: "", relation: "" })
          }
          className="mt-4 px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 w-full sm:w-auto sm:inline-flex"
        >
          + Add Reference
        </button>
      </div>

      {/* Source Information */}
      <div className="space-y-8 pt-10 border-t border-zinc-150">
        <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
          <h3 className="text-lg lg:text-xl font-black text-zinc-900 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center">
              <FileText className="w-4 h-4 text-black" />
            </div>
            Source Information
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <FormLabel required>Source</FormLabel>
            <select
              {...register("source", { required: "Required" })}
              className={`w-full px-4 py-2 bg-zinc-50/50 border rounded-lg text-sm font-semibold text-zinc-900 outline-none focus:bg-white focus:outline-none transition-all duration-300 ${errors.source ? "border-red-500 bg-red-50/10" : "border-zinc-200 focus:border-black"}`}
            >
              <option value="">Select Source</option>
              <option value="Consultant">Consultant</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Company HR">Company HR</option>
              <option value="Referral">Referral</option>
            </select>
            {errors.source && (
              <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                {errors.source.message}
              </p>
            )}
          </div>
          <div>
            <FormLabel>Remarks / Details</FormLabel>
            <input
              type="text"
              {...register("sourceRemarks")}
              placeholder="Additional remarks or details"
              className="w-full px-4 py-2 bg-zinc-50/50 border border-zinc-200 focus:border-black rounded-lg text-sm font-semibold text-zinc-900 focus:bg-white focus:outline-none transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2Professional;
