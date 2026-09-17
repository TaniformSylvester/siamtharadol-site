// Room names are real (confirmed on the live site's /rooms-2/ page).
// Sizes, occupancy, bed detail and prices were never published — see CONTENT-NEEDED.md.
// `isPlaceholder: true` fields must not go live without hotel-confirmed figures.
//
// NOTE: this file only seeds a fresh database (see prisma/seed.ts) — it is no longer read by
// any page. The database is the live source of truth once a room exists; edit rooms via
// /admin/rooms, not here. This file matters again only when adding a brand-new room type.

export type Room = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  bedType: string;
  sizeSqm: number;
  isPlaceholder: boolean;
  maxAdults: number;
  maxChildren: number;
  basePriceThb: number;
  heroImage: string;
  gallery: { src: string; alt: string }[];
  features: string[];
};

export const rooms: Room[] = [
  {
    slug: "premier-king",
    name: "Premier King",
    shortDescription: "A spacious king room finished in soft, contemporary Thai design.",
    description:
      "Our Premier King rooms pair a plush king-size bed with clean, contemporary Thai finishes — the same quiet, light-filled style found throughout the hotel. Each room includes a deep soaking bathtub and a well-stocked minibar.",
    bedType: "1 King Bed",
    sizeSqm: 32,
    isPlaceholder: true,
    maxAdults: 2,
    maxChildren: 1,
    basePriceThb: 2900,
    heroImage: "/media/rooms/premier-king-bedroom.jpg",
    gallery: [
      { src: "/media/rooms/premier-king-bedroom.jpg", alt: "Premier King bedroom with white linens" },
      { src: "/media/rooms/room-bathtub.jpg", alt: "Deep soaking bathtub" },
      { src: "/media/rooms/bathroom-amenities.jpg", alt: "Bathroom amenities" },
      { src: "/media/rooms/room-minibar.jpg", alt: "In-room minibar" },
    ],
    features: ["Deep soaking bathtub", "Minibar", "Air conditioning", "Flat-screen TV", "Free Wi-Fi", "In-room safe"],
  },
  {
    slug: "premier-twin",
    name: "Premier Twin",
    shortDescription: "Two twin beds in the same relaxed, contemporary Thai styling.",
    description:
      "Ideal for friends or colleagues travelling together, the Premier Twin offers two comfortable twin beds within the same calm, contemporary interior as the rest of the Premier collection.",
    bedType: "2 Twin Beds",
    sizeSqm: 32,
    isPlaceholder: true,
    maxAdults: 2,
    maxChildren: 1,
    basePriceThb: 2900,
    heroImage: "/media/rooms/premier-twin-bedroom.jpg",
    gallery: [
      { src: "/media/rooms/premier-twin-bedroom.jpg", alt: "Premier Twin bedroom with two beds" },
      { src: "/media/rooms/twin-beds-detail.jpg", alt: "Twin beds detail" },
      { src: "/media/rooms/room-bathtub.jpg", alt: "Deep soaking bathtub" },
    ],
    features: ["Deep soaking bathtub", "Minibar", "Air conditioning", "Flat-screen TV", "Free Wi-Fi", "In-room safe"],
  },
  {
    slug: "premier-connected",
    name: "Premier Connected",
    shortDescription: "A King and a Twin room joined together — space for families or groups.",
    description:
      "The Premier Connected pairs a King room with a Twin room through an interior connecting door, giving families and small groups private sleeping quarters with a shared, easy connection between them.",
    bedType: "1 King Bed + 2 Twin Beds (connecting rooms)",
    sizeSqm: 64,
    isPlaceholder: true,
    maxAdults: 4,
    maxChildren: 2,
    basePriceThb: 5200,
    heroImage: "/media/rooms/room-workspace.jpg",
    gallery: [
      { src: "/media/rooms/room-workspace.jpg", alt: "Connected room work space" },
      { src: "/media/rooms/premier-king-bedroom.jpg", alt: "King side of the connected room" },
      { src: "/media/rooms/premier-twin-bedroom.jpg", alt: "Twin side of the connected room" },
    ],
    features: ["Interior connecting door", "Deep soaking bathtub", "Minibar (both rooms)", "Free Wi-Fi", "In-room safe"],
  },
  {
    slug: "two-bedroom-suite",
    name: "Two Bedroom Suite",
    shortDescription: "Our most spacious accommodation, with a private balcony.",
    description:
      "The Two Bedroom Suite is Siam Tharadol's largest room type — a private balcony, generous living space and two full bedrooms make it well suited to families or longer stays.",
    bedType: "1 King Bed + 2 Twin Beds",
    sizeSqm: 72,
    isPlaceholder: true,
    maxAdults: 4,
    maxChildren: 2,
    basePriceThb: 6800,
    heroImage: "/media/rooms/room-suite-view.jpg",
    gallery: [
      { src: "/media/rooms/room-suite-view.jpg", alt: "Two Bedroom Suite living area" },
      { src: "/media/rooms/room-balcony.jpg", alt: "Private balcony" },
      { src: "/media/rooms/room-detail-01.jpg", alt: "Suite bedroom detail" },
    ],
    features: ["Private balcony", "Two full bedrooms", "Deep soaking bathtub", "Minibar", "Free Wi-Fi", "In-room safe"],
  },
];

export const getRoomBySlug = (slug: string) => rooms.find((r) => r.slug === slug);
