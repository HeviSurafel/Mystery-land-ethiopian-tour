// ==================== GALLERY DATA ====================

// import { AppData, BlogArticle, BlogCategory, calculateDistance, Department, Destination, DestinationFilters, DestinationStats, Experience, FeaturedExperience, Festival, FestivalsSection, GalleryCategory, GalleryCollection, GalleryPhoto, GallerySection, Offer, Region, SearchResult, SlugItem, Statistics, Tour, TourCategory, TourFilters, TourStats, TravelInfoSection } from "../types/types";

//============Blog Data Collection===============
//============Blog Data Collection===============
export const ethiopianFestivals = [
  {
    id: "fest-001",
    name: "Enkutatash: Ethiopia's Jewel-Spangled New Year",
    description:
      "When September arrives, Ethiopia bursts into golden blooms as the nation celebrates Enkutatash—a New Year born from legend and wrapped in sunshine. Unlike the quiet countdowns of the West, this September 11th celebration explodes with fields of adey abeba (yellow daisies), children singing for bread, and families feasting on fresh injera. The name means 'gift of jewels,' harking back to the Queen of Sheba's return from Jerusalem laden with treasures. Today, the true jewels are the smiles, the traditional coffee ceremonies, and the hope that springs eternal after the rains retreat.",
    slug: "ethiopian-new-year",
    images: [
      "/Images/new-year1.jpg",
      "/Images/new-year2.jpg",
      "/Images/new-year3.jpg",
    ],
    date: "September 11/12",
    season: "Spring (Ethiopian winter ends)",
    location: "Addis Ababa, Lalibela, Gondar, and every village across the nation",
    significance:
      "Marks Ethiopia's unique calendar—7 to 8 years behind the Gregorian—and celebrates the end of the heavy rains. Legend says the Queen of Sheba returned from visiting King Solomon with jewels, inspiring the name. But for Ethiopians today, it's about renewal: fresh starts, fresh white cotton clothes, and the first yellow flowers painting the highlands gold.",
    highlights: [
      "Children in new clothes singing door-to-door, receiving small gifts or bread",
      "Families gathering for coffee ceremonies lasting hours, roasting beans over open flames",
      "Church services with priests in embroidered robes, chanting ancient prayers",
      "Special stews (doro wat, key wat) served with freshly made injera",
      "Bonfires in rural areas where communities dance until dawn",
      "The iconic adey abeba flowers sold on every street corner, bundled into bouquets",
    ],
    featured: true,
    coordinates: {
      lat: 9.032,
      lng: 38.7468,
      city: "Addis Ababa",
      region: "Addis Ababa",
    },
    bestTimeToVisit: "September 10-13 for flower markets and family celebrations",
    culturalTips: [
      "Learn 'Melkam Addis Amet' (Happy New Year) to greet locals",
      "Carry small coins for children who sing—they'll find you anyway",
      "Wear something white if possible; it's the color of purity and celebration",
      "Join a coffee ceremony if invited; refusing is considered impolite",
      "Don't miss the flower markets on September 10th—they're spectacular",
    ],
  },
  {
    id: "fest-002",
    name: "Harar's Eid: Where Minarets Meet Mountains",
    description:
      "In the ancient walled city of Harar, Eid arrives like a whispered prayer that swells into a chorus. Ethiopia's Muslim community—one of the oldest in the world—celebrates with a fusion of Islamic devotion and Harari flair. Eid al-Fitr ends Ramadan's fasting with honey-drenched sweets and family reunions; Eid al-Adha commemorates sacrifice with feasts and charity. But nowhere is it more magical than in Harar's labyrinthine alleys, where hyenas are fed, poetry is recited, and the call to prayer echoes off 500-year-old walls.",
    slug: "ethiopian-eid",
    images: ["/Images/eid1.jpg", "/Images/eid2.jpg", "/Images/eid3.jpg"],
    date: "Dates vary (lunar calendar)",
    season: "Varies—check moon sighting announcements",
    location: "Harar (epicenter), Dire Dawa, Addis Ababa, Jimma, Wollo",
    significance:
      "Ethiopia welcomed Islam in the 7th century, making it one of the first nations to embrace the faith. Eid here isn't just a religious obligation—it's a cultural symphony. Eid al-Fitr breaks the month of dawn-to-dusk fasting; Eid al-Adha honors Ibrahim's willingness to sacrifice his son. Both emphasize zakat (charity), ensuring no one celebrates alone.",
    highlights: [
      "Dawn prayers at Harar's Grand Stadium with thousands in white",
      "The traditional Harari sweet 'dulcetta'—honey, butter, and spices rolled into treats",
      "Children in new outfits visiting neighbors, receiving eidi (small money)",
      "The hyena feeding ritual the night before Eid—Harar's unique tradition",
      "Families slaughtering sheep or goats, sharing meat with neighbors and the poor",
      "Poetry recitations in the Harari language at historic homes",
    ],
    featured: true,
    coordinates: {
      lat: 9.3146,
      lng: 42.1265,
      city: "Harar",
      region: "Harari",
    },
    bestTimeToVisit: "Eve of Eid through the following day (check lunar calendar)",
    culturalTips: [
      "Greet Muslims with 'Eid Mubarak' (Blessed Eid) or 'Eid Ade' in Harar",
      "Dress modestly, especially near mosques and during prayers",
      "Ask before photographing prayers or inside homes",
      "Accept dulcetta or coffee if offered—it's rude to decline",
      "Visit the hyena feeding if in Harar; it's safe but let locals guide you",
    ],
  },
  {
    id: "fest-003",
    name: "Genna: Ethiopia's Ancient Christmas",
    description:
      "Forget Santa and sleigh bells—Ethiopian Christmas is a 43-day fast broken by candlelit processions and a hockey game played with curved sticks. On January 7th, the faithful gather in white robes for all-night vigils, priests chant in Ge'ez, and the rock churches of Lalibela become living cathedrals. The fast forbids meat, dairy, and eggs for over a month, making the Christmas feast a spiritual and sensory explosion. And that strange hockey game? Locals call it 'genna' too—played by shepherds in fields, a tradition said to date back to the shepherds who celebrated Christ's birth.",
    slug: "ethiopian-christmas",
    images: [
      "/Images/christmas1.jpg",
      "/Images/christmas2.jpg",
      "/Images/christmas3.jpg",
    ],
    date: "January 7",
    season: "Dry season, crisp highland mornings",
    location: "Lalibela (most spectacular), Axum, Gondar, Addis Ababa",
    significance:
      "Follows the Julian calendar, placing Christmas 7 days after the Gregorian date. The name 'Genna' also refers to the traditional hockey game—legend says shepherds were playing when they heard of Christ's birth. The 43-day fast (Tsome Gahad) prepares worshippers spiritually, making the feast profoundly meaningful.",
    highlights: [
      "All-night church services from 6 PM on January 6 until 4 AM",
      "Pilgrims in white climbing Lalibela's churches by candlelight",
      "The genna hockey game—men and boys with curved sticks, no rules, pure joy",
      "Feasting after midnight: doro wat (spicy chicken stew) after weeks of vegan meals",
      "Priests in crimson and gold robes carrying tabots (replicas of the Ark)",
      "Traditional bread 'defo dabo' baked with honey and spices",
    ],
    featured: true,
    coordinates: {
      lat: 12.0318,
      lng: 39.0417,
      city: "Lalibela",
      region: "Amhara",
    },
    bestTimeToVisit: "January 6 evening through January 8 morning",
    culturalTips: [
      "Wear white—you'll blend with pilgrims and show respect",
      "Be prepared for crowds; Lalibela hotels book months in advance",
      "Skip meat before the feast if you want to experience the fast (locals will appreciate it)",
      "Ask locals where the genna game is happening—it's usually on a nearby field",
      "Photography during services is sensitive; ask permission or wait for procession",
    ],
  },
  {
    id: "fest-004",
    name: "Timkat: The Baptism of the Nile's Soul",
    description:
      "If Ethiopia had a carnival, this would be it—but with ark replicas, holy water, and priests dancing under umbrellas. Timkat, on January 19th, celebrates Jesus's baptism in the Jordan River, but Ethiopia adds its own magic: processions of tabots (Ark of the Covenant replicas) wrapped in velvet, all-night vigils by ancient baths, and a dawn water blessing that sends thousands into joyous splashing. Gondar's Fasiladas Bath is the epicenter, where the faithful renew their vows by immersing themselves in blessed water. It's Ethiopia's most Instagrammable festival—and its most spiritual.",
    slug: "timkat-epiphany",
    images: [
      "/Images/timkat1.webp",
      "/Images/timkat2.webp",
      "/Images/timkat3.webp",
    ],
    date: "January 19",
    season: "Dry, sunny days with cool nights",
    location: "Gondar (legendary), Lalibela, Addis Ababa, Bahir Dar, Aksum",
    significance:
      "Commemorates Jesus's baptism, but in Ethiopian Orthodoxy, it also renews every believer's baptismal vows. The tabot procession symbolizes the Ark traveling to the Jordan River. The water blessing is believed to carry healing and spiritual power—people collect it in bottles for the year ahead.",
    highlights: [
      "Priests carrying tabots on their heads, hidden under embroidered cloths",
      "Hundreds of colorful umbrellas bobbing through crowds like flowers",
      "All-night prayers at Fasiladas Bath in Gondar—lit by torches, singing until dawn",
      "The dawn water blessing: priests sprinkle the crowd, then everyone rushes to the water",
      "In Gondar, thousands jump into the bath simultaneously—spectacular chaos",
      "Return procession with even more dancing, drumming, and sistrum shaking",
    ],
    featured: true,
    coordinates: {
      lat: 12.6075,
      lng: 37.4585,
      city: "Gondar",
      region: "Amhara",
    },
    bestTimeToVisit: "January 18-20 (three days of celebration)",
    culturalTips: [
      "Book Gondar accommodation 3-4 months ahead—it's the most popular spot",
      "Wear shoes you don't mind getting wet (you will be splashed)",
      "Bring a white shawl to drape over your shoulders",
      "Never walk between a tabot and the crowd—it's considered deeply disrespectful",
      "Join the water blessing if you're comfortable; locals will welcome you",
    ],
  },
  {
    id: "fest-005",
    name: "Meskel: Fire, Flowers & Finding the True Cross",
    description:
      "Every September 27th, Ethiopia lights up—literally. Massive bonfires called 'demera' blaze across the country, topped with crosses and circled by singing priests. Meskel commemorates the 4th-century discovery of the True Cross by Queen Helena (Empress Helena), but it's also a celebration of spring, with yellow adey abeba flowers blanketing the highlands. The night before, communities gather wood for weeks to build towering pyres. At dusk, the fires are lit, and the direction of the smoke is believed to predict the coming year's fortune. UNESCO says it's intangible cultural heritage—Ethiopians say it's the best night of the year.",
    slug: "meskel-true-cross",
    images: [
      "/Images/meskel1.webp",
      "/Images/meskel2.webb",
      "/Images/meskel3.webp",
    ],
    date: "September 27",
    season: "Spring, flowers blooming everywhere",
    location: "Addis Ababa's Meskel Square (largest), nationwide",
    significance:
      "According to tradition, Queen Helena had a vision telling her to light incense in Jerusalem; the smoke drifted to where the True Cross was buried. Demera bonfires symbolize that miraculous smoke. Meskel also marks the end of the rainy season—the perfect time for outdoor celebrations.",
    highlights: [
      "The 40-foot demera bonfire at Meskel Square, lit by the Patriarch of the Orthodox Church",
      "Thousands circling the fire, priests leading with ceremonial crosses",
      "Girls in white dresses carrying bouquets of yellow adey abeba",
      "The next morning, searching the ashes for a symbolic 'cross'—if it points east, good luck",
      "Traditional dancing that continues until the fire dies down",
      "Roasted meat and tej (honey wine) shared freely among the crowd",
    ],
    featured: true,
    coordinates: {
      lat: 9.032,
      lng: 38.7468,
      city: "Addis Ababa",
      region: "Addis Ababa",
    },
    bestTimeToVisit: "September 26 evening (bonfire lighting) through September 27",
    culturalTips: [
      "Arrive at Meskel Square by 2 PM to get a good spot",
      "Wear warm layers—evenings get chilly despite the fire",
      "Don't stand too close to the demera; embers fly farther than you'd think",
      "Bring small bills for children selling adey abeba bouquets",
      "Try tej from vendors—but go easy, it's stronger than it tastes",
    ],
  },
];

// ==================== DATA COLLECTIONS ====================

export const festivalsSection = {
  id: "festivals-section",
  name: "Festivals of Ethiopia: A Year-Round Celebration",
  description:
    "From fire-lit nights to water-blessed dawns, Ethiopia's festivals are living history—where every dance, every prayer, every feast tells a 3,000-year story.",
  slug: "ethiopian-festivals",
  metaTitle: "Ethiopian Festivals Calendar: Timkat, Meskel, Genna & More",
  metaDescription:
    "Plan your trip around Ethiopia's most spectacular celebrations: Timkat's water blessing, Meskel's bonfires, Genna's ancient hockey, and Enkutatash's flower-strewn New Year.",
  keywords: [
    "ethiopian festivals",
    "timkat festival gondar",
    "meskel celebration addis ababa",
    "genna ethiopian christmas",
    "enkutatash ethiopian new year",
    "harar eid celebration",
    "true cross finding festival",
  ],
  festivals: ethiopianFestivals,
};

// Featured Experiences Data
// data/featuredExperiences.ts
export const featuredExperiences = [
  {
    id: "feat-001",
    name: "Danakil: Earth's Most Alien Landscape",
    price: 650, // 4 Days
    slug: "danakil-depression-expedition",
    shortDescription: "Stand at the edge of an active volcano, wade through neon-green sulfur springs, and sleep under stars in one of the hottest places on Earth.",
    description: "Stand at the edge of an active volcano, wade through neon-green sulfur springs, and sleep under stars in one of the hottest places on Earth. This 4-day expedition is not for the faint-hearted—but the photos will haunt your friends for years.",
    images: [
      "/Images/danakil1.webp",
      "/Images/danakil2.webp",
      "/Images/danakil3.webp",
    ],
    duration: "4 Days",
    location: "Danakil Depression, Afar Region, Ethiopia",
    highlights: [
      "Erta Ale's lava lake—one of only five in the world",
      "Dallol's psychedelic springs (yellow, green, orange, red)",
      "Salt flats where camels still caravan as they did 1,000 years ago",
      "Nighttime volcano hike under a billion stars",
    ],
    included: [
      "All ground transportation in 4x4 vehicles",
      "Professional expedition guide with Danakil experience",
      "Armed scout/security for entire expedition",
      "All meals and drinking water during expedition",
      "Basic camping equipment including tents and sleeping mats",
      "All permits and Afar region access fees",
      "Local Afar guide and translator"
    ],
    notIncluded: [
      "International and domestic flights",
      "Accommodation in Mekele before/after expedition",
      "Personal expedition gear (sleeping bag, headlamp, etc.)",
      "Comprehensive travel insurance including emergency evacuation",
      "Tips for guides, drivers, and scout",
      "Personal expenses and souvenirs",
      "Alcoholic beverages"
    ],
    bestTimeToVisit: "November to February",
    difficulty: "Challenging",
    category: "adventure",
    tag: "Extreme",
    featured: true,
    rating: 4.9,
    reviewCount: 38,
    coordinates: {
      lat: 14.2417,
      lng: 40.3,
      city: "Mekele",
      region: "Afar",
    },
    languages: ["English", "Amharic", "Afar"],
    groupSize: "6-12 travelers",
    ageRange: "18-60 years",
    whatToBring: [
      "Sturdy hiking boots",
      "Lightweight long-sleeved shirts and pants for sun protection",
      "Wide-brimmed hat",
      "High-SPF sunscreen",
      "Sunglasses",
      "Headlamp with extra batteries",
      "Personal medications",
      "Electrolyte tablets",
      "Bandana for dust"
    ],
    meetingPoint: "Mekele",
    startTimes: ["6:00 AM"],
    culturalSignificance: "The Danakil Depression has been home to the Afar people for centuries, who still practice traditional salt mining and camel caravan trade as they have for over 1,000 years.",
    seasonalAvailability: "Best during cooler months (November to February)",
    status: "active"
  },
  {
    id: "feat-002",
    name: "The Historic Route: Kingdoms Carved in Stone",
    price: 1400, // 7 Days
    slug: "historic-route-journey",
    shortDescription: "Seven days, four UNESCO sites, and 3,000 years of history through Ethiopia's ancient kingdoms.",
    description: "Seven days, four UNESCO sites, and 3,000 years of history. From Lalibela's rock churches (hewn from a single stone) to Axum's ancient obelisks (rivals of Egypt's pyramids), this journey traces the path of emperors, saints, and the Ark of the Covenant itself.",
    images: [
      "/Images/Ethiopia-12.webp",
      "/Images/lalibela1.webp",
      "/Images/axum1.webp",
      "/Images/gondar1.webp",
    ],
    duration: "7 Days",
    location: "Northern Ethiopia (Lalibela, Axum, Gondar)",
    highlights: [
      "Lalibela's 11 monolithic churches, carved from below ground",
      "Axum's 1,700-year-old stelae, still standing against time",
      "Gondar's Camelot-of-Africa castles",
      "Lake Tana's island monasteries with biblical paintings",
    ],
    included: [
      "Domestic flights (Addis-Axum, Gondar-Addis)",
      "Professional English-speaking historical guide",
      "7 nights accommodation in 3-4 star hotels",
      "All meals as indicated",
      "All entrance fees",
      "Ground transportation",
      "Airport transfers"
    ],
    notIncluded: [
      "International airfare",
      "Ethiopian visa fees (USD $52 for most nationalities)",
      "Travel insurance",
      "Personal expenses",
      "Tips",
      "Alcoholic drinks"
    ],
    bestTimeToVisit: "October to April",
    difficulty: "Moderate",
    category: "historical",
    tag: "UNESCO",
    featured: true,
    rating: 4.8,
    reviewCount: 56,
    coordinates: {
      lat: 12.0318,
      lng: 39.0417,
      city: "Lalibela",
      region: "Amhara",
    },
    languages: ["English", "Amharic"],
    groupSize: "6-12 travelers",
    ageRange: "All ages",
    whatToBring: [
      "Comfortable walking shoes",
      "Modest clothing for church visits (shoulders and knees covered)",
      "Camera with extra batteries",
      "Sun protection",
      "Light layers for varying temperatures"
    ],
    meetingPoint: "Addis Ababa Bole International Airport",
    startTimes: ["Flexible based on flight schedule"],
    culturalSignificance: "This route covers Ethiopia's most significant historical sites, from the Aksumite Empire to the Gondarine period, spanning over 3,000 years of Ethiopian civilization and Orthodox Christian heritage.",
    seasonalAvailability: "Best during dry season (October to April)",
    status: "active",
    isUnesco: true,
    unesco: true
  },
  {
    id: "feat-003",
    name: "Omo Valley: Faces & Festivals of the Forgotten World",
    price: 850, // 5 Days
    slug: "omo-valley-cultural-tour",
    shortDescription: "Step into a land where lip plates, body painting, and bull-jumping ceremonies are everyday life.",
    description: "Step into a land where lip plates, body painting, and bull-jumping ceremonies are everyday life. This 5-day immersion takes you to the Mursi, Hamer, and Karo tribes—photographers' dreams, anthropologists' wonders, and your most unforgettable Ethiopian memory.",
    images: [
      "/Images/omovalley4.webp",
      "/Images/omovalley1.webp",
      "/Images/omovalley2.webp",
      "/Images/omovalley3.webp",
    ],
    duration: "5 Days",
    location: "Omo Valley, Southern Nations, Ethiopia",
    highlights: [
      "Mursi women with clay lip plates—a fading tradition",
      "Hamer bull-jumping ceremonies (if timing aligns)",
      "Karo body painting on the Omo River's edge",
      "Turmi's Saturday market, where tribes trade cattle and stories",
    ],
    included: [
      "All ground transportation in 4x4 vehicles",
      "Professional cultural guide with Omo Valley expertise",
      "5 nights accommodation in lodges and hotels",
      "All meals as indicated",
      "All tribal permits and community fees",
      "Cultural guide fees and translator services where needed"
    ],
    notIncluded: [
      "International flights to/from Ethiopia",
      "Ethiopian visa fees and processing",
      "Comprehensive travel insurance including medical evacuation",
      "Personal expenses, souvenirs, and additional crafts",
      "Tips for guides, drivers, and lodge staff",
      "Camera fees to tribes (payable directly, varies by community)"
    ],
    bestTimeToVisit: "June to September, December to February",
    difficulty: "Moderate",
    category: "cultural",
    tag: "Cultural",
    featured: true,
    rating: 4.7,
    reviewCount: 52,
    coordinates: {
      lat: 5.4652,
      lng: 36.4869,
      city: "Jinka",
      region: "Southern Nations",
    },
    languages: ["English", "Amharic"],
    groupSize: "4-8 travelers",
    ageRange: "18-65 years",
    whatToBring: [
      "Camera with extra batteries and memory cards",
      "Sun hat and sunscreen",
      "Comfortable walking shoes",
      "Lightweight, breathable fabrics in neutral colors",
      "Small gifts for children (pencils, notebooks)",
      "Cash for photography fees"
    ],
    meetingPoint: "Jinka",
    startTimes: ["8:00 AM"],
    culturalSignificance: "The Omo Valley is one of the most culturally diverse regions in Africa, home to over a dozen indigenous tribes who have preserved their ancient traditions, languages, and social structures for centuries.",
    seasonalAvailability: "Year-round, but dry seasons offer easier travel conditions",
    status: "active"
  },
  {
    id: "feat-004",
    name: "Simien Mountains: Africa's Rooftop",
    price: 780, // 6 Days
    slug: "simien-mountains-trek",
    shortDescription: "Trek through jagged peaks where gelada baboons graze like sheep and lammergeier eagles soar below your feet.",
    description: "Trek through jagged peaks where gelada baboons graze like sheep and lammergeier eagles soar below your feet. This 6-day hike is Ethiopia's answer to Patagonia—minus the crowds, plus the world's most dramatic escarpment views.",
    images: [
      "/Images/simien4.webp",
      "/Images/simien1.webp",
      "/Images/simien2.webp",
      "/Images/simien3.webp",
    ],
    duration: "6 Days",
    location: "Simien Mountains National Park, Amhara Region, Ethiopia",
    highlights: [
      "Gelada baboons with heart-shaped chest patches—nowhere else on Earth",
      "Camping at 3,600 meters, wrapped in clouds",
      "The Jinbar Waterfall, Ethiopia's tallest",
      "Bwahit Peak (4,437m) optional sunrise summit",
    ],
    included: [
      "Professional mountain guide with Simien Mountains expertise",
      "Cook and camp staff for meal preparation and camp management",
      "All camping equipment including tents, sleeping mats, and dining tent",
      "All meals during trek as indicated",
      "Park entrance fees, permits, and conservation contributions",
      "Mule and mule handler for luggage transport during trek",
      "Ground transportation from Gondar and return"
    ],
    notIncluded: [
      "International flights to/from Ethiopia",
      "Accommodation in Gondar before/after trek (can be arranged separately)",
      "Personal trekking gear (sleeping bag, trekking poles, etc.)",
      "Comprehensive travel insurance including mountain rescue",
      "Tips for guides, cook, scout, and mule handler",
      "Personal expenses, souvenirs, and additional services",
      "Alcoholic beverages and specialty drinks"
    ],
    bestTimeToVisit: "October to April",
    difficulty: "Moderate to Challenging",
    category: "hiking",
    tag: "UNESCO",
    featured: true,
    rating: 4.9,
    reviewCount: 63,
    coordinates: {
      lat: 13.181,
      lng: 38.0706,
      city: "Debark",
      region: "Amhara",
    },
    languages: ["English", "Amharic"],
    groupSize: "4-8 trekkers",
    ageRange: "18-65 years",
    whatToBring: [
      "Sturdy hiking boots (well broken in)",
      "Warm layers (temperatures drop at altitude)",
      "Rain jacket",
      "Sun protection (hat, sunscreen, sunglasses)",
      "Daypack with personal items",
      "Sleeping bag (rated to at least -5°C)",
      "Trekking poles (recommended)"
    ],
    meetingPoint: "Gondar city",
    startTimes: ["7:00 AM"],
    culturalSignificance: "The Simien Mountains are considered sacred in Ethiopian culture, with many monasteries hidden in remote cliffs. The mountains are also home to the Gelada baboon, which features prominently in local folklore.",
    seasonalAvailability: "Best during dry season (October to May)",
    status: "active",
    isUnesco: true,
    unesco: true
  },
  {
    id: "feat-005",
    name: "Coffee Pilgrimage: Where Beans Become Blessings",
    price: 450, // 3 Days
    slug: "ethiopian-coffee-origin-tour",
    shortDescription: "Ethiopia invented coffee—and this 3-day journey proves it.",
    description: "Ethiopia invented coffee—and this 3-day journey proves it. From misty plantations in Jimma to the legendary coffee ceremonies that last three rounds, you'll trace the bean from red cherry to your cup. Plus, you'll never look at your morning brew the same way again.",
    images: [
      "/Images/coffee4.webp",
      "/Images/coffee1.webp",
      "/Images/coffee2.webp",
      "/Images/coffee3.webp",
    ],
    duration: "3 Days",
    location: "Jimma, Oromia Region, Ethiopia",
    highlights: [
      "Plucking red coffee cherries alongside local farmers",
      "Traditional ceremony: roasting, grinding, brewing—all by hand",
      "Tasting the same wild coffee varieties that fueled Sufi monks in the 9th century",
      "Learning why Ethiopians say 'buna tetu' (coffee is our bread)",
    ],
    included: [
      "All ground transportation",
      "Professional cultural guide with coffee expertise",
      "3 nights accommodation in Jimma area",
      "All meals as indicated",
      "Coffee farm visits and ceremony participation",
      "Coffee tasting sessions"
    ],
    notIncluded: [
      "International flights",
      "Ethiopian visa fees",
      "Travel insurance",
      "Personal expenses",
      "Tips for guides and drivers",
      "Alcoholic beverages"
    ],
    bestTimeToVisit: "October to February (coffee harvest season)",
    difficulty: "Easy",
    category: "coffee",
    tag: "Cultural",
    featured: true,
    rating: 4.8,
    reviewCount: 45,
    coordinates: {
      lat: 7.6667,
      lng: 36.8333,
      city: "Jimma",
      region: "Oromia",
    },
    languages: ["English", "Amharic", "Oromifa"],
    groupSize: "4-10 travelers",
    ageRange: "All ages",
    whatToBring: [
      "Camera for capturing the coffee journey",
      "Comfortable walking shoes",
      "Sun hat and sunscreen",
      "Notebook for notes on coffee varieties and processes",
      "Cash for purchasing coffee directly from farmers"
    ],
    meetingPoint: "Jimma Airport",
    startTimes: ["9:00 AM"],
    culturalSignificance: "Coffee originated in Ethiopia's Kaffa region. The traditional coffee ceremony (buna tetu) is a central social ritual in Ethiopian culture, representing hospitality, friendship, and community bonding.",
    seasonalAvailability: "Best during coffee harvest season (October to February)",
    status: "active"
  }
];

// Historical Tours Data
export const historicalTours = [
  {
    id: "hist-001",
    name: "Lalibela: Jerusalem in Stone",
    price: 850, // 4 Days
    description:
      "Walk through a miracle carved from mountain rock—11 monolithic churches connected by tunnels, each a 12th-century masterpiece of faith and engineering. King Lalibela dreamed of a New Jerusalem, and he built it stone by stone, from heaven down.",
    slug: "rock-hewn-churches-discovery",
    tag: "UNESCO",
    images: [
      "/Images/lalibela2.webp",
      "/Images/lalibela3.webp",
      "/Images/lalibela1.webp",
    ],
    duration: "4 Days",
    highlights: [
      "Bet Giyorgis cross-shaped church",
      "Underground tunnels connecting holy sites",
      "Priests in crimson robes chanting ancient Ge'ez",
      "Morning mist over the mountain churches",
    ],
    difficulty: "Moderate",
    featured: true,
    rating: 4.8,
    reviewCount: 45,
    groupSize: "4-8 travelers",
    
    coordinates: {
      lat: 12.0318,
      lng: 39.0417,
      city: "Lalibela",
      region: "Amhara",
    },

    itinerary: [
      {
        day: 1,
        title: "Arrival in Holy Lalibela",
        description:
          "Your flight descends into the Lasta Mountains, landing at 2,500 meters where the air is thin and the atmosphere is thick with devotion. Lalibela isn't just a town—it's a pilgrimage. After settling into your hotel, ease into the wonder with the Northern Group of churches. Bet Medhane Alem greets you first: the largest monolithic church in the world, its 38 columns carved from a single rock. Your guide whispers the legend of King Lalibela—how angels worked beside men, finishing in 24 years what should have taken centuries. Evening briefing over traditional tej (honey wine) prepares you for the days ahead.",
        activities: [
          "Flight from Addis Ababa to Lalibela",
          "Hotel check-in and orientation",
          "Visit Northern Group of churches",
          "Bet Medhane Alem - world's largest monolithic church",
          "Evening cultural briefing with tej tasting",
        ],
        accommodation: "Hotel in Lalibela with mountain views",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "The Underground Cathedral",
        description:
          "Today you descend into the labyrinth. The Southern Group of churches reveals itself through narrow trenches and shadowed tunnels. Bet Maryam still holds its original 12th-century frescoes—colors so vivid they seem freshly painted. Bet Emanuel's Aksumite-style windows hint at a royal chapel, perhaps built for a king's private prayers. But the crown jewel awaits: Bet Giyorgis. Seen from above, this cross-shaped church sits isolated in its own deep pit, accessible only through a tunnel. It's the most photographed church in Ethiopia—and for good reason. Spend golden hour here, watching pilgrims in white circle the church, their voices rising in ancient chant.",
        activities: [
          "Explore Southern Group of churches",
          "See Bet Maryam's 12th-century frescoes",
          "Visit Bet Emanuel (possible royal chapel)",
          "Discover Bet Giyorgis - cross-shaped masterpiece",
          "Evening prayer service (optional)",
        ],
        accommodation: "Hotel in Lalibela",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Tigray's Cliff-Hanging Churches",
        description:
          "A day trip to the Tigray region reveals a different kind of wonder: churches built into sheer cliff faces, accessible only by climbing. Abuna Yemata Guh sits at 2,580 meters, its entrance a narrow ledge with a 200-meter drop. The hike is moderate—the reward is immense. Inside, 5th-century frescoes depict saints with wide eyes and winged angels. Your guide points out the painted hand of God reaching from a cloud. For those who prefer solid ground, alternative churches offer equally stunning frescoes without the vertigo. Return to Lalibela as the sun sets, painting the mountains gold.",
        activities: [
          "Scenic drive to Tigray region",
          "Visit Abuna Yemata Guh cliff church (optional climb)",
          "Explore additional rock churches with frescoes",
          "Photography of dramatic landscapes",
          "Return to Lalibela for overnight",
        ],
        accommodation: "Hotel in Lalibela",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Markets & Farewell",
        description:
          "One last morning to absorb Lalibela's magic. The Saturday market (if timing aligns) explodes with color: mountain farmers selling honey, pilgrims trading prayers for blessings, children chasing goats through the crowd. Visit any church you wish to revisit—perhaps Bet Giyorgis one last time. Your guide shares final stories: how locals believe the churches are guarded by angels, how the tunnels represent the journey from earthly sin to heavenly grace. After a farewell lunch of injera and spicy wat, transfer to the airport. As your plane lifts off, look down at the mountains hiding their stone secrets—and know you've walked through a miracle.",
        activities: [
          "Visit Lalibela market (if Saturday)",
          "Final church visits for photography",
          "Traditional farewell lunch",
          "Flight back to Addis Ababa",
          "Transfer to hotel or airport for onward travel",
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],

    inclusions: [
      "Domestic flights (Addis-Lalibela-Addis)",
      "Professional English-speaking historical guide",
      "3 nights accommodation in Lalibela hotels",
      "All meals as indicated",
      "All entrance fees to churches",
      "Airport transfers",
    ],

    exclusions: [
      "International flights",
      "Ethiopian visa fees",
      "Travel insurance",
      "Personal expenses",
      "Tips for guides and drivers",
      "Alcoholic beverages",
    ],

    faq: [
      {
        question: "Is there a lot of walking?",
        answer:
          "Moderate walking between churches, some uneven surfaces and steps. The Tigray cliff church involves a short hike (optional). Comfortable walking shoes are essential.",
      },
      {
        question: "What should I wear?",
        answer:
          "Modest clothing—shoulders and knees covered. A scarf is useful for additional coverage. White or light colors are traditional but not required.",
      },
    ],

    bestTime: ["October to March"],
    season: "Dry season recommended",
    departurePoint: "Addis Ababa Bole International Airport",
    languages: ["English", "Amharic"],
  },
  {
    id: "hist-002",
    name: "Aksum: Where the Ark Sleeps",
    price: 1200, // 8 Days
    description:
      "Legends say the Ark of the Covenant rests in a guarded chapel in Aksum. Whether true or not, this ancient capital will convince you—with its towering obelisks, underground tombs, and whispers of the Queen of Sheba.",
    slug: "ancient-kingdoms-expedition",
    images: ["/Images/axum1.webp", "/Images/axum2.webp", "/Images/axum3.webp"],
    duration: "8 Days",
    highlights: [
      "The Great Stele (33m, fell during construction)",
      "Queen of Sheba's Palace ruins",
      "Chapel of the Ark (exterior viewing)",
      "Ezana Stone with trilingual inscription",
    ],
    difficulty: "Easy",
    featured: true,
    rating: 4.7,
    reviewCount: 38,
    groupSize: "6-12 travelers",
    
    coordinates: {
      lat: 14.1213,
      lng: 38.7238,
      city: "Axum",
      region: "Tigray",
    },

    itinerary: [
      {
        day: 1,
        title: "Addis Ababa - First Steps",
        description:
          "Your journey through ancient kingdoms begins in Ethiopia's modern capital. The National Museum houses Lucy—3.2 million years old, she stares back at you through glass. From human origins to royal thrones, this museum sets the stage. Mount Entoto offers panoramic views of the sprawling city below. Emperor Menelik II chose this spot for his palace; now you understand why. Evening traditional dinner with cultural show—spicy wat, sour injera, and dancers spinning in white cotton. Tomorrow, you fly back 2,000 years.",
        activities: [
          "Airport pickup and transfer",
          "Visit National Museum (see Lucy)",
          "Mount Entoto panoramic views",
          "Traditional dinner with cultural performance",
        ],
        accommodation: "Hotel in Addis Ababa",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Axum - The Obelisks Awaken",
        description:
          "The flight north takes just over an hour, but you land in a different era. Axum's stelae field greets you with towering granite obelisks—the Great Stele lies broken where it fell, a reminder that even empires crumble. But the smaller obelisk still stands, returned from Italy after decades of exile. Queen of Sheba's Palace ruins stretch across the landscape—3,000 years old, according to tradition. And then: St. Mary of Zion Church complex. You cannot see the Ark (only its guardian can), but you can stand where millions have stood, hoping. The evening settles over Axum with the call to prayer and church bells mingling.",
        activities: [
          "Flight from Addis Ababa to Axum",
          "Visit stelae field and fallen Great Stele",
          "See Queen of Sheba's Palace ruins",
          "Visit St. Mary of Zion Church complex",
          "Evening orientation to Aksumite history",
        ],
        accommodation: "Hotel in Axum",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Tombs and Treasures",
        description:
          "Deeper into Aksum's underground. The Archaeological Museum holds coins bearing King Ezana's face—the first Christian king of Ethiopia. The Ezana Stone stands outside, its trilingual inscription (Sabaean, Ge'ez, Greek) telling the story of conversion. King Kaleb's tomb descends into cool darkness; your flashlight reveals stone sarcophagi and narrow passages. King Gebre Meskel's tomb nearby. Local markets offer contrast: spices, textiles, the smell of fresh coffee roasting. Tonight, optional lecture on Aksumite civilization—or simply sit at your hotel terrace, watching the sun set behind the obelisks.",
        activities: [
          "Visit Archaeological Museum",
          "See Ezana Stone inscriptions",
          "Explore tombs of Kings Kaleb and Gebre Meskel",
          "Visit local markets",
          "Optional evening lecture on Aksumite history",
        ],
        accommodation: "Hotel in Axum",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Road to Gondar - Through the Roof of Africa",
        description:
          "Today's drive is a journey in itself. The road from Axum to Gondar winds through the Simien Mountains—Africa's rooftop. Stop at viewpoints where the escarpment drops thousands of feet into valleys hidden by clouds. Traditional farming terraces cling to hillsides; women in white lead donkeys loaded with firewood. Arrive in Gondar by late afternoon—'Africa's Camelot.' Emperor Fasiladas built his capital here in 1636, and the castles still stand. Evening orientation walk through the Piazza, where Italian colonial architecture meets Ethiopian Orthodox crosses.",
        activities: [
          "Scenic drive from Axum to Gondar",
          "Simien Mountains viewpoints",
          "Arrival in Gondar",
          "Evening orientation walk",
          "Traditional Amhara dinner",
        ],
        accommodation: "Hotel in Gondar",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 5,
        title: "Gondar's Castles - Africa's Camelot",
        description:
          "Fasil Ghebbi spreads across the Royal Enclosure—six castles, three palaces, and countless legends. Fasiladas' Castle rises four stories, its crenellations and arched windows blending Ethiopian, Arab, and Baroque styles. Iyasu's Palace, though partially destroyed, still shows innovative ventilation systems—warm air pulled up, cool air drawn in. The banquet hall could seat 1,000. Then Debre Berhan Selassie Church: its ceiling painted with 80 angel faces, each one different, each one watching. 'The Light of the Trinity,' the name means. You'll understand why.",
        activities: [
          "Visit Fasil Ghebbi castle complex",
          "See Fasiladas' Castle and Iyasu's Palace",
          "Visit Debre Berhan Selassie Church",
          "Explore Fasiladas' Bath",
          "Learn about Gondarine period architecture",
        ],
        accommodation: "Hotel in Gondar",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 6,
        title: "Yeha - Ethiopia's Oldest Building",
        description:
          "A day trip to Yeha, where the 5th-century BC Temple of the Moon still stands. This is Ethiopia's oldest standing structure—built by the Sabaeans, who crossed from Yemen 2,500 years ago. The stone masonry is so precise that no mortar was needed; the blocks still fit perfectly. The adjacent museum holds Sabaean inscriptions and artifacts that predate Aksum. Drive back through landscapes dotted with roundhouses and terraced fields. Evening in Gondar: perhaps a local tej house, where honey wine flows and conversations linger.",
        activities: [
          "Drive to Yeha (1 hour)",
          "Visit 5th-century BC Temple of the Moon",
          "Explore archaeological site and museum",
          "Learn about Sabaean civilization",
          "Return to Gondar",
        ],
        accommodation: "Hotel in Gondar",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 7,
        title: "Back to Addis - Markets and Farewells",
        description:
          "Morning flight back to Addis Ababa. From ancient capitals to modern chaos: Merkato, one of Africa's largest open-air markets, swallows you into its maze. Spices piled like mountains, silver crosses gleaming, coffee beans spilling from burlap sacks. Negotiate for souvenirs—a priest's cross, a Coptic icon, handwoven scarves. Afternoon free for whatever calls you: another museum, a traditional coffee ceremony, or simply watching the city from your hotel terrace. Farewell dinner with new friends, sharing photos and stories of obelisks, castles, and the Ark that may or may not be watching.",
        activities: [
          "Flight from Gondar to Addis Ababa",
          "Visit Merkato market",
          "Free afternoon for personal exploration",
          "Farewell dinner",
        ],
        accommodation: "Hotel in Addis Ababa",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 8,
        title: "Departure - Carry the Legends Home",
        description:
          "Final breakfast overlooking Addis. Last-minute shopping for Ethiopian coffee or spices. Transfer to Bole International Airport. As your plane lifts off, look back at the mountains—and the 3,000 years of history you've walked through. The obelisks still stand. The Ark still sleeps. And you carry a piece of Axum home.",
        activities: [
          "Breakfast at hotel",
          "Last-minute shopping",
          "Transfer to airport",
          "Departure",
        ],
        accommodation: "Not included",
        meals: ["Breakfast"],
      },
    ],

    inclusions: [
      "Domestic flights (Addis-Axum, Gondar-Addis)",
      "Professional English-speaking historical guide",
      "7 nights accommodation in 3-4 star hotels",
      "All meals as indicated",
      "All entrance fees",
      "Ground transportation",
      "Airport transfers",
    ],

    exclusions: [
      "International airfare",
      "Ethiopian visa fees (USD $52 for most nationalities)",
      "Travel insurance",
      "Personal expenses",
      "Tips",
      "Alcoholic drinks",
    ],

    faq: [
      {
        question: "How physically demanding is this tour?",
        answer:
          "Easy pace with minimal strenuous activity. Most sites involve moderate walking on even surfaces. Altitude varies from 2,400m in Addis to lower elevations elsewhere.",
      },
      {
        question: "What is the best time for this tour?",
        answer:
          "October to April offers ideal dry weather and comfortable temperatures for exploring historical sites.",
      },
    ],

    bestTime: ["October to April"],
    season: "Dry season recommended",
    departurePoint: "Addis Ababa Bole International Airport",
    languages: ["English", "French and German on request"],
  },
  {
    id: "hist-003",
    name: "Gondar's Royal Legacy",
    price: 450, // 3 Days
    description:
      "Two days in Ethiopia's Camelot: castles, churches, and the bath where kings were baptized. Plus the ceiling of angels that will make you believe.",
    slug: "gondar-imperial-city-tour",
    tag: "UNESCO",
    images: [
      "/Images/gondar1.webp",
      "/Images/gondar2.webp",
      "/Images/gondar3.webp",
    ],
    duration: "3 Days",
    highlights: [
      "Fasil Ghebbi's six castles",
      "80 angel faces on one ceiling",
      "Fasiladas' Bath (still used for Timkat)",
      "Empress Mentewab's mountain retreat",
    ],
    difficulty: "Easy",
    featured: true,
    rating: 4.7,
    reviewCount: 42,
    groupSize: "4-10 travelers",

    coordinates: {
      lat: 12.6075,
      lng: 37.4585,
      city: "Gondar",
      region: "Amhara",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival & Royal Enclosure",
        description: "Arrive in Gondar, explore the Royal Enclosure and castles",
        activities: [
          "Flight to Gondar",
          "Fasil Ghebbi Castle Complex",
          "Royal Enclosure tour",
        ],
        accommodation: "Goha Hotel or similar",
        meals: ["Dinner"],
      },
    ],
    inclusions: [
      "All entrance fees",
      "Professional guide",
      "2 nights accommodation",
      "All meals",
    ],
    exclusions: [
      "International flights",
      "Personal expenses",
    ],
    bestTime: ["October to April"],
    departurePoint: "Gondar Airport",
    languages: ["English", "Amharic"],
  },
  {
    id: "hist-004",
    name: "Gondar's Imperial Legacy",
    price: 480, // 3 Days
    description:
      "Three days exploring the castles, churches, and royal baths of Ethiopia's 17th-century capital—where African kings built their Camelot.",
    slug: "gondar-imperial-city-tour",
    tag: "UNESCO",
    images: [
      "/Images/gondar1.webp",
      "/Images/gondar2.webp",
      "/Images/gondar3.webp",
    ],
    duration: "3 Days",
    highlights: [
      "Fasil Ghebbi Castle Complex",
      "Fasiladas' Bath",
      "Debre Berhan Selassie Church",
      "Royal Enclosure",
      "Imperial Architecture"
    ],
    difficulty: "Easy",
    featured: true,
    rating: 4.7,
    reviewCount: 42,
    groupSize: "4-10 travelers",

    coordinates: {
      lat: 12.6075,
      lng: 37.4585,
      city: "Gondar",
      region: "Amhara",
    },

    itinerary: [
      {
        day: 1,
        title: "Arrival in Imperial Gondar",
        description: "Welcome to Gondar, the Camelot of Africa, founded by Emperor Fasiladas in 1636. After arriving at Gondar Airport, transfer to your hotel overlooking the historic castle complex. Begin with an orientation walk through the historic Piazza area, learning about Gondar's unique architectural heritage that blends Ethiopian, Arab, and Baroque influences. The evening features sunset views over the castle complex, followed by a welcome dinner introducing you to traditional Amhara cuisine and the fascinating history of Ethiopia's imperial capital during the Gondarine period.",
        activities: [
          "Arrival at Gondar Airport and hotel transfer",
          "Hotel check-in with castle complex orientation",
          "Orientation walk through historic Piazza area",
          "Sunset viewing over castle complex",
          "Welcome dinner with Amhara cuisine and historical context"
        ],
        accommodation: "Hotel in Gondar with castle views",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Royal Enclosure Comprehensive Tour",
        description: "Embark on a comprehensive guided tour of Fasil Ghebbi, the UNESCO World Heritage castle complex that served as the residence of Ethiopian emperors for over two centuries. Begin with Fasiladas' Castle, the oldest and most impressive structure, examining its unique architectural features and strategic design. Continue to Iyasu's Palace, considered the most beautiful of all Gondar's castles before its partial destruction, noting its innovative ventilation systems and decorative elements. Explore Dawit's Hall, the banquet hall where royal ceremonies took place, followed by visits to all six castles within the complex. The day includes a traditional lunch nearby, reflecting on the complex's historical significance.",
        activities: [
          "Guided tour of Fasil Ghebbi UNESCO site",
          "Visit Fasiladas' Castle and architectural features",
          "Explore Iyasu's Palace and royal quarters",
          "See Dawit's Hall and imperial banquet hall",
          "Visit all six castles within the royal enclosure"
        ],
        accommodation: "Hotel in Gondar",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Cultural Heritage & Farewell Gondar",
        description: "Visit Fasiladas' Bath, an impressive sunken pool complex still used for Timkat (Epiphany) celebrations, where thousands gather annually for reenactments of Christ's baptism. Continue to Debre Berhan Selassie Church, renowned for its magnificent ceiling paintings of 80 cherubic faces and vivid wall frescoes depicting biblical scenes. Explore the Qusquam complex built by Empress Mentewab, including the Church of Qusquam Maryam with its unique architectural style. After a farewell lunch featuring local specialties, make final visits to any castle areas you wish to revisit before your departure transfer to the airport.",
        activities: [
          "Visit Fasiladas' Bath, site of Timkat celebrations",
          "See Debre Berhan Selassie Church with famous ceiling",
          "Explore Qusquam complex and religious sites",
          "Farewell lunch with Gondar specialties",
          "Departure transfer to Gondar Airport"
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],

    inclusions: [
      "All ground transportation including airport transfers",
      "Professional English-speaking historical guide",
      "2 nights accommodation in Gondar hotels",
      "All meals as indicated in itinerary",
      "All entrance fees to castles and historical sites",
      "Hotel transfers in Gondar",
      "Comprehensive historical briefings and materials"
    ],

    exclusions: [
      "International flights to/from Ethiopia",
      "Ethiopian visa fees",
      "Comprehensive travel insurance",
      "Personal expenses and souvenirs",
      "Tips for guides, drivers, and hotel staff",
      "Alcoholic beverages and special drinks",
      "Extra activities not mentioned in itinerary"
    ],

    faq: [
      {
        question: "How physically demanding is the castle tour?",
        answer: "This tour maintains an easy pace with moderate walking on generally even surfaces. The castle complex is relatively compact, and most areas are easily accessible. Comfortable walking shoes are recommended, but no strenuous hiking is required."
      },
      {
        question: "Can we attend a Timkat celebration during this tour?",
        answer: "If you travel during January (usually January 19-20), you can witness the spectacular Timkat celebrations at Fasiladas' Bath. However, this is one of Ethiopia's busiest periods, so advance booking is essential. Our tour can be adjusted to include Timkat celebrations upon request."
      },
      {
        question: "What is the best time to visit Gondar?",
        answer: "October to April offers ideal conditions with dry weather and comfortable temperatures for exploring historical sites. The rainy season (June-September) can make some areas muddy, though historical exploration is still possible."
      }
    ],

    bestTime: ["October to April"],
    season: "Dry season recommended for optimal conditions",
    departurePoint: "Gondar Airport",
    languages: ["English", "Amharic"]
  },
  {
    id: "hist-005",
    name: "Axum: Kingdom of Obelisks",
    price: 680, // 4 Days
    description:
      "Four days in Ethiopia's most ancient capital, where 2,000-year-old stelae still stand guard over the legendary Ark of the Covenant.",
    slug: "axum-archaeological-expedition",
    tag: "UNESCO",
    images: [
      "/Images/axum1.webp",
      "/Images/axum2.webp",
      "/Images/axum3.webp",
    ],
    duration: "4 Days",
    highlights: [
      "Ancient Stelae Field",
      "Queen of Sheba's Palace",
      "St. Mary of Zion Church",
      "Archaeological Museum",
      "Aksumite Tombs"
    ],
    difficulty: "Easy",
    featured: true,
    rating: 4.6,
    reviewCount: 38,
    groupSize: "4-8 travelers",

    coordinates: {
      lat: 14.1213,
      lng: 38.7238,
      city: "Axum",
      region: "Tigray",
    },

    itinerary: [
      {
        day: 1,
        title: "Arrival in Ancient Axum",
        description: "Welcome to Axum, the cradle of Ethiopian civilization and once the heart of one of Africa's greatest ancient empires. After arriving at Axum Airport, transfer to your hotel in the center of this historic town, which served as the capital of the Aksumite Kingdom from approximately 100-940 AD. In the late afternoon, visit the Northern Stelae Field, observing the Great Stele (33m tall) that fell during construction, and learn about the sophisticated engineering techniques used to erect these monumental granite obelisks. The evening begins with an orientation walk through Axum's historic center, followed by a traditional welcome dinner featuring authentic Tigrayan cuisine.",
        activities: [
          "Arrival at Axum Airport and hotel transfer",
          "Hotel check-in and historical orientation",
          "Visit the Northern Stelae Field with ancient obelisks",
          "See the Great Stele (33m tall, fell during construction)",
          "Traditional welcome dinner with Tigrayan cuisine"
        ],
        accommodation: "Hotel in Axum",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Archaeological Wonders of the Aksumite Empire",
        description: "Explore the legendary ruins of Queen of Sheba's Palace, dating back approximately 3,000 years, and examine the sophisticated drainage systems, stone masonry, and construction techniques that characterize Aksumite architecture. Study the multilingual Ezana Stone, inscribed in Sabaean, Ge'ez, and Greek, which provides crucial insights into ancient Ethiopian history and the kingdom's conversion to Christianity. Visit the excellent Archaeological Museum housing artifacts from the Aksumite period, including pottery, coins, and royal inscriptions. Continue to the Tombs of King Kaleb and Gebre Meskel, exploring the underground chambers that once held royal treasures.",
        activities: [
          "Explore Queen of Sheba's Palace ruins (approximately 3,000 years old)",
          "Study the multilingual Ezana Stone inscriptions",
          "Visit the Archaeological Museum with Aksumite artifacts",
          "Explore Tomb of King Kaleb and royal chambers",
          "See Tomb of King Gebre Meskel with underground passages"
        ],
        accommodation: "Hotel in Axum",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Religious Heritage & Sacred Christian Sites",
        description: "Visit the sacred St. Mary of Zion Church complex, the supposed resting place of the Ark of the Covenant according to Ethiopian Orthodox tradition. Learn about the immense religious significance of this site, which draws pilgrims from across Ethiopia. See the Chapel of the Ark (closed to women and most visitors) and explore the Cathedral of Tsion with its beautiful religious artwork, ancient manuscripts, and historical artifacts. In the late afternoon, witness or attend a traditional prayer service, experiencing the deep spirituality that permeates this holy city.",
        activities: [
          "Visit St. Mary of Zion Church complex, alleged Ark location",
          "See the Chapel of the Ark (exterior viewing)",
          "Explore the monastery complex with ancient manuscripts",
          "Visit the Cathedral of Tsion with religious artwork",
          "Traditional prayer service experience with local worshippers"
        ],
        accommodation: "Hotel in Axum",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Yeha Temple Excursion & Departure",
        description: "Embark on a day trip to Yeha (approximately 1 hour drive) to visit Ethiopia's oldest standing structure - the 5th century BC Temple of the Moon, built by the Sabaean civilization that preceded the Aksumite Kingdom. Explore the archaeological site and adjacent museum containing Sabaean inscriptions, artifacts, and evidence of pre-Aksumite civilization that provides context for understanding Ethiopia's ancient history. Return to Axum for a farewell lunch featuring local specialties before your departure transfer to the airport.",
        activities: [
          "Drive to Yeha Temple (approximately 1 hour)",
          "Visit 5th century BC Temple of the Moon ruins",
          "Explore archaeological site with Sabaean influences",
          "Return to Axum for farewell lunch",
          "Departure transfer to Axum Airport"
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],

    inclusions: [
      "All ground transportation including airport transfers",
      "Professional English-speaking archaeological guide",
      "3 nights accommodation in Axum hotels",
      "All meals as indicated in itinerary",
      "All entrance fees to archaeological sites and museums",
      "Day trip to Yeha Temple",
      "Hotel transfers in Axum"
    ],

    exclusions: [
      "International flights to/from Ethiopia",
      "Ethiopian visa fees",
      "Comprehensive travel insurance",
      "Personal expenses and souvenirs",
      "Tips for guides, drivers, and hotel staff",
      "Alcoholic beverages and special drinks",
      "Extra activities not mentioned in itinerary"
    ],

    faq: [
      {
        question: "Is photography allowed at all archaeological sites?",
        answer: "Photography is generally allowed at most sites, but flash photography may be prohibited in certain areas to protect ancient artifacts. Photography inside churches may have restrictions. Always follow your guide's instructions and respect any posted signs."
      },
      {
        question: "What should I know about visiting religious sites in Axum?",
        answer: "Modest clothing is required when visiting churches - shoulders and knees should be covered. Remove shoes before entering some religious buildings. Women are not allowed to enter the Chapel of the Ark. Be respectful of worshippers and religious ceremonies."
      },
      {
        question: "How extensive are the walking requirements?",
        answer: "Moderate walking is required between sites, but distances are generally manageable. The archaeological sites involve walking on uneven ground. Comfortable walking shoes are essential. The pace can be adjusted based on group needs."
      }
    ],

    bestTime: ["October to March"],
    season: "Dry season recommended for archaeological exploration",
    departurePoint: "Axum Airport",
    languages: ["English", "Tigrinya", "Amharic"]
  },
  {
    id: "hist-006",
    name: "Harar: City of Saints",
    price: 520, // 3 Days
    description:
      "Three days inside the ancient walled city of Harar—Islam's fourth holiest city, where hyenas eat from human hands and every alley tells a story.",
    slug: "harar-walled-city-experience",
    tag: "UNESCO",
    images: [
      "/Images/harar1.webp",
      "/Images/harar2.webp",
      "/Images/harar3.webp",
    ],
    duration: "3 Days",
    highlights: [
      "Jugol Walled City",
      "Hyena Feeding Tradition",
      "Harari Traditional Houses",
      "Historic Markets",
      "Islamic Architecture"
    ],
    difficulty: "Easy",
    featured: true,
    rating: 4.5,
    reviewCount: 29,
    groupSize: "4-8 travelers",

    coordinates: {
      lat: 9.3146,
      lng: 42.1265,
      city: "Harar",
      region: "Harari",
    },

    itinerary: [
      {
        day: 1,
        title: "Arrival in Historic Harar",
        description: "Welcome to Harar Jugol, the ancient walled city recognized as the fourth holiest city in Islam and a UNESCO World Heritage site renowned for its unique urban fabric and cultural traditions. After arriving at Dire Dawa Airport, transfer to Harar, experiencing the transition from modern airport to historic city. Check in to your hotel within or near the Jugol walls. Begin with an evening walk around the historic Jugol perimeter, observing the gates and fortifications that have protected this city for centuries. Enjoy a traditional dinner introducing you to Harari cuisine, known for its distinctive flavors and culinary traditions that reflect the city's position at cultural crossroads.",
        activities: [
          "Arrival at Dire Dawa Airport and transfer to Harar",
          "Transfer to hotel within or near Jugol walls",
          "Hotel check-in and orientation",
          "Evening walk around historic Jugol perimeter",
          "Traditional dinner with Harari cuisine"
        ],
        accommodation: "Hotel in Harar",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Jugol Walled City Immersive Exploration",
        description: "Embark on a comprehensive exploration of Harar Jugol, visiting the five main gates that control access to the historic city. Walk through narrow alleys and passageways that characterize the traditional urban fabric, observing the distinctive Harari houses with their colorful doors and interior courtyards. See traditional Harari houses (gegar), learning about architectural features adapted to climate and social needs. Visit local markets selling spices, textiles, and traditional crafts that reflect Harar's trading history. The day concludes with a traditional coffee ceremony, experiencing this important social ritual while learning about Harar's position as a historical center of coffee trade and Islamic scholarship in the Horn of Africa.",
        activities: [
          "Visit the five historic gates of Jugol",
          "Walk through narrow alleys and traditional passages",
          "See traditional Harari houses (gegar) with courtyards",
          "Visit local markets with spices and crafts",
          "Traditional coffee ceremony with cultural context"
        ],
        accommodation: "Hotel in Harar",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Cultural Heritage & Departure",
        description: "Visit the Grand Mosque of Harar and Jamia Mosque, important centers of Islamic learning and worship with distinctive architectural features. Explore Harar Museum, containing artifacts, manuscripts, and exhibits that illustrate the city's rich history as a trading hub and Islamic center. Visit the Arthur Rimbaud House, dedicated to the French poet who lived in Harar, with exhibitions about his life and Harar's 19th-century history. The evening features the unique experience of hyena feeding at one of the traditional sites outside the walls, where for generations, certain families have maintained relationships with wild hyenas, feeding them by hand or mouth in a remarkable cultural practice. Enjoy a farewell dinner before your departure transfer.",
        activities: [
          "Visit Grand Mosque of Harar for Islamic heritage",
          "See Jamia Mosque and other religious sites",
          "Visit Harar Museum with historical exhibits",
          "Explore Arthur Rimbaud House and exhibitions",
          "Evening hyena feeding experience outside walls"
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
    ],

    inclusions: [
      "All ground transportation including airport transfers",
      "Professional English-speaking cultural guide",
      "2 nights accommodation in Harar hotels",
      "All meals as indicated in itinerary",
      "All entrance fees to museums and historical sites",
      "Hyena feeding experience",
      "Traditional coffee ceremony"
    ],

    exclusions: [
      "International flights to/from Ethiopia",
      "Ethiopian visa fees",
      "Comprehensive travel insurance",
      "Personal expenses and souvenirs",
      "Tips for guides, drivers, and hotel staff",
      "Alcoholic beverages and special drinks",
      "Extra activities not mentioned in itinerary"
    ],

    faq: [
      {
        question: "Is the hyena feeding experience safe?",
        answer: "Yes, the hyena feeding is conducted by experienced local handlers who have maintained relationships with specific hyena clans for generations. Visitors observe from a safe distance and follow the handlers' instructions. The experience is supervised at all times to ensure safety."
      },
      {
        question: "What should I wear in Harar?",
        answer: "Modest clothing is recommended, especially when visiting mosques and religious sites. Harar has a conservative Islamic culture, so dressing respectfully is important. Lightweight, breathable fabrics are ideal for the warm climate, and comfortable walking shoes are essential for exploring the walled city."
      },
      {
        question: "Is Harar suitable for solo female travelers?",
        answer: "Yes, Harar is generally safe for solo female travelers, though standard precautions should be taken. Dress modestly, avoid walking alone at night in less populated areas, and use registered guides for city exploration. The local community is welcoming to respectful visitors."
      }
    ],

    bestTime: ["October to March"],
    season: "Dry season recommended for comfortable exploration",
    departurePoint: "Dire Dawa Airport",
    languages: ["English", "Harari", "Amharic"]
  },
  {
    id: "hist-007",
    name: "Tigray's Cliff Churches",
    price: 720, // 4 Days
    description:
      "Four days of moderate hiking to Ethiopia's most dramatic rock churches—built into sheer cliffs, accessed by narrow ledges, and decorated with 5th-century frescoes.",
    slug: "tigray-rock-hewn-churches",
    tag: "UNESCO",
    images: [
      "/Images/lalibela2.webp",
      "/Images/lalibela3.webp",
      "/Images/lalibela1.webp",
    ],
    duration: "4 Days",
    highlights: [
      "Abuna Yemata Guh Church",
      "Mountain Monasteries",
      "Cliff Church Architecture",
      "Scenic Hikes",
      "Ancient Frescoes"
    ],
    difficulty: "Moderate",
    featured: true,
    rating: 4.8,
    reviewCount: 31,
    groupSize: "4-6 travelers",

    coordinates: {
      lat: 13.5,
      lng: 39.5,
      city: "Mekele",
      region: "Tigray",
    },

    itinerary: [
      {
        day: 1,
        title: "Arrival in Tigray Region",
        description: "Welcome to Tigray, home to some of Ethiopia's most spectacular and remote rock-hewn churches. After arriving in Mekele, the regional capital, transfer to your hotel and receive a comprehensive briefing about the unique architectural and religious heritage of Tigray's cliff churches. The afternoon includes a visit to local historical sites in Mekele, providing context for the region's rich history. Enjoy a traditional Tigrayan dinner while learning about the cultural and religious significance of the churches you'll explore in the coming days.",
        activities: [
          "Arrival in Mekele and hotel transfer",
          "Hotel check-in and orientation",
          "Briefing on Tigray church history and architecture",
          "Visit local historical sites in Mekele",
          "Traditional dinner with Tigrayan cuisine"
        ],
        accommodation: "Hotel in Mekele",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Abuna Yemata Guh Cliff Church",
        description: "Embark on an unforgettable journey to Abuna Yemata Guh, one of Tigray's most spectacular cliff churches, built into a sheer rock face at approximately 2,580 meters above sea level. The approach involves a moderate hike and climb (with safety equipment provided) to reach this remarkable church. Marvel at the breathtaking views and the church's well-preserved frescoes dating back to the 5th century. Learn about the church's history, construction techniques, and ongoing religious significance. The physical effort is rewarded with one of Ethiopia's most remarkable spiritual and visual experiences.",
        activities: [
          "Scenic drive to church location",
          "Moderate hike to Abuna Yemata Guh",
          "Safety briefing and equipment check",
          "Explore cliff church architecture and frescoes",
          "Learn about church history and significance"
        ],
        accommodation: "Hotel in Mekele",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Additional Tigray Churches Exploration",
        description: "Explore additional remarkable Tigray churches, each with unique characteristics and locations. Visit churches such as Abreha we Atsbeha, known for its beautiful frescoes and architectural features, and other selected churches based on accessibility and group interest. Learn about the differences between Tigray church architecture and other Ethiopian rock-hewn churches. Enjoy scenic drives through the dramatic Tigray landscape, with stops at viewpoints offering panoramic vistas of the region's unique geology and traditional agricultural practices.",
        activities: [
          "Visit Abreha we Atsbeha church",
          "Explore additional selected Tigray churches",
          "Learn about architectural variations and history",
          "Scenic drives through Tigray landscape",
          "Photography at dramatic viewpoints"
        ],
        accommodation: "Hotel in Mekele",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Cultural Context & Departure",
        description: "Visit a traditional Tigray village to understand the cultural context in which these remarkable churches were created and maintained. Learn about local community life, agricultural practices, and the ongoing relationship between communities and their religious heritage. Enjoy a farewell lunch featuring local specialties before your departure transfer. Reflect on your Tigray experience, carrying memories of breathtaking cliff churches, dramatic landscapes, and deep spiritual heritage.",
        activities: [
          "Visit traditional Tigray village",
          "Learn about community life and culture",
          "Farewell lunch with local specialties",
          "Tour reflection and discussion",
          "Departure transfer from Mekele"
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],

    inclusions: [
      "All ground transportation including airport transfers",
      "Professional English-speaking guide with Tigray expertise",
      "3 nights accommodation in Mekele hotels",
      "All meals as indicated in itinerary",
      "All entrance fees to churches and historical sites",
      "Safety equipment for cliff church visits",
      "Hotel transfers in Mekele"
    ],

    exclusions: [
      "International flights to/from Ethiopia",
      "Ethiopian visa fees",
      "Comprehensive travel insurance",
      "Personal expenses and souvenirs",
      "Tips for guides, drivers, and hotel staff",
      "Alcoholic beverages and special drinks",
      "Extra activities not mentioned in itinerary"
    ],

    faq: [
      {
        question: "How physically demanding is the climb to Abuna Yemata Guh?",
        answer: "The climb involves moderate physical exertion including hiking and some climbing with safety ropes. It requires reasonable fitness and is not recommended for those with fear of heights or significant mobility issues. Safety equipment is provided, and the climb is supervised by experienced guides."
      },
      {
        question: "What safety measures are in place for cliff church visits?",
        answer: "We provide safety equipment including harnesses and ropes where necessary. All climbs are supervised by experienced guides familiar with the routes. We assess weather conditions and individual fitness levels to ensure safety. Alternative churches are available for those who prefer less challenging access."
      },
      {
        question: "What should I wear for church visits?",
        answer: "Sturdy hiking shoes with good grip are essential. Modest clothing is required for church visits - shoulders and knees should be covered. Lightweight, breathable layers are recommended as temperatures can vary. A small backpack for water and essentials is useful."
      }
    ],

    bestTime: ["October to March"],
    season: "Dry season essential for safe access to cliff churches",
    departurePoint: "Mekele Airport",
    languages: ["English", "Tigrinya"]
  },
  {
    id: "hist-008",
    name: "The Grand Historical Circuit",
    price: 2500, // 12 Days
    description:
      "Twelve days covering all of Ethiopia's UNESCO wonders: Lalibela's rock churches, Axum's obelisks, Gondar's castles, and the cliff churches of Tigray. The complete historical journey.",
    slug: "complete-historical-route",
    tag: "Premium",
    images: [
      "/Images/lalibela1.webp",
      "/Images/axum1.webp",
      "/Images/gondar1.webp",
    ],
    duration: "12 Days",
    highlights: [
      "Lalibela Rock-Hewn Churches",
      "Gondar Imperial Castles",
      "Axum Ancient Kingdom",
      "Tigray Cliff Churches",
      "Comprehensive Historical Context"
    ],
    difficulty: "Moderate",
    featured: true,
    rating: 4.9,
    reviewCount: 56,
    groupSize: "6-12 travelers",
    
    coordinates: {
      lat: 9.032,
      lng: 38.7468,
      city: "Addis Ababa",
      region: "Addis Ababa",
    },

    itinerary: [
      {
        day: 1,
        title: "Arrival in Addis Ababa - Historical Introduction",
        description: "Welcome to Ethiopia, a country with over 3,000 years of recorded history. After airport pickup and transfer to your hotel, begin with a visit to the National Museum, home to 'Lucy' (Australopithecus afarensis) and other archaeological treasures that provide crucial context for understanding human evolution in the Horn of Africa. Visit the Ethnological Museum to gain insight into Ethiopia's diverse cultures and historical development. The evening features a welcome dinner with traditional Ethiopian cuisine and an introductory briefing about the remarkable historical journey ahead.",
        activities: [
          "Airport pickup and hotel transfer in Addis Ababa",
          "Visit National Museum (see Lucy fossil)",
          "Explore Ethnological Museum for cultural context",
          "Welcome dinner with Ethiopian cuisine",
          "Historical journey briefing and orientation"
        ],
        accommodation: "Hotel in Addis Ababa",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Flight to Lalibela - Spiritual Heart",
        description: "Fly to Lalibela, Ethiopia's spiritual heart and home to remarkable rock-hewn churches. Upon arrival, begin exploring the Northern Group of churches, easing into the remarkable architectural wonders. Visit Bet Medhane Alem, the world's largest monolithic church, and other significant churches in this group. The evening includes a cultural briefing about King Lalibela's vision and the construction techniques that created these 12th-century marvels.",
        activities: [
          "Flight from Addis Ababa to Lalibela",
          "Arrival and hotel check-in in Lalibela",
          "Visit Northern Group of rock-hewn churches",
          "See Bet Medhane Alem and connected churches",
          "Evening cultural and historical briefing"
        ],
        accommodation: "Hotel in Lalibela",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Comprehensive Lalibela Exploration",
        description: "Embark on a full day exploring Lalibela's remarkable churches. Continue with the Northern Group before visiting the iconic cross-shaped Bet Giyorgis (St. George's Church), considered the most visually perfect of all Lalibela's churches. Explore the Southern Group of churches, learning about their architectural features and religious significance. The day concludes with the option to attend an evening prayer service, experiencing the living religious traditions that continue to animate these ancient structures.",
        activities: [
          "Continue Northern Group church exploration",
          "Visit iconic Bet Giyorgis (St. George's Church)",
          "Explore Southern Group of churches",
          "Learn about architectural and religious significance",
          "Optional evening prayer service experience"
        ],
        accommodation: "Hotel in Lalibela",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Tigray Region Day Excursion",
        description: "Venture beyond Lalibela on a day trip to the nearby Tigray region, renowned for its dramatic cliff churches. Visit selected Tigray rock churches, each with unique architectural features, frescoes, and historical significance. Learn about the differences between Tigray and Lalibela church construction techniques and historical contexts. Return to Lalibela in the evening, reflecting on the diverse expressions of Ethiopian rock-hewn church architecture.",
        activities: [
          "Scenic drive to Tigray region",
          "Visit selected Tigray cliff churches",
          "Learn about regional architectural differences",
          "Explore church frescoes and historical context",
          "Return to Lalibela with historical reflections"
        ],
        accommodation: "Hotel in Lalibela",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 5,
        title: "Flight to Gondar - Imperial Capital",
        description: "Fly to Gondar, Ethiopia's imperial capital founded by Emperor Fasiladas in 1636. Upon arrival, begin exploring the remarkable Fasil Ghebbi castle complex, a UNESCO World Heritage site often called 'Africa's Camelot.' Visit Fasiladas' Castle, the oldest and most impressive structure, and explore other castles within the royal enclosure. The evening includes orientation to Gondar's unique architectural heritage.",
        activities: [
          "Flight from Lalibela to Gondar",
          "Arrival and hotel check-in in Gondar",
          "Visit Fasil Ghebbi castle complex",
          "Explore Fasiladas' Castle and royal enclosure",
          "Evening orientation to Gondar's history"
        ],
        accommodation: "Hotel in Gondar",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 6,
        title: "Gondar Comprehensive Exploration",
        description: "Continue exploring Gondar's historical sites. Visit Fasiladas' Bath, still used for Timkat celebrations, and Debre Berhan Selassie Church, renowned for its magnificent ceiling paintings. Explore additional historical baths and the Qusquam complex built by Empress Mentewab. Learn about Gondar's significance during Ethiopia's Gondarine period and its architectural legacy blending Ethiopian, Arab, and Baroque influences.",
        activities: [
          "Visit Fasiladas' Bath for Timkat context",
          "See Debre Berhan Selassie Church with famous ceiling",
          "Explore Qusquam complex and historical baths",
          "Learn about Gondarine period history",
          "Traditional coffee ceremony with cultural context"
        ],
        accommodation: "Hotel in Gondar",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 7,
        title: "Scenic Drive to Axum",
        description: "Embark on a scenic drive from Gondar to Axum, traveling through the spectacular landscapes of the Simien Mountains region. Enjoy stops at viewpoints offering breathtaking panoramas of Ethiopia's 'Roof of Africa.' Observe changing ecosystems and traditional agricultural practices along the route. Arrive in Axum in the late afternoon, checking into your hotel in this ancient capital city.",
        activities: [
          "Scenic drive from Gondar to Axum",
          "Stop at Simien Mountains viewpoints",
          "Observe traditional agricultural practices",
          "Arrival in Axum and hotel check-in",
          "Evening orientation to Aksumite history"
        ],
        accommodation: "Hotel in Axum",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 8,
        title: "Axum Archaeological Wonders",
        description: "Explore Axum's archaeological treasures, beginning with the ancient stelae field featuring towering granite obelisks that testify to Aksumite engineering prowess. Visit the ruins of Queen of Sheba's Palace and study the multilingual Ezana Stone. Explore the Archaeological Museum housing artifacts from the Aksumite period and visit the tombs of Kings Kaleb and Gebre Meskel.",
        activities: [
          "Visit ancient stelae field with obelisks",
          "Explore Queen of Sheba's Palace ruins",
          "Study multilingual Ezana Stone inscriptions",
          "Visit Archaeological Museum with Aksumite artifacts",
          "Explore tombs of Kings Kaleb and Gebre Meskel"
        ],
        accommodation: "Hotel in Axum",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 9,
        title: "Axum Religious Heritage",
        description: "Visit the sacred St. Mary of Zion Church complex, the supposed resting place of the Ark of the Covenant. Learn about the immense religious significance of this site to Ethiopian Orthodox Christianity. See the Chapel of the Ark and explore the Cathedral of Tsion with its religious artwork and ancient manuscripts. The afternoon includes exploration of local markets and historical sites.",
        activities: [
          "Visit St. Mary of Zion Church complex",
          "See Chapel of the Ark (exterior viewing)",
          "Explore Cathedral of Tsion with religious artwork",
          "Visit local markets for cultural context",
          "Additional historical site exploration"
        ],
        accommodation: "Hotel in Axum",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 10,
        title: "Yeha Temple Excursion",
        description: "Embark on a day trip to Yeha to visit Ethiopia's oldest standing structure - the 5th century BC Temple of the Moon, built by the Sabaean civilization that preceded the Aksumite Kingdom. Explore the archaeological site and adjacent museum containing Sabaean inscriptions and artifacts. Learn about pre-Aksumite civilization and its influence on later Ethiopian history.",
        activities: [
          "Drive to Yeha Temple",
          "Visit 5th century BC Temple of the Moon",
          "Explore archaeological site and museum",
          "Learn about Sabaean influences and pre-Aksumite history",
          "Return to Axum with historical reflections"
        ],
        accommodation: "Hotel in Axum",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 11,
        title: "Return to Addis Ababa - Synthesis",
        description: "Fly back to Addis Ababa, returning from ancient capitals to Ethiopia's modern center. Enjoy free time for personal exploration, shopping for souvenirs, or additional museum visits. The evening features a farewell dinner celebrating your comprehensive historical journey, discussing the connections between the ancient civilizations you've explored and their significance for understanding Ethiopian identity and history.",
        activities: [
          "Flight from Axum to Addis Ababa",
          "Free time for personal exploration",
          "Shopping for souvenirs and traditional items",
          "Optional additional museum visits",
          "Farewell dinner celebrating historical journey"
        ],
        accommodation: "Hotel in Addis Ababa",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 12,
        title: "Departure from Ethiopia",
        description: "Enjoy a final breakfast at your hotel, reflecting on your comprehensive journey through Ethiopia's ancient civilizations. Take opportunity for last-minute shopping or visits before your transfer to Addis Ababa Bole International Airport for departure. Carry with you memories of remarkable archaeological sites, architectural wonders, and deeper understanding of Ethiopia's rich historical tapestry spanning millennia.",
        activities: [
          "Breakfast at hotel with journey reflections",
          "Last minute shopping or visits",
          "Hotel check-out and preparation for departure",
          "Airport transfer to Addis Ababa Bole International Airport",
          "Departure from Ethiopia with historical insights"
        ],
        accommodation: "Not included",
        meals: ["Breakfast"],
      },
    ],

    inclusions: [
      "All domestic flights as per itinerary (Addis-Lalibela-Gondar-Axum-Addis)",
      "Professional English-speaking historical guide throughout",
      "11 nights accommodation in 3-4 star hotels",
      "All meals as indicated in detailed itinerary",
      "All entrance fees to historical sites, churches, and museums",
      "All ground transportation in comfortable vehicles",
      "Airport transfers on arrival and departure",
      "Comprehensive historical briefings and materials",
      "Day trip to Yeha Temple from Axum",
      "Traditional coffee ceremonies and cultural experiences"
    ],

    exclusions: [
      "International airfare to/from Ethiopia",
      "Ethiopian visa fees (currently USD $52 for most nationalities)",
      "Comprehensive travel insurance with medical evacuation",
      "Personal expenses, laundry, telephone calls",
      "Tips for guides, drivers, and hotel staff",
      "Alcoholic drinks and specialty beverages",
      "Camera fees at some specific sites (if applicable)",
      "Any activities not specified in itinerary"
    ],

    faq: [
      {
        question: "How physically demanding is this comprehensive tour?",
        answer: "This tour involves moderate physical activity including walking on uneven surfaces, some steps at historical sites, and optional hikes. The pace is designed to be manageable for most fitness levels, with adequate rest periods. Comfortable walking shoes are essential. Specific physical requirements for each site are explained in advance."
      },
      {
        question: "What is the accommodation standard on this tour?",
        answer: "You'll stay in comfortable 3-4 star hotels with private bathrooms, hot water, and modern amenities. In historical areas, hotels may have more traditional character while maintaining comfort standards. All accommodations are carefully selected for cleanliness, safety, and convenient access to historical sites."
      },
      {
        question: "How does this tour handle altitude considerations?",
        answer: "The tour gradually acclimatizes to altitude, starting in Addis Ababa (2,400m) before visiting higher areas. Lalibela is at 2,500m, Gondar at 2,200m, and Axum at 2,100m. The itinerary includes acclimatization days, and guides monitor for altitude symptoms. Individuals with known altitude sensitivity should consult their doctor before travel."
      }
    ],

    bestTime: ["October to April"],
    season: "Dry season essential for comprehensive historical exploration",
    departurePoint: "Addis Ababa Bole International Airport",
    languages: ["English", "French and German available on request"]
  }
];

// Cultural Tours Data
export const culturalTours= [
  {
    id: "cult-001",
    name: "Omo Valley Tribal Experience",
    price: 950, // 6 Days
    description:
      "Deep cultural immersion with Ethiopia's diverse indigenous tribes in the remote Omo Valley, where ancient traditions continue to shape daily life",
    slug: "omo-valley-tribal-experience",
    images: [
      "/Images/omo5.jpg",
      "/Images/omo6.jpg",
      "/Images/omo7.jpg",
      "/Images/omo4.webp",
      "/Images/omo1.webp",
      "/Images/omo2.webp",
    ],
    duration: "6 Days",
    highlights: [
      "Mursi Village",
      "Hamer Ceremonies",
      "Konso Culture",
      "Traditional Markets",
    ],
    difficulty: "Moderate",
    featured: true,
    rating: 4.9,
    reviewCount: 52,
    groupSize: "4-8 travelers",
    
    coordinates: {
      lat: 5.4652,
      lng: 36.4869,
      city: "Jinka",
      region: "Southern Nations",
    },
    itinerary: [
      {
        day: 1,
        title: "Addis Ababa to Arba Minch - Gateway to Southern Cultures",
        description:
          "Begin your cultural journey with a morning flight from Addis Ababa to Arba Minch, descending from the highlands to the warmer climate of southern Ethiopia. Upon arrival, visit a Dorze village in the nearby highlands, renowned for their distinctive elephant-shaped houses made from bamboo and enset (false banana) leaves. Witness a traditional weaving demonstration using sustainable materials and learn about Dorze cultural practices, social organization, and agricultural systems. Enjoy a cultural lunch featuring southern Ethiopian specialties. The afternoon includes a comprehensive briefing about Omo Valley tribes, ethical tourism practices, and cultural sensitivity guidelines to ensure respectful engagement throughout your journey. Overnight in Arba Minch with anticipation for deeper cultural immersion ahead.",
        activities: [
          "Flight from Addis Ababa to Arba Minch",
          "Visit Dorze tribal village with unique architecture",
          "Traditional weaving demonstration and cultural learning",
          "Cultural lunch with southern Ethiopian specialties",
          "Comprehensive briefing on Omo Valley tribes and ethics",
        ],
        accommodation: "Hotel in Arba Minch with lake views",
        meals: ["Lunch", "Dinner"],
      },
      {
        day: 2,
        title: "Konso Cultural Landscape - UNESCO Living Heritage",
        description:
          "Drive to the Konso Cultural Landscape, a UNESCO World Heritage site recognized for its remarkable terraced agriculture and fortified hilltop villages that have sustained communities in this semi-arid environment for over 400 years. Explore traditional walled villages with concentric stone walls, narrow passageways, and communal spaces designed for defense and social cohesion. See traditional wooden statues (Wakas) erected as memorials to deceased heroes, learning about Konso spiritual beliefs and ancestor veneration. Observe the sophisticated terracing agriculture and water management systems that demonstrate sustainable land use. Continue to Jinka, the administrative center for the Omo Valley region, where you'll overnight while preparing for deeper immersion into tribal cultures.",
        activities: [
          "Scenic drive from Arba Minch to Konso",
          "Visit traditional walled villages with unique architecture",
          "See wooden memorial statues (Wakas) and cultural artifacts",
          "Learn about terracing agriculture (400+ year history)",
          "Overnight in Jinka with cultural preparation",
        ],
        accommodation: "Lodge in Jinka with Omo Valley access",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Mursi Tribe - Cultural Encounter with Lip Plate Traditions",
        description:
          "Journey into Mago National Park to visit Mursi villages, home to the famous lip plate tribe known for this distinctive cultural practice. Engage in respectful cultural interaction, learning about Mursi traditions, social structures, gender roles, and their relationship with the environment. Observe daily activities such as cattle herding, sorghum cultivation, pottery making, and body decoration. Photography opportunities are available with permission and respectful engagement following cultural guidelines. Learn about the significance of lip plates, scarification, and body painting in Mursi culture from both aesthetic and social perspectives. Return to Jinka in the evening for reflection and discussion about cultural preservation, changing traditions, and the challenges facing Mursi communities in a rapidly changing world.",
        activities: [
          "Drive through Mago National Park to Mursi villages",
          "Visit Mursi communities with lip plate traditions",
          "Cultural interaction and photography with permission",
          "Learn about traditions, social structures, and daily life",
          "Evening reflection on cultural preservation",
        ],
        accommodation: "Lodge in Jinka",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Hamer Tribe - Rituals and Community Life",
        description:
          "Drive to Turmi, heartland of the Hamer people known for their distinctive hairstyles, intricate beadwork, iron jewelry, and bull-jumping ceremonies that mark boys' transition to manhood. Visit Hamer villages, observing traditional housing, craftsmanship, social organization, and gender roles. If timing aligns with cultural calendars, witness traditional ceremonies or rituals (subject to seasonal and cultural factors, never guaranteed). Learn about Hamer spiritual beliefs, social structures, and economic activities centered around cattle herding and agriculture. Experience evening cultural performances if available, featuring traditional Hamer dancing, singing, and musical instruments. Overnight in Turmi, experiencing the sounds and rhythms of Hamer country under the southern Ethiopian stars.",
        activities: [
          "Drive to Turmi in Hamer tribal territory",
          "Visit Hamer villages with traditional architecture",
          "Witness traditional ceremonies and rituals (if occurring)",
          "Learn about cattle culture and social transitions",
          "Evening cultural performances (if available)",
        ],
        accommodation: "Lodge in Turmi with cultural immersion",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 5,
        title: "Tribal Market Day and Karo Tribe Artistic Expressions",
        description:
          "Experience the vibrant atmosphere of a local tribal market (market days vary by location), where Hamer, Karo, and other ethnic groups gather to trade livestock, agricultural products, crafts, household goods, and food. This weekly event provides unparalleled opportunities for cultural observation and respectful interaction across different tribal groups. Engage in cultural exchange, learning about market dynamics, traditional economies, and social interactions between different tribes. Visit Karo tribe settlements along the Omo River, known for elaborate body paintings using natural pigments, intricate scarification patterns, and distinctive hairstyles. Learn about Karo fishing traditions, artistic expressions, and environmental adaptations. Return to Arba Minch in the afternoon through changing landscapes. The evening features a farewell dinner, sharing experiences and reflections on the remarkable cultural diversity encountered in the Omo Valley.",
        activities: [
          "Visit traditional tribal market (day varies by location)",
          "Cultural exchange and multi-tribal market observation",
          "Learn about traditional economies and inter-tribal trade",
          "Visit Karo tribe with elaborate body paintings",
          "Return to Arba Minch with cultural reflections",
        ],
        accommodation: "Hotel in Arba Minch",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 6,
        title: "Lake Exploration and Return to Addis Ababa",
        description:
          "Begin with a morning boat trip on Lake Chamo, famous for its 'crocodile market' where numerous Nile crocodiles bask on the shores, some reaching over 6 meters in length. Enjoy bird watching opportunities along the lake's edges, with possibilities to see African fish eagles, pied kingfishers, various herons, and waterbirds. Visit fishing communities to learn about traditional fishing techniques, lake ecology, and the relationship between people and this important water resource. Return to Arba Minch for lunch before your flight to Addis Ababa. Upon arrival in the capital, transfer to your hotel or continue to the international airport for onward connections, concluding your Omo Valley journey with profound appreciation for Ethiopia's cultural diversity, traditional knowledge systems, and the complex challenges of cultural preservation in a changing world.",
        activities: [
          "Morning boat trip on Lake Chamo",
          "See crocodile market with large Nile crocodiles",
          "Bird watching along lake shores and ecosystems",
          "Flight to Addis Ababa from Arba Minch",
          "Transfer to hotel/airport and cultural journey conclusion",
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
    inclusions: [
      "All domestic flights as per itinerary",
      "Professional cultural guide with Omo Valley expertise",
      "5 nights accommodation in lodges and hotels",
      "All meals as indicated in detailed itinerary",
      "All tribal permits, community fees, and cultural access",
      "Ground transportation in 4x4 vehicles for rough terrain",
      "Cultural guide fees and translator services where needed",
      "Boat trip on Lake Chamo with guide",
    ],
    exclusions: [
      "International flights to/from Ethiopia",
      "Ethiopian visa fees and processing",
      "Comprehensive travel insurance including medical evacuation",
      "Personal expenses, souvenirs, and additional crafts",
      "Tips for guides, drivers, and lodge staff",
      "Camera fees to tribes (payable directly, varies by community)",
      "Alcoholic beverages and specialty drinks",
      "Any activities not specified in detailed itinerary",
    ],
    faq: [
      {
        question: "Is photography allowed when visiting tribal communities?",
        answer:
          "Photography is generally permitted but always requires asking permission first through your guide. Some tribes may request a small photography fee (typically 5-10 birr per person). Never photograph without permission, respect refusals, and avoid intrusive photography during private moments or ceremonies. Your guide will provide specific guidelines for each community visited.",
      },
      {
        question: "How should I dress when visiting tribal villages?",
        answer:
          "Modest clothing is recommended out of respect for local customs. Avoid shorts, short skirts, and sleeveless tops when visiting villages. Lightweight, breathable fabrics in neutral colors are ideal for the warm climate. A scarf or shawl is useful for additional coverage. Comfortable walking shoes are essential as village paths can be uneven.",
      },
      {
        question: "What health precautions should I take for the Omo Valley?",
        answer:
          "Malaria prophylaxis is recommended for the Omo Valley region. Ensure your routine vaccinations are up-to-date and consider hepatitis A, typhoid, and yellow fever vaccinations. Drink only bottled or purified water. Your guide carries a basic first aid kit, but bring any personal medications. Travel insurance with medical evacuation coverage is strongly recommended.",
      },
    ],
    bestTime: ["June to September", "December to February"],
    season: "Year-round, but dry seasons offer easier travel conditions",
    departurePoint: "Addis Ababa Bole International Airport",
    languages: ["English", "Local tribal languages through translator/guide"],
  },
  {
    id: "cult-002",
    name: "Historical Axum & Lalibela Pilgrimage",
    price: 1100, // 7 Days
    description:
      "Explore Ethiopia's ancient Christian heritage through its most sacred sites - the legendary Ark of the Covenant in Axum and the magnificent rock-hewn churches of Lalibela, carved from solid rock in the 12th century.",
    slug: "axum-lalibela-pilgrimage",
    images: [
      "/Images/lalibela1.webp",
      "/Images/lalibela2.webp",
      "/Images/axum1.webp",
      "/Images/axum2.webp",
      "/Images/lalibela3.webp",
      "/Images/axum3.webp",
    ],
    duration: "7 Days",
    highlights: [
      "Lalibela Rock Churches",
      "Axum Obelisks",
      "Ark of the Covenant Chapel",
      "Yeha Temple",
      "Debre Damo Monastery",
      "Bet Giyorgis Church",
    ],
    difficulty: "Moderate",
    featured: true,
    rating: 4.8,
    reviewCount: 47,
    groupSize: "6-12 travelers",
    
    coordinates: {
      lat: 12.032,
      lng: 39.047,
      city: "Lalibela",
      region: "Amhara",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Axum - Ancient Capital",
        description:
          "Begin your historical journey in Axum, the heart of ancient Ethiopian civilization. Visit the towering obelisks (stelae) including the Great Stele, once the largest single stone monument in the ancient world. Explore the archaeological museum and the legendary Queen of Sheba's Palace ruins. Settle into your hotel in this ancient capital that was once the center of a powerful kingdom that rivaled Rome and Persia.",
        activities: [
          "Visit Axum Archaeological Museum",
          "See the towering obelisks (stelae)",
          "Explore Queen of Sheba's Palace ruins",
          "Visit St. Mary of Zion Church compound",
          "Evening orientation walk in Axum",
        ],
        accommodation: "Hotel in Axum with historical views",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Axum's Sacred Sites and Ancient Inscriptions",
        description:
          "Discover Axum's spiritual significance at St. Mary of Zion Church, where the Ark of the Covenant is believed to be housed in a special chapel guarded by a single monk. Visit the tomb of King Kaleb and King Gebre Meskel, and see the ancient inscriptions at the Ezana Stone written in Sabaean, Ge'ez, and Greek. Explore the Monastery of Abba Pentalewon and the 6th-century tomb of King Bazen. Learn about the rise and fall of the Aksumite Empire that controlled trade routes between Africa and Asia for centuries.",
        activities: [
          "Visit St. Mary of Zion Church and Ark chapel exterior",
          "See Ezana Stone with trilingual inscriptions",
          "Explore royal tombs including King Bazen's tomb",
          "Visit Monastery of Abba Pentalewon",
          "Historical lecture on Aksumite Empire",
        ],
        accommodation: "Hotel in Axum",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Yeha Temple and Debre Damo Monastery",
        description:
          "Journey to Yeha, site of Ethiopia's oldest standing structure - a 5th-century BC temple built by the Sabaean civilization. Explore the ruins and adjacent museum housing ancient artifacts. Continue to Debre Damo Monastery, accessible only by climbing a 15-meter rope up a sheer cliff face (optional for physically able visitors; others can view from below). This 6th-century monastery is one of Ethiopia's most important religious sites, housing ancient manuscripts and unique architecture. Return to Axum for overnight.",
        activities: [
          "Visit Yeha Temple (5th century BC)",
          "Explore Yeha archaeological museum",
          "Visit Debre Damo Monastery (climbing optional)",
          "Learn about early Ethiopian Christianity",
          "Return to Axum with historical reflections",
        ],
        accommodation: "Hotel in Axum",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Flight to Lalibela - The New Jerusalem",
        description:
          "Fly from Axum to Lalibela, arriving at this remote mountain town that became a pilgrimage site in the 12th century. Begin exploring the Northern Group of rock-hewn churches, including Bet Medhane Alem (House of the Savior of the World), the largest monolithic church in the world. Visit Bet Maryam with its beautiful frescoes and Bet Golgotha containing elaborate carvings. Experience the spiritual atmosphere of this UNESCO World Heritage site that continues to be an active place of worship.",
        activities: [
          "Flight from Axum to Lalibela",
          "Visit Northern Group of rock churches",
          "Explore Bet Medhane Alem (largest monolithic church)",
          "See Bet Maryam with ancient frescoes",
          "Visit Bet Golgotha with elaborate carvings",
        ],
        accommodation: "Hotel in Lalibela with mountain views",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 5,
        title: "Eastern Group Churches and Bet Giyorgis",
        description:
          "Explore the Eastern Group of churches, connected by a labyrinth of tunnels and trenches. Visit Bet Amanuel, possibly the former royal chapel, with its Aksumite architectural style. See Bet Abba Libanos and the Tomb of Adam. The highlight is Bet Giyorgis (Church of St. George), carved in the shape of a cross and considered the most perfect of Lalibela's churches. Learn about the legend of King Lalibela who built these churches with angelic help after visiting Jerusalem.",
        activities: [
          "Explore Eastern Group of rock-hewn churches",
          "Visit Bet Amanuel (possible royal chapel)",
          "See Bet Abba Libanos and Tomb of Adam",
          "Visit Bet Giyorgis (cross-shaped church)",
          "Learn about King Lalibela legends and history",
        ],
        accommodation: "Hotel in Lalibela",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 6,
        title: "Asheten Mariam Monastery and Local Culture",
        description:
          "Take a mule ride or hike to Asheten Mariam Monastery, located at 3,150 meters with panoramic views of the Lalibela region. This 13th-century monastery houses ancient manuscripts and offers insight into monastic life. Return to Lalibela for a traditional Ethiopian coffee ceremony and visit local markets. In the evening, if available, witness a church service with traditional chanting and prayer rituals that have continued unchanged for centuries.",
        activities: [
          "Mule ride/hike to Asheten Mariam Monastery",
          "Panoramic views of Lalibela region",
          "Traditional Ethiopian coffee ceremony",
          "Visit local markets and craft workshops",
          "Evening church service observation (if available)",
        ],
        accommodation: "Hotel in Lalibela",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 7,
        title: "Departure from Lalibela",
        description:
          "Enjoy a final morning in Lalibela with optional additional church visits or souvenir shopping. Transfer to Lalibela Airport for your flight to Addis Ababa. Upon arrival in the capital, connect with your international flight or extend your stay in Ethiopia. Depart with profound appreciation for Ethiopia's ancient Christian heritage, architectural marvels, and living religious traditions that continue to shape Ethiopian identity.",
        activities: [
          "Optional final church visits or shopping",
          "Transfer to Lalibela Airport",
          "Flight to Addis Ababa",
          "Connection to international flights",
          "Farewell and journey conclusion",
        ],
        accommodation: "Not included",
        meals: ["Breakfast"],
      },
    ],
    inclusions: [
      "Domestic flights Axum-Lalibela-Addis Ababa",
      "Expert historical and religious guide",
      "6 nights accommodation in hotels",
      "All meals as specified in itinerary",
      "All entrance fees and church access permits",
      "Ground transportation in comfortable vehicles",
      "Mule/horse for Asheten Mariam visit",
      "Traditional coffee ceremony experience",
    ],
    exclusions: [
      "International flights to/from Ethiopia",
      "Ethiopian visa fees",
      "Travel insurance",
      "Personal expenses and souvenirs",
      "Tips for guides and drivers",
      "Alcoholic beverages",
      "Optional climbing at Debre Damo (personal choice)",
      "Any activities not specified",
    ],
    faq: [
      {
        question: "Can we see the actual Ark of the Covenant?",
        answer:
          "The Ark is kept in a specially constructed chapel (Chapel of the Tablet) within the St. Mary of Zion compound and is not accessible to the public. Only its guardian, a specially chosen monk who remains within the chapel for life, is allowed to see it. Visitors can see the exterior of the chapel and learn about its significance from guides.",
      },
      {
        question: "What should I wear when visiting churches?",
        answer:
          "Modest dress is required when visiting Ethiopian Orthodox churches. Shoulders and knees should be covered. Women may be asked to wear a headscarf in some churches. Comfortable walking shoes are essential as sites involve uneven ground and stairs. A light shawl or scarf is useful for covering when needed.",
      },
      {
        question: "Is the climb to Debre Damo mandatory?",
        answer:
          "No, the climb to Debre Damo Monastery involves pulling yourself up a 15-meter rope on a sheer cliff face and is only for the physically fit and adventurous. It's completely optional. Those who choose not to climb can view the monastery from below and learn about its history from guides. Women are not permitted to climb or enter the monastery.",
      },
    ],
    bestTime: ["October to March"],
    season: "Dry season for optimal travel conditions",
    departurePoint: "Axum Airport",
    languages: ["English", "Amharic", "Tigrinya"],
  },
  {
    id: "cult-003",
    name: "Harar & Dire Dawa Cultural Immersion",
    price: 520, // 4 Days
    description:
      "Experience the living Islamic heritage of Harar Jugol, a UNESCO World Heritage site with 82 mosques and 102 shrines, famous for its unique architecture, vibrant markets, and nightly hyena feeding tradition.",
    slug: "harar-cultural-immersion",
    images: [
      "/Images/harar1.webp",
      "/Images/harar2.webp",
      "/Images/harar3.webp",
      "/Images/harar4.webp",
      "/Images/harar5.jpg",
      "/Images/diredawa1.jpg",
    ],
    duration: "4 Days",
    highlights: [
      "Harar Old Town",
      "Hyena Feeding Ceremony",
      "Arthur Rimbaud House",
      "Harari Coffee Ceremony",
      "Dire Dawa Railway Station",
      "Harari Cultural Museum",
    ],
    difficulty: "Easy",
    featured: false,
    rating: 4.7,
    reviewCount: 32,
    groupSize: "4-10 travelers",

    coordinates: {
      lat: 9.312,
      lng: 42.127,
      city: "Harar",
      region: "Harari",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Harar - The Walled City",
        description:
          "Arrive in Harar, the 'City of Saints' and fourth holiest city in Islam. Enter through one of the five historic gates into the walled old city (Jugol). Explore the narrow alleyways, vibrant markets, and unique Harari houses with colorful facades. Visit the Arthur Rimbaud House, where the French poet lived in the late 19th century, now a museum showcasing his life and Harari culture. Enjoy a traditional Harari coffee ceremony in the evening, learning about the intricate rituals and social importance of coffee in Harari society.",
        activities: [
          "Enter Harar Jugol through historic gates",
          "Explore narrow alleyways and traditional houses",
          "Visit Arthur Rimbaud House Museum",
          "Traditional Harari coffee ceremony",
          "Evening orientation walk in old city",
        ],
        accommodation: "Traditional Harari guesthouse in old city",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Harar's Islamic Heritage and Hyena Feeding",
        description:
          "Visit key Islamic sites including Jami Mosque, the largest in Harar, and various shrines dedicated to local saints. Explore the Harari Cultural Museum housed in a traditional home, displaying Harari artifacts, jewelry, and household items. See the traditional Harari basket weaving and silverwork. In the evening, experience the unique tradition of hyena feeding at the Fallana Gate, where 'hyena men' call wild hyenas to feed them meat by hand and mouth - a centuries-old tradition believed to protect the city. Learn about the complex relationship between Hararis and these wild animals.",
        activities: [
          "Visit Jami Mosque and Islamic shrines",
          "Explore Harari Cultural Museum",
          "See traditional basket weaving and silverwork",
          "Witness hyena feeding ceremony at night",
          "Learn about human-wildlife coexistence traditions",
        ],
        accommodation: "Traditional Harari guesthouse in old city",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Markets and Dire Dawa Excursion",
        description:
          "Explore Harar's vibrant markets including the spice market with colorful mounds of spices, the chat market (stimulant leaf widely consumed), and the livestock market. Visit the Ras Tafari's house and the city walls for panoramic views. Drive to Dire Dawa, Ethiopia's second largest city, with its unique blend of Ethiopian, French, and Arab influences. Visit the historic railway station from the Addis Ababa-Djibouti railway, Kezira district with its colonial architecture, and the lively market. Return to Harar in the evening.",
        activities: [
          "Visit Harar spice and chat markets",
          "Explore livestock market (if market day)",
          "Drive to Dire Dawa for cultural contrast",
          "Visit historic railway station and colonial architecture",
          "Return to Harar for overnight",
        ],
        accommodation: "Traditional Harari guesthouse in old city",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Cultural Workshops and Departure",
        description:
          "Participate in cultural workshops: try traditional Harari basket weaving, learn about Harari wedding rituals and traditional dress, and experience Harari culinary traditions with a cooking demonstration. Visit remaining sites based on your interests, such as the Sherif Harar City Museum or additional mosques. Enjoy a farewell lunch featuring Harari specialties. Transfer to Dire Dawa Airport for your departure flight, concluding your immersion into one of Ethiopia's most unique cultural destinations where Islamic, African, and European influences have created a distinctive heritage.",
        activities: [
          "Traditional Harari basket weaving workshop",
          "Learn about wedding rituals and traditional dress",
          "Harari cooking demonstration and tasting",
          "Final market visits and souvenir shopping",
          "Transfer to Dire Dawa Airport for departure",
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
    inclusions: [
      "All ground transportation including Harar-Dire Dawa transfers",
      "Expert local Harari guide",
      "3 nights accommodation in traditional guesthouse",
      "All meals as specified in itinerary",
      "All entrance fees and museum admissions",
      "Cultural workshops and demonstrations",
      "Hyena feeding ceremony viewing",
      "Traditional coffee ceremony experience",
    ],
    exclusions: [
      "International and domestic flights",
      "Ethiopian visa fees",
      "Travel insurance",
      "Personal expenses and souvenirs",
      "Tips for guides and drivers",
      "Alcoholic beverages",
      "Camera fees at certain sites",
      "Any activities not specified",
    ],
    faq: [
      {
        question: "Is it safe to watch the hyena feeding?",
        answer:
          "Yes, the hyena feeding is conducted by experienced 'hyena men' who have been doing this for generations. Visitors watch from a safe distance while the feeders interact with the hyenas. The hyenas are wild but accustomed to this nightly ritual. Follow your guide's instructions and maintain a respectful distance. Flash photography is usually discouraged as it may startle the animals.",
      },
      {
        question: "What should I wear in Harar?",
        answer:
          "Harar is a conservative Islamic city, so modest dress is important. Women should cover shoulders and knees, and a headscarf is recommended when visiting mosques. Lightweight, breathable fabrics are ideal as Harar can be warm. Comfortable walking shoes are essential for navigating the cobblestone streets and uneven surfaces of the old city.",
      },
      {
        question: "Can I buy chat in the markets?",
        answer:
          "Yes, chat (khat) is widely available in Harar's markets and is part of local culture. However, its export from Ethiopia is illegal, and consumption is a personal choice. If you choose to try it, do so responsibly and be aware that it is a stimulant. Your guide can explain its cultural significance and traditional consumption practices.",
      },
    ],
    bestTime: ["October to April"],
    season: "Cooler dry season recommended",
    departurePoint: "Dire Dawa Airport",
    languages: ["English", "Amharic", "Harari", "Somali"],
  },
  {
    id: "cult-004",
    name: "Gondar Castles & Timkat Festival",
    price: 680, // 5 Days
    description:
      "Witness Ethiopia's most colorful festival, Timkat (Epiphany), in the royal city of Gondar, home to magnificent 17th-century castles and the stunning Debre Birhan Selassie church with its famous ceiling paintings.",
    slug: "gondar-timkat-festival",
    images: [
      "/Images/gondar1.webp",
      "/Images/gondar2.webp",
      "/Images/timkat1.webp",
      "/Images/gondar3.webp",
      "/Images/timkat2.webp",
      "/Images/gondar4.webp",
    ],
    duration: "5 Days",
    highlights: [
      "Fasil Ghebbi Castles",
      "Timkat Celebration",
      "Debre Birhan Selassie",
      "Fasiladas' Bath",
      "Kuskuam Complex",
      "Timkat Processions",
    ],
    difficulty: "Easy",
    featured: true,
    rating: 4.9,
    reviewCount: 58,
    groupSize: "8-15 travelers",
    
    coordinates: {
      lat: 12.607,
      lng: 37.467,
      city: "Gondar",
      region: "Amhara",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Gondar - The Camelot of Africa",
        description:
          "Arrive in Gondar, founded in 1636 by Emperor Fasiladas as Ethiopia's capital. Check into your hotel and begin exploring the Royal Enclosure (Fasil Ghebbi), a UNESCO World Heritage site often called 'Africa's Camelot.' Visit the Castle of Fasiladas, the oldest and most impressive of the castles, along with the palaces of Iyasu I and Dawit III. See the banquet hall, library, and chancellery. Learn about the Gondarine period when the city was the political and cultural capital of the Ethiopian Empire. Evening briefing about the Timkat festival traditions.",
        activities: [
          "Arrival in Gondar and hotel check-in",
          "Visit Royal Enclosure (Fasil Ghebbi)",
          "Explore Castle of Fasiladas and other palaces",
          "Historical introduction to Gondarine period",
          "Timkat festival briefing and preparations",
        ],
        accommodation: "Hotel in Gondar with castle views",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Timkat Eve - Ketera Procession",
        description:
          "Experience Ketera, the eve of Timkat, as replicas of the Ark of the Covenant (tabots) from each church are carried in colorful processions to a ceremonial pool or river. Join the vibrant procession from Gondar's churches to Fasiladas' Bath, accompanied by priests in ceremonial robes, deacons with sistrums and prayer staffs, and crowds of worshippers singing and dancing. Witness the blessing of the water and the all-night vigil. The atmosphere is festive with singing, chanting, and spiritual celebration. Participate respectfully in this profound religious experience.",
        activities: [
          "Witness Ketera processions from churches",
          "Join procession to Fasiladas' Bath",
          "See blessing of water ceremony",
          "Observe all-night vigil and celebrations",
          "Experience traditional religious music and dance",
        ],
        accommodation: "Hotel in Gondar",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Timkat Day - Main Celebration",
        description:
          "Awake early for the main Timkat celebrations. At dawn, gather at Fasiladas' Bath where the water is blessed by priests and then sprinkled on the congregation, symbolizing the baptism of Christ in the Jordan River. Witness the most sacred moment when the patriarch dips a cross into the water and extinguishes a consecrated candle. After the ceremony, join the joyful processions as the tabots are returned to their churches amid singing, dancing, and celebration. Experience the communal spirit as families picnic together in white traditional dress. In the afternoon, visit Debre Birhan Selassie Church with its famous ceiling of angel faces.",
        activities: [
          "Dawn water blessing ceremony at Fasiladas' Bath",
          "Witness sprinkling of holy water on congregation",
          "Join processions returning tabots to churches",
          "Visit Debre Birhan Selassie Church",
          "Experience communal celebrations and picnics",
        ],
        accommodation: "Hotel in Gondar",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Gondar's Historical Sites and Cultural Exploration",
        description:
          "Explore more of Gondar's historical sites including the Kuskuam Complex built by Empress Mentewab, the Bath of Fasiladas used for Timkat celebrations, and the ruined palace of Ras Mikael Sehul. Visit the Queen's Enclosure and the church of Debre Berhan Selassie if not seen previously. Explore local markets and craft workshops. In the evening, enjoy a traditional cultural show featuring Amhara music and dance, reflecting the rich cultural heritage of the Gondar region. Optional visit to a local family for coffee ceremony and traditional meal.",
        activities: [
          "Visit Kuskuam Complex and Bath of Fasiladas",
          "Explore Queen's Enclosure and additional palaces",
          "Visit local markets and craft workshops",
          "Traditional Amhara cultural show",
          "Optional local family visit and coffee ceremony",
        ],
        accommodation: "Hotel in Gondar",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 5,
        title: "Departure from Gondar",
        description:
          "Enjoy a final morning in Gondar with optional activities: revisit favorite festival sites, shop for souvenirs including traditional Ethiopian crosses and textiles, or take photographs of the castles in morning light. Transfer to Gondar Airport for your departure flight, carrying memories of one of Ethiopia's most vibrant religious celebrations and the architectural wonders of its former imperial capital.",
        activities: [
          "Optional morning photography at castles",
          "Final souvenir shopping in Gondar markets",
          "Visit any missed historical sites",
          "Transfer to Gondar Airport",
          "Departure and festival journey conclusion",
        ],
        accommodation: "Not included",
        meals: ["Breakfast"],
      },
    ],
    inclusions: [
      "All ground transportation in Gondar",
      "Expert guide with festival knowledge",
      "4 nights accommodation in Gondar hotel",
      "All meals as specified in itinerary",
      "All entrance fees to historical sites",
      "Timkat festival access and guided experience",
      "Traditional cultural show ticket",
      "Festival information materials",
    ],
    exclusions: [
      "International and domestic flights",
      "Ethiopian visa fees",
      "Travel insurance",
      "Personal expenses and souvenirs",
      "Tips for guides and drivers",
      "Alcoholic beverages",
      "Special photography permits",
      "Any activities not specified",
    ],
    faq: [
      {
        question: "When does Timkat festival occur?",
        answer:
          "Timkat is celebrated annually on January 19th (or 20th in leap years), corresponding to 10th Ter in the Ethiopian calendar. The main celebrations occur over three days: Ketera (eve) on January 18th, Timkat on January 19th, and celebrations continue on January 20th. This tour is specifically scheduled for these dates each year.",
      },
      {
        question: "Can I participate in the water blessing?",
        answer:
          "Yes, visitors are welcome to participate respectfully in the water blessing ceremony. You may be sprinkled with holy water along with the congregation. Dress appropriately in white if possible (many locals wear white), be respectful during prayers, and follow your guide's instructions. Photography is allowed but be discreet during solemn moments.",
      },
      {
        question: "How crowded does it get during Timkat?",
        answer:
          "Timkat is Ethiopia's largest festival and attracts thousands of pilgrims and visitors. Gondar is particularly famous for its celebrations. It can be very crowded, especially around Fasiladas' Bath. Your guide will help navigate the crowds and find good viewing spots. Arrive early for ceremonies and be prepared for large gatherings while keeping personal belongings secure.",
      },
    ],
    bestTime: ["January (for Timkat festival)"],
    season: "Specific dates for Timkat celebration",
    departurePoint: "Gondar Airport",
    languages: ["English", "Amharic"],
  },
  {
    id: "cult-005",
    name: "Southern Cultural Circuit",
    price: 1200, // 8 Days
    description:
      "Comprehensive journey through Ethiopia's diverse southern cultures, visiting multiple tribal communities, traditional markets, and UNESCO sites from the Konso terraces to the Dorze people of the highlands.",
    slug: "southern-cultural-circuit",
    images: [
      "/Images/south1.jpg",
      "/Images/south2.jpg",
      "/Images/south3.jpg",
      "/Images/south4.jpg",
    ],
    duration: "8 Days",
    highlights: [
      "Multiple Tribal Visits",
      "Konso Terraces (UNESCO)",
      "Dorze Weaving Villages",
      "Traditional Tribal Markets",
      "Tsemay and Ari Cultures",
      "Wolayta Pottery Traditions",
    ],
    difficulty: "Moderate",
    featured: false,
    rating: 4.6,
    reviewCount: 29,
    groupSize: "4-8 travelers",
    
    coordinates: {
      lat: 5.336,
      lng: 37.393,
      city: "Arba Minch",
      region: "Southern Nations",
    },
    itinerary: [
      {
        day: 1,
        title: "Addis Ababa to Wolayta Sodo - Pottery Traditions",
        description:
          "Drive south from Addis Ababa to Wolayta Sodo, home to the Wolayta people known for their distinctive black clay pottery. Visit local pottery workshops where artisans create functional and ceremonial pottery using traditional coil techniques without wheels. Learn about the spiritual significance of pottery in Wolayta culture and see the firing process. Visit a local market showcasing Wolayta crafts and agricultural products. Continue to Arba Minch for overnight, situated between Lakes Chamo and Abaya with beautiful views of the Rift Valley.",
        activities: [
          "Drive from Addis Ababa to Wolayta Sodo",
          "Visit Wolayta pottery workshops and demonstrations",
          "Learn traditional pottery techniques",
          "Explore local crafts market",
          "Continue to Arba Minch for overnight",
        ],
        accommodation: "Hotel in Arba Minch with lake views",
        meals: ["Lunch", "Dinner"],
      },
      {
        day: 2,
        title: "Dorze People and Chencha Highlands",
        description:
          "Drive into the Chencha highlands to visit Dorze villages, famous for their tall elephant-shaped houses made from bamboo and false banana trees (enset). Learn about Dorze weaving traditions - they are renowned as some of Ethiopia's best weavers. See the process of making shammas (traditional cotton cloth) and colorful textiles. Learn about enset cultivation and processing into kocho, a staple food. Enjoy panoramic views over the Rift Valley lakes. Return to Arba Minch for a boat trip on Lake Chamo to see crocodiles and hippos.",
        activities: [
          "Drive to Chencha highlands Dorze villages",
          "Visit traditional elephant-shaped houses",
          "Witness Dorze weaving demonstrations",
          "Learn about enset (false banana) cultivation",
          "Boat trip on Lake Chamo for wildlife viewing",
        ],
        accommodation: "Hotel in Arba Minch",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Konso Cultural Landscape - UNESCO Terraces",
        description:
          "Drive to the Konso Cultural Landscape, a UNESCO World Heritage site. Explore traditional walled hilltop villages with impressive stone terracing that has sustained agriculture for over 400 years in this arid environment. See the wooden statues (waka) erected as memorials to deceased heroes. Learn about Konso's unique social organization with its age-grade system and generation-sets. Visit a cultural museum and meet with community elders. Continue to Jinka, the administrative center for the lower Omo Valley.",
        activities: [
          "Drive to Konso Cultural Landscape",
          "Visit traditional walled villages with terracing",
          "See wooden memorial statues (waka)",
          "Learn about Konso social organization",
          "Continue to Jinka for overnight",
        ],
        accommodation: "Lodge in Jinka",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Ari and Tsemay Cultural Encounters",
        description:
          "Visit Ari villages, one of the largest ethnic groups in the Omo Valley, known for their pottery, honey production, and colorful beadwork. Learn about their agricultural practices and traditional houses decorated with geometric patterns. Continue to Tsemay communities along the Weyto River, known for their distinctive hairstyles, body scarification, and lip plugs. Learn about Tsemay social structure and rituals. Visit a local market where different tribes gather to trade (market days vary). Return to Jinka for overnight.",
        activities: [
          "Visit Ari villages for pottery and beadwork",
          "Learn about Ari agriculture and housing",
          "Visit Tsemay communities along Weyto River",
          "See traditional hairstyles and body modifications",
          "Visit local tribal market (if market day)",
        ],
        accommodation: "Lodge in Jinka",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 5,
        title: "Mursi Tribe - Lip Plate Traditions",
        description:
          "Drive into Mago National Park to visit Mursi villages, famous for the lip plate tradition practiced by women. Learn about Mursi culture, social organization, and the significance of body modification. See traditional cattle herding practices and sorghum cultivation. Photography opportunities with permission and following cultural guidelines. Learn about challenges facing the Mursi including conservation issues and cultural change. Return to Jinka for evening discussion about cultural preservation.",
        activities: [
          "Drive through Mago National Park",
          "Visit Mursi villages with lip plate traditions",
          "Learn about Mursi culture and social structure",
          "Photography with permission and cultural respect",
          "Evening discussion on cultural preservation",
        ],
        accommodation: "Lodge in Jinka",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 6,
        title: "Hamer Territory and Bull Jumping Preparation",
        description:
          "Drive to Turmi in Hamer territory. Visit Hamer villages known for their intricate beadwork, iron jewelry, and distinctive hairstyles coated with ochre and butter. Learn about Hamer social organization and gender roles. If timing coincides with cultural events, learn about the preparation for bull jumping ceremonies (ula) that mark boys' transition to manhood. Witness evening dancing (evangadi) if occurring. Learn about Hamer spiritual beliefs and relationship with cattle.",
        activities: [
          "Drive to Turmi in Hamer territory",
          "Visit Hamer villages and traditional houses",
          "Learn about beadwork and cultural practices",
          "Understand bull jumping ceremony preparations",
          "Evening cultural activities if available",
        ],
        accommodation: "Lodge in Turmi",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 7,
        title: "Karo Tribe and Omorate Dassenech",
        description:
          "Visit Karo villages along the Omo River, known for elaborate body painting using white chalk, charcoal, and ochre. Learn about Karo fishing traditions and artistic expressions. Continue to Omorate to visit Dassenech communities, one of the most traditional tribes living in the delta region. Cross the Omo River by boat to visit Dassenech villages. Learn about their adaptation to the riverine environment and unique housing made from recycled materials. Return to Turmi for overnight.",
        activities: [
          "Visit Karo villages with body painting traditions",
          "Learn about Karo fishing and artistic culture",
          "Drive to Omorate for Dassenech visit",
          "Cross Omo River by boat to Dassenech villages",
          "Learn about riverine adaptations and housing",
        ],
        accommodation: "Lodge in Turmi",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 8,
        title: "Return to Arba Minch and Departure",
        description:
          "Morning drive back to Arba Minch through changing landscapes. Stop at viewpoints over the Rift Valley lakes. Arrive in Arba Minch for lunch before transferring to the airport for your flight to Addis Ababa. Upon arrival in the capital, connect with your international flight or extend your stay. Depart with deep appreciation for Ethiopia's remarkable cultural diversity and the resilience of traditional ways of life in the southern regions.",
        activities: [
          "Scenic drive from Turmi to Arba Minch",
          "Rift Valley viewpoint stops",
          "Arrival in Arba Minch for lunch",
          "Flight to Addis Ababa from Arba Minch",
          "Connect to international flights or extensions",
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
    inclusions: [
      "All ground transportation in 4x4 vehicles",
      "Expert cultural guide with southern expertise",
      "7 nights accommodation in lodges and hotels",
      "All meals as specified in itinerary",
      "All tribal permits and community fees",
      "Boat trips on Lakes Chamo and Omo River",
      "All entrance fees to cultural sites",
      "Cultural workshop participation",
    ],
    exclusions: [
      "International and domestic flights",
      "Ethiopian visa fees",
      "Travel insurance",
      "Personal expenses and souvenirs",
      "Tips for guides and drivers",
      "Camera fees to tribes (payable directly)",
      "Alcoholic beverages",
      "Any activities not specified",
    ],
    faq: [
      {
        question: "How many different tribes will we visit?",
        answer:
          "This comprehensive circuit visits approximately 6-8 different ethnic groups depending on itinerary specifics: Wolayta, Dorze, Konso, Ari, Tsemay, Mursi, Hamer, Karo, and Dassenech. Each has distinct languages, customs, and traditions. The itinerary provides a broad overview of southern Ethiopia's cultural diversity while ensuring respectful and meaningful engagement with each community.",
      },
      {
        question: "What is the road condition like in southern Ethiopia?",
        answer:
          "Roads in southern Ethiopia vary from paved highways to rough dirt tracks. Travel between major towns is generally on reasonable roads, but access to villages often involves bumpy, unpaved tracks. We use 4x4 vehicles suitable for these conditions. Travel times can be longer than distances suggest due to road conditions. This is part of the adventure of exploring remote cultural areas.",
      },
      {
        question: "Can we witness a bull jumping ceremony?",
        answer:
          "Bull jumping ceremonies are significant Hamer rituals that occur according to community timing, not tourist schedules. While we cannot guarantee witnessing a ceremony, if one is occurring during our visit and the community permits observation, we may be able to witness it from a respectful distance. We never request or arrange ceremonies for tourists. Our approach respects the authenticity and sanctity of these cultural events.",
      },
    ],
    bestTime: ["June to September", "December to February"],
    season: "Dry seasons for easier travel and market days",
    departurePoint: "Addis Ababa Bole International Airport",
    languages: ["English", "Amharic", "Local languages through translator"],
  },
  {
    id: "cult-006",
    name: "Addis Ababa Heritage Tour",
    price: 380, // 3 Days
    description:
      "Explore Ethiopia's vibrant capital, from the National Museum housing Lucy's remains to the bustling Mercato market, with insights into modern Ethiopian culture, history, and urban life.",
    slug: "addis-ababa-heritage",
    images: [
      "/Images/addis1.webp",
      "/Images/addis2.webp",
      "/Images/addis3.webp",
      "/Images/addis4.webp",
      "/Images/addis5.webp",
      "/Images/addis6.webp",
    ],
    duration: "3 Days",
    highlights: [
      "National Museum (Lucy)",
      "Holy Trinity Cathedral",
      "Mercato Market",
      "Ethnological Museum",
      "Entoto Mountain",
      "Traditional Food Experience",
    ],
    difficulty: "Easy",
    featured: false,
    rating: 4.5,
    reviewCount: 41,
    groupSize: "2-6 travelers",
    
    coordinates: {
      lat: 9.032,
      lng: 38.747,
      city: "Addis Ababa",
      region: "Addis Ababa",
    },
    itinerary: [
      {
        day: 1,
        title: "Historical Addis - Museums and Monuments",
        description:
          "Begin your exploration at the National Museum of Ethiopia, home to Lucy (Dinknesh), the 3.2 million-year-old hominid skeleton, along with royal regalia, ancient artifacts, and Ethiopian art. Visit the Ethnological Museum located in Emperor Haile Selassie's former palace within Addis Ababa University, showcasing Ethiopia's cultural diversity. See the Holy Trinity Cathedral, burial place of Emperor Haile Selassie and other prominent figures, with beautiful stained glass and religious art. End the day at Revolution Square with its monuments to Ethiopia's political history. Evening traditional dinner with cultural music and dance performance.",
        activities: [
          "Visit National Museum (see Lucy skeleton)",
          "Explore Ethnological Museum in former palace",
          "Visit Holy Trinity Cathedral and tombs",
          "See Revolution Square monuments",
          "Traditional dinner with cultural performance",
        ],
        accommodation: "Hotel in central Addis Ababa",
        meals: ["Lunch", "Dinner"],
      },
      {
        day: 2,
        title: "Markets, Crafts, and Urban Life",
        description:
          "Experience the chaos and energy of Mercato, Africa's largest open-air market, with sections dedicated to spices, textiles, silver, household goods, and more. Visit the Addis Mercato Museum to understand the market's history. Explore the Shola Market for traditional crafts and souvenirs. Visit a traditional Ethiopian coffee roasting and brewing workshop to learn about coffee's cultural significance. See local pottery workshops in the Shiro Meda area. In the afternoon, visit the Addis Ababa Museum to learn about the city's founding and development. Evening visit to a traditional tej (honey wine) house.",
        activities: [
          "Explore Mercato market (Africa's largest open-air market)",
          "Visit Addis Mercato Museum",
          "Traditional coffee ceremony workshop",
          "See pottery workshops in Shiro Meda",
          "Visit Addis Ababa Museum and tej house experience",
        ],
        accommodation: "Hotel in central Addis Ababa",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Entoto Mountain and Contemporary Culture",
        description:
          "Drive up Entoto Mountain, the original site of Addis Ababa, for panoramic views of the city. Visit Entoto Mariam Church and museum housing royal artifacts. See the former palace of Emperor Menelik II. Visit St. Mary's Church with its important religious artifacts. Return to the city for contemporary cultural experiences: visit modern art galleries showcasing Ethiopian artists, see the African Union headquarters (exterior), and explore the Friendship Park. Enjoy a farewell lunch of traditional Ethiopian cuisine. Depending on flight schedules, transfer to the airport or extend your stay in Addis Ababa.",
        activities: [
          "Drive to Entoto Mountain for panoramic views",
          "Visit Entoto Mariam Church and museum",
          "See Emperor Menelik II's former palace",
          "Visit contemporary art galleries",
          "See African Union headquarters and farewell lunch",
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
    inclusions: [
      "All ground transportation in Addis Ababa",
      "Expert local guide",
      "2 nights accommodation in central hotel",
      "All meals as specified in itinerary",
      "All museum and site entrance fees",
      "Traditional cultural performance ticket",
      "Coffee ceremony workshop participation",
      "Tej house experience",
    ],
    exclusions: [
      "International flights",
      "Ethiopian visa fees",
      "Travel insurance",
      "Personal expenses and shopping",
      "Tips for guides and drivers",
      "Alcoholic beverages beyond included experiences",
      "Additional activities not specified",
      "Airport transfers outside tour dates",
    ],
    faq: [
      {
        question: "Is Addis Ababa safe for tourists?",
        answer:
          "Addis Ababa is generally safe for tourists, especially in the main tourist areas. Like any large city, it's important to take normal precautions: be aware of your surroundings, don't flash valuables, use hotel safes, and avoid poorly lit areas at night. Petty theft can occur in crowded markets, so keep bags secure. Your guide will provide specific safety advice for each area visited.",
      },
      {
        question: "What is the altitude in Addis Ababa?",
        answer:
          "Addis Ababa is located at approximately 2,355 meters (7,726 feet) above sea level, making it one of the highest capital cities in the world. Some visitors may experience mild altitude symptoms such as shortness of breath or fatigue initially. Drink plenty of water, avoid alcohol initially, and allow time to acclimatize. The altitude also means temperatures are cooler than expected for Africa - bring layers as evenings can be chilly.",
      },
      {
        question: "Can I use credit cards in Addis Ababa?",
        answer:
          "Major hotels, restaurants, and some shops in tourist areas accept credit cards (Visa and MasterCard most commonly). However, many smaller establishments, markets, and taxis require cash. It's advisable to carry Ethiopian Birr for daily expenses. ATMs are widely available in the city center. Inform your bank of travel plans to avoid card blocks.",
      },
    ],
    bestTime: ["Year-round"],
    season: "Addis Ababa has mild climate year-round due to altitude",
    departurePoint: "Addis Ababa Bole International Airport or city hotel",
    languages: ["English", "Amharic"],
  },
];

// Nature Tours Data
export const natureTours= [
  {
    id: "nat-001",
    name: "Simien Mountains Trekking",
    price: 780, // 5 Days
    description:
      "Trek through the 'Roof of Africa' - Ethiopia's spectacular Simien Mountains National Park, a UNESCO World Heritage site renowned for dramatic escarpments, deep valleys, and unique endemic wildlife including gelada baboons and Ethiopian wolves.",
    slug: "simien-mountains-trekking",
    images: [
      "/Images/simien1.webp",
      "/Images/simien2.webp",
      "/Images/simien3.webp",
      "/Images/simien4.webp",
    ],
    duration: "5 Days",
    highlights: [
      "Gelada Monkeys",
      "Mount Bwahit",
      "Dramatic Escarpments",
      "Ethiopian Wolves",
    ],
    difficulty: "Moderate to Challenging",
    featured: true,
    rating: 4.9,
    reviewCount: 63,
    groupSize: "4-8 trekkers",
    
    coordinates: {
      lat: 13.181,
      lng: 38.0706,
      city: "Debark",
      region: "Amhara",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Gondar and Trek Preparation",
        description:
          "Begin your mountain adventure with a morning drive from Gondar to Debark (2,850m), the gateway town to Simien Mountains National Park. During the scenic journey through Ethiopian highlands, observe changing landscapes and traditional agricultural practices. In Debark, complete park registration formalities at the headquarters and meet your experienced mountain guide, cook, and scout who will accompany you throughout the trek. Receive comprehensive briefings about trekking safety, altitude considerations, park regulations, and environmental conservation practices. Drive to Sankaber (3,250m) with stops at viewpoints offering your first glimpses of the dramatic Simien landscapes. After camp orientation, enjoy evening wildlife viewing opportunities as the mountains transform with sunset light. Acclimatize at camp with a warm meal, discussing the upcoming trek under the spectacular Simien night sky.",
        activities: [
          "Drive from Gondar to Debark (2,850m) through scenic highlands",
          "Register at park headquarters and meet guide team",
          "Comprehensive briefing on safety, altitude, and conservation",
          "Scenic drive to Sankaber (3,250m) with viewpoint stops",
          "Camp orientation and evening wildlife viewing",
        ],
        accommodation: "Camp at Sankaber with basic mountain facilities",
        meals: ["Lunch", "Dinner"],
      },
      {
        day: 2,
        title: "Sankaber to Gich - Gelada Baboon Encounters",
        description:
          "Begin your trek from Sankaber to Gich (3,600m), covering approximately 5-6 hours through breathtaking Afro-alpine meadows with increasingly spectacular views of the Simien escarpments. Today's highlight includes remarkably close encounters with large troops of gelada baboons (often 200+ individuals), where you can observe their complex social structures, feeding behaviors, vocal communications, and grooming interactions at close range in their natural habitat. Visit the Jinbar Waterfall viewpoint, where the waterfall plunges 500 meters into the gorge below, offering spectacular photographic opportunities of one of Africa's most dramatic landscapes. Arrive at Gich camp situated in a beautiful valley with stunning views. Enjoy sunset views over the escarpments, followed by an evening wildlife photography session as the mountains transform with the changing light and temperatures drop.",
        activities: [
          "Trek from Sankaber to Gich camp (5-6 hours, 3,600m)",
          "Close encounters with gelada baboon troops (200+ individuals)",
          "Visit Jinbar Waterfall viewpoint (500m drop)",
          "Afro-alpine flora identification along the trail",
          "Evening wildlife photography at Gich Camp",
        ],
        accommodation: "Camp at Gich with improved mountain facilities",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Gich to Chenek - Dramatic Escarpment Views",
        description:
          "Trek from Gich to Chenek (3,600m), passing some of the Simien Mountains' most spectacular viewpoints and dramatic geological formations. Visit the iconic Imet Gogo viewpoint (3,926m), offering 360-degree panoramas of the Simien Mountains' deepest valleys and most dramatic erosion patterns that have shaped these landscapes over millions of years. Continue to Inatye (4,070m) for additional breathtaking vistas across the mountain range. Look for wildlife including Walia ibex (endemic to Ethiopia), Ethiopian wolves (world's rarest canid), and various bird species adapted to this high-altitude environment. Arrive at Chenek camp, strategically located for wildlife viewing and sunset photography. This day showcases why the Simien Mountains are renowned for some of Africa's most dramatic scenery, with erosion patterns creating landscapes of exceptional beauty and geological interest recognized by UNESCO.",
        activities: [
          "Trek from Gich to Chenek through scenic route",
          "Visit Imet Gogo viewpoint for 360-degree panoramas",
          "See Inatye escarpment with additional dramatic vistas",
          "Wildlife spotting for endemic species including Walia ibex",
          "Arrive at Chenek camp for sunset views and photography",
        ],
        accommodation: "Camp at Chenek with wildlife viewing opportunities",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Mount Bwahit Summit Challenge",
        description:
          "For those seeking an additional challenge and summit achievement, embark on an optional pre-dawn start for the ascent of Mount Bwahit (4,430m), the second highest peak in the Simien range. This 4-5 hour round trip offers a true mountaineering experience with rewarding summit celebrations and panoramic views extending across the entire mountain range on clear days, possibly even seeing Ras Dashen (Ethiopia's highest peak at 4,550m) in the distance. After descending to Chenek for a celebratory lunch, enjoy relaxed wildlife viewing and photography opportunities, possibly spotting klipspringers on rocky outcrops or lammergeyers (bearded vultures) soaring on thermal currents. The evening features a trek completion celebration dinner, sharing experiences and achievements from your Roof of Africa adventure with fellow trekkers and the guide team who have supported your journey.",
        activities: [
          "Optional early start for Mount Bwahit ascent (4,430m, 4-5 hours)",
          "Summit celebration with panoramic mountain views",
          "Descend to Chenek for celebratory lunch and relaxation",
          "Final wildlife viewing opportunities around Chenek",
          "Trek completion celebration dinner with guide team",
        ],
        accommodation: "Camp at Chenek",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 5,
        title: "Return to Gondar and Farewell",
        description:
          "Enjoy a scenic morning drive back to Debark, with final wildlife spotting opportunities along the park road, possibly seeing troops of gelada baboons foraging near the road or birds of prey circling overhead. Complete park exit formalities at the headquarters and receive your official Simien Mountains trekking certificate, a testament to your mountain achievement and exploration of this UNESCO World Heritage site. Return to Gondar, where you can enjoy hot showers and celebrate completing your trek. Visit a local market for souvenirs or cultural interaction. The day concludes with a farewell dinner in Gondar, reflecting on your Roof of Africa experience and the unique ecosystems you've explored, from endemic wildlife to dramatic geological formations that make the Simien Mountains truly exceptional.",
        activities: [
          "Scenic morning drive to Debark with wildlife spotting",
          "Park exit formalities and trekking certificate reception",
          "Return to Gondar for celebration and relaxation",
          "Visit local market for souvenirs and cultural interaction",
          "Farewell dinner reflecting on mountain achievements",
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
    inclusions: [
      "Professional mountain guide with Simien Mountains expertise",
      "Cook and camp staff for meal preparation and camp management",
      "All camping equipment including tents, sleeping mats, and dining tent",
      "All meals during trek as indicated in detailed itinerary",
      "Park entrance fees, permits, and conservation contributions",
      "Mule and mule handler for luggage transport during trek",
      "Ground transportation from Gondar and return",
      "Comprehensive pre-trek briefing and safety equipment",
    ],
    exclusions: [
      "International flights to/from Ethiopia",
      "Accommodation in Gondar before/after trek (can be arranged separately)",
      "Personal trekking gear (sleeping bag, trekking poles, etc.)",
      "Comprehensive travel insurance including mountain rescue",
      "Tips for guides, cook, scout, and mule handler",
      "Personal expenses, souvenirs, and additional services",
      "Alcoholic beverages and specialty drinks",
      "Any activities not specified in detailed trekking itinerary",
    ],
    faq: [
      {
        question: "What altitudes will we reach during the trek?",
        answer:
          "The trek operates between approximately 3,000-4,430 meters. Sankaber camp is at 3,250m, Gich at 3,600m, Chenek at 3,600m, and Mount Bwahit summit at 4,430m. The itinerary includes acclimatization days, but individuals with known altitude sensitivity should consult their doctor and consider additional acclimatization. Symptoms of altitude sickness are monitored by guides throughout the trek.",
      },
      {
        question: "How physically fit do I need to be for this trek?",
        answer:
          "Good level of fitness is required. You should be comfortable walking 5-7 hours daily with elevation gains/losses over uneven terrain. Training with hiking in hills or mountains before arrival is recommended. The Mount Bwahit summit day is optional and more challenging. The trek is rated moderate to challenging, suitable for regular walkers with appropriate preparation.",
      },
      {
        question: "What is the camping accommodation like?",
        answer:
          "You'll stay in mountain camps with basic facilities. Tents are provided (typically 2-person sharing), along with sleeping mats. Dining tent, camping chairs, and tables are set up for meals. Toilet facilities are basic camp toilets. There are no shower facilities during the trek – washing is with provided water. Nights can be cold, so a warm sleeping bag (rated to at least -5°C) is essential.",
      },
    ],
    bestTime: ["October to April"],
    season: "Dry season recommended for optimal trekking conditions",
    departurePoint: "Gondar city (transport from Gondar included)",
    languages: ["English", "Amharic"],
  },
  {
    id: "nat-002",
    name: "Danakil Depression Expedition",
    price: 650, // 4 Days
    description:
      "Journey to one of Earth's most extreme environments - the Danakil Depression, with its sulfur springs, salt flats, active volcanoes, and colorful hydrothermal fields creating an otherworldly landscape at 125 meters below sea level.",
    slug: "danakil-depression-expedition",
    images: [
      "/Images/danakil1.webp",
      "/Images/danakil2.webp",
      "/Images/danakil3.webp",
      "/Images/danakil4.webp",
      "/Images/danakil5.webp",
      "/Images/danakil6.webp",
    ],
    duration: "4 Days",
    highlights: [
      "Erta Ale Volcano",
      "Dallol Sulfur Springs",
      "Lake Afdera Salt Mining",
      "Salt Caravans",
      "Hydrothermal Fields",
      "Afar Culture",
    ],
    difficulty: "Challenging",
    featured: true,
    rating: 4.9,
    reviewCount: 38,
    groupSize: "6-12 travelers",
    
    coordinates: {
      lat: 14.241,
      lng: 40.300,
      city: "Mekele",
      region: "Afar",
    },
    itinerary: [
      {
        day: 1,
        title: "Mekele to Dodom - Volcano Base",
        description:
          "Drive from Mekele through the dramatic landscapes of the Afar region to Dodom village. Experience the dramatic temperature increase as you descend into the Danakil Depression, one of the hottest places on Earth. Pass through traditional Afar villages and see camel caravans transporting salt. Arrive at Dodom and begin the 3-hour trek to Erta Ale volcano base camp as sunset approaches, avoiding the extreme daytime heat. The night trek is illuminated by headlamps as you cross lava fields. Set up camp near the volcano crater rim, feeling the earth's heat through the ground. Briefing on volcano safety before attempting to view the lava lake.",
        activities: [
          "Scenic drive from Mekele through Afar region",
          "Descent into Danakil Depression",
          "See traditional salt caravans",
          "Night trek to Erta Ale base camp (3 hours)",
          "Camp setup near volcano crater",
        ],
        accommodation: "Basic camp at Erta Ale base",
        meals: ["Lunch", "Dinner"],
      },
      {
        day: 2,
        title: "Erta Ale Volcano & Lava Lake Spectacle",
        description:
          "Wake before dawn to approach the crater rim of Erta Ale, one of Earth's few permanent lava lakes. Witness the mesmerizing volcanic activity as red lava bubbles and spatters in the crater, creating an unforgettable spectacle against the dark sky. Watch sunrise over the volcanic landscape before returning to base camp for breakfast. Descend back to Dodom village and drive to Lake Afdera for a swim in the hypersaline lake that reaches 40°C, providing natural buoyancy and therapeutic minerals. Visit local salt mining operations before continuing to Hamed Ela village, base for exploring the Dallol area. Rest and prepare for next day's extreme heat exploration.",
        activities: [
          "Pre-dawn visit to Erta Ale crater for lava lake viewing",
          "Sunrise photography over volcanic landscape",
          "Swim in Lake Afdera salt lake",
          "Visit salt mining operations",
          "Drive to Hamed Ela village for overnight",
        ],
        accommodation: "Basic camp at Hamed Ela",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Dallol - Extreme Landscape Exploration",
        description:
          "Start very early to explore the Dallol hydrothermal field before the extreme heat becomes unbearable (temperatures can exceed 50°C/122°F). Walk among neon-yellow sulfur formations, acidic hot springs, salt pillars, and mineral deposits creating a psychedelic landscape of oranges, yellows, greens, and whites. See the salt canyons and mushroom-shaped formations. This is one of Earth's most alien landscapes, with pH levels sometimes below 1. Visit the Lake Karum salt flats where Afar salt miners cut salt slabs using traditional methods. See the endless salt plain stretching to the horizon. Return to camp for rest during peak heat. Late afternoon visit to local salt market and interaction with Afar salt miners.",
        activities: [
          "Early morning exploration of Dallol hydrothermal field",
          "See sulfur formations and acidic hot springs",
          "Visit Lake Karum salt flats",
          "Observe traditional salt mining techniques",
          "Visit local salt market and Afar cultural interaction",
        ],
        accommodation: "Basic camp at Hamed Ela",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Salt Mountains and Return to Mekele",
        description:
          "Morning visit to the Salt Mountains (Black Mountain) area with its unique geological formations. See more salt mining operations and learn about the centuries-old salt trade that continues today with camel caravans transporting salt slabs to the highlands. Begin the drive back to Mekele, ascending from the depression and experiencing temperature relief. Stop at viewpoints overlooking the Danakil Depression. Arrive in Mekele for hot showers and celebration of surviving one of Earth's most extreme environments. Farewell dinner sharing experiences of this unique expedition before departure next day.",
        activities: [
          "Visit Salt Mountains (Black Mountain) geological formations",
          "See traditional salt trade and camel caravans",
          "Scenic drive back to Mekele from depression",
          "Viewpoints over Danakil Depression",
          "Farewell dinner and expedition celebration",
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
    inclusions: [
      "All ground transportation in 4x4 vehicles suitable for harsh conditions",
      "Professional expedition guide with Danakil experience",
      "Armed scout/security for entire expedition",
      "All meals and drinking water during expedition",
      "Basic camping equipment including tents and sleeping mats",
      "All permits and Afar region access fees",
      "Local Afar guide and translator",
      "Comprehensive safety equipment and communications",
    ],
    exclusions: [
      "International and domestic flights",
      "Accommodation in Mekele before/after expedition",
      "Personal expedition gear (sleeping bag, headlamp, etc.)",
      "Comprehensive travel insurance including emergency evacuation",
      "Tips for guides, drivers, and scout",
      "Personal expenses and souvenirs",
      "Alcoholic beverages",
      "Any activities not specified in expedition itinerary",
    ],
    faq: [
      {
        question: "How hot does it get in the Danakil Depression?",
        answer:
          "The Danakil Depression is one of the hottest places on Earth, with average daily temperatures of 34-40°C (93-104°F) and can exceed 50°C (122°F) in direct sun. We schedule activities for early morning and late afternoon to avoid peak heat. Proper hydration is critical - we provide ample water. The expedition is physically demanding due to heat; participants should be in good health and prepared for extreme conditions.",
      },
      {
        question: "Is it safe to visit the Danakil Depression?",
        answer:
          "Safety is our top priority. We travel with experienced local guides, armed scouts for security, and maintain communication with authorities. The Afar region has specific security considerations that we monitor continuously. We follow all government advisories and work with trusted local partners. The volcanic areas require careful guidance - we maintain safe distances from unstable ground and acidic pools. This is an expedition, not a casual tour, requiring respect for the environment and local conditions.",
      },
      {
        question: "What should I pack for the Danakil expedition?",
        answer:
          "Essential items: sturdy hiking boots, lightweight long-sleeved shirts and pants for sun protection, wide-brimmed hat, high-SPF sunscreen, sunglasses, headlamp with extra batteries, sleeping bag (rated for warm temperatures), personal medications, electrolyte tablets, bandana for dust, camera with protective bag. Avoid cotton - choose moisture-wicking fabrics. We provide detailed packing lists upon booking. Luggage should be minimal as space in vehicles is limited.",
      },
    ],
    bestTime: ["November to February"],
    season: "Coolest months for bearable temperatures",
    departurePoint: "Mekele",
    languages: ["English", "Amharic", "Afar"],
  },
  {
    id: "nat-003",
    name: "Bale Mountains National Park",
    price: 850, // 5 Days
    description:
      "Explore Africa's largest alpine ecosystem in the Bale Mountains, home to the endangered Ethiopian wolf, mountain nyala, and unique Afro-alpine flora across diverse landscapes from cloud forests to the Sanetti Plateau.",
    slug: "bale-mountains-exploration",
    images: [
      "/Images/balemountains1.webp",
      "/Images/balemountains2.webp",
      "/Images/balemountains3.webp",
      "/Images/balemountains4.webp",
      "/Images/bale-wildlife1.webp",
      "/Images/bale-wildlife2.webp",
    ],
    duration: "5 Days",
    highlights: [
      "Ethiopian Wolf Tracking",
      "Sanetti Plateau",
      "Harenna Forest",
      "Bale Mountain Lakes",
      "Mountain Nyala",
      "Endemic Bird Species",
    ],
    difficulty: "Moderate",
    featured: true,
    rating: 4.8,
    reviewCount: 42,
    groupSize: "4-8 travelers",
    
    coordinates: {
      lat: 6.817,
      lng: 39.783,
      city: "Dinsho",
      region: "Oromia",
    },
    itinerary: [
      {
        day: 1,
        title: "Addis Ababa to Dinsho - Park Headquarters",
        description:
          "Drive from Addis Ababa to Dinsho, gateway to Bale Mountains National Park. The journey takes you through the Ethiopian highlands with stops at scenic viewpoints. Arrive at Dinsho and check in at the park headquarters for registration and briefing. Take an afternoon walk around the headquarters area for your first wildlife encounters - likely spotting mountain nyala, Menelik's bushbuck, and warthogs. Visit the small museum for park orientation. Evening briefing about the unique ecosystems of the Bale Mountains, including the largest extent of Afro-alpine habitat on the continent and home to more endemic mammals than any other site in Ethiopia.",
        activities: [
          "Scenic drive from Addis Ababa to Dinsho",
          "Park registration and orientation",
          "Afternoon wildlife walk around headquarters",
          "Visit park museum and information center",
          "Evening briefing on Bale Mountains ecosystems",
        ],
        accommodation: "Lodge in Dinsho",
        meals: ["Lunch", "Dinner"],
      },
      {
        day: 2,
        title: "Sanetti Plateau and Ethiopian Wolves",
        description:
          "Drive up to the Sanetti Plateau, the world's largest alpine plateau above 3,000 meters. This unique ecosystem is home to the largest population of the endangered Ethiopian wolf, with about half of the world's remaining 500 individuals living here. Spend the day searching for and observing these beautiful canids in their natural habitat. The plateau also offers stunning landscapes with giant lobelia plants, alpine lakes, and dramatic rock formations. Visit Tullu Dimtu, the second highest peak in Ethiopia at 4,377 meters. Look for other wildlife including mountain nyala, rock hyrax, and numerous bird species endemic to the Ethiopian highlands.",
        activities: [
          "Drive to Sanetti Plateau (above 3,000m)",
          "Search for and observe Ethiopian wolves",
          "Visit Tullu Dimtu (4,377m) viewpoint",
          "Explore alpine lakes and giant lobelia forests",
          "Wildlife photography on the plateau",
        ],
        accommodation: "Simple lodge on Sanetti Plateau",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Harenna Forest Exploration",
        description:
          "Descend into the Harenna Forest, a magical cloud forest on the southern slopes of the Bale Mountains. This is one of Ethiopia's largest remaining forests and home to unique biodiversity. Take guided walks through the forest looking for endemic birds including the yellow-fronted parrot, Abyssinian catbird, and numerous sunbird species. Look for primates including Bale monkey and colobus monkeys. Visit the stunning Web River waterfall. Learn about the forest's ecology and conservation challenges. The Harenna Forest has a mysterious atmosphere with hanging mosses, tall trees, and rich birdlife creating an unforgettable experience.",
        activities: [
          "Descend to Harenna Forest cloud forest",
          "Guided forest walk for birdwatching",
          "Search for primates including Bale monkey",
          "Visit Web River waterfall",
          "Learn about cloud forest ecology and conservation",
        ],
        accommodation: "Lodge in Harenna Forest area",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Sof Omar Caves and Return Journey",
        description:
          "Visit the remarkable Sof Omar Cables, an extensive limestone cave system with the Web River flowing through it. This is one of the most spectacular cave systems in Africa and a sacred site for local Muslims. Explore the accessible sections of the caves with a local guide, seeing impressive chambers and rock formations. Learn about the geological formation and cultural significance. After the cave visit, begin the return journey toward Dinsho, stopping at viewpoints and for wildlife spotting along the way. Evening celebration dinner sharing experiences from the diverse ecosystems explored in the Bale Mountains.",
        activities: [
          "Visit Sof Omar Cables limestone cave system",
          "Explore caves with local guide",
          "Learn about geological formation and cultural significance",
          "Return journey to Dinsho with stops",
          "Celebration dinner sharing Bale Mountains experiences",
        ],
        accommodation: "Lodge in Dinsho",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 5,
        title: "Departure from Bale Mountains",
        description:
          "Optional early morning walk for final wildlife viewing around Dinsho. Visit local community projects if time permits, learning about conservation initiatives involving local communities. Drive back to Addis Ababa, with lunch stop along the way. Arrive in Addis Ababa in the late afternoon, with transfer to airport for evening flights or to hotel for extended stay. Depart with memories of unique wildlife encounters, stunning landscapes, and appreciation for Ethiopia's remarkable biodiversity in the Bale Mountains.",
        activities: [
          "Optional morning wildlife walk",
          "Visit community conservation projects",
          "Drive from Dinsho to Addis Ababa",
          "Lunch stop en route",
          "Arrival in Addis Ababa and transfer to airport/hotel",
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
    inclusions: [
      "All ground transportation in 4x4 vehicles",
      "Professional guide with Bale Mountains expertise",
      "4 nights accommodation in lodges",
      "All meals as specified in itinerary",
      "National park entrance fees and permits",
      "Local guides for specific activities",
      "All activities as described in itinerary",
      "Drinking water throughout trip",
    ],
    exclusions: [
      "International and domestic flights",
      "Ethiopian visa fees",
      "Travel insurance",
      "Personal expenses and souvenirs",
      "Tips for guides and drivers",
      "Alcoholic beverages",
      "Optional activities not specified",
      "Any activities not included in itinerary",
    ],
    faq: [
      {
        question: "What are the chances of seeing Ethiopian wolves?",
        answer:
          "The Bale Mountains have the highest population density of Ethiopian wolves in the world, with about 250 individuals in the park. Sightings are very common on the Sanetti Plateau, especially in early morning and late afternoon when they are most active. Our guides know preferred wolf territories and hunting grounds. While we cannot guarantee sightings, the proAbel lity is very high - most visitors see wolves, often at close range as they are not particularly afraid of vehicles.",
      },
      {
        question: "What is the weather like in the Bale Mountains?",
        answer:
          "The Bale Mountains have highly variable weather due to altitude variations. The Sanetti Plateau (above 3,000m) can be cold, especially at night, with temperatures sometimes dropping below freezing. Daytime temperatures are cool. The Harenna Forest is warmer but can be wet and misty. Layered clothing is essential - bring warm layers, waterproof jacket, hat, and gloves for the plateau, and lighter layers for lower elevations. Weather can change rapidly in the mountains.",
      },
      {
        question: "How difficult are the walks in Bale Mountains?",
        answer:
          "Most walks are moderate, with some options for more challenging hikes. The altitude on the Sanetti Plateau (above 3,000m) means some visitors may experience shortness of breath. Walks in the Harenna Forest involve uneven terrain but are generally not steep. We adjust walks based on group fitness levels. Good walking shoes are essential. Those with mobility issues should discuss with us in advance as some areas have limited accessibility.",
      },
    ],
    bestTime: ["November to March"],
    season: "Dry season for best wildlife viewing and access",
    departurePoint: "Addis Ababa",
    languages: ["English", "Amharic", "Oromifa"],
  },
  {
    id: "nat-004",
    name: "Rift Valley Lakes Circuit",
    price: 720, // 6 Days
    description:
      "Discover Ethiopia's Great Rift Valley lakes, each with unique ecosystems, from bird-rich Lake Langano to the flamingo-filled waters of Lake Shalla, with opportunities for hiking, birdwatching, and cultural interactions.",
    slug: "rift-valley-lakes-circuit",
    images: [
      "/Images/rift-valley-lakes-aerial.jpg",
      "/Images/rift-valley-lakes-aerial.jpg",
    
    ],
    duration: "6 Days",
    highlights: [
      "Lake Langano Watersports",
      "Lake Awassa Birdlife",
      "Wondo Genet Hot Springs",
      "Abijatta-Shalla National Park",
      "Flamingo Watching",
      "Rift Valley Views",
    ],
    difficulty: "Easy",
    featured: false,
    rating: 4.6,
    reviewCount: 36,
    groupSize: "4-10 travelers",

    coordinates: {
      lat: 7.600,
      lng: 38.417,
      city: "Ziway",
      region: "Oromia",
    },
    itinerary: [
      {
        day: 1,
        title: "Addis Ababa to Lake Ziway - Birding Paradise",
        description:
          "Drive south from Addis Ababa into the Great Rift Valley, stopping at the Ethiopian Rift Valley viewpoint for panoramic views. Continue to Lake Ziway, a shallow freshwater lake rich in birdlife. Take a boat trip on the lake to visit Tulu Gudo Island with its monastery and abundant bird colonies. See hippos, numerous waterbirds, and local fishing activities. Lake Ziway is known for its large populations of pelicans, storks, and herons. Check into lakeside lodge and enjoy evening birdwatching from the shore. Introduction to the Rift Valley lakes ecosystem.",
        activities: [
          "Drive from Addis Ababa to Rift Valley",
          "Stop at Rift Valley viewpoint",
          "Boat trip on Lake Ziway to Tulu Gudo Island",
          "Birdwatching and hippo viewing",
          "Evening lakeside relaxation",
        ],
        accommodation: "Lodge on Lake Ziway",
        meals: ["Lunch", "Dinner"],
      },
      {
        day: 2,
        title: "Lake Langano - Watersports and Relaxation",
        description:
          "Drive to Lake Langano, Ethiopia's most popular recreational lake with its distinctive brown color from suspended sediments. Lake Langano is bilharzia-free, making it safe for swimming. Enjoy watersports options including swimming, kayaking, and paddleboarding. Take guided walks along the lakeshore for birdwatching - over 300 bird species have been recorded here. Visit local communities to learn about traditional life around the lake. Relax at the lakeside lodge with beautiful sunset views over the water. Optional horseback riding or mountain biking available.",
        activities: [
          "Drive to Lake Langano",
          "Swimming and watersports in safe lake",
          "Lakeshore birdwatching walk",
          "Visit local communities",
          "Sunset viewing and relaxation",
        ],
        accommodation: "Resort on Lake Langano",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Abijatta-Shalla National Park - Flamingo Lakes",
        description:
          "Visit Abijatta-Shalla National Park, containing two very different lakes. Lake Shalla is deep, alkaline, and surrounded by hot springs, hosting large flocks of flamingos (both greater and lesser) and pelicans. Lake Abijatta is shallow and supports even greater numbers of waterbirds. Drive between the lakes, stopping at viewpoints and hot springs. Walk to observation points for bird photography. Learn about the geological formation of these lakes and the conservation challenges they face. Return to Lake Langano for overnight.",
        activities: [
          "Visit Abijatta-Shalla National Park",
          "See flamingo flocks on Lake Shalla",
          "Visit hot springs and observation points",
          "Bird photography opportunities",
          "Learn about lake geology and conservation",
        ],
        accommodation: "Resort on Lake Langano",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Wondo Genet - Hot Springs and Forest Walk",
        description:
          "Drive to Wondo Genet, a resort area known for its natural hot springs surrounded by forested hills. Soak in the therapeutic hot springs pools, reputed to have healing properties. Take a guided walk in the Wondo Genet forest, home to colobus monkeys, vervet monkeys, and numerous bird species. Visit the fish hatchery and learn about aquaculture in the region. Enjoy the relaxed atmosphere of this mountain retreat with cooler temperatures than the lakes. Optional visit to local community or agricultural projects.",
        activities: [
          "Drive to Wondo Genet",
          "Soak in natural hot springs",
          "Guided forest walk for wildlife viewing",
          "Visit fish hatchery",
          "Relax in mountain retreat atmosphere",
        ],
        accommodation: "Resort in Wondo Genet",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 5,
        title: "Lake Awassa - Birdlife and Local Culture",
        description:
          "Drive to Lake Awassa, arguably the most beautiful of the Rift Valley lakes with its clear waters and mountain backdrop. Take a morning boat trip on the lake for birdwatching - Awassa has exceptional bird diversity including fish eagles, kingfishers, and numerous waterfowl. Visit the fish market where local fishermen bring in their catch and fish eagles wait for scraps. Walk along the lakeshore promenade, interacting with locals. Visit the Awassa University biodiversity museum. Enjoy fresh fish dinner at a lakeside restaurant.",
        activities: [
          "Drive to Lake Awassa",
          "Boat trip for birdwatching on lake",
          "Visit fish market and see fish eagles",
          "Lakeshore walk and local interaction",
          "Visit biodiversity museum",
        ],
        accommodation: "Hotel on Lake Awassa",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 6,
        title: "Return to Addis Ababa",
        description:
          "Morning optional activities at Lake Awassa - additional birdwatching, visit to local crafts market, or relaxation by the lake. Begin return journey to Addis Ababa, stopping at interesting viewpoints and sites along the way. Lunch at a traditional restaurant en route. Arrive in Addis Ababa in the afternoon, with transfer to airport for evening flights or to hotel for extended stay. Depart with memories of diverse lakes, abundant birdlife, and the dramatic landscapes of Ethiopia's Great Rift Valley.",
        activities: [
          "Optional morning activities at Lake Awassa",
          "Return drive to Addis Ababa",
          "Stops at viewpoints en route",
          "Traditional lunch stop",
          "Arrival in Addis Ababa and transfer to airport/hotel",
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
    inclusions: [
      "All ground transportation in comfortable vehicles",
      "Professional guide with birding/Rift Valley expertise",
      "5 nights accommodation in lodges and hotels",
      "All meals as specified in itinerary",
      "Boat trips on Lakes Ziway and Awassa",
      "National park entrance fees",
      "Hot springs access at Wondo Genet",
      "All activities as described in itinerary",
    ],
    exclusions: [
      "International and domestic flights",
      "Ethiopian visa fees",
      "Travel insurance",
      "Personal expenses and souvenirs",
      "Tips for guides and drivers",
      "Alcoholic beverages",
      "Optional watersports equipment rental",
      "Any activities not specified",
    ],
    faq: [
      {
        question: "Is it safe to swim in the Rift Valley lakes?",
        answer:
          "Lake Langano is bilharzia-free and safe for swimming. The brown color comes from suspended sediments, not pollution. Other Rift Valley lakes may carry bilharzia (schistosomiasis) risk, so swimming is not recommended. We'll clarify which activities are safe at each location. Always follow your guide's advice regarding water activities. Showers and swimming pools are available at accommodations for those wanting to swim at other times.",
      },
      {
        question: "What bird species can we expect to see?",
        answer:
          "The Rift Valley lakes are exceptional birding destinations with over 400 species recorded. Highlights include: flamingos (greater and lesser) at Lakes Shalla and Abijatta; pelicans, storks, and herons at Lake Ziway; fish eagles, kingfishers, and numerous waterfowl at Lake Awassa; and forest species at Wondo Genet. We provide bird checklists and our guides are knowledgeable about identification. Bring binoculars for best viewing.",
      },
      {
        question: "What is the accommodation standard on this tour?",
        answer:
          "We use comfortable tourist-class lodges and hotels, most with private bathrooms, hot water, and restaurant facilities. Lake Langano and Wondo Genet have resort-style accommodations with additional amenities. Standards are good but not luxurious - this is a nature-focused tour rather than luxury accommodation. Electricity is generally available but may have occasional interruptions (common in Ethiopia). Most places have Wi-Fi in common areas.",
      },
    ],
    bestTime: ["Year-round"],
    season: "Good year-round, but bird numbers highest November-March",
    departurePoint: "Addis Ababa",
    languages: ["English", "Amharic"],
  },
  {
    id: "nat-005",
    name: "Awash National Park Safari",
    price: 420, // 3 Days
    description:
      "Experience Ethiopia's premier wildlife destination, Awash National Park, with its dramatic Awash River gorge, hot springs, and diverse wildlife including Beisa oryx, kudus, and over 400 bird species in acacia woodland and savannah habitats.",
    slug: "awash-national-park-safari",
    images: [
      "/Images/awash3.jpg",
      "/Images/awash2.jpg",
      "/Images/awash1.jpg",
     
    ],
    duration: "3 Days",
    highlights: [
      "Awash River Gorge",
      "Fentalle Volcano",
      "Filwoha Hot Springs",
      "Wildlife Viewing",
      "Birdwatching",
      "Kudu and Oryx Spotting",
    ],
    difficulty: "Easy to Moderate",
    featured: false,
    rating: 4.5,
    reviewCount: 28,
    groupSize: "4-8 travelers",

    coordinates: {
      lat: 8.983,
      lng: 40.167,
      city: "Awash",
      region: "Afar",
    },
    itinerary: [
      {
        day: 1,
        title: "Addis Ababa to Awash National Park",
        description:
          "Drive from Addis Ababa to Awash National Park, Ethiopia's oldest national park established in 1966. The journey takes about 3-4 hours through changing landscapes. Enter the park and begin wildlife viewing immediately - the park is known for its populations of Beisa oryx, Soemmerring's gazelle, and greater and lesser kudus. Drive to the Awash River gorge viewpoint for dramatic views of the river cutting through volcanic rock. Check into lodge accommodation within the park. Afternoon game drive looking for wildlife including baboons, warthogs, and various antelope species. Evening sundowner at a viewpoint overlooking the park.",
        activities: [
          "Drive from Addis Ababa to Awash National Park",
          "Enter park and begin wildlife viewing",
          "Visit Awash River gorge viewpoint",
          "Afternoon game drive",
          "Evening sundowner at viewpoint",
        ],
        accommodation: "Lodge in Awash National Park",
        meals: ["Lunch", "Dinner"],
      },
      {
        day: 2,
        title: "Full Day Wildlife and Scenic Exploration",
        description:
          "Early morning game drive when wildlife is most active, searching for predators such as striped hyena, serval, and possibly leopard (though rarely seen). Look for the park's special mammals including hamadryas baboons, colobus monkeys, and dik-diks. Visit the Filwoha Hot Springs, a series of natural hot springs surrounded by doum palms - a perfect spot for a refreshing dip. Explore the Fentalle Volcano area, with the opportunity to walk on the crater rim (depending on conditions). Afternoon focus on birdwatching - Awash has over 400 bird species including the rare Salvadori's seedeater. Evening night drive (if available and permitted) to look for nocturnal species.",
        activities: [
          "Early morning game drive for predator search",
          "Visit Filwoha Hot Springs for swimming",
          "Explore Fentalle Volcano area",
          "Afternoon birdwatching session",
          "Optional night drive for nocturnal wildlife",
        ],
        accommodation: "Lodge in Awash National Park",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Cultural Interaction and Return to Addis",
        description:
          "Morning visit to Kereyu cultural village on the park boundary to learn about the traditional pastoralist lifestyle of the Kereyu people, who have coexisted with wildlife in this area for centuries. See traditional housing, learn about cattle culture, and possibly witness traditional dancing. Return to park for final wildlife viewing or specific target species you haven't yet seen. Begin return journey to Addis Ababa, stopping for lunch at a traditional restaurant en route. Arrive in Addis Ababa in the afternoon, with transfer to airport for evening flights or to hotel for extended stay.",
        activities: [
          "Visit Kereyu cultural village",
          "Learn about pastoralist traditions",
          "Final wildlife viewing in park",
          "Return drive to Addis Ababa",
          "Arrival in Addis and transfer to airport/hotel",
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
    inclusions: [
      "All ground transportation in 4x4 safari vehicle",
      "Professional guide with wildlife expertise",
      "2 nights accommodation in park lodge",
      "All meals as specified in itinerary",
      "National park entrance fees",
      "All game drives as described",
      "Hot springs access",
      "Cultural village visit",
    ],
    exclusions: [
      "International and domestic flights",
      "Ethiopian visa fees",
      "Travel insurance",
      "Personal expenses and souvenirs",
      "Tips for guides and drivers",
      "Alcoholic beverages",
      "Optional activities not specified",
      "Any activities not included in itinerary",
    ],
    faq: [
      {
        question: "What wildlife can we expect to see in Awash?",
        answer:
          "Awash National Park hosts diverse mammals including: Beisa oryx, greater and lesser kudus, Soemmerring's gazelle, defassa waterbuck, bushbuck, warthog, olive baboon, hamadryas baboon, colobus monkey, and Anubis baboon. Predators include striped hyena, serval, caracal, and occasionally leopard (rarely seen). Over 400 bird species make it excellent for birdwatching. Wildlife viewing is good but different from East African parks - animals can be more scattered and wary.",
      },
      {
        question: "How hot does it get in Awash National Park?",
        answer:
          "Awash is in a lowland area with hot climate year-round. Daytime temperatures typically range from 30-38°C (86-100°F), with cooler nights around 15-20°C (59-68°F). The hottest months are March-May. We schedule activities for early morning and late afternoon to avoid peak heat. Lightweight, light-colored clothing, sun protection, and plenty of water are essential. Accommodations have fans but not always air conditioning.",
      },
      {
        question: "Is swimming in the hot springs safe?",
        answer:
          "Yes, swimming in the Filwoha Hot Springs is generally safe and refreshing. The water is warm (not hot) and clean, flowing from underground springs. However, check with your guide about current conditions as water levels vary seasonally. There are no crocodiles in these springs (unlike the Awash River itself). Changing facilities are basic. The springs are a popular spot for both tourists and locals, especially on weekends.",
      },
    ],
    bestTime: ["October to April"],
    season: "Cooler dry season for best wildlife viewing",
    departurePoint: "Addis Ababa",
    languages: ["English", "Amharic", "Afar"],
  },
  {
    id: "nat-006",
    name: "Chebera Churchura National Park",
    price: 780, // 4 Days
    description:
      "Explore one of Ethiopia's newest and most pristine national parks, home to large elephant herds, buffalo, and diverse birdlife in a unique ecosystem combining forest and savannah habitats in the remote southwest.",
    slug: "chebera-churchura-exploration",
    images: [
      "/Images/chebera1.jpg",
      "/Images/chebera2.jpg",
      "/Images/chebera3.jpg",
      "/Images/chebera4.jpg",
      "/Images/chebera5.jpg",
      
    ],
    duration: "4 Days",
    highlights: [
      "Elephant Tracking",
      "Churchura Waterfall",
      "Forest Walks",
      "Bird Watching",
      "Buffalo Herds",
      "Remote Wilderness Experience",
    ],
    difficulty: "Moderate",
    featured: false,
    rating: 4.7,
    reviewCount: 19,
    groupSize: "4-6 travelers",
    
    coordinates: {
      lat: 6.883,
      lng: 36.617,
      city: "Masha",
      region: "Southern Nations",
    },
    itinerary: [
      {
        day: 1,
        title: "Addis Ababa to Chebera Churchura",
        description:
          "Early morning flight from Addis Ababa to Jimma, then drive to Chebera Churchura National Park through coffee-growing regions and rural landscapes. Arrive at the park entrance and transfer to simple bush camp inside the park. Afternoon orientation walk near camp to acclimate to the environment. Chebera Churchura is one of Ethiopia's least-visited national parks, offering a true wilderness experience. Evening briefing about park ecology, safety procedures, and wildlife behavior. Listen to night sounds of the forest from your camp.",
        activities: [
          "Flight from Addis Ababa to Jimma",
          "Drive through coffee regions to park",
          "Arrival at park and camp setup",
          "Orientation walk near camp",
          "Evening briefing and night sounds",
        ],
        accommodation: "Basic bush camp in park",
        meals: ["Lunch", "Dinner"],
      },
      {
        day: 2,
        title: "Elephant Tracking and Forest Exploration",
        description:
          "Early start for elephant tracking - Chebera Churchura has one of Ethiopia's largest elephant populations, estimated at 400-600 individuals. Follow fresh tracks with experienced guides, learning to read signs of elephant presence. The forest-savannah mosaic provides ideal elephant habitat. Observe elephant behavior from safe distances if encountered. Afternoon explore different habitats within the park, from riverine forest to open grassland. Look for other wildlife including buffalo, bushbuck, warthog, and numerous primates. Return to camp for evening around campfire, sharing stories of the day's sightings.",
        activities: [
          "Early morning elephant tracking",
          "Learn tracking skills and elephant behavior",
          "Forest exploration in different habitats",
          "Wildlife viewing including buffalo",
          "Evening campfire and day review",
        ],
        accommodation: "Basic bush camp in park",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Churchura Waterfall and Birdwatching",
        description:
          "Hike to the impressive Churchura Waterfall, the park's namesake, through beautiful forest scenery. The waterfall cascades over rocks into a pool below - opportunity for refreshing swim in natural setting. The area around the waterfall is excellent for birdwatching - over 200 bird species recorded in the park including several regional endemics. Afternoon focused birdwatching session with local guide knowledgeable about avian species. Visit a nearby river for possible hippo sightings. Evening optional night walk (with guide) to look for nocturnal species.",
        activities: [
          "Hike to Churchura Waterfall",
          "Swim in waterfall pool",
          "Birdwatching around waterfall area",
          "River visit for hippo viewing",
          "Optional guided night walk",
        ],
        accommodation: "Basic bush camp in park",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Final Exploration and Return",
        description:
          "Final morning activity based on group interests: additional elephant tracking, specific bird species search, or forest walk focusing on plants and smaller wildlife. Break camp and drive back to Jimma for return flight to Addis Ababa. Alternatively, for those continuing to southern destinations, begin overland journey to next location. Arrive in Addis Ababa with memories of a true wilderness experience in one of Ethiopia's most remote and pristine national parks.",
        activities: [
          "Final morning activity based on interests",
          "Break camp and drive to Jimma",
          "Flight from Jimma to Addis Ababa",
          "Alternative overland continuation for some",
          "Arrival in Addis Ababa and tour conclusion",
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
    inclusions: [
      "Domestic flights Addis-Jimma-Addis",
      "All ground transportation in 4x4 vehicles",
      "Professional guide with park expertise",
      "3 nights accommodation in basic bush camp",
      "All meals as specified in itinerary",
      "National park entrance fees and permits",
      "All activities as described in itinerary",
      "Camping equipment and camp staff",
    ],
    exclusions: [
      "International flights",
      "Ethiopian visa fees",
      "Travel insurance",
      "Personal expenses and souvenirs",
      "Tips for guides and camp staff",
      "Alcoholic beverages",
      "Personal camping gear (sleeping bag, etc.)",
      "Any activities not specified",
    ],
    faq: [
      {
        question: "How remote is Chebera Churchura National Park?",
        answer:
          "Chebera Churchura is one of Ethiopia's most remote parks, with very limited tourist infrastructure. Access involves flight to Jimma followed by several hours drive on mostly unpaved roads. There are no luxury accommodations - we use basic bush camps with simple facilities (tents, camp toilets, basic washing facilities). This is a true wilderness experience for adventurous travelers wanting to explore off-the-beaten-path destinations with minimal tourist presence.",
      },
      {
        question: "Is it safe to track elephants on foot?",
        answer:
          "Elephant tracking is conducted with experienced guides who understand elephant behavior and maintain safe distances. We never approach elephants aggressively or corner them. Observations are made from safe vantage points. The guides carry communication equipment and know the terrain well. Safety briefing includes procedures if elephants approach camp. While there are inherent risks in wilderness areas, our experienced team minimizes these through careful planning and constant vigilance.",
      },
      {
        question: "What is the accommodation like?",
        answer:
          "Accommodation is in basic bush camps within the park. We provide tents, sleeping mats, camp chairs, and basic toilet facilities (camp toilets). Washing facilities are basic (bucket showers). There is no electricity except what we bring (solar charging for essentials). Meals are prepared by camp cook over open fire. This is camping in remote wilderness conditions - comfortable but not luxurious. Participants should be prepared for rustic conditions as part of the adventure.",
      },
    ],
    bestTime: ["November to February"],
    season: "Dry season for accessibility and wildlife viewing",
    departurePoint: "Addis Ababa Bole International Airport",
    languages: ["English", "Amharic", "Local dialects"],
  },
];



// Tour Categories Collection
export const tourCategories = [
  {
    id: "tour-historical",
    name: "Historical Tours",
    description: "Explore ancient civilizations and archaeological wonders",
    slug: "historical-tours-ethiopia",
    icon: "star",
    tours: historicalTours,
  },
  {
    id: "tour-cultural",
    name: "Cultural Tours",
    description:
      "Immerse in Ethiopia's diverse ethnic traditions and living heritage",
    slug: "cultural-tours-ethiopia",
    icon: "users",
    tours: culturalTours,
  },
  {
    id: "tour-nature",
    name: "Nature & Trekking",
    description: "Adventure through Ethiopia's stunning natural landscapes",
    slug: "nature-trekking-tours-ethiopia",
    icon: "mountain",
    tours: natureTours,
  },
];

// ==================== DESTINATION ITINERARIES ====================

// ==================== DESTINATION ITINERARIES ====================

// ==================== NORTHERN REGION DESTINATIONS ====================

export const northernDestinations = [
  {
    id: "dest-lalibela",
    name: "Lalibela",
    description: "Home to 11 remarkable rock-hewn churches carved from solid volcanic rock in the 12th century. Often called the 'Eighth Wonder of the World,' this UNESCO site remains an active pilgrimage center where ancient Orthodox traditions continue today.",
    slug: "lalibela-rock-hewn-churches-ethiopia",
    images: [
      "/Images/lalibela2.webp",
      "/Images/lalibela3.webp",
      "/Images/lalibela1.webp",
    ],
    type: "cultural",
    tag: "UNESCO",
    highlights: [
      "11 monolithic rock-hewn churches",
      "Bet Giyorgis (St. George's) cross-shaped church",
      "Underground tunnels and passageways",
      "Ancient religious paintings",
      "Living pilgrimage traditions"
    ],
    featured: true,
    coordinates: {
      lat: 12.0318,
      lng: 39.0417,
      city: "Lalibela",
      region: "Amhara",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Lalibela",
        description:
          "Arrive at Lalibela Airport (2,500m) and transfer to your hotel. After settling in, enjoy a gentle orientation walk through the historic town. Evening sunset views over the Lasta Mountains followed by welcome dinner.",
        activities: [
          "Arrival at Lalibela Airport",
          "Transfer and hotel check-in",
          "Town orientation walk",
          "Sunset over Lasta Mountains",
          "Welcome dinner"
        ],
        accommodation: "Panoramic View Hotel or similar",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Northern Group of Churches",
        description:
          "Visit Bet Medhane Alem (world's largest rock-hewn church), Bet Maryam with ancient frescoes, and explore the interconnected churches of Bet Meskel, Bet Denag, Bet Mikael and Bet Golgotha. End with traditional coffee ceremony.",
        activities: [
          "Bet Medhane Alem visit",
          "Bet Maryam with frescoes",
          "Interconnected churches tour",
          "Bet Mikael and Bet Golgotha",
          "Coffee ceremony"
        ],
        accommodation: "Panoramic View Hotel or similar",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Southern Group & Bet Giyorgis",
        description:
          "Experience the iconic cross-shaped Bet Giyorgis (St. George's Church). Explore Bet Gabriel-Rufael complex and Bethlehem Cave Church. Evening prayer service with local worshippers.",
        activities: [
          "Bet Giyorgis visit",
          "Bet Gabriel-Rufael complex",
          "Bet Abba Libanos",
          "Bethlehem Cave Church",
          "Evening prayer service"
        ],
        accommodation: "Panoramic View Hotel or similar",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Mountain Monastery & Departure",
        description:
          "Optional hike to Asheten Mariam Monastery (3,150m) for panoramic views. Visit local market and traditional pottery demonstration. Farewell cultural dinner before departure.",
        activities: [
          "Optional monastery hike",
          "Local market visit",
          "Pottery demonstration",
          "Farewell cultural dinner"
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
  },
  {
    id: "dest-simien",
    name: "Simien Mountains",
    description: "UNESCO World Heritage site known as the 'Roof of Africa' with dramatic escarpments, deep valleys, and unique wildlife including Gelada baboons and Ethiopian wolves. Africa's most spectacular mountain scenery.",
    slug: "simien-mountains-national-park-ethiopia",
    images: [
      "/Images/simien-park1.jpg",
      "/Images/simien-park2.jpg",
      "/Images/simien-park3.jpg",
    ],
    type: "nature",
    tag: "UNESCO",
    highlights: [
      "Dramatic escarpments (1,500m drops)",
      "Gelada baboon troops",
      "Ethiopian wolves",
      "Ras Dashen (4,550m)",
      "Afro-alpine flora"
    ],
    featured: true,
    coordinates: {
      lat: 13.181,
      lng: 38.0706,
      city: "Debark",
      region: "Amhara",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Debark",
        description:
          "Drive from Gondar to Debark (2,850m). Complete park registration and meet your guide. Drive to Sankaber (3,250m) with scenic stops. Camp orientation and first wildlife viewing.",
        activities: [
          "Scenic drive from Gondar",
          "Park registration",
          "Drive to Sankaber",
          "First wildlife viewing"
        ],
        accommodation: "Sankaber Camp",
        meals: ["Lunch", "Dinner"],
      },
      {
        day: 2,
        title: "Sankaber to Gich Trek",
        description:
          "Trek 5-6 hours through Afro-alpine meadows to Gich (3,600m). Close encounters with large Gelada baboon troops. Visit Jinbar Waterfall viewpoint (500m drop). Sunset photography at camp.",
        activities: [
          "Sankaber to Gich trek",
          "Gelada baboon viewing",
          "Jinbar Waterfall",
          "Wildlife photography"
        ],
        accommodation: "Gich Camp",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Imet Gogo & Inatye Viewpoints",
        description:
          "Trek to Imet Gogo (3,926m) for 360-degree panoramas. Continue to Inatye (4,070m) before descending to Chenek Camp (3,600m). Evening wildlife spotting (Walia ibex, Ethiopian wolves).",
        activities: [
          "Imet Gogo viewpoint",
          "Inatye viewpoint",
          "Descend to Chenek",
          "Wildlife viewing"
        ],
        accommodation: "Chenek Camp",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Mount Bwahit Ascent",
        description:
          "Optional pre-dawn ascent of Mount Bwahit (4,430m) for panoramic views. Return to Chenek for lunch and relaxation. Trek completion celebration dinner.",
        activities: [
          "Optional Bwahit ascent",
          "Summit celebration",
          "Final wildlife viewing",
          "Celebration dinner"
        ],
        accommodation: "Chenek Camp",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 5,
        title: "Return to Gondar",
        description:
          "Scenic drive to Debark, complete park formalities and receive trekking certificate. Return to Gondar for farewell dinner and celebration.",
        activities: [
          "Drive to Debark",
          "Receive trekking certificate",
          "Return to Gondar",
          "Farewell dinner"
        ],
        accommodation: "Gondar Hotel",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
    ],
  },
  {
    id: "dest-axum",
    name: "Axum",
    description: "Ancient capital of the Aksumite Empire, home to towering obelisks, ruins of the Queen of Sheba's Palace, and the purported resting place of the Ark of the Covenant. Ethiopia's most sacred historical city.",
    slug: "axum-ancient-kingdom-ethiopia",
    images: ["/Images/axum1.webp", "/Images/axum2.webp", "/Images/axum3.webp"],
    type: "historical",
    tag: "UNESCO",
    highlights: [
      "Ancient stelae/obelisks",
      "Queen of Sheba's Palace",
      "St. Mary of Zion Church",
      "Ark of the Covenant site",
      "Royal tombs"
    ],
    featured: true,
    coordinates: {
      lat: 14.1213,
      lng: 38.7238,
      city: "Axum",
      region: "Tigray",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Axum",
        description:
          "Arrive at Axum Airport and transfer to hotel. Afternoon visit to Northern Stelae Field to see ancient obelisks including the Great Stele (33m). Evening orientation walk and welcome dinner.",
        activities: [
          "Airport transfer",
          "Northern Stelae Field",
          "Great Stele viewing",
          "Town orientation",
          "Welcome dinner"
        ],
        accommodation: "Yeha Hotel or similar",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Archaeological Sites",
        description:
          "Visit Queen of Sheba's Palace ruins (3,000 years old). Study the multilingual Ezana Stone inscriptions. Explore Archaeological Museum and Tombs of King Kaleb and Gebre Meskel.",
        activities: [
          "Queen of Sheba's Palace",
          "Ezana Stone",
          "Archaeological Museum",
          "Royal tombs"
        ],
        accommodation: "Yeha Hotel or similar",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Religious Sites",
        description:
          "Visit St. Mary of Zion Church complex, believed to house the Ark of the Covenant. Explore the Cathedral of Tsion with religious artwork. Attend traditional prayer service.",
        activities: [
          "St. Mary of Zion",
          "Cathedral of Tsion",
          "Religious artifacts",
          "Prayer service"
        ],
        accommodation: "Yeha Hotel or similar",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Yeha Temple & Departure",
        description:
          "Day trip to Yeha (1 hour) to visit Ethiopia's oldest standing structure - 5th century BC Temple of the Moon. Return for farewell lunch and airport transfer.",
        activities: [
          "Yeha Temple visit",
          "Archaeological site",
          "Farewell lunch",
          "Airport transfer"
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
  },
  {
    id: "dest-gondar",
    name: "Gondar",
    description: "Ethiopia's 17th-century imperial capital, known as the 'Camelot of Africa.' Features the impressive Royal Enclosure (Fasil Ghebbi) with several castles, plus beautiful churches with stunning ceiling paintings.",
    slug: "gondar-royal-castles-ethiopia",
    images: [
      "/Images/gondar1.webp",
      "/Images/gondar2.webp",
      "/Images/gondar3.webp",
    ],
    type: "historical",
    tag: "UNESCO",
    highlights: [
      "Fasil Ghebbi (Royal Enclosure)",
      "Fasiladas' Bath",
      "Debre Berhan Selassie Church",
      "6 castles complex",
      "Timkat celebration site"
    ],
    featured: true,
    coordinates: {
      lat: 12.6075,
      lng: 37.4585,
      city: "Gondar",
      region: "Amhara",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Gondar",
        description:
          "Arrive at Gondar Airport and transfer to hotel. Evening orientation walk around historic Piazza area. Welcome dinner with introduction to Gondar's imperial history.",
        activities: [
          "Airport transfer",
          "Hotel check-in",
          "Piazza walk",
          "Welcome dinner"
        ],
        accommodation: "Goha Hotel or similar",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Royal Enclosure Tour",
        description:
          "Full guided tour of Fasil Ghebbi: Fasiladas' Castle, Iyasu's Palace, Dawit's Hall, Empress Mentewab's castle, and royal archives. Traditional lunch nearby.",
        activities: [
          "Fasiladas' Castle",
          "Iyasu's Palace",
          "Dawit's Hall",
          "Royal archives"
        ],
        accommodation: "Goha Hotel or similar",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Religious & Cultural Sites",
        description:
          "Visit Fasiladas' Bath (Timkat celebration site). Explore Debre Berhan Selassie Church with famous angel ceiling paintings. See Qusquam complex and coffee ceremony.",
        activities: [
          "Fasiladas' Bath",
          "Debre Berhan Selassie",
          "Qusquam complex",
          "Coffee ceremony"
        ],
        accommodation: "Goha Hotel or similar",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Market & Departure",
        description:
          "Visit local market for crafts and spices. Traditional weaving demonstration. Farewell lunch before airport transfer.",
        activities: [
          "Local market",
          "Weaving workshop",
          "Farewell lunch",
          "Airport transfer"
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
  },
];

// ==================== SOUTHERN REGION DESTINATIONS ====================

export const southernDestinations = [
  {
    id: "dest-omo",
    name: "Omo Valley",
    description: "One of Africa's most culturally diverse regions, home to over a dozen indigenous tribes including Mursi, Hamer, and Karo. Experience ancient traditions, body painting, bull jumping ceremonies, and vibrant tribal markets.",
    slug: "omo-valley-tribal-cultures-ethiopia",
    images: [
      "/Images/omovalley3.webp",
      "/Images/omo3.webp",
      "/Images/omo2.webp",
    ],
    type: "cultural",
    tag: "Cultural",
    highlights: [
      "Mursi lip plate tribe",
      "Hamer bull jumping ceremony",
      "Karo body painting",
      "Tribal markets",
      "Omo River"
    ],
    featured: true,
    coordinates: {
      lat: 5.4652,
      lng: 36.4869,
      city: "Jinka",
      region: "Southern Nations",
    },
    itinerary: [
      {
        day: 1,
        title: "Arba Minch Arrival",
        description:
          "Fly from Addis to Arba Minch. Visit Dorze village with elephant-shaped houses and weaving traditions. Cultural briefing on Omo Valley tribes. Overnight in Arba Minch.",
        activities: [
          "Flight to Arba Minch",
          "Dorze village visit",
          "Weaving demonstration",
          "Cultural briefing"
        ],
        accommodation: "Paradise Lodge",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Konso Cultural Landscape",
        description:
          "Drive to Konso UNESCO site with terraced agriculture and walled villages. See traditional wooden statues (Wakas) and defensive structures. Continue to Jinka.",
        activities: [
          "Konso villages",
          "Agricultural terraces",
          "Waka statues",
          "Drive to Jinka"
        ],
        accommodation: "Jinka Resort",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Mursi Tribe",
        description:
          "Journey into Mago National Park to visit Mursi villages. Learn about lip plate traditions, scarification, and daily life. Respectful cultural interaction and photography. Return to Jinka.",
        activities: [
          "Mago National Park",
          "Mursi village visit",
          "Cultural interaction",
          "Photography"
        ],
        accommodation: "Jinka Resort",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Hamer & Karo Tribes",
        description:
          "Drive to Turmi, Hamer territory. Visit Hamer villages, see traditional hairstyles and beadwork. Continue to Karo settlements along Omo River for body painting and fishing traditions.",
        activities: [
          "Hamer villages",
          "Karo settlements",
          "Body painting",
          "Omo River views"
        ],
        accommodation: "Buska Lodge",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 5,
        title: "Tribal Market",
        description:
          "Experience vibrant tribal market where Hamer, Karo and others trade goods. Cultural observation and exchange. Drive back to Arba Minch. Farewell dinner.",
        activities: [
          "Tribal market",
          "Cultural exchange",
          "Scenic drive",
          "Farewell dinner"
        ],
        accommodation: "Paradise Lodge",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 6,
        title: "Lake Chamo & Return",
        description:
          "Morning boat trip on Lake Chamo to see 'crocodile market' and hippos. Bird watching. Flight to Addis Ababa. Tour concludes.",
        activities: [
          "Lake Chamo boat",
          "Crocodile viewing",
          "Bird watching",
          "Flight to Addis"
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
  },
  {
    id: "dest-arba-minch",
    name: "Arba Minch",
    description: "Gateway to the southern Rift Valley, situated between Lakes Abaya and Chamo. Known for the 'crocodile market,' Nechisar National Park, and the famous Forty Springs that give the city its name.",
    slug: "arba-minch-lake-chamo-ethiopia",
    images: [
      "/Images/arbaminch1.webp",
      "/Images/arbaminch2.webp",
      "/Images/arbaminch3.webp",
    ],
    type: "nature",
    tag: "Wildlife",
    highlights: [
      "Lake Chamo crocodiles",
      "Nechisar National Park",
      "Forty Springs",
      "Dorze village",
      "Bird watching"
    ],
    featured: false,
    coordinates: {
      lat: 6.0355,
      lng: 37.5593,
      city: "Arba Minch",
      region: "Southern Nations",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival",
        description:
          "Arrive at Arba Minch Airport. Check into lodge with lake views. Visit viewpoint overlooking Lakes Abaya and Chamo. Sunset views and welcome dinner.",
        activities: [
          "Airport transfer",
          "Lodge check-in",
          "Viewpoint visit",
          "Sunset viewing"
        ],
        accommodation: "Paradise Lodge",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Lake Chamo Boat Trip",
        description:
          "Morning boat trip on Lake Chamo. See 'crocodile market' with large Nile crocodiles, hippos, and diverse birds. Visit fishing communities. Afternoon relaxation.",
        activities: [
          "Boat trip",
          "Crocodile viewing",
          "Hippo watching",
          "Fishing villages"
        ],
        accommodation: "Paradise Lodge",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Nechisar National Park",
        description:
          "Game drive in Nechisar National Park. Look for zebra, gazelle, and antelope. Visit Forty Springs area. Guided nature walk through park ecosystems.",
        activities: [
          "Game drive",
          "Wildlife viewing",
          "Forty Springs",
          "Nature walk"
        ],
        accommodation: "Paradise Lodge",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Dorze Village & Departure",
        description:
          "Visit Dorze village, see traditional elephant-shaped houses and weaving. Farewell lunch. Transfer to airport.",
        activities: [
          "Dorze village",
          "Weaving demonstration",
          "Farewell lunch",
          "Airport transfer"
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
  },
  {
    id: "dest-konso",
    name: "Konso",
    description: "UNESCO World Heritage site featuring remarkable terraced agriculture and fortified hilltop villages. Known for wooden Waka statues honoring heroes and a unique cultural landscape preserved for over 400 years.",
    slug: "konso-cultural-landscape-ethiopia",
    images: [
      "/Images/konso1.webp",
      "/Images/konso2.webp",
      "/Images/konso3.webp",
    ],
    type: "cultural",
    tag: "UNESCO",
    highlights: [
      "Terraced agriculture",
      "Walled villages",
      "Waka memorial statues",
      "Traditional governance",
      "400-year farming heritage"
    ],
    featured: true,
    coordinates: {
      lat: 5.2479,
      lng: 37.4879,
      city: "Konso",
      region: "Southern Nations",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Konso",
        description:
          "Arrive from Arba Minch. Visit Konso Museum for cultural context. Briefing on Konso traditions. Traditional dinner with local hospitality.",
        activities: [
          "Arrival transfer",
          "Konso Museum",
          "Cultural briefing",
          "Traditional dinner"
        ],
        accommodation: "Konso Lodge",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Walled Villages",
        description:
          "Explore traditional Konso settlements including Gamole village with stone walls and defensive structures. See generation poles (Olayta) and traditional houses. Local market visit (if market day). Coffee ceremony.",
        activities: [
          "Gamole village",
          "Traditional houses",
          "Generation poles",
          "Local market",
          "Coffee ceremony"
        ],
        accommodation: "Konso Lodge",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Agricultural Terraces",
        description:
          "Visit 400-year-old agricultural terraces. Learn about soil conservation, irrigation systems, and sustainable farming. See community projects. Evening cultural performance.",
        activities: [
          "Agricultural terraces",
          "Irrigation systems",
          "Community projects",
          "Cultural performance"
        ],
        accommodation: "Konso Lodge",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Waka Statues & Departure",
        description:
          "Visit memorial statues (Wakas) honoring heroes. Explore burial sites and learn about spiritual beliefs. Craft demonstrations (weaving, pottery). Farewell ceremony and departure.",
        activities: [
          "Waka statues",
          "Burial sites",
          "Craft demonstrations",
          "Farewell ceremony"
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
  },
  {
    id: "dest-tiya",
    name: "Tiya",
    description: "UNESCO archaeological site featuring mysterious stone stelae dating from the 12th-14th centuries. Approximately 36 monuments with carved symbols whose meaning remains unknown. Important pre-Christian burial site.",
    slug: "tiya-archaeological-stelae-ethiopia",
    images: ["/Images/tiya1.webp", "/Images/tiya2.webp", "/Images/tiya3.webp"],
    type: "historical",
    tag: "UNESCO",
    highlights: [
      "36 ancient stelae",
      "Mysterious carvings",
      "Prehistoric cemetery",
      "Archaeological site",
      "Symbolic engravings"
    ],
    featured: false,
    coordinates: {
      lat: 8.4333,
      lng: 38.6167,
      city: "Tiya",
      region: "Southern Nations",
    },
    itinerary: [
      {
        day: 1,
        title: "Day Trip to Tiya",
        description:
          "Drive from Addis Ababa through Ethiopian countryside to Tiya UNESCO site. Explore stelae field with 36 monuments (12th-14th century). Learn about carvings and archaeological significance. Return to Addis.",
        activities: [
          "Scenic drive",
          "Stelae field tour",
          "Archaeological interpretation",
          "Return to Addis"
        ],
        accommodation: "Not included",
        meals: ["Lunch"],
      },
    ],
  },
  {
    id: "dest-lower-awash",
    name: "Lower Awash Valley",
    description: "Paleontological site where 'Lucy' (Australopithecus afarensis) was discovered in 1974. One of the most important fossil sites for understanding human evolution, with remains dating back 3.2 million years.",
    slug: "lower-awash-valley-lucy-ethiopia",
    images: ["/Images/awash1.jpg", "/Images/awash2.jpg", "/Images/awash3.jpg"],
    type: "historical",
    tag: "UNESCO",
    highlights: [
      "Lucy discovery site",
      "Hadar research area",
      "3.2 million-year fossils",
      "Active excavations",
      "Human origins"
    ],
    featured: true,
    coordinates: {
      lat: 11.1667,
      lng: 40.6667,
      city: "Hadar",
      region: "Afar",
    },
    itinerary: [
      {
        day: 1,
        title: "Journey to Awash",
        description:
          "Drive from Addis to Awash area. Lodge check-in and orientation on paleontological significance. Evening briefing on fossil discoveries and human evolution.",
        activities: [
          "Scenic drive",
          "Lodge check-in",
          "Site orientation",
          "Paleontology briefing"
        ],
        accommodation: "Awash Falls Lodge",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Lucy Discovery Site",
        description:
          "Visit Hadar research site where Lucy was found (1974). Stand at the exact discovery location. Learn about paleontological methods and see active excavation areas. Evening research discussion.",
        activities: [
          "Hadar site visit",
          "Lucy discovery spot",
          "Excavation areas",
          "Research discussion"
        ],
        accommodation: "Awash Falls Lodge",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Fossil Sites & Afar Community",
        description:
          "Explore additional fossil sites with remains of various hominid species. Visit research stations. Cultural exchange with local Afar communities about their relationship with researchers.",
        activities: [
          "Fossil sites",
          "Research stations",
          "Afar community visit",
          "Cultural exchange"
        ],
        accommodation: "Awash Falls Lodge",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Final Exploration & Return",
        description:
          "Morning visits to geological sites for context on ancient environments. Drive back to Addis Ababa. Tour concludes with understanding of human origins.",
        activities: [
          "Geological sites",
          "Final reflections",
          "Drive to Addis",
          "Tour conclusion"
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
  },
  {
    id: "dest-lower-omo",
    name: "Lower Omo Valley",
    description: "Paleontological site containing some of the earliest anatomically modern human remains (Omo I and II, dated 195,000 years). Remote research area with ongoing excavations and significant hominid discoveries.",
    slug: "lower-omo-valley-fossils-ethiopia",
    images: [
      "/Images/lower-omo1.jpg",
      "/Images/lower-omo2.jpg",
      "/Images/lower-omo3.jpg",
    ],
    type: "historical",
    tag: "UNESCO",
    highlights: [
      "Omo I & II fossils",
      "195,000-year remains",
      "Kibish formation",
      "Active research",
      "Early modern humans"
    ],
    featured: true,
    coordinates: {
      lat: 4.8,
      lng: 35.97,
      city: "Kibish",
      region: "Southern Nations",
    },
    itinerary: [
      {
        day: 1,
        title: "Flight to Omo Region",
        description:
          "Fly from Addis to nearby airport. Drive to remote research area. Camp setup and orientation. Evening campfire discussion on Omo Valley discoveries.",
        activities: [
          "Flight to region",
          "Drive to research area",
          "Camp setup",
          "Orientation briefing"
        ],
        accommodation: "Field Camp",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Kibish Formation Sites",
        description:
          "Visit Kibish formation where Omo I and II (195,000-year-old modern human remains) were discovered. Learn about stratigraphy and dating methods. Visit research stations.",
        activities: [
          "Kibish formation",
          "Fossil discovery sites",
          "Research stations",
          "Dating methods discussion"
        ],
        accommodation: "Field Camp",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Community & Conservation",
        description:
          "Visit local communities living in the valley. Learn about their traditional knowledge and relationships with researchers. Conservation efforts discussion. Cultural exchange evening.",
        activities: [
          "Community visit",
          "Conservation briefing",
          "Cultural exchange",
          "Campfire discussion"
        ],
        accommodation: "Field Camp",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Return Journey",
        description:
          "Morning final site visits. Break camp. Drive to airport for return flight to Addis Ababa. Tour concludes.",
        activities: [
          "Final site visits",
          "Break camp",
          "Drive to airport",
          "Flight to Addis"
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
  },
  {
    id: "dest-melka-kunture",
    name: "Melka Kunture",
    description: "Prehistoric archaeological site along the Awash River with stone tools dating back 1.7 million years. Evidence of early human occupation and tool production through multiple Stone Age periods.",
    slug: "melka-kunture-prehistoric-ethiopia",
    images: [
      "/Images/melka1.webp",
      "/Images/melka2.webp",
      "/Images/melka3.webp",
    ],
    type: "historical",
    tag: "UNESCO",
    highlights: [
      "1.7M-year-old tools",
      "Stone Age artifacts",
      "Excavation sites",
      "Onsite museum",
      "Multiple occupation layers"
    ],
    featured: false,
    coordinates: {
      lat: 8.7,
      lng: 38.6,
      city: "Melka Kunture",
      region: "Oromia",
    },
    itinerary: [
      {
        day: 1,
        title: "Day Trip to Melka Kunture",
        description:
          "Drive from Addis Ababa to Melka Kunture archaeological site. Visit excavation areas with 1.7 million-year-old stone tools. See onsite museum with artifacts and fossils. Return to Addis.",
        activities: [
          "Scenic drive",
          "Excavation sites",
          "Stone tool viewing",
          "Museum visit"
        ],
        accommodation: "Not included",
        meals: ["Lunch"],
      },
    ],
  },
  {
    id: "dest-gedeo",
    name: "Gedeo",
    description: "UNESCO mixed heritage site combining sacred forests, traditional agriculture, and cultural practices. Features ancient megaliths, terraced farming, and shade-grown coffee traditions spanning centuries.",
    slug: "gedeo-cultural-landscape-ethiopia",
    images: [
      "/Images/gedeo1.jpg",
      "/Images/gedeo2.jpg",
      "/Images/gedeo3.jpg",
    ],
    type: "cultural",
    tag: "UNESCO",
    highlights: [
      "Sacred forests",
      "Megalithic sites",
      "Traditional agriculture",
      "Coffee plantations",
      "Biodiversity"
    ],
    featured: true,
    coordinates: {
      lat: 6.0833,
      lng: 38.2,
      city: "Dilla",
      region: "Southern Nations",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Dilla",
        description:
          "Arrive in Dilla, Gedeo region center. Hotel check-in. Cultural introduction to Gedeo traditions. Traditional dinner with local hospitality.",
        activities: [
          "Arrival transfer",
          "Hotel check-in",
          "Cultural introduction",
          "Traditional dinner"
        ],
        accommodation: "Dilla Hotel",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Sacred Forests",
        description:
          "Explore protected sacred forests preserved through traditional beliefs. Learn about biodiversity, endemic plant species, and bird watching. Understand traditional ecological knowledge.",
        activities: [
          "Sacred forest visit",
          "Biodiversity learning",
          "Bird watching",
          "Nature walk"
        ],
        accommodation: "Dilla Hotel",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Agriculture & Coffee",
        description:
          "Visit agricultural terraces and agroforestry systems. See Enset cultivation. Explore coffee plantations with shade-growing methods. Traditional coffee ceremony.",
        activities: [
          "Agricultural terraces",
          "Enset cultivation",
          "Coffee plantations",
          "Coffee ceremony"
        ],
        accommodation: "Dilla Hotel",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Villages & Departure",
        description:
          "Visit traditional Gedeo villages, see architecture. Explore megalithic sites. Cultural performances. Farewell ceremony and departure.",
        activities: [
          "Traditional villages",
          "Megalithic sites",
          "Cultural performances",
          "Farewell ceremony"
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
  },
];

// ==================== EASTERN REGION DESTINATIONS ====================

export const easternDestinations = [
  {
    id: "dest-harar",
    name: "Harar",
    description: "Ancient walled city (Jugol) and fourth holiest city of Islam, with 82 mosques and 102 shrines. Known for its unique architecture, colorful markets, and the famous nightly hyena feeding ritual.",
    slug: "harar-jugol-walled-city-ethiopia",
    images: [
      "/Images/harar2.webp",
      "/Images/harar3.webp",
      "/Images/harar4.webp",
    ],
    type: "cultural",
    tag: "UNESCO",
    highlights: [
      "Jugol historic walls",
      "Hyena feeding tradition",
      "82 mosques",
      "Harari houses",
      "Vibrant markets"
    ],
    featured: true,
    coordinates: {
      lat: 9.3146,
      lng: 42.1265,
      city: "Harar",
      region: "Harari",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Harar",
        description:
          "Fly to Dire Dawa, transfer to Harar. Check into hotel near Jugol walls. Evening walk around historic perimeter. Traditional Harari dinner.",
        activities: [
          "Dire Dawa arrival",
          "Transfer to Harar",
          "Jugol walk",
          "Traditional dinner"
        ],
        accommodation: "Heritage Plaza Hotel",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Jugol Walled City",
        description:
          "Explore five historic gates and narrow alleys. Visit traditional Harari houses (gegar) with courtyards. Local markets for spices and crafts. Coffee ceremony.",
        activities: [
          "City gates tour",
          "Traditional houses",
          "Local markets",
          "Coffee ceremony"
        ],
        accommodation: "Heritage Plaza Hotel",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Religious Sites & Hyena Feeding",
        description:
          "Visit Grand Mosque and Jamia Mosque. Explore Harar Museum and Arthur Rimbaud House. Evening hyena feeding experience outside the walls.",
        activities: [
          "Grand Mosque",
          "Harar Museum",
          "Rimbaud House",
          "Hyena feeding"
        ],
        accommodation: "Heritage Plaza Hotel",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Crafts & Departure",
        description:
          "See traditional crafts: weaving, basket making, silverwork. Farewell lunch. Transfer to Dire Dawa Airport for departure.",
        activities: [
          "Craft demonstrations",
          "Shopping",
          "Farewell lunch",
          "Airport transfer"
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
  },
  {
    id: "dest-bale-mountains",
    name: "Bale Mountains",
    description: "UNESCO natural site featuring Africa's largest Afro-alpine plateau, the Sanetti Plateau at over 4,000m. Best place to see Ethiopian wolves, plus giant lobelias, Harenna Forest, and unique biodiversity.",
    slug: "bale-mountains-national-park-ethiopia",
    images: [
      "/Images/simien1.webp",
      "/Images/simien2.webp",
      "/Images/simien3.webp",
    ],
    type: "nature",
    tag: "UNESCO",
    highlights: [
      "Ethiopian wolves",
      "Sanetti Plateau",
      "Giant lobelias",
      "Harenna Forest",
      "Sof Omar Caves"
    ],
    featured: true,
    coordinates: {
      lat: 6.8333,
      lng: 39.8333,
      city: "Goba",
      region: "Oromia",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Goba",
        description:
          "Arrive in Goba, gateway to Bale Mountains. Park briefing and conservation orientation. Equipment check for high-altitude trekking. Preparation for mountain exploration.",
        activities: [
          "Arrival transfer",
          "Park briefing",
          "Equipment check",
          "Mountain preparation"
        ],
        accommodation: "Goba Hotel",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Sanetti Plateau",
        description:
          "Explore Sanetti Plateau (4,000m+). Ethiopian wolf spotting (best location in Africa). See giant lobelia plants. Visit Tulu Dimtu peak for panoramic views.",
        activities: [
          "Sanetti Plateau",
          "Wolf spotting",
          "Giant lobelias",
          "Tulu Dimtu summit"
        ],
        accommodation: "Goba Hotel",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Harenna Forest",
        description:
          "Descend to Harenna Forest cloud ecosystem. Guided forest walk through vegetation zones. Bird watching for endemic species. Look for colobus monkeys and forest wildlife.",
        activities: [
          "Forest walk",
          "Bird watching",
          "Wildlife viewing",
          "Forest ecology"
        ],
        accommodation: "Goba Hotel",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Sof Omar Caves & Departure",
        description:
          "Visit Sof Omar Caves, extensive limestone cave system with underground river. Explore formations and learn cultural significance. Farewell lunch. Departure transfer.",
        activities: [
          "Sof Omar Caves",
          "Cave exploration",
          "Farewell lunch",
          "Departure"
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
  },
  {
    id: "dest-danakil",
    name: "Danakil Depression",
    description: "One of Earth's most extreme environments - the hottest inhabited place on Earth, 125m below sea level. Home to active Erta Ale volcano with permanent lava lake, colorful sulfur springs, and salt flats.",
    slug: "danakil-depression-erta-ale-ethiopia",
    images: [
      "/Images/danakil1.webp",
      "/Images/danakil2.webp",
      "/Images/danakil3.webp",
    ],
    type: "adventure",
    tag: "Extreme",
    highlights: [
      "Erta Ale lava lake",
      "Dallol sulfur springs",
      "Salt flats",
      "Below sea level",
      "Afar culture"
    ],
    featured: true,
    coordinates: {
      lat: 14.2417,
      lng: 40.3,
      city: "Mekele",
      region: "Afar",
    },
    itinerary: [
      {
        day: 1,
        title: "Mekele Preparation",
        description:
          "Arrive in Mekele, base for Danakil expeditions. Comprehensive safety briefing for extreme conditions. Meet experienced Afar guides. Equipment check and packing.",
        activities: [
          "Mekele arrival",
          "Safety briefing",
          "Guide meeting",
          "Equipment preparation"
        ],
        accommodation: "Mekele Hotel",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Dallol & Salt Lakes",
        description:
          "Drive to Dallol sulfur springs - colorful mineral deposits and acid ponds. Visit salt lakes and observe traditional salt mining. Desert camp under the stars.",
        activities: [
          "Dallol springs",
          "Salt lakes",
          "Salt mining",
          "Desert camping"
        ],
        accommodation: "Desert Camp",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Erta Ale Volcano",
        description:
          "Drive to Erta Ale base. Evening hike to volcano rim to avoid extreme heat. Witness active lava lake glowing in darkness - one of Earth's few permanent lava lakes.",
        activities: [
          "Erta Ale drive",
          "Evening hike",
          "Lava lake viewing",
          "Volcano experience"
        ],
        accommodation: "Desert Camp",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Return to Mekele",
        description:
          "Morning desert exploration. Drive back to Mekele. Tour debriefing. Farewell dinner celebrating extreme adventure completion.",
        activities: [
          "Desert exploration",
          "Drive to Mekele",
          "Tour debriefing",
          "Farewell dinner"
        ],
        accommodation: "Mekele Hotel",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
    ],
  },
];

// ==================== WESTERN REGION DESTINATIONS ====================

export const westernDestinations = [
  {
    id: "dest-bahir-dar",
    name: "Bahir Dar",
    description: "Beautiful lakeside city on Lake Tana, source of the Blue Nile. Known for ancient island monasteries, the dramatic Blue Nile Falls, and tranquil atmosphere earning it the name 'Ethiopia's Riviera'.",
    slug: "bahir-dar-lake-tana-ethiopia",
    images: [
      "/Images/bahirdar1.webp",
      "/Images/bahirdar2.webp",
      "/Images/bahirdar3.webp",
    ],
    type: "cultural",
    tag: "Lake City",
    highlights: [
      "Lake Tana monasteries",
      "Blue Nile Falls",
      "Island churches",
      "Lake cruises",
      "Bird watching"
    ],
    featured: true,
    coordinates: {
      lat: 11.5936,
      lng: 37.3908,
      city: "Bahir Dar",
      region: "Amhara",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bahir Dar",
        description:
          "Fly to Bahir Dar, transfer to lakeside hotel. Evening walk along Lake Tana shore. Sunset views over Africa's largest lake. Welcome dinner with regional cuisine.",
        activities: [
          "Airport transfer",
          "Lakeside walk",
          "Sunset viewing",
          "Welcome dinner"
        ],
        accommodation: "Kuriftu Resort",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Lake Tana Monasteries",
        description:
          "Boat trip to island monasteries: Ura Kidane Mehret with wall paintings, Azwa Maryam, and Kibran Gabriel (men only). Traditional lunch on island. Learn about religious art and manuscripts.",
        activities: [
          "Lake boat trip",
          "Monastery visits",
          "Island lunch",
          "Religious art"
        ],
        accommodation: "Kuriftu Resort",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Blue Nile Falls",
        description:
          "Drive to Blue Nile Falls (Tis Abay). Hike to viewpoints of 42m waterfall spanning 400m. Visit local villages and Tis Abay village. Return to Bahir Dar.",
        activities: [
          "Waterfall hike",
          "Viewpoint visits",
          "Local villages",
          "Scenic drive"
        ],
        accommodation: "Kuriftu Resort",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "City Tour & Departure",
        description:
          "Visit Bezawit Palace (former imperial residence). Explore local market. See traditional crafts. Farewell lunch. Airport transfer.",
        activities: [
          "Bezawit Palace",
          "Local market",
          "Craft visits",
          "Farewell lunch"
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
  },
  {
    id: "dest-gondar1",
    name: "Gondar",
    description: "Ethiopia's 17th-century imperial capital, known as the 'Camelot of Africa.' Features the impressive Royal Enclosure (Fasil Ghebbi) with several castles, plus beautiful churches with stunning ceiling paintings.",
    slug: "gondar-royal-castles-ethiopia",
    images: [
      "/Images/gondar1.webp",
      "/Images/gondar2.webp",
      "/Images/gondar3.webp",
    ],
    type: "cultural",
    tag: "UNESCO",
    highlights: [
      "Fasil Ghebbi castles",
      "Debre Berhan Selassie",
      "Fasiladas' Bath",
      "Royal Enclosure",
      "Imperial history"
    ],
    featured: true,
    coordinates: {
      lat: 12.6075,
      lng: 37.4583,
      city: "Gondar",
      region: "Amhara",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Gondar",
        description:
          "Fly to Gondar, transfer to hotel with castle views. Evening orientation walk through historic areas. Traditional dinner with cultural introduction to Gondar's imperial history.",
        activities: [
          "Airport transfer",
          "Town orientation",
          "Historic walk",
          "Traditional dinner"
        ],
        accommodation: "Goha Hotel",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Royal Enclosure Tour",
        description:
          "Full guided tour of Fasil Ghebbi: Fasiladas' Castle, Iyasu's Palace, Dawit's Hall, Empress Mentewab's castle. Visit royal archives and see all six castles. Traditional lunch.",
        activities: [
          "Fasiladas' Castle",
          "Iyasu's Palace",
          "Dawit's Hall",
          "Royal archives"
        ],
        accommodation: "Goha Hotel",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Religious Sites",
        description:
          "Visit Fasiladas' Bath (Timkat celebration site). Explore Debre Berhan Selassie Church with famous angel ceiling. See Qusquam complex. Traditional coffee ceremony.",
        activities: [
          "Fasiladas' Bath",
          "Debre Berhan Selassie",
          "Qusquam complex",
          "Coffee ceremony"
        ],
        accommodation: "Goha Hotel",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Market & Departure",
        description:
          "Visit local market for crafts and spices. Traditional weaving demonstration. Farewell lunch. Airport transfer.",
        activities: [
          "Local market",
          "Weaving workshop",
          "Farewell lunch",
          "Airport transfer"
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
  },
  {
    id: "dest-lalibela2",
    name: "Lalibela",
    description: "Home to 11 remarkable rock-hewn churches carved from solid volcanic rock in the 12th century. Often called the 'Eighth Wonder of the World,' this UNESCO site remains an active pilgrimage center where ancient Orthodox traditions continue today.",
    slug: "lalibela-rock-churches-ethiopia",
    images: [
      "/Images/lalibela1.webp",
      "/Images/lalibela2.webp",
      "/Images/lalibela3.webp",
    ],
    type: "cultural",
    tag: "UNESCO",
    highlights: [
      "Rock-hewn churches",
      "Bet Giyorgis",
      "Underground tunnels",
      "Pilgrimage site",
      "Ancient artwork"
    ],
    featured: true,
    coordinates: {
      lat: 12.0333,
      lng: 39.0333,
      city: "Lalibela",
      region: "Amhara",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Lalibela",
        description:
          "Fly to Lalibela, transfer to hotel. Evening orientation and sunset over Lasta Mountains. Welcome dinner with cultural introduction.",
        activities: [
          "Airport transfer",
          "Town orientation",
          "Sunset viewing",
          "Welcome dinner"
        ],
        accommodation: "Panoramic View Hotel",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Northern Churches",
        description:
          "Visit Bet Medhane Alem (world's largest monolithic church). Explore Bet Maryam with frescoes. Descend to interconnected churches: Bet Meskel, Bet Denag, Bet Mikael.",
        activities: [
          "Bet Medhane Alem",
          "Bet Maryam",
          "Interconnected churches",
          "Underground passages"
        ],
        accommodation: "Panoramic View Hotel",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Southern Churches",
        description:
          "Visit iconic cross-shaped Bet Giyorgis. Explore Bet Gabriel-Rufael complex. See Bethlehem Cave Church. Evening prayer service with local worshippers.",
        activities: [
          "Bet Giyorgis",
          "Bet Gabriel-Rufael",
          "Cave Church",
          "Prayer service"
        ],
        accommodation: "Panoramic View Hotel",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Monastery & Departure",
        description:
          "Optional hike to Asheten Mariam Monastery for panoramic views. Visit local market. Farewell lunch. Airport transfer.",
        activities: [
          "Optional monastery hike",
          "Local market",
          "Farewell lunch",
          "Airport transfer"
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
  },
  {
    id: "dest-awash",
    name: "Awash National Park",
    description: "Ethiopia's first national park (1966), featuring diverse wildlife along the Awash River. Home to oryx, gazelles, over 450 bird species, plus dramatic Awash Falls and hot springs in the Rift Valley.",
    slug: "awash-national-park-ethiopia",
    images: [
      "/Images/awash1.webp",
      "/Images/awash2.webp",
      "/Images/awash3.jpg",
    ],
    type: "nature",
    tag: "Wildlife",
    highlights: [
      "Awash Falls",
      "Beisa oryx",
      "450+ bird species",
      "Hot springs",
      "Rift Valley scenery"
    ],
    featured: false,
    coordinates: {
      lat: 8.9167,
      lng: 40.1667,
      city: "Awash",
      region: "Afar",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Awash",
        description:
          "Drive from Addis to Awash National Park. Park entry and briefing. Afternoon game drive for initial wildlife viewing. Sunset in Rift Valley.",
        activities: [
          "Scenic drive",
          "Park entry",
          "Game drive",
          "Sunset viewing"
        ],
        accommodation: "Awash Falls Lodge",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Full Day Safari",
        description:
          "Morning game drive for oryx, gazelles, kudu. Bird watching (450+ species). Visit Awash Falls and hot springs. Evening nature walk.",
        activities: [
          "Game drive",
          "Bird watching",
          "Awash Falls",
          "Hot springs"
        ],
        accommodation: "Awash Falls Lodge",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Afar Community & Return",
        description:
          "Visit local Afar communities, learn about pastoral traditions. River walk. Farewell lunch. Drive back to Addis Ababa.",
        activities: [
          "Afar community",
          "River walk",
          "Farewell lunch",
          "Return to Addis"
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
  },
];

// ==================== CENTRAL REGION DESTINATIONS ====================

export const centralDestinations = [
  {
    id: "dest-addis",
    name: "Addis Ababa",
    description: "Ethiopia's vibrant capital city at 2,400m, diplomatic capital of Africa. Home to the National Museum (Lucy fossil), bustling Merkato market, Holy Trinity Cathedral, and diverse cultural institutions.",
    slug: "addis-ababa-capital-ethiopia",
    images: [
      "/Images/addis1.webp",
      "/Images/addis2.webp",
      "/Images/addis3.webp",
    ],
    type: "cultural",
    tag: "Capital",
    highlights: [
      "National Museum (Lucy)",
      "Merkato market",
      "Holy Trinity Cathedral",
      "Entoto Mountains",
      "Ethnological Museum"
    ],
    featured: true,
    coordinates: {
      lat: 9.032,
      lng: 38.7468,
      city: "Addis Ababa",
      region: "Addis Ababa",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Addis Ababa",
        description:
          "Airport pickup and hotel transfer. City orientation and historical context. Visit Unity Park for cultural overview. Traditional welcome dinner with Ethiopian cuisine.",
        activities: [
          "Airport pickup",
          "City orientation",
          "Unity Park",
          "Welcome dinner"
        ],
        accommodation: "Sheraton Addis",
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Museums & History",
        description:
          "Visit National Museum (see Lucy fossil). Explore Holy Trinity Cathedral. Visit Ethnological Museum in former palace. Red Terror Museum for modern history. Traditional lunch.",
        activities: [
          "National Museum",
          "Holy Trinity",
          "Ethnological Museum",
          "Red Terror Museum"
        ],
        accommodation: "Sheraton Addis",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 3,
        title: "Markets & Mountains",
        description:
          "Visit Merkato, Africa's largest open-air market. Drive to Mount Entoto for panoramic city views. Visit Entoto Maryam Church. Traditional coffee ceremony.",
        activities: [
          "Merkato market",
          "Mount Entoto",
          "Entoto Maryam",
          "Coffee ceremony"
        ],
        accommodation: "Sheraton Addis",
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Arts & Departure",
        description:
          "Visit contemporary art gallery. See traditional crafts. Shopping for souvenirs. Farewell lunch. Airport transfer.",
        activities: [
          "Art gallery",
          "Craft demonstrations",
          "Souvenir shopping",
          "Airport transfer"
        ],
        accommodation: "Not included",
        meals: ["Breakfast", "Lunch"],
      },
    ],
  },
];

// ==================== REGIONS COLLECTION ====================

export const destinationRegions = [
  {
    id: "reg-north",
    name: "Northern Ethiopia",
    description: "Historical sites and ancient civilizations",
    slug: "northern-ethiopia-destinations",
    destinations: northernDestinations,
  },
  {
    id: "reg-south",
    name: "Southern Ethiopia",
    description: "Cultural diversity and tribal traditions",
    slug: "southern-ethiopia-destinations",
    destinations: southernDestinations,
  },
  {
    id: "reg-east",
    name: "Eastern Ethiopia",
    description: "Ancient cities and extreme landscapes",
    slug: "eastern-ethiopia-destinations",
    destinations: easternDestinations,
  },
  {
    id: "reg-central",
    name: "Central Ethiopia",
    description: "Capital city and surrounding attractions",
    slug: "central-ethiopia-destinations",
    destinations: centralDestinations,
  },
  {
    id: "reg-west",
    name: "Western Ethiopia",
    description: "Lake Tana, monasteries, and waterfalls",
    slug: "western-ethiopia-destinations",
    destinations: westernDestinations,
  },
];



// ==================== MAIN DATA EXPORT ====================
export const navbarCategoriesData= {
  featured: {
    id: "feat-001",
    name: "Featured Experiences",
    description: "Top recommended tours and experiences in Ethiopia",
    slug: "featured-experiences-ethiopia",
    metaTitle: "Featured Ethiopia Tours - Top Recommended Experiences",
    metaDescription:
      "Discover our featured Ethiopia tours including Danakil Depression, Historic Route, Omo Valley, and luxury experiences. Expert-guided adventures.",
    keywords: [
      "featured ethiopia tours",
      "best ethiopia experiences",
      "top recommended tours",
      "premium ethiopia travel",
    ],
    experiences: featuredExperiences,
  },
  festivals: festivalsSection,
  tours: {
    id: "01",
    name: "Ethiopia Tours",
    description: "Complete collection of guided tours across Ethiopia",
    slug: "all-tours-ethiopia",
    metaTitle: "All Ethiopia Tours - Complete Collection of Guided Experiences",
    metaDescription:
      "Browse all Ethiopia tours including adventure, cultural, luxury, and specialty tours. Find your perfect Ethiopian travel experience.",
    keywords: [
      "all ethiopia tours",
      "guided tours ethiopia",
      "ethiopia tour packages",
      "complete tour collection",
    ],
    categories: tourCategories,
  },

  destinations: {
    id: "02",
    name: "Destinations",
    description: "Explore Ethiopia's diverse regions and iconic locations",
    slug: "destinations-ethiopia",
    metaTitle: "Ethiopia Destinations - Complete Guide to Regions & Places",
    metaDescription:
      "Explore all Ethiopia destinations including Northern Historic Route, Omo Valley, Danakil Depression, and national parks. Complete travel guide.",
    keywords: [
      "ethiopia destinations",
      "travel regions ethiopia",
      "places to visit ethiopia",
      "destination guide ethiopia",
    ],
    regions: destinationRegions,
  },
};

export const popularOmoValleyTours = [
  {
    id: "pop-001",
    name: "3 Day Omo Valley Highlights",
    price: 450, // 3 Days / 2 Nights
    slug: "omo-valley-highlights-3-days",
    description: "Experience the best of Omo Valley with visits to local tribes, traditional markets, and stunning landscapes. Perfect for first-time visitors to Ethiopia seeking authentic cultural encounters and photography opportunities in the Omo Valley region.",
    images: ["/Images/IMG-20260216-WA0081.jpg"],
    duration: "3 Days / 2 Nights",
    highlights: ["Visit Hammer Tribe", "Traditional Markets", "Local Villages"],
    difficulty: "Easy",
    featured: true,
    rating: 4.7,
    reviewCount: 42,
    groupSize: "2-8 people",

    coordinates: {
      lat: 5.4652,
      lng: 36.4869,
      city: "Jinka",
      region: "Omo Valley"
    },
    itinerary: [],
    inclusions: [],
    exclusions: [],
    status: "active",
    tag: "Best Seller",
    bestTime: ["June to September", "December to February"],
    departurePoint: "Jinka",
    languages: ["English"],
    category: "cultural"
  },
  {
    id: "pop-002",
    name: "7 Day Tribal Expedition",
    price: 890, // 7 Days / 6 Nights
    slug: "omo-valley-tribal-expedition-7-days",
    description: "Comprehensive Omo Valley expedition visiting multiple tribes including Hamer, Mursi, Karo, and Dassanech. Experience authentic ceremonies, body painting, and traditional villages in remote areas of Southern Ethiopia.",
    images: ["/Images/IMG-20260216-WA0081.jpg"],
    duration: "7 Days / 6 Nights",
    highlights: ["4+ Tribal Encounters", "Bull Jumping Ceremony", "Photography Focus"],
    difficulty: "Moderate",
    featured: true,
    rating: 4.9,
    reviewCount: 78,
    groupSize: "4-10 people",
    
    coordinates: {
      lat: 5.4652,
      lng: 36.4869,
      city: "Turmi",
      region: "Omo Valley"
    },
    itinerary: [],
    inclusions: [],
    exclusions: [],
    status: "active",
    bestTime: ["June to September", "December to February"],
    departurePoint: "Jinka",
    languages: ["English"],
    category: "cultural"
  },
  {
    id: "pop-003",
    name: "Omo River Camping Adventure",
    price: 580, // 5 Days / 4 Nights
    slug: "omo-river-camping-adventure",
    description: "Unique camping experience along the Omo River with opportunities to visit remote riverside villages, spot wildlife, and experience the natural beauty of the Omo Valley. Ideal for adventure seekers and nature lovers visiting Ethiopia.",
    images: ["/Images/IMG-20260216-WA0081.jpg"],
    duration: "5 Days / 4 Nights",
    highlights: ["River Camping", "Bird Watching", "Remote Villages"],
    difficulty: "Moderate",
    featured: false,
    rating: 4.6,
    reviewCount: 23,
    groupSize: "4-8 people",
    
    coordinates: {
      lat: 5.4652,
      lng: 36.4869,
      city: "Turmi",
      region: "Omo Valley"
    },
    itinerary: [],
    inclusions: [],
    exclusions: [],
    status: "active",
    tag: "Adventure",
    bestTime: ["October to March"],
    departurePoint: "Jinka",
    languages: ["English"],
    category: "adventure"
  },
  {
    id: "pop-004",
    name: "Cultural Photography Tour",
    price: 950, // 8 Days / 7 Nights
    slug: "cultural-photography-tour-omo-valley",
    description: "Specialized photography tour designed for enthusiasts and professionals. Capture stunning portraits of tribal people, traditional ceremonies, and breathtaking landscapes with guidance from experienced photography guides in Ethiopia.",
    images: ["/Images/IMG-20260216-WA0081.jpg"],
    duration: "8 Days / 7 Nights",
    highlights: ["Golden Hour Shoots", "Portrait Sessions", "Editing Workshop"],
    difficulty: "Easy",
    featured: true,
    rating: 5.0,
    reviewCount: 34,
    groupSize: "4-6 people",
    
    coordinates: {
      lat: 5.4652,
      lng: 36.4869,
      city: "Turmi",
      region: "Omo Valley"
    },
    itinerary: [],
    inclusions: [],
    exclusions: [],
    status: "active",
    bestTime: ["September to February"],
    departurePoint: "Jinka",
    languages: ["English"],
    category: "cultural"
  },
  {
    id: "pop-005",
    name: "Lake & Wildlife Safari",
    price: 520, // 4 Days / 3 Nights
    slug: "lake-chamo-wildlife-safari",
    description: "Explore the beautiful lakes of Ethiopia's Rift Valley including Lake Chamo and Lake Abaya. Spot crocodiles, hippos, and exotic birds while visiting traditional fishing villages and enjoying boat safaris in Southern Ethiopia.",
    images: ["/Images/IMG-20260216-WA0081.jpg"],
    duration: "4 Days / 3 Nights",
    highlights: ["Crocodile Market", "Hippo Watching", "Bird Species"],
    difficulty: "Easy",
    featured: false,
    rating: 4.5,
    reviewCount: 31,
    groupSize: "2-10 people",

    coordinates: {
      lat: 6.0355,
      lng: 37.5593,
      city: "Arba Minch",
      region: "Southern Nations"
    },
    itinerary: [],
    inclusions: [],
    exclusions: [],
    status: "active",
    bestTime: ["November to March"],
    departurePoint: "Arba Minch",
    languages: ["English"],
    category: "nature"
  }
];

// Add this helper function inside the DataHelpers object (around line 1200+)



export const offersData= [
  {
    id: "offer-001",
    name: "Omo Valley Cultural Immersion - Early Bird Special",
    price: 850, // 25% OFF from original 1133
    slug: "omo-valley-early-bird",
    shortDescription: "Book 6 months ahead and secure your spot for this transformative journey",
    description: "Experience the rich cultural heritage of the Omo Valley with our most popular itinerary. Visit the Mursi, Hamer, and Karo tribes, witness traditional ceremonies, and immerse yourself in ancient traditions that have remained unchanged for centuries.",
    images: [
      "/Images/omovalley3.webp",
      "/Images/omo1.webp",
      "/Images/omo2.webp",
    ],
    discount: "25% OFF",
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    category: "early-bird",
    featured: true,
    tourIds: ["cult-001"],
    destinationIds: ["dest-omo"],
    minParticipants: 2,
    maxParticipants: 8,
    bookingDeadline: "6 months before departure",
    highlights: [
      "Visit three distinct tribal communities",
      "Witness traditional bull jumping ceremony",
      "Participate in local market days",
      "Expert local guides from the region"
    ],
    inclusions: [
      "All ground transportation in 4x4 vehicle",
      "Professional English-speaking guide",
      "All tribal permits and fees",
      "Accommodation in local lodges",
      "All meals as per itinerary"
    ],
    terms: [
      "Valid for new bookings only",
      "Cannot be combined with other offers",
      "Deposit required to secure booking",
      "Subject to availability"
    ]
  },
  {
    id: "offer-002",
    name: "Group Adventure: Northern Historical Circuit",
    price: 1200, // 4th Person FREE
    slug: "group-northern-circuit",
    shortDescription: "Travel with friends and save big on Ethiopia's iconic historical route",
    description: "Explore the ancient wonders of northern Ethiopia with your travel companions. Visit Lalibela's rock-hewn churches, Axum's towering obelisks, and Gondar's imperial castles in this comprehensive 10-day journey through history.",
    images: [
      "/Images/lalibela1.webp",
      "/Images/axum1.webp",
      "/Images/gondar1.webp",
    ],
    discount: "4th Person FREE",
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    category: "group",
    featured: true,
    tourIds: ["hist-002", "hist-008"],
    destinationIds: ["dest-lalibela", "dest-axum", "dest-gondar"],
    minParticipants: 4,
    maxParticipants: 12,
    highlights: [
      "All 11 rock-hewn churches of Lalibela",
      "Ancient stelae field in Axum",
      "Fasil Ghebbi castle complex in Gondar",
      "Scenic drive through Simien Mountains"
    ],
    inclusions: [
      "Domestic flights",
      "Professional historical guide",
      "All entrance fees",
      "Comfortable hotel accommodation",
      "Breakfast and dinner daily"
    ],
    terms: [
      "Valid for groups of 4 or more",
      "Must book together",
      "Shared accommodation",
      "Valid for select departure dates"
    ]
  },
  {
    id: "offer-003",
    name: "Timkat Festival Special - Seasonal Package",
    price: 680, // 20% OFF
    slug: "timkat-festival-special",
    shortDescription: "Witness Ethiopia's most spectacular religious festival in Gondar",
    description: "Experience the vibrant Timkat (Epiphany) celebration in the royal city of Gondar. Join thousands of pilgrims in white robes, witness colorful processions, and participate in the blessing of the waters at Fasiladas' Bath.",
    images: [
      "/Images/timkat1.webp",
      "/Images/gondar2.webp",
      "/Images/timkat2.webp",
    ],
    discount: "20% OFF",
    validFrom: "2024-01-01",
    validUntil: "2024-01-20",
    category: "seasonal",
    featured: true,
    tourIds: ["cult-004"],
    destinationIds: ["dest-gondar"],
    minParticipants: 2,
    maxParticipants: 10,
    bookingDeadline: "December 15",
    highlights: [
      "Front-row viewing of Timkat ceremonies",
      "Private guide with festival expertise",
      "Visit to Debre Berhan Selassie Church",
      "Traditional Ethiopian feast"
    ],
    inclusions: [
      "4 nights accommodation in Gondar",
      "All festival access and permits",
      "Expert guide throughout",
      "Traditional coffee ceremonies",
      "All meals during festival"
    ],
    terms: [
      "Specific dates apply (Jan 18-21)",
      "Limited availability",
      "Non-refundable deposit required"
    ]
  },
  {
    id: "offer-004",
    name: "Last Minute: Danakil Depression Expedition",
    price: 455, // 30% OFF from original 650
    slug: "last-minute-danakil",
    shortDescription: "Spontaneous adventure to one of Earth's most extreme landscapes",
    description: "Embark on an unforgettable journey to the Danakil Depression, one of the hottest and most otherworldly places on Earth. Witness active volcanoes, colorful sulfur springs, and vast salt flats in this 4-day expedition.",
    images: [
      "/Images/danakil1.webp",
      "/Images/danakil2.webp",
      "/Images/erta-ale1.webp",
    ],
    discount: "30% OFF",
    validFrom: "2024-01-01",
    validUntil: "2024-03-31",
    category: "last-minute",
    featured: true,
    tourIds: ["nat-002"],
    destinationIds: ["dest-danakil"],
    minParticipants: 4,
    maxParticipants: 8,
    bookingDeadline: "2 weeks before departure",
    highlights: [
      "Night hike to Erta Ale's lava lake",
      "Colorful Dallol sulfur springs",
      "Salt flats and camel caravans",
      "Swim in Lake Afdera"
    ],
    inclusions: [
      "All ground transportation in 4x4",
      "Experienced Afar guides",
      "Camping equipment",
      "All meals during expedition",
      "Armed scout for security"
    ],
    terms: [
      "Must book within 30 days of departure",
      "Good physical fitness required",
      "Not recommended for children under 12"
    ]
  },
  {
    id: "offer-005",
    name: "Family Adventure: Wildlife & Culture",
    price: 720, // Kids Under 12 FREE
    slug: "family-wildlife-culture",
    shortDescription: "Create unforgettable memories with your family in Ethiopia",
    description: "Designed specifically for families, this 8-day adventure combines wildlife viewing in the Rift Valley lakes with cultural experiences in Addis Ababa. Kid-friendly guides and activities ensure fun for all ages.",
    images: [
      "/Images/awash1.jpg",
      "/Images/addis1.webp",
      "/Images/rift-valley1.jpg",
    ],
    discount: "Kids Under 12 FREE",
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    category: "family",
    featured: true,
    tourIds: ["nat-004"],
    destinationIds: ["dest-addis", "dest-awash"],
    minParticipants: 2,
    maxParticipants: 6,
    highlights: [
      "Boat trip on Lake Ziway with bird watching",
      "Visit to Entoto Mountain and Addis views",
      "Hands-on Ethiopian cooking class",
      "Family-friendly guided museum tours"
    ],
    inclusions: [
      "Private family-friendly guide",
      "All entrance fees",
      "Accommodation with family rooms",
      "All breakfasts and select meals",
      "Airport transfers"
    ],
    terms: [
      "Kids under 12 free when sharing with 2 adults",
      "Activities tailored for children",
      "Flexible scheduling available"
    ]
  },
  {
    id: "offer-006",
    name: "Early Bird: Simien Mountains Trek",
    price: 585, // 25% OFF from original 780
    slug: "early-bird-simien",
    shortDescription: "Secure your spot for the trek of a lifetime in the 'Roof of Africa'",
    description: "Trek through the dramatic landscapes of the Simien Mountains National Park, a UNESCO World Heritage site. Encounter endemic wildlife, including Gelada baboons and Walia ibex, and stand atop Africa's fourth highest peak.",
    images: [
      "/Images/simien1.webp",
      "/Images/simien2.webp",
      "/Images/simien3.webp",
    ],
    discount: "25% OFF",
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    category: "early-bird",
    featured: false,
    tourIds: ["nat-001"],
    destinationIds: ["dest-simien"],
    minParticipants: 4,
    maxParticipants: 8,
    bookingDeadline: "4 months before trek",
    highlights: [
      "Multi-day trek in UNESCO World Heritage site",
      "Close encounters with Gelada baboons",
      "Optional summit of Mount Bwahit (4,430m)",
      "Camp under the stars"
    ],
    inclusions: [
      "Professional mountain guide",
      "Cook and camp staff",
      "All camping equipment",
      "Park entrance fees",
      "Mule support for luggage"
    ],
    terms: [
      "Valid for treks booked 4+ months ahead",
      "Moderate fitness level required",
      "Group size limited to 8"
    ]
  }
];
// data/experiencesData.ts
export const experiencesData = [
  {
    id: "exp-001",
    name: "Mursi Tribal Village Visit",
    price: 120, // Full Day
    slug: "mursi-tribal-village",
    shortDescription: "Meet the legendary Mursi people and discover their unique lip-plate tradition",
    description: "Journey into the heart of Mago National Park to visit the Mursi people, one of Ethiopia's most fascinating tribes. Learn about their ancient traditions, witness the remarkable lip-plate culture, and gain insight into their daily life, cattle herding, and social structures. This authentic cultural encounter is guided by local community members who share their heritage with respect and pride.",
    images: [
      "/Images/mursi1.webp",
      "/Images/mursi2.webp",
      "/Images/omo3.webp",
    ],
    duration: "Full Day",
    location: "Mago National Park, Omo Valley, Ethiopia",
    highlights: [
      "Meet Mursi women with traditional lip plates",
      "Learn about body painting and scarification",
      "Observe traditional cattle herding",
      "Visit a village elder's home",
      "Cultural exchange with community members"
    ],
    included: [
      "Local Mursi guide",
      "Tribal permit and village fees",
      "4x4 transportation from Jinka",
      "Picnic lunch",
      "Bottled water"
    ],
    notIncluded: [
      "Personal photography fees (payable to tribes)",
      "Alcoholic beverages",
      "Tips for guides"
    ],
    bestTimeToVisit: "June to September, December to February",
    difficulty: "Easy",
    category: "tribal",
    tag: "Cultural",
    featured: true,
    rating: 4.9,
    reviewCount: 128,
    coordinates: {
      lat: 5.4652,
      lng: 36.4869,
      city: "Jinka",
      region: "Omo Valley"
    },
    languages: ["English", "Mursi (with translator)"],
    groupSize: "2-6 people",
    ageRange: "All ages (child-friendly)",
    whatToBring: [
      "Camera with extra batteries",
      "Sun hat and sunscreen",
      "Comfortable walking shoes",
      "Small gifts for children (pencils, notebooks)",
      "Cash for photography fees"
    ],
    meetingPoint: "Your hotel in Jinka",
    startTimes: ["8:00 AM", "Flexible on request"],
    culturalSignificance: "The Mursi are one of the last African tribes where women traditionally wear clay lip plates, symbolizing beauty and social status.",
    seasonalAvailability: "Accessible year-round, best during dry seasons",
    status: "active"
  },
  {
    id: "exp-002",
    name: "Traditional Ethiopian Coffee Ceremony",
    price: 45, // 2-3 Hours
    slug: "coffee-ceremony",
    shortDescription: "Experience the ancient ritual that defines Ethiopian hospitality",
    description: "Participate in the UNESCO-recognized traditional coffee ceremony, the heart of Ethiopian social life. In a local home, watch as green coffee beans are roasted over charcoal, ground with a pestle, and brewed in a clay jebena. Three rounds of coffee are served, each with its own blessing, accompanied by incense and popcorn. This immersive experience connects you to centuries of tradition.",
    images: [
      "/Images/coffee1.webp",
      "/Images/coffee2.webp",
      "/Images/coffee3.webp",
    ],
    duration: "2-3 Hours",
    location: "Addis Ababa, Ethiopia",
    highlights: [
      "Watch beans roasted from green to dark",
      "Learn the significance of three rounds",
      "Traditional incense and popcorn",
      "Stories and legends of coffee's discovery",
      "Certificate of participation"
    ],
    included: [
      "Traditional coffee ceremony setup",
      "All coffee and refreshments",
      "Local host family",
      "English-speaking guide",
      "Small group setting"
    ],
    notIncluded: [
      "Transportation to/from venue",
      "Additional coffee purchases"
    ],
    bestTimeToVisit: "Year-round, best in morning or late afternoon",
    difficulty: "Easy",
    category: "coffee",
    tag: "Cultural",
    featured: true,
    rating: 5.0,
    reviewCount: 256,
    coordinates: {
      lat: 9.032,
      lng: 38.7468,
      city: "Addis Ababa",
      region: "Addis Ababa"
    },
    languages: ["English", "Amharic"],
    groupSize: "2-10 people",
    ageRange: "All ages",
    whatToBring: [
      "Curiosity and questions",
      "Camera (ask permission before photographing)",
      "Small gift for host family (optional)"
    ],
    meetingPoint: "Bole Medhanealem Church, Addis Ababa",
    startTimes: ["10:00 AM", "3:00 PM", "6:00 PM (evening ceremony)"],
    culturalSignificance: "The coffee ceremony represents the essence of Ethiopian hospitality, friendship, and community bonding. Refusing coffee can be seen as unfriendly.",
    seasonalAvailability: "Available year-round",
    status: "active"
  },
  {
    id: "exp-003",
    name: "Timkat Festival in Gondar",
    price: 450, // 3 Days
    slug: "timkat-festival-gondar",
    shortDescription: "Witness Ethiopia's most spectacular religious celebration",
    description: "Experience Timkat (Epiphany) in the historic city of Gondar, where the celebration reaches its most magnificent form. Thousands of white-robed pilgrims gather at Fasiladas' Bath for the blessing of the waters, reenacting Christ's baptism in the Jordan River. Colorful processions, ancient hymns, and joyful dancing create an unforgettable spiritual spectacle.",
    images: [
      "/Images/timkat1.webp",
      "/Images/gondar1.webp",
      "/Images/timkat2.webp",
    ],
    duration: "3 Days",
    location: "Gondar, Amhara Region, Ethiopia",
    highlights: [
      "Ketera eve procession with tabots",
      "Dawn water blessing ceremony",
      "Traditional liturgical music",
      "Thousands of pilgrims in white",
      "Cultural performances and feasting"
    ],
    included: [
      "Expert festival guide",
      "Prime viewing locations",
      "Traditional festival meals",
      "Cultural briefing and history",
      "Photography guidance"
    ],
    notIncluded: [
      "Accommodation in Gondar",
      "Transportation to/from Gondar",
      "Personal expenses"
    ],
    bestTimeToVisit: "January 18-20 annually",
    difficulty: "Easy",
    category: "festivals",
    tag: "Festival",
    featured: true,
    rating: 5.0,
    reviewCount: 89,
    coordinates: {
      lat: 12.6075,
      lng: 37.4585,
      city: "Gondar",
      region: "Amhara"
    },
    languages: ["English", "Amharic"],
    groupSize: "4-15 people",
    ageRange: "All ages",
    whatToBring: [
      "White clothing to blend with pilgrims",
      "Comfortable walking shoes",
      "Camera with zoom lens",
      "Water and snacks",
      "Small foldable stool (optional)"
    ],
    meetingPoint: "Goha Hotel, Gondar",
    startTimes: ["Early morning (4:00 AM) on Timkat day"],
    culturalSignificance: "Timkat is the most important festival in the Ethiopian Orthodox calendar, celebrating Jesus's baptism and the renewal of faith.",
    seasonalAvailability: "Only during Timkat (January 19-20, with eve on 18th)",
    status: "active",
    isUnesco: true,
    unesco: true
  },
  {
    id: "exp-004",
    name: "Injera Cooking Class",
    price: 65, // 4 Hours
    slug: "injera-cooking-class",
    shortDescription: "Learn to make Ethiopia's staple bread from scratch",
    description: "Master the art of making injera, the spongy, sourdough flatbread that accompanies every Ethiopian meal. In this hands-on class, you'll learn the entire process from fermenting teff flour to pouring and cooking the perfect injera on a clay mitad. Then, enjoy the fruits of your labor with a feast of traditional wat stews.",
    images: [
      "/Images/food1.jpg",
      "/Images/injera1.jpg",
      "/Images/cooking1.jpg",
    ],
    duration: "4 Hours",
    location: "Addis Ababa, Ethiopia",
    highlights: [
      "Hands-on injera cooking",
      "Learn fermentation techniques",
      "Cook traditional wat stews",
      "Eat your creations together",
      "Recipe cards to take home"
    ],
    included: [
      "All ingredients and materials",
      "Professional cooking instructor",
      "Traditional Ethiopian lunch/dinner",
      "Recipe booklet",
      "Certificate of completion"
    ],
    notIncluded: [
      "Transportation to/from venue",
      "Alcoholic beverages"
    ],
    bestTimeToVisit: "Year-round",
    difficulty: "Easy",
    category: "food",
    tag: "Culinary",
    featured: false,
    rating: 4.8,
    reviewCount: 67,
    coordinates: {
      lat: 9.032,
      lng: 38.7468,
      city: "Addis Ababa",
      region: "Addis Ababa"
    },
    languages: ["English", "Amharic"],
    groupSize: "2-8 people",
    ageRange: "12+ years",
    whatToBring: [
      "Apron (provided if needed)",
      "Camera for memories",
      "Empty stomach!",
      "Notebook for recipes"
    ],
    meetingPoint: "Ethiopian Cultural Cooking School, Bole",
    startTimes: ["10:00 AM", "4:00 PM"],
    culturalSignificance: "Injera is more than food – it's a symbol of community, as meals are traditionally eaten from a shared platter.",
    seasonalAvailability: "Available year-round",
    status: "active"
  },
  {
    id: "exp-005",
    name: "Simien Mountains Day Hike",
    price: 180, // 6-8 Hours
    slug: "simien-day-hike",
    shortDescription: "Experience the 'Roof of Africa' on a guided day trek",
    description: "Explore the breathtaking landscapes of the Simien Mountains National Park on a day hike suitable for all fitness levels. Trek along dramatic escarpments, encounter troops of Gelada baboons, and stand at viewpoints offering panoramic vistas of valleys dropping 1,500 meters below. This is the perfect introduction to Ethiopia's most spectacular mountain scenery.",
    images: [
      "/Images/simien1.webp",
      "/Images/simien2.webp",
      "/Images/gelada1.jpg",
    ],
    duration: "6-8 Hours",
    location: "Simien Mountains National Park, Amhara Region, Ethiopia",
    highlights: [
      "Close encounters with Gelada baboons",
      "Dramatic escarpment viewpoints",
      "Jinbar Waterfall vista",
      "Afro-alpine plant life",
      "Picnic lunch with mountain views"
    ],
    included: [
      "Park entrance fees",
      "Professional mountain guide",
      "Armed scout",
      "Private 4x4 transportation",
      "Picnic lunch and water"
    ],
    notIncluded: [
      "Tips for guides",
      "Travel insurance",
      "Personal hiking gear"
    ],
    bestTimeToVisit: "October to April",
    difficulty: "Moderate",
    category: "hiking",
    tag: "UNESCO",
    featured: true,
    rating: 4.9,
    reviewCount: 145,
    coordinates: {
      lat: 13.181,
      lng: 38.0706,
      city: "Debark",
      region: "Amhara"
    },
    languages: ["English", "Amharic"],
    groupSize: "2-8 people",
    ageRange: "10-65 years",
    whatToBring: [
      "Sturdy hiking boots",
      "Warm layers (temperatures drop at altitude)",
      "Rain jacket",
      "Sun protection",
      "Daypack with personal items"
    ],
    meetingPoint: "Simien Park Headquarters, Debark",
    startTimes: ["7:00 AM"],
    culturalSignificance: "The Simien Mountains are considered sacred in Ethiopian culture, with many monasteries hidden in remote cliffs.",
    seasonalAvailability: "Best during dry season (Oct-May)",
    status: "active",
    isUnesco: true,
    unesco: true
  },
  {
    id: "exp-006",
    name: "Bird Watching in the Rift Valley",
    price: 150, // Full Day
    slug: "rift-valley-birding",
    shortDescription: "Discover Ethiopia's incredible avian diversity",
    description: "Ethiopia is a birdwatcher's paradise with over 800 species, many endemic. Join expert local ornithologists for a day of birding in the Rift Valley lakes, where flamingos, pelicans, storks, and kingfishers abound. Visit Lake Ziway, Lake Langano, and Abijatta-Shalla National Park for the best sightings.",
    images: [
      "/Images/birding1.jpg",
      "/Images/flamingos1.jpg",
      "/Images/rift-valley1.jpg",
    ],
    duration: "Full Day",
    location: "Rift Valley Lakes (Ziway, Langano), Ethiopia",
    highlights: [
      "Spot lesser and greater flamingos",
      "Observe pelicans and storks",
      "See endemic bird species",
      "Visit multiple lake ecosystems",
      "Expert ornithologist guide"
    ],
    included: [
      "Professional birding guide",
      "High-quality spotting scope",
      "Bird checklist booklet",
      "Private transportation",
      "Picnic lunch and refreshments"
    ],
    notIncluded: [
      "Personal binoculars (can be rented)",
      "Tips for guide"
    ],
    bestTimeToVisit: "November to March (peak migration)",
    difficulty: "Easy",
    category: "birding",
    tag: "Wildlife",
    featured: false,
    rating: 4.7,
    reviewCount: 56,
    coordinates: {
      lat: 7.600,
      lng: 38.417,
      city: "Ziway",
      region: "Oromia"
    },
    languages: ["English", "Amharic", "Oromifa"],
    groupSize: "2-6 people",
    ageRange: "All ages",
    whatToBring: [
      "Binoculars",
      "Camera with telephoto lens",
      "Field guide book (optional)",
      "Sun hat and sunscreen",
      "Comfortable walking shoes"
    ],
    meetingPoint: "Your hotel in Addis Ababa (pickup included)",
    startTimes: ["6:00 AM (early start for best bird activity)"],
    culturalSignificance: "Many bird species have cultural significance in Ethiopian folklore and are featured in traditional songs and stories.",
    seasonalAvailability: "Best during northern winter when migratory birds are present",
    status: "active"
  }
];


// ==================== HELPER FUNCTIONS OBJECT ====================
// ==================== HELPER FUNCTIONS OBJECT ====================

/**
 * Comprehensive helper functions for accessing and manipulating all data
 * Provides unified interface for tours, destinations, festivals, and more
 */

export const DataHelpers = {

/**
 * Get popular Omo Valley tours
 */
getPopularOmoValleyTours: ()=> {
  return popularOmoValleyTours;
},

/**
 * Get popular Omo Valley tour by ID
 */
getPopularOmoValleyTourById: (id) => {
  return popularOmoValleyTours.find(tour => tour.id === id);
},

/**
 * Get popular Omo Valley tour by slug
 */
getPopularOmoValleyTourBySlug: (slug) => {
  return popularOmoValleyTours.find(tour => tour.slug === slug);
},

/**
 * Get featured popular Omo Valley tours
 */
getFeaturedPopularOmoValleyTours: ()=> {
  return popularOmoValleyTours.filter(tour => tour.featured);
},

  // ==================== GALLERY FUNCTIONS ====================
  /**
   * Get all tours across all categories
   */
  getAllTours: ()=> {
    return navbarCategoriesData.tours.categories.flatMap(
      (category) => category.tours,
    );
  },

  /**
   * Get tour by ID
   */
  getTourById: (id ) => {
    return DataHelpers.getAllTours().find((tour) => tour.id === id);
  },

  /**
   * Get tour by slug
   */
  getTourBySlug: (slug) => {
    return DataHelpers.getAllTours().find((tour) => tour.slug === slug);
  },

  /**
   * Get featured tours
   */
  getFeaturedTours: () => {
    return DataHelpers.getAllTours().filter((tour) => tour.featured);
  },

  /**
   * Get tours by category ID
   */
  getToursByCategory: (categoryId) => {
    const category = navbarCategoriesData.tours.categories.find(
      (cat) => cat.id === categoryId,
    );
    return category ? category.tours : [];
  },

  /**
   * Get tours by category slug
   */
  getToursByCategorySlug: (categorySlug)=> {
    const category = navbarCategoriesData.tours.categories.find(
      (cat) => cat.slug === categorySlug,
    );
    return category ? category.tours : [];
  },

  /**
   * Get tour category by tour ID
   */
  getTourCategoryByTourId: (tourId)=> {
    return navbarCategoriesData.tours.categories.find((category) =>
      category.tours.some((tour) => tour.id === tourId),
    );
  },

  /**
   * Get tour category by slug
   */
  getTourCategoryBySlug: (slug) => {
    return navbarCategoriesData.tours.categories.find(
      (category) => category.slug === slug,
    );
  },

  /**
   * Get tours by duration range
   */
  getToursByDuration: (minDays, maxDays) => {
    const tours = DataHelpers.getAllTours();
    return tours.filter((tour) => {
      const days = parseInt(tour.duration) || 0;
      return days >= minDays && days <= maxDays;
    });
  },

  /**
   * Get tours by difficulty level
   */
  getToursByDifficulty: (difficulty)=> {
    return DataHelpers.getAllTours().filter(
      (tour) => tour.difficulty.toLowerCase() === difficulty.toLowerCase()
    );
  },


  /**
   * Get tours by region
   */
  getToursByRegion: (region) => {
    const tours = DataHelpers.getAllTours();
    return tours.filter(
      (tour) => tour.coordinates.region?.toLowerCase() === region.toLowerCase(),
    );
  },

  /**
   * Get tours by coordinates (within radius)
   */
  getToursByCoordinates: (
    lat,
    lng,
    radiusKm = 50,
  ) => {
    const tours = DataHelpers.getAllTours();
    return tours.filter((tour) => {
      const distance = calculateDistance(
        lat,
        lng,
        tour.coordinates.lat,
        tour.coordinates.lng,
      );
      return distance <= radiusKm;
    });
  },

  /**
   * Get tours near destination
   */
  getToursNearDestination: (
    destinationId,
    radiusKm = 100,
  ) => {
    const destination = DataHelpers.getDestinationById(destinationId);
    if (!destination || !destination.coordinates) return [];

    return DataHelpers.getToursByCoordinates(
      destination.coordinates.lat,
      destination.coordinates.lng,
      radiusKm,
    );
  },

  // ==================== DESTINATION FUNCTIONS ====================

  /**
   * Get all destinations across all regions
   */
  getAllDestinations: () => {
    return navbarCategoriesData.destinations.regions.flatMap(
      (region) => region.destinations,
    );
  },

  /**
   * Get destination by ID
   */
  getDestinationById: (id)=> {
    return DataHelpers.getAllDestinations().find((dest) => dest.id === id);
  },

  /**
   * Get destination by slug
   */
  getDestinationBySlug: (slug)=> {
    return DataHelpers.getAllDestinations().find((dest) => dest.slug === slug);
  },

  /**
   * Get featured destinations
   */
  getFeaturedDestinations: () => {
    return DataHelpers.getAllDestinations().filter((dest) => dest.featured);
  },

  /**
   * Get destinations by type
   */
  getDestinationsByType: (type) => {
    return DataHelpers.getAllDestinations().filter(
      (dest) => dest.type.toLowerCase() === type.toLowerCase()
    );
  },

  /**
   * Get destinations by tag
   */
  getDestinationsByTag: (tag) => {
    return DataHelpers.getAllDestinations().filter(
      (dest) => dest.tag?.toLowerCase() === tag.toLowerCase()
    );
  },

  // ==================== REGION FUNCTIONS ====================

  /**
   * Get all regions
   */
  getAllRegions: ()=> {
    return navbarCategoriesData.destinations.regions;
  },

  /**
   * Get region by ID
   */
  getRegionById: (id)=> {
    return navbarCategoriesData.destinations.regions.find(
      (region) => region.id === id,
    );
  },

  /**
   * Get region by slug
   */
  getRegionBySlug: (slug)=> {
    return navbarCategoriesData.destinations.regions.find(
      (region) => region.slug === slug,
    );
  },

  /**
   * Get destinations by region ID
   */
  getDestinationsByRegionId: (regionId) => {
    const region = navbarCategoriesData.destinations.regions.find(
      (r) => r.id === regionId,
    );
    return region ? region.destinations : [];
  },

  /**
   * Get destinations by region slug
   */
  getDestinationsByRegionSlug: (regionSlug) => {
    const region = navbarCategoriesData.destinations.regions.find(
      (r) => r.slug === regionSlug,
    );
    return region ? region.destinations : [];
  },

  // ==================== FESTIVAL FUNCTIONS ====================

  /**
   * Get all festivals
   */
  getAllFestivals: () => {
    return navbarCategoriesData.festivals.festivals;
  },

  /**
   * Get festival by ID
   */
  getFestivalById: (id)=> {
    return DataHelpers.getAllFestivals().find((festival) => festival.id === id);
  },

  /**
   * Get festival by slug
   */
  getFestivalBySlug: (slug) => {
    return DataHelpers.getAllFestivals().find(
      (festival) => festival.slug === slug,
    );
  },

  /**
   * Get featured festivals
   */
  getFeaturedFestivals: ()=> {
    return DataHelpers.getAllFestivals().filter(
      (festival) => festival.featured,
    );
  },

  /**
   * Get festivals by season
   */
  getFestivalsBySeason: (season) => {
    return DataHelpers.getAllFestivals().filter(
      (festival) => festival.season.toLowerCase() === season.toLowerCase(),
    );
  },

  /**
   * Get festivals by location
   */
  getFestivalsByLocation: (location)=> {
    return DataHelpers.getAllFestivals().filter((festival) =>
      festival.location.toLowerCase().includes(location.toLowerCase()),
    );
  },

  /**
   * Get upcoming festivals (simplified - in real app compare dates)
   */
  getUpcomingFestivals: ()=> {
    return DataHelpers.getAllFestivals().filter(
      (festival) => festival.featured,
    );
  },

  // ==================== BLOG FUNCTIONS ================


  /**
   * Get blog articles by category
   */
 


  // ==================== FEATURED EXPERIENCES FUNCTIONS ====================

  /**
   * Get all featured experiences
   */
  getAllFeaturedExperiences: () => {
    return navbarCategoriesData.featured.experiences;
  },

  /**
   * Get featured experience by slug
   */
  getFeaturedExperienceBySlug: (slug) => {
    return navbarCategoriesData.featured.experiences.find(
      (exp) => exp.slug === slug
    );
  },

  /**
   * Get featured experiences by category
   */
  getFeaturedExperiencesByCategory: (category) => {
    return navbarCategoriesData.featured.experiences.filter(
      (exp) => exp.category.toLowerCase() === category.toLowerCase()
    );
  },

  // ==================== TRAVEL INFO FUNCTIONS ====================

  // ==================== SEARCH FUNCTIONS ====================

  /**
   * Search across all content types
   */
  searchAllContent: (query) => {
    const results = [];
    const searchTerm = query.toLowerCase();

    // Search tours
    DataHelpers.getAllTours().forEach((tour) => {
      if (
        tour.name.toLowerCase().includes(searchTerm) ||
        tour.description.toLowerCase().includes(searchTerm) ||
        tour.highlights.some(h => h.toLowerCase().includes(searchTerm))
      ) {
        results.push({
          resultType: "tour",
          ...tour,
        } );
      }
    });

    // Search destinations
    DataHelpers.getAllDestinations().forEach((destination) => {
      if (
        destination.name.toLowerCase().includes(searchTerm) ||
        destination.description.toLowerCase().includes(searchTerm) ||
        destination.highlights.some(h => h.toLowerCase().includes(searchTerm))
      ) {
        results.push({
          resultType: "destination",
          ...destination,
        } );
      }
    });

    // Search festivals
    DataHelpers.getAllFestivals().forEach((festival) => {
      if (
        festival.name.toLowerCase().includes(searchTerm) ||
        festival.description.toLowerCase().includes(searchTerm) ||
        festival.location.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          resultType: "festival",
          ...festival,
        } );
      }
    });

    // Search featured experiences
    DataHelpers.getAllFeaturedExperiences().forEach((experience) => {
      if (
        experience.name.toLowerCase().includes(searchTerm) ||
        experience.description.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          resultType: "featured",
          ...experience,
        } );
      }
    });

    // Search blog articles
   

    return results;
  },

  /**
   * Get content by slug across all types
   */


  /**
   * Get all slugs for sitemap generation
   */
  getAllSlugs: () => {
    const slugs= [];

    // Tour slugs
    DataHelpers.getAllTours().forEach((tour) => {
      slugs.push({ slug: tour.slug, type: "tour" });
    });

    // Festival slugs
    DataHelpers.getAllFestivals().forEach((festival) => {
      slugs.push({ slug: festival.slug, type: "festival" });
    });

    // Destination slugs
    DataHelpers.getAllDestinations().forEach((destination) => {
      slugs.push({ slug: destination.slug, type: "destination" });
    });

    // Featured experience slugs
    DataHelpers.getAllFeaturedExperiences().forEach((experience) => {
      slugs.push({ slug: experience.slug, type: "featured" });
    });

    // Blog article slugs
  

    // Category slugs
    navbarCategoriesData.tours.categories.forEach((category) => {
      slugs.push({ slug: category.slug, type: "category" });
    });

    // Region slugs
    navbarCategoriesData.destinations.regions.forEach((region) => {
      slugs.push({ slug: region.slug, type: "region" });
    });

  
    return slugs;
  },

  // ==================== FILTER FUNCTIONS ====================

  /**
   * Filter tours by various criteria
   */
  filterTours: (filters)=> {
    let tours = DataHelpers.getAllTours();

    if (filters.category) {
      const categoryTours = DataHelpers.getToursByCategorySlug(filters.category);
      tours = tours.filter(tour => categoryTours.some(ct => ct.id === tour.id));
    }


    return tours;
  },

  /**
   * Filter destinations by various criteria
   */
  filterDestinations: (filters) => {
    let destinations = DataHelpers.getAllDestinations();

    if (filters.region) {
      destinations = destinations.filter(
        dest => dest.coordinates.region?.toLowerCase() === filters.region?.toLowerCase()
      );
    }

    if (filters.type) {
      destinations = destinations.filter(
        dest => dest.type.toLowerCase() === filters.type?.toLowerCase()
      );
    }

    if (filters.tag) {
      destinations = destinations.filter(
        dest => dest.tag?.toLowerCase() === filters.tag?.toLowerCase()
      );
    }

 

    return destinations;
  },

  // ==================== STATISTICS FUNCTIONS ====================

  /**
   * Get comprehensive statistics about all content
   */
  getStatistics: ()=> {
    const allTours = DataHelpers.getAllTours();
    const allDestinations = DataHelpers.getAllDestinations();
    const allFestivals = DataHelpers.getAllFestivals();
 
    return {
      tours: {
        total: allTours.length,
        featured: allTours.filter((t) => t.featured).length,
        categories: navbarCategoriesData.tours.categories.length,
        averageRating:
          allTours.reduce((acc, tour) => acc + tour.rating, 0) /
          (allTours.length || 1),
        totalReviews: allTours.reduce((acc, tour) => acc + tour.reviewCount, 0),
      },
      destinations: {
        total: allDestinations.length,
        featured: allDestinations.filter((d) => d.featured).length,
        regions: navbarCategoriesData.destinations.regions.length,
      },
      festivals: {
        total: allFestivals.length,
        featured: allFestivals.filter((f) => f.featured).length,
      },
     
    };
  },

  /**
   * Get tour statistics
   */
  getTourStats: () => {
    const allTours = DataHelpers.getAllTours();
    const activeTours = allTours.filter(t => t.status === 'active');
    
    return {
      total: allTours.length,
      active: activeTours.length,
      inactive: allTours.filter(t => t.status === 'inactive').length,
      upcoming: allTours.filter(t => t.status === 'upcoming').length,
      featured: allTours.filter(t => t.featured).length,
      avgRating: allTours.reduce((acc, t) => acc + t.rating, 0) / (allTours.length || 1),
      totalBookings: allTours.reduce((acc, t) => acc + (t.bookingsCount || 0), 0),
      categoryDistribution: navbarCategoriesData.tours.categories.reduce((acc, cat) => {
        acc[cat.name] = cat.tours.length;
        return acc;
      }, {} ),
      statusDistribution: {
        active: activeTours.length,
        inactive: allTours.filter(t => t.status === 'inactive').length,
        upcoming: allTours.filter(t => t.status === 'upcoming').length,
      },
      durationDistribution: allTours.reduce((acc, tour) => {
        const days = tour.duration.split(' ')[0];
        acc[days] = (acc[days] || 0) + 1;
        return acc;
      }, {} ),
    };
  },

  /**
   * Get destination statistics
   */
  getDestinationStats: () => {
    const allDestinations = DataHelpers.getAllDestinations();
    
    return {
      total: allDestinations.length,
      active: allDestinations.filter(d => d.status === 'active').length,
      featured: allDestinations.filter(d => d.featured).length,
      unesco: allDestinations.filter(d => d.tag === 'UNESCO').length,
      totalTours: DataHelpers.getAllTours().length,
      totalImages: allDestinations.reduce((acc, d) => acc + (d.images?.length || 0), 0),
      avgRating: allDestinations.reduce((acc, d) => acc + (d.rating || 0), 0) / (allDestinations.length || 1),
      regionDistribution: navbarCategoriesData.destinations.regions.reduce((acc, region) => {
        acc[region.name] = region.destinations.length;
        return acc;
      }, {} ),
      typeDistribution: allDestinations.reduce((acc, dest) => {
        acc[dest.type] = (acc[dest.type] || 0) + 1;
        return acc;
      }, {}),
    };
  },
};

// ==================== DEFAULT EXPORT ====================
// Default export
export default navbarCategoriesData;