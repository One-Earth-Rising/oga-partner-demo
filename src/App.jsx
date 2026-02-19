import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ╔══════════════════════════════════════════════════════════════════════╗
// ║  IP PARTNER CONFIGURATION                                          ║
// ╚══════════════════════════════════════════════════════════════════════╝

const PARTNER_INFO = {
  name: "KELLOGG'S",
  badge: "KELLOGG'S × OGA™",
  contact: "PARTNERS@ONEEARTHRISING.COM",
  cta: "WANT TO ACTIVATE YOUR IP ACROSS MULTIPLE GAMES?",
};

const CHARACTERS = [
  { id: "tony", name: "TONY THE TIGER", label: "Frosted Flakes", color: "#FF6B1A", tileImage: "/images/Tony/Tony The Tiger.png", detailImage: "/images/Tony/Tony The Tiger.png", gameImages: { apex: "/images/Tony/tony_apex.png", fortnite: "/images/Tony/tony_fortnite.png", minecraft: "/images/Tony/tony_minecraft.png", roblox: "/images/Tony/tony_roblox.png" } },
  { id: "toucan", name: "TOUCAN SAM", label: "Froot Loops", color: "#E81C8B", tileImage: "/images/Toucan/Toucan Sam.png", detailImage: "/images/Toucan/Toucan Sam.png", gameImages: { apex: "/images/Toucan/toucan_apex.png", fortnite: "/images/Toucan/toucan_fortnite.png", minecraft: "/images/Toucan/toucan_minecraft.png", roblox: "/images/Toucan/toucan_roblox.png" } },
  { id: "snap", name: "SNAP", label: "Rice Krispies", color: "#4ECBFF", tileImage: null, detailImage: null, gameImages: {} },
  { id: "digem", name: "DIG'EM FROG", label: "Honey Smacks", color: "#7ED321", tileImage: null, detailImage: null, gameImages: {} },
  { id: "cornelius", name: "CORNELIUS", label: "Corn Flakes", color: "#FFD700", tileImage: null, detailImage: null, gameImages: {} },
  { id: "buzz", name: "BUZZ BEE", label: "Honey Nut Cheerios", color: "#FFB800", tileImage: "/images/Buzz/Buzz Bee.png", detailImage: "/images/Buzz/Buzz Bee.png", gameImages: { apex: "/images/Buzz/buzz_apex.png", fortnite: "/images/Buzz/buzz_fortnite.png", minecraft: "/images/Buzz/buzz_minecraft.png", roblox: "/images/Buzz/buzz_roblox.png" } },
  { id: "coco", name: "COCO MONKEY", label: "Coco Pops", color: "#8B4513", tileImage: null, detailImage: null, gameImages: {} },
  { id: "crackle", name: "CRACKLE", label: "Rice Krispies", color: "#FF4444", tileImage: null, detailImage: null, gameImages: {} },
  { id: "pop", name: "POP", label: "Rice Krispies", color: "#9C27B0", tileImage: null, detailImage: null, gameImages: {} },
];

const GAMES = [
  { id: "fortnite", name: "FORTNITE", genre: "Battle Royale", color: "#7B2FBE", icon: "⚡", style: "Stylized 3D • Cel-Shaded", desc: "Cel-shaded with bold outlines and vibrant, stylized proportions", filter: "saturate(1.6) contrast(1.2) brightness(1.1) hue-rotate(-15deg)" },
  { id: "roblox", name: "ROBLOX", genre: "Sandbox", color: "#E2231A", icon: "🧊", style: "Blocky Voxel • Low-Poly", desc: "Simplified blocky geometry with flat colors and iconic proportions", filter: "saturate(0.6) contrast(1.4) brightness(1.05)" },
  { id: "animal_crossing", name: "ANIMAL CROSSING", genre: "Life Simulation", color: "#5D8C3E", icon: "⛏️", style: "Cozy • Miniature Chibi", desc: "Softly lit, rounded geometry with warm color palettes and a miniature, toy-box aesthetic", filter: "saturate(0.4) contrast(1.5) brightness(0.95) hue-rotate(-10deg)" },
  { id: "crash", name: "CRASH BANDICOOT", genre: "3D Platformer", color: "#CD3333", icon: "🎯", style: "Zany Cartoon • Exaggerated", desc: "Vibrant, stylized environments with exaggerated character proportions, dynamic angles, and squash-and-stretch animations", filter: "saturate(1.1) contrast(1.2) brightness(0.85) sepia(0.2)" },
];

// ╔══════════════════════════════════════════════════════════════════════╗
// ║  END OF CONFIGURATION                                              ║
// ╚══════════════════════════════════════════════════════════════════════╝

const B = { void: "#000000", charcoal: "#121212", neon: "#39FF14", white: "#FFFFFF", iron: "#2C2C2C" };

function CharImage({ src, name, color, size = 200, style: extra = {}, gameFilter = "none", gameId = null }) {
  if (src) {
    return (
      <div style={{ width: size, height: size, position: "relative", overflow: "hidden", borderRadius: 16, ...extra }}>
        <img src={src} alt={name} draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", filter: gameFilter, transition: "filter 0.7s ease-in-out" }} />
        {gameId === "minecraft" && <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2, backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent ${Math.floor(size/10)}px,rgba(0,0,0,.18) ${Math.floor(size/10)}px,rgba(0,0,0,.18) ${Math.floor(size/10)+1}px),repeating-linear-gradient(90deg,transparent,transparent ${Math.floor(size/10)}px,rgba(0,0,0,.18) ${Math.floor(size/10)}px,rgba(0,0,0,.18) ${Math.floor(size/10)+1}px)` }} />}
        {gameId === "fortnite" && <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2, boxShadow: "inset 0 0 0 3px rgba(123,47,190,.5)", borderRadius: 16 }} />}
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: 16, overflow: "hidden", background: `linear-gradient(135deg, ${color}33, ${color}0d)`, border: `1px dashed ${color}44`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", filter: gameFilter, transition: "filter 0.7s ease-in-out", ...extra }}>
      <div style={{ fontSize: size*.22, fontWeight: 900, color, opacity: .55 }}>{name.split(" ").map(w=>w[0]).join("")}</div>
      <div style={{ fontSize: Math.max(8,size*.045), color: `${color}88`, letterSpacing: ".15em", fontWeight: 700, marginTop: 6 }}>ADD IMAGE</div>
    </div>
  );
}

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
  const handleCharSelect = useCallback((ch) => { setSelectedChar(ch); setSelectedGame(null); setView("loading"); setLoadProgress(0); setShowUI(false); }, []);
  useEffect(() => { if (view !== "loading") return; let p = 0; const iv = setInterval(() => { p += Math.random()*14+5; if(p>=100){p=100;clearInterval(iv);setTimeout(()=>setView("detail"),250)} setLoadProgress(Math.min(p,100)); },100); return ()=>clearInterval(iv); }, [view]);
  useEffect(() => { if (view === "detail") { const t = setTimeout(() => setShowUI(true), 300); return () => clearTimeout(t); } }, [view]);
  const handleGameSelect = useCallback((game) => { if(transforming) return; setTransforming(true); setFlash(true); setTimeout(()=>setFlash(false),200); setTimeout(()=>{setSelectedGame(game);setTransforming(false)},650); }, [transforming]);
  const handleBack = useCallback(() => { setView("grid"); setSelectedChar(null); setSelectedGame(null); setShowUI(false); }, []);

  return (
    <div style={{ minHeight:"100vh", background:B.void, color:B.white, fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", overflow:"hidden", position:"relative" }}>
      <Styles />
      {flash && <div className="flash-overlay" />}
      <Header onBack={view !== "grid" ? handleBack : null} />
      <div style={{ position:"relative", zIndex:1 }}>
        {view === "grid" && <GridView hoveredTile={hoveredTile} setHoveredTile={setHoveredTile} onSelect={handleCharSelect} ready={ready} />}
        {view === "loading" && selectedChar && <LoadingView character={selectedChar} progress={loadProgress} />}
        {view === "detail" && selectedChar && <DetailView character={selectedChar} selectedGame={selectedGame} onGameSelect={handleGameSelect} showUI={showUI} transforming={transforming} />}
      </div>
    </div>
  );
}

function Styles() {
  return <style>{`
    *{box-sizing:border-box;margin:0;padding:0}
    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes fadeInLeft{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
    @keyframes fadeInRight{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
    @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes flashOut{from{opacity:.4}to{opacity:0}}
    @keyframes pulseGlow{0%,100%{opacity:.3}50%{opacity:.7}}
    @keyframes scanline{from{transform:translateY(-100%)}to{transform:translateY(100vh)}}
    @keyframes tileIn{from{opacity:0;transform:scale(.85) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
    @keyframes particleFly{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}
    @keyframes ringExpand{0%{transform:scale(.3);opacity:1}100%{transform:scale(2.5);opacity:0}}
    @keyframes charReveal{0%{transform:scale(.7);opacity:0;filter:blur(12px)}50%{transform:scale(1.03);opacity:1;filter:blur(0)}100%{transform:scale(1);filter:blur(0)}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
    @keyframes hudScan{0%{top:10%}100%{top:90%}}
    @keyframes cornerPulse{0%,100%{opacity:.35}50%{opacity:.9}}
    @keyframes slideInGame{from{opacity:0;transform:translateY(12px) scale(.92)}to{opacity:1;transform:translateY(0) scale(1)}}
    .flash-overlay{position:fixed;inset:0;z-index:100;background:white;animation:flashOut .3s ease-out forwards;pointer-events:none}
    body{overflow-x:hidden}
  `}</style>;
}

function Header({ onBack }) {
  const [hb, setHb] = useState(false);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 24px", borderBottom:`1px solid ${B.iron}`, position:"sticky", top:0, zIndex:50, background:`${B.void}dd`, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        {onBack && <button onClick={onBack} onMouseEnter={()=>setHb(true)} onMouseLeave={()=>setHb(false)} style={{ background:"none", border:`1px solid ${hb?B.neon:B.iron}`, color:hb?B.neon:B.white, padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:11, fontWeight:700, letterSpacing:".08em", transition:"all .2s" }}>← BACK</button>}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:B.charcoal, border:`1px solid ${B.iron}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:900 }}>OGA</div>
          <span style={{ fontSize:12, fontWeight:700, letterSpacing:".06em" }}>OWNABLE GAME ASSETS</span>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:7, padding:"4px 13px", borderRadius:20, border:`1px solid ${B.neon}33`, background:`${B.neon}08`, fontSize:9, letterSpacing:".18em", fontWeight:800, color:B.neon }}>
        <span style={{ width:5, height:5, borderRadius:"50%", background:B.neon, boxShadow:`0 0 8px ${B.neon}`, animation:"blink 2s infinite" }} />
        IP PARTNER DEMO
      </div>
    </div>
  );
}

function GridView({ hoveredTile, setHoveredTile, onSelect, ready }) {
  return (
    <div style={{ padding:"28px 28px 70px", maxWidth:960, margin:"0 auto" }}>
      <div style={{ textAlign:"center", marginBottom:36, opacity:ready?1:0, transform:ready?"translateY(0)":"translateY(12px)", transition:"all .55s ease-out" }}>
        <div style={{ fontSize:10, letterSpacing:".3em", color:B.neon, fontWeight:800, marginBottom:8 }}>PARTNER IP SHOWCASE</div>
        <h1 style={{ fontSize:"clamp(24px,4.5vw,46px)", fontWeight:900, letterSpacing:"-.01em", lineHeight:1.08, marginBottom:12, textTransform:"uppercase" }}>ONE CHARACTER.<br/><span style={{ color:B.neon }}>INFINITE WORLDS.</span></h1>
        <p style={{ color:"#777", fontSize:13, maxWidth:440, margin:"0 auto", lineHeight:1.65 }}>Select a character to see how OGA™ technology transforms them across multiple game engines — instantly.</p>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:28 }}>
        <div style={{ height:1, flex:1, maxWidth:90, background:`linear-gradient(to right,transparent,${B.iron})` }}/>
        <div style={{ padding:"4px 16px", borderRadius:20, border:`1px solid ${B.iron}`, fontSize:9, letterSpacing:".2em", fontWeight:800, color:"#666" }}>{PARTNER_INFO.badge}</div>
        <div style={{ height:1, flex:1, maxWidth:90, background:`linear-gradient(to left,transparent,${B.iron})` }}/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, maxWidth:620, margin:"0 auto" }}>
        {CHARACTERS.map((ch,i) => <TileCard key={ch.id} character={ch} index={i} ready={ready} isHovered={hoveredTile===ch.id} onHover={()=>setHoveredTile(ch.id)} onLeave={()=>setHoveredTile(null)} onClick={()=>onSelect(ch)} />)}
      </div>
      <div style={{ textAlign:"center", marginTop:36, padding:24, border:`1px solid ${B.iron}`, borderRadius:16, background:`${B.charcoal}88` }}>
        <p style={{ color:"#666", fontSize:11, letterSpacing:".12em", marginBottom:5 }}>{PARTNER_INFO.cta}</p>
        <p style={{ color:B.neon, fontSize:15, fontWeight:800, letterSpacing:".06em" }}>{PARTNER_INFO.contact}</p>
      </div>
    </div>
  );
}

function TileCard({ character:ch, index, ready, isHovered, onHover, onLeave, onClick }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({x:0,y:0});
  const handleMove = (e) => { if(!ref.current) return; const r=ref.current.getBoundingClientRect(); setTilt({ x:((e.clientY-r.top)/r.height-.5)*-10, y:((e.clientX-r.left)/r.width-.5)*10 }); };
  return (
    <div ref={ref} onMouseMove={e=>{handleMove(e);onHover()}} onMouseLeave={()=>{setTilt({x:0,y:0});onLeave()}} onClick={onClick}
      style={{ position:"relative", aspectRatio:"1", borderRadius:14, overflow:"hidden", cursor:"pointer", border:`1px solid ${isHovered?ch.color+"55":B.iron}`, background:B.charcoal, transform:`perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered?1.04:1})`, transition:"transform .12s ease-out, border-color .25s, box-shadow .25s", boxShadow:isHovered?`0 0 28px ${ch.color}22, 0 14px 36px rgba(0,0,0,.5)`:"0 4px 14px rgba(0,0,0,.3)", animation:ready?`tileIn .45s ease-out ${index*.055}s both`:"none" }}>
      {ch.tileImage ? <img src={ch.tileImage} alt={ch.name} draggable={false} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", transition:"transform .35s ease-out", transform:isHovered?"scale(1.08)":"scale(1)" }} /> :
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg,${ch.color}22,${ch.color}0a)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", transition:"transform .35s", transform:isHovered?"scale(1.06)":"scale(1)" }}>
          <div style={{ fontSize:42, fontWeight:900, color:`${ch.color}55` }}>{ch.name.split(" ").map(w=>w[0]).join("")}</div>
          <div style={{ fontSize:7, color:`${ch.color}66`, letterSpacing:".15em", fontWeight:700, marginTop:4 }}>ADD IMAGE</div>
        </div>}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"28px 8px 8px", background:`linear-gradient(to top,${B.void}ee,${B.void}88,transparent)`, textAlign:"center", zIndex:3 }}>
        <div style={{ fontSize:9, fontWeight:800, letterSpacing:".1em", textShadow:"0 1px 4px rgba(0,0,0,.8)" }}>{ch.name}</div>
        <div style={{ fontSize:7, letterSpacing:".14em", color:ch.color, fontWeight:600, marginTop:2 }}>{ch.label.toUpperCase()}</div>
      </div>
      {isHovered && <div style={{ position:"absolute", top:7, right:7, zIndex:5, padding:"3px 9px", borderRadius:8, background:`${B.neon}18`, border:`1px solid ${B.neon}55`, fontSize:7, fontWeight:800, letterSpacing:".14em", color:B.neon, animation:"fadeIn .15s ease-out" }}>ACTIVATE</div>}
      <div style={{ position:"absolute", top:7, left:7, width:5, height:5, borderRadius:"50%", background:isHovered?B.neon:B.iron, boxShadow:isHovered?`0 0 8px ${B.neon}`:"none", transition:"all .25s", zIndex:5 }} />
    </div>
  );
}

function LoadingView({ character:ch, progress }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"80vh", padding:40 }}>
      <div style={{ position:"relative", width:180, height:180, marginBottom:24 }}>
        <svg width="180" height="180" viewBox="0 0 180 180" style={{ animation:"spin 3s linear infinite" }}>
          <circle cx="90" cy="90" r="82" fill="none" stroke={B.iron} strokeWidth="1.5"/>
          <circle cx="90" cy="90" r="82" fill="none" stroke={B.neon} strokeWidth="2.5" strokeDasharray={`${progress*5.15} ${515-progress*5.15}`} strokeLinecap="round" style={{ transition:"stroke-dasharray .1s" }}/>
        </svg>
        <div style={{ position:"absolute", inset:24, display:"flex", alignItems:"center", justifyContent:"center", animation:"float 2s ease-in-out infinite", borderRadius:12, overflow:"hidden" }}>
          <CharImage src={ch.detailImage||ch.tileImage} name={ch.name} color={ch.color} size={120} />
        </div>
      </div>
      <div style={{ fontSize:10, letterSpacing:".25em", fontWeight:800, color:B.neon, marginBottom:10 }}>INITIALIZING GAME ENGINES</div>
      <div style={{ width:240, height:2, borderRadius:1, background:B.iron, overflow:"hidden", marginBottom:12 }}>
        <div style={{ height:"100%", borderRadius:1, background:`linear-gradient(90deg,${B.neon},${ch.color})`, width:`${progress}%`, transition:"width .1s", boxShadow:`0 0 10px ${B.neon}66` }} />
      </div>
      <div style={{ fontSize:9, color:"#555", letterSpacing:".1em" }}>PREPARING {ch.name} FOR CROSS-GAME DEPLOYMENT</div>
      <div style={{ marginTop:18, display:"flex", gap:14, flexWrap:"wrap", justifyContent:"center" }}>
        {GAMES.map((g,i)=><div key={g.id} style={{ fontSize:8, letterSpacing:".1em", fontWeight:700, color:progress>(i+1)*20?g.color:"#333", transition:"color .3s", display:"flex", alignItems:"center", gap:3 }}>
          <span style={{ width:4, height:4, borderRadius:"50%", background:progress>(i+1)*20?g.color:"#333", boxShadow:progress>(i+1)*20?`0 0 5px ${g.color}`:"none", transition:"all .3s" }} />{g.name}
        </div>)}
      </div>
      <div style={{ position:"fixed", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${B.neon}44,transparent)`, animation:"scanline 1.5s linear infinite", pointerEvents:"none" }}/>
    </div>
  );
}

// ─── DETAIL VIEW — CYBERPUNK HUD ───────────────────────────────────────
function DetailView({ character:ch, selectedGame, onGameSelect, showUI, transforming }) {
  const [hoveredGame, setHoveredGame] = useState(null);
  const accent = selectedGame ? selectedGame.color : ch.color;
  const currentImage = selectedGame && ch.gameImages?.[selectedGame.id] ? ch.gameImages[selectedGame.id] : (ch.detailImage || ch.tileImage);
  const currentFilter = selectedGame && !ch.gameImages?.[selectedGame.id] ? selectedGame.filter : "none";
  const currentGameOverlay = selectedGame && !ch.gameImages?.[selectedGame.id] ? selectedGame.id : null;

  return (
    <div style={{ height:"calc(100vh - 49px)", overflow:"hidden", display:"flex", flexDirection:"column", position:"relative" }}>
      {/* BG effects */}
      <div style={{ position:"absolute", top:"15%", left:"50%", transform:"translateX(-50%)", width:"60vw", height:"60vw", maxWidth:700, maxHeight:700, borderRadius:"50%", background:`radial-gradient(circle,${accent}15 0%,${accent}08 30%,transparent 70%)`, transition:"background .8s", pointerEvents:"none", zIndex:0, animation:"pulseGlow 4s ease-in-out infinite" }} />
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0, backgroundImage:`repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,.012) 3px,rgba(255,255,255,.012) 4px)`, opacity:.4 }} />
      <div style={{ position:"absolute", left:0, right:0, height:1, zIndex:1, background:`linear-gradient(90deg,transparent,${B.neon}22,transparent)`, animation:"hudScan 4s linear infinite", pointerEvents:"none" }} />

      {/* Main content */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", zIndex:2, padding:"8px 20px" }}>

        {/* Name + status */}
        <div style={{ textAlign:"center", marginBottom:10, opacity:showUI?1:0, transform:showUI?"translateY(0)":"translateY(-10px)", transition:"all .4s ease-out" }}>
          <div style={{ fontSize:9, letterSpacing:".3em", color:`${accent}cc`, fontWeight:800, marginBottom:2, transition:"color .5s" }}>{ch.label.toUpperCase()}</div>
          <h2 style={{ fontSize:"clamp(28px,4vw,50px)", fontWeight:900, letterSpacing:".03em", textTransform:"uppercase", lineHeight:1, textShadow:`0 0 40px ${accent}33` }}>{ch.name}</h2>
          {selectedGame && <div style={{ marginTop:4, fontSize:10, letterSpacing:".18em", color:selectedGame.color, fontWeight:700, animation:"fadeUp .3s ease-out", textShadow:`0 0 12px ${selectedGame.color}44` }}>{selectedGame.icon} {selectedGame.style.toUpperCase()}</div>}
        </div>

        {/* Character arena */}
        <div style={{ position:"relative", width:"min(380px,52vw)", height:"min(420px,58vw)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          {/* HUD corners */}
          {["top-left","top-right","bottom-left","bottom-right"].map(p => <HudCorner key={p} pos={p} color={accent} show={showUI} />)}

          {/* Side readouts - left */}
          <div style={{ position:"absolute", left:-65, top:"50%", transform:"translateY(-50%)", opacity:showUI?1:0, animation:showUI?"fadeInLeft .4s ease-out .2s both":"none" }}>
            <SideReadout label="MODEL" value="READY" color={B.neon} />
            <SideReadout label="TEXTURES" value="MAPPED" color={B.neon} />
            <SideReadout label="SKELETON" value="BOUND" color={B.neon} />
          </div>
          {/* Side readouts - right */}
          <div style={{ position:"absolute", right:-65, top:"50%", transform:"translateY(-50%)", opacity:showUI?1:0, animation:showUI?"fadeInRight .4s ease-out .3s both":"none" }}>
            <SideReadout label="ANIMS" value="24" color={accent} align="right" />
            <SideReadout label="POLY" value="48.2K" color={accent} align="right" />
            <SideReadout label="LOD" value="3" color={accent} align="right" />
          </div>

          {/* Character card */}
          <div style={{
            width:"100%", height:"100%", borderRadius:20, position:"relative", overflow:"hidden",
            background:`${B.charcoal}cc`,
            border:`1.5px solid ${selectedGame?selectedGame.color+"55":B.iron}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all .5s ease-out, border-color .4s",
            boxShadow:selectedGame?`0 0 60px ${selectedGame.color}22, 0 0 120px ${selectedGame.color}0d, inset 0 0 40px ${selectedGame.color}08`:`0 0 30px ${ch.color}0d`,
            transform:transforming?"scale(.88) rotate(2deg)":"scale(1) rotate(0deg)",
            animation:showUI?"charReveal .6s ease-out":"none",
          }}>
            <div style={{ transition:"all .5s ease-in-out", transform:transforming?"scale(.6) rotate(-3deg)":"scale(1) rotate(0deg)", opacity:transforming?.2:1 }}>
              <CharImage src={currentImage} name={ch.name} color={ch.color} size={Math.min(360,typeof window!=="undefined"?window.innerWidth*.48:360)} gameFilter={currentFilter} gameId={currentGameOverlay} style={{ borderRadius:16 }} />
            </div>
            {selectedGame && !transforming && (
              <div style={{ position:"absolute", bottom:14, left:"50%", transform:"translateX(-50%)", padding:"5px 16px", borderRadius:10, background:selectedGame.color, color:B.white, fontSize:9, fontWeight:800, letterSpacing:".12em", animation:"fadeUp .3s ease-out", boxShadow:`0 4px 16px ${selectedGame.color}66` }}>{selectedGame.icon} {selectedGame.name}</div>
            )}
            {/* Inner scanlines */}
            <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,.015) 3px,rgba(255,255,255,.015) 4px)" }} />
          </div>

          {/* Particles */}
          {transforming && <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }}><ParticleBurst color={selectedGame?.color||B.neon} /></div>}
          {transforming && <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:120, height:120, borderRadius:"50%", border:`2px solid ${selectedGame?.color||B.neon}`, animation:"ringExpand .6s ease-out forwards", pointerEvents:"none" }} />}
        </div>

        {/* Game selector strip */}
        <div style={{ display:"flex", gap:10, marginTop:16, justifyContent:"center", flexWrap:"wrap", opacity:showUI?1:0, transition:"opacity .4s .15s" }}>
          {GAMES.map((game,i) => {
            const isSel = selectedGame?.id === game.id;
            const isHov = hoveredGame === game.id;
            return (
              <div key={game.id} onMouseEnter={()=>setHoveredGame(game.id)} onMouseLeave={()=>setHoveredGame(null)} onClick={()=>onGameSelect(game)}
                style={{
                  padding:"10px 18px", borderRadius:12, cursor:"pointer",
                  background:isSel?`${game.color}18`:`${B.charcoal}cc`,
                  border:`1px solid ${isSel?game.color:isHov?game.color+"66":B.iron}`,
                  transition:"all .2s",
                  transform:isHov&&!isSel?"translateY(-3px) scale(1.03)":"translateY(0) scale(1)",
                  boxShadow:isSel?`0 0 20px ${game.color}22, 0 4px 12px rgba(0,0,0,.3)`:isHov?"0 4px 16px rgba(0,0,0,.4)":"none",
                  display:"flex", alignItems:"center", gap:10, minWidth:140,
                  animation:showUI?`slideInGame .35s ease-out ${.1+i*.06}s both`:"none",
                }}>
                <div style={{ width:36, height:36, borderRadius:8, background:isSel?`${game.color}25`:`${B.iron}55`, border:`1px solid ${isSel?game.color+"55":B.iron}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, transition:"all .2s" }}>{game.icon}</div>
                <div>
                  <div style={{ fontSize:10, fontWeight:800, letterSpacing:".1em", color:isSel?game.color:B.white, transition:"color .2s" }}>{game.name}</div>
                  <div style={{ fontSize:7, color:"#555", letterSpacing:".08em", marginTop:1 }}>{game.genre.toUpperCase()}</div>
                </div>
                {isSel && <div style={{ width:6, height:6, borderRadius:"50%", background:game.color, boxShadow:`0 0 8px ${game.color}`, marginLeft:"auto" }} />}
              </div>
            );
          })}
        </div>

        {/* Status bar */}
        {showUI && (
          <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:20, animation:"fadeUp .4s ease-out .4s both" }}>
            {selectedGame ? <>
              <StatusPill label="MODEL" status="CONVERTED" color={B.neon} />
              <StatusPill label="TEXTURES" status="ADAPTED" color={B.neon} />
              <StatusPill label="ANIMATIONS" status="MAPPED" color={B.neon} />
            </> :
              <div style={{ fontSize:10, color:"#555", letterSpacing:".1em", textAlign:"center" }}>SELECT A GAME ENGINE TO TRANSFORM <span style={{ color:ch.color, fontWeight:700 }}>{ch.name}</span></div>
            }
          </div>
        )}
      </div>

      {/* Bottom CTA bar */}
      {showUI && (
        <div style={{ padding:"10px 24px", borderTop:`1px solid ${B.iron}`, display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:`${B.charcoal}55`, animation:"fadeUp .35s ease-out .5s both" }}>
          <span style={{ width:5, height:5, borderRadius:"50%", background:B.neon, boxShadow:`0 0 6px ${B.neon}` }} />
          <span style={{ fontSize:9, letterSpacing:".14em", color:B.neon, fontWeight:800 }}>{PARTNER_INFO.cta}</span>
          <span style={{ fontSize:9, letterSpacing:".1em", color:"#555", fontWeight:600, marginLeft:4 }}>{PARTNER_INFO.contact}</span>
        </div>
      )}
    </div>
  );
}

function HudCorner({ pos, color, show }) {
  const sz=22, th=2;
  const p={ "top-left":{top:-1,left:-1}, "top-right":{top:-1,right:-1}, "bottom-left":{bottom:-1,left:-1}, "bottom-right":{bottom:-1,right:-1} };
  const isT=pos.includes("top"), isL=pos.includes("left");
  return (
    <div style={{ position:"absolute", ...p[pos], width:sz, height:sz, zIndex:5, opacity:show?1:0, transition:"opacity .3s .2s", animation:show?"cornerPulse 3s ease-in-out infinite":"none" }}>
      <div style={{ position:"absolute", [isT?"top":"bottom"]:0, [isL?"left":"right"]:0, width:sz, height:th, background:color, boxShadow:`0 0 6px ${color}66`, transition:"background .5s, box-shadow .5s" }} />
      <div style={{ position:"absolute", [isT?"top":"bottom"]:0, [isL?"left":"right"]:0, width:th, height:sz, background:color, boxShadow:`0 0 6px ${color}66`, transition:"background .5s, box-shadow .5s" }} />
    </div>
  );
}

function SideReadout({ label, value, color, align="left" }) {
  return <div style={{ marginBottom:10, textAlign:align }}>
    <div style={{ fontSize:6, letterSpacing:".2em", color:"#444", fontWeight:700 }}>{label}</div>
    <div style={{ fontSize:9, letterSpacing:".1em", color, fontWeight:800 }}>{value}</div>
  </div>;
}

function StatusPill({ label, status, color }) {
  return <div style={{ display:"flex", alignItems:"center", gap:5 }}>
    <span style={{ width:4, height:4, borderRadius:"50%", background:color, boxShadow:`0 0 6px ${color}` }} />
    <span style={{ fontSize:7, letterSpacing:".12em", color:"#666", fontWeight:700 }}>{label}</span>
    <span style={{ fontSize:7, letterSpacing:".1em", color, fontWeight:800 }}>{status}</span>
  </div>;
}

function ParticleBurst({ color }) {
  const particles = useMemo(() => Array.from({length:24},(_,i) => {
    const a=(i/24)*Math.PI*2+(Math.random()-.5)*.5, d=60+Math.random()*100;
    return { tx:Math.cos(a)*d, ty:Math.sin(a)*d, size:2+Math.random()*5, delay:Math.random()*.1 };
  }), []);
  return <>{particles.map((p,i)=><div key={i} style={{ position:"absolute", top:0, left:0, width:p.size, height:p.size, borderRadius:"50%", background:i%3===0?B.neon:color, boxShadow:`0 0 6px ${color}`, "--tx":`${p.tx}px`, "--ty":`${p.ty}px`, animation:`particleFly .55s ease-out ${p.delay}s forwards`, pointerEvents:"none" }} />)}</>;
}