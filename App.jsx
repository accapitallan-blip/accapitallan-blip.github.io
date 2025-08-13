import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Search,
  Filter,
  MapPin,
  Calendar,
  BadgePercent,
  Phone,
  Mail,
  ChevronRight,
  ArrowRight,
  Bell,
} from "lucide-react";

// Remates – Landing Comercial v2 (Dark + Motion + Google Sheets)
// Single-file page with Tailwind + Framer Motion + optional Google Sheets adapter

const listingsSeed = [
  {
    id: "RM-0101",
    titulo: "Apartamento moderno en Chapinero",
    ciudad: "Bogotá",
    tipo: "Apartamento",
    area: 72,
    habitaciones: 2,
    banos: 2,
    descuento: 35,
    precioBase: 245000000,
    fecha: "2025-09-05",
    direccion: "Cra 9 #60-12",
    imagen:
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "RM-0102",
    titulo: "Casa familiar con patio en Laureles",
    ciudad: "Medellín",
    tipo: "Casa",
    area: 180,
    habitaciones: 4,
    banos: 3,
    descuento: 28,
    precioBase: 380000000,
    fecha: "2025-09-12",
    direccion: "Calle 35 #78-20",
    imagen:
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "RM-0103",
    titulo: "Lote esquinero con potencial comercial",
    ciudad: "Cali",
    tipo: "Lote",
    area: 290,
    habitaciones: 0,
    banos: 0,
    descuento: 42,
    precioBase: 160000000,
    fecha: "2025-08-28",
    direccion: "Av. Pasoancho #56-01",
    imagen:
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "RM-0104",
    titulo: "Apartamento con vista en El Poblado",
    ciudad: "Medellín",
    tipo: "Apartamento",
    area: 95,
    habitaciones: 3,
    banos: 2,
    descuento: 31,
    precioBase: 320000000,
    fecha: "2025-09-19",
    direccion: "Transv. Inferior #12-45",
    imagen:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "RM-0105",
    titulo: "Oficina luminosa en Zona T",
    ciudad: "Bogotá",
    tipo: "Oficina",
    area: 58,
    habitaciones: 0,
    banos: 1,
    descuento: 22,
    precioBase: 270000000,
    fecha: "2025-09-03",
    direccion: "Cll 82 #13-20",
    imagen:
      "https://images.unsplash.com/photo-1517282009859-f000ec3b26cf?q=80&w=1600&auto=format&fit=crop",
  },
];

const classNames = (...v) => v.filter(Boolean).join(" ");
const formatCOP = (n) =>
  (Number(n) || 0).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  viewport: { once: true },
};

export default function App() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Todas");
  const [type, setType] = useState("Todos");
  const [sort, setSort] = useState("fecha-asc");
  const [remoteListings, setRemoteListings] = useState(null);

  const data = remoteListings ?? listingsSeed;

  const cities = useMemo(
    () => ["Todas", ...Array.from(new Set(data.map((l) => l.ciudad))).sort()],
    [data]
  );
  const types = useMemo(
    () => ["Todos", ...Array.from(new Set(data.map((l) => l.tipo))).sort()],
    [data]
  );

  const listings = useMemo(() => {
    let out = [...data];
    if (query) {
      const q = query.toLowerCase();
      out = out.filter(
        (l) =>
          l.titulo.toLowerCase().includes(q) ||
          l.ciudad.toLowerCase().includes(q) ||
          l.tipo.toLowerCase().includes(q) ||
          String(l.direccion).toLowerCase().includes(q)
      );
    }
    if (city !== "Todas") out = out.filter((l) => l.ciudad === city);
    if (type !== "Todos") out = out.filter((l) => l.tipo === type);

    if (sort === "fecha-asc") out.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    if (sort === "fecha-desc") out.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    if (sort === "precio-asc") out.sort((a, b) => a.precioBase - b.precioBase);
    if (sort === "precio-desc") out.sort((a, b) => b.precioBase - a.precioBase);
    if (sort === "descuento-desc") out.sort((a, b) => b.descuento - a.descuento);

    return out;
  }, [query, city, type, sort, data]);

  async function loadFromSheets(sheetId, sheetName) {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(
        sheetName
      )}`;
      const res = await fetch(url);
      const text = await res.text();
      const json = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1));
      const cols = json.table.cols.map((c) => c.label);
      const rows = json.table.rows
        .map((r) => (r.c ? r.c.map((c) => (c ? c.v : "")) : []))
        .map((arr) => Object.fromEntries(arr.map((v, i) => [String(cols[i] || i).trim(), v])));

      const mapped = rows
        .map((r, i) => ({
          id: r.id || `GS-${i}`,
          titulo: r.titulo || r.Titulo || r["TÍTULO"] || "Oportunidad",
          ciudad: r.ciudad || r.Ciudad || "",
          tipo: r.tipo || r.Tipo || "",
          area: Number(r.area || r.Area || 0),
          habitaciones: Number(r.habitaciones || r.Habitaciones || 0),
          banos: Number(r.banos || r["Baños"] || r.Banos || 0),
          descuento: Number(r.descuento || r.Descuento || 0),
          precioBase: Number(r.precioBase || r.PrecioBase || r.Precio || 0),
          fecha: String(r.fecha || r.Fecha || ""),
          direccion: r.direccion || r["Dirección"] || r.Direccion || "",
          imagen: r.imagen || r.Imagen || "",
        }))
        .filter((r) => r.titulo && r.ciudad && r.tipo);

      if (mapped.length) setRemoteListings(mapped);
      else alert("No se encontraron filas válidas en la hoja.");
    } catch (e) {
      console.error(e);
      alert("Error cargando desde Google Sheets. Verifica que la hoja esté publicada y las columnas coinciden.");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <motion.div whileHover={{ y: -1 }} className="flex items-center gap-2">
            <Home className="w-6 h-6" />
            <span className="tracking-wider font-semibold text-xl md:text-2xl">REMATES.PRO</span>
          </motion.div>
          <motion.a
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            href="#contacto"
            className="inline-flex items-center gap-2 rounded-2xl border border-white px-5 py-3 text-sm md:text-base hover:bg-white hover:text-black transition"
          >
            Habla con un asesor <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
          </motion.a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <motion.img
          initial={{ scale: 1.05, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.2 }}
          src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1800&auto=format&fit=crop"
          alt="Remates inmobiliarios"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        <div className="relative mx-auto max-w-7xl px-4 py-18 md:py-28">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-6xl lg:text-7xl font-semibold leading-tight md:whitespace-nowrap"
          >
            Remates inmobiliarios con <span className="bg-white text-black rounded px-2">alto potencial</span> en un solo lugar
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="mt-4 max-w-2xl text-white/80"
          >
            Curamos oportunidades reales, filtradas por ubicación, descuento y fecha de subasta. Asesoría integral para participar con seguridad.
          </motion.p>
          <div className="mt-8 flex flex-col md:flex-row gap-3">
            <motion.a
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#catalogo"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white px-6 py-4 text-base md:text-lg hover:bg-white hover:text-black transition w-full md:w-auto"
            >
              Ver catálogo <ChevronRight className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-0.5" />
            </motion.a>
            <motion.a
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#contacto"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 px-6 py-4 text-base md:text-lg hover:bg-white/10 transition w-full md:w-auto"
            >
              <Bell className="w-5 h-5 md:w-6 md:h-6" /> Recibir alertas semanales
            </motion.a>
          </div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-white/80">
            <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-white/15 p-3 bg-black/20">Remates verificados</motion.div>
            <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-white/15 p-3 bg-black/20">Asesoría legal y técnica</motion.div>
            <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-white/15 p-3 bg-black/20">Cobertura nacional</motion.div>
            <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-white/15 p-3 bg-black/20">Acompañamiento 360°</motion.div>
          </div>
        </div>
      </section>

      {/* CATALOGO */}
      <section id="catalogo" className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">Catálogo de remates activos</h2>
            <p className="text-white/60 mt-1">Explora y filtra según tu objetivo de inversión.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 rounded-2xl border border-white/20 px-3 py-2">
              <Search className="w-4 h-4 text-white/50" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar ciudad, tipo, dirección..." className="bg-transparent outline-none placeholder:text-white/40 w-full" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/20 px-3 py-2">
              <Filter className="w-4 h-4 text-white/50" />
              <select value={city} onChange={(e) => setCity(e.target.value)} className="bg-black outline-none w-full">
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/20 px-3 py-2">
              <Filter className="w-4 h-4 text-white/50" />
              <select value={type} onChange={(e) => setType(e.target.value)} className="bg-black outline-none w-full">
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/20 px-3 py-2">
              <Filter className="w-4 h-4 text-white/50" />
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-black outline-none w-full">
                <option value="fecha-asc">Más pronto</option>
                <option value="fecha-desc">Más lejano</option>
                <option value="precio-asc">Precio ↑</option>
                <option value="precio-desc">Precio ↓</option>
                <option value="descuento-desc">Mayor descuento</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((l) => (
            <motion.article key={l.id} variants={fadeIn} initial="initial" whileInView="whileInView" viewport={fadeIn.viewport} className="group rounded-3xl border border-white/10 overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] transition">
              <div className="relative h-52">
                <img src={l.imagen} alt={l.titulo} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  {l.descuento > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/70 border border-white/20 px-2 py-1 text-xs">
                      <BadgePercent className="w-3 h-3" /> -{l.descuento}%
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs bg-black/60 rounded-xl px-3 py-2">
                  <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {l.ciudad}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(l.fecha).toLocaleDateString("es-CO")}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1 leading-snug">{l.titulo}</h3>
                <p className="text-white/60 text-sm mb-3">{l.tipo} • {l.area} m² • {l.habitaciones || 0} hab • {l.banos || 0} baños</p>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xs text-white/50">Precio base</div>
                    <div className="text-lg font-semibold">{formatCOP(l.precioBase)}</div>
                  </div>
                  <a href="#contacto" className="inline-flex items-center gap-2 text-sm underline underline-offset-4 decoration-white/40 hover:decoration-white">
                    Quiero este <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* CONTACTO + Sheets */}
      <section id="contacto" className="mx-auto max-w-7xl px-4 py-14 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">Conversemos sobre tu inversión</h2>
            <p className="text-white/70 mt-2">Cuéntanos qué buscas y te enviamos oportunidades alineadas a tu objetivo.</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a href="tel:+573001112233" className="inline-flex items-center gap-2 rounded-2xl border border-white px-5 py-3 hover:bg-white hover:text-black transition"><Phone className="w-4 h-4" /> Llámanos</a>
              <a href="mailto:contacto@remates.pro" className="inline-flex items-center gap-2 rounded-2xl border border-white/40 px-5 py-3 hover:bg-white/10 transition"><Mail className="w-4 h-4" /> Escríbenos</a>
            </div>
            <p className="text-xs text-white/40 mt-6">La información publicada tiene fines informativos. Cada oportunidad requiere verificación específica según su expediente y normativa aplicable.</p>
          </div>

          <div className="rounded-3xl border border-white/10 p-6 bg-white/[0.03]">
            <h3 className="font-semibold mb-2">Conectar con Google Sheets (opcional)</h3>
            <p className="text-sm text-white/60 mb-4">Publica tu hoja (Archivo → Compartir → Publicar en la web) y pega el <span className="font-mono">Sheet ID</span> y el nombre de la pestaña.</p>
            <GoogleSheetsConnector onLoad={loadFromSheets} />
            <p className="text-xs text-white/40 mt-4">Columnas esperadas: <span className="font-mono">titulo, ciudad, tipo, area, habitaciones, banos, descuento, precioBase, fecha, direccion, imagen</span>.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-white/60 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} REMATES.PRO — Todos los derechos reservados.</div>
          <div className="flex flex-wrap gap-3">
            <a href="#" className="hover:text-white">Términos</a>
            <a href="#" className="hover:text-white">Privacidad</a>
            <a href="#contacto" className="hover:text-white">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function GoogleSheetsConnector({ onLoad }) {
  const [id, setId] = useState("");
  const [sheet, setSheet] = useState("Listado");
  const [loading, setLoading] = useState(false);

  async function handleLoad(e) {
    e.preventDefault();
    if (!id) return alert("Pega tu Google Sheet ID");
    setLoading(true);
    await onLoad(id.trim(), sheet.trim() || "Listado");
    setLoading(false);
  }

  return (
    <form onSubmit={handleLoad} className="grid grid-cols-1 gap-3">
      <label className="flex flex-col gap-1">
        <span className="text-xs text-white/60">Google Sheet ID</span>
        <input value={id} onChange={(e) => setId(e.target.value)} placeholder="1A2B3C..." className="bg-black border border-white/20 rounded-xl px-3 py-2 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-white/60">Nombre de la pestaña</span>
        <input value={sheet} onChange={(e) => setSheet(e.target.value)} placeholder="Listado" className="bg-black border border-white/20 rounded-xl px-3 py-2 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20" />
      </label>
      <motion.button
        whileHover={{ y: -1, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white px-4 py-2 hover:bg-white hover:text-black transition"
      >
        {loading ? "Cargando..." : "Cargar desde Sheets"}
      </motion.button>
    </form>
  );
}
