import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const defaultReels = [
  {
    id: 1,
    title: "Launch Day Spotlight",
    creator: "Aisha",
    description: "A crisp creative reel spotlighting a product launch and design process.",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    poster: "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 2,
    title: "Motion Storyboard",
    creator: "Rohit",
    description: "A fast-paced motion reel showing concept art, animation and polish.",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
    poster: "https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 3,
    title: "Brand Reel",
    creator: "Maya",
    description: "A storyboard-style reel presenting a brand campaign and team collaboration.",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    poster: "https://images.pexels.com/photos/892757/pexels-photo-892757.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

export default function Reels() {
  const [reels, setReels] = useState(() => {
    const stored = window.localStorage.getItem("vividweReels");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultReels;
      }
    }
    return defaultReels;
  });
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    window.localStorage.setItem("vividweReels", JSON.stringify(reels));
  }, [reels]);

  const handleAddReel = (event) => {
    event.preventDefault();
    if (!title.trim() || !creator.trim() || !videoUrl.trim()) {
      return;
    }

    const newReel = {
      id: Date.now(),
      title: title.trim(),
      creator: creator.trim(),
      description: description.trim() || "A fresh creator reel showcasing creative work.",
      videoUrl: videoUrl.trim(),
      poster: "https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=800",
    };

    setReels([newReel, ...reels]);
    setTitle("");
    setCreator("");
    setVideoUrl("");
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <nav className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <Link to="/" className="text-2xl font-bold tracking-tight text-cyan-300 hover:text-white transition">
              VIVIDWe Reels
            </Link>
            <p className="mt-2 text-sm text-slate-400">Browse creator reels or add your own demo reel instantly.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/" className="rounded-full border border-cyan-500 px-5 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-600/20 transition">
              Home
            </Link>
            <Link to="/signup?role=creator" className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition">
              Create Reel
            </Link>
          </div>
        </nav>

        <header className="mt-10 rounded-[32px] border border-cyan-500/20 bg-slate-900/80 p-10 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-400">Creator showcase</p>
              <h1 className="mt-4 text-5xl font-bold text-white">Explore creator reels in one place.</h1>
              <p className="mt-6 max-w-2xl leading-8 text-slate-300">
                Discover demo reels shared by creators, add your own visual story, and build a gallery of stunning creative work.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/signup?role=creator" className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-4 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition">
                  Add your first reel
                </Link>
                <a href="#reel-feed" className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-4 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition">
                  Jump to reel feed
                </a>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {reels.slice(0, 2).map((reel) => (
                <div key={reel.id} className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-xl">
                  <video
                    src={reel.videoUrl}
                    poster={reel.poster}
                    controls
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-white">{reel.title}</h2>
                    <p className="mt-2 text-sm text-slate-400">{reel.creator}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </header>

        <main className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6 rounded-[32px] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-cyan-500/10">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-400">Your reel studio</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Add a reel and share it with the community.</h2>
              <p className="mt-3 text-slate-400">
                Fill out the form to publish a reel to the site. Your demo reel will appear instantly in the feed and stay in your browser storage.
              </p>
            </div>
            <form onSubmit={handleAddReel} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-200">Reel Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Crafting a motion brand story"
                  className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-200">Creator Name</label>
                <input
                  value={creator}
                  onChange={(e) => setCreator(e.target.value)}
                  placeholder="Aisha Patel"
                  className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-200">Video URL</label>
                <input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-200">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A quick reel showing concept, edit, and final motion visuals."
                  className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  rows="4"
                />
              </div>
              <button className="w-full rounded-3xl bg-cyan-500 px-6 py-4 text-base font-semibold text-slate-950 hover:bg-cyan-400 transition">
                Publish reel
              </button>
            </form>
          </section>

          <section className="space-y-6" id="reel-feed">
            <div className="rounded-[32px] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-400">Reel feed</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Live creator reels</h2>
              <p className="mt-3 text-slate-400">Watch demo reels shared by creators and explore new visual ideas.</p>
            </div>
            <div className="grid gap-6">
              {reels.map((reel) => (
                <article key={reel.id} className="overflow-hidden rounded-[32px] border border-slate-800 bg-slate-900/95 shadow-xl">
                  <video
                    src={reel.videoUrl}
                    poster={reel.poster}
                    controls
                    className="h-72 w-full bg-black object-cover"
                  />
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h3 className="text-2xl font-semibold text-white">{reel.title}</h3>
                        <p className="mt-2 text-sm text-slate-400">By {reel.creator}</p>
                      </div>
                      <span className="rounded-full bg-cyan-500/15 px-4 py-2 text-sm text-cyan-200">New reel</span>
                    </div>
                    <p className="mt-4 text-slate-300">{reel.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
