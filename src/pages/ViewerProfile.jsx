import { useUser, useSession } from "../auth";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ViewerProfile() {
  const { user } = useUser();
  const { session } = useSession();

  const profileRoleLabel = "Viewer";
  const heroTitle = "Viewer profile";
  const heroSubtitle = "Find creators, follow their work, and connect with talent that fits your needs.";
  const statusText = "Browse creator profiles and discover active talent.";

  const [profileImage, setProfileImage] = useState(user?.imageUrl || "");
  const [showAvatars, setShowAvatars] = useState(false); 
  const [bio, setBio] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (!user || !session) return;
      try {
        const username = user.username || user.primaryEmailAddress?.localPart || "";
        const response = await fetch(`http://localhost:5000/api/profile/${username}`);
        const result = await response.json();
        if (result.success && result.data) {
          setBio(result.data.bio || "");
          setLocationValue(result.data.location || "");
          setMapUrl(result.data.map_url || "");
          setProfileImage(result.data.profile_image || user.imageUrl || "");
        } else {
          setProfileImage(user.imageUrl || "");
        }
      } catch (error) {
        console.error("Failed to load existing profile:", error);
        setProfileImage(user.imageUrl || "");
      }
    };
    fetchExistingProfile();
  }, [user, session]);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setMapUrl(`http://googleusercontent.com/maps.google.com/${lat},${lng}`);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        setLocationValue(data.display_name || "Location found");
      } catch {
        setLocationValue("Unable to fetch address");
      }
    }, () => alert("Location access denied"));
  };

  const saveProfile = async () => {
    if (!user || !session) return;
    if (!bio.trim()) { alert("Please fill out your bio before saving!"); return; }
    setIsSaving(true);
    try {
      const token = await session.getToken();
      const profileData = {
        username: user.username || user.primaryEmailAddress?.localPart || "user",
        fullName: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        bio,
        role: "viewer",
        location: locationValue,
        mapUrl,
        profileImage,
      };
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(profileData),
      });
      const result = await response.json();
      if (result.success) alert("🎉 Success! Viewer profile successfully saved!");
    } catch (error) {
      console.error(error);
    } finally { setIsSaving(false); }
  };

  if (!user) return <div className="text-center py-10">Loading profile details...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-100 to-fuchsia-100 py-8 px-4">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Hero Section */}
        <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            
            {/* Left Side */}
            <div className="flex items-center gap-5">
              <div className="h-28 w-28 rounded-[28px] border border-slate-200 overflow-hidden shadow-sm group relative cursor-pointer">
                <img src={profileImage || "/avatars/avatar1.png"} alt="Profile" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <button type="button" onClick={() => setShowAvatars(true)} className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900">Edit Avatar</button>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">{heroTitle}</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">{user?.fullName || user?.username}</h1>
                <p className="mt-2 text-sm text-slate-600">{user?.primaryEmailAddress?.emailAddress}</p>
                <div className="mt-4 inline-flex rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{profileRoleLabel}</div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-col sm:flex-row items-center gap-4 min-w-[240px] lg:w-auto">
              <Link
                to="/"
                className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition active:scale-95"
              >
                 Go to Home
              </Link>

              <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 w-full sm:w-auto min-w-[180px]">
                <p className="text-sm text-slate-500">Current status</p>
                <p className="mt-2 text-base font-semibold text-slate-900">Ready to explore</p>
              </div>
            </div>

          </div>
          <p className="mt-8 text-slate-600 max-w-2xl">{heroSubtitle}</p>
        </div>

        {/* Content Layout */}
        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-xl">
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Share your creative story</h2>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows="4" placeholder="Tell us what type of creators you'd like to discover..." className="mt-6 min-h-[160px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>

          <div className="space-y-6">
            <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-xl">
              <h2 className="text-2xl font-semibold text-slate-900">Preferred location</h2>
              <button type="button" onClick={getLocation} className="mt-5 w-full rounded-3xl bg-gradient-to-r from-cyan-500 to-sky-600 px-5 py-4 text-white font-semibold">Use current location</button>
              <input type="text" value={locationValue} onChange={(e) => setLocationValue(e.target.value)} placeholder="City, state, country" className="mt-5 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>
        </section>

        {/* Avatar Modal */}
        {showAvatars && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-[520px] rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-bold">Choose Avatar</h2><button onClick={() => setShowAvatars(false)} className="text-2xl font-bold">×</button></div>
              <div className="grid grid-cols-4 gap-4">
                {["/avatars/avatar1.png", "/avatars/avatar2.png", "/avatars/avatar3.png", "/avatars/avatar4.png", "/avatars/avatar5.png", "/avatars/avatar6.png", "/avatars/avatar7.png", "/avatars/avatar8.png"].map((avatar) => (
                  <img key={avatar} src={avatar} alt="avatar" onClick={() => { setProfileImage(avatar); setShowAvatars(false); }} className="h-24 w-24 cursor-pointer rounded-full border-2 border-transparent hover:border-blue-500 object-cover" />
                ))}
              </div>
            </div>
          </div>
        )}

        <button onClick={saveProfile} disabled={isSaving} className="w-full rounded-[32px] bg-gradient-to-r from-slate-900 via-blue-700 to-cyan-600 px-8 py-5 text-xl font-semibold text-white">{isSaving ? "Saving..." : "Save profile"}</button>
      </div>
    </div>
  );
}