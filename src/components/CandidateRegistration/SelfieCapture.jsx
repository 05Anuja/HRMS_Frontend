import React, { useEffect, useRef, useState } from "react";
import { Camera, Upload, RotateCcw, Trash2, X, Check } from "lucide-react";
import { useFormContext } from "react-hook-form";

const SelfieCapture = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [preview, setPreview] = useState(null);

  const selfie = watch("selfie");

  // Register selfie field with React Hook Form
  register("selfie", {
    validate: (value) => {
      if (!value) {
        return "Please capture or upload your photo";
      }

      const file = Array.isArray(value) ? value[0] : value;

      if (!(file instanceof File)) {
        return "Please select a valid photo";
      }

      return true;
    },
  });

  // ----------------------------------------
  // OPEN CAMERA
  // ----------------------------------------

  const openCamera = async () => {
    try {
      // Browser doesn't support getUserMedia
      if (!navigator.mediaDevices?.getUserMedia) {
        // Mobile fallback - open front camera
        fileInputRef.current?.click();
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: "user",
          },
          width: {
            ideal: 1280,
          },
          height: {
            ideal: 720,
          },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraOpen(true);
    } catch (error) {
      console.error("Camera error:", error);

      if (error.name === "NotAllowedError") {
        alert(
          "Camera permission was denied. Please allow camera access and try again.",
        );
      } else if (error.name === "NotFoundError") {
        alert("No camera was found on this device.");
      } else {
        // If browser camera API fails, fallback to device camera
        fileInputRef.current?.click();
      }
    }
  };
  // ----------------------------------------
  // STOP CAMERA
  // ----------------------------------------

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
  };

  // ----------------------------------------
  // CAPTURE SELFIE
  // ----------------------------------------

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

    // Mirror image like normal selfie camera
    context.translate(canvas.width, 0);
    context.scale(-1, 1);

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          alert("Unable to capture image.");
          return;
        }

        const file = new File([blob], `selfie-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        setSelfie(file);

        stopCamera();
      },
      "image/jpeg",
      0.9,
    );
  };

  // ----------------------------------------
  // HANDLE DEVICE UPLOAD
  // ----------------------------------------

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      event.target.value = "";
      return;
    }

    // Maximum 5MB
    // if (file.size > 7 * 1024 * 1024) {
    //   alert("Photo size must be less than 5MB.");
    //   event.target.value = "";
    //   return;
    // }

    setSelfie(file);
  };

  // ----------------------------------------
  // SET SELFIE
  // ----------------------------------------

  const setSelfie = (file) => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);

    setValue("selfie", [file], {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // ----------------------------------------
  // RETAKE
  // ----------------------------------------

  const retakeSelfie = () => {
    removeSelfie(false);
    openCamera();
  };

  // ----------------------------------------
  // REMOVE
  // ----------------------------------------

  const removeSelfie = (clearInput = true) => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);

    setValue("selfie", [], {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    if (clearInput && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ----------------------------------------
  // CLEANUP
  // ----------------------------------------

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }

      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="space-y-4">
      {/* Hidden React Hook Form file reference */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        capture="user"
        onChange={handleFileUpload}
      />

      {/* Hidden canvas used for camera capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* -------------------------------------- */}
      {/* TITLE */}
      {/* -------------------------------------- */}

      <div>
        <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest">
          Candidate Photo
        </h3>

        <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-1">
          Capture or upload your photo
        </p>
      </div>

      {/* -------------------------------------- */}
      {/* CAMERA */}
      {/* -------------------------------------- */}

      {cameraOpen && (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-black border border-zinc-200">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-[4/3] object-cover scale-x-[-1]"
            />

            {/* Face guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-60 sm:w-56 sm:h-72 border-2 border-white/80 rounded-[50%]" />
            </div>

            {/* Camera instructions */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <span className="inline-block px-4 py-2 rounded-full bg-black/60 text-white text-xs font-bold">
                Position your face inside the frame
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={captureSelfie}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 text-white text-xs font-black uppercase tracking-widest hover:bg-black transition"
            >
              <Camera className="w-4 h-4" />
              Capture
            </button>

            <button
              type="button"
              onClick={stopCamera}
              className="px-4 py-3 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* -------------------------------------- */}
      {/* PHOTO PREVIEW */}
      {/* -------------------------------------- */}

      {!cameraOpen && preview && (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-300 bg-emerald-50">
            <img
              src={preview}
              alt="Candidate"
              className="w-full aspect-[4/3] object-cover"
            />

            <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
              <Check className="w-5 h-5" />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={retakeSelfie}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-700 text-xs font-black uppercase tracking-widest hover:bg-zinc-50"
            >
              <RotateCcw className="w-4 h-4" />
              Retake
            </button>

            <button
              type="button"
              onClick={() => removeSelfie()}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-200 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
          </div>

          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <Check className="w-3 h-3" />
            Photo ready for registration
          </p>
        </div>
      )}

      {/* -------------------------------------- */}
      {/* INITIAL STATE */}
      {/* -------------------------------------- */}

      {!cameraOpen && !preview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* CAMERA BUTTON */}
          <button
            type="button"
            onClick={openCamera}
            className="min-h-[190px] rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300 transition flex flex-col items-center justify-center gap-3"
          >
            <div className="w-14 h-14 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
              <Camera className="w-6 h-6 text-zinc-700" />
            </div>

            <div className="text-center">
              <p className="text-sm font-black text-zinc-800">Take Selfie</p>

              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                Use Camera
              </p>
            </div>
          </button>

          {/* UPLOAD BUTTON */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[190px] rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300 transition flex flex-col items-center justify-center gap-3"
          >
            <div className="w-14 h-14 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
              <Upload className="w-6 h-6 text-zinc-700" />
            </div>

            <div className="text-center">
              <p className="text-sm font-black text-zinc-800">Upload Photo</p>

              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                From Device
              </p>
            </div>
          </button>
        </div>
      )}

      {/* -------------------------------------- */}
      {/* ERROR */}
      {/* -------------------------------------- */}

      {errors.selfie && (
        <p className="text-xs text-red-500 font-bold">
          {errors.selfie.message}
        </p>
      )}

      {/* Supported formats */}
      {!preview && !cameraOpen && (
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
          JPG, PNG or WEBP • Maximum 5MB
        </p>
      )}
    </div>
  );
};

export default SelfieCapture;
