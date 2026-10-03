export type Restaurant = {
  id: string;
  name: string;
  city: string;
  neighborhood: string;
  cuisine: string;
  price: string;
  rating: number;
  reviewCount: number;
  description: string;
  accent: string;
  timezone: string;
  openingHour: number;
  closingHour: number;
  menuHighlights?: string[];
  gallery?: string[];
};

export type Table = { id: string; restaurantId: string; seats: number; label: string };
export type ReservationStatus = "confirmed" | "cancelled";
export type Reservation = {
  id: string;
  restaurantId: string;
  tableId: string;
  restaurantName: string;
  date: string;
  time: string;
  partySize: number;
  guestName: string;
  guestEmail: string;
  status: ReservationStatus;
  idempotencyKey: string;
  createdAt: string;
};

export const restaurants: Restaurant[] = [
  { id: "marlow", name: "Marlow & Sons", city: "New York", neighborhood: "Williamsburg", cuisine: "New American", price: "$$$", rating: 4.8, reviewCount: 1284, description: "Market-driven plates, candlelight, and a very good natural wine list.", accent: "#e34b35", timezone: "America/New_York", openingHour: 17, closingHour: 23 },
  { id: "saffron", name: "Saffron House", city: "San Francisco", neighborhood: "Mission District", cuisine: "Persian", price: "$$", rating: 4.9, reviewCount: 862, description: "Wood-fired rice, bright herbs, and family recipes from Tehran to California.", accent: "#e9a83b", timezone: "America/Los_Angeles", openingHour: 17, closingHour: 22 },
  { id: "juniper", name: "Juniper Table", city: "Austin", neighborhood: "East Austin", cuisine: "Texas Bistro", price: "$$", rating: 4.7, reviewCount: 947, description: "A neighborhood bistro with smoky vegetables and a porch made for long dinners.", accent: "#6d8c72", timezone: "America/Chicago", openingHour: 16, closingHour: 22 },
  { id: "luna", name: "Luna Mare", city: "Chicago", neighborhood: "West Loop", cuisine: "Italian", price: "$$$", rating: 4.6, reviewCount: 703, description: "Handmade pasta, lake-effect hospitality, and a tiramisu worth saving room for.", accent: "#7a6e9e", timezone: "America/Chicago", openingHour: 17, closingHour: 23 },
  { id: "tafawa-table", name: "Tafawa Table", city: "Kaduna", neighborhood: "Barnawa", cuisine: "Northern Nigerian", price: "$$", rating: 4.8, reviewCount: 214, description: "A warm Kaduna dining room for tuwo, miyan kuka, and smoky suya shared slowly.", accent: "#8f5b3e", timezone: "Africa/Lagos", openingHour: 16, closingHour: 22, menuHighlights: ["Tuwo shinkafa + miyan kuka", "Coal-grilled suya", "Zobo spritz"], gallery: ["/manus-storage/async-images/3PdvXg1g9LdamXcjno2xmJ/image-1.webp", "/manus-storage/async-images/eRghpwhy23o6xdzlLrT7qN/image-1.webp"] },
  { id: "aso-terrace", name: "Aso Terrace", city: "Abuja", neighborhood: "Maitama", cuisine: "Modern Nigerian", price: "$$$", rating: 4.9, reviewCount: 338, description: "A polished Abuja terrace where jollof, prawns, and plantain meet sunset service.", accent: "#6d8060", timezone: "Africa/Lagos", openingHour: 17, closingHour: 23, menuHighlights: ["Smoky jollof + prawns", "Yaji-glazed chicken", "Mango and ginger cooler"], gallery: ["/manus-storage/async-images/3PdvXg1g9LdamXcjno2xmJ/image-2.webp", "/manus-storage/async-images/eRghpwhy23o6xdzlLrT7qN/image-2.webp"] },
  { id: "orile-lagos", name: "Orílé Lagos", city: "Lagos", neighborhood: "Victoria Island", cuisine: "Lagos Coastal", price: "$$$", rating: 4.7, reviewCount: 526, description: "Bright coastal cooking, peppered suya, and sharing plates made for a long Lagos night.", accent: "#46777a", timezone: "Africa/Lagos", openingHour: 17, closingHour: 23, menuHighlights: ["Peppered suya board", "Coconut seafood rice", "Fried plantain + ata"], gallery: ["/manus-storage/async-images/3PdvXg1g9LdamXcjno2xmJ/image-3.webp", "/manus-storage/async-images/eRghpwhy23o6xdzlLrT7qN/image-3.webp"] },
  { id: "savanna-house", name: "Savanna House", city: "Gombe", neighborhood: "Jekadafari", cuisine: "Hausan Home Cooking", price: "$$", rating: 4.8, reviewCount: 176, description: "An ochre-walled courtyard for fura da nono, masa, and generous northern hospitality.", accent: "#a67b4d", timezone: "Africa/Lagos", openingHour: 16, closingHour: 22, menuHighlights: ["Fura da nono", "Masa with pepper sauce", "Dambu nama"], gallery: ["/manus-storage/async-images/3PdvXg1g9LdamXcjno2xmJ/image-4.webp", "/manus-storage/async-images/eRghpwhy23o6xdzlLrT7qN/image-4.webp"] },
  { id: "dala-kitchen", name: "Dala Kitchen", city: "Kano", neighborhood: "Nassarawa", cuisine: "Kano Grill", price: "$$", rating: 4.9, reviewCount: 291, description: "Indigo textiles, lantern light, and a table built around dambu nama and masa.", accent: "#4d5c7a", timezone: "Africa/Lagos", openingHour: 16, closingHour: 22, menuHighlights: ["Dambu nama", "Masa + yaji", "Spiced grilled lamb"], gallery: ["/manus-storage/async-images/3PdvXg1g9LdamXcjno2xmJ/image-5.webp", "/manus-storage/async-images/eRghpwhy23o6xdzlLrT7qN/image-5.webp"] },
];

export const tables: Table[] = [
  ...restaurants.flatMap((restaurant) => [
    { id: `${restaurant.id}-a`, restaurantId: restaurant.id, seats: 2, label: "Window for two" },
    { id: `${restaurant.id}-b`, restaurantId: restaurant.id, seats: 2, label: "Banquette for two" },
    { id: `${restaurant.id}-c`, restaurantId: restaurant.id, seats: 4, label: "Table for four" },
    { id: `${restaurant.id}-d`, restaurantId: restaurant.id, seats: 6, label: "Corner table" },
  ]),
];

const seedReservations: Reservation[] = [
  { id: "res-seed-1", restaurantId: "marlow", tableId: "marlow-a", restaurantName: "Marlow & Sons", date: "2026-09-30", time: "19:00", partySize: 2, guestName: "Avery Chen", guestEmail: "avery@example.com", status: "confirmed", idempotencyKey: "seed-1", createdAt: "2026-09-01T12:00:00.000Z" },
];

function localHour(time: string): number { return Number(time.split(":")[0]); }
function validSlot(restaurant: Restaurant, date: string, time: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return false;
  const [hour, minute] = time.split(":").map(Number);
  return minute % 30 === 0 && hour >= restaurant.openingHour && (hour < restaurant.closingHour || (hour === restaurant.closingHour && minute === 0));
}
function reservationMatches(r: Reservation, restaurantId: string, date: string, time: string): boolean {
  return r.restaurantId === restaurantId && r.date === date && r.time === time && r.status === "confirmed";
}

export class ReservationEngine {
  private readonly reservations = new Map<string, Reservation>(seedReservations.map((r) => [r.id, r]));
  private readonly idempotency = new Map<string, string>(seedReservations.map((r) => [r.idempotencyKey, r.id]));

  search(input: { city?: string; cuisine?: string; partySize?: number }): Restaurant[] {
    const city = input.city?.trim().toLowerCase();
    const cuisine = input.cuisine?.trim().toLowerCase();
    const partySize = input.partySize ?? 2;
    return restaurants.filter((r) => (!city || r.city.toLowerCase() === city) && (!cuisine || r.cuisine.toLowerCase() === cuisine) && tables.some((t) => t.restaurantId === r.id && t.seats >= partySize));
  }

  availability(restaurantId: string, date: string, partySize = 2): Array<{ time: string; available: boolean; remaining: number }> {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    if (!restaurant) return [];
    const result: Array<{ time: string; available: boolean; remaining: number }> = [];
    for (let hour = restaurant.openingHour; hour <= restaurant.closingHour; hour += 1) {
      for (const minute of [0, 30]) {
        const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        if (!validSlot(restaurant, date, time)) continue;
        const usable = tables.filter((t) => t.restaurantId === restaurantId && t.seats >= partySize && ![...this.reservations.values()].some((r) => r.tableId === t.id && reservationMatches(r, restaurantId, date, time))).length;
        result.push({ time, available: usable > 0, remaining: usable });
      }
    }
    return result;
  }

  reserve(input: { restaurantId: string; date: string; time: string; partySize: number; guestName: string; guestEmail: string; idempotencyKey: string }): { reservation?: Reservation; error?: "INVALID_SLOT" | "NO_TABLE" | "INVALID_GUEST" } {
    if (!input.idempotencyKey?.trim()) return { error: "INVALID_GUEST" };
    const existingId = this.idempotency.get(input.idempotencyKey);
    if (existingId) return { reservation: this.reservations.get(existingId) };
    const restaurant = restaurants.find((r) => r.id === input.restaurantId);
    if (!restaurant || input.partySize < 1 || input.partySize > 12 || !validSlot(restaurant, input.date, input.time)) return { error: "INVALID_SLOT" };
    if (!input.guestName.trim() || !/^\S+@\S+\.\S+$/.test(input.guestEmail)) return { error: "INVALID_GUEST" };
    // This check-and-insert is one synchronous critical section in the demo engine. The SQL version uses a transaction and a unique index.
    const table = tables.find((t) => t.restaurantId === input.restaurantId && t.seats >= input.partySize && ![...this.reservations.values()].some((r) => r.tableId === t.id && reservationMatches(r, input.restaurantId, input.date, input.time)));
    if (!table) return { error: "NO_TABLE" };
    const reservation: Reservation = { id: `res-${crypto.randomUUID()}`, restaurantId: input.restaurantId, tableId: table.id, restaurantName: restaurant.name, date: input.date, time: input.time, partySize: input.partySize, guestName: input.guestName.trim(), guestEmail: input.guestEmail.trim().toLowerCase(), status: "confirmed", idempotencyKey: input.idempotencyKey, createdAt: new Date().toISOString() };
    this.reservations.set(reservation.id, reservation);
    this.idempotency.set(input.idempotencyKey, reservation.id);
    return { reservation };
  }

  listReservations(email?: string): Reservation[] {
    return [...this.reservations.values()].filter((r) => !email || r.guestEmail === email.trim().toLowerCase()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  findByIdempotency(key: string): Reservation | undefined {
    const id = this.idempotency.get(key);
    return id ? this.reservations.get(id) : undefined;
  }

  cancel(id: string): Reservation | undefined {
    const reservation = this.reservations.get(id);
    if (!reservation) return undefined;
    if (reservation.status === "cancelled") return reservation;
    const updated = { ...reservation, status: "cancelled" as const };
    this.reservations.set(id, updated);
    return updated;
  }
}

export const engine = new ReservationEngine();
