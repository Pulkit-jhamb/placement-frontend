import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import axios from "axios";

import { API_ENDPOINTS } from "./config";
import { setupAxiosInterceptors } from "./utils/axiosConfig";

// =========================
// IMPORT COMPONENTS
// =========================

// Landing pages
import CarevoLanding from "./pages/landing_page/landing_page";
import Pricing from "./pages/landing_page/pricing";
import AboutTeam from "./pages/landing_page/about_team";
import Product from "./pages/landing_page/product";

// Auth pages
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";

// Onboarding pages
import OnboardingStart from "./pages/onboarding/OnboardingStart";
import OnboardingExperience from "./pages/onboarding/OnboardingExperience";
import OnboardingCertifications from "./pages/onboarding/OnboardingCertifications";
import OnboardingTechStack from "./pages/onboarding/OnboardingTechStack";
import OnboardingAITools from "./pages/onboarding/OnboardingAITools";
import OnboardingProjects from "./pages/onboarding/OnboardingProjects";
import OnboardingSkills from "./pages/onboarding/OnboardingSkills";

// Student pages
import StudentHome from "./pages/student/student_home";
import StudentAI from "./pages/student/student_AI";
import StudentChat from "./pages/student/student_chat";
import StudentPsychometric from "./pages/student/student_psychometric";
import StudentPsychometricQuiz from "./pages/student/student_psychometric_quiz";
import StudentPsychometricResult from "./pages/student/student_psychometric_result";
import StudentProjects from "./pages/student/student_projects";
import StudentPlacement from "./pages/student/student_placement";
import StudentResume from "./pages/student/student_resume";
import StudentResearch from "./pages/student/student_research";
import StudentPatent from "./pages/student/student_patent";

// Admin pages
import AdminHome from "./pages/Admin/admin_home";
import AdminAI from "./pages/Admin/admin_ai";
import AdminChat from "./pages/Admin/admin_chat";
import AdminProjects from "./pages/Admin/admin_projects";
import AdminResearch from "./pages/Admin/admin_research";
import AdminPatent from "./pages/Admin/admin_patent";
import AdminStudents from "./pages/Admin/admin_students";
import AdminStudentProfile from "./pages/Admin/admin_student_profile";
import AdminPlacement from "./pages/Admin/admin_placement";
import AdminSaved from "./pages/Admin/admin_saved";

// Sales pages
import SalesAI from "./pages/Sales/sales_ai";
import SalesStudents from "./pages/Sales/sales_students";
import SalesStudentProfile from "./pages/Sales/sales_student_profile";

// Placement Cell pages
import PlacementHome from "./pages/placement_cell/placement_home";
import PlacementAI from "./pages/placement_cell/placement_ai";
import PlacementChat from "./pages/placement_cell/placement_chat";
import PlacementStudentDatabase from "./pages/placement_cell/placement_student_database";
import PlacementRecordsStudent from "./pages/placement_cell/placement_records_student";
import PlacementRecordsCompany from "./pages/placement_cell/placement_records_company";

// =========================
// HELPER FUNCTIONS
// =========================
function getHomeRouteByUserType(userType) {
  switch (userType) {
    case "admin":
      return "/admin/ai";
    case "sales":
      return "/sales/ai";
    case "placementCell":
      return "/placement-cell/home";
    case "student":
    default:
      return "/student/home";
  }
}

// =========================
// PROTECTED ROUTE COMPONENT
// =========================
function ProtectedRoute({ children, allowedUserTypes = [] }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      const userType = localStorage.getItem("userType");

      if (!token) {
        console.warn("🚫 No token found – redirecting to login");
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS);

        if (response.data.authenticated) {
          // Restrict by user type
          if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(userType)) {
            console.warn(`🚫 Access denied for userType "${userType}"`);
            const homeRoute = getHomeRouteByUserType(userType);
            navigate(homeRoute, { replace: true });
            return;
          }

          // For students, check onboarding completion status
          if (userType === "student") {
            try {
              const profileResponse = await axios.get(API_ENDPOINTS.USER);
              const profileData = profileResponse.data;
              
              // Update stored onboarding status
              const onboardingCompleted = profileData.onboardingCompleted || false;
              localStorage.setItem("onboardingCompleted", onboardingCompleted ? "true" : "false");
              
              // If onboarding not complete and not on onboarding pages, redirect
              if (!onboardingCompleted && !location.pathname.startsWith("/onboarding")) {
                console.log("🔄 Onboarding incomplete - redirecting from ProtectedRoute");
                navigate("/onboarding/start", { replace: true });
                return;
              }
              
              // If onboarding is complete and user tries to access onboarding pages
              if (onboardingCompleted && location.pathname.startsWith("/onboarding")) {
                console.log("✅ Onboarding already complete - redirecting to home");
                navigate("/student/home", { replace: true });
                return;
              }
            } catch (error) {
              console.error("❌ Failed to fetch profile:", error);
              // On error, assume onboarding is incomplete
              localStorage.setItem("onboardingCompleted", "false");
              if (!location.pathname.startsWith("/onboarding")) {
                navigate("/onboarding/start", { replace: true });
                return;
              }
            }
          }

          setIsAuthenticated(true);
        } else {
          localStorage.clear();
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("❌ Auth check failed:", error);
        localStorage.clear();
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, allowedUserTypes, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// =========================
// PUBLIC ROUTE COMPONENT
// =========================
function PublicRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      const userType = localStorage.getItem("userType");

      if (!token) {
        setLoading(false);
        setShouldRender(true);
        return;
      }

      try {
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS);
        if (response.data.authenticated) {
          if (userType === "student") {
            try {
              const profileResponse = await axios.get(API_ENDPOINTS.USER);
              const profileData = profileResponse.data;
              
              const onboardingCompleted = profileData.onboardingCompleted || false;
              localStorage.setItem("onboardingCompleted", onboardingCompleted ? "true" : "false");
              
              if (!onboardingCompleted) {
                console.log("🔄 Onboarding incomplete - redirecting from PublicRoute");
                navigate("/onboarding/start", { replace: true });
                return;
              }
            } catch (error) {
              console.error("❌ Failed to fetch profile:", error);
              navigate("/onboarding/start", { replace: true });
              return;
            }
          }

          const homeRoute = getHomeRouteByUserType(userType);
          console.log(`🔄 Redirecting authenticated ${userType} to ${homeRoute}`);
          navigate(homeRoute, { replace: true });
        } else {
          localStorage.clear();
          setLoading(false);
          setShouldRender(true);
        }
      } catch (error) {
        console.error("❌ Auth check failed in PublicRoute:", error);
        localStorage.clear();
        setLoading(false);
        setShouldRender(true);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!shouldRender) {
    return null;
  }

  return children;
}

// =========================
// APP ROUTES
// =========================
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><CarevoLanding /></PublicRoute>} />
      <Route path="/about-team" element={<PublicRoute><AboutTeam /></PublicRoute>} />
      <Route path="/product" element={<PublicRoute><Product /></PublicRoute>} />
      <Route path="/pricing" element={<PublicRoute><Pricing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      {/* Onboarding Routes - Only for students */}
      <Route
        path="/onboarding/start"
        element={<ProtectedRoute allowedUserTypes={["student"]}><OnboardingStart /></ProtectedRoute>}
      />
      <Route
        path="/onboarding/experience"
        element={<ProtectedRoute allowedUserTypes={["student"]}><OnboardingExperience /></ProtectedRoute>}
      />
      <Route
        path="/onboarding/certifications"
        element={<ProtectedRoute allowedUserTypes={["student"]}><OnboardingCertifications /></ProtectedRoute>}
      />
      <Route
        path="/onboarding/projects"
        element={<ProtectedRoute allowedUserTypes={["student"]}><OnboardingProjects /></ProtectedRoute>}
      />
      <Route
        path="/onboarding/skills"
        element={<ProtectedRoute allowedUserTypes={["student"]}><OnboardingSkills /></ProtectedRoute>}
      />
      <Route
        path="/onboarding/tech-stack"
        element={<ProtectedRoute allowedUserTypes={["student"]}><OnboardingTechStack /></ProtectedRoute>}
      />
      <Route
        path="/onboarding/ai-tools"
        element={<ProtectedRoute allowedUserTypes={["student"]}><OnboardingAITools /></ProtectedRoute>}
      />

      {/* Student Routes */}
      <Route
        path="/student/home"
        element={<ProtectedRoute allowedUserTypes={["student"]}><StudentHome /></ProtectedRoute>}
      />
      <Route
        path="/student/ai"
        element={<ProtectedRoute allowedUserTypes={["student"]}><StudentAI /></ProtectedRoute>}
      />
      <Route
        path="/student/chat"
        element={<ProtectedRoute allowedUserTypes={["student"]}><StudentChat /></ProtectedRoute>}
      />
      <Route
        path="/student/psychometric"
        element={<ProtectedRoute allowedUserTypes={["student"]}><StudentPsychometric /></ProtectedRoute>}
      />
      <Route
        path="/student/psychometric-quiz"
        element={<ProtectedRoute allowedUserTypes={["student"]}><StudentPsychometricQuiz /></ProtectedRoute>}
      />
      <Route
        path="/student/psychometric-result"
        element={<ProtectedRoute allowedUserTypes={["student"]}><StudentPsychometricResult /></ProtectedRoute>}
      />
      <Route
        path="/student/projects"
        element={<ProtectedRoute allowedUserTypes={["student"]}><StudentProjects /></ProtectedRoute>}
      />
      <Route
        path="/student/placement"
        element={<ProtectedRoute allowedUserTypes={["student"]}><StudentPlacement /></ProtectedRoute>}
      />
      <Route
        path="/student/resume"
        element={<ProtectedRoute allowedUserTypes={["student"]}><StudentResume /></ProtectedRoute>}
      />
      <Route
        path="/student/research"
        element={<ProtectedRoute allowedUserTypes={["student"]}><StudentResearch /></ProtectedRoute>}
      />
      <Route
        path="/student/patent"
        element={<ProtectedRoute allowedUserTypes={["student"]}><StudentPatent /></ProtectedRoute>}
      />

      {/* Admin Routes */}
      <Route
        path="/admin/home"
        element={<ProtectedRoute allowedUserTypes={["admin"]}><AdminHome /></ProtectedRoute>}
      />
      <Route
        path="/admin/ai"
        element={<ProtectedRoute allowedUserTypes={["admin"]}><AdminAI /></ProtectedRoute>}
      />
      <Route
        path="/admin/chat"
        element={<ProtectedRoute allowedUserTypes={["admin"]}><AdminChat /></ProtectedRoute>}
      />
      <Route
        path="/admin/projects"
        element={<ProtectedRoute allowedUserTypes={["admin"]}><AdminProjects /></ProtectedRoute>}
      />
      <Route
        path="/admin/research"
        element={<ProtectedRoute allowedUserTypes={["admin"]}><AdminResearch /></ProtectedRoute>}
      />
      <Route
        path="/admin/patent"
        element={<ProtectedRoute allowedUserTypes={["admin"]}><AdminPatent /></ProtectedRoute>}
      />
      <Route
        path="/admin/students"
        element={<ProtectedRoute allowedUserTypes={["admin"]}><AdminStudents /></ProtectedRoute>}
      />
      <Route
        path="/admin/students/:studentId"
        element={<ProtectedRoute allowedUserTypes={["admin"]}><AdminStudentProfile /></ProtectedRoute>}
      />
      <Route
        path="/admin/placement"
        element={<ProtectedRoute allowedUserTypes={["admin"]}><AdminPlacement /></ProtectedRoute>}
      />
      <Route
        path="/admin/saved"
        element={<ProtectedRoute allowedUserTypes={["admin"]}><AdminSaved /></ProtectedRoute>}
      />

      {/* Sales Routes */}
      <Route
        path="/sales/ai"
        element={<ProtectedRoute allowedUserTypes={["sales"]}><SalesAI /></ProtectedRoute>}
      />
      <Route
        path="/sales/students"
        element={<ProtectedRoute allowedUserTypes={["sales"]}><SalesStudents /></ProtectedRoute>}
      />
      <Route
        path="/sales/students/:studentId"
        element={<ProtectedRoute allowedUserTypes={["sales"]}><SalesStudentProfile /></ProtectedRoute>}
      />

      {/* Placement Cell Routes */}
      <Route
        path="/placement-cell/home"
        element={<ProtectedRoute allowedUserTypes={["placementCell"]}><PlacementHome /></ProtectedRoute>}
      />
      <Route
        path="/placement-cell/ai"
        element={<ProtectedRoute allowedUserTypes={["placementCell"]}><PlacementAI /></ProtectedRoute>}
      />
      <Route
        path="/placement-cell/chat"
        element={<ProtectedRoute allowedUserTypes={["placementCell"]}><PlacementChat /></ProtectedRoute>}
      />
      <Route
        path="/placement-cell/student-database"
        element={<ProtectedRoute allowedUserTypes={["placementCell"]}><PlacementStudentDatabase /></ProtectedRoute>}
      />
      <Route
        path="/placement-cell/records/students"
        element={<ProtectedRoute allowedUserTypes={["placementCell"]}><PlacementRecordsStudent /></ProtectedRoute>}
      />
      <Route
        path="/placement-cell/records/companies"
        element={<ProtectedRoute allowedUserTypes={["placementCell"]}><PlacementRecordsCompany /></ProtectedRoute>}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// =========================
// MAIN APP COMPONENT
// =========================
export default function App() {
  useEffect(() => {
    setupAxiosInterceptors();
    console.log("✅ Carevo App initialized");
    console.log(
      "🔡 API Base:",
      API_ENDPOINTS.AUTH_STATUS.replace("/api/auth/status", "")
    );
  }, []);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}