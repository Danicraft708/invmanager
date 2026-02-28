import { useState, useEffect, useCallback, memo } from "react";

/* ═══════════════════════════════════════════════════
   FONTS & THEME
═══════════════════════════════════════════════════ */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Syne:wght@400;500;600;700;800&display=swap');`;

const C = {
  bg: "#0b0c10",
  surface: "#111318",
  surfaceHigh: "#181b22",
  border: "rgba(255,255,255,0.07)",
  borderHigh: "rgba(255,255,255,0.14)",
  text: "#e8eaf0",
  textMuted: "#6b7280",
  textDim: "#9ca3af",
  accent: "#6366f1",
  accentGlow: "rgba(99,102,241,0.25)",
  accentLight: "#818cf8",
  green: "#10b981",
  greenGlow: "rgba(16,185,129,0.2)",
  red: "#ef4444",
  redGlow: "rgba(239,68,68,0.2)",
  yellow: "#f59e0b",
  yellowGlow: "rgba(245,158,11,0.2)",
  orange: "#f97316",
};

/* ═══════════════════════════════════════════════════
   SIMULATED PERSISTENT STORAGE (window.storage API)
═══════════════════════════════════════════════════ */
const STORAGE_KEY = "inv_saas_data";

const getInitialData = () => ({
  companies: [
    {
      id: "c001",
      name: "Perfumery SAS",
      email: "admin@perfumery.co",
      password: "perf2024",
      plan: "Pro",
      active: true,
      createdAt: "2024-01-15",
      expiresAt: "2025-01-15",
      products: [
        { id: "p1", name: "Olimpya 35ml", sku: "OLI-001", category: "Dama", price: 10000, cost: 5500, stock: 42, minStock: 10, location: "A-01", lastUpdate: "2025-07-10" },
        { id: "p2", name: "Ralph Lauren 35ml", sku: "RAL-001", category: "Dama", price: 10000, cost: 5500, stock: 8, minStock: 10, location: "A-02", lastUpdate: "2025-07-09" },
        { id: "p3", name: "Good Girl 35ml", sku: "GOO-001", category: "Dama", price: 10000, cost: 5500, stock: 25, minStock: 10, location: "A-03", lastUpdate: "2025-07-08" },
        { id: "p4", name: "Invictus 35ml", sku: "INV-001", category: "Caballero", price: 10000, cost: 5500, stock: 33, minStock: 10, location: "B-01", lastUpdate: "2025-07-10" },
        { id: "p5", name: "One Millón 35ml", sku: "ONE-001", category: "Caballero", price: 10000, cost: 5500, stock: 3, minStock: 10, location: "B-02", lastUpdate: "2025-07-07" },
        { id: "p6", name: "Oddisey 35ml", sku: "ODD-001", category: "Unisex", price: 10000, cost: 5500, stock: 18, minStock: 10, location: "C-01", lastUpdate: "2025-07-09" },
      ],
      movements: [
        { id: "m1", type: "entrada", productId: "p1", productName: "Olimpya 35ml", qty: 20, date: "2025-07-01", note: "Reabastecimiento mensual", user: "María G." },
        { id: "m2", type: "salida", productId: "p4", productName: "Invictus 35ml", qty: 5, date: "2025-07-05", note: "Venta al por mayor", user: "Carlos R." },
        { id: "m3", type: "salida", productId: "p2", productName: "Ralph Lauren 35ml", qty: 12, date: "2025-07-08", note: "Pedido cliente #304", user: "María G." },
        { id: "m4", type: "entrada", productId: "p5", productName: "One Millón 35ml", qty: 15, date: "2025-07-09", note: "Proveedor Fragances CO", user: "Carlos R." },
        { id: "m5", type: "salida", productId: "p5", productName: "One Millón 35ml", qty: 22, date: "2025-07-10", note: "Liquidación stock antiguo", user: "María G." },
      ],
    },
    {
      id: "c002",
      name: "TechStore Ltda",
      email: "admin@techstore.co",
      password: "tech2024",
      plan: "Básico",
      active: false,
      createdAt: "2024-03-01",
      expiresAt: "2024-09-01",
      products: [
        { id: "p10", name: "Mouse Logitech MX3", sku: "MX3-001", category: "Periféricos", price: 180000, cost: 120000, stock: 15, minStock: 5, location: "A-01", lastUpdate: "2025-07-01" },
        { id: "p11", name: "Teclado Mecánico K2", sku: "K2-001", category: "Periféricos", price: 250000, cost: 160000, stock: 6, minStock: 3, location: "A-02", lastUpdate: "2025-07-01" },
      ],
      movements: [],
    },
    {
      id: "c003",
      name: "Distribuidora Andina",
      email: "admin@andina.co",
      password: "andina2024",
      plan: "Enterprise",
      active: true,
      createdAt: "2024-05-10",
      expiresAt: "2026-05-10",
      products: [
        { id: "p20", name: "Arroz Diana x 500g", sku: "ARR-001", category: "Granos", price: 3500, cost: 2000, stock: 500, minStock: 100, location: "D-01", lastUpdate: "2025-07-10" },
        { id: "p21", name: "Aceite Vegetal 1L", sku: "ACE-001", category: "Aceites", price: 12000, cost: 8000, stock: 80, minStock: 50, location: "D-02", lastUpdate: "2025-07-09" },
        { id: "p22", name: "Sal Refisal x 1kg", sku: "SAL-001", category: "Condimentos", price: 2800, cost: 1500, stock: 200, minStock: 100, location: "D-03", lastUpdate: "2025-07-08" },
      ],
      movements: [
        { id: "m10", type: "entrada", productId: "p20", productName: "Arroz Diana x 500g", qty: 300, date: "2025-07-05", note: "Proveedor Diana", user: "Luisa M." },
        { id: "m11", type: "salida", productId: "p21", productName: "Aceite Vegetal 1L", qty: 40, date: "2025-07-08", note: "Pedido supermercado", user: "Luisa M." },
      ],
    },
  ],
});

/* ═══════════════════════════════════════════════════
   ADMIN CREDENTIALS
═══════════════════════════════════════════════════ */
const ADMIN = { email: "superadmin@inventario.app", password: "Admin@2025!" };

/* ═══════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════ */
function useData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res && res.value) {
          setData(JSON.parse(res.value));
        } else {
          const initial = getInitialData();
          await window.storage.set(STORAGE_KEY, JSON.stringify(initial));
          setData(initial);
        }
      } catch {
        setData(getInitialData());
      }
    };
    load();
  }, []);

  const save = useCallback(async (newData) => {
    setData(newData);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(newData));
    } catch {}
  }, []);

  return [data, save];
}

/* ═══════════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════════ */
const fmt = (n) => `$${Number(n).toLocaleString("es-CO")}`;
const fmtNum = (n) => Number(n).toLocaleString("es-CO");
const uid = () => Math.random().toString(36).slice(2, 9);

/* ═══════════════════════════════════════════════════
   COMPONENTS — UI PRIMITIVES
═══════════════════════════════════════════════════ */
const Badge = ({ children, color = C.accent, bg }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: "4px",
    padding: "2px 10px", borderRadius: "999px", fontSize: "0.7rem",
    fontFamily: "'Syne', sans-serif", fontWeight: 600, letterSpacing: "0.05em",
    background: bg || `${color}22`, color, border: `1px solid ${color}44`,
  }}>{children}</span>
);

const StatCard = ({ label, value, sub, color = C.text, icon }) => (
  <div style={{
    background: C.surfaceHigh, border: `1px solid ${C.border}`,
    borderRadius: "16px", padding: "1.25rem 1.5rem",
    display: "flex", flexDirection: "column", gap: "0.4rem",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <span style={{ color: C.textMuted, fontSize: "0.72rem", fontFamily: "'Syne'", letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</span>
      {icon && <span style={{ fontSize: "1.1rem" }}>{icon}</span>}
    </div>
    <span style={{ color, fontFamily: "'DM Serif Display'", fontSize: "1.9rem", lineHeight: 1 }}>{value}</span>
    {sub && <span style={{ color: C.textMuted, fontSize: "0.75rem", fontFamily: "'Syne'" }}>{sub}</span>}
  </div>
);

function Modal({ title, onClose, children, width = "600px" }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.85)",
      backdropFilter: "blur(8px)", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "1rem", animation: "fadeIn .25s ease",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.surface, border: `1px solid ${C.borderHigh}`,
        borderRadius: "20px", width: "100%", maxWidth: width,
        maxHeight: "90vh", display: "flex", flexDirection: "column",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)", animation: "slideUp .35s cubic-bezier(.34,1.56,.64,1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: `1px solid ${C.border}` }}>
          <h3 style={{ margin: 0, fontFamily: "'DM Serif Display'", fontSize: "1.3rem", color: C.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", fontSize: "1.2rem", lineHeight: 1, padding: "4px" }}>✕</button>
        </div>
        <div style={{ overflowY: "auto", padding: "1.5rem", flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && <label style={{ display: "block", color: C.textMuted, fontSize: "0.72rem", fontFamily: "'Syne'", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{label}</label>}
      <input {...props} style={{
        width: "100%", padding: "0.7rem 0.9rem", borderRadius: "10px",
        background: C.bg, border: `1.5px solid ${C.border}`,
        color: C.text, fontFamily: "'Syne'", fontSize: "0.9rem",
        outline: "none", boxSizing: "border-box", transition: "border-color .2s",
        ...props.style,
      }}
        onFocus={e => e.target.style.borderColor = C.accent}
        onBlur={e => e.target.style.borderColor = C.border}
      />
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", disabled, size = "md" }) {
  const bg = variant === "primary" ? `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`
    : variant === "danger" ? `linear-gradient(135deg, ${C.red}, #f87171)`
    : variant === "success" ? `linear-gradient(135deg, ${C.green}, #34d399)`
    : "transparent";
  const brd = variant === "ghost" ? `1.5px solid ${C.border}` : "none";
  const col = variant === "ghost" ? C.textDim : "#fff";
  const pad = size === "sm" ? "0.4rem 0.9rem" : size === "lg" ? "0.85rem 2rem" : "0.6rem 1.4rem";
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? C.surfaceHigh : bg, border: brd, color: disabled ? C.textMuted : col,
      padding: pad, borderRadius: "10px", fontFamily: "'Syne'", fontSize: size === "sm" ? "0.76rem" : "0.88rem",
      fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", transition: "all .2s ease",
      letterSpacing: "0.05em", boxShadow: variant === "primary" ? `0 4px 20px ${C.accentGlow}` : "none",
    }}>{children}</button>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && <label style={{ display: "block", color: C.textMuted, fontSize: "0.72rem", fontFamily: "'Syne'", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{label}</label>}
      <select value={value} onChange={onChange} style={{
        width: "100%", padding: "0.7rem 0.9rem", borderRadius: "10px",
        background: C.bg, border: `1.5px solid ${C.border}`,
        color: C.text, fontFamily: "'Syne'", fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════════════ */
function LoginPage({ onLogin, data }) {
  const [tab, setTab] = useState("company");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setErr(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Admin login
      if (tab === "admin") {
        if (email === ADMIN.email && pass === ADMIN.password) {
          onLogin({ role: "admin" });
        } else {
          setErr("Credenciales de administrador incorrectas.");
        }
        return;
      }
      // Company login
      if (!data) { setErr("Cargando datos..."); return; }
      const co = data.companies.find(c => c.email === email && c.password === pass);
      if (!co) { setErr("Email o contraseña incorrectos."); return; }
      if (!co.active) {
        setErr("⛔ Licencia inactiva. Contacta al administrador para reactivar tu cuenta.");
        return;
      }
      onLogin({ role: "company", companyId: co.id });
    }, 600);
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center",
      justifyContent: "center", padding: "1rem", position: "relative", overflow: "hidden",
    }}>
      {/* BG decoration */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "50vw", height: "50vw", borderRadius: "50%", background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 70%)`, filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "-15%", right: "-10%", width: "40vw", height: "40vw", borderRadius: "50%", background: `radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)`, filter: "blur(50px)" }} />
        {/* Grid lines */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.03 }}>
          <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="1" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div style={{ position: "relative", width: "100%", maxWidth: "420px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: "1.8rem", boxShadow: `0 8px 32px ${C.accentGlow}` }}>📦</div>
          <h1 style={{ fontFamily: "'DM Serif Display'", fontSize: "2.2rem", color: C.text, margin: 0 }}>InvManager</h1>
          <p style={{ color: C.textMuted, fontSize: "0.82rem", fontFamily: "'Syne'", margin: "0.3rem 0 0" }}>Sistema de Inventario Empresarial</p>
        </div>

        {/* Card */}
        <div style={{ background: C.surface, border: `1px solid ${C.borderHigh}`, borderRadius: "20px", padding: "2rem", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: "4px", background: C.bg, borderRadius: "10px", padding: "4px", marginBottom: "1.5rem" }}>
            {[{ key: "company", label: "🏢 Empresa" }, { key: "admin", label: "⚙️ Admin" }].map(t => (
              <button key={t.key} onClick={() => { setTab(t.key); setErr(""); }} style={{
                flex: 1, padding: "0.55rem", borderRadius: "8px", border: "none", cursor: "pointer",
                fontFamily: "'Syne'", fontSize: "0.82rem", fontWeight: 600, transition: "all .2s",
                background: tab === t.key ? C.surfaceHigh : "transparent",
                color: tab === t.key ? C.text : C.textMuted,
                boxShadow: tab === t.key ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
              }}>{t.label}</button>
            ))}
          </div>

          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder={tab === "admin" ? "superadmin@inventario.app" : "admin@tuempresa.co"} />
          <Input label="Contraseña" type="password" value={pass} onChange={e => setPass(e.target.value)}
            placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()} />

          {err && (
            <div style={{ background: `${C.red}15`, border: `1px solid ${C.red}44`, borderRadius: "10px", padding: "0.7rem 0.9rem", marginBottom: "1rem", color: "#fca5a5", fontSize: "0.82rem", fontFamily: "'Syne'" }}>{err}</div>
          )}

          <Btn onClick={handleLogin} size="lg" disabled={loading}>
            {loading ? "Verificando..." : "Ingresar →"}
          </Btn>

          {tab === "company" && (
            <div style={{ marginTop: "1.25rem", padding: "0.9rem", background: C.bg, borderRadius: "10px", border: `1px solid ${C.border}` }}>
              <p style={{ color: C.textMuted, fontSize: "0.72rem", fontFamily: "'Syne'", margin: "0 0 0.4rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Demo — Cuentas de prueba</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                {[{ email: "admin@perfumery.co", pass: "perf2024", status: "✅ Activa" }, { email: "admin@techstore.co", pass: "tech2024", status: "⛔ Inactiva" }, { email: "admin@andina.co", pass: "andina2024", status: "✅ Activa" }].map((a, i) => (
                  <button key={i} onClick={() => { setEmail(a.email); setPass(a.pass); }} style={{ background: "transparent", border: "none", color: C.accentLight, fontSize: "0.74rem", fontFamily: "'DM Mono'", cursor: "pointer", textAlign: "left", padding: "1px 0" }}>
                    {a.email} · {a.status}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <p style={{ textAlign: "center", color: C.textMuted, fontSize: "0.68rem", fontFamily: "'Syne'", marginTop: "1rem" }}>© 2025 InvManager · Todos los derechos reservados</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ADMIN DASHBOARD
═══════════════════════════════════════════════════ */
function AdminDashboard({ data, onSave, onLogout }) {
  const [view, setView] = useState("companies");
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);
  const [newCo, setNewCo] = useState({ name: "", email: "", password: "", plan: "Básico", expiresAt: "" });
  const [confirm, setConfirm] = useState(null);

  const toggleActive = (id) => {
    const co = data.companies.find(c => c.id === id);
    setConfirm({ id, name: co.name, action: co.active ? "desactivar" : "activar" });
  };

  const doToggle = () => {
    const updated = { ...data, companies: data.companies.map(c => c.id === confirm.id ? { ...c, active: !c.active } : c) };
    onSave(updated);
    setConfirm(null);
  };

  const addCompany = () => {
    if (!newCo.name || !newCo.email || !newCo.password || !newCo.expiresAt) return;
    const co = { id: `c${uid()}`, ...newCo, active: true, createdAt: new Date().toISOString().slice(0, 10), products: [], movements: [] };
    onSave({ ...data, companies: [...data.companies, co] });
    setShowAdd(false);
    setNewCo({ name: "", email: "", password: "", plan: "Básico", expiresAt: "" });
  };

  const deleteCompany = (id) => {
    onSave({ ...data, companies: data.companies.filter(c => c.id !== id) });
    setSelected(null);
  };

  const totalRevenue = data.companies.reduce((a, co) => {
    const sold = co.movements.filter(m => m.type === "salida").reduce((s, m) => {
      const p = co.products.find(p => p.id === m.productId);
      return s + (p ? p.price * m.qty : 0);
    }, 0);
    return a + sold;
  }, 0);

  const totalProducts = data.companies.reduce((a, co) => a + co.products.reduce((s, p) => s + p.stock, 0), 0);

  const navItems = [
    { key: "companies", icon: "🏢", label: "Empresas" },
    { key: "overview", icon: "📊", label: "Vista Global" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: "220px", flexShrink: 0, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "1.5rem 0" }}>
        <div style={{ padding: "0 1.25rem 1.5rem", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>📦</div>
            <div>
              <p style={{ margin: 0, fontFamily: "'Syne'", fontWeight: 700, fontSize: "0.9rem" }}>InvManager</p>
              <p style={{ margin: 0, color: C.red, fontSize: "0.64rem", fontFamily: "'Syne'", fontWeight: 600 }}>⚙️ ADMIN</p>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "4px" }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setView(item.key)} style={{
              display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.6rem 0.9rem",
              borderRadius: "10px", border: "none", cursor: "pointer", textAlign: "left",
              fontFamily: "'Syne'", fontSize: "0.83rem", fontWeight: 500, transition: "all .2s",
              background: view === item.key ? `${C.accent}22` : "transparent",
              color: view === item.key ? C.accentLight : C.textDim,
            }}>{item.icon} {item.label}</button>
          ))}
        </nav>
        <div style={{ padding: "1rem 0.75rem", borderTop: `1px solid ${C.border}` }}>
          <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 0.9rem", borderRadius: "10px", border: "none", cursor: "pointer", background: "transparent", color: C.textMuted, fontFamily: "'Syne'", fontSize: "0.82rem", width: "100%" }}>
            🚪 Cerrar sesión
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflowY: "auto", padding: "2rem" }}>
        {view === "companies" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem" }}>
              <div>
                <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: "2rem", margin: "0 0 0.25rem" }}>Panel de Empresas</h2>
                <p style={{ color: C.textMuted, fontSize: "0.82rem", fontFamily: "'Syne'", margin: 0 }}>Gestiona licencias y accesos de cada cliente</p>
              </div>
              <Btn onClick={() => setShowAdd(true)}>+ Nueva Empresa</Btn>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.75rem" }}>
              <StatCard label="Total Empresas" value={data.companies.length} icon="🏢" />
              <StatCard label="Activas" value={data.companies.filter(c => c.active).length} color={C.green} icon="✅" />
              <StatCard label="Inactivas" value={data.companies.filter(c => !c.active).length} color={C.red} icon="⛔" />
              <StatCard label="Ingresos Totales" value={fmt(totalRevenue)} color={C.accentLight} icon="💰" />
            </div>

            {/* Table */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "16px", overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Syne'", fontWeight: 600, fontSize: "0.88rem" }}>Listado de Empresas</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: C.surfaceHigh }}>
                      {["Empresa", "Email", "Plan", "Productos", "Estado", "Vence", "Acciones"].map(h => (
                        <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: C.textMuted, fontSize: "0.7rem", fontFamily: "'Syne'", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.companies.map((co, i) => (
                      <tr key={co.id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : `${C.surfaceHigh}44` }}>
                        <td style={{ padding: "0.9rem 1rem" }}>
                          <div style={{ fontFamily: "'Syne'", fontWeight: 600, fontSize: "0.88rem", color: C.text }}>{co.name}</div>
                        </td>
                        <td style={{ padding: "0.9rem 1rem" }}>
                          <span style={{ color: C.textMuted, fontSize: "0.8rem", fontFamily: "'DM Mono'" }}>{co.email}</span>
                        </td>
                        <td style={{ padding: "0.9rem 1rem" }}>
                          <Badge color={co.plan === "Enterprise" ? C.yellow : co.plan === "Pro" ? C.accentLight : C.textDim}>{co.plan}</Badge>
                        </td>
                        <td style={{ padding: "0.9rem 1rem" }}>
                          <span style={{ fontFamily: "'DM Mono'", fontSize: "0.85rem", color: C.textDim }}>{co.products.length}</span>
                        </td>
                        <td style={{ padding: "0.9rem 1rem" }}>
                          <Badge color={co.active ? C.green : C.red}>{co.active ? "✅ Activa" : "⛔ Inactiva"}</Badge>
                        </td>
                        <td style={{ padding: "0.9rem 1rem" }}>
                          <span style={{ fontFamily: "'DM Mono'", fontSize: "0.8rem", color: C.textMuted }}>{co.expiresAt}</span>
                        </td>
                        <td style={{ padding: "0.9rem 1rem" }}>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <Btn size="sm" variant="ghost" onClick={() => setSelected(co)}>Ver</Btn>
                            <Btn size="sm" variant={co.active ? "danger" : "success"} onClick={() => toggleActive(co.id)}>
                              {co.active ? "Desactivar" : "Activar"}
                            </Btn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {view === "overview" && (
          <>
            <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: "2rem", margin: "0 0 1.5rem" }}>Vista Global del Sistema</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.75rem" }}>
              <StatCard label="Empresas Activas" value={data.companies.filter(c => c.active).length} color={C.green} icon="🟢" />
              <StatCard label="Total Productos" value={fmtNum(data.companies.reduce((a, c) => a + c.products.length, 0))} icon="📦" />
              <StatCard label="Unidades en Stock" value={fmtNum(totalProducts)} color={C.accentLight} icon="🏪" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {data.companies.map(co => {
                const totalStock = co.products.reduce((s, p) => s + p.stock, 0);
                const lowStock = co.products.filter(p => p.stock <= p.minStock).length;
                const ventas = co.movements.filter(m => m.type === "salida").reduce((s, m) => {
                  const p = co.products.find(p => p.id === m.productId);
                  return s + (p ? p.price * m.qty : 0);
                }, 0);
                return (
                  <div key={co.id} style={{ background: C.surface, border: `1px solid ${co.active ? C.border : `${C.red}44`}`, borderRadius: "14px", padding: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                      <div>
                        <p style={{ margin: 0, fontFamily: "'Syne'", fontWeight: 700 }}>{co.name}</p>
                        <p style={{ margin: "2px 0 0", color: C.textMuted, fontSize: "0.74rem", fontFamily: "'Syne'" }}>{co.plan}</p>
                      </div>
                      <Badge color={co.active ? C.green : C.red}>{co.active ? "Activa" : "Inactiva"}</Badge>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                      <div style={{ background: C.surfaceHigh, borderRadius: "8px", padding: "0.6rem" }}>
                        <p style={{ margin: 0, color: C.textMuted, fontSize: "0.65rem", fontFamily: "'Syne'" }}>SKUs</p>
                        <p style={{ margin: 0, fontFamily: "'DM Serif Display'", fontSize: "1.3rem" }}>{co.products.length}</p>
                      </div>
                      <div style={{ background: lowStock > 0 ? `${C.yellow}15` : C.surfaceHigh, borderRadius: "8px", padding: "0.6rem", border: lowStock > 0 ? `1px solid ${C.yellow}44` : "none" }}>
                        <p style={{ margin: 0, color: C.textMuted, fontSize: "0.65rem", fontFamily: "'Syne'" }}>Stock bajo</p>
                        <p style={{ margin: 0, fontFamily: "'DM Serif Display'", fontSize: "1.3rem", color: lowStock > 0 ? C.yellow : C.text }}>{lowStock}</p>
                      </div>
                      <div style={{ background: C.surfaceHigh, borderRadius: "8px", padding: "0.6rem" }}>
                        <p style={{ margin: 0, color: C.textMuted, fontSize: "0.65rem", fontFamily: "'Syne'" }}>Ventas</p>
                        <p style={{ margin: 0, fontFamily: "'DM Mono'", fontSize: "0.82rem", color: C.accentLight }}>{fmt(ventas)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Modal: Add Company */}
      {showAdd && (
        <Modal title="Nueva Empresa Cliente" onClose={() => setShowAdd(false)}>
          <Input label="Nombre de la empresa" value={newCo.name} onChange={e => setNewCo({ ...newCo, name: e.target.value })} placeholder="Ej: Mi Tienda SAS" />
          <Input label="Email de acceso" type="email" value={newCo.email} onChange={e => setNewCo({ ...newCo, email: e.target.value })} placeholder="admin@mitienda.co" />
          <Input label="Contraseña inicial" type="text" value={newCo.password} onChange={e => setNewCo({ ...newCo, password: e.target.value })} placeholder="Mínimo 6 caracteres" />
          <Select label="Plan" value={newCo.plan} onChange={e => setNewCo({ ...newCo, plan: e.target.value })} options={[{ value: "Básico", label: "Básico" }, { value: "Pro", label: "Pro" }, { value: "Enterprise", label: "Enterprise" }]} />
          <Input label="Fecha de vencimiento" type="date" value={newCo.expiresAt} onChange={e => setNewCo({ ...newCo, expiresAt: e.target.value })} />
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
            <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancelar</Btn>
            <Btn onClick={addCompany}>Crear Empresa</Btn>
          </div>
        </Modal>
      )}

      {/* Modal: Company Detail */}
      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)} width="700px">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
            {[
              { label: "Email", val: selected.email },
              { label: "Plan", val: selected.plan },
              { label: "Estado", val: selected.active ? "✅ Activa" : "⛔ Inactiva" },
              { label: "Creada", val: selected.createdAt },
              { label: "Vence", val: selected.expiresAt },
              { label: "Productos", val: selected.products.length },
            ].map(item => (
              <div key={item.label} style={{ background: C.surfaceHigh, borderRadius: "10px", padding: "0.75rem" }}>
                <p style={{ margin: 0, color: C.textMuted, fontSize: "0.68rem", fontFamily: "'Syne'", textTransform: "uppercase", letterSpacing: "0.1em" }}>{item.label}</p>
                <p style={{ margin: "4px 0 0", fontFamily: "'Syne'", fontWeight: 600, fontSize: "0.9rem" }}>{item.val}</p>
              </div>
            ))}
          </div>
          <p style={{ color: C.textMuted, fontFamily: "'Syne'", fontSize: "0.78rem", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Productos registrados</p>
          <div style={{ maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
            {selected.products.map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.75rem", background: C.bg, borderRadius: "8px" }}>
                <span style={{ fontFamily: "'Syne'", fontSize: "0.82rem" }}>{p.name}</span>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <Badge color={p.stock <= p.minStock ? C.red : C.green}>{p.stock} u.</Badge>
                  <span style={{ color: C.accentLight, fontFamily: "'DM Mono'", fontSize: "0.78rem" }}>{fmt(p.price)}</span>
                </div>
              </div>
            ))}
            {selected.products.length === 0 && <p style={{ color: C.textMuted, fontFamily: "'Syne'", fontSize: "0.82rem", textAlign: "center", padding: "1rem" }}>Sin productos registrados</p>}
          </div>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1.25rem", borderTop: `1px solid ${C.border}`, paddingTop: "1.25rem" }}>
            <Btn variant="danger" size="sm" onClick={() => deleteCompany(selected.id)}>🗑 Eliminar empresa</Btn>
            <Btn variant={selected.active ? "danger" : "success"} onClick={() => { toggleActive(selected.id); setSelected(null); }}>
              {selected.active ? "⛔ Desactivar licencia" : "✅ Activar licencia"}
            </Btn>
          </div>
        </Modal>
      )}

      {/* Confirm Modal */}
      {confirm && (
        <Modal title={`¿${confirm.action.charAt(0).toUpperCase() + confirm.action.slice(1)} empresa?`} onClose={() => setConfirm(null)} width="400px">
          <p style={{ color: C.textDim, fontFamily: "'Syne'", fontSize: "0.88rem", marginBottom: "1.25rem", lineHeight: 1.6 }}>
            Estás a punto de <strong style={{ color: confirm.action === "desactivar" ? C.red : C.green }}>{confirm.action}</strong> la licencia de <strong style={{ color: C.text }}>{confirm.name}</strong>.
            {confirm.action === "desactivar" && " Los usuarios de esta empresa no podrán iniciar sesión hasta que la reactives."}
            {confirm.action === "activar" && " Los usuarios podrán volver a acceder al sistema inmediatamente."}
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setConfirm(null)}>Cancelar</Btn>
            <Btn variant={confirm.action === "desactivar" ? "danger" : "success"} onClick={doToggle}>
              Confirmar — {confirm.action}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   COMPANY DASHBOARD
═══════════════════════════════════════════════════ */
function CompanyDashboard({ company, onSaveCompany, onLogout }) {
  const [view, setView] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showMovement, setShowMovement] = useState(null); // product
  const [showEditProduct, setShowEditProduct] = useState(null);
  const [movType, setMovType] = useState("salida");
  const [movQty, setMovQty] = useState("");
  const [movNote, setMovNote] = useState("");
  const [newP, setNewP] = useState({ name: "", sku: "", category: "", price: "", cost: "", stock: "", minStock: "", location: "" });

  const co = company;

  // Stats
  const totalStock = co.products.reduce((s, p) => s + p.stock, 0);
  const totalValue = co.products.reduce((s, p) => s + p.price * p.stock, 0);
  const totalCostVal = co.products.reduce((s, p) => s + p.cost * p.stock, 0);
  const lowStock = co.products.filter(p => p.stock <= p.minStock);
  const totalSold = co.movements.filter(m => m.type === "salida").reduce((s, m) => {
    const p = co.products.find(p => p.id === m.productId);
    return s + (p ? p.price * m.qty : 0);
  }, 0);

  const categories = [...new Set(co.products.map(p => p.category))];

  const filteredProducts = co.products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchCat = catFilter === "all" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const addProduct = () => {
    if (!newP.name || !newP.sku) return;
    const product = {
      id: `p${uid()}`, ...newP,
      price: parseFloat(newP.price) || 0, cost: parseFloat(newP.cost) || 0,
      stock: parseInt(newP.stock) || 0, minStock: parseInt(newP.minStock) || 5,
      lastUpdate: new Date().toISOString().slice(0, 10),
    };
    onSaveCompany({ ...co, products: [...co.products, product] });
    setShowAddProduct(false);
    setNewP({ name: "", sku: "", category: "", price: "", cost: "", stock: "", minStock: "", location: "" });
  };

  const deleteProduct = (id) => {
    onSaveCompany({ ...co, products: co.products.filter(p => p.id !== id) });
  };

  const registerMovement = () => {
    if (!movQty || !showMovement) return;
    const qty = parseInt(movQty);
    if (isNaN(qty) || qty <= 0) return;
    const updatedProducts = co.products.map(p => {
      if (p.id !== showMovement.id) return p;
      const newStock = movType === "entrada" ? p.stock + qty : Math.max(0, p.stock - qty);
      return { ...p, stock: newStock, lastUpdate: new Date().toISOString().slice(0, 10) };
    });
    const mov = {
      id: `m${uid()}`, type: movType, productId: showMovement.id,
      productName: showMovement.name, qty,
      date: new Date().toISOString().slice(0, 10),
      note: movNote || "-", user: co.name,
    };
    onSaveCompany({ ...co, products: updatedProducts, movements: [mov, ...co.movements] });
    setShowMovement(null); setMovQty(""); setMovNote(""); setMovType("salida");
  };

  const navItems = [
    { key: "dashboard", icon: "📊", label: "Dashboard" },
    { key: "products", icon: "📦", label: "Inventario" },
    { key: "movements", icon: "🔄", label: "Movimientos" },
    { key: "analysis", icon: "📈", label: "Análisis" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: "220px", flexShrink: 0, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "1.5rem 0" }}>
        <div style={{ padding: "0 1.25rem 1.5rem", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>📦</div>
            <div>
              <p style={{ margin: 0, fontFamily: "'Syne'", fontWeight: 700, fontSize: "0.82rem", lineHeight: 1.2 }}>{co.name}</p>
              <Badge color={C.accent}>{co.plan}</Badge>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "4px" }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setView(item.key)} style={{
              display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.6rem 0.9rem",
              borderRadius: "10px", border: "none", cursor: "pointer", textAlign: "left",
              fontFamily: "'Syne'", fontSize: "0.83rem", fontWeight: 500, transition: "all .2s",
              background: view === item.key ? `${C.accent}22` : "transparent",
              color: view === item.key ? C.accentLight : C.textDim,
            }}>{item.icon} {item.label}</button>
          ))}
        </nav>
        {lowStock.length > 0 && (
          <div style={{ margin: "0 0.75rem", padding: "0.75rem", background: `${C.yellow}15`, border: `1px solid ${C.yellow}33`, borderRadius: "10px", marginBottom: "0.75rem" }}>
            <p style={{ margin: 0, color: C.yellow, fontFamily: "'Syne'", fontSize: "0.72rem", fontWeight: 600 }}>⚠️ {lowStock.length} producto{lowStock.length > 1 ? "s" : ""} con stock bajo</p>
          </div>
        )}
        <div style={{ padding: "1rem 0.75rem", borderTop: `1px solid ${C.border}` }}>
          <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 0.9rem", borderRadius: "10px", border: "none", cursor: "pointer", background: "transparent", color: C.textMuted, fontFamily: "'Syne'", fontSize: "0.82rem", width: "100%" }}>
            🚪 Cerrar sesión
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflowY: "auto", padding: "2rem" }}>

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <>
            <div style={{ marginBottom: "1.75rem" }}>
              <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: "2rem", margin: "0 0 0.25rem" }}>Bienvenido, {co.name} 👋</h2>
              <p style={{ color: C.textMuted, fontFamily: "'Syne'", fontSize: "0.82rem", margin: 0 }}>Resumen de tu inventario en tiempo real</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.75rem" }}>
              <StatCard label="Total SKUs" value={co.products.length} icon="📦" />
              <StatCard label="Unidades en stock" value={fmtNum(totalStock)} icon="🏪" />
              <StatCard label="Valor en inventario" value={fmt(totalValue)} color={C.accentLight} icon="💎" />
              <StatCard label="Ventas totales" value={fmt(totalSold)} color={C.green} icon="💸" />
            </div>

            {/* Low stock alert */}
            {lowStock.length > 0 && (
              <div style={{ background: `${C.yellow}10`, border: `1px solid ${C.yellow}33`, borderRadius: "14px", padding: "1.25rem", marginBottom: "1.5rem" }}>
                <p style={{ margin: "0 0 0.75rem", color: C.yellow, fontFamily: "'Syne'", fontWeight: 700, fontSize: "0.88rem" }}>⚠️ Productos con stock bajo o agotado</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {lowStock.map(p => (
                    <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.75rem", background: C.surface, borderRadius: "8px" }}>
                      <span style={{ fontFamily: "'Syne'", fontSize: "0.84rem" }}>{p.name}</span>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <Badge color={p.stock === 0 ? C.red : C.yellow}>{p.stock === 0 ? "AGOTADO" : `${p.stock}/${p.minStock} u.`}</Badge>
                        <Btn size="sm" onClick={() => { setShowMovement(p); setMovType("entrada"); setView("products"); }}>+ Reabastecer</Btn>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent movements */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "16px" }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontFamily: "'Syne'", fontWeight: 600, fontSize: "0.88rem" }}>Últimos Movimientos</span>
              </div>
              <div style={{ padding: "0.5rem 0" }}>
                {co.movements.slice(0, 5).map(m => (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 1.25rem", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: m.type === "entrada" ? `${C.green}22` : `${C.red}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>
                      {m.type === "entrada" ? "📥" : "📤"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontFamily: "'Syne'", fontSize: "0.84rem", fontWeight: 500 }}>{m.productName}</p>
                      <p style={{ margin: 0, color: C.textMuted, fontSize: "0.74rem", fontFamily: "'Syne'" }}>{m.note} · {m.date}</p>
                    </div>
                    <Badge color={m.type === "entrada" ? C.green : C.red}>{m.type === "entrada" ? "+" : "-"}{m.qty} u.</Badge>
                  </div>
                ))}
                {co.movements.length === 0 && (
                  <p style={{ color: C.textMuted, fontFamily: "'Syne'", fontSize: "0.82rem", textAlign: "center", padding: "1.5rem" }}>Sin movimientos aún</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* INVENTORY */}
        {view === "products" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div>
                <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: "2rem", margin: "0 0 0.25rem" }}>Inventario</h2>
                <p style={{ color: C.textMuted, fontFamily: "'Syne'", fontSize: "0.82rem", margin: 0 }}>{co.products.length} productos registrados</p>
              </div>
              <Btn onClick={() => setShowAddProduct(true)}>+ Agregar Producto</Btn>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: "1 1 200px" }}>
                <span style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)", color: C.textMuted, fontSize: "0.85rem" }}>🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, SKU..." style={{
                  width: "100%", padding: "0.65rem 0.9rem 0.65rem 2.2rem", borderRadius: "10px",
                  background: C.surface, border: `1.5px solid ${C.border}`, color: C.text,
                  fontFamily: "'Syne'", fontSize: "0.84rem", outline: "none", boxSizing: "border-box",
                }} />
              </div>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {["all", ...categories].map(cat => (
                  <button key={cat} onClick={() => setCatFilter(cat)} style={{
                    padding: "0.5rem 1rem", borderRadius: "8px", border: "none", cursor: "pointer",
                    background: catFilter === cat ? `${C.accent}33` : C.surface,
                    color: catFilter === cat ? C.accentLight : C.textMuted,
                    fontFamily: "'Syne'", fontSize: "0.78rem", fontWeight: 600, transition: "all .2s",
                    border: catFilter === cat ? `1px solid ${C.accent}66` : `1px solid ${C.border}`,
                  }}>{cat === "all" ? "Todos" : cat}</button>
                ))}
              </div>
            </div>

            {/* Products grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {filteredProducts.map(p => {
                const margin = p.price > 0 ? (((p.price - p.cost) / p.price) * 100).toFixed(0) : 0;
                const isLow = p.stock <= p.minStock;
                return (
                  <div key={p.id} style={{ background: C.surface, border: `1px solid ${isLow ? `${C.yellow}44` : C.border}`, borderRadius: "14px", padding: "1.25rem", position: "relative", overflow: "hidden" }}>
                    {isLow && <div style={{ position: "absolute", top: 0, right: 0, background: `${C.yellow}22`, padding: "0.25rem 0.7rem", borderBottomLeftRadius: "10px", fontSize: "0.65rem", color: C.yellow, fontFamily: "'Syne'", fontWeight: 700 }}>⚠️ Stock bajo</div>}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontFamily: "'Syne'", fontWeight: 700, fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</p>
                        <p style={{ margin: "2px 0 0", color: C.textMuted, fontFamily: "'DM Mono'", fontSize: "0.72rem" }}>{p.sku}</p>
                      </div>
                      <Badge color={C.textDim}>{p.category}</Badge>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.85rem" }}>
                      <div style={{ background: C.surfaceHigh, borderRadius: "8px", padding: "0.5rem 0.7rem" }}>
                        <p style={{ margin: 0, color: C.textMuted, fontSize: "0.62rem", fontFamily: "'Syne'" }}>Stock</p>
                        <p style={{ margin: 0, fontFamily: "'DM Serif Display'", fontSize: "1.4rem", color: isLow ? C.yellow : C.text }}>{p.stock}</p>
                      </div>
                      <div style={{ background: C.surfaceHigh, borderRadius: "8px", padding: "0.5rem 0.7rem" }}>
                        <p style={{ margin: 0, color: C.textMuted, fontSize: "0.62rem", fontFamily: "'Syne'" }}>Precio venta</p>
                        <p style={{ margin: 0, fontFamily: "'DM Mono'", fontSize: "0.88rem", color: C.accentLight }}>{fmt(p.price)}</p>
                      </div>
                      <div style={{ background: C.surfaceHigh, borderRadius: "8px", padding: "0.5rem 0.7rem" }}>
                        <p style={{ margin: 0, color: C.textMuted, fontSize: "0.62rem", fontFamily: "'Syne'" }}>Costo</p>
                        <p style={{ margin: 0, fontFamily: "'DM Mono'", fontSize: "0.88rem", color: C.textDim }}>{fmt(p.cost)}</p>
                      </div>
                      <div style={{ background: C.surfaceHigh, borderRadius: "8px", padding: "0.5rem 0.7rem" }}>
                        <p style={{ margin: 0, color: C.textMuted, fontSize: "0.62rem", fontFamily: "'Syne'" }}>Margen</p>
                        <p style={{ margin: 0, fontFamily: "'Syne'", fontSize: "0.88rem", fontWeight: 700, color: C.green }}>{margin}%</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button onClick={() => { setShowMovement(p); setMovType("salida"); }} style={{ flex: 1, padding: "0.45rem", borderRadius: "8px", background: `${C.red}18`, border: `1px solid ${C.red}33`, color: "#f87171", fontFamily: "'Syne'", fontSize: "0.74rem", fontWeight: 600, cursor: "pointer" }}>📤 Salida</button>
                      <button onClick={() => { setShowMovement(p); setMovType("entrada"); }} style={{ flex: 1, padding: "0.45rem", borderRadius: "8px", background: `${C.green}18`, border: `1px solid ${C.green}33`, color: "#34d399", fontFamily: "'Syne'", fontSize: "0.74rem", fontWeight: 600, cursor: "pointer" }}>📥 Entrada</button>
                      <button onClick={() => deleteProduct(p.id)} style={{ padding: "0.45rem 0.6rem", borderRadius: "8px", background: `${C.border}`, border: `1px solid ${C.border}`, color: C.textMuted, fontFamily: "'Syne'", fontSize: "0.74rem", cursor: "pointer" }}>🗑</button>
                    </div>
                    <p style={{ margin: "0.5rem 0 0", color: C.textMuted, fontSize: "0.65rem", fontFamily: "'Syne'" }}>📍 {p.location} · Actualizado: {p.lastUpdate}</p>
                  </div>
                );
              })}
              {filteredProducts.length === 0 && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: C.textMuted, fontFamily: "'Syne'" }}>
                  <p style={{ fontSize: "2rem" }}>📦</p>
                  <p>No se encontraron productos</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* MOVEMENTS */}
        {view === "movements" && (
          <>
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: "2rem", margin: "0 0 0.25rem" }}>Movimientos</h2>
              <p style={{ color: C.textMuted, fontFamily: "'Syne'", fontSize: "0.82rem", margin: 0 }}>Historial completo de entradas y salidas</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <StatCard label="Total entradas" value={co.movements.filter(m => m.type === "entrada").reduce((s, m) => s + m.qty, 0)} color={C.green} icon="📥" sub="Unidades ingresadas" />
              <StatCard label="Total salidas" value={co.movements.filter(m => m.type === "salida").reduce((s, m) => s + m.qty, 0)} color={C.red} icon="📤" sub="Unidades despachadas" />
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "16px", overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: C.surfaceHigh }}>
                      {["Tipo", "Producto", "Cantidad", "Fecha", "Nota", "Usuario"].map(h => (
                        <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: C.textMuted, fontSize: "0.7rem", fontFamily: "'Syne'", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {co.movements.map((m, i) => (
                      <tr key={m.id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : `${C.surfaceHigh}44` }}>
                        <td style={{ padding: "0.8rem 1rem" }}>
                          <Badge color={m.type === "entrada" ? C.green : C.red}>{m.type === "entrada" ? "📥 Entrada" : "📤 Salida"}</Badge>
                        </td>
                        <td style={{ padding: "0.8rem 1rem", fontFamily: "'Syne'", fontSize: "0.84rem" }}>{m.productName}</td>
                        <td style={{ padding: "0.8rem 1rem" }}>
                          <span style={{ fontFamily: "'DM Mono'", fontSize: "0.9rem", color: m.type === "entrada" ? C.green : C.red, fontWeight: 600 }}>
                            {m.type === "entrada" ? "+" : "-"}{m.qty}
                          </span>
                        </td>
                        <td style={{ padding: "0.8rem 1rem", color: C.textMuted, fontFamily: "'DM Mono'", fontSize: "0.8rem" }}>{m.date}</td>
                        <td style={{ padding: "0.8rem 1rem", color: C.textDim, fontFamily: "'Syne'", fontSize: "0.8rem", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.note}</td>
                        <td style={{ padding: "0.8rem 1rem", color: C.textMuted, fontFamily: "'Syne'", fontSize: "0.8rem" }}>{m.user}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {co.movements.length === 0 && (
                  <p style={{ color: C.textMuted, fontFamily: "'Syne'", fontSize: "0.82rem", textAlign: "center", padding: "2rem" }}>Sin movimientos registrados</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* ANALYSIS */}
        {view === "analysis" && (
          <>
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: "2rem", margin: "0 0 0.25rem" }}>Análisis Financiero</h2>
              <p style={{ color: C.textMuted, fontFamily: "'Syne'", fontSize: "0.82rem", margin: 0 }}>Indicadores clave de tu inventario</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
              <StatCard label="Valor total inventario" value={fmt(totalValue)} color={C.accentLight} icon="💎" sub="Al precio de venta" />
              <StatCard label="Costo total inventario" value={fmt(totalCostVal)} color={C.yellow} icon="📦" sub="Al precio de costo" />
              <StatCard label="Ganancia potencial" value={fmt(totalValue - totalCostVal)} color={C.green} icon="💰" sub="Si se vende todo el stock" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <StatCard label="Total ventas realizadas" value={fmt(totalSold)} color={C.green} icon="💸" />
              <StatCard label="Productos en stock crítico" value={lowStock.length} color={lowStock.length > 0 ? C.yellow : C.textDim} icon="⚠️" sub={`Mínimo recomendado no cumplido`} />
            </div>

            {/* Por categoría */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "1.25rem", marginBottom: "1rem" }}>
              <p style={{ margin: "0 0 1rem", fontFamily: "'Syne'", fontWeight: 600, fontSize: "0.88rem" }}>Inventario por Categoría</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {categories.map(cat => {
                  const prods = co.products.filter(p => p.category === cat);
                  const val = prods.reduce((s, p) => s + p.price * p.stock, 0);
                  const units = prods.reduce((s, p) => s + p.stock, 0);
                  const pct = totalValue > 0 ? (val / totalValue) * 100 : 0;
                  return (
                    <div key={cat}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontFamily: "'Syne'", fontSize: "0.82rem" }}>{cat}</span>
                        <span style={{ fontFamily: "'DM Mono'", fontSize: "0.8rem", color: C.accentLight }}>{fmt(val)} · {fmtNum(units)} u.</span>
                      </div>
                      <div style={{ height: "8px", background: C.surfaceHigh, borderRadius: "99px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${C.accent}, ${C.accentLight})`, borderRadius: "99px", transition: "width .8s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top productos por valor */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "16px", overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontFamily: "'Syne'", fontWeight: 600, fontSize: "0.88rem" }}>Top Productos por Valor en Stock</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: C.surfaceHigh }}>
                      {["Producto", "Stock", "Precio", "Costo", "Margen", "Valor stock"].map(h => (
                        <th key={h} style={{ padding: "0.7rem 1rem", textAlign: "left", color: C.textMuted, fontSize: "0.68rem", fontFamily: "'Syne'", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...co.products].sort((a, b) => (b.price * b.stock) - (a.price * a.stock)).map((p, i) => {
                      const margin = p.price > 0 ? (((p.price - p.cost) / p.price) * 100).toFixed(0) : 0;
                      return (
                        <tr key={p.id} style={{ borderTop: `1px solid ${C.border}` }}>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            <p style={{ margin: 0, fontFamily: "'Syne'", fontSize: "0.84rem", fontWeight: 500 }}>{p.name}</p>
                            <p style={{ margin: 0, color: C.textMuted, fontFamily: "'DM Mono'", fontSize: "0.7rem" }}>{p.sku}</p>
                          </td>
                          <td style={{ padding: "0.75rem 1rem", fontFamily: "'DM Mono'", fontSize: "0.88rem" }}>{fmtNum(p.stock)}</td>
                          <td style={{ padding: "0.75rem 1rem", fontFamily: "'DM Mono'", fontSize: "0.84rem", color: C.accentLight }}>{fmt(p.price)}</td>
                          <td style={{ padding: "0.75rem 1rem", fontFamily: "'DM Mono'", fontSize: "0.84rem", color: C.textMuted }}>{fmt(p.cost)}</td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            <Badge color={parseInt(margin) > 30 ? C.green : C.yellow}>{margin}%</Badge>
                          </td>
                          <td style={{ padding: "0.75rem 1rem", fontFamily: "'DM Mono'", fontSize: "0.9rem", fontWeight: 600, color: C.text }}>{fmt(p.price * p.stock)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal: Add product */}
      {showAddProduct && (
        <Modal title="Agregar Producto" onClose={() => setShowAddProduct(false)} width="500px">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
            <div style={{ gridColumn: "1/-1" }}><Input label="Nombre del producto *" value={newP.name} onChange={e => setNewP({ ...newP, name: e.target.value })} placeholder="Ej: Perfume X 35ml" /></div>
            <Input label="SKU / Código *" value={newP.sku} onChange={e => setNewP({ ...newP, sku: e.target.value })} placeholder="PRF-001" />
            <Input label="Categoría" value={newP.category} onChange={e => setNewP({ ...newP, category: e.target.value })} placeholder="Dama / Unisex..." />
            <Input label="Precio de venta" type="number" value={newP.price} onChange={e => setNewP({ ...newP, price: e.target.value })} placeholder="10000" />
            <Input label="Precio de costo" type="number" value={newP.cost} onChange={e => setNewP({ ...newP, cost: e.target.value })} placeholder="5500" />
            <Input label="Stock inicial" type="number" value={newP.stock} onChange={e => setNewP({ ...newP, stock: e.target.value })} placeholder="0" />
            <Input label="Stock mínimo (alerta)" type="number" value={newP.minStock} onChange={e => setNewP({ ...newP, minStock: e.target.value })} placeholder="5" />
            <div style={{ gridColumn: "1/-1" }}><Input label="Ubicación / Bodega" value={newP.location} onChange={e => setNewP({ ...newP, location: e.target.value })} placeholder="A-01" /></div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setShowAddProduct(false)}>Cancelar</Btn>
            <Btn onClick={addProduct}>Guardar producto</Btn>
          </div>
        </Modal>
      )}

      {/* Modal: Movement */}
      {showMovement && (
        <Modal title={`Registrar Movimiento — ${showMovement.name}`} onClose={() => setShowMovement(null)} width="420px">
          <div style={{ display: "flex", gap: "4px", background: C.bg, borderRadius: "10px", padding: "4px", marginBottom: "1.25rem" }}>
            {[{ key: "salida", label: "📤 Salida" }, { key: "entrada", label: "📥 Entrada" }].map(t => (
              <button key={t.key} onClick={() => setMovType(t.key)} style={{
                flex: 1, padding: "0.55rem", borderRadius: "8px", border: "none", cursor: "pointer",
                fontFamily: "'Syne'", fontSize: "0.82rem", fontWeight: 600, transition: "all .2s",
                background: movType === t.key ? (t.key === "salida" ? `${C.red}33` : `${C.green}33`) : "transparent",
                color: movType === t.key ? (t.key === "salida" ? "#f87171" : "#34d399") : C.textMuted,
              }}>{t.label}</button>
            ))}
          </div>
          <div style={{ background: C.surfaceHigh, borderRadius: "10px", padding: "0.75rem 1rem", marginBottom: "1rem", display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: C.textMuted, fontFamily: "'Syne'", fontSize: "0.82rem" }}>Stock actual</span>
            <span style={{ fontFamily: "'DM Serif Display'", fontSize: "1.3rem" }}>{showMovement.stock} u.</span>
          </div>
          <Input label="Cantidad *" type="number" value={movQty} onChange={e => setMovQty(e.target.value)} placeholder="Ej: 5" />
          <Input label="Nota / Observación" value={movNote} onChange={e => setMovNote(e.target.value)} placeholder="Ej: Pedido cliente #123" />
          {movType === "salida" && parseInt(movQty) > showMovement.stock && (
            <div style={{ background: `${C.red}15`, border: `1px solid ${C.red}44`, borderRadius: "8px", padding: "0.6rem 0.8rem", marginBottom: "0.75rem", color: "#fca5a5", fontSize: "0.78rem", fontFamily: "'Syne'" }}>
              ⚠️ Cantidad supera el stock disponible ({showMovement.stock} u.)
            </div>
          )}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setShowMovement(null)}>Cancelar</Btn>
            <Btn variant={movType === "salida" ? "danger" : "success"} onClick={registerMovement} disabled={!movQty || (movType === "salida" && parseInt(movQty) > showMovement.stock)}>
              Registrar {movType}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════ */
export default function App() {
  const [session, setSession] = useState(null);
  const [data, saveData] = useData();

  const handleLogin = useCallback((s) => setSession(s), []);
  const handleLogout = useCallback(() => setSession(null), []);

  const handleSaveCompany = useCallback((updatedCo) => {
    if (!data) return;
    saveData({ ...data, companies: data.companies.map(c => c.id === updatedCo.id ? updatedCo : c) });
  }, [data, saveData]);

  const currentCompany = session?.role === "company" && data
    ? data.companies.find(c => c.id === session.companyId)
    : null;

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>📦</div>
          <p style={{ color: C.textMuted, fontFamily: "'Syne', sans-serif", fontSize: "0.9rem" }}>Cargando InvManager...</p>
        </div>
      </div>
    );
  }

  if (!session) return <LoginPage onLogin={handleLogin} data={data} />;
  if (session.role === "admin") return <AdminDashboard data={data} onSave={saveData} onLogout={handleLogout} />;
  if (session.role === "company" && currentCompany) return <CompanyDashboard company={currentCompany} onSaveCompany={handleSaveCompany} onLogout={handleLogout} />;

  return <LoginPage onLogin={handleLogin} data={data} />;
}

/* ═══════════════════════════════════════════════════
   GLOBAL STYLES injection
═══════════════════════════════════════════════════ */
const styleTag = document.createElement("style");
styleTag.textContent = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
  ::-webkit-scrollbar { width: 5px; background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.accent}66; border-radius: 3px; }
  button { transition: opacity .15s ease; }
  button:hover { opacity: 0.88; }
  input::placeholder { color: ${C.textMuted}; }
  select option { background: ${C.surface}; }
`;
if (!document.getElementById("invmanager-styles")) {
  styleTag.id = "invmanager-styles";
  document.head.appendChild(styleTag);
}
