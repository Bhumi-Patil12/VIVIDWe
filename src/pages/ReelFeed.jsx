import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ReelFeed = () => {
  const [reels, setReels] = useState([]);
  const navigate = useNavigate();

  // 1. Backend से रील्स डेटा फेच करना
  useEffect(() => {
    const fetchReels = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/reels"); 
        const data = await response.json();
        setReels(data);
      } catch (error) {
        console.error("Error fetching reels:", error);
      }
    };
    fetchReels();
  }, []);

  // 2. रील डिलीट करने का फंक्शन
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reels/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setReels(reels.filter((reel) => reel._id !== id));
      }
    } catch (error) {
      console.error("Error deleting reel:", error);
    }
  };

  return (
    <div style={styles.feedPage}>
      {/* टॉप हेडर बार */}
      <div style={styles.header}>
        <button onClick={() => navigate("/reels")} style={styles.backBtn}>
          ← Back to Studio
        </button>
        <h3 style={{ margin: 0 }}>Reels Feed</h3>
        <div style={{ width: "80px" }}></div>
      </div>

      {/* इंस्टाग्राम स्टाइल वर्टिकल स्क्रॉल कंटेनर */}
      <div style={styles.reelsContainer}>
        {reels.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "40px", color: "#cbd5e1" }}>
            No reels found. Upload some from the studio!
          </p>
        ) : (
          reels.map((reel) => (
            <div key={reel._id} style={styles.reelCard}>
              
              {/* वीडियो प्लेयर */}
              <video
                src={`http://localhost:5000/${reel.videoPath}`} 
                controls
                loop
                style={styles.videoPlayer}
              />

              {/* टेक्स्ट ओवरले (Title & Info) */}
              <div style={styles.overlay}>
                <h4 style={{ margin: "0 0 5px 0" }}>
                  {reel.title || "Database Loaded Content"}
                </h4>
                <p style={{ margin: 0, fontSize: "14px", color: "#cbd5e1" }}>
                  Record ID Reference: #{reel._id}
                </p>
              </div>

              {/* डिलीट बटन */}
              <button onClick={() => handleDelete(reel._id)} style={styles.deleteBtn}>
                Delete Reel
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// पूरी तरह से तैयार CSS इनलाइन स्टाइल्स
const styles = {
  feedPage: {
    backgroundColor: "#0b111e",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff",
    fontFamily: "sans-serif",
  },
  header: {
    width: "100%",
    maxWidth: "500px",
    padding: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #1e293b",
    boxSizing: "border-box",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#00bcd4",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  reelsContainer: {
    width: "100%",
    maxWidth: "450px",
    height: "calc(100vh - 60px)",
    overflowY: "scroll",
    scrollSnapType: "y mandatory",
    scrollbarWidth: "none",
  },
  reelCard: {
    width: "100%",
    height: "calc(100vh - 60px)",
    scrollSnapAlign: "start",
    position: "relative",
    background: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: "40px",
    left: "20px",
    right: "20px",
    background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
    padding: "15px",
    borderRadius: "8px",
    zIndex: 5,
  },
  deleteBtn: {
    position: "absolute",
    right: "20px",
    bottom: "40px",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    zIndex: 10,
  },
};

export default ReelFeed;