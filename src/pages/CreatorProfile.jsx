import { useUser, useSession } from "@clerk/clerk-react"; 
import { useState, useEffect } from "react";

export default function CreatorProfile() {
  const { user } = useUser();
  const { session } = useSession(); // Access user sessions to pull JWT keys

 const [profileImage, setProfileImage] = useState(user?.imageUrl || "");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [role, setRole] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const creativeRoles = [
    "Artist", "Photographer", "Videographer", "Video Editor",
    "Graphic Designer", "Illustrator", "Animator", "Content Creator",
    "Influencer", "Musician", "Singer", "Dancer", "Actor",
    "Writer", "Fashion Designer", "Makeup Artist",
  ];

  const avatars = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Kevin",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=Sophie",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Lilou",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Jack"
];

  // Sync profile details from Clerk AND fetch existing data from local MySQL
  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (!user || !session) return;

      try {
        // 1. Get the username to query the database
        const username = user.username || user.primaryEmailAddress?.localPart || "";
        
        // 2. Request profile details from your Express public API endpoint
        const response = await fetch(`http://localhost:5000/api/profile/${username}`);
        const result = await response.json();

        // 3. If a profile exists in MySQL, populate your React states with it!
        // 3. If a profile exists in MySQL, populate your React states with it!
if (result.success && result.data) {
  setBio(result.data.bio || "");
  setRole(result.data.role || "");
  setLocation(result.data.location || "");
  setMapUrl(result.data.map_url || "");
  
  // 📸 THE FIX: Use your saved database image URL if it exists, otherwise fall back to your live Clerk avatar
  setProfileImage(result.data.profile_image || user.imageUrl || "");
} else {
  // Fallback to live Clerk avatar image if no database record exists yet
  setProfileImage(user.imageUrl || "");
}
      } catch (error) {
        console.error("Failed to load existing profile from database:", error);
        setProfileImage(user.imageUrl || "");
      }
    };

    fetchExistingProfile();
  }, [user, session]);

  // Fetches current latitude and longitude values
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMapUrl(`https://www.google.com/maps?q=${lat},${lng}`);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          setLocation(data.display_name || "Location found");
        } catch (error) {
          setLocation("Unable to fetch address");
        }
      },
      () => {
        alert("Location access denied");
      }
    );
  };

  // Connects Frontend form values right into the running Node/Express SQL engine
  const saveProfile = async () => {
    if (!user || !session) return;

    // 🛑 Prevent saving if essential fields are empty
    if (!bio.trim() || !role) {
      alert("Please fill out your bio and choose a creative role before saving!");
      return;
    }

    setIsSaving(true);
    try {
      const token = await session.getToken();

      const profileData = {
        username: user.username || user.primaryEmailAddress?.localPart || "user",
        fullName: user.fullName || "",
        bio,
        role,
        location,
        mapUrl,
        profileImage: profileImage || avatars[Math.floor(Math.random() * avatars.length)], // Use uploaded image or random avatar
      };

      // Transmit payload to local Express Server
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-6 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        
        {/* Profile Image Circle Section */}
       {/* Profile & Avatar Grid Grid Picker Section */}
<div className="mb-8 border-b pb-6">
  <div className="flex items-center gap-6 mb-6">
    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 shadow-md bg-gray-50 flex-shrink-0">
      <img
        src={profileImage || "https://via.placeholder.com/150"}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    </div>
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        {user?.username || user.primaryEmailAddress?.localPart}
      </h1>
      <p className="text-gray-500 text-sm mt-1">{user?.fullName}</p>
      <p className="text-xs bg-blue-100 text-blue-700 font-medium px-2.5 py-1 rounded-full mt-2 inline-block">
        Click an avatar below to update your look
      </p>
    </div>
  </div>

  {/* Curated Avatar Grid List */}
  <h3 className="text-sm font-semibold text-gray-600 mb-3">Select Your Avatar</h3>
  <div className="grid grid-cols-6 gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
    {avatars.map((avatarUrl, idx) => (
      <button
        key={idx}
        onClick={() => setProfileImage(avatarUrl)}
        className={`relative rounded-xl overflow-hidden bg-white border-2 p-1 transition-all duration-200 hover:scale-105 hover:shadow-sm ${
          profileImage === avatarUrl ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
        }`}
      >
        <img src={avatarUrl} alt={`Avatar option ${idx + 1}`} className="w-full h-auto aspect-square rounded-lg" />
        {profileImage === avatarUrl && (
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] w-4 h-4 rounded-bl-lg flex items-center justify-center font-bold">
            ✓
          </div>
        )}
      </button>
    ))}
  </div>
</div>
        {/* Bio Section */}
        <div className="mb-8">
          <h2 className="font-medium text-base mb-2 text-gray-700">About Me</h2>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="2"
            placeholder="Tell people about your work..."
            className="w-full border border-gray-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Roles Section */}
        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-4">Choose Your Creative Role</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {creativeRoles.map((item) => (
              <button
                key={item}
                onClick={() => setRole(item)}
                className={`p-3 text-sm rounded-xl border text-center transition ${
                  role === item
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white hover:border-blue-400"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          {role && <p className="mt-4 text-blue-600 font-medium">Selected: {role}</p>}
        </div>

        {/* Location Section */}
        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-3">Location</h2>
          <button
            onClick={getLocation}
            className="bg-green-600 text-white px-5 py-3 rounded-xl mb-4 hover:bg-green-700 transition"
          >
            Use Current Location
          </button>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your city, state, country"
            className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="block mt-3 text-blue-600 hover:underline"
            >
              View on Google Maps →
            </a>
          )}
        </div>

        {/* Submit Action Button */}
        <button
          onClick={saveProfile}
          disabled={isSaving}
          className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {isSaving ? "Saving...." : "Save Profile"}
        </button>

      </div>
    </div>
  );
}