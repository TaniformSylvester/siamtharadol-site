export type GalleryCategory = "Rooms" | "Pool & Fitness" | "Dining" | "Hotel" | "Location";

export const galleryImages: { src: string; alt: string; category: GalleryCategory }[] = [
  { src: "/media/hero/exterior-facade-dusk.jpg", alt: "Hotel facade and pool courtyard at dusk", category: "Hotel" },
  { src: "/media/facilities/lobby.jpg", alt: "Lobby with chandelier and marble floor", category: "Hotel" },
  { src: "/media/rooms/premier-king-bedroom.jpg", alt: "Premier King bedroom", category: "Rooms" },
  { src: "/media/rooms/premier-twin-bedroom.jpg", alt: "Premier Twin bedroom", category: "Rooms" },
  { src: "/media/rooms/twin-beds-detail.jpg", alt: "Twin beds detail", category: "Rooms" },
  { src: "/media/rooms/room-bathtub.jpg", alt: "Deep soaking bathtub", category: "Rooms" },
  { src: "/media/rooms/room-suite-view.jpg", alt: "Two Bedroom Suite living area", category: "Rooms" },
  { src: "/media/rooms/room-workspace.jpg", alt: "Room work space", category: "Rooms" },
  { src: "/media/rooms/room-balcony.jpg", alt: "Room balcony", category: "Rooms" },
  { src: "/media/rooms/room-detail-01.jpg", alt: "Room detail", category: "Rooms" },
  { src: "/media/rooms/room-minibar.jpg", alt: "In-room minibar", category: "Rooms" },
  { src: "/media/rooms/bathroom-amenities.jpg", alt: "Bathroom amenities", category: "Rooms" },
  { src: "/media/facilities/infinity-pool-night.jpg", alt: "Infinity pool at night", category: "Pool & Fitness" },
  { src: "/media/facilities/pool-daytime.jpg", alt: "Pool by day", category: "Pool & Fitness" },
  { src: "/media/facilities/fitness-center.jpg", alt: "Fitness center", category: "Pool & Fitness" },
  { src: "/media/dining/restaurant-dining-room.jpg", alt: "HOM restaurant dining room", category: "Dining" },
  { src: "/media/dining/restaurant-dish-steak.jpg", alt: "Restaurant dish", category: "Dining" },
  { src: "/media/location/shuttle-bus.jpg", alt: "Hotel shuttle bus", category: "Location" },
];

export const galleryCategories: (GalleryCategory | "All")[] = ["All", "Rooms", "Pool & Fitness", "Dining", "Hotel", "Location"];
