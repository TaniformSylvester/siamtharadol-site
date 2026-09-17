// The hotel's organized photography (see ARCHITECTURE.md "Media inventory"). Used by the
// admin room-image picker so staff can attach existing photos without a file-upload pipeline.
// There is no upload feature yet — see README "What's left". Update this list if new files
// are added under public/media.
export const mediaLibrary: { path: string; label: string }[] = [
  { path: "/media/rooms/premier-king-bedroom.jpg", label: "Rooms — Premier King bedroom" },
  { path: "/media/rooms/premier-twin-bedroom.jpg", label: "Rooms — Premier Twin bedroom" },
  { path: "/media/rooms/twin-beds-detail.jpg", label: "Rooms — Twin beds detail" },
  { path: "/media/rooms/room-bathtub.jpg", label: "Rooms — Bathtub" },
  { path: "/media/rooms/room-suite-view.jpg", label: "Rooms — Suite living area" },
  { path: "/media/rooms/room-workspace.jpg", label: "Rooms — Work space" },
  { path: "/media/rooms/room-balcony.jpg", label: "Rooms — Balcony" },
  { path: "/media/rooms/room-detail-01.jpg", label: "Rooms — Detail 01" },
  { path: "/media/rooms/room-minibar.jpg", label: "Rooms — Minibar" },
  { path: "/media/rooms/bathroom-amenities.jpg", label: "Rooms — Bathroom amenities" },
  { path: "/media/dining/restaurant-dining-room.jpg", label: "Dining — Dining room" },
  { path: "/media/dining/restaurant-dish-steak.jpg", label: "Dining — Dish" },
  { path: "/media/facilities/lobby.jpg", label: "Facilities — Lobby" },
  { path: "/media/facilities/fitness-center.jpg", label: "Facilities — Fitness center" },
  { path: "/media/facilities/infinity-pool-night.jpg", label: "Facilities — Pool at night" },
  { path: "/media/facilities/pool-daytime.jpg", label: "Facilities — Pool by day" },
  { path: "/media/hero/exterior-facade-dusk.jpg", label: "Hotel — Exterior facade" },
  { path: "/media/location/shuttle-bus.jpg", label: "Location — Shuttle bus" },
];
