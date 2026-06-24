import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../auth"; // Aapka explicit authentication hook

export default function DashboardWrapper() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const routeUserByRole = async () => {
      if (!user) return;

      try {
        const username = user.username || user.primaryEmailAddress?.localPart || "";
        
        // 1. Backend API se profile check karenge (Purana User Check)
        const response = await fetch(`http://localhost:5000/api/profile/${username}`);
        const result = await response.json();

        if (result.success && result.data && result.data.actualRole) {
          // Case A: User purana hai aur DB mein role mil gaya
          redirectByRole(result.data.actualRole);
        } else {
          // Case B: Naya user hai, DB mein entry nahi h, localStorage check karo
          const localRole = localStorage.getItem("selectedRole");
          if (localRole) {
            redirectByRole(localRole);
          } else {
            // Agar kuch nahi mila toh fallback to ChooseRole page
            navigate("/choose-role", { replace: true });
          }
        }
      } catch (error) {
        console.error("Error routing user:", error);
        // Network fail hone par local storage fallback
        const localRole = localStorage.getItem("selectedRole");
        if (localRole) redirectByRole(localRole);
      } finally {
        setLoading(false);
      }
    };

    const redirectByRole = (role) => {
      if (role === "recruiter") {
        navigate("/recruiter-profile", { replace: true });
      } else if (role === "viewer") {
        navigate("/viewer-profile", { replace: true });
      } else {
        // Default handles "creator" or skill strings like "Singer", "Actor" etc.
        navigate("/creator-profile", { replace: true });
      }
    };

    routeUserByRole();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 font-medium">Setting up your profile pipeline...</p>
        </div>
      </div>
    );
  }

  return null;
}