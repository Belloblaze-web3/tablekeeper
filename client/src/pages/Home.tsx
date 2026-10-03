import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, ChevronDown, Clock3, MapPin, Search, Star, Utensils, X } from "lucide-react";

type Restaurant = { id: string; name: string; city: string; neighborhood: string; cuisine: string; price: string; rating: number; reviewCount: number; description: string; accent: string; timezone: string; menuHighlights?: string[]; gallery?: string[] };
type Slot = { time: string; available: boolean; remaining: number };
type Reservation = { id: string; restaurantName: string; date: string; time: string; partySize: number; guestName: string; guestEmail: string; status: "confirmed" | "cancelled" };

const today = new Date();
const defaultDate = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
const cityOptions = ["All cities", "Kaduna", "Abuja", "Lagos", "Gombe", "Kano", "New York", "San Francisco", "Austin", "Chicago"];
const cuisineOptions = ["All cuisines", "Northern Nigerian", "Modern Nigerian", "Lagos Coastal", "Hausan Home Cooking", "Kano Grill", "New American", "Persian", "Texas Bistro", "Italian"];
const heroFrames = [
  { url: "/manus-storage/async-images/3PdvXg1g9LdamXcjno2xmJ/image-1.webp", city: "Kaduna", name: "Tafawa Table", kind: "Restaurant" },
  { url: "/manus-storage/async-images/eRghpwhy23o6xdzlLrT7qN/image-1.webp", city: "Kaduna", name: "Tuwo + miyan kuka", kind: "On the menu" },
  { url: "/manus-storage/async-images/3PdvXg1g9LdamXcjno2xmJ/image-2.webp", city: "Abuja", name: "Aso Terrace", kind: "Restaurant" },
  { url: "/manus-storage/async-images/eRghpwhy23o6xdzlLrT7qN/image-2.webp", city: "Abuja", name: "Jollof + prawns", kind: "On the menu" },
  { url: "/manus-storage/async-images/3PdvXg1g9LdamXcjno2xmJ/image-3.webp", city: "Lagos", name: "Orílé Lagos", kind: "Restaurant" },
  { url: "/manus-storage/async-images/eRghpwhy23o6xdzlLrT7qN/image-3.webp", city: "Lagos", name: "Peppered suya board", kind: "On the menu" },
  { url: "/manus-storage/async-images/3PdvXg1g9LdamXcjno2xmJ/image-4.webp", city: "Gombe", name: "Savanna House", kind: "Restaurant" },
  { url: "/manus-storage/async-images/eRghpwhy23o6xdzlLrT7qN/image-4.webp", city: "Gombe", name: "Fura da nono", kind: "On the menu" },
  { url: "/manus-storage/async-images/3PdvXg1g9LdamXcjno2xmJ/image-5.webp", city: "Kano", name: "Dala Kitchen", kind: "Restaurant" },
  { url: "/manus-storage/async-images/eRghpwhy23o6xdzlLrT7qN/image-5.webp", city: "Kano", name: "Dambu nama + masa", kind: "On the menu" },
];

function formatDate(date: string) { return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(new Date(`${date}T12:00:00`)); }
function initials(name: string) { return name.split(" ").map((part) => part[0]).slice(0, 2).join(""); }

const warmedImageUrls = new Set<string>();
function warmImage(url: string, priority: "high" | "low" = "low") {
  if (warmedImageUrls.has(url)) return;
  warmedImageUrls.add(url);
  const image = new Image();
  image.decoding = "async";
  image.fetchPriority = priority;
  image.src = url;
}

export default function Home() {
  const [city, setCity] = useState("All cities");
  const [cuisine, setCuisine] = useState("All cuisines");
  const [date, setDate] = useState(defaultDate);
  const [partySize, setPartySize] = useState(2);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [guest, setGuest] = useState({ name: "", email: "" });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showReservations, setShowReservations] = useState(false);
  const [loading, setLoading] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [galleryTick, setGalleryTick] = useState(0);
  const [inlineRestaurantId, setInlineRestaurantId] = useState<string | null>(null);
  const [inlineSlots, setInlineSlots] = useState<Slot[]>([]);
  const [inlineTime, setInlineTime] = useState("");
  const [inlineMessage, setInlineMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const query = useMemo(() => new URLSearchParams({ city: city === "All cities" ? "" : city, cuisine: cuisine === "All cuisines" ? "" : cuisine, partySize: String(partySize) }).toString(), [city, cuisine, partySize]);
  useEffect(() => { fetch(`/api/restaurants?${query}`).then((r) => r.json()).then((data) => setRestaurants(data.restaurants ?? [])); }, [query]);
  useEffect(() => { if (!selected) return; fetch(`/api/restaurants/${selected.id}/availability?date=${date}&partySize=${partySize}`).then((r) => r.json()).then((data) => setSlots(data.slots ?? [])); }, [selected, date, partySize]);
  useEffect(() => { const timer = window.setInterval(() => setHeroIndex((current) => (current + 1) % heroFrames.length), 2400); return () => window.clearInterval(timer); }, []);
  useEffect(() => { heroFrames.forEach((frame, index) => warmImage(frame.url, index < 2 ? "high" : "low")); }, []);
  useEffect(() => { const timer = window.setInterval(() => setGalleryTick((current) => current + 1), 2400); return () => window.clearInterval(timer); }, []);
  useEffect(() => {
    const galleryUrls = restaurants.flatMap((restaurant) => restaurant.gallery ?? []);
    const warmGallery = () => galleryUrls.forEach((url) => warmImage(url));
    const idleWindow = (window as Window & { requestIdleCallback?: (callback: () => void) => number; cancelIdleCallback?: (id: number) => void }).requestIdleCallback;
    if (idleWindow) { const idleId = idleWindow(warmGallery); return () => window.cancelIdleCallback?.(idleId); }
    const timeoutId = window.setTimeout(warmGallery, 120);
    return () => window.clearTimeout(timeoutId);
  }, [restaurants]);
  useEffect(() => { if (!inlineRestaurantId) { setInlineSlots([]); return; } fetch(`/api/restaurants/${inlineRestaurantId}/availability?date=${date}&partySize=${partySize}`).then((r) => r.json()).then((data) => setInlineSlots(data.slots ?? [])); }, [inlineRestaurantId, date, partySize]);

  async function openRestaurant(restaurant: Restaurant) { setMessage(null); setSelected(restaurant); setSelectedTime(""); }
  function toggleInlineBooking(restaurant: Restaurant) { setInlineRestaurantId((current) => current === restaurant.id ? null : restaurant.id); setInlineTime(""); setInlineMessage(null); }
  async function book(event: React.FormEvent) {
    event.preventDefault();
    if (!selected || !selectedTime) return;
    setLoading(true); setMessage(null);
    const key = `tablekeeper-${selected.id}-${date}-${selectedTime}-${guest.email.toLowerCase()}`;
    const response = await fetch("/api/reservations", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": key }, body: JSON.stringify({ restaurantId: selected.id, date, time: selectedTime, partySize, guestName: guest.name, guestEmail: guest.email, idempotencyKey: key }) });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) { setMessage({ type: "error", text: data.message || "That table is no longer available." }); return; }
    setMessage({ type: "success", text: `Booked! Your table at ${data.reservation.restaurantName} is waiting.` });
    setReservations((current) => [data.reservation, ...current.filter((r) => r.id !== data.reservation.id)]);
  }
  async function bookInline(event: React.FormEvent, restaurant: Restaurant) {
    event.preventDefault();
    if (!inlineTime) return;
    setLoading(true); setInlineMessage(null);
    const key = `tablekeeper-${restaurant.id}-${date}-${inlineTime}-${guest.email.toLowerCase()}`;
    const response = await fetch("/api/reservations", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": key }, body: JSON.stringify({ restaurantId: restaurant.id, date, time: inlineTime, partySize, guestName: guest.name, guestEmail: guest.email, idempotencyKey: key }) });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) { setInlineMessage({ type: "error", text: data.message || "That table is no longer available." }); return; }
    setInlineMessage({ type: "success", text: `Booked at ${data.reservation.restaurantName}. Your table is waiting.` });
    setReservations((current) => [data.reservation, ...current.filter((r) => r.id !== data.reservation.id)]);
  }
  async function loadReservations() { setShowReservations(true); if (!guest.email) { setMessage({ type: "error", text: "Enter your email after making a booking to see your reservations." }); return; } const data = await fetch(`/api/reservations?email=${encodeURIComponent(guest.email)}`).then((r) => r.json()); setReservations(data.reservations ?? []); }
  async function cancel(id: string) { const data = await fetch(`/api/reservations/${id}`, { method: "DELETE" }).then((r) => r.json()); setReservations((current) => current.map((r) => r.id === id ? data.reservation : r)); }

  const activeHeroFrame = heroFrames[heroIndex];

  return <div className="app-shell min-h-screen bg-[#f7f5ef] text-[#181817]">
    <header className="site-header mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10"><a href="/" className="flex items-center gap-3" aria-label="Tablekeeper home"><span className="brand-mark"><span /></span><span className="font-display text-2xl font-bold tracking-[-0.06em]">tablekeeper</span></a><nav className="site-nav" aria-label="Primary navigation"><a href="#discover">Discover</a><a href="#how-it-works">How it works</a><button onClick={loadReservations} className="nav-link">My reservations <span className="nav-arrow">↗</span></button></nav></header>
    <main className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
      <section className="hero-grid hero-stage" style={{ "--hero-image": `url(${activeHeroFrame.url})` } as React.CSSProperties}><div className="hero-copy"><p className="eyebrow">Nigeria, one table at a time</p><h1 className="font-display text-6xl font-semibold leading-[.93] tracking-[-0.07em] sm:text-8xl">Good food,<br /><em>kept close.</em></h1><p className="hero-subcopy">Move through Kaduna, Abuja, Lagos, Gombe, and Kano — from the room itself to what is coming out of the kitchen.</p><div className="hero-meta"><span><span className="pulse-dot" />{activeHeroFrame.city} · {activeHeroFrame.kind}</span><span>{String(heroIndex + 1).padStart(2, "0")} / {String(heroFrames.length).padStart(2, "0")}</span></div></div><div className="hero-caption"><span className="caption-line" /><span>{activeHeroFrame.name}<br />{activeHeroFrame.city}</span></div><div className="hero-dots" aria-label="Food and restaurant rotation">{heroFrames.map((frame, index) => <button key={`${frame.city}-${frame.kind}`} aria-label={`Show ${frame.name}`} className={index === heroIndex ? "active" : ""} onClick={() => setHeroIndex(index)} />)}</div></section>
      <section className="search-panel" id="discover"><div className="search-panel-heading"><div><p className="eyebrow">Make a plan</p><h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">Where are you eating?</h2></div><span className="search-note">Live availability · no guesswork</span></div><div className="search-fields"><label><span>City</span><select value={city} onChange={(e) => setCity(e.target.value)}>{cityOptions.map((option) => <option key={option}>{option}</option>)}</select></label><label><span>Date</span><input type="date" min={defaultDate} value={date} onChange={(e) => setDate(e.target.value)} /></label><label><span>Party</span><select value={partySize} onChange={(e) => setPartySize(Number(e.target.value))}>{[1,2,3,4,5,6,7,8].map((size) => <option key={size} value={size}>{size} {size === 1 ? "guest" : "guests"}</option>)}</select></label><label><span>Cuisine</span><select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>{cuisineOptions.map((option) => <option key={option}>{option}</option>)}</select></label><button className="primary-button search-button" onClick={() => document.getElementById("restaurant-results")?.scrollIntoView({ behavior: "smooth", block: "start" })}><Search size={17} /> Find a table</button></div></section>
      <section className="results-section" id="restaurant-results"><div className="section-heading"><div><p className="eyebrow">Curated for you</p><h2 className="font-display text-4xl font-semibold tracking-[-0.05em]">Good places, right this way.</h2></div><span className="result-count">{restaurants.length} places</span></div><div className="restaurant-grid">{restaurants.map((restaurant) => <article key={restaurant.id} className="restaurant-card"><div className="restaurant-art" style={{ backgroundColor: restaurant.accent }}>{restaurant.gallery?.length ? <img className="restaurant-art-image" src={restaurant.gallery[galleryTick % restaurant.gallery.length]} alt={`${restaurant.name} ${galleryTick % 2 === 0 ? "restaurant interior" : "signature dish"}`} loading="eager" decoding="async" fetchPriority="low" /> : null}<span className="art-city">{restaurant.city}</span><span className="art-mode">{restaurant.gallery?.length ? galleryTick % 2 === 0 ? "Restaurant" : "Dish menu" : "Tablekeeper pick"}</span><span className="art-initials">{initials(restaurant.name)}</span></div><div className="restaurant-info"><div className="flex items-start justify-between gap-4"><div><h3 className="font-display text-2xl font-semibold tracking-[-0.04em]">{restaurant.name}</h3><p className="restaurant-meta"><MapPin size={13} /> {restaurant.neighborhood} · {restaurant.cuisine}</p></div><span className="price-tag">{restaurant.price}</span></div><p className="restaurant-description">{restaurant.description}</p><div className="menu-preview"><span className="menu-label">On the menu</span><span>{restaurant.menuHighlights?.length ? restaurant.menuHighlights[galleryTick % restaurant.menuHighlights.length] : "Seasonal plates and house favorites"}</span></div><div className="restaurant-footer"><span className="rating"><Star size={14} fill="currentColor" /> {restaurant.rating} <small>({restaurant.reviewCount})</small></span><div className="restaurant-actions"><button onClick={() => toggleInlineBooking(restaurant)} className="outline-button" aria-expanded={inlineRestaurantId === restaurant.id}>{inlineRestaurantId === restaurant.id ? "Close" : "Reserve here"}</button><button onClick={() => openRestaurant(restaurant)} className="outline-button">See tables <span>→</span></button></div></div>{inlineRestaurantId === restaurant.id && <form className="inline-booking-form" onSubmit={(event) => bookInline(event, restaurant)}><div className="inline-booking-heading"><span>Reserve at {restaurant.name}</span><small>Live availability</small></div><div className="inline-booking-fields"><label><span>Date</span><input type="date" min={defaultDate} value={date} onChange={(e) => setDate(e.target.value)} required /></label><label><span>Party</span><select value={partySize} onChange={(e) => setPartySize(Number(e.target.value))}>{[1,2,3,4,5,6,7,8].map((size) => <option key={size} value={size}>{size} {size === 1 ? "guest" : "guests"}</option>)}</select></label><label><span>Time</span><select required value={inlineTime} onChange={(e) => setInlineTime(e.target.value)}><option value="">Choose a time</option>{inlineSlots.map((slot) => <option key={slot.time} value={slot.time} disabled={!slot.available}>{slot.time} · {slot.available ? `${slot.remaining} left` : "Full"}</option>)}</select></label><label><span>Your name</span><input required value={guest.name} onChange={(e) => setGuest({ ...guest, name: e.target.value })} placeholder="Your name" /></label><label><span>Email</span><input required type="email" value={guest.email} onChange={(e) => setGuest({ ...guest, email: e.target.value })} placeholder="you@example.com" /></label></div><button className="primary-button inline-booking-submit" disabled={loading || !inlineTime}>{loading ? "Booking…" : "Confirm reservation"}</button>{inlineMessage && <div className={`booking-message ${inlineMessage.type}`}><span>{inlineMessage.type === "success" ? "✓" : "!"}</span>{inlineMessage.text}</div>}</form>}</div></article>)}</div></section>
      <section className="how-section" id="how-it-works"><div><p className="eyebrow">How it works</p><h2 className="font-display text-4xl font-semibold tracking-[-0.05em]">A better way<br />to make plans.</h2></div><div className="how-grid"><a href="#discover" className="how-card"><span>01</span><strong>Choose a place</strong><p>Filter by city, cuisine, date, and party size.</p><span className="how-link">Start exploring →</span></a><a href="#restaurant-results" className="how-card"><span>02</span><strong>Pick a time</strong><p>See real availability and choose the table that fits.</p><span className="how-link">See places →</span></a><button className="how-card how-card-button" onClick={loadReservations}><span>03</span><strong>Keep the table</strong><p>Get an instant confirmation and find it here anytime.</p><span className="how-link">View reservations →</span></button></div></section>
      <section className="trust-strip"><span><Check size={16} /> No double bookings</span><span><Clock3 size={16} /> Instant confirmation</span><span><Utensils size={16} /> Local favorites</span></section>
      {showReservations && <section className="reservations-panel"><div className="section-heading"><div><p className="eyebrow">Your plans</p><h2 className="font-display text-4xl font-semibold tracking-[-0.05em]">Reservations</h2></div><button className="close-button" onClick={() => setShowReservations(false)} aria-label="Close reservations"><X size={18} /></button></div>{reservations.length === 0 ? <p className="empty-state">{guest.email ? `No reservations found for ${guest.email}.` : "After you book, enter your confirmation email here to see every reservation in one place."}</p> : <div className="reservation-list">{reservations.map((r) => <div key={r.id} className={`reservation-row ${r.status === "cancelled" ? "is-cancelled" : ""}`}><div><strong>{r.restaurantName}</strong><span>{formatDate(r.date)} · {r.time} · {r.partySize} guests</span></div>{r.status === "confirmed" ? <button className="text-button" onClick={() => cancel(r.id)}>Cancel</button> : <span className="cancelled-label">Cancelled</span>}</div>)}</div>}</section>}
      <footer className="site-footer"><div><a href="/" className="footer-brand">tablekeeper</a><p>Good places. Kept for you.</p><p className="signature-note">Signed by <strong>Blaze</strong></p></div><div className="footer-links"><a href="#discover">Discover</a><a href="#how-it-works">How it works</a><button onClick={loadReservations}>My reservations</button><span className="footer-divider" /><a href="https://x.com/belloblaze8" target="_blank" rel="noreferrer">X · @belloblaze8</a><a href="https://github.com/Belloblaze-web3" target="_blank" rel="noreferrer">GitHub · Belloblaze-web3</a></div></footer>
    </main>
    {selected && <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}><div className="booking-modal"><button className="close-button modal-close" onClick={() => setSelected(null)}><X size={18} /></button><div className="modal-kicker">{selected.city} · {selected.neighborhood}</div><h2 className="font-display text-4xl font-semibold tracking-[-0.05em]">A table at {selected.name}</h2><p className="modal-copy">{selected.description}</p><div className="booking-summary"><span><CalendarDays size={16} /> {formatDate(date)}</span><span><Utensils size={16} /> {partySize} guests</span></div><div className="slot-heading"><span>Choose a time</span><small>{selected.timezone.replace("America/", "").replace("_", " ")}</small></div><div className="slot-grid">{slots.map((slot) => <button key={slot.time} disabled={!slot.available} onClick={() => setSelectedTime(slot.time)} className={`slot ${selectedTime === slot.time ? "selected" : ""} ${!slot.available ? "unavailable" : ""}`}>{slot.time}<small>{slot.available ? `${slot.remaining} left` : "Full"}</small></button>)}</div><form onSubmit={book} className="guest-form"><label><span>Your name</span><input required value={guest.name} onChange={(e) => setGuest({ ...guest, name: e.target.value })} placeholder="Avery Chen" /></label><label><span>Email for confirmation</span><input required type="email" value={guest.email} onChange={(e) => setGuest({ ...guest, email: e.target.value })} placeholder="you@example.com" /></label><button className="primary-button w-full" disabled={loading || !selectedTime}>{loading ? "Keeping your table…" : "Keep this table"}</button></form>{message && <div className={`booking-message ${message.type}`}><span>{message.type === "success" ? "✓" : "!"}</span>{message.text}</div>}</div></div>}
  </div>;
}
