// Sourced verbatim from the live site's /resto/ page (real menu, not invented). Categories are
// an organizational grouping added for display — the old site listed all items in one column.
export const dining = {
  name: "HOM Restaurant",
  intro: "Discover the Good Atmosphere of Bangkok.",
  description:
    "The restaurant offers fine dining with a blended cultural theme of modern Thai cuisine, across 650m² of hand-crafted interior.",
  heroImage: "/media/dining/restaurant-dining-room.jpg",
  reservationNote: "Reservations are currently taken by phone only.",
  highlights: [
    { title: "Good Vibes", description: "650m² of hand-crafted decor, a mix of styles and colors." },
    { title: "Refreshing", description: "Refresh and relax with a mocktail in a shaded atmosphere." },
    { title: "Cozy Place", description: "A space designed so every guest feels at home." },
    { title: "Healthy Food Corner", description: "Ingredients selected to be both delicious and healthy." },
  ],
  // Dishes with real photography — shown as featured cards at the top of the menu.
  featured: [
    {
      name: "Papaya Salad (Som Tam)",
      ingredients: "papaya, chili, long beans, lemon, dried shrimp",
      image: "/media/dining/dish-papaya-salad.png",
    },
    {
      name: "Chicken Baguette + French Fries",
      ingredients: "chicken, bread, french fries",
      image: "/media/dining/dish-chicken-baguette.png",
    },
  ],
  menu: [
    {
      category: "Salads",
      items: [
        { name: "Caesar Salad", ingredients: "bacon, egg, vegetable" },
        { name: "Papaya Salad (Som Tam)", ingredients: "papaya, chili, long beans, lemon, dried shrimp" },
      ],
    },
    {
      category: "Rice Dishes",
      items: [
        { name: "Chicken with Rice", ingredients: "chicken, sausage, rice" },
        { name: "Thai Basil Stir-Fried Crispy Chicken with Rice + Fried Egg", ingredients: "chicken, egg, holy basil leaves, rice" },
        { name: "Stir-Fried Morning Glory with Rice", ingredients: "water spinach, rice" },
        { name: "Dried Green Curry Scrambled Egg on Rice", ingredients: "chicken, egg, rice" },
        { name: "Stir-Fried Chicken with Ginger on Rice + Fried Egg", ingredients: "chicken, egg, ginger, rice" },
        { name: "Fried Cabbage with Fish Sauce and Rice", ingredients: "cabbage, dried shrimp, rice" },
        { name: "Siam Fried Chicken", ingredients: "chicken, chicken sauce" },
      ],
    },
    {
      category: "Noodles",
      items: [
        { name: "Stir-Fried Chicken Noodles", ingredients: "noodle, egg, chicken" },
        { name: "Chicken Noodles & Chicken Dried Noodles", ingredients: "chicken, thin noodles, cayenne pepper, sugar, lemon, peanuts" },
        { name: "Pork Noodles & Pork Dried Noodles", ingredients: "pork, thin noodles, cayenne pepper, sugar, lemon, peanuts" },
        { name: "Noodles Topped with Minced Chicken", ingredients: "noodle, chicken" },
        { name: "Chicken Tom Yum Noodles & Chicken Dried Tom Yum Noodles", ingredients: "chicken, thin noodles, cayenne pepper, sugar, lemon, peanuts" },
        { name: "Pork Tom Yum Noodles & Pork Dried Tom Yum Noodles", ingredients: "pork, thin noodles, cayenne pepper, sugar, lemon, peanuts" },
      ],
    },
    {
      category: "Baguettes & Light Bites",
      items: [
        { name: "Baguette Sandwich with Scrambled Egg and Bacon", ingredients: "bacon, egg, bread" },
        { name: "Baguette, Scrambled Egg and Bacon", ingredients: "bacon, egg, bread" },
        { name: "Chicken Baguette + French Fries", ingredients: "chicken, bread, french fries" },
      ],
    },
  ],
  drinks: {
    title: "Mocktails & Refreshments",
    description: "Refresh and relax with a mocktail in a shaded atmosphere — the full drinks list is available in-restaurant.",
    image: "/media/dining/drink-mocktail.png",
  },
  testimonials: [
    {
      quote:
        "It's a great experience. The ambiance is very welcoming and charming. Amazing food and service. Staff are extremely knowledgeable and make great recommendations.",
      name: "Emma Odinson",
    },
    {
      quote:
        "Do yourself a favor and visit this lovely restaurant in Bangkok. The service is unmatched. The staff truly cares about your experience. The food is absolutely amazing. Highly recommend!",
      name: "Dian Annakin",
    },
    {
      quote:
        "This place is great! Atmosphere is chill and cool but the staff is also really friendly. They know what they're doing, and you can tell making customers happy is their main priority.",
      name: "Kyle Smith",
    },
  ],
} as const;
