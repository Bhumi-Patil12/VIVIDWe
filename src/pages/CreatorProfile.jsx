import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react"; // Added useEffect

export default function CreatorProfile() {
  const { user } = useUser();

  // 1. Move the state INSIDE the component
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [role, setRole] = useState("");

  // 2. Sync profile image once Clerk successfully loads the user data
  useEffect(() => {
    if (user?.imageUrl) {
      setProfileImage(user.imageUrl);
    }
  }, [user]);

  const creativeRoles = [
    "Artist", "Photographer", "Videographer", "Video Editor", 
    "Graphic Designer", "Illustrator", "Animator", "Content Creator", 
    "Influencer", "Musician", "Singer", "Dancer", "Actor", 
    "Writer", "Fashion Designer", "Makeup Artist"
  ];

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Fixed the broken static URL structure to a standard Google Maps link
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

  const saveProfile = () => {
    const profile = {
      name: user?.fullName,
      username: user?.username,
      bio,
      role,
      location,
      mapUrl,
      profileImage,
    };

    localStorage.setItem("creatorProfile", JSON.stringify(profile));
    alert("Profile saved successfully!");
  };

  // Optional: Prevent flash of empty UI while Clerk is loading
  if (!user) {
    return <div className="text-center py-10">Loading profile details...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-6 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        
        <div className="flex items-center gap-5 mb-8 border-b pb-6">
          <div className="flex flex-col items-center">
  {/* The relative container acts as our positioning anchor */}
  <label className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer group border-2 border-gray-200 shadow-sm block">
    
    {/* Profile Image */}
    <img
      src={profileImage || "https://via.placeholder.com/150"}
      alt="Profile"
      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
    />

    {/* The Overlay Content inside the circle */}
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <span className="text-white text-xs font-medium text-center px-2">
        Change Photo
      </span>
    </div>

    {/* Hidden File Input */}
    <input
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          setProfileImage(URL.createObjectURL(file));
        }
      }}
    />
  </label>
</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
            <p className="text-gray-500 text-sm mt-1">{user?.fullName}</p>
          </div>
        </div>

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

        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-3">Location</h2>
          <button
            onClick={getLocation}
            className="bg-green-600 text-white px-5 py-3 rounded-xl mb-4"
          >
            Use Current Location
          </button>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your city, state, country"
            className="w-full border rounded-xl p-4"
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

        <button
          onClick={saveProfile}
          className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700"
        >
          Save Profile
        </button>

      </div>
    </div>
  );
}