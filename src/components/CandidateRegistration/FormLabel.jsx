import React from "react";

const FormLabel = ({ children, required }) => (
  <label className="block text-xs font-black text-zinc-600 uppercase tracking-widest mb-1.5 ml-1">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

export default FormLabel;
