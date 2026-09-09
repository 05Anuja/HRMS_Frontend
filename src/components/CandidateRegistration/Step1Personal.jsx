// import React, { useEffect, useRef, useState } from "react";
// import { useFormContext, useFieldArray } from "react-hook-form";
// import {
//   FileText,
//   Plus,
//   Trash2,
//   Calendar,
//   Camera,
//   Upload,
//   X,
// } from "lucide-react";
// import FormLabel from "./FormLabel";
// import { formatDate } from "../../utils/formatters";
// import Axios from "../../utils/axiosConfig";
// import { toast } from "react-toastify";

// const Step1Personal = ({ isMobile }) => {
//   const {
//     register,
//     watch,
//     setValue,
//     control,
//     formState: { errors },
//   } = useFormContext();

//   const watchAddressType = watch("permanentAddressType");

//   const {
//     fields: familyFields,
//     append: appendFamily,
//     remove: removeFamily,
//   } = useFieldArray({
//     control,
//     name: "familyDetails",
//   });

//   const watchPincode = watch("pincode");

//   // ============================================================
//   // SELFIE / CAMERA STATES
//   // ============================================================

//   const [selfiePreview, setSelfiePreview] = useState(null);
//   const [showCamera, setShowCamera] = useState(false);
//   const [cameraStream, setCameraStream] = useState(null);

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const photoInputRef = useRef(null);
//   const selfieInputRef = useRef(null);

//   // Register selfie field with React Hook Form
//   register("selfie", {
//     validate: (value) => {
//       if (!value || !value[0]) {
//         toast.error("Selfie is required");
//         return "Selfie is required";
//       }

//       return true;
//     },
//   });

//   // ============================================================
//   // PINCODE -> CITY
//   // ============================================================

//   useEffect(() => {
//     if (watchPincode && watchPincode.length === 6) {
//       const fetchCity = async () => {
//         try {
//           const res = await Axios.get(`/pincodes/${watchPincode}`);
//           const data = res.data;

//           if (data.success && data.data) {
//             setValue("city", data.data.city, {
//               shouldValidate: true,
//             });
//           }
//         } catch (error) {
//           console.error("Error fetching city by pincode:", error);
//         }
//       };

//       fetchCity();
//     }
//   }, [watchPincode, setValue]);

//   // ============================================================
//   // CAMERA VIDEO STREAM
//   // ============================================================

//   useEffect(() => {
//     if (showCamera && cameraStream && videoRef.current) {
//       videoRef.current.srcObject = cameraStream;

//       videoRef.current.play().catch((error) => {
//         console.error("Video play error:", error);
//       });
//     }
//   }, [showCamera, cameraStream]);

//   // ============================================================
//   // CLEANUP CAMERA WHEN COMPONENT UNMOUNTS
//   // ============================================================

//   useEffect(() => {
//     return () => {
//       if (cameraStream) {
//         cameraStream.getTracks().forEach((track) => {
//           track.stop();
//         });
//       }

//       if (selfiePreview) {
//         URL.revokeObjectURL(selfiePreview);
//       }
//     };
//   }, [cameraStream, selfiePreview]);

//   // ============================================================
//   // OPEN DEVICE CAMERA
//   // ============================================================

//   // const openCamera = async () => {
//   //   try {
//   //     // if (!navigator.mediaDevices?.getUserMedia) {
//   //     //   alert("Camera access is not supported by this browser.");
//   //     //   return;
//   //     // }

//   //     if (!navigator.mediaDevices?.getUserMedia) {
//   //       photoInputRef.current?.click();
//   //       return;
//   //     }
//   //     const stream = await navigator.mediaDevices.getUserMedia({
//   //       video: {
//   //         facingMode: "user",
//   //       },
//   //       audio: false,
//   //     });

//   //     setCameraStream(stream);
//   //     setShowCamera(true);
//   //   } catch (error) {
//   //     console.error("Camera error:", error);

//   //     if (error.name === "NotAllowedError") {
//   //       alert(
//   //         "Camera permission was denied. Please allow camera access and try again.",
//   //       );
//   //     } else if (error.name === "NotFoundError") {
//   //       alert("No camera was found on this device.");
//   //     } else if (error.name === "NotReadableError") {
//   //       alert("Camera is already being used by another application.");
//   //     } else {
//   //       alert("Unable to access camera.");
//   //     }
//   //   }
//   // };

//   const openCamera = async () => {
//     try {
//       if (!navigator.mediaDevices?.getUserMedia) {
//         selfieInputRef.current?.click();
//         return;
//       }

//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: "user",
//         },
//         audio: false,
//       });

//       setCameraStream(stream);
//       setShowCamera(true);
//     } catch (error) {
//       console.error("Camera error:", error);

//       if (error.name === "NotAllowedError") {
//         alert(
//           "Camera permission was denied. Please allow camera access and try again.",
//         );
//       } else if (error.name === "NotFoundError") {
//         alert("No camera was found on this device.");
//       } else if (error.name === "NotReadableError") {
//         alert("Camera is already being used by another application.");
//       } else {
//         // Fallback to mobile camera
//         selfieInputRef.current?.click();
//       }
//     }
//   };

//   // ============================================================
//   // CLOSE CAMERA
//   // ============================================================

//   const closeCamera = () => {
//     if (cameraStream) {
//       cameraStream.getTracks().forEach((track) => {
//         track.stop();
//       });
//     }

//     setCameraStream(null);
//     setShowCamera(false);
//   };

//   // ============================================================
//   // CAPTURE IMAGE FROM CAMERA
//   // ============================================================

//   const captureSelfie = () => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;

//     if (!video || !canvas) {
//       return;
//     }

//     if (!video.videoWidth || !video.videoHeight) {
//       alert("Camera is not ready yet. Please try again.");
//       return;
//     }

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     const context = canvas.getContext("2d");

//     if (!context) {
//       alert("Unable to capture image.");
//       return;
//     }

//     context.drawImage(video, 0, 0, canvas.width, canvas.height);

//     canvas.toBlob(
//       (blob) => {
//         if (!blob) {
//           alert("Unable to capture selfie.");
//           return;
//         }

//         const file = new File([blob], `selfie-${Date.now()}.jpg`, {
//           type: "image/jpeg",
//         });

//         // Revoke previous preview URL
//         if (selfiePreview) {
//           URL.revokeObjectURL(selfiePreview);
//         }

//         const previewUrl = URL.createObjectURL(file);

//         // Store as array so it works consistently with
//         // FormData submission using selfie[0]
//         setValue("selfie", [file], {
//           shouldValidate: true,
//           shouldDirty: true,
//           shouldTouch: true,
//         });

//         setSelfiePreview(previewUrl);

//         closeCamera();
//       },
//       "image/jpeg",
//       0.9,
//     );
//   };

//   // ============================================================
//   // UPLOAD PHOTO FROM DEVICE
//   // ============================================================

//   const handlePhotoUpload = (event) => {
//     const file = event.target.files?.[0];

//     if (!file) {
//       return;
//     }

//     const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

//     if (!allowedTypes.includes(file.type)) {
//       alert("Only JPG, PNG and WEBP images are allowed.");

//       event.target.value = "";
//       return;
//     }

//     // const maxSize = 5 * 1024 * 1024;

//     // if (file.size > maxSize) {
//     //   alert("Photo size must be less than 5MB.");

//     //   event.target.value = "";
//     //   return;
//     // }

//     // Revoke previous preview URL
//     if (selfiePreview) {
//       URL.revokeObjectURL(selfiePreview);
//     }

//     const previewUrl = URL.createObjectURL(file);

//     // Store uploaded file in React Hook Form
//     setValue("selfie", [file], {
//       shouldValidate: true,
//       shouldDirty: true,
//       shouldTouch: true,
//     });

//     setSelfiePreview(previewUrl);

//     // Allow selecting the same file again
//     event.target.value = "";
//   };

//   // ============================================================
//   // REMOVE SELFIE
//   // ============================================================

//   const removeSelfie = () => {
//     if (selfiePreview) {
//       URL.revokeObjectURL(selfiePreview);
//     }

//     setSelfiePreview(null);

//     setValue("selfie", [], {
//       shouldValidate: true,
//       shouldDirty: true,
//       shouldTouch: true,
//     });
//   };

//   const todayStr = new Date().toISOString().split("T")[0];

//   return (
//     <>
//       <div className="space-y-10">
//         {/* ======================================================
//             PERSONAL INFORMATION HEADER
//         ======================================================= */}

//         <div className="space-y-2">
//           <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">
//             Personal Information
//           </h2>

//           <p className="text-zinc-400 text-xs lg:text-sm font-bold uppercase tracking-wider">
//             Please provide your basic contact and personal details.
//           </p>
//         </div>

//         {/* ======================================================
//             NAME + GENDER
//         ======================================================= */}

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
//           {/* REGISTRATION DATE */}

//           <div>
//             <FormLabel>Reg. Date</FormLabel>

//             <div className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-455 shadow-inner">
//               {formatDate(watch("registrationDate"))}
//             </div>

//             <input type="hidden" {...register("registrationDate")} />
//           </div>

//           {/* FIRST NAME */}

//           <div>
//             <FormLabel required>First Name</FormLabel>

//             <input
//               type="text"
//               {...register("firstName", {
//                 required: "Required",
//               })}
//               placeholder="Enter First Name"
//               className={`w-full px-4 py-2 bg-zinc-50/50 border rounded-lg text-sm font-semibold text-zinc-900 placeholder:text-zinc-300 focus:bg-white focus:outline-none transition-all duration-300 ${
//                 errors.firstName
//                   ? "border-red-500 bg-red-50/10"
//                   : "border-zinc-200 focus:border-black"
//               }`}
//             />

//             {errors.firstName && (
//               <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
//                 {errors.firstName.message}
//               </p>
//             )}
//           </div>

//           {/* MIDDLE NAME */}

//           <div>
//             <FormLabel>Middle Name</FormLabel>

//             <input
//               type="text"
//               {...register("middleName")}
//               placeholder="Enter Middle Name"
//               className="w-full px-4 py-2 bg-zinc-50/50 border border-zinc-200 focus:border-black rounded-lg text-sm font-semibold text-zinc-900 placeholder:text-zinc-300 focus:bg-white focus:outline-none transition-all duration-300"
//             />
//           </div>

//           {/* LAST NAME */}

//           <div>
//             <FormLabel required>Last Name</FormLabel>

//             <input
//               type="text"
//               {...register("lastName", {
//                 required: "Required",
//               })}
//               placeholder="Enter Last Name"
//               className={`w-full px-4 py-2 bg-zinc-50/50 border rounded-lg text-sm font-semibold text-zinc-900 placeholder:text-zinc-300 focus:bg-white focus:outline-none transition-all duration-300 ${
//                 errors.lastName
//                   ? "border-red-500 bg-red-50/10"
//                   : "border-zinc-200 focus:border-black"
//               }`}
//             />

//             {errors.lastName && (
//               <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
//                 {errors.lastName.message}
//               </p>
//             )}
//           </div>

//           {/* GENDER */}

//           <div>
//             <FormLabel required>Gender</FormLabel>

//             <select
//               {...register("gender", {
//                 required: "Required",
//               })}
//               className={`w-full px-4 py-2 bg-zinc-50/50 border rounded-lg text-sm font-semibold text-zinc-900 outline-none focus:bg-white focus:outline-none transition-all duration-300 ${
//                 errors.gender
//                   ? "border-red-500 bg-red-50/10"
//                   : "border-zinc-200 focus:border-black"
//               }`}
//             >
//               <option value="">Select</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//               <option value="Other">Other</option>
//             </select>

//             {errors.gender && (
//               <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
//                 {errors.gender.message}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* ======================================================
//             SELFIE SECTION
//         ======================================================= */}

//         <div className="pt-2">
//           <div
//             className={`relative rounded-2xl border p-6 lg:p-8 transition-all ${
//               errors.selfie
//                 ? "border-red-500 bg-red-50/10"
//                 : "border-zinc-200 bg-zinc-50/30"
//             }`}
//           >
//             {/* TITLE */}

//             <div className="text-center space-y-2 mb-6">
//               <div className="mx-auto w-12 h-12 rounded-full bg-zinc-900 text-white flex items-center justify-center">
//                 <Camera className="w-5 h-5" />
//               </div>

//               <h3 className="text-lg lg:text-xl font-black text-zinc-900">
//                 Candidate Photo
//               </h3>

//               <p className="text-zinc-400 text-xs lg:text-sm font-bold uppercase tracking-wider">
//                 Take a selfie or upload a photo from your device.
//               </p>
//             </div>

//             {/* PREVIEW */}

//             {selfiePreview ? (
//               <div className="flex flex-col items-center">
//                 <div className="relative">
//                   <img
//                     src={selfiePreview}
//                     alt="Candidate selfie preview"
//                     className="w-40 h-40 lg:w-48 lg:h-48 rounded-full object-cover border-4 border-white shadow-xl"
//                   />

//                   <button
//                     type="button"
//                     onClick={removeSelfie}
//                     className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-all"
//                     title="Remove photo"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>

//                 <div className="mt-5 text-center">
//                   <p className="text-sm font-bold text-emerald-600">
//                     Photo selected successfully
//                   </p>

//                   <p className="text-xs text-zinc-400 mt-1">
//                     You can remove it and take/upload another photo.
//                   </p>
//                 </div>

//                 <div className="mt-5 flex flex-col sm:flex-row gap-3">
//                   <button
//                     type="button"
//                     onClick={openCamera}
//                     className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
//                   >
//                     <Camera className="w-4 h-4" />
//                     Retake Selfie
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => photoInputRef.current?.click()}
//                     className="px-6 py-3 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all active:scale-95 flex items-center justify-center gap-2"
//                   >
//                     <Upload className="w-4 h-4" />
//                     Change Photo
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {/* EMPTY PHOTO AREA */}

//                 <div className="flex flex-col items-center justify-center">
//                   <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-2 border-dashed border-zinc-300 bg-white flex items-center justify-center mb-6">
//                     <Camera className="w-10 h-10 text-zinc-300" />
//                   </div>

//                   {/* BUTTONS */}

//                   <div className="flex flex-col sm:flex-row gap-3">
//                     {/* TAKE SELFIE */}

//                     <button
//                       type="button"
//                       onClick={openCamera}
//                       className="px-7 py-3 bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md"
//                     >
//                       <Camera className="w-4 h-4" />
//                       Take Selfie
//                     </button>

//                     {/* UPLOAD PHOTO */}

//                     {/* <button
//                       type="button"
//                       onClick={() => photoInputRef.current?.click()}
//                       className="px-7 py-3 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-50 hover:border-zinc-300 transition-all active:scale-95 flex items-center justify-center gap-2"
//                     >
//                       <Upload className="w-4 h-4" />
//                       Upload Photo
//                     </button> */}
//                   </div>

//                   {/* HIDDEN FILE INPUT */}

//                   {/* <input
//                     ref={photoInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handlePhotoUpload}
//                     capture="user"
//                     className="hidden"
//                   /> */}
//                   {/* HIDDEN INPUT FOR TAKE SELFIE */}
//                   <input
//                     ref={selfieInputRef}
//                     type="file"
//                     accept="image/*"
//                     capture="user"
//                     onChange={handlePhotoUpload}
//                     className="hidden"
//                   />

//                   {/* HIDDEN INPUT FOR UPLOAD PHOTO */}
//                   <input
//                     ref={photoInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handlePhotoUpload}
//                     className="hidden"
//                   />

//                   <p className="mt-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
//                     JPG, PNG, WEBP • Maximum 5MB
//                   </p>
//                 </div>
//               </>
//             )}

//             {/* ERROR */}

//             {errors.selfie && (
//               <p className="mt-4 text-center text-red-500 text-xs font-black uppercase tracking-widest">
//                 {errors.selfie.message}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* ======================================================
//             MOBILE / WHATSAPP / EMAIL
//         ======================================================= */}

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
//           {/* MOBILE */}

//           <div>
//             <FormLabel required>Mobile Number</FormLabel>

//             <input
//               type="tel"
//               maxLength="10"
//               {...register("mobileNumber", {
//                 required: "Required",
//                 pattern: {
//                   value: /^[0-9]{10}$/,
//                   message: "Invalid (10 digits)",
//                 },
//               })}
//               placeholder="10-digit number"
//               className={`w-full px-4 py-2 bg-zinc-50/50 border rounded-lg text-sm font-semibold text-zinc-900 focus:bg-white focus:outline-none transition-all duration-300 ${
//                 errors.mobileNumber
//                   ? "border-red-500 bg-red-50/10"
//                   : "border-zinc-200 focus:border-black"
//               }`}
//             />

//             {errors.mobileNumber && (
//               <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
//                 {errors.mobileNumber.message}
//               </p>
//             )}
//           </div>

//           {/* WHATSAPP */}

//           <div>
//             <div className="flex items-center justify-between mb-1.5 ml-1">
//               <FormLabel required>WhatsApp Number</FormLabel>

//               <label className="flex items-center gap-1.5 cursor-pointer group">
//                 <input
//                   type="checkbox"
//                   {...register("sameAsMobile")}
//                   className="w-3.5 h-3.5 rounded text-black focus:ring-black border-zinc-350"
//                 />

//                 <span className="text-xs font-black text-zinc-500 uppercase tracking-widest group-hover:text-black transition-colors">
//                   Same as Mobile
//                 </span>
//               </label>
//             </div>

//             <input
//               type="tel"
//               {...register("whatsAppNumber", {
//                 required: "Required",
//                 pattern: {
//                   value: /^[0-9]{10}$/,
//                   message: "Invalid (10 digits)",
//                 },
//               })}
//               placeholder="WhatsApp number"
//               disabled={watch("sameAsMobile")}
//               className={`w-full px-4 py-2 bg-zinc-50/50 border rounded-lg text-sm font-semibold text-zinc-900 focus:bg-white focus:outline-none transition-all duration-300 ${
//                 watch("sameAsMobile")
//                   ? "opacity-50 cursor-not-allowed bg-zinc-100"
//                   : ""
//               } ${
//                 errors.whatsAppNumber
//                   ? "border-red-500 bg-red-50/10"
//                   : "border-zinc-200 focus:border-black"
//               }`}
//             />

//             {errors.whatsAppNumber && (
//               <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
//                 {errors.whatsAppNumber.message}
//               </p>
//             )}
//           </div>

//           {/* EMAIL */}

//           <div>
//             <FormLabel required>Email Address</FormLabel>

//             <input
//               type="email"
//               {...register("email", {
//                 required: "Required",
//                 pattern: {
//                   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                   message: "Invalid email",
//                 },
//               })}
//               placeholder="email@example.com"
//               className={`w-full px-4 py-2 bg-zinc-50/50 border rounded-lg text-sm font-semibold text-zinc-900 focus:bg-white focus:outline-none transition-all duration-300 ${
//                 errors.email
//                   ? "border-red-500 bg-red-50/10"
//                   : "border-zinc-200 focus:border-black"
//               }`}
//             />

//             {errors.email && (
//               <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
//                 {errors.email.message}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* ======================================================
//             DOB / AGE / MARITAL STATUS
//         ======================================================= */}

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
//           {/* DOB */}

//           <div>
//             <FormLabel required>Date of Birth</FormLabel>

//             <div
//               className="relative group cursor-pointer"
//               onClick={(e) => {
//                 const input =
//                   e.currentTarget.querySelector('input[type="date"]');

//                 if (input && input.showPicker) {
//                   input.showPicker();
//                 }
//               }}
//             >
//               <input
//                 type="date"
//                 max={todayStr}
//                 {...register("dateOfBirth", {
//                   required: "Required",
//                   validate: (val) => {
//                     if (!val) return "Required";

//                     const selectedDate = new Date(val);
//                     const today = new Date();

//                     today.setHours(0, 0, 0, 0);
//                     selectedDate.setHours(0, 0, 0, 0);

//                     if (selectedDate > today) {
//                       return "Cannot be a future date";
//                     }

//                     let age = today.getFullYear() - selectedDate.getFullYear();

//                     const m = today.getMonth() - selectedDate.getMonth();

//                     if (
//                       m < 0 ||
//                       (m === 0 && today.getDate() < selectedDate.getDate())
//                     ) {
//                       age--;
//                     }

//                     if (age < 18) {
//                       return "Must be at least 18 years old";
//                     }

//                     return true;
//                   },
//                 })}
//                 className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-20"
//               />

//               <div
//                 className={`w-full px-4 py-2 bg-zinc-50 border rounded-lg text-sm font-semibold text-zinc-900 transition-all flex items-center justify-between ${
//                   errors.dateOfBirth
//                     ? "border-red-500 bg-red-50/10"
//                     : "border-zinc-200 group-hover:border-zinc-300"
//                 }`}
//               >
//                 <span
//                   className={
//                     watch("dateOfBirth") ? "text-zinc-900" : "text-zinc-300"
//                   }
//                 >
//                   {watch("dateOfBirth")
//                     ? formatDate(watch("dateOfBirth"))
//                     : "DD-MMM-YYYY"}
//                 </span>

//                 <Calendar
//                   className={`w-4 h-4 ${
//                     errors.dateOfBirth
//                       ? "text-red-400"
//                       : "text-zinc-400 group-hover:text-black"
//                   }`}
//                 />
//               </div>
//             </div>

//             {errors.dateOfBirth && (
//               <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
//                 {errors.dateOfBirth.message}
//               </p>
//             )}
//           </div>

//           {/* AGE */}

//           <div>
//             <FormLabel>Age</FormLabel>

//             <input
//               type="number"
//               readOnly
//               {...register("age")}
//               className={`w-full px-4 py-2 bg-zinc-50 border rounded-lg text-sm font-semibold outline-none transition-all ${
//                 errors.dateOfBirth?.message?.includes("18")
//                   ? "border-red-500 bg-red-50/10 text-red-500"
//                   : "border-zinc-200 text-zinc-400 shadow-inner"
//               }`}
//             />
//           </div>

//           {/* MARITAL STATUS */}

//           <div>
//             <FormLabel required>Marital Status</FormLabel>

//             <select
//               {...register("maritalStatus", {
//                 required: "Required",
//               })}
//               className={`w-full px-4 py-2 bg-zinc-50/50 border rounded-lg text-sm font-semibold text-zinc-900 outline-none focus:bg-white focus:outline-none transition-all duration-300 ${
//                 errors.maritalStatus
//                   ? "border-red-500 bg-red-50/10"
//                   : "border-zinc-200 focus:border-black"
//               }`}
//             >
//               <option value="">Select</option>
//               <option value="Single">Single</option>
//               <option value="Married">Married</option>
//             </select>

//             {errors.maritalStatus && (
//               <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
//                 {errors.maritalStatus.message}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* ======================================================
//             ADDRESS DETAILS
//         ======================================================= */}

//         <div className="space-y-6 pt-8 border-t border-zinc-150">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div className="space-y-1">
//               <h3 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-lg bg-zinc-900/5 flex items-center justify-center border border-zinc-200/50">
//                   <FileText className="w-4 h-4 text-zinc-800" />
//                 </div>
//                 Address Details
//               </h3>

//               <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
//                 Please provide your residential address and duration of stay.
//               </p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
//             {/* CURRENT ADDRESS */}

//             <div className="lg:col-span-8 bg-zinc-50/30 rounded-2xl border border-zinc-200/60 p-5 lg:p-6 space-y-6">
//               <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
//                 <div className="w-2 h-2 rounded-full bg-zinc-800" />

//                 <h4 className="text-sm font-black text-zinc-900 uppercase tracking-widest">
//                   Current Residential Address
//                 </h4>
//               </div>

//               <div className="space-y-4">
//                 {/* ADDRESS LINE 1 */}

//                 <div>
//                   <FormLabel required>Address Line 1</FormLabel>

//                   <input
//                     type="text"
//                     {...register("addressLine1", {
//                       required: "Required",
//                     })}
//                     placeholder="Flat / House No., Building Name, Street Name"
//                     className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-black ${
//                       errors.addressLine1
//                         ? "border-red-500 bg-red-50/10 focus:ring-red-500"
//                         : "border-zinc-200 focus:border-black"
//                     }`}
//                   />

//                   {errors.addressLine1 && (
//                     <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
//                       {errors.addressLine1.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* ADDRESS LINE 2 + 3 */}

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <FormLabel>Address Line 2</FormLabel>

//                     <input
//                       type="text"
//                       {...register("addressLine2")}
//                       placeholder="Street, Area, Locality"
//                       className="w-full px-4 py-2.5 bg-white border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none transition-all duration-300"
//                     />
//                   </div>

//                   <div>
//                     <FormLabel>Address Line 3</FormLabel>

//                     <input
//                       type="text"
//                       {...register("addressLine3")}
//                       placeholder="Landmark / Locality details"
//                       className="w-full px-4 py-2.5 bg-white border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none transition-all duration-300"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* PINCODE / CITY / ADDRESS TYPE / STAYING */}

//               <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5 items-end">
//                 {/* PINCODE */}

//                 <div className="md:col-span-3">
//                   <FormLabel required>Pincode</FormLabel>

//                   <input
//                     type="text"
//                     {...register("pincode", {
//                       required: "Required",
//                       pattern: {
//                         value: /^[0-9]{6}$/,
//                         message: "Invalid (6 digits)",
//                       },
//                     })}
//                     placeholder="6-digit Pincode"
//                     className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-black ${
//                       errors.pincode
//                         ? "border-red-500 bg-red-50/10 focus:ring-red-500"
//                         : "border-zinc-200 focus:border-black"
//                     }`}
//                   />

//                   {errors.pincode && (
//                     <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
//                       {errors.pincode.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* CITY */}

//                 <div className="md:col-span-3">
//                   <FormLabel required>City</FormLabel>

//                   <input
//                     type="text"
//                     {...register("city", {
//                       required: "Required",
//                     })}
//                     placeholder="Auto-fetched"
//                     className="w-full px-4 py-2.5 bg-zinc-100/60 border border-zinc-200/80 rounded-xl text-sm font-bold text-zinc-500 outline-none cursor-not-allowed shadow-inner"
//                     readOnly
//                   />

//                   {errors.city && (
//                     <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
//                       {errors.city.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* ADDRESS TYPE */}

//                 <div className="md:col-span-4">
//                   <FormLabel required>Address Type</FormLabel>

//                   <div className="flex gap-4 items-center h-10 px-4 bg-white border border-zinc-200 rounded-xl">
//                     {["Rental", "Owned", "PG"].map((type) => (
//                       <label
//                         key={type}
//                         className="flex items-center gap-1.5 cursor-pointer group"
//                       >
//                         <input
//                           type="radio"
//                           value={type}
//                           {...register("addressType", {
//                             required: "Required",
//                           })}
//                           className="w-4 h-4 text-black focus:ring-black border-zinc-300 focus:ring-1"
//                         />

//                         <span className="text-xs font-bold text-zinc-700 group-hover:text-black transition-colors">
//                           {type}
//                         </span>
//                       </label>
//                     ))}
//                   </div>

//                   {errors.addressType && (
//                     <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
//                       {errors.addressType.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* STAYING SINCE */}

//                 <div className="md:col-span-2">
//                   <FormLabel required>Staying Since</FormLabel>

//                   <div className="relative flex items-center">
//                     <input
//                       type="number"
//                       {...register("stayingSince", {
//                         required: "Required",
//                         min: {
//                           value: 0,
//                           message: "Min 0",
//                         },
//                       })}
//                       placeholder="Years"
//                       className={`w-full pr-8 pl-3 py-2.5 bg-white border rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-black ${
//                         errors.stayingSince
//                           ? "border-red-500 bg-red-50/10 focus:ring-red-500"
//                           : "border-zinc-200 focus:border-black"
//                       }`}
//                     />

//                     <span className="absolute right-3 text-xs font-bold text-zinc-400 pointer-events-none">
//                       Yrs
//                     </span>
//                   </div>

//                   {errors.stayingSince && (
//                     <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest text-center">
//                       {errors.stayingSince.message}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <input type="hidden" {...register("currentAddress")} />
//             </div>

//             {/* PERMANENT ADDRESS */}

//             <div className="lg:col-span-4 h-full">
//               <div className="bg-zinc-50/30 rounded-2xl border border-zinc-200/60 p-5 lg:p-6 space-y-6 flex flex-col justify-between h-full min-h-[320px]">
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between pb-3 border-b border-zinc-100 gap-2">
//                     <div className="flex items-center gap-2">
//                       <div className="w-2 h-2 rounded-full bg-zinc-800" />

//                       <h4 className="text-sm font-black text-zinc-900 uppercase tracking-widest">
//                         Permanent Address
//                       </h4>
//                     </div>

//                     <label className="flex items-center gap-1.5 cursor-pointer group shrink-0">
//                       <input
//                         type="checkbox"
//                         checked={watchAddressType === "same_as_current"}
//                         onChange={(e) =>
//                           setValue(
//                             "permanentAddressType",
//                             e.target.checked ? "same_as_current" : "other",
//                             {
//                               shouldValidate: true,
//                             },
//                           )
//                         }
//                         className="w-3.5 h-3.5 rounded text-black focus:ring-black border-zinc-300"
//                       />

//                       <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-black transition-colors">
//                         Same
//                       </span>
//                     </label>
//                   </div>

//                   <div className="space-y-2">
//                     <textarea
//                       rows={6}
//                       {...register("permanentAddress", {
//                         required: "Required",
//                       })}
//                       readOnly={watchAddressType === "same_as_current"}
//                       placeholder="Enter permanent address details..."
//                       className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none transition-all duration-300 resize-none focus:ring-1 focus:ring-black ${
//                         watchAddressType === "same_as_current"
//                           ? "opacity-60 bg-zinc-50 cursor-not-allowed border-zinc-200 text-zinc-500"
//                           : "border-zinc-200 focus:border-black"
//                       } ${
//                         errors.permanentAddress
//                           ? "border-red-500 bg-red-50/10 focus:ring-red-500"
//                           : ""
//                       }`}
//                     />

//                     {errors.permanentAddress && (
//                       <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
//                         {errors.permanentAddress.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="bg-zinc-100/50 border border-zinc-200/50 rounded-xl p-3 text-[11px] text-zinc-500 font-medium">
//                   {watchAddressType === "same_as_current" ? (
//                     <span className="flex items-center gap-1.5">
//                       <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
//                       Synchronized with Current Address.
//                     </span>
//                   ) : (
//                     <span>
//                       Please provide full permanent address details for
//                       verification.
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ======================================================
//             LANGUAGES KNOWN
//         ======================================================= */}

//         <div className="space-y-3 pt-6 border-t border-zinc-150">
//           <FormLabel required>Languages Known</FormLabel>

//           <p className="text-zinc-400 text-xs font-black uppercase tracking-wider mb-2">
//             Select all languages you can speak/write
//           </p>

//           <div className="flex flex-wrap gap-2.5">
//             {[
//               "English",
//               "Hindi",
//               "Marathi",
//               "Punjabi",
//               "Odia",
//               "Bengali",
//               "Tamil",
//               "Telugu",
//               "Kannada",
//               "Malayalam",
//               "Gujarati",
//               "Others",
//             ].map((lang) => {
//               const currentLanguages = watch("languagesKnown") || [];

//               const isSelected = currentLanguages.includes(lang);

//               return (
//                 <button
//                   key={lang}
//                   type="button"
//                   onClick={() => {
//                     if (isSelected) {
//                       setValue(
//                         "languagesKnown",
//                         currentLanguages.filter((l) => l !== lang),
//                         {
//                           shouldValidate: true,
//                         },
//                       );
//                     } else {
//                       setValue("languagesKnown", [...currentLanguages, lang], {
//                         shouldValidate: true,
//                       });
//                     }
//                   }}
//                   className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all active:scale-95 duration-200 ${
//                     isSelected
//                       ? "bg-zinc-900 border-zinc-900 text-white shadow-sm shadow-zinc-900/10"
//                       : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100 hover:border-zinc-350"
//                   }`}
//                 >
//                   {lang}
//                 </button>
//               );
//             })}
//           </div>

//           <input
//             type="hidden"
//             {...register("languagesKnown", {
//               validate: (val) =>
//                 (val && val.length > 0) || "Select at least one language",
//             })}
//           />

//           {errors.languagesKnown && (
//             <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
//               {errors.languagesKnown.message}
//             </p>
//           )}

//           {watch("languagesKnown")?.includes("Others") && (
//             <div className="mt-4 max-w-md animate-in slide-in-from-top-2 duration-300">
//               <FormLabel required>Specify Custom Language(s)</FormLabel>

//               <input
//                 type="text"
//                 {...register("otherLanguage", {
//                   required: watch("languagesKnown")?.includes("Others")
//                     ? "Required"
//                     : false,
//                 })}
//                 placeholder="Enter other language(s)"
//                 className={`w-full px-4 py-2 bg-zinc-50/50 border rounded-lg text-sm font-semibold text-zinc-900 focus:bg-white focus:outline-none transition-all duration-300 ${
//                   errors.otherLanguage
//                     ? "border-red-500 bg-red-50/10"
//                     : "border-zinc-200"
//                 }`}
//               />

//               {errors.otherLanguage && (
//                 <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
//                   {errors.otherLanguage.message}
//                 </p>
//               )}
//             </div>
//           )}
//         </div>

//         {/* ======================================================
//             FAMILY DETAILS
//         ======================================================= */}

//         <div className="pt-10 border-t border-zinc-150 space-y-6">
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//             <div className="space-y-1">
//               <h3 className="text-lg lg:text-xl font-black text-zinc-900 tracking-tight">
//                 Family Details
//               </h3>

//               <p className="text-zinc-450 font-bold uppercase text-xs tracking-widest">
//                 Add family members (Optional)
//               </p>
//             </div>
//           </div>

//           {/* DESKTOP FAMILY TABLE */}

//           {!isMobile ? (
//             <div className="hidden lg:block overflow-hidden rounded-xl border border-zinc-150 bg-zinc-50/30">
//               <table className="w-full border-collapse">
//                 <thead className="bg-zinc-50 border-b border-zinc-150 text-xs font-black text-zinc-600 uppercase tracking-widest text-left">
//                   <tr>
//                     <th className="px-8 py-6">Sr.</th>
//                     <th className="px-8 py-6">Name</th>
//                     <th className="px-8 py-6">Age</th>
//                     <th className="px-8 py-6">Relation</th>
//                     <th className="px-8 py-6">Occupation</th>
//                     <th className="px-8 py-6">Designation</th>
//                     <th className="px-8 py-6 text-right">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-zinc-150">
//                   {familyFields.map((f, i) => (
//                     <tr
//                       key={f.id}
//                       className="group hover:bg-white transition-colors"
//                     >
//                       <td className="px-8 py-4 text-sm font-bold text-zinc-400">
//                         {i + 1}
//                       </td>

//                       <td className="px-8 py-4">
//                         <input
//                           {...register(`familyDetails.${i}.name`)}
//                           placeholder="Full Name"
//                           className="w-full bg-white border border-zinc-200 focus:border-black px-3 py-2 rounded-lg font-bold text-sm text-zinc-900 outline-none transition-all shadow-sm"
//                         />
//                       </td>

//                       <td className="px-8 py-4">
//                         <input
//                           type="number"
//                           {...register(`familyDetails.${i}.age`)}
//                           placeholder="Age"
//                           className="w-20 bg-white border border-zinc-200 focus:border-black px-3 py-2 rounded-lg font-bold text-sm text-zinc-900 outline-none transition-all shadow-sm"
//                         />
//                       </td>

//                       <td className="px-8 py-4">
//                         <select
//                           {...register(`familyDetails.${i}.relation`)}
//                           className="w-full bg-white border border-zinc-200 focus:border-black px-3 py-2 rounded-lg font-bold text-sm text-zinc-900 outline-none transition-all shadow-sm"
//                         >
//                           <option value="">Select Relation</option>
//                           <option value="Mother">Mother</option>
//                           <option value="Father">Father</option>
//                           <option value="Brother">Brother</option>
//                           <option value="Sister">Sister</option>
//                           <option value="Mother in law">Mother in law</option>
//                           <option value="Father in law">Father in law</option>
//                           <option value="Grandparent">Grandparent</option>
//                           <option value="Spouse">Spouse</option>
//                           <option value="Daughter">Daughter</option>
//                           <option value="Son">Son</option>
//                           <option value="Other">Other</option>
//                         </select>
//                       </td>

//                       <td className="px-8 py-4">
//                         <select
//                           {...register(`familyDetails.${i}.occupation`)}
//                           className="w-full bg-white border border-zinc-200 focus:border-black px-3 py-2 rounded-lg font-bold text-sm text-zinc-900 outline-none transition-all shadow-sm"
//                         >
//                           <option value="">Select Occupation</option>
//                           <option value="Student">Student</option>
//                           <option value="Government">Government</option>
//                           <option value="Housewife">Housewife</option>
//                           <option value="Private">Private</option>
//                           <option value="Self-employed">Self-employed</option>
//                         </select>
//                       </td>

//                       <td className="px-8 py-4">
//                         <input
//                           {...register(`familyDetails.${i}.designation`)}
//                           placeholder="Designation"
//                           className="w-full bg-white border border-zinc-200 focus:border-black px-3 py-2 rounded-lg font-bold text-sm text-zinc-900 outline-none transition-all shadow-sm"
//                         />
//                       </td>

//                       <td className="px-8 py-4 text-right">
//                         <button
//                           type="button"
//                           onClick={() => removeFamily(i)}
//                           className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             /* MOBILE FAMILY CARDS */

//             <div className="lg:hidden space-y-6">
//               {familyFields.map((f, i) => (
//                 <div
//                   key={f.id}
//                   className="p-5 bg-zinc-50 rounded-xl border border-zinc-200 space-y-4 relative"
//                 >
//                   <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
//                     <span className="text-lg font-black text-zinc-455">
//                       #{i + 1}
//                     </span>

//                     <button
//                       type="button"
//                       onClick={() => removeFamily(i)}
//                       className="text-red-500 font-extrabold uppercase text-xs tracking-widest hover:text-red-650 transition-colors"
//                     >
//                       Remove
//                     </button>
//                   </div>

//                   <div className="grid grid-cols-1 gap-6">
//                     <input
//                       {...register(`familyDetails.${i}.name`)}
//                       placeholder="Full Name"
//                       className="w-full px-4 py-2 bg-white border border-zinc-200 focus:border-black rounded-lg text-sm font-semibold text-zinc-900"
//                     />

//                     <div className="grid grid-cols-2 gap-4">
//                       <input
//                         type="number"
//                         {...register(`familyDetails.${i}.age`)}
//                         placeholder="Age"
//                         className="w-full px-4 py-2 bg-white border border-zinc-200 focus:border-black rounded-lg text-sm font-semibold text-zinc-900"
//                       />

//                       <select
//                         {...register(`familyDetails.${i}.relation`)}
//                         className="w-full px-4 py-2 bg-white border border-zinc-200 focus:border-black rounded-lg text-sm font-semibold text-zinc-900 outline-none"
//                       >
//                         <option value="">Relation</option>
//                         <option value="Mother">Mother</option>
//                         <option value="Father">Father</option>
//                         <option value="Brother">Brother</option>
//                         <option value="Sister">Sister</option>
//                         <option value="Mother in law">Mother in law</option>
//                         <option value="Father in law">Father in law</option>
//                         <option value="Grandparent">Grandparent</option>
//                         <option value="Other">Other</option>
//                       </select>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <select
//                         {...register(`familyDetails.${i}.occupation`)}
//                         className="w-full px-4 py-2 bg-white border border-zinc-200 focus:border-black rounded-lg text-sm font-semibold text-zinc-900 outline-none"
//                       >
//                         <option value="">Occupation</option>
//                         <option value="Government">Government</option>
//                         <option value="Private">Private</option>
//                         <option value="Self-employed">Self-employed</option>
//                       </select>

//                       <input
//                         {...register(`familyDetails.${i}.designation`)}
//                         placeholder="Designation"
//                         className="w-full px-4 py-2 bg-white border border-zinc-200 focus:border-black rounded-lg text-sm font-semibold text-zinc-900"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* ADD FAMILY MEMBER */}

//           <button
//             type="button"
//             onClick={() => appendFamily({})}
//             className="mt-4 w-full lg:w-auto px-5 py-3 bg-zinc-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
//           >
//             <Plus className="w-4 h-4" />
//             Add Member
//           </button>
//         </div>
//       </div>

//       {/* ========================================================
//           CAMERA MODAL
//       ========================================================= */}

//       {showCamera && (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4">
//           <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
//             {/* MODAL HEADER */}

//             <div className="mb-4 flex items-center justify-between">
//               <div>
//                 <h2 className="text-lg font-black text-gray-900">
//                   Take Selfie
//                 </h2>

//                 <p className="text-xs text-gray-400 mt-1">
//                   Position your face inside the camera.
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={closeCamera}
//                 className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center hover:bg-zinc-200 transition-all"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* CAMERA */}

//             <div className="relative overflow-hidden rounded-2xl bg-black">
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 playsInline
//                 muted
//                 className="block w-full h-auto object-cover"
//               />

//               {/* CAMERA GUIDE */}

//               <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
//                 <div className="w-48 h-60 sm:w-56 sm:h-72 rounded-[50%] border-2 border-white/80" />
//               </div>
//             </div>

//             {/* HIDDEN CANVAS */}

//             <canvas ref={canvasRef} className="hidden" />

//             {/* CAMERA ACTIONS */}

//             <div className="mt-5 flex justify-center gap-3">
//               <button
//                 type="button"
//                 onClick={closeCamera}
//                 className="rounded-xl border border-gray-300 px-5 py-3 font-black text-xs uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition-all"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={captureSelfie}
//                 className="rounded-xl bg-black px-7 py-3 font-black text-xs uppercase tracking-widest text-white hover:bg-zinc-800 transition-all active:scale-95 flex items-center gap-2"
//               >
//                 <Camera className="w-4 h-4" />
//                 Capture
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Step1Personal;

import React, { useEffect, useRef, useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  FileText,
  Plus,
  Trash2,
  Calendar,
  Camera,
  Upload,
  X,
} from "lucide-react";
import FormLabel from "./FormLabel";
import { formatDate } from "../../utils/formatters";
import Axios from "../../utils/axiosConfig";
import { toast } from "react-toastify";

const Step1Personal = ({ isMobile }) => {
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useFormContext();

  const watchAddressType = watch("permanentAddressType");

  const {
    fields: familyFields,
    append: appendFamily,
    remove: removeFamily,
  } = useFieldArray({
    control,
    name: "familyDetails",
  });

  const watchPincode = watch("pincode");

  // ============================================================
  // SELFIE / CAMERA STATES
  // ============================================================

  const [selfiePreview, setSelfiePreview] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const photoInputRef = useRef(null);
  const selfieInputRef = useRef(null);

  // Register selfie field with React Hook Form
  register("selfie", {
    validate: (value) => {
      if (!value || !value[0]) {
        toast.error("Selfie is required");
        return "Selfie is required";
      }

      return true;
    },
  });

  // ============================================================
  // PINCODE -> CITY
  // ============================================================

  useEffect(() => {
    if (watchPincode && watchPincode.length === 6) {
      const fetchCity = async () => {
        try {
          const res = await Axios.get(`/pincodes/${watchPincode}`);
          const data = res.data;

          if (data.success && data.data) {
            setValue("city", data.data.city, {
              shouldValidate: true,
            });
          }
        } catch (error) {
          console.error("Error fetching city by pincode:", error);
        }
      };

      fetchCity();
    }
  }, [watchPincode, setValue]);

  // ============================================================
  // CAMERA VIDEO STREAM
  // ============================================================

  useEffect(() => {
    if (showCamera && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;

      videoRef.current.play().catch((error) => {
        console.error("Video play error:", error);
      });
    }
  }, [showCamera, cameraStream]);

  // ============================================================
  // CLEANUP CAMERA WHEN COMPONENT UNMOUNTS
  // ============================================================

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      if (selfiePreview) {
        URL.revokeObjectURL(selfiePreview);
      }
    };
  }, [cameraStream, selfiePreview]);

  // ============================================================
  // OPEN DEVICE CAMERA
  // ============================================================

  // const openCamera = async () => {
  //   try {
  //     // if (!navigator.mediaDevices?.getUserMedia) {
  //     //   alert("Camera access is not supported by this browser.");
  //     //   return;
  //     // }

  //     if (!navigator.mediaDevices?.getUserMedia) {
  //       photoInputRef.current?.click();
  //       return;
  //     }
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: {
  //         facingMode: "user",
  //       },
  //       audio: false,
  //     });

  //     setCameraStream(stream);
  //     setShowCamera(true);
  //   } catch (error) {
  //     console.error("Camera error:", error);

  //     if (error.name === "NotAllowedError") {
  //       alert(
  //         "Camera permission was denied. Please allow camera access and try again.",
  //       );
  //     } else if (error.name === "NotFoundError") {
  //       alert("No camera was found on this device.");
  //     } else if (error.name === "NotReadableError") {
  //       alert("Camera is already being used by another application.");
  //     } else {
  //       alert("Unable to access camera.");
  //     }
  //   }
  // };

  const openCamera = async () => {
    try {
      // Do not open the file/folder picker here.
      // Take Selfie must use the device camera directly.
      if (!window.isSecureContext) {
        alert(
          "Camera access requires HTTPS. Please open this page using HTTPS or localhost.",
        );
        return;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Camera access is not available in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: false,
      });

      setCameraStream(stream);
      setShowCamera(true);
    } catch (error) {
      console.error("Camera error:", error);

      if (error.name === "NotAllowedError") {
        alert(
          "Camera permission was denied. Please allow camera access and try again.",
        );
      } else if (error.name === "NotFoundError") {
        alert("No camera was found on this device.");
      } else if (error.name === "NotReadableError") {
        alert("Camera is already being used by another application.");
      } else {
        alert("Unable to access the device camera. Please try again.");
      }
    }
  };

  // ============================================================
  // CLOSE CAMERA
  // ============================================================

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    setCameraStream(null);
    setShowCamera(false);
  };

  // ============================================================
  // CAPTURE IMAGE FROM CAMERA
  // ============================================================

  const captureSelfie = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      return;
    }

    if (!video.videoWidth || !video.videoHeight) {
      alert("Camera is not ready yet. Please try again.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      alert("Unable to capture image.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          alert("Unable to capture selfie.");
          return;
        }

        const file = new File([blob], `selfie-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        // Revoke previous preview URL
        if (selfiePreview) {
          URL.revokeObjectURL(selfiePreview);
        }

        const previewUrl = URL.createObjectURL(file);

        // Store as array so it works consistently with
        // FormData submission using selfie[0]
        setValue("selfie", [file], {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });

        setSelfiePreview(previewUrl);

        closeCamera();
      },
      "image/jpeg",
      0.9,
    );
  };

  // ============================================================
  // UPLOAD PHOTO FROM DEVICE
  // ============================================================

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG and WEBP images are allowed.");

      event.target.value = "";
      return;
    }

    // const maxSize = 5 * 1024 * 1024;

    // if (file.size > maxSize) {
    //   alert("Photo size must be less than 5MB.");

    //   event.target.value = "";
    //   return;
    // }

    // Revoke previous preview URL
    if (selfiePreview) {
      URL.revokeObjectURL(selfiePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    // Store uploaded file in React Hook Form
    setValue("selfie", [file], {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    setSelfiePreview(previewUrl);

    // Allow selecting the same file again
    event.target.value = "";
  };

  // ============================================================
  // REMOVE SELFIE
  // ============================================================

  const removeSelfie = () => {
    if (selfiePreview) {
      URL.revokeObjectURL(selfiePreview);
    }

    setSelfiePreview(null);

    setValue("selfie", [], {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <>
      <div className="space-y-10">
        {/* ======================================================
            PERSONAL INFORMATION HEADER
        ======================================================= */}

        <div className="space-y-2">
          <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">
            Personal Information
          </h2>

          <p className="text-zinc-400 text-xs lg:text-sm font-bold uppercase tracking-wider">
            Please provide your basic contact and personal details.
          </p>
        </div>

        {/* ======================================================
            NAME + GENDER
        ======================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          {/* REGISTRATION DATE */}

          <div>
            <FormLabel>Reg. Date</FormLabel>

            <div className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-455 shadow-inner">
              {formatDate(watch("registrationDate"))}
            </div>

            <input type="hidden" {...register("registrationDate")} />
          </div>

          {/* FIRST NAME */}

          <div>
            <FormLabel required>First Name</FormLabel>

            <input
              type="text"
              {...register("firstName", {
                required: "Required",
              })}
              placeholder="Enter First Name"
              className={`w-full px-4 py-2 bg-zinc-50/50 border rounded-lg text-sm font-semibold text-zinc-900 placeholder:text-zinc-300 focus:bg-white focus:outline-none transition-all duration-300 ${
                errors.firstName
                  ? "border-red-500 bg-red-50/10"
                  : "border-zinc-200 focus:border-black"
              }`}
            />

            {errors.firstName && (
              <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* MIDDLE NAME */}

          <div>
            <FormLabel>Middle Name</FormLabel>

            <input
              type="text"
              {...register("middleName")}
              placeholder="Enter Middle Name"
              className="w-full px-4 py-2 bg-zinc-50/50 border border-zinc-200 focus:border-black rounded-lg text-sm font-semibold text-zinc-900 placeholder:text-zinc-300 focus:bg-white focus:outline-none transition-all duration-300"
            />
          </div>

          {/* LAST NAME */}

          <div>
            <FormLabel required>Last Name</FormLabel>

            <input
              type="text"
              {...register("lastName", {
                required: "Required",
              })}
              placeholder="Enter Last Name"
              className={`w-full px-4 py-2 bg-zinc-50/50 border rounded-lg text-sm font-semibold text-zinc-900 placeholder:text-zinc-300 focus:bg-white focus:outline-none transition-all duration-300 ${
                errors.lastName
                  ? "border-red-500 bg-red-50/10"
                  : "border-zinc-200 focus:border-black"
              }`}
            />

            {errors.lastName && (
              <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* GENDER */}

          <div>
            <FormLabel required>Gender</FormLabel>

            <select
              {...register("gender", {
                required: "Required",
              })}
              className={`w-full px-4 py-2 bg-zinc-50/50 border rounded-lg text-sm font-semibold text-zinc-900 outline-none focus:bg-white focus:outline-none transition-all duration-300 ${
                errors.gender
                  ? "border-red-500 bg-red-50/10"
                  : "border-zinc-200 focus:border-black"
              }`}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            {errors.gender && (
              <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                {errors.gender.message}
              </p>
            )}
          </div>
        </div>

        {/* ======================================================
            SELFIE SECTION
        ======================================================= */}

        <div className="pt-2">
          <div
            className={`relative rounded-2xl border p-6 lg:p-8 transition-all ${
              errors.selfie
                ? "border-red-500 bg-red-50/10"
                : "border-zinc-200 bg-zinc-50/30"
            }`}
          >
            {/* TITLE */}

            <div className="text-center space-y-2 mb-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-zinc-900 text-white flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>

              <h3 className="text-lg lg:text-xl font-black text-zinc-900">
                Candidate Photo
              </h3>

              <p className="text-zinc-400 text-xs lg:text-sm font-bold uppercase tracking-wider">
                Take a selfie or upload a photo from your device.
              </p>
            </div>

            {/* PREVIEW */}

            {selfiePreview ? (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={selfiePreview}
                    alt="Candidate selfie preview"
                    className="w-40 h-40 lg:w-48 lg:h-48 rounded-full object-cover border-4 border-white shadow-xl"
                  />

                  <button
                    type="button"
                    onClick={removeSelfie}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-all"
                    title="Remove photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-5 text-center">
                  <p className="text-sm font-bold text-emerald-600">
                    Photo selected successfully
                  </p>

                  <p className="text-xs text-zinc-400 mt-1">
                    You can remove it and take/upload another photo.
                  </p>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={openCamera}
                    className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Retake Selfie
                  </button>

                  {/* <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="px-6 py-3 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Change Photo
                  </button> */}
                </div>
              </div>
            ) : (
              <>
                {/* EMPTY PHOTO AREA */}

                <div className="flex flex-col items-center justify-center">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-2 border-dashed border-zinc-300 bg-white flex items-center justify-center mb-6">
                    <Camera className="w-10 h-10 text-zinc-300" />
                  </div>

                  {/* BUTTONS */}

                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* TAKE SELFIE */}

                    <button
                      type="button"
                      onClick={openCamera}
                      className="px-7 py-3 bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md"
                    >
                      <Camera className="w-4 h-4" />
                      Take Selfie
                    </button>

                    {/* UPLOAD PHOTO */}

                    {/* <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="px-7 py-3 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-50 hover:border-zinc-300 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Photo
                    </button> */}
                  </div>

                  {/* HIDDEN FILE INPUT */}

                  {/* <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    capture="user"
                    className="hidden"
                  /> */}
                  {/* HIDDEN INPUT FOR TAKE SELFIE */}
                  <input
                    ref={selfieInputRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  {/* HIDDEN INPUT FOR UPLOAD PHOTO */}
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  {/* <p className="mt-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    JPG, PNG, WEBP • Maximum 5MB
                  </p> */}
                </div>
              </>
            )}

            {/* ERROR */}

            {errors.selfie && (
              <p className="mt-4 text-center text-red-500 text-xs font-black uppercase tracking-widest">
                {errors.selfie.message}
              </p>
            )}
          </div>
        </div>

        {/* ======================================================
            MOBILE / WHATSAPP / EMAIL
        ======================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* MOBILE */}

          <div>
            <FormLabel required>Mobile Number</FormLabel>

            <input
              type="tel"
              maxLength="10"
              {...register("mobileNumber", {
                required: "Required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Invalid (10 digits)",
                },
              })}
              placeholder="10-digit number"
              className={`w-full px-4 py-2 bg-zinc-50/50 border rounded-lg text-sm font-semibold text-zinc-900 focus:bg-white focus:outline-none transition-all duration-300 ${
                errors.mobileNumber
                  ? "border-red-500 bg-red-50/10"
                  : "border-zinc-200 focus:border-black"
              }`}
            />

            {errors.mobileNumber && (
              <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                {errors.mobileNumber.message}
              </p>
            )}
          </div>

          {/* WHATSAPP */}

          <div>
            <div className="flex items-center justify-between mb-1.5 ml-1">
              <FormLabel required>WhatsApp Number</FormLabel>

              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("sameAsMobile")}
                  className="w-3.5 h-3.5 rounded text-black focus:ring-black border-zinc-350"
                />

                <span className="text-xs font-black text-zinc-500 uppercase tracking-widest group-hover:text-black transition-colors">
                  Same as Mobile
                </span>
              </label>
            </div>

            <input
              type="tel"
              {...register("whatsAppNumber", {
                required: "Required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Invalid (10 digits)",
                },
              })}
              placeholder="WhatsApp number"
              disabled={watch("sameAsMobile")}
              className={`w-full px-4 py-2 bg-zinc-50/50 border rounded-lg text-sm font-semibold text-zinc-900 focus:bg-white focus:outline-none transition-all duration-300 ${
                watch("sameAsMobile")
                  ? "opacity-50 cursor-not-allowed bg-zinc-100"
                  : ""
              } ${
                errors.whatsAppNumber
                  ? "border-red-500 bg-red-50/10"
                  : "border-zinc-200 focus:border-black"
              }`}
            />

            {errors.whatsAppNumber && (
              <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                {errors.whatsAppNumber.message}
              </p>
            )}
          </div>

          {/* EMAIL */}

          <div>
            <FormLabel required>Email Address</FormLabel>

            <input
              type="email"
              {...register("email", {
                required: "Required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email",
                },
              })}
              placeholder="email@example.com"
              className={`w-full px-4 py-2 bg-zinc-50/50 border rounded-lg text-sm font-semibold text-zinc-900 focus:bg-white focus:outline-none transition-all duration-300 ${
                errors.email
                  ? "border-red-500 bg-red-50/10"
                  : "border-zinc-200 focus:border-black"
              }`}
            />

            {errors.email && (
              <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* ======================================================
            DOB / AGE / MARITAL STATUS
        ======================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* DOB */}

          <div>
            <FormLabel required>Date of Birth</FormLabel>

            <div
              className="relative group cursor-pointer"
              onClick={(e) => {
                const input =
                  e.currentTarget.querySelector('input[type="date"]');

                if (input && input.showPicker) {
                  input.showPicker();
                }
              }}
            >
              <input
                type="date"
                max={todayStr}
                {...register("dateOfBirth", {
                  required: "Required",
                  validate: (val) => {
                    if (!val) return "Required";

                    const selectedDate = new Date(val);
                    const today = new Date();

                    today.setHours(0, 0, 0, 0);
                    selectedDate.setHours(0, 0, 0, 0);

                    if (selectedDate > today) {
                      return "Cannot be a future date";
                    }

                    let age = today.getFullYear() - selectedDate.getFullYear();

                    const m = today.getMonth() - selectedDate.getMonth();

                    if (
                      m < 0 ||
                      (m === 0 && today.getDate() < selectedDate.getDate())
                    ) {
                      age--;
                    }

                    if (age < 18) {
                      return "Must be at least 18 years old";
                    }

                    return true;
                  },
                })}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-20"
              />

              <div
                className={`w-full px-4 py-2 bg-zinc-50 border rounded-lg text-sm font-semibold text-zinc-900 transition-all flex items-center justify-between ${
                  errors.dateOfBirth
                    ? "border-red-500 bg-red-50/10"
                    : "border-zinc-200 group-hover:border-zinc-300"
                }`}
              >
                <span
                  className={
                    watch("dateOfBirth") ? "text-zinc-900" : "text-zinc-300"
                  }
                >
                  {watch("dateOfBirth")
                    ? formatDate(watch("dateOfBirth"))
                    : "DD-MMM-YYYY"}
                </span>

                <Calendar
                  className={`w-4 h-4 ${
                    errors.dateOfBirth
                      ? "text-red-400"
                      : "text-zinc-400 group-hover:text-black"
                  }`}
                />
              </div>
            </div>

            {errors.dateOfBirth && (
              <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          {/* AGE */}

          <div>
            <FormLabel>Age</FormLabel>

            <input
              type="number"
              readOnly
              {...register("age")}
              className={`w-full px-4 py-2 bg-zinc-50 border rounded-lg text-sm font-semibold outline-none transition-all ${
                errors.dateOfBirth?.message?.includes("18")
                  ? "border-red-500 bg-red-50/10 text-red-500"
                  : "border-zinc-200 text-zinc-400 shadow-inner"
              }`}
            />
          </div>

          {/* MARITAL STATUS */}

          <div>
            <FormLabel required>Marital Status</FormLabel>

            <select
              {...register("maritalStatus", {
                required: "Required",
              })}
              className={`w-full px-4 py-2 bg-zinc-50/50 border rounded-lg text-sm font-semibold text-zinc-900 outline-none focus:bg-white focus:outline-none transition-all duration-300 ${
                errors.maritalStatus
                  ? "border-red-500 bg-red-50/10"
                  : "border-zinc-200 focus:border-black"
              }`}
            >
              <option value="">Select</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </select>

            {errors.maritalStatus && (
              <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                {errors.maritalStatus.message}
              </p>
            )}
          </div>
        </div>

        {/* ======================================================
            ADDRESS DETAILS
        ======================================================= */}

        <div className="space-y-6 pt-8 border-t border-zinc-150">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-zinc-900/5 flex items-center justify-center border border-zinc-200/50">
                  <FileText className="w-4 h-4 text-zinc-800" />
                </div>
                Address Details
              </h3>

              <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                Please provide your residential address and duration of stay.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* CURRENT ADDRESS */}

            <div className="lg:col-span-8 bg-zinc-50/30 rounded-2xl border border-zinc-200/60 p-5 lg:p-6 space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
                <div className="w-2 h-2 rounded-full bg-zinc-800" />

                <h4 className="text-sm font-black text-zinc-900 uppercase tracking-widest">
                  Current Residential Address
                </h4>
              </div>

              <div className="space-y-4">
                {/* ADDRESS LINE 1 */}

                <div>
                  <FormLabel required>Address Line 1</FormLabel>

                  <input
                    type="text"
                    {...register("addressLine1", {
                      required: "Required",
                    })}
                    placeholder="Flat / House No., Building Name, Street Name"
                    className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-black ${
                      errors.addressLine1
                        ? "border-red-500 bg-red-50/10 focus:ring-red-500"
                        : "border-zinc-200 focus:border-black"
                    }`}
                  />

                  {errors.addressLine1 && (
                    <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                      {errors.addressLine1.message}
                    </p>
                  )}
                </div>

                {/* ADDRESS LINE 2 + 3 */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormLabel>Address Line 2</FormLabel>

                    <input
                      type="text"
                      {...register("addressLine2")}
                      placeholder="Street, Area, Locality"
                      className="w-full px-4 py-2.5 bg-white border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div>
                    <FormLabel>Address Line 3</FormLabel>

                    <input
                      type="text"
                      {...register("addressLine3")}
                      placeholder="Landmark / Locality details"
                      className="w-full px-4 py-2.5 bg-white border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* PINCODE / CITY / ADDRESS TYPE / STAYING */}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5 items-end">
                {/* PINCODE */}

                <div className="md:col-span-3">
                  <FormLabel required>Pincode</FormLabel>

                  <input
                    type="text"
                    {...register("pincode", {
                      required: "Required",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Invalid (6 digits)",
                      },
                    })}
                    placeholder="6-digit Pincode"
                    className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-black ${
                      errors.pincode
                        ? "border-red-500 bg-red-50/10 focus:ring-red-500"
                        : "border-zinc-200 focus:border-black"
                    }`}
                  />

                  {errors.pincode && (
                    <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                      {errors.pincode.message}
                    </p>
                  )}
                </div>

                {/* CITY */}

                <div className="md:col-span-3">
                  <FormLabel required>City</FormLabel>

                  <input
                    type="text"
                    {...register("city", {
                      required: "Required",
                    })}
                    placeholder="Auto-fetched"
                    className="w-full px-4 py-2.5 bg-zinc-100/60 border border-zinc-200/80 rounded-xl text-sm font-bold text-zinc-500 outline-none cursor-not-allowed shadow-inner"
                    readOnly
                  />

                  {errors.city && (
                    <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                {/* ADDRESS TYPE */}

                <div className="md:col-span-4">
                  <FormLabel required>Address Type</FormLabel>

                  <div className="flex gap-4 items-center h-10 px-4 bg-white border border-zinc-200 rounded-xl">
                    {["Rental", "Owned", "PG"].map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-1.5 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          value={type}
                          {...register("addressType", {
                            required: "Required",
                          })}
                          className="w-4 h-4 text-black focus:ring-black border-zinc-300 focus:ring-1"
                        />

                        <span className="text-xs font-bold text-zinc-700 group-hover:text-black transition-colors">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>

                  {errors.addressType && (
                    <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                      {errors.addressType.message}
                    </p>
                  )}
                </div>

                {/* STAYING SINCE */}

                <div className="md:col-span-2">
                  <FormLabel required>Staying Since</FormLabel>

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      {...register("stayingSince", {
                        required: "Required",
                        min: {
                          value: 0,
                          message: "Min 0",
                        },
                      })}
                      placeholder="Years"
                      className={`w-full pr-8 pl-3 py-2.5 bg-white border rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-black ${
                        errors.stayingSince
                          ? "border-red-500 bg-red-50/10 focus:ring-red-500"
                          : "border-zinc-200 focus:border-black"
                      }`}
                    />

                    <span className="absolute right-3 text-xs font-bold text-zinc-400 pointer-events-none">
                      Yrs
                    </span>
                  </div>

                  {errors.stayingSince && (
                    <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest text-center">
                      {errors.stayingSince.message}
                    </p>
                  )}
                </div>
              </div>

              <input type="hidden" {...register("currentAddress")} />
            </div>

            {/* PERMANENT ADDRESS */}

            <div className="lg:col-span-4 h-full">
              <div className="bg-zinc-50/30 rounded-2xl border border-zinc-200/60 p-5 lg:p-6 space-y-6 flex flex-col justify-between h-full min-h-[320px]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100 gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-zinc-800" />

                      <h4 className="text-sm font-black text-zinc-900 uppercase tracking-widest">
                        Permanent Address
                      </h4>
                    </div>

                    <label className="flex items-center gap-1.5 cursor-pointer group shrink-0">
                      <input
                        type="checkbox"
                        checked={watchAddressType === "same_as_current"}
                        onChange={(e) =>
                          setValue(
                            "permanentAddressType",
                            e.target.checked ? "same_as_current" : "other",
                            {
                              shouldValidate: true,
                            },
                          )
                        }
                        className="w-3.5 h-3.5 rounded text-black focus:ring-black border-zinc-300"
                      />

                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-black transition-colors">
                        Same
                      </span>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <textarea
                      rows={6}
                      {...register("permanentAddress", {
                        required: "Required",
                      })}
                      readOnly={watchAddressType === "same_as_current"}
                      placeholder="Enter permanent address details..."
                      className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none transition-all duration-300 resize-none focus:ring-1 focus:ring-black ${
                        watchAddressType === "same_as_current"
                          ? "opacity-60 bg-zinc-50 cursor-not-allowed border-zinc-200 text-zinc-500"
                          : "border-zinc-200 focus:border-black"
                      } ${
                        errors.permanentAddress
                          ? "border-red-500 bg-red-50/10 focus:ring-red-500"
                          : ""
                      }`}
                    />

                    {errors.permanentAddress && (
                      <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                        {errors.permanentAddress.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-zinc-100/50 border border-zinc-200/50 rounded-xl p-3 text-[11px] text-zinc-500 font-medium">
                  {watchAddressType === "same_as_current" ? (
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Synchronized with Current Address.
                    </span>
                  ) : (
                    <span>
                      Please provide full permanent address details for
                      verification.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            LANGUAGES KNOWN
        ======================================================= */}

        <div className="space-y-3 pt-6 border-t border-zinc-150">
          <FormLabel required>Languages Known</FormLabel>

          <p className="text-zinc-400 text-xs font-black uppercase tracking-wider mb-2">
            Select all languages you can speak/write
          </p>

          <div className="flex flex-wrap gap-2.5">
            {[
              "English",
              "Hindi",
              "Marathi",
              "Punjabi",
              "Odia",
              "Bengali",
              "Tamil",
              "Telugu",
              "Kannada",
              "Malayalam",
              "Gujarati",
              "Others",
            ].map((lang) => {
              const currentLanguages = watch("languagesKnown") || [];

              const isSelected = currentLanguages.includes(lang);

              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      setValue(
                        "languagesKnown",
                        currentLanguages.filter((l) => l !== lang),
                        {
                          shouldValidate: true,
                        },
                      );
                    } else {
                      setValue("languagesKnown", [...currentLanguages, lang], {
                        shouldValidate: true,
                      });
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all active:scale-95 duration-200 ${
                    isSelected
                      ? "bg-zinc-900 border-zinc-900 text-white shadow-sm shadow-zinc-900/10"
                      : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100 hover:border-zinc-350"
                  }`}
                >
                  {lang}
                </button>
              );
            })}
          </div>

          <input
            type="hidden"
            {...register("languagesKnown", {
              validate: (val) =>
                (val && val.length > 0) || "Select at least one language",
            })}
          />

          {errors.languagesKnown && (
            <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
              {errors.languagesKnown.message}
            </p>
          )}

          {watch("languagesKnown")?.includes("Others") && (
            <div className="mt-4 max-w-md animate-in slide-in-from-top-2 duration-300">
              <FormLabel required>Specify Custom Language(s)</FormLabel>

              <input
                type="text"
                {...register("otherLanguage", {
                  required: watch("languagesKnown")?.includes("Others")
                    ? "Required"
                    : false,
                })}
                placeholder="Enter other language(s)"
                className={`w-full px-4 py-2 bg-zinc-50/50 border rounded-lg text-sm font-semibold text-zinc-900 focus:bg-white focus:outline-none transition-all duration-300 ${
                  errors.otherLanguage
                    ? "border-red-500 bg-red-50/10"
                    : "border-zinc-200"
                }`}
              />

              {errors.otherLanguage && (
                <p className="mt-1 text-red-500 text-xs font-black uppercase tracking-widest">
                  {errors.otherLanguage.message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* ======================================================
            FAMILY DETAILS
        ======================================================= */}

        <div className="pt-10 border-t border-zinc-150 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-lg lg:text-xl font-black text-zinc-900 tracking-tight">
                Family Details
              </h3>

              <p className="text-zinc-450 font-bold uppercase text-xs tracking-widest">
                Add family members (Optional)
              </p>
            </div>
          </div>

          {/* DESKTOP FAMILY TABLE */}

          {!isMobile ? (
            <div className="hidden lg:block overflow-hidden rounded-xl border border-zinc-150 bg-zinc-50/30">
              <table className="w-full border-collapse">
                <thead className="bg-zinc-50 border-b border-zinc-150 text-xs font-black text-zinc-600 uppercase tracking-widest text-left">
                  <tr>
                    <th className="px-8 py-6">Sr.</th>
                    <th className="px-8 py-6">Name</th>
                    <th className="px-8 py-6">Age</th>
                    <th className="px-8 py-6">Relation</th>
                    <th className="px-8 py-6">Occupation</th>
                    <th className="px-8 py-6">Designation</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-150">
                  {familyFields.map((f, i) => (
                    <tr
                      key={f.id}
                      className="group hover:bg-white transition-colors"
                    >
                      <td className="px-8 py-4 text-sm font-bold text-zinc-400">
                        {i + 1}
                      </td>

                      <td className="px-8 py-4">
                        <input
                          {...register(`familyDetails.${i}.name`)}
                          placeholder="Full Name"
                          className="w-full bg-white border border-zinc-200 focus:border-black px-3 py-2 rounded-lg font-bold text-sm text-zinc-900 outline-none transition-all shadow-sm"
                        />
                      </td>

                      <td className="px-8 py-4">
                        <input
                          type="number"
                          {...register(`familyDetails.${i}.age`)}
                          placeholder="Age"
                          className="w-20 bg-white border border-zinc-200 focus:border-black px-3 py-2 rounded-lg font-bold text-sm text-zinc-900 outline-none transition-all shadow-sm"
                        />
                      </td>

                      <td className="px-8 py-4">
                        <select
                          {...register(`familyDetails.${i}.relation`)}
                          className="w-full bg-white border border-zinc-200 focus:border-black px-3 py-2 rounded-lg font-bold text-sm text-zinc-900 outline-none transition-all shadow-sm"
                        >
                          <option value="">Select Relation</option>
                          <option value="Mother">Mother</option>
                          <option value="Father">Father</option>
                          <option value="Brother">Brother</option>
                          <option value="Sister">Sister</option>
                          <option value="Mother in law">Mother in law</option>
                          <option value="Father in law">Father in law</option>
                          <option value="Grandparent">Grandparent</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Daughter">Daughter</option>
                          <option value="Son">Son</option>
                          <option value="Other">Other</option>
                        </select>
                      </td>

                      <td className="px-8 py-4">
                        <select
                          {...register(`familyDetails.${i}.occupation`)}
                          className="w-full bg-white border border-zinc-200 focus:border-black px-3 py-2 rounded-lg font-bold text-sm text-zinc-900 outline-none transition-all shadow-sm"
                        >
                          <option value="">Select Occupation</option>
                          <option value="Student">Student</option>
                          <option value="Government">Government</option>
                          <option value="Housewife">Housewife</option>
                          <option value="Private">Private</option>
                          <option value="Self-employed">Self-employed</option>
                        </select>
                      </td>

                      <td className="px-8 py-4">
                        <input
                          {...register(`familyDetails.${i}.designation`)}
                          placeholder="Designation"
                          className="w-full bg-white border border-zinc-200 focus:border-black px-3 py-2 rounded-lg font-bold text-sm text-zinc-900 outline-none transition-all shadow-sm"
                        />
                      </td>

                      <td className="px-8 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => removeFamily(i)}
                          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* MOBILE FAMILY CARDS */

            <div className="lg:hidden space-y-6">
              {familyFields.map((f, i) => (
                <div
                  key={f.id}
                  className="p-5 bg-zinc-50 rounded-xl border border-zinc-200 space-y-4 relative"
                >
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                    <span className="text-lg font-black text-zinc-455">
                      #{i + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFamily(i)}
                      className="text-red-500 font-extrabold uppercase text-xs tracking-widest hover:text-red-650 transition-colors"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <input
                      {...register(`familyDetails.${i}.name`)}
                      placeholder="Full Name"
                      className="w-full px-4 py-2 bg-white border border-zinc-200 focus:border-black rounded-lg text-sm font-semibold text-zinc-900"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        {...register(`familyDetails.${i}.age`)}
                        placeholder="Age"
                        className="w-full px-4 py-2 bg-white border border-zinc-200 focus:border-black rounded-lg text-sm font-semibold text-zinc-900"
                      />

                      <select
                        {...register(`familyDetails.${i}.relation`)}
                        className="w-full px-4 py-2 bg-white border border-zinc-200 focus:border-black rounded-lg text-sm font-semibold text-zinc-900 outline-none"
                      >
                        <option value="">Relation</option>
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                        <option value="Mother in law">Mother in law</option>
                        <option value="Father in law">Father in law</option>
                        <option value="Grandparent">Grandparent</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <select
                        {...register(`familyDetails.${i}.occupation`)}
                        className="w-full px-4 py-2 bg-white border border-zinc-200 focus:border-black rounded-lg text-sm font-semibold text-zinc-900 outline-none"
                      >
                        <option value="">Occupation</option>
                        <option value="Government">Government</option>
                        <option value="Private">Private</option>
                        <option value="Self-employed">Self-employed</option>
                      </select>

                      <input
                        {...register(`familyDetails.${i}.designation`)}
                        placeholder="Designation"
                        className="w-full px-4 py-2 bg-white border border-zinc-200 focus:border-black rounded-lg text-sm font-semibold text-zinc-900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ADD FAMILY MEMBER */}

          <button
            type="button"
            onClick={() => appendFamily({})}
            className="mt-4 w-full lg:w-auto px-5 py-3 bg-zinc-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </div>

      {/* ========================================================
          CAMERA MODAL
      ========================================================= */}

      {showCamera && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
            {/* MODAL HEADER */}

            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-gray-900">
                  Take Selfie
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Position your face inside the camera.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCamera}
                className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center hover:bg-zinc-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CAMERA */}

            <div className="relative overflow-hidden rounded-2xl bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="block w-full h-auto object-cover"
              />

              {/* CAMERA GUIDE */}

              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-60 sm:w-56 sm:h-72 rounded-[50%] border-2 border-white/80" />
              </div>
            </div>

            {/* HIDDEN CANVAS */}

            <canvas ref={canvasRef} className="hidden" />

            {/* CAMERA ACTIONS */}

            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                onClick={closeCamera}
                className="rounded-xl border border-gray-300 px-5 py-3 font-black text-xs uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={captureSelfie}
                className="rounded-xl bg-black px-7 py-3 font-black text-xs uppercase tracking-widest text-white hover:bg-zinc-800 transition-all active:scale-95 flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Capture
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Step1Personal;
