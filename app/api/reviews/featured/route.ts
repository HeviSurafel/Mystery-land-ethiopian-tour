import { NextRequest, NextResponse } from 'next/server';

// Real review data from your TripAdvisor page
const reviews = [
  {
    id: "1",
    name: "Tom G",
    location: "Evansville, Indiana",
    rating: 5,
    date: "2025-02-15",
    tour: "3 Day Omo Valley Tour",
    title: "Trip of a lifetime",
    content: "I went on a 3 day tour with We Travel Ethiopia Tours in February this year. The tour was from Jinka to Omerate with two nights in Turmi. I was alone with Abel , the owner, and a driver so I got excellent information and attention. I shopped around before going and came to the conclusion that using a tour company based in Jinka makes sense, economically and logistically. Most of the ads I saw on the big sites were brokers in Addis Ababa who were simply doubling the price and acting as middlemen for operators in Jinka. Just go straight to the source. We Travel Ethiopia Tours is a great option. We visited a Saturday Hammer people market, Hammer village, crossed Omo river to visit a danesh village, went to a caro village and a small Mursi village. Abel  knows all of the chiefs as he grew up in the area and really delivers a safe and thorough Omo experience on a reasonable budget.",
    platform: "TripAdvisor",
    helpful: 12,
    reply: {
      content: "Dear Tom, I am very pleased to hear that me and my team made your stay pleasant. Thank you very much for taking your precious time to recommend us and sharing your experience with other travelers. It's really a pleasure to have you here in my beautiful country! and you guys Where most favorite, very responsible, ethical, and friendly travellers that i met in a recent time. I have honestly learned so many things from you. We shared some really wonderful moments together. Thank you for letting me take the initiative and working for you, I'm happy to serve clients like you. Hope to see you again for another wonderful experience!!",
      date: "2025-03-18"
    }
  },
  {
    id: "2",
    name: "Denise L",
    location: "Hong Kong, China",
    rating: 5,
    date: "2025-08-15",
    tour: "3 Day Omo Valley Trip",
    title: "Exceeded my expectations",
    content: "We were so lucky to have chosen We Travel Ethiopia Tours for our 3 days trip to the omo valley!! Abel  was incredibly reliable and responsive. He went above and beyond to accommodate our requests and even recommended some fantastic attractions. We were very pleased with our meals and accommodations. Abel  accompanied us to each tribe and provided detailed explanations, giving us complete confidence in his itinerary. We were thrilled to visit so many different tribes in just three days and created many precious memories! I love the Daasanach! We highly recommend We Travel Ethiopia Valley Tours!",
    platform: "TripAdvisor",
    helpful: 8,
    reply: {
      content: "Dear Denise, Thank you for your lovely feedback! it genuinely warmed my heart. more than that, I truly value the connection we've made, it's been an absolute joy to develop a genuine relations with you beyond just being a customer. It's a true pleasure to get to know you, and i am so glad that i was able to make a positive difference in your trip. I'm already excited to catch up with you again for another adventure! warmly, Abel ",
      date: "2025-09-13"
    }
  },
  {
    id: "3",
    name: "阿凯",
    location: "Samarkand, Uzbekistan",
    rating: 5,
    date: "2025-04-05",
    tour: "Solo Cultural Tour",
    title: "Highly recommended",
    content: "It was a very good experience. In fact, there was a conflict among the Mursi people, but I could still see it. The tour guide helped me explain and learned more about this place. He treated me to a hamburger and sent me to the airport for free. The experience was very good. I will definitely recommend my Chinese friends to come here!",
    platform: "TripAdvisor",
    helpful: 6,
    reply: {
      content: "dear Kai, I am very pleased to hear that me and my team made your stay pleasant. Thank you very much for taking your precious time to recommend us and sharing your experience with other travelers I'm happy that you enjoyed your time with my tribes and the service that i offerd through my local knowledge and connections. you're very experienced YouTuber and i jave learn so much from you too. looking forward to seeing you again! thanks buddy.🙏 Abel ",
      date: "2025-04-11"
    }
  },
  {
    id: "4",
    name: "Raise C",
    location: "United States",
    rating: 5,
    date: "2025-08-20",
    tour: "3-day / 2-night cultural journey",
    title: "Wonderful 3-day / 2-night cultural journey with Abel ",
    content: "Where do I start, there were too many good things to describe. We booked a 3-day, 2-night tour to visit the Mursi, Karo, Hamar, Bana and Dassench tribes and it was truly unforgettable. From the start Abel  stood out: he offered a very clear, well-thought itinerary (the first reason we chose him), and importantly straight, honest pricing (the second reason). No haggling tricks, no hidden fees, just straightforward communication. That alone made us feel confident booking him while we were chatting with several other agencies. The itinerary was extremely fruitful and Abel  did his best to slot in local events to maximise our experience. He provided a local tribe guide for every visit, so at each stop you had both Abel  and a tribe guide walking with you, which made introductions and cultural exchange rich and respectful.",
    platform: "TripAdvisor",
    helpful: 15,
    reply: {
      content: "Dear Raise, I don' know what to say! thank you so much for taking the time to write such a truly wonderful and heartwarming recommendations. i'm so happy to hear that your visit to the tribes was unforgettable. It was an absolute pleasure guiding you on our 3 day cultural journey to the omo valley. I greatly appreciate you highlighting the upfront aspects of the service. I always aim for clear communication and reasonable pricing and I'm glad that i stood out and made your decision easy, and this gave you the confidence to book with me. I believe in being transparent every step of the way. your feedback on the guiding approach is very valuable. providing a local tribe guide at every stop is essential for me, as it ensures the cultural exchange is always as rich and respectful as possible, and it's wonderful to know you felt that difference. look forward to welcoming you back to Ethiopia someday! Best wishes, Abel ",
      date: "2025-09-26"
    }
  },
  {
    id: "5",
    name: "Hope C",
    location: "United States",
    rating: 4,
    date: "2025-12-15",
    tour: "3D/2N stay",
    title: "Thank you!",
    content: "For a very affordable 3D/2N stay, even though there wasn't much scheduled, we had a relaxing time and enjoyed a nice introduction to the country before our main trip. Unfortunately, Abel  was not our tour guide.",
    platform: "TripAdvisor",
    helpful: 3,
    reply: {
      content: "Dear Hope, Thank you so much for taking your time to share your feedback!. once again we would like to apologize regarding the two attractions we missed, we want to sincerely apologize again. we tried our very best to make them happen, but the recent demonstrations in the oromia region created safety concerns that we couldn't ignore. your safety and well being are always our top priorities, and we felt it was best not to take any risks. we truly hope to have the opportunity to welcome you back in the future so we can finally show you those beautiful places under better circumstances. We wish you all the best in your travels and hope to see you again soon! warm regards, Abel  and Melak",
      date: "2026-01-18"
    }
  },
  {
    id: "6",
    name: "Roland K",
    location: "Germany",
    rating: 5,
    date: "2024-11-10",
    tour: "Omo Valley Tour",
    title: "Epic stay in the Omo valley",
    content: "It might feel a bit overwhelming when it comes to organising your tour in the Omo valley as there are a lot of companies you can book it with. My experience with We Travel Ethiopia Tours was beyond expectations. Abel  - the owner - is an experienced guide who has been working in this area for many years. He has good connections with local people of the tribes who speak well English and can give you a good explanation of the way of life. He will adjust the tour according to your expectations. He is also very humble and smart so you can have nice conversations with him. The Omo valley is not just about visiting tribes and experiencing the unique nature. It's also about spending evenings together and time in the car while travelling to different villages. I can honestly say I am leaving Jinka with a good friend.",
    platform: "TripAdvisor",
    helpful: 10,
    reply: null
  }
];

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '6');
    const featured = searchParams.get('featured') === 'true';

    let filteredReviews = [...reviews];

    // Sort by date (newest first)
    filteredReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Limit results
    filteredReviews = filteredReviews.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: filteredReviews,
      total: reviews.length
    });

  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}