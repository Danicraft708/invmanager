// ─── PERFUMERY — Firebase Sync Edition ───────────────────────
// Instalar: npm install firebase
// Este archivo reemplaza src/App.js en tu proyecto de Perfumery
// ACTUALIZACIÓN: Historial de recibos cargado desde Firebase 🔗

import { memo, useCallback, useState, useEffect } from 'react';
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

/* ═══════════════════════════════════════════════════
   FIREBASE CONFIG — misma config que InvManager
═══════════════════════════════════════════════════ */
const firebaseConfig = {
  apiKey: "AIzaSyCFVH-yH1dRqCZrfF02f_lF9eV7GXkfQAw",
  authDomain: "invmanager-68f91.firebaseapp.com",
  projectId: "invmanager-68f91",
  storageBucket: "invmanager-68f91.firebasestorage.app",
  messagingSenderId: "799009337219",
  appId: "1:799009337219:web:939d4e9f0fb112977d10b6",
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(firebaseApp);
const DATA_DOC = doc(db, "inventario", "main");

const PERFUMERY_COMPANY_ID = 'c001';
const WHATSAPP_NUMBER = '573224776053';
const ADMIN_PASSWORD = 'perfumery2025';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap');`;

const T = {
  bg:'#f5f0e8', bgDark:'#1a1208', bgCard:'#fffdf8', text:'#1a1208',
  textMuted:'#7a6a55', border:'rgba(139,100,50,0.15)', gold:'#b8892a',
  goldLight:'#d4aa55', goldGlow:'rgba(184,137,42,0.25)',
  shadow:'0 4px 24px rgba(0,0,0,0.08)', shadowLg:'0 12px 48px rgba(0,0,0,0.16)',
  divider:'rgba(184,137,42,0.3)',
  adminRed: '#dc2626', adminGreen: '#16a34a',
};

/* ═══════════════════════════════════════════════════
   CATÁLOGO — 13 productos sincronizados con InvManager
═══════════════════════════════════════════════════ */
const CATALOG = {
  dama: [
    { id:'d1', name:'Olimpya',      price:10000, ml:'35 ml', badge:'top', img:'/img/olimpya.jpg',
      description:'Aroma ambarado y fresco con distintiva nota de vainilla salada. Sensual y poderosa.',
      notes:['Jazmín acuático','Mandarina','Ámbar gris','Cachemira'], invSku:'OLI-001', invId:'p1' },
    { id:'d2', name:'Ralph Lauren', price:10000, ml:'35 ml', badge:'new', img:'/img/ralph.jpg',
      description:'Fragancia floral frutal con hojas de manzano, mandarina italiana y osmanto japonés.',
      notes:['Manzano','Fresia','Magnolia','Iris blanco'], invSku:'RAL-001', invId:'p2' },
    { id:'d3', name:'Loco x Ty',    price:10000, ml:'35 ml', badge:'hot', img:'/img/locoxty.jpg',
      description:'Combinación vibrante de fresa, grosellas negras y casis. Dulce y seductor.',
      notes:['Fresa','Grosella','Peonía','Vainilla'], invSku:'LOC-001', invId:'p7' },
    { id:'d4', name:'Ariana Cloud', price:10000, ml:'35 ml', badge:'new', img:'/img/ariana.jpg',
      description:'Lavanda, pera y bergamota con corazón de crema batida, coco y orquídea de vainilla.',
      notes:['Lavanda','Pera','Coco','Almizcle'], invSku:'ARI-001', invId:'p8' },
    { id:'d5', name:'Bella',        price:10000, ml:'35 ml', badge:null,  img:'/img/bella.jpg',
      description:'Grosella negra y pera con fondo profundo de praliné, vainilla, pachulí y haba tonka.',
      notes:['Grosella','Pera','Praliné','Haba tonka'], invSku:'BEL-001', invId:'p9' },
    { id:'d6', name:'212 VIP Rose', price:10000, ml:'35 ml', badge:'top', img:'/img/212rose.jpg',
      description:'Champagne rosé chispeante, pimienta rosa, flor de duraznero y base de almizcle blanco.',
      notes:['Champagne','Pimienta rosa','Durazno','Ámbar'], invSku:'VIP-001', invId:'p10' },
    { id:'d7', name:'Good Girl',    price:10000, ml:'35 ml', badge:'hot', img:'/img/goodgirl.jpg',
      description:'Almendra, café, jazmín sambac, nardos, haba tonka y cacao. Intenso y sofisticado.',
      notes:['Café','Jazmín','Almendra','Cacao'], invSku:'GOO-001', invId:'p3' },
  ],
  unisex: [
    { id:'u1', name:'Oddisey',     price:10000, ml:'35 ml', badge:'new', img:'/img/oddisey.jpg',
      description:'Mandarina, naranja, azafrán y salvia con base de ambroxan, cedro y vetiver.',
      notes:['Azafrán','Caramelo','Cedro','Vetiver'], invSku:'ODD-001', invId:'p6' },
    { id:'u2', name:'Issy Miyake', price:10000, ml:'35 ml', badge:null,  img:'/img/issy.jpg',
      description:'Rosa de loto, peonías y lirios blancos sobre madera exótica, ámbar y sándalo.',
      notes:['Rosa loto','Peonía','Sándalo','Cedro'], invSku:'ISS-001', invId:'p13' },
  ],
  caballero: [
    { id:'c1', name:'Invictus',   price:10000, ml:'35 ml', badge:'top', img:'/img/invictus.jpg',
      description:'Amaderada acuática icónica. Toronja, notas marinas, laurel, madera de gaiac y ámbar.',
      notes:['Toronja','Notas marinas','Laurel','Ámbar gris'], invSku:'INV-001', invId:'p4' },
    { id:'c2', name:'Lapidus',    price:10000, ml:'35 ml', badge:null,  img:'/img/lapidus.jpg',
      description:'Intensa y oriental. Miel, piña, incienso y pino sobre base de tabaco y pachulí.',
      notes:['Miel','Piña','Incienso','Pachulí'], invSku:'LAP-001', invId:'p11' },
    { id:'c3', name:'Solo',       price:10000, ml:'35 ml', badge:'hot', img:'/img/solo.jpg',
      description:'Maderosa cítrica de intensidad muy alta. Mandarina, jengibre y cuero.',
      notes:['Mandarina','Jengibre','Cuero','Madera'], invSku:'SOL-001', invId:'p12' },
    { id:'c4', name:'One Millón', price:10000, ml:'35 ml', badge:'top', img:'/img/million.jpg',
      description:'Menta, mandarina roja y pomelo con canela, rosa, cuero y pachulí hindú.',
      notes:['Menta','Canela','Cuero','Pachulí'], invSku:'ONE-001', invId:'p5' },
  ],
};

const ALL_PRODUCTS = [...CATALOG.dama, ...CATALOG.unisex, ...CATALOG.caballero];

const CAT_STYLE = {
  dama:      { grad:'linear-gradient(135deg,#4a1530,#8b3560)', icon:'🌸', label:'Dama' },
  unisex:    { grad:'linear-gradient(135deg,#1a3a2a,#2d6a4f)', icon:'🌿', label:'Unisex' },
  caballero: { grad:'linear-gradient(135deg,#0f1e35,#1a3a5c)', icon:'🖤', label:'Caballero' },
};

const BADGE_STYLE = {
  hot: { bg:'linear-gradient(135deg,#c0392b,#e74c3c)', label:'🔥 Hot' },
  new: { bg:'linear-gradient(135deg,#1a6a3a,#27ae60)', label:'✨ Nuevo' },
  top: { bg:`linear-gradient(135deg,#b8892a,#d4aa55)`, label:'⭐ Top' },
};

const REVIEWS = {
  d1:[{name:'Laura M.',stars:5,text:'¡Me encantó! Dura todo el día y huele increíble.'},{name:'Camila R.',stars:5,text:'El mejor perfume que he probado.'}],
  d2:[{name:'Valentina G.',stars:4,text:'Muy fresco y femenino, ideal para el día.'},{name:'Sofía P.',stars:5,text:'Me lo compré y ya quiero otro frasco 😍'}],
  d3:[{name:'Daniela H.',stars:5,text:'Dulce sin ser empalagoso.'},{name:'Karen T.',stars:4,text:'Huele riquísimo, lo recomiendo 100%.'}],
  d4:[{name:'Mariana L.',stars:5,text:'Ariana no decepciona, este perfume es mágico.'},{name:'Juliana V.',stars:5,text:'Suavecito y elegante.'}],
  d5:[{name:'Andrea C.',stars:4,text:'Notas de praliné bien pronunciadas.'},{name:'Lucía F.',stars:5,text:'Mi favorito del catálogo.'}],
  d6:[{name:'Isabella M.',stars:5,text:'Glamoroso y chispeante, ideal para fiestas.'},{name:'Natalia O.',stars:4,text:'Se siente muy premium.'}],
  d7:[{name:'Gabriela S.',stars:5,text:'Oscuro y seductor, recibo piropos cada vez.'},{name:'Paulina R.',stars:5,text:'El café con jazmín es irresistible.'}],
  u1:[{name:'Tomás B.',stars:5,text:'Unisex de verdad, mi novia y yo lo usamos.'},{name:'Sebastián A.',stars:4,text:'Muy fresco, ideal para clima cálido.'}],
  u2:[{name:'Andrés Q.',stars:5,text:'Floral pero masculino, muy original.'},{name:'Felipe M.',stars:4,text:'Diferente a todo lo que he usado.'}],
  c1:[{name:'Santiago R.',stars:5,text:'El clásico de los clásicos, nunca falla.'},{name:'Mateo V.',stars:5,text:'Para reuniones importantes.'}],
  c2:[{name:'Nicolás H.',stars:4,text:'Oriental intenso, para los valientes.'},{name:'Diego C.',stars:5,text:'Amor a primera olfateada.'}],
  c3:[{name:'Camilo T.',stars:5,text:'Intensidad perfecta, dura muchísimo.'},{name:'Alejandro P.',stars:4,text:'Muy elegante.'}],
  c4:[{name:'Julián G.',stars:5,text:'One Million es un clásico garantizado.'},{name:'Esteban F.',stars:5,text:'El mejor de los caballeros.'}],
};

const uid = () => Math.random().toString(36).slice(2, 9);

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return w;
}

/* ═══════════════════════════════════════════════════
   FIREBASE HOOK — Sync con InvManager en tiempo real
   ✅ ACTUALIZADO: Carga historial de recibos desde Firebase
   Guarda: movimiento con receiptId + recibo completo
═══════════════════════════════════════════════════ */
function useFirebaseInvData() {
  const [invData, setInvData] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [connected, setConnected] = useState(false);
  const [fbReceipts, setFbReceipts] = useState([]); // ← recibos cargados desde Firebase

  useEffect(() => {
    const unsubscribe = onSnapshot(DATA_DOC, (snap) => {
      if (snap.exists()) {
        const raw = snap.data();
        const parsed = raw.payload ? JSON.parse(raw.payload) : raw;
        setInvData(parsed);
        setConnected(true);

        // ── AUTO-CARGA: convierte recibos Firebase → formato local del panel ──
        const co = parsed.companies?.find(c => c.id === PERFUMERY_COMPANY_ID);
        if (co?.receipts?.length > 0) {
          const converted = co.receipts.map(r => {
            const primerItem = r.items?.[0];
            return {
              folio: r.id || r.folio || `FB-${uid()}`,
              product: primerItem ? {
                name: primerItem.nombre || primerItem.name || "Producto",
                price: primerItem.precio || 0,
                ml: "35 ml",
                invSku: primerItem.sku || null,
              } : {
                name: r.productName || "Producto",
                price: r.total,
                ml: "35 ml",
                invSku: null,
              },
              qty: primerItem?.qty || 1,
              total: r.total,
              fecha: r.fecha || new Date().toISOString(),
              hora: r.fecha
                ? new Date(r.fecha).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
                : "--:--",
              clientName: r.cliente || r.clientName || null,
              payMethod: r.metodoPago || "Efectivo",
              nota: r.nota || null,
              _fromFirebase: true,
              _raw: r,
            };
          });
          setFbReceipts(converted);
        } else {
          setFbReceipts([]);
        }
      } else {
        setConnected(false);
        setFbReceipts([]);
      }
    }, (err) => {
      console.warn("Firebase no disponible:", err);
      setConnected(false);
    });
    return () => unsubscribe();
  }, []);

  // Registrar venta: descuenta stock + guarda movimiento (con receiptId) + guarda recibo
  const registrarVentaEnFirebase = useCallback(async (product, qty, nota, receiptData) => {
    setSyncing(true);
    try {
      const snap = await getDoc(DATA_DOC);
      if (!snap.exists()) return true;

      const raw = snap.data();
      const data = raw.payload ? JSON.parse(raw.payload) : raw;
      const coIdx = data.companies.findIndex(c => c.id === PERFUMERY_COMPANY_ID);
      if (coIdx === -1) return true;

      const co = data.companies[coIdx];

      const pIdx = co.products.findIndex(p =>
        (product.invSku && p.sku === product.invSku) ||
        (product.invId && p.id === product.invId) ||
        p.name.toLowerCase().includes(product.name.toLowerCase())
      );

      // Movimiento con receiptId → InvManager NO generará duplicado
      const mov = {
        id: `m${uid()}`,
        type: 'salida',
        productId: pIdx >= 0 ? co.products[pIdx].id : `ext-${product.id}`,
        productName: product.name,
        qty: parseInt(qty),
        date: new Date().toISOString().slice(0, 10),
        note: nota || `Venta web — ${product.ml}`,
        user: 'Tienda Web Perfumery',
        receiptId: receiptData?.folio || null, // ← evita duplicado en InvManager
        metodoPago: receiptData?.payMethod || 'Efectivo',
      };

      let updatedProducts = co.products;
      if (pIdx >= 0) {
        updatedProducts = co.products.map((p, i) =>
          i === pIdx
            ? { ...p, stock: Math.max(0, p.stock - parseInt(qty)), lastUpdate: new Date().toISOString().slice(0, 10) }
            : p
        );
      }

      // Recibo en formato InvManager estándar
      const fbReceipt = receiptData ? {
        id: receiptData.folio,
        fecha: new Date().toISOString(),
        cliente: receiptData.clientName || null,
        telefono: null,
        items: [{
          nombre: product.name,
          sku: product.invSku || null,
          qty: parseInt(qty),
          precio: product.price,
        }],
        subtotal: receiptData.total,
        descuento: 0,
        total: receiptData.total,
        metodoPago: receiptData.payMethod || 'Efectivo',
        vendedor: 'Tienda Web Perfumery',
        nota: nota || null,
      } : null;

      const updatedCo = {
        ...co,
        products: updatedProducts,
        movements: [mov, ...(co.movements || [])],
        receipts: fbReceipt
          ? [fbReceipt, ...(co.receipts || [])]
          : (co.receipts || []),
      };

      const newData = {
        ...data,
        companies: data.companies.map((c, i) => i === coIdx ? updatedCo : c),
      };

      await setDoc(DATA_DOC, { payload: JSON.stringify(newData), updatedAt: new Date().toISOString() });
      setInvData(newData);
    } catch (e) {
      console.warn('Firebase sync error:', e);
    } finally {
      setSyncing(false);
    }
    return true;
  }, []);

  return { invData, registrarVentaEnFirebase, syncing, connected, fbReceipts };
}

/* ═══════════════════════════════════════════════════
   COMPONENTES BASE
═══════════════════════════════════════════════════ */
function Stars({ n }) {
  return <span style={{color:'#f0b429',fontSize:'0.85rem',letterSpacing:'1px'}}>{'★'.repeat(n)}{'☆'.repeat(5-n)}</span>;
}

function Logo({ isMobile }) {
  const [src, setSrc] = useState('/img/logo.png');
  const fallbacks = ['/img/logo.png','/img/logo.jpg','/img/logo.jpeg','/img/logo.webp'];
  const [idx, setIdx] = useState(0);
  const handleError = () => { const n=idx+1; if(n<fallbacks.length){setIdx(n);setSrc(fallbacks[n]);} };
  return <img src={src} alt="Perfumery" onError={handleError} style={{ width:isMobile?'220px':'300px', height:isMobile?'220px':'300px', objectFit:'contain', animation:'float 4s ease-in-out infinite', filter:'drop-shadow(0 0 40px rgba(184,137,42,0.55))', display:'block', margin:'0 auto 1rem' }} />;
}

function Corners({ isMobile }) {
  const size=isMobile?'55px':'90px', thick='3px', thin='1px', g=T.gold, g2='rgba(184,137,42,0.35)';
  const corners=[{top:'16px',left:'16px'},{top:'16px',right:'16px'},{bottom:'16px',left:'16px'},{bottom:'16px',right:'16px'}];
  return corners.map((pos,i)=>{
    const isRight=!!pos.right, isBottom=!!pos.bottom;
    return <div key={i} style={{position:'absolute',width:size,height:size,pointerEvents:'none',...pos}}>
      <div style={{position:'absolute',[isBottom?'bottom':'top']:0,[isRight?'right':'left']:0,width:'100%',height:thick,background:`linear-gradient(${isRight?'to left':'to right'},${g},transparent)`,borderRadius:'2px'}}/>
      <div style={{position:'absolute',[isBottom?'bottom':'top']:0,[isRight?'right':'left']:0,width:thick,height:'100%',background:`linear-gradient(${isBottom?'to top':'to bottom'},${g},transparent)`,borderRadius:'2px'}}/>
      <div style={{position:'absolute',[isBottom?'bottom':'top']:'9px',[isRight?'right':'left']:'9px',width:'58%',height:thin,background:`linear-gradient(${isRight?'to left':'to right'},${g2},transparent)`}}/>
      <div style={{position:'absolute',[isBottom?'bottom':'top']:'9px',[isRight?'right':'left']:'9px',width:thin,height:'58%',background:`linear-gradient(${isBottom?'to top':'to bottom'},${g2},transparent)`}}/>
      <div style={{position:'absolute',[isBottom?'bottom':'top']:'4px',[isRight?'right':'left']:'4px',width:'6px',height:'6px',borderRadius:'50%',background:g,opacity:0.7}}/>
    </div>;
  });
}

function FirebaseIndicator({ connected, syncing }) {
  return (
    <div style={{ position:'fixed', bottom:'1.5rem', left:'1.5rem', zIndex:999, display:'flex', alignItems:'center', gap:'0.5rem', background:'rgba(26,18,8,0.9)', border:`1px solid ${syncing?'rgba(99,102,241,0.5)':connected?'rgba(16,185,129,0.4)':'rgba(239,68,68,0.3)'}`, borderRadius:'9999px', padding:'0.4rem 0.85rem', backdropFilter:'blur(8px)', boxShadow:'0 4px 20px rgba(0,0,0,0.4)' }}>
      <div style={{ width:'7px', height:'7px', borderRadius:'50%', background: syncing?'#6366f1':connected?'#10b981':'#ef4444', animation: syncing||connected ? 'pulseIndicator 2s ease infinite' : 'none', boxShadow:`0 0 6px ${syncing?'#6366f1':connected?'#10b981':'#ef4444'}` }}/>
      <span style={{color:syncing?'#818cf8':connected?'#34d399':'#f87171',fontFamily:"'Jost',sans-serif",fontSize:'0.68rem',fontWeight:600}}>
        {syncing ? 'Sincronizando...' : connected ? '🔗 Firebase conectado' : 'Sin conexión Firebase'}
      </span>
    </div>
  );
}

function AdminLoginModal({ onClose, onSuccess }) {
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (pass === ADMIN_PASSWORD) { onSuccess(); }
      else { setErr('Contraseña incorrecta'); setPass(''); }
    }, 500);
  };
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:2000,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(12px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',animation:'fadeIn 0.3s ease'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.bgCard,borderRadius:'24px',padding:'2.5rem 2rem',maxWidth:'360px',width:'100%',boxShadow:T.shadowLg,border:`1px solid ${T.divider}`,animation:'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)',position:'relative',textAlign:'center'}}>
        <button onClick={onClose} style={{position:'absolute',top:'0.85rem',right:'0.85rem',width:'32px',height:'32px',borderRadius:'50%',background:T.bg,border:`1px solid ${T.border}`,cursor:'pointer',fontSize:'0.9rem',color:T.textMuted}}>✕</button>
        <div style={{width:'60px',height:'60px',borderRadius:'18px',background:'linear-gradient(135deg,#1a1208,#2a1a08)',border:`1.5px solid ${T.divider}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1.25rem',fontSize:'1.6rem'}}>🔐</div>
        <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.6rem',fontWeight:600,color:T.text,margin:'0 0 0.4rem'}}>Modo Administrador</h2>
        <p style={{color:T.textMuted,fontSize:'0.82rem',fontFamily:"'Jost',sans-serif",margin:'0 0 1.5rem',lineHeight:1.5}}>Las ventas se sincronizan con InvManager via Firebase 🔗</p>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()} placeholder="Contraseña de admin" style={{width:'100%',padding:'0.75rem 1rem',borderRadius:'12px',border:`1.5px solid ${err?T.adminRed:T.border}`,background:T.bg,color:T.text,fontFamily:"'Jost',sans-serif",fontSize:'0.95rem',outline:'none',boxSizing:'border-box',marginBottom:'0.75rem',textAlign:'center',letterSpacing:'0.2em'}} onFocus={e=>e.target.style.borderColor=T.gold} onBlur={e=>e.target.style.borderColor=err?T.adminRed:T.border} autoFocus/>
        {err && <p style={{color:T.adminRed,fontSize:'0.78rem',fontFamily:"'Jost',sans-serif",margin:'0 0 0.75rem'}}>{err}</p>}
        <button onClick={handleLogin} disabled={loading} style={{width:'100%',padding:'0.75rem',borderRadius:'12px',background:`linear-gradient(135deg,${T.gold},${T.goldLight})`,color:'#fff',border:'none',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'0.95rem',fontWeight:600}}>
          {loading ? 'Verificando...' : 'Entrar como Admin'}
        </button>
        <p style={{color:T.textMuted,fontSize:'0.72rem',fontFamily:"'Jost',sans-serif",marginTop:'1rem'}}>Contraseña: <strong style={{color:T.gold}}>perfumery2025</strong></p>
      </div>
    </div>
  );
}

function imprimirRecibo({ product, qty, nota, total, folio, fecha, hora, clientName, payMethod }) {
  const ventana = window.open('', '_blank', 'width=400,height=650');
  if (!ventana) { alert('Permite las ventanas emergentes para imprimir.'); return; }
  ventana.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/><title>Recibo #${folio}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Jost:wght@400;600&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Jost',sans-serif;background:#fff;color:#1a1208;padding:0}
  .recibo{max-width:360px;margin:0 auto;padding:2rem 1.5rem 1.5rem}
  .header{text-align:center;padding-bottom:1.25rem;border-bottom:2px dashed #d4aa55;margin-bottom:1.25rem}
  .logo{width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#b8892a,#d4aa55);display:flex;align-items:center;justify-content:center;margin:0 auto .75rem;font-size:1.6rem}
  .store-name{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:600;color:#1a1208}
  .store-sub{font-size:.7rem;color:#7a6a55;letter-spacing:.18em;text-transform:uppercase;margin-top:.2rem}
  .folio{display:inline-block;background:#f5f0e8;border:1px solid rgba(184,137,42,.3);border-radius:8px;padding:.28rem .85rem;margin-top:.7rem;font-size:.76rem;color:#b8892a;font-weight:700;letter-spacing:.1em}
  .meta{display:flex;justify-content:space-between;margin-bottom:1rem;background:#f5f0e8;border-radius:10px;padding:.6rem .85rem}
  .meta-item{font-size:.73rem;color:#7a6a55}
  .meta-item strong{color:#1a1208;display:block;font-size:.8rem}
  .section-title{font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:#b8892a;font-weight:700;margin-bottom:.45rem}
  .product-row{display:flex;justify-content:space-between;align-items:flex-start;padding:.7rem 0;border-bottom:1px solid rgba(139,100,50,.12)}
  .product-name{font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:600;color:#1a1208}
  .product-detail{font-size:.7rem;color:#7a6a55;margin-top:2px}
  .product-price{text-align:right;font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:600;color:#b8892a}
  .totals{margin:1rem 0}
  .total-row{display:flex;justify-content:space-between;padding:.28rem 0;font-size:.8rem;color:#7a6a55}
  .total-main{border-top:2px solid rgba(184,137,42,.3);margin-top:.45rem;padding-top:.7rem;font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:600;color:#1a1208}
  .total-main span:last-child{color:#16a34a}
  .stamp-wrap{text-align:center;margin:1rem 0}
  .stamp{display:inline-block;border:3px solid #16a34a;border-radius:8px;padding:.38rem 1.4rem;color:#16a34a;font-size:1.4rem;font-weight:700;font-family:'Cormorant Garamond',serif;letter-spacing:.2em;transform:rotate(-4deg);opacity:.85}
  .footer{border-top:2px dashed rgba(184,137,42,.4);padding-top:1rem;text-align:center;margin-top:1rem}
  .footer p{font-size:.68rem;color:#7a6a55;line-height:1.6}
  .footer .thanks{font-family:'Cormorant Garamond',serif;font-size:1rem;color:#b8892a;margin-bottom:.25rem}
  .barcode{font-family:monospace;font-size:.52rem;letter-spacing:.06em;color:#c5b49a;margin-top:.7rem;word-break:break-all}
  .firebase-badge{font-size:.58rem;color:rgba(99,102,241,.6);margin-top:.35rem;font-family:monospace}
  @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}.no-print{display:none!important}}
</style>
</head><body>
<div class="recibo">
  <div class="header">
    <div class="logo">🧴</div>
    <div class="store-name">Perfumery</div>
    <div class="store-sub">Olor que deja huellas · @sitioincreible</div>
    <div class="folio">RECIBO N° ${folio}</div>
  </div>
  <div class="meta">
    <div class="meta-item"><span>Fecha</span><strong>${fecha}</strong></div>
    <div class="meta-item" style="text-align:center"><span>Hora</span><strong>${hora}</strong></div>
    <div class="meta-item" style="text-align:right"><span>Pago</span><strong>${payMethod||'Efectivo'}</strong></div>
  </div>
  ${clientName?`<div class="meta"><div class="meta-item"><span>Cliente</span><strong>${clientName}</strong></div></div>`:''}
  <div class="section-title">Detalle de la venta</div>
  <div class="product-row">
    <div>
      <div class="product-name">${product.name}</div>
      <div class="product-detail">${product.ml} · ${product.invSku||'Aceite esencial'}</div>
      <div class="product-detail">Cantidad: <strong>${qty} unidad${parseInt(qty)>1?'es':''}</strong></div>
    </div>
    <div class="product-price">
      <div>$${product.price.toLocaleString('es-CO')}</div>
      <div style="font-size:.66rem;color:#7a6a55">c/u</div>
    </div>
  </div>
  <div class="totals">
    <div class="total-row"><span>Subtotal (${qty}×$${product.price.toLocaleString('es-CO')})</span><span>$${total.toLocaleString('es-CO')}</span></div>
    <div class="total-row"><span>Descuentos</span><span>$0</span></div>
    <div class="total-row total-main"><span>TOTAL</span><span>$${total.toLocaleString('es-CO')} COP</span></div>
  </div>
  ${nota?`<div style="background:#f5f0e8;border-left:3px solid #b8892a;border-radius:0 8px 8px 0;padding:.5rem .75rem;margin:.7rem 0 1rem;font-size:.75rem;color:#7a6a55;font-style:italic">📋 ${nota}</div>`:''}
  <div class="stamp-wrap"><div class="stamp">✓ PAGADO</div></div>
  <div class="footer">
    <div class="thanks">¡Gracias por tu compra!</div>
    <p>Válido como comprobante de pago.</p>
    <p>📱 WhatsApp: +57 322 477 6053</p>
    <div class="barcode">||||| ${folio} ||||| ${Date.now()} |||||</div>
    <div class="firebase-badge">🔗 Sincronizado con InvManager via Firebase</div>
  </div>
</div>
<div class="no-print" style="text-align:center;padding:1rem;background:#f5f0e8;border-top:1px solid rgba(184,137,42,.2);display:flex;gap:.5rem;justify-content:center">
  <button onclick="window.print()" style="padding:.6rem 1.8rem;background:linear-gradient(135deg,#b8892a,#d4aa55);color:#fff;border:none;border-radius:9999px;font-family:'Jost',sans-serif;font-size:.88rem;font-weight:700;cursor:pointer">🖨️ Imprimir</button>
  <button onclick="window.close()" style="padding:.6rem 1.4rem;background:transparent;color:#7a6a55;border:1.5px solid rgba(139,100,50,.3);border-radius:9999px;font-family:'Jost',sans-serif;font-size:.82rem;cursor:pointer">Cerrar</button>
</div>
</body></html>`);
  ventana.document.close();
}

function SaleModal({ product, onClose, onConfirm }) {
  const [qty, setQty] = useState('1');
  const [nota, setNota] = useState('');
  const [clientName, setClientName] = useState('');
  const [payMethod, setPayMethod] = useState('Efectivo');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const folio = useState(() => `PF-${Date.now().toString().slice(-6)}`)[0];
  const now = new Date();
  const fecha = now.toLocaleDateString('es-CO', { day:'2-digit', month:'long', year:'numeric' });
  const hora  = now.toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit' });

  const handleConfirm = async () => {
    if (!qty || parseInt(qty) < 1) return;
    setLoading(true);
    const total = product.price * parseInt(qty);
    const notaCompleta = [clientName && `Cliente: ${clientName}`, `Pago: ${payMethod}`, nota].filter(Boolean).join(' · ');
    const rd = { product, qty: parseInt(qty), nota: notaCompleta, total, folio, fecha, hora, clientName, payMethod };
    setReceiptData(rd);
    setDone(true);
    setLoading(false);
    onConfirm(product, qty, notaCompleta, rd).catch(() => {});
  };

  if (done && receiptData) return (
    <div style={{position:'fixed',inset:0,zIndex:2000,background:'rgba(0,0,0,0.88)',backdropFilter:'blur(12px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',animation:'fadeIn 0.3s ease',overflowY:'auto'}}>
      <div style={{background:T.bgCard,borderRadius:'24px',width:'100%',maxWidth:'440px',boxShadow:T.shadowLg,border:`1px solid ${T.divider}`,animation:'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)',overflow:'hidden'}}>
        <div style={{background:'linear-gradient(135deg,#16a34a,#22c55e)',padding:'1.5rem',textAlign:'center'}}>
          <div style={{width:'56px',height:'56px',borderRadius:'50%',background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 0.75rem',fontSize:'1.75rem',border:'2px solid rgba(255,255,255,0.4)'}}>✓</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.6rem',fontWeight:600,color:'#fff',margin:'0 0 0.2rem'}}>¡Venta registrada!</h2>
          <p style={{color:'rgba(255,255,255,0.8)',fontSize:'0.78rem',fontFamily:"'Jost',sans-serif",margin:0}}>Recibo N° {receiptData.folio}</p>
        </div>
        <div style={{padding:'1.25rem 1.5rem'}}>
          <div style={{background:T.bg,borderRadius:'14px',padding:'1rem 1.1rem',border:`1px solid ${T.divider}`,marginBottom:'1rem'}}>
            <div style={{textAlign:'center',marginBottom:'0.85rem',paddingBottom:'0.85rem',borderBottom:`1px dashed ${T.divider}`}}>
              <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.3rem',fontWeight:600,color:T.text,margin:0}}>Perfumery</p>
              <p style={{color:T.textMuted,fontSize:'0.65rem',fontFamily:"'Jost',sans-serif",margin:'2px 0 0',letterSpacing:'0.12em',textTransform:'uppercase'}}>@sitioincreible</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.4rem',marginBottom:'0.75rem'}}>
              {[
                {label:'Producto', val: receiptData.product.name},
                {label:'SKU', val: receiptData.product.invSku || '—'},
                {label:'Cantidad', val: `${receiptData.qty} u.`},
                {label:'Método', val: receiptData.payMethod},
              ].map((item,i)=>(
                <div key={i} style={{background:'#fff',borderRadius:'8px',padding:'0.4rem 0.6rem',border:`1px solid ${T.border}`}}>
                  <p style={{color:T.textMuted,fontSize:'0.6rem',fontFamily:"'Jost',sans-serif",textTransform:'uppercase',letterSpacing:'0.1em',margin:'0 0 1px'}}>{item.label}</p>
                  <p style={{color:T.text,fontSize:'0.78rem',fontFamily:"'Jost',sans-serif",fontWeight:600,margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.val}</p>
                </div>
              ))}
            </div>
            {receiptData.clientName && (
              <div style={{background:'#fff',borderRadius:'8px',padding:'0.4rem 0.6rem',border:`1px solid ${T.border}`,marginBottom:'0.4rem'}}>
                <p style={{color:T.textMuted,fontSize:'0.6rem',fontFamily:"'Jost',sans-serif",textTransform:'uppercase',letterSpacing:'0.1em',margin:'0 0 1px'}}>Cliente</p>
                <p style={{color:T.text,fontSize:'0.78rem',fontFamily:"'Jost',sans-serif",fontWeight:600,margin:0}}>{receiptData.clientName}</p>
              </div>
            )}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'#fff',borderRadius:'10px',padding:'0.65rem 0.85rem',border:`1.5px solid rgba(22,163,74,0.3)`,marginTop:'0.4rem'}}>
              <span style={{fontFamily:"'Jost',sans-serif",fontWeight:700,fontSize:'0.82rem',color:T.text}}>TOTAL PAGADO</span>
              <span style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.4rem',fontWeight:600,color:'#16a34a'}}>${receiptData.total.toLocaleString('es-CO')} <span style={{fontSize:'0.7rem',fontWeight:400,color:T.textMuted}}>COP</span></span>
            </div>
            <div style={{textAlign:'center',marginTop:'0.75rem'}}>
              <span style={{display:'inline-block',border:'2.5px solid #16a34a',borderRadius:'6px',padding:'0.2rem 1.2rem',color:'#16a34a',fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.1rem',fontWeight:700,letterSpacing:'0.2em',transform:'rotate(-3deg)',opacity:0.85}}>✓ PAGADO</span>
            </div>
          </div>
          <div style={{background:'rgba(99,102,241,0.06)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:'10px',padding:'0.6rem 0.85rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <span>🔗</span>
            <p style={{color:'#6366f1',fontSize:'0.74rem',fontFamily:"'Jost',sans-serif",margin:0}}>Recibo guardado en <strong>InvManager</strong> via Firebase — visible en admin@perfumery.co</p>
          </div>
          <div style={{display:'flex',gap:'0.5rem'}}>
            <button onClick={()=>imprimirRecibo(receiptData)} style={{flex:2,padding:'0.75rem',borderRadius:'12px',background:`linear-gradient(135deg,${T.gold},${T.goldLight})`,color:'#fff',border:'none',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'0.9rem',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',gap:'0.4rem'}}>
              🖨️ Imprimir recibo
            </button>
            <button onClick={onClose} style={{flex:1,padding:'0.75rem',borderRadius:'12px',background:'transparent',border:`1.5px solid ${T.border}`,color:T.textMuted,cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'0.82rem'}}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:2000,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(12px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',animation:'fadeIn 0.3s ease',overflowY:'auto'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.bgCard,borderRadius:'24px',padding:'2rem',maxWidth:'440px',width:'100%',boxShadow:T.shadowLg,border:`1px solid ${T.divider}`,animation:'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)',position:'relative'}}>
        <button onClick={onClose} style={{position:'absolute',top:'0.85rem',right:'0.85rem',width:'32px',height:'32px',borderRadius:'50%',background:T.bg,border:`1px solid ${T.border}`,cursor:'pointer',fontSize:'0.9rem',color:T.textMuted}}>✕</button>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'1.25rem',paddingBottom:'1.25rem',borderBottom:`1px solid ${T.divider}`}}>
          <div style={{width:'44px',height:'44px',borderRadius:'12px',background:'linear-gradient(135deg,#16a34a,#22c55e)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0}}>💸</div>
          <div>
            <p style={{color:T.gold,fontSize:'0.62rem',fontFamily:"'Jost',sans-serif",letterSpacing:'0.15em',textTransform:'uppercase',fontWeight:600,margin:0}}>Registrar venta</p>
            <h3 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.3rem',fontWeight:600,color:T.text,margin:0}}>{product.name} <span style={{color:T.textMuted,fontSize:'0.8rem'}}>· {product.invSku}</span></h3>
          </div>
        </div>
        <div style={{background:T.bg,borderRadius:'12px',padding:'0.9rem 1rem',marginBottom:'1.1rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <p style={{color:T.textMuted,fontSize:'0.7rem',fontFamily:"'Jost',sans-serif",margin:'0 0 2px'}}>Precio unitario</p>
            <p style={{color:T.gold,fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.5rem',fontWeight:600,margin:0}}>${product.price.toLocaleString('es-CO')}</p>
          </div>
          <div style={{textAlign:'right'}}>
            <p style={{color:T.textMuted,fontSize:'0.7rem',fontFamily:"'Jost',sans-serif",margin:'0 0 2px'}}>Total</p>
            <p style={{color:T.adminGreen,fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.5rem',fontWeight:600,margin:0}}>${(product.price*(parseInt(qty)||1)).toLocaleString('es-CO')}</p>
          </div>
        </div>
        <div style={{marginBottom:'0.9rem'}}>
          <label style={{display:'block',color:T.textMuted,fontSize:'0.72rem',fontFamily:"'Jost',sans-serif",letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:600,marginBottom:'0.4rem'}}>📦 Cantidad</label>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <button onClick={()=>setQty(q=>String(Math.max(1,parseInt(q||1)-1)))} style={{width:'38px',height:'38px',borderRadius:'10px',border:`1.5px solid ${T.border}`,background:T.bg,color:T.text,fontSize:'1.2rem',cursor:'pointer'}}>−</button>
            <input type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)} style={{flex:1,padding:'0.6rem',borderRadius:'10px',border:`1.5px solid ${T.border}`,background:T.bg,color:T.text,fontFamily:"'Jost',sans-serif",fontSize:'1.1rem',fontWeight:600,outline:'none',textAlign:'center'}}/>
            <button onClick={()=>setQty(q=>String(parseInt(q||1)+1))} style={{width:'38px',height:'38px',borderRadius:'10px',border:`1.5px solid ${T.border}`,background:T.bg,color:T.text,fontSize:'1.2rem',cursor:'pointer'}}>+</button>
          </div>
        </div>
        <div style={{marginBottom:'0.9rem'}}>
          <label style={{display:'block',color:T.textMuted,fontSize:'0.72rem',fontFamily:"'Jost',sans-serif",letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:600,marginBottom:'0.4rem'}}>👤 Nombre del cliente (opcional)</label>
          <input type="text" value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="Ej: María González" style={{width:'100%',padding:'0.65rem 0.9rem',borderRadius:'10px',border:`1.5px solid ${T.border}`,background:T.bg,color:T.text,fontFamily:"'Jost',sans-serif",fontSize:'0.9rem',outline:'none',boxSizing:'border-box'}}/>
        </div>
        <div style={{marginBottom:'0.9rem'}}>
          <label style={{display:'block',color:T.textMuted,fontSize:'0.72rem',fontFamily:"'Jost',sans-serif",letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:600,marginBottom:'0.4rem'}}>💳 Método de pago</label>
          <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
            {['Efectivo','Transferencia','Nequi','Daviplata','Tarjeta'].map(m=>(
              <button key={m} onClick={()=>setPayMethod(m)} style={{padding:'0.4rem 0.85rem',borderRadius:'9999px',border:`1.5px solid ${payMethod===m?T.gold:T.border}`,background:payMethod===m?T.goldGlow:'transparent',color:payMethod===m?T.gold:T.textMuted,fontFamily:"'Jost',sans-serif",fontSize:'0.78rem',fontWeight:600,cursor:'pointer'}}>
                {m}
              </button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:'1.1rem'}}>
          <label style={{display:'block',color:T.textMuted,fontSize:'0.72rem',fontFamily:"'Jost',sans-serif",letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:600,marginBottom:'0.4rem'}}>📋 Nota adicional</label>
          <input type="text" value={nota} onChange={e=>setNota(e.target.value)} placeholder="Ej: Pedido para regalo" style={{width:'100%',padding:'0.65rem 0.9rem',borderRadius:'10px',border:`1.5px solid ${T.border}`,background:T.bg,color:T.text,fontFamily:"'Jost',sans-serif",fontSize:'0.9rem',outline:'none',boxSizing:'border-box'}}/>
        </div>
        <div style={{background:'rgba(99,102,241,0.06)',border:'1px solid rgba(99,102,241,0.18)',borderRadius:'10px',padding:'0.6rem 0.85rem',marginBottom:'1.1rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
          <span>🔗</span>
          <p style={{color:'#6366f1',fontSize:'0.74rem',fontFamily:"'Jost',sans-serif",margin:0}}>Se sincronizará con <strong>InvManager</strong> · Recibo guardado automáticamente en historial</p>
        </div>
        <div style={{display:'flex',gap:'0.65rem'}}>
          <button onClick={onClose} style={{flex:1,padding:'0.7rem',borderRadius:'12px',background:'transparent',border:`1.5px solid ${T.border}`,color:T.textMuted,cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'0.88rem'}}>Cancelar</button>
          <button onClick={handleConfirm} disabled={loading||!qty||parseInt(qty)<1}
            style={{flex:2,padding:'0.7rem',borderRadius:'12px',background:'linear-gradient(135deg,#16a34a,#22c55e)',color:'#fff',border:'none',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'0.9rem',fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center',gap:'0.4rem'}}>
            {loading ? '⏳ Registrando...' : <><span>✓</span> Confirmar venta</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReciboModal({ receipt, onClose }) {
  const { product, qty, nota, total, folio, fecha, hora, clientName, payMethod } = receipt;
  return (
    <div style={{position:'fixed',inset:0,zIndex:3000,background:'rgba(0,0,0,0.92)',backdropFilter:'blur(16px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',animation:'fadeIn 0.3s ease',overflowY:'auto'}}>
      <div style={{width:'100%',maxWidth:'380px',animation:'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)'}}>
        <div style={{background:'#fffdf8',borderRadius:'4px 4px 0 0',padding:'1.75rem 1.75rem 1.25rem',fontFamily:"'Jost',sans-serif",color:'#1a1208',position:'relative',boxShadow:'0 4px 40px rgba(0,0,0,0.5)'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:'4px',background:`linear-gradient(90deg,${T.gold},${T.goldLight},${T.gold})`}}/>
          <div style={{textAlign:'center',marginBottom:'1.1rem',paddingBottom:'1.1rem',borderBottom:'2px dashed rgba(184,137,42,0.35)'}}>
            <div style={{width:'50px',height:'50px',borderRadius:'50%',background:`linear-gradient(135deg,${T.gold},${T.goldLight})`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 0.55rem',fontSize:'1.4rem'}}>🧴</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.8rem',fontWeight:600,margin:'0 0 0.1rem',color:'#1a1208'}}>Perfumery</h2>
            <p style={{fontSize:'0.6rem',color:'#7a6a55',letterSpacing:'0.16em',textTransform:'uppercase',margin:'0 0 0.55rem'}}>Olor que deja huellas</p>
            <div style={{display:'inline-block',background:'#f5f0e8',border:`1px solid ${T.divider}`,borderRadius:'6px',padding:'0.2rem 0.8rem',fontSize:'0.7rem',color:T.gold,fontWeight:700}}>RECIBO N° {folio}</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0.35rem',marginBottom:'0.85rem'}}>
            {[{label:'Fecha',val:fecha},{label:'Hora',val:hora},{label:'Cajero',val:'Admin'}].map((item,i)=>(
              <div key={i} style={{background:'#f5f0e8',borderRadius:'8px',padding:'0.4rem 0.5rem',textAlign:'center'}}>
                <p style={{color:'#7a6a55',fontSize:'0.56rem',textTransform:'uppercase',margin:'0 0 2px'}}>{item.label}</p>
                <p style={{color:'#1a1208',fontSize:'0.7rem',fontWeight:600,margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.val}</p>
              </div>
            ))}
          </div>
          {(clientName||payMethod)&&(
            <div style={{display:'grid',gridTemplateColumns:clientName?'1fr 1fr':'1fr',gap:'0.35rem',marginBottom:'0.85rem'}}>
              {clientName&&<div style={{background:'#f5f0e8',borderRadius:'8px',padding:'0.4rem 0.65rem'}}><p style={{color:'#7a6a55',fontSize:'0.56rem',textTransform:'uppercase',margin:'0 0 2px'}}>Cliente</p><p style={{color:'#1a1208',fontSize:'0.78rem',fontWeight:600,margin:0}}>{clientName}</p></div>}
              <div style={{background:'#f5f0e8',borderRadius:'8px',padding:'0.4rem 0.65rem'}}><p style={{color:'#7a6a55',fontSize:'0.56rem',textTransform:'uppercase',margin:'0 0 2px'}}>Método</p><p style={{color:'#1a1208',fontSize:'0.78rem',fontWeight:600,margin:0}}>{payMethod}</p></div>
            </div>
          )}
          <p style={{color:T.gold,fontSize:'0.58rem',letterSpacing:'0.18em',textTransform:'uppercase',fontWeight:600,margin:'0 0 0.45rem'}}>Detalle</p>
          <div style={{borderTop:'1px solid rgba(139,100,50,0.15)',borderBottom:'1px solid rgba(139,100,50,0.15)',padding:'0.7rem 0',marginBottom:'0.75rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div>
                <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.15rem',fontWeight:600,margin:'0 0 2px',color:'#1a1208'}}>{product.name}</p>
                <p style={{fontSize:'0.68rem',color:'#7a6a55',margin:'0 0 1px'}}>SKU: {product.invSku || '—'} · {product.ml}</p>
                <p style={{fontSize:'0.68rem',color:'#7a6a55',margin:0}}>Cant: <strong>{qty}</strong> × ${product.price.toLocaleString('es-CO')}</p>
              </div>
              <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.15rem',fontWeight:600,color:T.gold,margin:0,whiteSpace:'nowrap'}}>${total.toLocaleString('es-CO')}</p>
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'#f5f0e8',borderRadius:'10px',padding:'0.55rem 0.75rem',border:'1.5px solid rgba(22,163,74,0.25)',marginBottom:'0.75rem'}}>
            <span style={{fontWeight:700,fontSize:'0.8rem'}}>TOTAL PAGADO</span>
            <span style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.3rem',fontWeight:600,color:'#16a34a'}}>${total.toLocaleString('es-CO')} <span style={{fontSize:'0.62rem',fontWeight:400,color:'#7a6a55'}}>COP</span></span>
          </div>
          {nota&&<div style={{borderLeft:`3px solid ${T.gold}`,background:'#f5f0e8',borderRadius:'0 8px 8px 0',padding:'0.45rem 0.7rem',marginBottom:'0.75rem',fontSize:'0.72rem',color:'#7a6a55',fontStyle:'italic'}}>📋 {nota}</div>}
          <div style={{textAlign:'center',margin:'0.6rem 0'}}><span style={{display:'inline-block',border:'2.5px solid #16a34a',borderRadius:'6px',padding:'0.28rem 1.4rem',color:'#16a34a',fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.25rem',fontWeight:700,letterSpacing:'0.2em',transform:'rotate(-3deg)',opacity:0.85}}>✓ PAGADO</span></div>
          <div style={{textAlign:'center',borderTop:'2px dashed rgba(184,137,42,0.3)',paddingTop:'0.8rem',marginTop:'0.65rem'}}>
            <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'0.95rem',color:T.gold,margin:'0 0 0.2rem'}}>¡Gracias por tu compra!</p>
            <p style={{fontSize:'0.65rem',color:'#7a6a55',lineHeight:1.5,margin:0}}>📱 WhatsApp: +57 322 477 6053</p>
            <p style={{fontFamily:'monospace',fontSize:'0.48rem',color:'#c5b49a',marginTop:'0.35rem'}}>||||| {folio} ||||| {Date.now().toString().slice(-8)} |||||</p>
            <p style={{fontSize:'0.52rem',color:'rgba(99,102,241,0.5)',marginTop:'0.25rem'}}>🔗 Recibo guardado en InvManager via Firebase</p>
          </div>
        </div>
        <div style={{background:'#fffdf8',height:'12px',overflow:'hidden'}}>
          <svg viewBox="0 0 380 12" style={{width:'100%',height:'12px',display:'block'}}>
            {Array.from({length:38}).map((_,i)=><circle key={i} cx={i*10+5} cy={12} r={6} fill="rgba(0,0,0,0.85)"/>)}
          </svg>
        </div>
        <div style={{display:'flex',gap:'0.5rem',marginTop:'0.75rem'}}>
          <button onClick={()=>imprimirRecibo(receipt)} style={{flex:2,padding:'0.75rem',borderRadius:'12px',background:`linear-gradient(135deg,${T.gold},${T.goldLight})`,color:'#fff',border:'none',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'0.88rem',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',gap:'0.4rem'}}>🖨️ Imprimir</button>
          <button onClick={onClose} style={{flex:1,padding:'0.75rem',borderRadius:'12px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.75)',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'0.82rem'}}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

// Botón de producto en el panel admin
function ProductBtn({ p, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={()=>onClick(p)} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.48rem 0.65rem',borderRadius:'10px',background:hov?'rgba(184,137,42,0.12)':'rgba(255,255,255,0.04)',border:`1px solid ${hov?T.divider:T.border}`,cursor:'pointer',textAlign:'left',marginBottom:'3px',width:'100%'}}>
      <div style={{flex:1,minWidth:0}}>
        <p style={{margin:0,color:'#f5ede0',fontFamily:"'Jost',sans-serif",fontSize:'0.77rem',fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.name}</p>
        <p style={{margin:0,color:T.textMuted,fontFamily:"'Jost',sans-serif",fontSize:'0.6rem'}}>{p.ml} · <span style={{color:'rgba(99,102,241,0.7)'}}>{p.invSku}</span></p>
      </div>
      <div style={{flexShrink:0,marginLeft:'0.5rem',textAlign:'right'}}>
        <p style={{margin:0,color:T.goldLight,fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'0.88rem',fontWeight:600}}>${p.price.toLocaleString('es-CO')}</p>
        <p style={{margin:0,color:'#4ade80',fontSize:'0.6rem',fontFamily:"'Jost',sans-serif"}}>🔗 Vender</p>
      </div>
    </button>
  );
}

function AdminPanel({ invData, onLogout, isMobile, onSaleClick, receipts, onViewReceipt }) {
  const [tab, setTab] = useState('vender');
  const co = invData?.companies?.find(c => c.id === PERFUMERY_COMPANY_ID);
  const lowStock = co?.products?.filter(p => p.stock <= p.minStock) || [];

  const totalIngresos = receipts.reduce((s,r)=>s+r.total,0);

  return (
    <div style={{position:'fixed',top:0,right:0,height:'100vh',width:isMobile?'100vw':'320px',background:'linear-gradient(180deg,#1a1208 0%,#0f0a04 100%)',borderLeft:`1px solid ${T.divider}`,zIndex:900,display:'flex',flexDirection:'column',boxShadow:'-8px 0 40px rgba(0,0,0,0.5)',animation:'slideInRight 0.35s cubic-bezier(0.34,1.56,0.64,1)'}}>
      <div style={{padding:'1rem 1.25rem',borderBottom:`1px solid ${T.divider}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.6rem'}}>
          <div style={{width:'34px',height:'34px',borderRadius:'10px',background:`linear-gradient(135deg,${T.gold},${T.goldLight})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem'}}>⚙️</div>
          <div>
            <p style={{margin:0,color:T.goldLight,fontFamily:"'Jost',sans-serif",fontWeight:700,fontSize:'0.85rem'}}>Modo Admin</p>
            <p style={{margin:0,color:'rgba(99,102,241,0.8)',fontFamily:"'Jost',sans-serif",fontSize:'0.64rem',fontWeight:600}}>🔗 Firebase · Historial sincronizado</p>
          </div>
        </div>
        <button onClick={onLogout} style={{background:'rgba(220,38,38,0.12)',border:'1px solid rgba(220,38,38,0.3)',borderRadius:'8px',color:'#f87171',fontFamily:"'Jost',sans-serif",fontSize:'0.72rem',fontWeight:600,padding:'0.35rem 0.7rem',cursor:'pointer'}}>Salir</button>
      </div>

      <div style={{padding:'0.75rem 1rem',borderBottom:`1px solid ${T.divider}`,flexShrink:0}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0.4rem'}}>
          {[
            {label:'Productos', val: ALL_PRODUCTS.length, color:'#f5ede0'},
            {label:'Ingresos', val: `$${totalIngresos.toLocaleString('es-CO')}`, color:'#4ade80', small:true},
            {label:'Recibos', val: receipts.length, color:'#a5b4fc'},
          ].map((item,i)=>(
            <div key={i} style={{background:'rgba(255,255,255,0.04)',borderRadius:'10px',padding:'0.5rem 0.6rem',border:`1px solid ${T.border}`,textAlign:'center'}}>
              <p style={{color:T.textMuted,fontSize:'0.56rem',fontFamily:"'Jost',sans-serif",margin:'0 0 2px',textTransform:'uppercase'}}>{item.label}</p>
              <p style={{color:item.color,fontFamily:item.small?"'Jost'":`'Cormorant Garamond',Georgia,serif`,fontSize:item.small?'0.72rem':'1.35rem',fontWeight:600,margin:0}}>{item.val}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:'flex',gap:'3px',padding:'0.5rem 0.6rem',background:'rgba(0,0,0,0.2)',flexShrink:0}}>
        {[{key:'vender',label:'💸 Vender'},{key:'recibos',label:`🧾 Historial${receipts.length>0?' ('+receipts.length+')':''}`}].map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)} style={{flex:1,padding:'0.45rem',borderRadius:'8px',border:'none',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'0.73rem',fontWeight:600,background:tab===t.key?'rgba(184,137,42,0.2)':'transparent',color:tab===t.key?T.goldLight:T.textMuted,borderBottom:tab===t.key?`2px solid ${T.gold}`:'2px solid transparent'}}>
            {t.label}
          </button>
        ))}
      </div>

      {lowStock.length > 0 && tab==='vender' && (
        <div style={{padding:'0.65rem 1rem',background:'rgba(245,158,11,0.07)',borderBottom:'1px solid rgba(245,158,11,0.2)',flexShrink:0}}>
          <p style={{color:'#f59e0b',fontSize:'0.64rem',fontFamily:"'Jost',sans-serif",fontWeight:700,margin:'0 0 0.3rem'}}>⚠️ {lowStock.length} producto{lowStock.length>1?'s':''} con stock bajo</p>
          {lowStock.map(p=>(
            <div key={p.id} style={{display:'flex',justifyContent:'space-between',padding:'1px 0'}}>
              <span style={{color:'rgba(245,237,224,0.6)',fontSize:'0.68rem',fontFamily:"'Jost',sans-serif"}}>{p.name}</span>
              <span style={{color:'#f59e0b',fontSize:'0.68rem',fontFamily:"'Jost',sans-serif",fontWeight:600}}>{p.stock} u.</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'vender' && (
        <div style={{padding:'0.75rem',flex:1,overflowY:'auto'}}>
          <p style={{color:T.gold,fontSize:'0.58rem',fontFamily:"'Jost',sans-serif",letterSpacing:'0.15em',textTransform:'uppercase',fontWeight:600,margin:'0 0 0.55rem'}}>Venta rápida — {ALL_PRODUCTS.length} productos · Sync Firebase</p>
          <p style={{color:'rgba(184,137,42,0.6)',fontSize:'0.58rem',fontFamily:"'Jost',sans-serif",letterSpacing:'0.1em',textTransform:'uppercase',margin:'0.5rem 0 0.3rem'}}>🌸 Dama</p>
          {CATALOG.dama.map(p => <ProductBtn key={p.id} p={p} onClick={onSaleClick}/>)}
          <p style={{color:'rgba(184,137,42,0.6)',fontSize:'0.58rem',fontFamily:"'Jost',sans-serif",letterSpacing:'0.1em',textTransform:'uppercase',margin:'0.5rem 0 0.3rem'}}>🌿 Unisex</p>
          {CATALOG.unisex.map(p => <ProductBtn key={p.id} p={p} onClick={onSaleClick}/>)}
          <p style={{color:'rgba(184,137,42,0.6)',fontSize:'0.58rem',fontFamily:"'Jost',sans-serif",letterSpacing:'0.1em',textTransform:'uppercase',margin:'0.5rem 0 0.3rem'}}>🖤 Caballero</p>
          {CATALOG.caballero.map(p => <ProductBtn key={p.id} p={p} onClick={onSaleClick}/>)}
        </div>
      )}

      {tab === 'recibos' && (
        <div style={{flex:1,overflowY:'auto',padding:'0.75rem'}}>
          {receipts.length === 0 ? (
            <div style={{textAlign:'center',padding:'2.5rem 1rem'}}>
              <p style={{fontSize:'2rem',marginBottom:'0.5rem'}}>🧾</p>
              <p style={{color:T.textMuted,fontFamily:"'Jost',sans-serif",fontSize:'0.8rem',lineHeight:1.5}}>Conectando con Firebase...<br/>El historial aparecerá aquí.</p>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'0.45rem'}}>
              {receipts.map((r) => (
                <div key={r.folio} style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${r._fromFirebase?'rgba(99,102,241,0.2)':T.border}`,borderRadius:'12px',padding:'0.7rem 0.8rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.35rem'}}>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{margin:0,color:'#f5ede0',fontFamily:"'Jost',sans-serif",fontSize:'0.78rem',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.product.name}</p>
                      <p style={{margin:0,color:T.textMuted,fontFamily:"'Jost',sans-serif",fontSize:'0.62rem'}}>
                        {r.folio} · {r.hora}
                        {r.clientName ? ` · ${r.clientName}` : ''}
                        {r._fromFirebase ? <span style={{color:'rgba(99,102,241,0.7)'}}> · 🔗</span> : ''}
                      </p>
                    </div>
                    <p style={{margin:0,color:'#4ade80',fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'0.95rem',fontWeight:600,flexShrink:0,marginLeft:'0.4rem'}}>${r.total.toLocaleString('es-CO')}</p>
                  </div>
                  <div style={{display:'flex',gap:'0.35rem'}}>
                    <button onClick={()=>onViewReceipt(r)} style={{flex:1,padding:'0.32rem',borderRadius:'7px',background:'rgba(184,137,42,0.12)',border:`1px solid ${T.divider}`,color:T.goldLight,fontFamily:"'Jost',sans-serif",fontSize:'0.68rem',fontWeight:600,cursor:'pointer'}}>👁 Ver</button>
                    <button onClick={()=>imprimirRecibo(r)} style={{flex:1,padding:'0.32rem',borderRadius:'7px',background:'rgba(255,255,255,0.05)',border:`1px solid ${T.border}`,color:T.textMuted,fontFamily:"'Jost',sans-serif",fontSize:'0.68rem',cursor:'pointer'}}>🖨️ Imprimir</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'recibos' && receipts.length > 0 && (
        <div style={{padding:'0.75rem 1rem',borderTop:`1px solid ${T.divider}`,flexShrink:0,background:'rgba(0,0,0,0.2)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <p style={{color:T.textMuted,fontFamily:"'Jost',sans-serif",fontSize:'0.68rem',margin:0}}>{receipts.length} recibos · total histórico</p>
          <span style={{color:'#4ade80',fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.1rem',fontWeight:600}}>${totalIngresos.toLocaleString('es-CO')}</span>
        </div>
      )}
    </div>
  );
}

function PromoBanner({ isMobile }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <div style={{ position:'fixed', bottom:isMobile?'1rem':'1.5rem', left:'50%', transform:'translateX(-50%)', zIndex:999, width:isMobile?'calc(100% - 2rem)':'auto', animation:'slideUpBanner 0.5s ease' }}>
      <div style={{ background:`linear-gradient(135deg,${T.bgDark},#2a1808)`, border:`1.5px solid ${T.divider}`, borderRadius:'16px', padding:'0.75rem 1.25rem', display:'flex', alignItems:'center', gap:'0.85rem', boxShadow:'0 8px 40px rgba(0,0,0,0.4)', backdropFilter:'blur(10px)', flexWrap:isMobile?'wrap':'nowrap', justifyContent:'center' }}>
        <span style={{fontSize:'1.3rem'}}>🎁</span>
        <div style={{flex:1, minWidth:0}}>
          <p style={{color:'#f5ede0', fontFamily:"'Jost',sans-serif", fontSize:isMobile?'0.8rem':'0.88rem', fontWeight:600, margin:0}}><span style={{color:T.goldLight}}>¡Oferta especial!</span> — 2 perfumes por <span style={{color:'#5dde9a', fontWeight:700}}>$18.000</span> COP</p>
          <p style={{color:T.textMuted, fontFamily:"'Jost',sans-serif", fontSize:'0.72rem', margin:0}}>Escríbenos por WhatsApp</p>
        </div>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('¡Hola! Vi la oferta de 2x$18.000 🎁')}`} target="_blank" rel="noreferrer" style={{padding:'0.45rem 1rem', borderRadius:'9999px', background:`linear-gradient(135deg,${T.gold},${T.goldLight})`, color:'#fff', fontFamily:"'Jost',sans-serif", fontSize:'0.78rem', fontWeight:700, whiteSpace:'nowrap', textDecoration:'none', flexShrink:0}}>Quiero la oferta</a>
        <button onClick={()=>setHidden(true)} style={{background:'transparent', border:'none', color:T.textMuted, cursor:'pointer', fontSize:'1rem', flexShrink:0}}>✕</button>
      </div>
    </div>
  );
}

const ProductCard = memo(function ProductCard({ product, catKey, onBuy, onDetail, isAdmin, onAdminSale, isMobile }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.img);
  const [imgLoaded, setImgLoaded] = useState(false);
  const grad = CAT_STYLE[catKey].grad;
  useEffect(()=>{ const t=setTimeout(()=>setVisible(true),80); return()=>clearTimeout(t); },[]);
  return (
    <div onMouseEnter={()=>!isMobile&&setHovered(true)} onMouseLeave={()=>!isMobile&&setHovered(false)}
      style={{background:'rgba(255,250,240,0.78)',backdropFilter:'blur(16px)',border:`1px solid ${isAdmin?'rgba(22,163,74,0.3)':'rgba(184,137,42,0.2)'}`,borderRadius:'20px',overflow:'hidden',boxShadow:hovered?T.shadowLg:T.shadow,opacity:visible?1:0,transform:visible?(hovered?'translateY(-6px)':'translateY(0)'):'translateY(20px)',transition:'opacity 0.5s ease,transform 0.3s ease',display:'flex',flexDirection:'column',position:'relative'}}>
      {isAdmin && <div style={{position:'absolute',top:'0.5rem',left:'50%',transform:'translateX(-50%)',zIndex:10,background:'rgba(22,163,74,0.9)',backdropFilter:'blur(8px)',borderRadius:'9999px',padding:'0.15rem 0.6rem',fontSize:'0.6rem',fontFamily:"'Jost',sans-serif",fontWeight:700,color:'#fff',whiteSpace:'nowrap'}}>⚙️ {product.invSku} 🔗</div>}
      <div onClick={()=>onDetail(product, catKey)} style={{position:'relative',height:isMobile?'200px':'230px',overflow:'hidden',flexShrink:0,background:'#1a1208',cursor:'pointer'}}>
        {imgSrc ? <img src={imgSrc} alt={product.name} onLoad={()=>setImgLoaded(true)} onError={()=>setImgSrc(null)} style={{width:'100%',height:'100%',objectFit:'cover',opacity:imgLoaded?1:0,transform:hovered?'scale(1.1)':'scale(1)',transition:'opacity 0.5s ease,transform 0.5s ease'}}/> : <div style={{width:'100%',height:'100%',background:grad,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:'2.5rem',opacity:0.5}}>🧴</span></div>}
        <div style={{position:'absolute',inset:0,background:hovered?'rgba(0,0,0,0.25)':'transparent',transition:'background 0.3s ease',display:'flex',alignItems:'center',justifyContent:'center'}}>
          {hovered&&<span style={{color:'#fff',fontFamily:"'Jost',sans-serif",fontSize:'0.8rem',fontWeight:600,background:'rgba(0,0,0,0.5)',padding:'0.4rem 0.9rem',borderRadius:'9999px'}}>Ver detalles 👁</span>}
        </div>
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:'50%',background:'linear-gradient(to top,rgba(0,0,0,0.45),transparent)',pointerEvents:'none'}}/>
        {product.badge&&<div style={{position:'absolute',top:'0.6rem',left:'0.6rem',background:BADGE_STYLE[product.badge].bg,color:'#fff',borderRadius:'9999px',padding:'0.18rem 0.6rem',fontSize:'0.65rem',fontFamily:"'Jost',sans-serif",fontWeight:700}}>{BADGE_STYLE[product.badge].label}</div>}
        <div style={{position:'absolute',top:'0.7rem',right:'0.7rem',background:'rgba(0,0,0,0.6)',backdropFilter:'blur(8px)',color:'#fff',borderRadius:'9999px',padding:'0.18rem 0.6rem',fontSize:'0.7rem',fontFamily:"'Jost',sans-serif",fontWeight:500}}>{product.ml}</div>
      </div>
      <div style={{padding:isMobile?'1.1rem':'1.3rem',flex:1,display:'flex',flexDirection:'column'}}>
        <h3 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:isMobile?'1.3rem':'1.55rem',fontWeight:600,color:T.text,margin:'0 0 0.3rem'}}>{product.name}</h3>
        <div style={{marginBottom:'0.5rem'}}><Stars n={5}/></div>
        <p style={{color:T.textMuted,fontSize:'0.82rem',fontFamily:"'Jost',sans-serif",margin:'0 0 0.85rem',lineHeight:1.6,flex:1}}>{product.description}</p>
        <div style={{display:'flex',gap:'0.35rem',flexWrap:'wrap',marginBottom:'1rem'}}>
          {product.notes.map(n=><span key={n} style={{background:T.bg,border:`1px solid ${T.divider}`,color:T.textMuted,borderRadius:'9999px',padding:'0.15rem 0.55rem',fontSize:'0.68rem',fontFamily:"'Jost',sans-serif"}}>{n}</span>)}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'0.5rem',flexWrap:isAdmin?'wrap':'nowrap'}}>
          <div>
            <span style={{color:T.gold,fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.4rem',fontWeight:600}}>${product.price.toLocaleString()}</span>
            <span style={{color:T.textMuted,fontSize:'0.7rem',fontFamily:"'Jost',sans-serif",marginLeft:'3px'}}>COP</span>
          </div>
          <div style={{display:'flex',gap:'0.4rem'}}>
            <button onClick={()=>onBuy(product)} style={{padding:'0.55rem 1rem',borderRadius:'9999px',background:`linear-gradient(135deg,${T.gold},${T.goldLight})`,color:'#fff',border:'none',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'0.85rem',fontWeight:600}}>Comprar</button>
            {isAdmin && <button onClick={()=>onAdminSale(product)} style={{padding:'0.55rem 0.9rem',borderRadius:'9999px',background:'linear-gradient(135deg,#16a34a,#22c55e)',color:'#fff',border:'none',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'0.82rem',fontWeight:700}} title={`Registrar ${product.invSku}`}>🔗 Vender</button>}
          </div>
        </div>
      </div>
    </div>
  );
});

const CategorySection = memo(function CategorySection({ catKey, products, onBuy, onDetail, isAdmin, onAdminSale, isMobile }) {
  const { grad, icon, label } = CAT_STYLE[catKey];
  const cols = isMobile?'1fr':products.length===1?'320px':'repeat(auto-fill,minmax(230px,1fr))';
  return (
    <section style={{marginBottom:'4rem'}}>
      <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'2rem',paddingBottom:'1rem',borderBottom:`1px solid ${T.divider}`}}>
        <div style={{width:'48px',height:'48px',borderRadius:'14px',background:grad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',flexShrink:0}}>{icon}</div>
        <div>
          <p style={{color:T.gold,fontSize:'0.68rem',fontFamily:"'Jost',sans-serif",letterSpacing:'0.18em',textTransform:'uppercase',fontWeight:600,margin:'0 0 0.2rem'}}>Aceites Esenciales</p>
          <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:isMobile?'1.6rem':'2rem',fontWeight:600,color:T.text,margin:0}}>{label}</h2>
        </div>
        {isAdmin && <div style={{marginLeft:'auto',background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.25)',borderRadius:'9999px',padding:'0.25rem 0.75rem',fontSize:'0.68rem',color:'#818cf8',fontFamily:"'Jost',sans-serif",fontWeight:600}}>🔗 {products.length} SKUs</div>}
      </div>
      <div style={{display:'grid',gridTemplateColumns:cols,gap:isMobile?'1rem':'1.25rem',justifyContent:products.length===1?'center':'stretch'}}>
        {products.map(p=><ProductCard key={p.id} product={p} catKey={catKey} onBuy={onBuy} onDetail={onDetail} isAdmin={isAdmin} onAdminSale={onAdminSale} isMobile={isMobile}/>)}
      </div>
    </section>
  );
});

function ReviewsSection({ isMobile }) {
  const allReviews = [
    {name:'Laura M.',stars:5,text:'Increíble calidad para el precio.',perfume:'Olimpya'},
    {name:'Santiago R.',stars:5,text:'Invictus es el rey, nunca me cambia.',perfume:'Invictus'},
    {name:'Valentina G.',stars:5,text:'Ariana Cloud me tiene enamorada.',perfume:'Ariana Cloud'},
    {name:'Camilo T.',stars:5,text:'Solo es una bestia, intensidad perfecta.',perfume:'Solo'},
    {name:'Gabriela S.',stars:5,text:'Good Girl: misterioso y seductor.',perfume:'Good Girl'},
    {name:'Julián G.',stars:5,text:'One Million es un clásico garantizado.',perfume:'One Millón'},
  ];
  return (
    <div style={{marginBottom:'4rem'}}>
      <div style={{textAlign:'center',marginBottom:'2rem'}}>
        <p style={{color:T.gold,fontSize:'0.68rem',letterSpacing:'0.18em',textTransform:'uppercase',fontFamily:"'Jost',sans-serif",fontWeight:600,margin:'0 0 0.5rem'}}>Lo que dicen nuestros clientes</p>
        <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:isMobile?'1.8rem':'2.4rem',fontWeight:400,color:T.text,margin:0}}>Reseñas ⭐</h2>
      </div>
      <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:'1rem'}}>
        {allReviews.map((r,i)=>(
          <div key={i} style={{background:'rgba(255,250,240,0.78)',backdropFilter:'blur(16px)',border:'1px solid rgba(184,137,42,0.2)',borderRadius:'18px',padding:'1.25rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.5rem'}}>
              <div><p style={{fontFamily:"'Jost',sans-serif",fontSize:'0.88rem',fontWeight:600,color:T.text,margin:0}}>{r.name}</p><p style={{fontFamily:"'Jost',sans-serif",fontSize:'0.7rem',color:T.gold,margin:'0.1rem 0 0'}}>{r.perfume}</p></div>
              <Stars n={r.stars}/>
            </div>
            <p style={{color:T.textMuted,fontSize:'0.82rem',fontFamily:"'Jost',sans-serif",lineHeight:1.6,margin:0}}>"{r.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const ProductDetailModal = memo(function ProductDetailModal({ product, catKey, onBuy, onClose, isMobile }) {
  const [imgSrc, setImgSrc] = useState(product.img);
  const [imgLoaded, setImgLoaded] = useState(false);
  const grad = CAT_STYLE[catKey].grad;
  const reviews = REVIEWS[product.id] || [];
  const waMsg = encodeURIComponent(`¡Hola! Quiero preguntar por:\n\n🧴 *${product.name}* (${product.ml})\n💰 $${product.price.toLocaleString()}\n\n¿Está disponible?`);
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:1100,background:'rgba(0,0,0,0.82)',backdropFilter:'blur(12px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',animation:'fadeIn 0.3s ease',overflowY:'auto'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.bgCard,borderRadius:'28px',maxWidth:'680px',width:'100%',boxShadow:T.shadowLg,border:`1px solid ${T.divider}`,animation:'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)',overflow:'hidden',maxHeight:'92vh',display:'flex',flexDirection:'column'}}>
        <div style={{position:'relative',height:isMobile?'260px':'360px',flexShrink:0,background:'#1a1208',overflow:'hidden'}}>
          {imgSrc?<img src={imgSrc} alt={product.name} onLoad={()=>setImgLoaded(true)} onError={()=>setImgSrc(null)} style={{width:'100%',height:'100%',objectFit:'cover',opacity:imgLoaded?1:0,transition:'opacity 0.5s ease'}}/>:<div style={{width:'100%',height:'100%',background:grad,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:'4rem',opacity:0.4}}>🧴</span></div>}
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',pointerEvents:'none'}}/>
          {product.badge&&<div style={{position:'absolute',top:'1rem',left:'1rem',background:BADGE_STYLE[product.badge].bg,color:'#fff',borderRadius:'9999px',padding:'0.25rem 0.75rem',fontSize:'0.75rem',fontFamily:"'Jost',sans-serif",fontWeight:700}}>{BADGE_STYLE[product.badge].label}</div>}
          <button onClick={onClose} style={{position:'absolute',top:'0.85rem',right:'0.85rem',width:'34px',height:'34px',borderRadius:'50%',background:'rgba(0,0,0,0.55)',border:'1px solid rgba(255,255,255,0.2)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.9rem',color:'#fff'}}>✕</button>
          <div style={{position:'absolute',bottom:'1.1rem',left:'1.25rem',right:'1.25rem'}}>
            <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:isMobile?'1.8rem':'2.4rem',fontWeight:600,color:'#f5ede0',margin:0,textShadow:'0 2px 12px rgba(0,0,0,0.6)'}}>{product.name}</h2>
            <p style={{color:'rgba(255,255,255,0.5)',fontFamily:"'Jost',sans-serif",fontSize:'0.7rem',margin:'0.2rem 0 0'}}>{product.invSku} · {product.ml}</p>
          </div>
        </div>
        <div style={{overflowY:'auto',padding:isMobile?'1.25rem':'1.75rem 2rem',flex:1}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.25rem',flexWrap:'wrap',gap:'0.75rem'}}>
            <div><span style={{color:T.gold,fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'2rem',fontWeight:600}}>${product.price.toLocaleString()}</span><span style={{color:T.textMuted,fontSize:'0.75rem',fontFamily:"'Jost',sans-serif",marginLeft:'4px'}}>COP</span></div>
            <div style={{display:'flex',gap:'0.5rem'}}>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.6rem 1.1rem',borderRadius:'9999px',background:'#25D366',color:'#fff',textDecoration:'none',fontFamily:"'Jost',sans-serif",fontSize:'0.82rem',fontWeight:600}}>WhatsApp</a>
              <button onClick={()=>{onBuy(product);onClose();}} style={{padding:'0.6rem 1.25rem',borderRadius:'9999px',background:`linear-gradient(135deg,${T.gold},${T.goldLight})`,color:'#fff',border:'none',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'0.82rem',fontWeight:700}}>Comprar</button>
            </div>
          </div>
          <div style={{marginBottom:'1.25rem'}}>
            <p style={{color:T.gold,fontSize:'0.65rem',letterSpacing:'0.15em',textTransform:'uppercase',fontFamily:"'Jost',sans-serif",fontWeight:600,margin:'0 0 0.4rem'}}>Descripción</p>
            <p style={{color:T.text,fontSize:'0.9rem',fontFamily:"'Jost',sans-serif",lineHeight:1.75,margin:0}}>{product.description}</p>
          </div>
          <div style={{marginBottom:'1.5rem'}}>
            <p style={{color:T.gold,fontSize:'0.65rem',letterSpacing:'0.15em',textTransform:'uppercase',fontFamily:"'Jost',sans-serif",fontWeight:600,margin:'0 0 0.6rem'}}>Notas olfativas</p>
            <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
              {product.notes.map(n=><span key={n} style={{background:T.bg,border:`1px solid ${T.divider}`,color:T.textMuted,borderRadius:'9999px',padding:'0.3rem 0.8rem',fontSize:'0.78rem',fontFamily:"'Jost',sans-serif"}}>🌿 {n}</span>)}
            </div>
          </div>
          <div style={{height:'1px',background:T.divider,marginBottom:'1.25rem'}}/>
          <div>
            <p style={{color:T.gold,fontSize:'0.65rem',letterSpacing:'0.15em',textTransform:'uppercase',fontFamily:"'Jost',sans-serif",fontWeight:600,margin:'0 0 0.85rem'}}>⭐ Reseñas</p>
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {reviews.map((r,i)=><div key={i} style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:'14px',padding:'0.85rem 1rem'}}><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.3rem'}}><span style={{fontFamily:"'Jost',sans-serif",fontSize:'0.82rem',fontWeight:600,color:T.text}}>{r.name}</span><Stars n={r.stars}/></div><p style={{color:T.textMuted,fontSize:'0.8rem',fontFamily:"'Jost',sans-serif",lineHeight:1.55,margin:0}}>"{r.text}"</p></div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const SuccessModal = memo(function SuccessModal({ product, onClose }) {
  const waMsg = encodeURIComponent(`¡Hola! Quiero pedir:\n\n🧴 *${product.name}* (${product.ml})\n💰 $${product.price.toLocaleString()}\n\n¿Está disponible?`);
  return (
    <div style={{position:'fixed',inset:0,zIndex:1200,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',animation:'fadeIn 0.3s ease'}}>
      <div style={{background:T.bgCard,borderRadius:'24px',padding:'2.5rem 2rem 2rem',maxWidth:'400px',width:'100%',textAlign:'center',boxShadow:T.shadowLg,border:`1px solid ${T.divider}`,animation:'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)',position:'relative'}}>
        <button onClick={onClose} style={{position:'absolute',top:'0.85rem',right:'0.85rem',width:'36px',height:'36px',borderRadius:'50%',background:T.bg,border:`1px solid ${T.border}`,cursor:'pointer',fontSize:'1rem',color:T.textMuted}}>✕</button>
        <div style={{width:'72px',height:'72px',borderRadius:'50%',background:`linear-gradient(135deg,${T.gold},${T.goldLight})`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1.25rem',fontSize:'2rem'}}>✓</div>
        <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.6rem',fontWeight:600,color:T.text,margin:'0 0 0.5rem'}}>¡Excelente elección!</h2>
        <p style={{color:T.textMuted,fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",margin:'0 0 1.5rem',lineHeight:1.6}}>Completa tu pedido por WhatsApp 🌿</p>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem',padding:'0.75rem 1.75rem',borderRadius:'9999px',background:'#25D366',color:'#fff',textDecoration:'none',fontFamily:"'Jost',sans-serif",fontSize:'0.9rem',fontWeight:600,marginBottom:'0.75rem'}}>Pedir por WhatsApp</a>
        <button onClick={onClose} style={{padding:'0.5rem 1.5rem',borderRadius:'9999px',background:'transparent',border:`1px solid ${T.border}`,color:T.textMuted,cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'0.8rem'}}>Seguir viendo</button>
      </div>
    </div>
  );
});

function SearchBar({ query, onChange, isMobile }) {
  return (
    <div style={{position:'relative',marginBottom:'2rem',maxWidth:isMobile?'100%':'480px'}}>
      <div style={{marginBottom:'1rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.3rem'}}>
          <div style={{flex:1,height:'1px',background:`linear-gradient(to right,transparent,${T.gold})`}}/>
          <span style={{color:T.gold,fontSize:'0.62rem',fontFamily:"'Jost',sans-serif",letterSpacing:'0.2em',textTransform:'uppercase',fontWeight:600}}>Catálogo</span>
          <div style={{flex:1,height:'1px',background:`linear-gradient(to left,transparent,${T.gold})`}}/>
        </div>
        <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:isMobile?'2.2rem':'3rem',fontWeight:600,color:'#2a1a08',margin:0,lineHeight:1.1}}>Explorar Fragancias</h2>
      </div>
      <div style={{position:'relative',borderRadius:'16px',background:'rgba(42,26,8,0.08)',padding:'2px'}}>
        <div style={{position:'relative',display:'flex',alignItems:'center',background:'rgba(255,245,225,0.55)',backdropFilter:'blur(20px)',borderRadius:'14px',border:'1.5px solid rgba(184,137,42,0.35)',overflow:'hidden'}}>
          <span style={{position:'absolute',left:'1rem',fontSize:'0.95rem',pointerEvents:'none',opacity:0.7}}>🔍</span>
          <input type="text" value={query} onChange={e=>onChange(e.target.value)} placeholder="Buscar perfume, nota olfativa..." style={{width:'100%',padding:'0.85rem 2.5rem 0.85rem 2.8rem',background:'transparent',color:'#2a1a08',fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1rem',fontStyle:'italic',outline:'none',border:'none'}}/>
          {query&&<button onClick={()=>onChange('')} style={{position:'absolute',right:'0.9rem',background:'rgba(42,26,8,0.12)',border:'none',cursor:'pointer',color:'#2a1a08',fontSize:'0.75rem',width:'22px',height:'22px',borderRadius:'50%'}}>✕</button>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ROOT APP — ✅ receipts sincronizados con Firebase
═══════════════════════════════════════════════════ */
export default function App() {
  const width = useWindowWidth();
  const isMobile = width < 640;

  const [modal, setModal] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [detailProduct, setDetailProduct] = useState(null);
  const [detailCatKey, setDetailCatKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [saleProduct, setSaleProduct] = useState(null);
  const [viewingReceipt, setViewingReceipt] = useState(null);

  const { invData, registrarVentaEnFirebase, syncing, connected, fbReceipts } = useFirebaseInvData();

  // ── receipts = historial completo desde Firebase (en tiempo real) ──
  // Los recibos de la sesión actual YA están incluidos en fbReceipts
  // porque Firebase los devuelve en el onSnapshot inmediatamente tras guardar
  const receipts = fbReceipts;

  const handleBuy = useCallback(p => setModal(p), []);
  const closeModal = useCallback(() => setModal(null), []);
  const handleDetail = useCallback((p, k) => { setDetailProduct(p); setDetailCatKey(k); }, []);
  const closeDetail = useCallback(() => { setDetailProduct(null); setDetailCatKey(null); }, []);
  const handleAdminLogin = () => { setIsAdmin(true); setShowAdminLogin(false); setShowAdminPanel(true); };
  const handleAdminLogout = () => { setIsAdmin(false); setShowAdminPanel(false); };
  const handleAdminSale = useCallback((product) => { setSaleProduct(product); }, []);

  const handleSaleConfirm = useCallback(async (product, qty, nota, receiptData) => {
    // Firebase guarda el recibo → onSnapshot lo devuelve → fbReceipts se actualiza automáticamente
    registrarVentaEnFirebase(product, qty, nota, receiptData).catch(() => {});
    return true;
  }, [registrarVentaEnFirebase]);

  const filterProducts = (products) => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(q) || p.notes.some(n => n.toLowerCase().includes(q)) || p.description.toLowerCase().includes(q));
  };

  const tabs = [{key:'all',label:'Todos'},{key:'dama',label:'🌸 Dama'},{key:'unisex',label:'🌿 Unisex'},{key:'caballero',label:'🖤 Caballero'}];
  const allEmpty = searchQuery && (activeTab==='all' ? filterProducts([...CATALOG.dama,...CATALOG.unisex,...CATALOG.caballero]).length===0 : filterProducts(CATALOG[activeTab]||[]).length===0);
  const contentPaddingRight = (isAdmin && showAdminPanel && !isMobile) ? '320px' : '0';

  return (
    <>
      <style>{`
        ${FONTS}
        @keyframes fadeIn        { from{opacity:0} to{opacity:1} }
        @keyframes slideUp       { from{opacity:0;transform:translateY(40px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes popIn         { from{transform:scale(0)} to{transform:scale(1)} }
        @keyframes float         { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulseGold     { 0%,100%{box-shadow:0 0 0 0 rgba(184,137,42,0.4)} 50%{box-shadow:0 0 0 8px rgba(184,137,42,0)} }
        @keyframes pulseGreen    { 0%,100%{box-shadow:0 0 0 0 rgba(22,163,74,0.4)} 50%{box-shadow:0 0 0 8px rgba(22,163,74,0)} }
        @keyframes pulseIndicator{ 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes slideInRight  { from{transform:translateX(100%)} to{transform:translateX(0)} }
        @keyframes aurora1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-2vw,3vh) scale(0.95)} }
        @keyframes aurora2 { 0%,100%{transform:translate(0,0) scale(1)} 60%{transform:translate(2vw,-3vh) scale(0.92)} }
        @keyframes aurora3 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(2vw,3vh) scale(1.12)} }
        @keyframes slideUpBanner { from{opacity:0;transform:translateX(-50%) translateY(40px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{font-size:16px;scroll-behavior:smooth;}
        body{margin:0;padding:0;-webkit-tap-highlight-color:transparent;background:#1a1208;overflow-x:hidden;}
        a{text-decoration:none;}
        ::-webkit-scrollbar{width:6px;background:#1a1208;}
        ::-webkit-scrollbar-thumb{background:#b8892a;border-radius:3px;}
      `}</style>

      <div style={{minHeight:'100vh',width:'100%',overflowX:'hidden',color:T.text,fontFamily:"'Jost',sans-serif",paddingBottom:'6rem',position:'relative',background:'#c9b99a',transition:'padding-right 0.35s ease',paddingRight:contentPaddingRight}}>
        <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(145deg,#a8936e 0%,#9e8860 25%,#aa9470 50%,#978260 75%,#a48e6a 100%)'}}/>
          <div style={{position:'absolute',top:'-10%',left:'-5%',width:'70vw',height:'60vh',borderRadius:'60% 40% 70% 30%',background:'radial-gradient(ellipse, rgba(170,130,60,0.6) 0%, transparent 75%)',animation:'aurora1 14s ease-in-out infinite',filter:'blur(40px)'}}/>
          <div style={{position:'absolute',top:'20%',right:'-10%',width:'60vw',height:'55vh',borderRadius:'40% 60% 30% 70%',background:'radial-gradient(ellipse, rgba(160,100,65,0.5) 0%, transparent 75%)',animation:'aurora2 18s ease-in-out infinite',filter:'blur(50px)'}}/>
          <div style={{position:'absolute',bottom:'-5%',left:'10%',width:'65vw',height:'50vh',borderRadius:'70% 30% 50% 50%',background:'radial-gradient(ellipse, rgba(120,128,70,0.38) 0%, transparent 75%)',animation:'aurora3 20s ease-in-out infinite',filter:'blur(45px)'}}/>
        </div>

        <div style={{position:'relative',zIndex:1}}>
          <div style={{background:`linear-gradient(160deg,${T.bgDark} 0%,#2a1a08 60%,#1a2a1a 100%)`,padding:isMobile?'3.5rem 1.5rem 3rem':'5rem 3rem 4rem',position:'relative',overflow:'hidden',textAlign:'center',width:'100%'}}>
            <button onClick={()=> isAdmin ? setShowAdminPanel(p=>!p) : setShowAdminLogin(true)}
              style={{position:'absolute',top:isMobile?'1rem':'1.25rem',right:isMobile?'1rem':'1.25rem',display:'flex',alignItems:'center',gap:'0.45rem',padding:isMobile?'0.5rem 0.85rem':'0.55rem 1.1rem',borderRadius:'9999px',background:isAdmin?'rgba(22,163,74,0.15)':'rgba(184,137,42,0.12)',border:`1.5px solid ${isAdmin?'rgba(22,163,74,0.4)':T.divider}`,color:isAdmin?'#4ade80':T.goldLight,cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:isMobile?'0.72rem':'0.78rem',fontWeight:700,backdropFilter:'blur(8px)',animation:isAdmin?'pulseGreen 3s ease infinite':'pulseGold 3s ease infinite',zIndex:10}}>
              <span>{isAdmin ? '⚙️' : '🔐'}</span>
              {isAdmin ? (isMobile?'Admin':'Panel Admin') : (isMobile?'Admin':'Administrador')}
            </button>
            <Corners isMobile={isMobile}/>
            <Logo isMobile={isMobile}/>
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.75rem',marginBottom:'1rem'}}>
              <div style={{width:'50px',height:'1px',background:T.gold,opacity:0.5}}/>
              <span style={{color:T.gold,fontSize:'0.65rem',letterSpacing:'0.22em',textTransform:'uppercase',fontFamily:"'Jost',sans-serif",fontWeight:600}}>Olor que Deja Huellas</span>
              <div style={{width:'50px',height:'1px',background:T.gold,opacity:0.5}}/>
            </div>
            <h1 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:isMobile?'3.4rem':'clamp(4rem,8vw,6.5rem)',fontWeight:300,color:'#f5ede0',letterSpacing:'0.04em',lineHeight:1.05,margin:'0 0 0.5rem'}}>Perfumery</h1>
            <p style={{color:'rgba(245,237,224,0.5)',fontSize:isMobile?'0.85rem':'0.95rem',letterSpacing:'0.1em',fontWeight:300}}>@sitioincreible · 2026</p>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('¡Hola! Quiero ver el catálogo completo 🌿')}`} target="_blank" rel="noreferrer"
              style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',marginTop:'2rem',padding:'1rem 2.8rem',borderRadius:'9999px',background:`linear-gradient(135deg,${T.gold},${T.goldLight})`,color:'#fff',fontFamily:"'Jost',sans-serif",fontSize:'1.1rem',fontWeight:600,letterSpacing:'0.06em'}}>
              Pedir por WhatsApp
            </a>
          </div>

          <div style={{maxWidth:'1280px',margin:'0 auto',padding:isMobile?'1.5rem 1rem':'2rem 2rem'}}>
            <SearchBar query={searchQuery} onChange={setSearchQuery} isMobile={isMobile}/>
            <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',justifyContent:isMobile?'center':'flex-start',marginBottom:'2.5rem'}}>
              {tabs.map(tab=>(
                <button key={tab.key} onClick={()=>setActiveTab(tab.key)} style={{padding:'0.5rem 1.35rem',borderRadius:'9999px',background:activeTab===tab.key?`linear-gradient(135deg,${T.gold},${T.goldLight})`:'rgba(42,26,8,0.12)',color:activeTab===tab.key?'#fff':'#2a1a08',border:activeTab===tab.key?'none':'1.5px solid rgba(42,26,8,0.25)',cursor:'pointer',fontFamily:"'Jost',sans-serif",fontSize:'0.95rem',fontWeight:activeTab===tab.key?700:500,transition:'all 0.2s ease',backdropFilter:'blur(8px)'}}>
                  {tab.label}
                </button>
              ))}
            </div>

            {allEmpty && (
              <div style={{textAlign:'center',padding:'3rem 1rem',color:T.textMuted,fontFamily:"'Jost',sans-serif"}}>
                <p style={{fontSize:'2rem',marginBottom:'0.5rem'}}>🔍</p>
                <p>No se encontraron perfumes con "<strong style={{color:T.gold}}>{searchQuery}</strong>"</p>
              </div>
            )}

            {(activeTab==='all'||activeTab==='dama') && filterProducts(CATALOG.dama).length>0 && <CategorySection catKey="dama" products={filterProducts(CATALOG.dama)} onBuy={handleBuy} onDetail={handleDetail} isAdmin={isAdmin} onAdminSale={handleAdminSale} isMobile={isMobile}/>}
            {(activeTab==='all'||activeTab==='unisex') && filterProducts(CATALOG.unisex).length>0 && <CategorySection catKey="unisex" products={filterProducts(CATALOG.unisex)} onBuy={handleBuy} onDetail={handleDetail} isAdmin={isAdmin} onAdminSale={handleAdminSale} isMobile={isMobile}/>}
            {(activeTab==='all'||activeTab==='caballero') && filterProducts(CATALOG.caballero).length>0 && <CategorySection catKey="caballero" products={filterProducts(CATALOG.caballero)} onBuy={handleBuy} onDetail={handleDetail} isAdmin={isAdmin} onAdminSale={handleAdminSale} isMobile={isMobile}/>}

            {!searchQuery && <ReviewsSection isMobile={isMobile}/>}

            <div style={{marginTop:'2rem',marginBottom:'3rem',background:`linear-gradient(135deg,${T.bgDark},#2a1808)`,borderRadius:'24px',padding:isMobile?'2rem 1.25rem':'2.5rem 3rem',border:`1px solid ${T.divider}`}}>
              <div style={{textAlign:'center',marginBottom:'2rem'}}>
                <p style={{color:T.gold,fontSize:'0.68rem',letterSpacing:'0.18em',textTransform:'uppercase',fontFamily:"'Jost',sans-serif",fontWeight:600,margin:'0 0 0.5rem'}}>Proceso de compra</p>
                <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:isMobile?'1.7rem':'2.2rem',fontWeight:400,color:'#f5ede0'}}>¿Cómo hacer tu pedido?</h2>
              </div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(5,1fr)',gap:isMobile?'1rem':'0.75rem'}}>
                {[{num:'1',text:'Selecciona el producto',icon:'👆'},{num:'2',text:'Presiona "Comprar"',icon:'🛒'},{num:'3',text:'Te redirigimos a WhatsApp',icon:'💬'},{num:'4',text:'Realiza el pago',icon:'💳'},{num:'5',text:'Envío nacional',icon:'📦'}].map(s=>(
                  <div key={s.num} style={{background:'rgba(255,255,255,0.05)',borderRadius:'16px',padding:'1.25rem 1rem',textAlign:'center',border:'1px solid rgba(184,137,42,0.15)'}}>
                    <div style={{fontSize:'1.75rem',marginBottom:'0.5rem'}}>{s.icon}</div>
                    <div style={{width:'24px',height:'24px',borderRadius:'50%',background:`linear-gradient(135deg,${T.gold},${T.goldLight})`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 0.5rem',fontSize:'0.75rem',fontWeight:700,color:'#fff',fontFamily:"'Jost',sans-serif"}}>{s.num}</div>
                    <p style={{color:'rgba(245,237,224,0.7)',fontSize:'0.78rem',fontFamily:"'Jost',sans-serif",lineHeight:1.5}}>{s.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <footer style={{textAlign:'center',paddingBottom:'2rem'}}>
              <div style={{width:'40px',height:'1px',background:T.divider,margin:'0 auto 1.25rem'}}/>
              <p style={{color:T.textMuted,fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',fontFamily:"'Jost',sans-serif"}}>© 2026 Perfumery · @sitioincreible · Firebase Sync Edition</p>
            </footer>
          </div>
        </div>
      </div>

      <PromoBanner isMobile={isMobile}/>
      <FirebaseIndicator connected={connected} syncing={syncing}/>

      {isAdmin && showAdminPanel && (
        <AdminPanel invData={invData} onLogout={handleAdminLogout} isMobile={isMobile} onSaleClick={handleAdminSale} receipts={receipts} onViewReceipt={setViewingReceipt}/>
      )}

      {modal && <SuccessModal product={modal} onClose={closeModal}/>}
      {detailProduct && <ProductDetailModal product={detailProduct} catKey={detailCatKey} onBuy={handleBuy} onClose={closeDetail} isMobile={isMobile}/>}
      {showAdminLogin && <AdminLoginModal onClose={()=>setShowAdminLogin(false)} onSuccess={handleAdminLogin}/>}
      {saleProduct && <SaleModal product={saleProduct} onClose={()=>setSaleProduct(null)} onConfirm={handleSaleConfirm}/>}
      {viewingReceipt && <ReciboModal receipt={viewingReceipt} onClose={()=>setViewingReceipt(null)}/>}
    </>
  );
}