// Verified hotel information only. See AUDIT.md for sourcing and CONTENT-NEEDED.md for gaps.
export const hotel = {
  name: "Siam Tharadol",
  fullName: "Siam Tharadol Hotel",
  tagline: "A Boutique Stay in the Heart of Bangkok",
  positioning: "Boutique Hotel in Bangkok",
  address: {
    line1: "50 Sukhumvit 97/1",
    line2: "Phrakhanong, Bangkok 10260",
    full: "50 Sukhumvit 97/1, Phrakhanong, Bangkok 10260",
  },
  phone: {
    primary: "+66 2 331 3738",
    primaryDisplay: "(02) 331-3738",
    secondary: "+66 2 331 3739",
    secondaryDisplay: "(02) 331-3739",
    mobile: "+66 82 197 5212",
    mobileDisplay: "(082) 197-5212",
  },
  email: "rsvn.siamtharadol@gmail.com",
  lineId: "@siamtharadol",
  social: {
    instagram: "https://www.instagram.com/siamtharadol.hotel",
    facebook: "https://www.facebook.com/SiamTharadol",
    twitter: "https://twitter.com/SiamTharadol",
    linkedin: "https://www.linkedin.com/in/siam-tharadol-hotel-040280238/",
    pinterest: "https://www.pinterest.com/Siamtharadolhotel/",
  },
  transportation: {
    shuttle: "Free hotel shuttle to and from BTS Bang Chak station",
    train: "BTS Skytrain — Bang Chak Station",
    bus: "Eastern Bus Terminal, Ekkamai",
  },
  coordinates: {
    // Approximate — centered on Sukhumvit 97/1, Phrakhanong. Replace with the hotel's exact
    // pin once confirmed (see CONTENT-NEEDED.md).
    lat: 13.6947,
    lng: 100.6034,
  },
} as const;

export const whyStay = [
  {
    title: "Steps from BTS Bang Chak",
    description:
      "A free hotel shuttle runs guests to and from Bang Chak Skytrain station, putting all of Bangkok within easy reach.",
  },
  {
    title: "An infinity-edge pool",
    description:
      "Swim against a picturesque backdrop at our infinity-edge pool, open to all guests.",
  },
  {
    title: "Genuine Thai hospitality",
    description:
      "Personalized, gracious service in an informally elegant setting — the hotel's guiding mission since it opened.",
  },
  {
    title: "In-house dining",
    description:
      "Modern Thai cuisine from our own kitchen, served in a 650m² dining room designed around natural light.",
  },
] as const;
