import { useUser, useSession } from "../auth";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// स्टाइलिंग क्लासेस
const heroCardClasses = "rounded-[40px] border border-slate-200 bg-white p-8 shadow-xl";
const heroIconClasses = "h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg";
const accentTextClass = "text-fuchsia-600";

export default function CreatorProfile() {
  const { user } = useUser();
  const { session } = useSession();
  
  // स्टेट्स
  const [profileImage, setProfileImage] = useState(user?.imageUrl || "");
  const [showAvatars, setShowAvatars] = useState(false); 
  const [bio, setBio] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [creatorSkill, setCreatorSkill] = useState(""); 
  const [isSaving, setIsSaving] = useState(false);

  const heroTitle = "Creator Profile";
  const profileRoleLabel = "Creator";

  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (!user || !session) return;

      try {
        const username = user.username || user.primaryEmailAddress?.localPart || "";
        const response = await fetch(`http://localhost:5000/api/profile/${username}`);
        const result = await response.json();

        if (result.success && result.data) {
          setBio(result.data.bio || "");
          setCreatorSkill(result.data.role || "");
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
  }, [user, session]);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMapUrl(`http://googleusercontent.com/maps.google.com/${lat},${lng}`);

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

    if (!bio.trim() || !creatorSkill) {
      alert("Please fill out your bio and choose your specific skill before saving!");
      return;
    }

    setIsSaving(true);
    try {
      const token = await session.getToken();

      const profileData = {
        username: user.username || user.primaryEmailAddress?.localPart || "user",
        fullName: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        bio: bio || "",
        role: creatorSkill || "creator", 
        location: locationValue || "",
        mapUrl: mapUrl || "",
        profileImage: profileImage || "",
        companyName: null,
        companyEmail: null,
        companyWebsite: null,
        hiringMember: null,
        recruiterVerified: false
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
        alert("🎉 Success! Creator profile successfully saved!");
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
        
        {/* Hero Section */}
        <div className={heroCardClasses}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            
            {/* Left Side: Avatar, Name, Email and Badge */}
            <div className="flex items-center gap-5">
              <div className={`${heroIconClasses} group relative cursor-pointer`}>
                <img
                  src={profileImage || "/avatars/avatar1.png"}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => setShowAvatars(true)}
                    className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900"
                  >
                    Edit Avatar
                  </button>
                </div>
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

            {/* Right Side: Go to Home Button */}
            <div className="lg:self-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition active:scale-95"
              >
                 Go to Home
              </Link>
            </div>

          </div>
        </div>

        {/* Form Content Section */}
        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          {/* Left Column: Bio & Contact */}
          <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${accentTextClass}`}>About your profile</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">Describe your creative work</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{profileRoleLabel}</span>
            </div>
            
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="4"
              placeholder="Describe your work, style, and the kind of opportunities you're looking for."
              className="mt-6 min-h-[160px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100"
            />

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Contact Me</p>
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || ""}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-all active:scale-[0.98]"
              >
                Contact Creator
              </a>
            </div>
          </div>

          {/* Right Column: Location & Profile Role Dropdown */}
          <div className="space-y-6">
            {/* Location Card */}
            <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-xl">
              <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${accentTextClass}`}>Location</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Preferred location</h2>
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

            {/* Profile Skill Card */}
            <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-xl">
              <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${accentTextClass}`}>Profile role</p>
              <select
                value={creatorSkill}
                onChange={(e) => setCreatorSkill(e.target.value)}
                className="mt-4 w-full rounded-2xl border border-slate-200 p-3 bg-white text-slate-900 outline-none border-slate-300 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100"
              >
                <option value="">Select Skill</option>
                <option value="Singer">Singer</option>
                <option value="Dancer">Dancer</option>
                <option value="Actor">Actor</option>
                <option value="Photographer">Photographer</option>
                <option value="Video Editor">Video Editor</option>
                <option value="Graphic Designer">Graphic Designer</option>
                <option value="Writer">Writer</option>
                <option value="Influencer">Influencer</option>
                <option value="Content Creator">Content Creator</option>
              </select>
              <p className="mt-4 text-sm text-slate-600">
                This is the role recruiters see when they discover your profile.
              </p>
            </div>
          </div>
        </section>

        {/* Avatar Modal */}
        {showAvatars && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-[520px] rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold">Choose Avatar</h2>
                <button
                  onClick={() => setShowAvatars(false)}
                  className="text-2xl font-bold text-slate-500 hover:text-slate-800"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {[
                  "/avatars/avatar1.png",
                  "/avatars/avatar2.png",
                  "/avatars/avatar3.png",
                  "/avatars/avatar4.png",
                  "/avatars/avatar5.png",
                  "/avatars/avatar6.png",
                  "/avatars/avatar7.png",
                  "/avatars/avatar8.png",
                ].map((avatar) => (
                  <img
                    key={avatar}
                    src={avatar}
                    alt="avatar"
                    onClick={() => {
                      setProfileImage(avatar);
                      setShowAvatars(false);
                    }}
                    className="h-24 w-24 cursor-pointer rounded-full border-2 border-transparent object-cover hover:border-blue-500"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={saveProfile}
          disabled={isSaving}
          className="w-full rounded-[32px] bg-gradient-to-r from-slate-900 via-violet-700 to-fuchsia-600 px-8 py-5 text-xl font-semibold text-white hover:scale-[1.01] transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving profile..." : "Save profile"}
        </button>

      </div>
    </div>
  );
}