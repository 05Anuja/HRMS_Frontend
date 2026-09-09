import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/authcontext";
import NotFound from "./components/common/notFound";

//Layouts
import AuthLayout from "./components/Layout/AuthLayout";
import PublicLayout from "./components/Layout/PublicLayout";
import MainLayout from "./components/Layout/MainLayout";

import Candidates from "./pages/Candidates";
import Users from "./pages/Users";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import CandidateHistory from "./pages/CandidateHistory";
import CandidateHistoryDetail from "./pages/CandidateHistoryDetail";
import CandidateRegistration from "./pages/CandidateRegistration";
import UploadDocuments from "./pages/UploadDocuments";
import SelectionMail from "./pages/SelectionMail";
import OfferAcceptence from "./pages/OfferAcceptence";

const AppContent = () => {
  const { token, user } = useAuth();

  const RequireAuth = ({ children, allowedRoles }) => {
    if (!token) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      return <Navigate to="/dashboard" />;
    }
    return children;
  };

  return (
    <Routes>
      {/* ================= AUTH LAYOUT ================= */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" /> : <Login />}
        />
      </Route>

      {/* ================= PUBLIC LAYOUT ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/candidate" element={<CandidateRegistration />} />
        <Route
          // path="/upload-documents/:candidateId"
          path="/upload-documents"
          element={<UploadDocuments />}
        />



        <Route
          path="/offer-acceptance"
          element={<OfferAcceptence />}
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ================= MAIN APP LAYOUT ================= */}
      <Route
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/candidate-history" element={<CandidateHistory />} />
        <Route
          path="/candidate-history/:id"
          element={<CandidateHistoryDetail />}
        />
        <Route
          path="/users"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <Users />
            </RequireAuth>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        {/* <Route
          // path="/upload-documents/:candidateId"
          path="/upload-documents"
          element={<UploadDocuments />}
        /> */}
        <Route path="/selection-mail/:id" element={<SelectionMail />} />
      </Route>
    </Routes>
  );
};

export default AppContent;
