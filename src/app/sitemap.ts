import type { MetadataRoute } from "next";
import { getActiveRooms } from "@/lib/rooms";

const BASE_URL = "https://siamtharadol.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rooms = await getActiveRooms();

  const staticRoutes = [
    "",
    "/about",
    "/rooms",
    "/dining",
    "/facilities",
    "/experience",
    "/gallery",
    "/location",
    "/contact",
    "/book",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const roomRoutes = rooms.map((room) => ({
    url: `${BASE_URL}/rooms/${room.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...roomRoutes];
}
