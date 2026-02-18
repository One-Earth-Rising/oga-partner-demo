import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ╔══════════════════════════════════════════════════════════════════════╗
// ║                                                                    ║
// ║   IP PARTNER CONFIGURATION                                         ║
// ║                                                                    ║
// ║   TO SET UP A NEW IP PARTNER:                                      ║
// ║                                                                    ║
// ║   1. Update PARTNER_INFO (name, badge text, email)                 ║
// ║   2. Update CHARACTERS array:                                      ║
// ║      - tileImage:   square action shot for grid (400×400+ px)      ║
// ║      - detailImage: character image for transformation arena       ║
// ║      - gameImages:  (optional) pre-rendered per-game art           ║
// ║   3. Update GAMES array (4 games for the selector)                 ║
// ║   4. Drop images into /public/images/ folder                       ║
// ║   5. Run: npm run build                                            ║
// ║   6. Deploy the /dist folder to Netlify                            ║
// ║                                                                    ║
// ║   IMAGE TIPS:                                                      ║
// ║   - Tile images should be square (or close to it)                  ║
// ║   - Transparent PNGs work great for detail images                  ║
// ║   - Use WebP for smaller file sizes                                ║
// ║   - Images in /public/ are served from the site root               ║
// ║     e.g. /public/images/tony.webp → /images/tony.webp              ║
// ║                                                                    ║
// ╚══════════════════════════════════════════════════════════════════════╝

const PARTNER_INFO = {
  name: "KELLOGG'S",
  badge: "KELLOGG'S × OGA™",
  contact: "PARTNERS@ONEEARTHRISING.COM",
  cta: "WANT TO ACTIVATE YOUR IP ACROSS MULTIPLE GAMES?",
};

// ─── CHARACTERS ────────────────────────────────────────────────────────
// Images go in /public/images/ — reference them as "/images/filename.ext"
//
// gameImages is OPTIONAL — when present for a game ID, shows the real
// pre-rendered art. When absent, CSS filters simulate the transformation.
// ────────────────────────────────────────────────────────────────────────

const CHARACTERS = [
  {
    id: "tony",
    name: "TONY THE TIGER",
    label: "Frosted Flakes",
    color: "#FF6B1A",
    tileImage: "/images/Tony/Tony The Tiger.png",
    detailImage: "/images/Tony/Tony The Tiger.png",    // Can use a different crop
    gameImages: {
      fortnite:  "/images/Tony/tony_fortnite.png",   // ← fully different image
    roblox:    "/images/Tony/tony_roblox.png",      // ← can be animated GIF
    minecraft: "/images/Tony/tony_minecraft.png",
    apex:      "/images/Tony/tony_apex.png",
    },
  },
  {
    id: "toucan",
    name: "TOUCAN SAM",
    label: "Froot Loops",
    color: "#E81C8B",
    tileImage: "/images/Tucan Sam.png",                          // → Replace: "/images/toucan-tile.png"
    detailImage: "/images/Tucan Sam.png",
    gameImages: {},
  },
  {
    id: "snap",
    name: "SNAP",
    label: "Rice Krispies",
    color: "#4ECBFF",
    tileImage: null,
    detailImage: null,
    gameImages: {},
  },
  {
    id: "digem",
    name: "DIG'EM FROG",
    label: "Honey Smacks",
    color: "#7ED321",
    tileImage: "/images/Dig'em Frog.png",
    detailImage: "/images/Dig'em Frog.png",
    gameImages: {},
  },
  {
    id: "cornelius",
    name: "CORNELIUS",
    label: "Corn Flakes",
    color: "#FFD700",
    tileImage: null,
    detailImage: null,
    gameImages: {},
  },
  {
    id: "buzz",
    name: "BUZZ BEE",
    label: "Honey Nut Cheerios",
    color: "#FFB800",
    tileImage: "/images/Buzz Bee.png",
    detailImage: "/images/Buzz Bee.png",
    gameImages: {},
  },
  {
    id: "coco",
    name: "COCO MONKEY",
    label: "Coco Pops",
    color: "#8B4513",
    tileImage: "/images/Coco Monkey.png",
    detailImage: "/images/Coco Monkey.png",
    gameImages: {},
  },
  {
    id: "crackle",
    name: "CRACKLE",
    label: "Rice Krispies",
    color: "#FF4444",
    tileImage: null,
    detailImage: null,
    gameImages: {},
  },
  {
    id: "pop",
    name: "POP",
    label: "Rice Krispies",
    color: "#9C27B0",
    tileImage: null,
    detailImage: null,
    gameImages: {},
  },
];

// ─── GAMES ─────────────────────────────────────────────────────────────
// 4 games positioned at top / right / bottom / left around the character.
// The "filter" is applied via CSS when no gameImages render exists.
// ────────────────────────────────────────────────────────────────────────

const GAMES = [
  {
    id: "fortnite",
    name: "FORTNITE",
    genre: "Battle Royale",
    color: "#7B2FBE",
    icon: "⚡",
    style: "Stylized 3D • Cel-Shaded",
    desc: "Cel-shaded with bold outlines and vibrant, stylized proportions",
    filter: "saturate(1.6) contrast(1.2) brightness(1.1) hue-rotate(-15deg)",
  },
  {
    id: "roblox",
    name: "ROBLOX",
    genre: "Sandbox",
    color: "#E2231A",
    icon: "🧊",
    style: "Blocky Voxel • Low-Poly",
    desc: "Simplified blocky geometry with flat colors and iconic proportions",
    filter: "saturate(0.6) contrast(1.4) brightness(1.05)",
  },
  {
    id: "minecraft",
    name: "MINECRAFT",
    genre: "Sandbox Survival",
    color: "#5D8C3E",
    icon: "⛏️",
    style: "Pixel Block • 16-Bit Voxel",
    desc: "Pixel-art textures on cubic geometry with limited color palettes",
    filter: "saturate(0.4) contrast(1.5) brightness(0.95) hue-rotate(-10deg)",
  },
  {
    id: "apex",
    name: "APEX LEGENDS",
    genre: "Hero Shooter",
    color: "#CD3333",
    icon: "🎯",
    style: "High-Fidelity • Realistic",
    desc: "Photorealistic rendering with detailed textures and realistic lighting",
    filter: "saturate(1.1) contrast(1.2) brightness(0.85) sepia(0.2)",
  },
];

// ╔══════════════════════════════════════════════════════════════════════╗
// ║  END OF CONFIGURATION — Everything below is engine code.           ║
// ║  You should not need to edit anything below this line.             ║
// ╚══════════════════════════════════════════════════════════════════════╝

// ─── BRAND TOKENS ──────────────────────────────────────────────────────
const B = {
  void: "#000000", charcoal: "#121212", neon: "#39FF14",
  white: "#FFFFFF", iron: "#2C2C2C",
};

// ─── CHAR IMAGE (renders real image or placeholder) ────────────────────
function CharImage({ src, name, color, size = 200, style: extra = {}, gameFilter = "none", gameId = null }) {
  if (src) {
    return (
      <div style={{ width: size, height: size, position: "relative", overflow: "hidden", borderRadius: 12, ...extra }}>
        <img src={src} alt={name} draggable={false} style={{
          width: "100%", height: "100%", objectFit: "cover",
          filter: gameFilter, transition: "filter 0.7s ease-in-out",
        }} />
        {gameId === "minecraft" && <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
          backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent ${Math.floor(size / 12)}px,rgba(0,0,0,.15) ${Math.floor(size / 12)}px,rgba(0,0,0,.15) ${Math.floor(size / 12) + 1}px),repeating-linear-gradient(90deg,transparent,transparent ${Math.floor(size / 12)}px,rgba(0,0,0,.15) ${Math.floor(size / 12)}px,rgba(0,0,0,.15) ${Math.floor(size / 12) + 1}px)`,
          imageRendering: "pixelated",
        }} />}
        {gameId === "fortnite" && <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
          boxShadow: "inset 0 0 0 3px rgba(123,47,190,.5)", borderRadius: 12,
        }} />}
        {gameId === "roblox" && <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
          boxShadow: "inset 0 0 0 4px rgba(255,255,255,.08)", borderRadius: 4,
        }} />}
      </div>
    );
  }
  // Placeholder
  return (
    <div style={{
      width: size, height: size, borderRadius: 12, overflow: "hidden",
      background: `linear-gradient(135deg, ${color}33, ${color}0d)`,
      border: `1px dashed ${color}44`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      filter: gameFilter, transition: "filter 0.7s ease-in-out", ...extra,
    }}>
      <div style={{ fontSize: size * .22, fontWeight: 900, color, opacity: .55, letterSpacing: ".04em", textAlign: "center", lineHeight: 1.1 }}>
        {name.split(" ").map(w => w[0]).join("")}
      </div>
      <div style={{ fontSize: Math.max(8, size * .05), color: `${color}88`, letterSpacing: ".15em", fontWeight: 700, marginTop: 6 }}>ADD IMAGE</div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("grid");
  const [selectedChar, setSelectedChar] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [hoveredTile, setHoveredTile] = useState(null);
  const [showUI, setShowUI] = useState(false);
  const [transforming, setTransforming] = useState(false);
  const [flash, setFlash] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => { setTimeout(() => setReady(true), 80); }, []);

  const handleCharSelect = useCallback((ch) => {
    setSelectedChar(ch); setSelectedGame(null); setView("loading"); setLoadProgress(0); setShowUI(false);
  }, []);

  useEffect(() => {
    if (view !== "loading") return;
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 14 + 5;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => setView("detail"), 250); }
      setLoadProgress(Math.min(p, 100));
    }, 100);
    return () => clearInterval(iv);
  }, [view]);

  useEffect(() => {
    if (view === "detail") { const t = setTimeout(() => setShowUI(true), 350); return () => clearTimeout(t); }
  }, [view]);

  const handleGameSelect = useCallback((game) => {
    if (transforming) return;
    setTransforming(true); setFlash(true);
    setTimeout(() => setFlash(false), 200);
    setTimeout(() => { setSelectedGame(game); setTransforming(false); }, 650);
  }, [transforming]);

  const handleBack = useCallback(() => {
    setView("grid"); setSelectedChar(null); setSelectedGame(null); setShowUI(false);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: B.void, color: B.white,
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      overflow: "hidden", position: "relative",
    }}>
      <Styles />
      {flash && <div className="flash-overlay" />}
      <div className="ambient-glow" />
      <Header onBack={view !== "grid" ? handleBack : null} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {view === "grid" && <GridView hoveredTile={hoveredTile} setHoveredTile={setHoveredTile} onSelect={handleCharSelect} ready={ready} />}
        {view === "loading" && selectedChar && <LoadingView character={selectedChar} progress={loadProgress} />}
        {view === "detail" && selectedChar && <DetailView character={selectedChar} selectedGame={selectedGame} onGameSelect={handleGameSelect} showUI={showUI} transforming={transforming} />}
      </div>
    </div>
  );
}

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────
function Styles() {
  return <style>{`
    *{box-sizing:border-box;margin:0;padding:0}
    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes flashOut{from{opacity:.35}to{opacity:0}}
    @keyframes pulseGlow{0%,100%{opacity:.35}50%{opacity:.7}}
    @keyframes scanline{from{transform:translateY(-100%)}to{transform:translateY(100vh)}}
    @keyframes tileIn{from{opacity:0;transform:scale(.85) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
    @keyframes particleFly{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}
    @keyframes ringExpand{0%{transform:translate(-50%,-50%) scale(.3);opacity:1}100%{transform:translate(-50%,-50%) scale(2.2);opacity:0}}
    @keyframes charReveal{0%{transform:scale(.65);opacity:0;filter:blur(8px)}60%{transform:scale(1.04);opacity:1;filter:blur(0)}100%{transform:scale(1);filter:blur(0)}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
    .flash-overlay{position:fixed;inset:0;z-index:100;background:white;animation:flashOut .3s ease-out forwards;pointer-events:none}
    .ambient-glow{position:fixed;top:-20%;left:50%;transform:translateX(-50%);width:100vw;height:60vh;background:radial-gradient(ellipse,${B.neon}06 0%,transparent 70%);pointer-events:none;z-index:0}
    body{overflow-x:hidden}
  `}</style>;
}

// ─── HEADER ────────────────────────────────────────────────────────────
function Header({ onBack }) {
  const [hb, setHb] = useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 28px", borderBottom: `1px solid ${B.iron}`,
      position: "sticky", top: 0, zIndex: 50,
      background: `${B.void}dd`, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {onBack && (
          <button onClick={onBack} onMouseEnter={() => setHb(true)} onMouseLeave={() => setHb(false)}
            style={{
              background: "none", border: `1px solid ${hb ? B.neon : B.iron}`,
              color: hb ? B.neon : B.white,
              padding: "6px 14px", borderRadius: 8, cursor: "pointer",
              fontSize: 11, fontWeight: 700, letterSpacing: ".08em", transition: "all .2s",
            }}>← BACK</button>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: B.charcoal, border: `1px solid ${B.iron}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 900, letterSpacing: ".04em",
          }}>OGA</div>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".06em" }}>OWNABLE GAME ASSETS</span>
        </div>
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "4px 13px", borderRadius: 20,
        border: `1px solid ${B.neon}33`, background: `${B.neon}08`,
        fontSize: 9, letterSpacing: ".18em", fontWeight: 800, color: B.neon,
      }}>
        <span style={{
          width: 5, height: 5, borderRadius: "50%", background: B.neon,
          boxShadow: `0 0 8px ${B.neon}`, animation: "blink 2s infinite",
        }} />
        IP PARTNER DEMO
      </div>
    </div>
  );
}

// ─── GRID VIEW ─────────────────────────────────────────────────────────
function GridView({ hoveredTile, setHoveredTile, onSelect, ready }) {
  return (
    <div style={{ padding: "28px 28px 70px", maxWidth: 960, margin: "0 auto" }}>
      <div style={{
        textAlign: "center", marginBottom: 36,
        opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(12px)",
        transition: "all .55s ease-out",
      }}>
        <div style={{ fontSize: 10, letterSpacing: ".3em", color: B.neon, fontWeight: 800, marginBottom: 8 }}>
          PARTNER IP SHOWCASE
        </div>
        <h1 style={{
          fontSize: "clamp(24px,4.5vw,46px)", fontWeight: 900,
          letterSpacing: "-.01em", lineHeight: 1.08, marginBottom: 12, textTransform: "uppercase",
        }}>
          ONE CHARACTER.<br /><span style={{ color: B.neon }}>INFINITE WORLDS.</span>
        </h1>
        <p style={{ color: "#777", fontSize: 13, maxWidth: 440, margin: "0 auto", lineHeight: 1.65 }}>
          Select a character to see how OGA™ technology transforms them across multiple game engines — instantly.
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 28 }}>
        <div style={{ height: 1, flex: 1, maxWidth: 90, background: `linear-gradient(to right,transparent,${B.iron})` }} />
        <div style={{ padding: "4px 16px", borderRadius: 20, border: `1px solid ${B.iron}`, fontSize: 9, letterSpacing: ".2em", fontWeight: 800, color: "#666" }}>
          {PARTNER_INFO.badge}
        </div>
        <div style={{ height: 1, flex: 1, maxWidth: 90, background: `linear-gradient(to left,transparent,${B.iron})` }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, maxWidth: 620, margin: "0 auto" }}>
        {CHARACTERS.map((ch, i) => (
          <TileCard key={ch.id} character={ch} index={i} ready={ready}
            isHovered={hoveredTile === ch.id}
            onHover={() => setHoveredTile(ch.id)}
            onLeave={() => setHoveredTile(null)}
            onClick={() => onSelect(ch)}
          />
        ))}
      </div>

      <div style={{
        textAlign: "center", marginTop: 36, padding: 24,
        border: `1px solid ${B.iron}`, borderRadius: 16, background: `${B.charcoal}88`,
      }}>
        <p style={{ color: "#666", fontSize: 11, letterSpacing: ".12em", marginBottom: 5 }}>{PARTNER_INFO.cta}</p>
        <p style={{ color: B.neon, fontSize: 15, fontWeight: 800, letterSpacing: ".06em" }}>{PARTNER_INFO.contact}</p>
      </div>
    </div>
  );
}

// ─── TILE CARD ─────────────────────────────────────────────────────────
function TileCard({ character: ch, index, ready, isHovered, onHover, onLeave, onClick }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top) / r.height - .5) * -10,
      y: ((e.clientX - r.left) / r.width - .5) * 10,
    });
  };

  return (
    <div ref={ref}
      onMouseMove={e => { handleMove(e); onHover(); }}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); onLeave(); }}
      onClick={onClick}
      style={{
        position: "relative", aspectRatio: "1", borderRadius: 14, overflow: "hidden",
        cursor: "pointer",
        border: `1px solid ${isHovered ? ch.color + "55" : B.iron}`,
        background: B.charcoal,
        transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.04 : 1})`,
        transition: "transform .12s ease-out, border-color .25s, box-shadow .25s",
        boxShadow: isHovered
          ? `0 0 28px ${ch.color}22, 0 14px 36px rgba(0,0,0,.5)`
          : "0 4px 14px rgba(0,0,0,.3)",
        animation: ready ? `tileIn .45s ease-out ${index * .055}s both` : "none",
      }}>

      {ch.tileImage ? (
        <img src={ch.tileImage} alt={ch.name} draggable={false} style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", transition: "transform .35s ease-out",
          transform: isHovered ? "scale(1.08)" : "scale(1)",
        }} />
      ) : (
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${ch.color}22, ${ch.color}0a)`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          transition: "transform .35s", transform: isHovered ? "scale(1.06)" : "scale(1)",
        }}>
          <div style={{ fontSize: 42, fontWeight: 900, color: `${ch.color}55`, letterSpacing: ".04em" }}>
            {ch.name.split(" ").map(w => w[0]).join("")}
          </div>
          <div style={{ fontSize: 7, color: `${ch.color}66`, letterSpacing: ".15em", fontWeight: 700, marginTop: 4 }}>ADD IMAGE</div>
        </div>
      )}

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 8px 8px",
        background: `linear-gradient(to top, ${B.void}ee, ${B.void}88, transparent)`,
        textAlign: "center", zIndex: 3,
      }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".1em", textShadow: "0 1px 4px rgba(0,0,0,.8)" }}>{ch.name}</div>
        <div style={{ fontSize: 7, letterSpacing: ".14em", color: ch.color, fontWeight: 600, marginTop: 2 }}>{ch.label.toUpperCase()}</div>
      </div>

      {isHovered && (
        <div style={{
          position: "absolute", top: 7, right: 7, zIndex: 5,
          padding: "3px 9px", borderRadius: 8,
          background: `${B.neon}18`, border: `1px solid ${B.neon}55`,
          fontSize: 7, fontWeight: 800, letterSpacing: ".14em", color: B.neon,
          animation: "fadeIn .15s ease-out",
        }}>ACTIVATE</div>
      )}

      <div style={{
        position: "absolute", top: 7, left: 7, width: 5, height: 5, borderRadius: "50%",
        background: isHovered ? B.neon : B.iron,
        boxShadow: isHovered ? `0 0 8px ${B.neon}` : "none",
        transition: "all .25s", zIndex: 5,
      }} />
    </div>
  );
}

// ─── LOADING VIEW ──────────────────────────────────────────────────────
function LoadingView({ character: ch, progress }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", padding: 40 }}>
      <div style={{ position: "relative", width: 180, height: 180, marginBottom: 24 }}>
        <svg width="180" height="180" viewBox="0 0 180 180" style={{ animation: "spin 3s linear infinite" }}>
          <circle cx="90" cy="90" r="82" fill="none" stroke={B.iron} strokeWidth="1.5" />
          <circle cx="90" cy="90" r="82" fill="none" stroke={B.neon} strokeWidth="2.5"
            strokeDasharray={`${progress * 5.15} ${515 - progress * 5.15}`}
            strokeLinecap="round" style={{ transition: "stroke-dasharray .1s" }} />
        </svg>
        <div style={{
          position: "absolute", inset: 24, display: "flex", alignItems: "center", justifyContent: "center",
          animation: "float 2s ease-in-out infinite", borderRadius: 12, overflow: "hidden",
        }}>
          <CharImage src={ch.detailImage || ch.tileImage} name={ch.name} color={ch.color} size={120} />
        </div>
      </div>
      <div style={{ fontSize: 10, letterSpacing: ".25em", fontWeight: 800, color: B.neon, marginBottom: 10 }}>INITIALIZING GAME ENGINES</div>
      <div style={{ width: 240, height: 2, borderRadius: 1, background: B.iron, overflow: "hidden", marginBottom: 12 }}>
        <div style={{
          height: "100%", borderRadius: 1,
          background: `linear-gradient(90deg,${B.neon},${ch.color})`,
          width: `${progress}%`, transition: "width .1s", boxShadow: `0 0 10px ${B.neon}66`,
        }} />
      </div>
      <div style={{ fontSize: 9, color: "#555", letterSpacing: ".1em" }}>PREPARING {ch.name} FOR CROSS-GAME DEPLOYMENT</div>
      <div style={{ marginTop: 18, display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
        {GAMES.map((g, i) => (
          <div key={g.id} style={{
            fontSize: 8, letterSpacing: ".1em", fontWeight: 700,
            color: progress > (i + 1) * 20 ? g.color : "#333",
            transition: "color .3s", display: "flex", alignItems: "center", gap: 3,
          }}>
            <span style={{
              width: 4, height: 4, borderRadius: "50%",
              background: progress > (i + 1) * 20 ? g.color : "#333",
              boxShadow: progress > (i + 1) * 20 ? `0 0 5px ${g.color}` : "none",
              transition: "all .3s",
            }} />
            {g.name}
          </div>
        ))}
      </div>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg,transparent,${B.neon}44,transparent)`,
        animation: "scanline 1.5s linear infinite", pointerEvents: "none",
      }} />
    </div>
  );
}

// ─── DETAIL VIEW ───────────────────────────────────────────────────────
function DetailView({ character: ch, selectedGame, onGameSelect, showUI, transforming }) {
  const [hoveredGame, setHoveredGame] = useState(null);

  const currentImage = selectedGame && ch.gameImages?.[selectedGame.id]
    ? ch.gameImages[selectedGame.id]
    : (ch.detailImage || ch.tileImage);
  const currentFilter = selectedGame && !ch.gameImages?.[selectedGame.id]
    ? selectedGame.filter : "none";
  const currentGameOverlay = selectedGame && !ch.gameImages?.[selectedGame.id]
    ? selectedGame.id : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px 60px", minHeight: "85vh" }}>
      {/* Title */}
      <div style={{
        textAlign: "center", marginBottom: 20,
        opacity: showUI ? 1 : 0, transform: showUI ? "translateY(0)" : "translateY(-8px)",
        transition: "all .45s ease-out",
      }}>
        <div style={{ fontSize: 9, letterSpacing: ".25em", color: ch.color, fontWeight: 800, marginBottom: 3 }}>{ch.label.toUpperCase()}</div>
        <h2 style={{ fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 900, letterSpacing: ".04em", textTransform: "uppercase" }}>{ch.name}</h2>
        {selectedGame && (
          <div style={{ marginTop: 5, fontSize: 10, letterSpacing: ".14em", color: selectedGame.color, fontWeight: 700, animation: "fadeUp .35s ease-out" }}>
            {selectedGame.icon} {selectedGame.style.toUpperCase()}
          </div>
        )}
      </div>

      {/* Arena */}
      <div style={{ position: "relative", width: "min(520px, 88vw)", height: "min(520px, 88vw)" }}>
        <div style={{ position: "absolute", inset: "12%", border: `1px solid ${B.iron}33`, borderRadius: "50%" }} />
        <div style={{ position: "absolute", inset: "28%", border: `1px dashed ${B.iron}22`, borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: "50%", left: "12%", right: "12%", height: 1, background: `${B.iron}22` }} />
        <div style={{ position: "absolute", left: "50%", top: "12%", bottom: "12%", width: 1, background: `${B.iron}22` }} />

        {/* Center character */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 10 }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: 280, height: 280, borderRadius: "50%",
            background: `radial-gradient(circle, ${selectedGame ? selectedGame.color + "22" : ch.color + "15"} 0%, transparent 70%)`,
            transition: "background .6s", animation: "pulseGlow 3s ease-in-out infinite",
          }} />

          <div style={{
            width: 160, height: 180, borderRadius: 18, background: B.charcoal, position: "relative", overflow: "hidden",
            border: `2px solid ${selectedGame ? selectedGame.color + "88" : B.iron}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .5s ease-out, border-color .3s",
            boxShadow: selectedGame
              ? `0 0 40px ${selectedGame.color}33, 0 0 80px ${selectedGame.color}11`
              : `0 0 20px ${ch.color}15`,
            transform: transforming ? "scale(.82) rotate(3deg)" : "scale(1) rotate(0deg)",
            animation: showUI ? "charReveal .55s ease-out" : "none",
          }}>
            <div style={{
              transition: "all .5s ease-in-out",
              transform: transforming ? "scale(.55) rotate(-5deg)" : "scale(1) rotate(0deg)",
              opacity: transforming ? .3 : 1,
            }}>
              <CharImage src={currentImage} name={ch.name} color={ch.color} size={150}
                gameFilter={currentFilter} gameId={currentGameOverlay} style={{ borderRadius: 14 }} />
            </div>

            {selectedGame && !transforming && (
              <div style={{
                position: "absolute", bottom: 8, padding: "3px 10px", borderRadius: 8,
                background: selectedGame.color, color: B.white,
                fontSize: 7, fontWeight: 800, letterSpacing: ".1em",
                animation: "fadeUp .3s ease-out", boxShadow: `0 2px 8px ${selectedGame.color}66`,
              }}>{selectedGame.icon} {selectedGame.name}</div>
            )}
          </div>

          {transforming && <ParticleBurst color={selectedGame?.color || B.neon} />}
          {transforming && (
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              width: 100, height: 100, borderRadius: "50%",
              border: `2px solid ${selectedGame?.color || B.neon}`,
              animation: "ringExpand .55s ease-out forwards", pointerEvents: "none",
            }} />
          )}
        </div>

        {/* Game selectors */}
        {GAMES.map((game, i) => {
          const isSelected = selectedGame?.id === game.id;
          const isHover = hoveredGame === game.id;
          const angle = i * 90 - 90;
          const rad = angle * Math.PI / 180;
          const r = 42;
          const x = 50 + Math.cos(rad) * r;
          const y = 50 + Math.sin(rad) * r;

          return (
            <div key={game.id} style={{
              position: "absolute", left: `${x}%`, top: `${y}%`,
              transform: "translate(-50%,-50%)", zIndex: 15,
              opacity: showUI ? 1 : 0, transition: `all .35s ease-out ${i * .07}s`,
            }}
              onMouseEnter={() => setHoveredGame(game.id)}
              onMouseLeave={() => setHoveredGame(null)}
              onClick={() => onGameSelect(game)}
            >
              <svg style={{
                position: "absolute", top: "50%", left: "50%",
                width: 200, height: 200, transform: "translate(-50%,-50%)",
                pointerEvents: "none", zIndex: -1,
                opacity: isSelected ? .55 : isHover ? .25 : 0, transition: "opacity .3s",
              }}>
                <line x1="100" y1="100"
                  x2={100 + Math.cos(rad + Math.PI) * 80}
                  y2={100 + Math.sin(rad + Math.PI) * 80}
                  stroke={game.color} strokeWidth="1.5" strokeDasharray="4 4" />
              </svg>

              <div style={{
                padding: "11px 18px", borderRadius: 13,
                background: isSelected ? `${game.color}15` : B.charcoal,
                border: `1px solid ${isSelected ? game.color : isHover ? game.color + "66" : B.iron}`,
                cursor: "pointer", textAlign: "center", transition: "all .2s",
                transform: isHover && !isSelected ? "scale(1.06)" : "scale(1)",
                boxShadow: isSelected
                  ? `0 0 22px ${game.color}28, inset 0 0 18px ${game.color}08`
                  : isHover ? `0 0 12px ${game.color}18` : "none",
                minWidth: 100,
              }}>
                <div style={{ fontSize: 15, marginBottom: 2 }}>{game.icon}</div>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".1em", color: isSelected ? game.color : B.white }}>{game.name}</div>
                <div style={{ fontSize: 7, color: "#555", letterSpacing: ".08em", marginTop: 1 }}>{game.genre.toUpperCase()}</div>
                {isSelected && (
                  <div style={{
                    marginTop: 4, fontSize: 6.5, letterSpacing: ".1em",
                    color: game.color, fontWeight: 600,
                    borderTop: `1px solid ${game.color}33`, paddingTop: 3,
                  }}>{game.style.toUpperCase()}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info panel */}
      {showUI && (
        <div style={{
          maxWidth: 480, width: "100%", marginTop: 14, padding: 20, borderRadius: 14,
          border: `1px solid ${B.iron}`, background: `${B.charcoal}bb`,
          textAlign: "center", animation: "fadeUp .45s ease-out .15s both",
        }}>
          {selectedGame ? (
            <>
              <p style={{ fontSize: 12, color: "#aaa", lineHeight: 1.65, marginBottom: 8 }}>
                <span style={{ color: ch.color, fontWeight: 700 }}>{ch.name}</span> transformed into{" "}
                <span style={{ color: selectedGame.color, fontWeight: 700 }}>{selectedGame.name}</span> style. {selectedGame.desc}.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", fontSize: 8, letterSpacing: ".1em", color: B.neon, fontWeight: 600 }}>
                <span>✓ MODEL CONVERTED</span><span>✓ TEXTURES ADAPTED</span><span>✓ ANIMATIONS MAPPED</span>
              </div>
            </>
          ) : (
            <p style={{ fontSize: 12, color: "#777", lineHeight: 1.6 }}>
              Select a game to see how <span style={{ color: ch.color, fontWeight: 700 }}>{ch.name}</span> transforms.
              Each conversion is powered by OGA™ cross-engine technology.
            </p>
          )}
        </div>
      )}

      {showUI && (
        <div style={{
          marginTop: 14, padding: "14px 24px", borderRadius: 12,
          background: `${B.neon}0a`, border: `1px solid ${B.neon}33`,
          textAlign: "center", animation: "fadeUp .45s ease-out .3s both",
        }}>
          <p style={{ fontSize: 10, letterSpacing: ".14em", color: B.neon, fontWeight: 800 }}>
            WANT TO ACTIVATE {ch.name} IN MULTIPLE GAMES?
          </p>
          <p style={{ fontSize: 8, color: "#555", marginTop: 3, letterSpacing: ".1em" }}>{PARTNER_INFO.contact}</p>
        </div>
      )}
    </div>
  );
}

// ─── PARTICLES ─────────────────────────────────────────────────────────
function ParticleBurst({ color }) {
  const particles = useMemo(() => Array.from({ length: 22 }, (_, i) => {
    const a = (i / 22) * Math.PI * 2 + (Math.random() - .5) * .5;
    const d = 45 + Math.random() * 75;
    return { tx: Math.cos(a) * d, ty: Math.sin(a) * d, size: 2 + Math.random() * 4.5, delay: Math.random() * .1 };
  }), []);

  return <>
    {particles.map((p, i) => (
      <div key={i} style={{
        position: "absolute", top: "50%", left: "50%",
        width: p.size, height: p.size, borderRadius: "50%",
        background: i % 3 === 0 ? B.neon : color,
        boxShadow: `0 0 5px ${color}`,
        "--tx": `${p.tx}px`, "--ty": `${p.ty}px`,
        animation: `particleFly .5s ease-out ${p.delay}s forwards`,
        pointerEvents: "none",
      }} />
    ))}
  </>;
}
