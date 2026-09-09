import React, { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle2, Loader2 } from "lucide-react";

const NavigationButtons = ({ stage, step, setStage, setStep, loading }) => {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-slate-100 z-[70] lg:relative lg:bg-transparent lg:border-none lg:p-0 lg:mt-12">
      {/* Acknowledgment row — only on review stage */}
      {stage === "review" && (
        <div className="px-4 pt-3 pb-1 lg:pb-3 lg:px-0">
          <label
            htmlFor="acknowledgment-check"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-300 select-none ${
              acknowledged
                ? "bg-emerald-50 border-emerald-400"
                : "bg-zinc-50 border-zinc-200 hover:border-zinc-400"
            }`}
          >
            {/* Custom Checkbox */}
            <input
              id="acknowledgment-check"
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                acknowledged
                  ? "bg-emerald-500 border-emerald-500"
                  : "bg-white border-zinc-300"
              }`}
            >
              {acknowledged && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <p
              className={`text-xs font-semibold leading-relaxed transition-colors ${
                acknowledged ? "text-emerald-700" : "text-zinc-500"
              }`}
            >
              I acknowledge that the information provided is true and valid.
            </p>
          </label>
        </div>
      )}

      {/* Buttons row */}
      <div className="p-4 flex items-center gap-3 lg:p-0 lg:justify-between">
        {step > 1 && stage !== "review" && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="flex-1 lg:flex-none px-5 lg:px-8 py-3 bg-white border-2 border-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
        )}

        {stage === "review" && (
          <button
            type="button"
            onClick={() => {
              setStage("form");
              setStep(3);
            }}
            className="flex-1 lg:flex-none px-5 lg:px-8 py-3 bg-white border-2 border-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Edit</span>
          </button>
        )}

        <div className="flex-1 hidden lg:block" />

        <button
          type="submit"
          disabled={loading || (stage === "review" && !acknowledged)}
          className="flex-[2] lg:flex-none px-6 lg:px-10 py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : stage === "review" ? (
            <>
              Submit <CheckCircle2 className="w-4 h-4" />
            </>
          ) : (
            <>
              Next <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NavigationButtons;
