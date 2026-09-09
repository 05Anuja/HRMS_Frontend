import React from "react";
import { useFormContext } from "react-hook-form";
import { FileText, Plus, CheckCircle2, Upload } from "lucide-react";

const Step3Resume = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <h2 className="text-xl lg:text-2xl font-black text-zinc-900 tracking-tight">
          Resume Upload
        </h2>
        <p className="text-zinc-450 text-xs lg:text-sm font-bold uppercase tracking-wider max-w-md mx-auto">
          Upload your latest professional CV in PDF format for the recruitment
          team.
        </p>
      </div>

      <div
        className={`relative group flex flex-col items-center justify-center p-8 border border-dashed rounded-xl transition-all duration-500 ${
          watch("resume")?.[0]
            ? "border-emerald-500 bg-emerald-50/10"
            : errors.resume
              ? "border-red-500 bg-red-50/10"
              : "border-zinc-200 bg-zinc-50 hover:border-black hover:bg-zinc-100/10"
        }`}
      >
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-sm transition-transform duration-500 group-hover:scale-110 ${watch("resume")?.[0] ? "bg-emerald-500 text-white" : "bg-white text-zinc-900 border border-zinc-200"}`}
        >
          <Upload className="w-5 h-5" />
        </div>

        <div className="text-center space-y-1 mb-5">
          <p className="text-sm font-bold text-zinc-800">
            Click to select or drag and drop
          </p>
          <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
            PDF, DOC, DOCX (Max 5MB)
          </p>
        </div>

        <input
          type="file"
          id="resume-drop"
          {...register("resume")}
          className="hidden"
        />
        <label
          htmlFor="resume-drop"
          className="px-8 py-3 bg-white border border-zinc-200 rounded-lg font-black text-xs uppercase tracking-widest text-zinc-700 cursor-pointer hover:bg-zinc-50 hover:border-zinc-300 transition-all active:scale-95 duration-200"
        >
          Browse Files
        </label>

        {watch("resume")?.[0] && (
          <div className="mt-8 w-full max-w-md animate-in zoom-in-95 duration-500">
            <div className="p-4 bg-white rounded-xl border border-emerald-250 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-zinc-800 text-xs truncate max-w-[180px]">
                    {watch("resume")[0].name}
                  </p>
                  <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">
                    {(watch("resume")[0].size / 1024 / 1024).toFixed(2)} MB •
                    READY
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setValue("resume", null)}
                className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
          </div>
        )}
        {errors.resume && (
          <p className="mt-6 text-red-500 font-bold text-xs uppercase tracking-widest animate-bounce">
            {errors.resume.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Step3Resume;
