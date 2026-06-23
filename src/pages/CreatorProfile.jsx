import { useUser, useSession } from "../auth";
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mockCompanyAIValidation(name, email) {
  const normalizedName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  const domain = (email.split("@")[1] || "").split(".")[0].toLowerCase();
  return normalizedName.length > 4 && emailPattern.test(email) && (normalizedName.includes(domain) || normalizedName.length > 6);
}

export default function CreatorProfile() {
  const { user } = useUser();
  const { session } = useSession();
  const routerLocation = useLocation();
  const params = new URLSearchParams(routerLocation.search);
  const selectedRole = params.get("role") || localStorage.getItem("selectedRole") || "recruiter";
  const profileTypeLabel = selectedRole === "recruiter" ? "Recruiter Dashboard" : selectedRole === "viewer" ? "Viewer Profile" : "Creator Profile";
  const profileRoleLabel = selectedRole === "recruiter" ? "Recruiter" : selectedRole === "viewer" ? "Viewer" : "Creator";
  const heroTitle = selectedRole === "recruiter" ? "Recruiter profile" : selectedRole === "viewer" ? "Viewer profile" : "Creator profile";
  const heroSubtitle = selectedRole === "recruiter"
    ? "Manage your hiring profile and verify your company to attract talented creators."
    : selectedRole === "viewer"
    ? "Find creators, follow their work, and connect with talent that fits your needs."
    : "Showcase your projects, add your story, and let recruiters discover your talent.";
  const heroCardClasses = selectedRole === "recruiter"
    ? "rounded-[40px] border border-slate-200 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl"
    : "rounded-[40px] border border-slate-200 bg-white p-8 shadow-xl";
  const accentTextClass = selectedRole === "recruiter" ? "text-fuchsia-600" : "text-blue-600";
  const heroIconClasses = selectedRole === "recruiter"
    ? "h-28 w-28 rounded-[28px] border border-slate-200 bg-gradient-to-br from-violet-400 via-fuchsia-500 to-rose-400 overflow-hidden shadow-xl"
    : "h-28 w-28 rounded-[28px] border border-slate-200 bg-slate-50 overflow-hidden shadow-sm";
  const statusText = selectedRole === "recruiter"
    ? "Verify company details to boost creator trust."
    : selectedRole === "viewer"
    ? "Browse creator profiles and discover active talent."
    : "Keep your bio updated so recruiters can find you.";

  const [profileImage, setProfileImage] = useState(user?.imageUrl || "");
  const [bio, setBio] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [role, setRole] = useState(selectedRole);
  const [isSaving, setIsSaving] = useState(false);
  const [companyName, setCompanyName] = useState(localStorage.getItem("companyName") || "");
  const [companyEmail, setCompanyEmail] = useState(localStorage.getItem("companyEmail") || "");
  const [companyWebsite, setCompanyWebsite] = useState(localStorage.getItem("companyWebsite") || "");
  const [hiringMember, setHiringMember] = useState(localStorage.getItem("hiringMember") || "");
  const [recruiterVerified, setRecruiterVerified] = useState(localStorage.getItem("recruiterVerified") === "true");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const completionPercent = useMemo(() => {
    if (selectedRole !== "recruiter") return 100;
    let score = 0;
    if (companyName.trim()) score += 1;
    if (emailPattern.test(companyEmail)) score += 1;
    if (companyWebsite.trim()) score += 1;
    if (hiringMember.trim()) score += 1;
    if (bio.trim()) score += 1;
    if (locationValue.trim()) score += 1;
    if (recruiterVerified) score += 1;
    return Math.round((score / 7) * 100);
  }, [selectedRole, companyName, companyEmail, companyWebsite, hiringMember, bio, locationValue, recruiterVerified]);

  const recruiterStatus = useMemo(() => {
    if (selectedRole !== "recruiter") return "Complete";
    if (completionPercent === 100) return "Verified and complete";
    if (!recruiterVerified) return "Waiting for AI verification";
    return "Details entered, more profile details needed";
  }, [selectedRole, completionPercent, recruiterVerified]);

  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (!user || !session) return;

      try {
        const username = user.username || user.primaryEmailAddress?.localPart || "";
        const response = await fetch(`http://localhost:5000/api/profile/${username}`);
        const result = await response.json();

        if (result.success && result.data) {
          setBio(result.data.bio || "");
          setRole(result.data.role || selectedRole);
          setLocationValue(result.data.location || "");
          setMapUrl(result.data.map_url || "");
          setProfileImage(result.data.profile_image || user.imageUrl || "");
        } else {
          setProfileImage(user.imageUrl || "");
        }
      } catch (error) {
        console.error("Failed to load existing profile from database:", error);
        setProfileImage(user.imageUrl || "");
      }
    };

    fetchExistingProfile();
  }, [user, session, selectedRole]);

  useEffect(() => {
    if (selectedRole === "recruiter") {
      localStorage.setItem("companyName", companyName);
      localStorage.setItem("companyEmail", companyEmail);
      localStorage.setItem("companyWebsite", companyWebsite);
      localStorage.setItem("hiringMember", hiringMember);
      localStorage.setItem("recruiterVerified", recruiterVerified ? "true" : "false");
    }
  }, [companyName, companyEmail, companyWebsite, hiringMember, recruiterVerified, selectedRole]);

  const verifyCompanyWithAI = async () => {
    if (!companyName.trim() || !companyEmail.trim() || !hiringMember.trim()) {
      setVerificationMessage("Enter your recruiter details first, then run AI company verification.");
      return;
    }

    setIsVerifying(true);
    setVerificationMessage("");
    await new Promise((resolve) => setTimeout(resolve, 900));

    const valid = mockCompanyAIValidation(companyName, companyEmail);
    setRecruiterVerified(valid);
    localStorage.setItem("recruiterVerified", valid ? "true" : "false");
    setVerificationMessage(
      valid
        ? "AI verification succeeded. This company appears valid and your recruiter profile is stronger."
        : "AI verification could not confirm this company. Please verify your company info and try again."
    );
    setIsVerifying(false);
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMapUrl(`https://www.google.com/maps?q=${lat},${lng}`);

        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await response.json();
          setLocationValue(data.display_name || "Location found");
        } catch (error) {
          setLocationValue("Unable to fetch address");
        }
      },
      () => {
        alert("Location access denied");
      }
    );
  };

  const saveProfile = async () => {
    if (!user || !session) return;

    if (!bio.trim() || !role) {
      alert("Please fill out your bio and choose a profile role before saving!");
      return;
    }

    if (selectedRole === "recruiter" && completionPercent < 100) {
      alert("Your recruiter profile is not yet 100% complete. Verify the company in your profile to finish.");
    }

    setIsSaving(true);
    try {
      const token = await session.getToken();
      const profileData = {
        username: user.username || user.primaryEmailAddress?.localPart || "user",
        fullName: user.fullName || "",
        bio,
        role,
        location: locationValue,
        mapUrl,
        profileImage: profileImage || "",
        companyName: selectedRole === "recruiter" ? companyName : undefined,
        companyEmail: selectedRole === "recruiter" ? companyEmail : undefined,
        companyWebsite: selectedRole === "recruiter" ? companyWebsite : undefined,
        hiringMember: selectedRole === "recruiter" ? hiringMember : undefined,
        recruiterVerified: selectedRole === "recruiter" ? recruiterVerified : undefined,
      };

      const response = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();

      if (result.success) {
        alert("🎉 Success! Profile successfully saved into your local MySQL database!");
      } else {
        alert("Server validation error: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to the backend pipeline. Make sure your node server is running!");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return <div className="text-center py-10">Loading profile details...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-100 to-fuchsia-100 py-8 px-4">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className={heroCardClasses}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className={heroIconClasses}>
                <img src={profileImage || "https://via.placeholder.com/256"} alt="Profile" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${accentTextClass}`}>{heroTitle}</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">{user?.fullName || user?.username || profileRoleLabel}</h1>
                <p className="mt-2 text-sm text-slate-600">{user?.primaryEmailAddress?.emailAddress || `${user?.username || "demo"}@example.com`}</p>
                <div className="mt-4 inline-flex rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                  {profileRoleLabel}
                </div>
              </div>
            </div>

            <div className="grid w-full gap-4 sm:grid-cols-2 lg:w-auto">
              <div className={`rounded-3xl p-5 shadow-xl ${selectedRole === "recruiter" ? "bg-gradient-to-br from-fuchsia-600 to-purple-600 text-white" : "bg-white border border-slate-200 text-slate-900"}`}>
                <p className={`text-sm ${selectedRole === "recruiter" ? "text-slate-200" : "text-slate-500"}`}>Profile strength</p>
                <p className="mt-4 text-4xl font-semibold">{completionPercent}%</p>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Current status</p>
                <p className="mt-4 text-base font-semibold text-slate-900">{selectedRole === "recruiter" ? recruiterStatus : "Ready to explore"}</p>
                <p className="mt-3 text-sm text-slate-600">{statusText}</p>
              </div>
            </div>
          </div>
          <p className="mt-8 text-slate-600 max-w-2xl">{heroSubtitle}</p>
        </div>

        {selectedRole === "recruiter" && (
          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
            <section className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Company details</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">Recruiter account</h2>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${recruiterVerified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {recruiterVerified ? "Verified" : "Needs verification"}
                </span>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Company Name</p>
                  <p className="mt-2 text-base font-medium text-slate-900">{companyName || "Not provided"}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Company Email</p>
                  <p className="mt-2 text-base font-medium text-slate-900">{companyEmail || "Not provided"}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Website</p>
                  <p className="mt-2 text-base font-medium text-slate-900">{companyWebsite || "Not provided"}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Hiring Contact</p>
                  <p className="mt-2 text-base font-medium text-slate-900">{hiringMember || "Not provided"}</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  type="button"
                  onClick={verifyCompanyWithAI}
                  disabled={isVerifying}
                  className="w-full rounded-3xl bg-gradient-to-r from-slate-900 via-violet-700 to-fuchsia-600 px-6 py-4 text-base font-semibold text-white hover:scale-[1.01] transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isVerifying ? "Verifying company..." : "Verify company with AI"}
                </button>
                {verificationMessage && (
                  <div className={`rounded-3xl border px-5 py-4 text-sm ${recruiterVerified ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
                    {verificationMessage}
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[40px] border border-slate-200 bg-gradient-to-br from-slate-50 via-cyan-50 to-white p-8 shadow-xl">
              <h2 className="text-2xl font-semibold text-slate-900">Recruiter profile summary</h2>
              <p className="mt-3 text-slate-600">A verified recruiter profile helps creators trust your outreach and hire requests.</p>

              <div className="mt-6 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Profile completion</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{completionPercent}% complete</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Next steps</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li>• Verify your company to boost creator trust.</li>
                    <li>• Add a strong bio with your hiring focus.</li>
                    <li>• Save your profile so recruiters can contact you.</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        )}

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${accentTextClass}`}>About your profile</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">{selectedRole === "recruiter" ? "Tell creators who you are" : selectedRole === "viewer" ? "Find creators you love" : "Share your creative story"}</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{profileRoleLabel}</span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="4"
              placeholder={
                selectedRole === "recruiter"
                  ? "Describe your hiring needs, company culture, and the kind of creators you want to work with."
                  : selectedRole === "viewer"
                  ? "Tell us what type of creators you'd like to discover and why."
                  : "Describe your work, style, and the kind of opportunities you're looking for."
              }
              className="mt-6 min-h-[160px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100"
            />
          </div>

          <div className="space-y-6">
            <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-xl">
              <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${accentTextClass}`}>Location</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">{selectedRole === "recruiter" ? "Office location" : "Preferred location"}</h2>
              <button
                onClick={getLocation}
                className="mt-5 w-full rounded-3xl bg-gradient-to-r from-cyan-500 to-sky-600 px-5 py-4 text-base font-semibold text-white hover:scale-[1.01] transition"
              >
                Use current location
              </button>
              <input
                type="text"
                value={locationValue}
                onChange={(e) => setLocationValue(e.target.value)}
                placeholder="City, state, country"
                className="mt-5 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100"
              />
              {mapUrl && (
                <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-semibold text-fuchsia-600 hover:text-fuchsia-700 hover:underline">
                  View location on map
                </a>
              )}
            </div>

            <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-xl">
              <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${accentTextClass}`}>Profile role</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">{profileRoleLabel}</h2>
              <p className="mt-4 text-sm text-slate-600">
                {selectedRole === "recruiter"
                  ? "This is the role that creators will see on your public profile."
                  : selectedRole === "viewer"
                  ? "This helps us tailor creator suggestions and your browsing experience."
                  : "This is the role recruiters see when they discover your profile."}
              </p>
            </div>
          </div>
        </section>

        <button
          onClick={saveProfile}
          disabled={isSaving}
          className="w-full rounded-[32px] bg-gradient-to-r from-slate-900 via-violet-700 to-fuchsia-600 px-8 py-5 text-xl font-semibold text-white hover:scale-[1.01] transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving profile..." : selectedRole === "recruiter" ? "Save recruiter profile" : "Save profile"}
        </button>
      </div>
    </div>
  );
}
