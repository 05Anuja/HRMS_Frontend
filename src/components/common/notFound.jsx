import React from "react";
import { Link } from "react-router-dom";
import NotFoundSVG from "../../assets/notFound.svg";
import { ChevronLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 dark:bg-linear-to-b dark:from-[#0f1115] dark:to-[#0b0d12] flex items-center justify-center p-6">
      <div className="text-center max-w-lg">
        {/* SVG */}
        <img
          src={NotFoundSVG}
          alt="404 Not Found"
          className="w-96 max-w-full mx-auto mb-6"
        />

        {/* Title */}
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Oops, something went wrong
        </h1>

        {/* Description */}
        <p className="text-lg text-muted-foreground mb-6">
          Error 404 Page not found. Sorry the page you looking for doesn’t exist
          or has been moved
        </p>

        {/* Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center px-6 py-3 rounded font-medium bg-linear-to-br from-primary to-primary hover:from-primary text-white"
        >
          <ChevronLeft size={18} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
