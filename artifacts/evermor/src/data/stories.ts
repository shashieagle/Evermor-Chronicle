export interface Story {
  slug: string;
  title: string;
  couple: string;
  location: string;
  heroImage: string;
  photo2: string;
  photos?: string[];   // full gallery — falls back to cycling heroImage + photo2
  hasFilm: boolean;
  narrative: string;
  pause: string;
  reflection: string;
}

const PUBLIC_STORY_ORDER = [
  "saksham-chitkala",
  "yamini-chris",
  "sakshi-rajat",
  "kaushik-sandhya",
  "shaun-sowmya",
];

export const stories: Story[] = [
  {
    slug: "shaun-sowmya",
    title: "A Second Beginning",
    couple: "Shaun & Sowmya",
    location: "Bangalore, India",
    heroImage: "/beginnings-shaun-sowmya.jpg",
    photo2: "/b-shaun-sowmya-2.jpg",
    hasFilm: true,
    narrative:
      "Every beginning carries a story, but not all stories begin the same way. Some arrive in familiar ways, while others unfold only after life has already written a few chapters. When Shaun and Sowmya chose to marry, they weren't simply planning a wedding—they were bringing together two lives, two cultures, and a future that had already begun to take shape long before the first ritual was performed.\n\n",
    pause: "There was joy, there was tenderness, and there was the quiet understanding that this celebration wasn't just about two people finding one another. It was about a family finding its beginning. Some stories remind us that love doesn't always arrive first. Sometimes, it arrives again.",
    reflection:
      "Some beginnings arrive without fanfare. They simply settle — like light through a window you forgot you'd left open. What stays, long after the flowers are pressed and the music has faded, is the weight of a hand held for the first time as husband and wife. The ceremony ends. The story begins.",
  },
  {
    slug: "saksham-chitkala",
    title: "Art, rain and quiet intimacy",
    couple: "Saksham & Chitkala",
    location: "Bangalore, India",
    heroImage: "/saksham-chitkala-1.jpg",
    photo2: "/saksham-chitkala-2.jpg",
    hasFilm: true,
    narrative:
      "Some beginnings happen because two people happen to meet. Others begin a little earlier, in a way neither of them could have planned. Saksham and Chitkala first crossed paths through an Airbnb experience with Saksham's parents. They liked her almost immediately — enough to go home and tell their son about her. What began as a passing introduction slowly became a conversation, then a friendship, and eventually something neither of them could quite ignore.",
    pause: "Chitkala is an artist, endlessly curious and wonderfully alive to the world around her; Saksham is a technologist, someone who spends his days making sense of systems and solving problems. Somewhere between those two worlds, they found something that made perfect sense only to them.",
    reflection:
      "By the time they stood together on their wedding day, the story had already travelled a long way — from a chance encounter with his parents to two people choosing, quite deliberately, to build a life together.",
  },
  {
    slug: "yamini-chris",
    title: "Two Worlds, One Beginning",
    couple: "Yamini & Chris",
    location: "Bangalore, India",
    heroImage: "/beginnings-yamini-chris.jpg",
    photo2: "/b-yamini-chris-2.jpg",
    hasFilm: false,
    narrative:
      "Somewhere between India and Switzerland, Yamini and Chris found a place that was entirely their own. Yamini, a journalist and storyteller, brought a strong sense of intention to every part of their wedding — even choosing an all-women team to be part of the day.",
    pause: "There was the quietness of a muhurtham in the morning, followed by the complete opposite by evening: music, cocktails, and a room full of people celebrating loudly.",
    reflection:
      "Two cultures, two continents, and two very different energies came together in one wonderfully personal beginning.",
  },
  {
    slug: "abhigna-sagar",
    title: "A Quiet Promise",
    couple: "Abhigna & Sagar",
    location: "Bnaglore , India",
    heroImage: "/beginnings-abhigna-sagar.jpg",
    photo2: "/b-abhigna-sagar-2.jpg",
    hasFilm: true,
    narrative:
      "Somewhere in Bengaluru, in a place where people came to slow down and find a little stillness, Abhigna and Sagar found each other. Both deeply connected to their practice and to the teachings of Sri Sri Ravi Shankar, their story began quietly, long before wedding plans or celebrations entered the picture.",
    pause: "She comes from a Gujarati family, he from a Punjabi one, and today they call Dubai home.",
    reflection:
      "Their wedding brought all those different worlds together, but at its heart, it felt much like the beginning itself — quiet, grounded, and deeply intentional.",
  },
  {
    slug: "kaushik-sandhya",
    title: "Here, We Begin",
    couple: "Meghana & Vijay",
    location: "Mysore, India",
    heroImage: "/beginnings-kaushik-sandhya.jpg",
    photo2: "/b-kaushik-sandhya-2.jpg",
    hasFilm: false,
    narrative:
      "Meghana spends much of her life looking at people through a camera — noticing the quiet gestures, fleeting expressions and little moments that might otherwise go unseen. But on this particular day, she wasn't behind the lens. She was the one being photographed, surrounded by the people and moments that mattered most to her.",
    pause: "With Vijay beside her, the person who is so used to observing other people's stories found herself at the centre of one of her own.",
    reflection:
      "Perhaps that is what made their beginning feel especially intimate — for once, Meghana didn't have to look for the moment. She simply had to live it.",
  },
  {
    slug: "sakshi-rajat",
    title: "A Story of Their Own",
    couple: "Sakshi & Rajat",
    location: "Noida, India",
    heroImage: "/beginnings-sakshi-rajat.jpg",
    photo2: "/b-sakshi-rajat-2.jpg",
    hasFilm: true,
    narrative:
      "Some people are naturally drawn to stories. Sakshi has spent her life making films, while Rajat loves creating experiences that bring people together. Perhaps it was only fitting that, somewhere along the way, they found themselves becoming a story of their own.",
    pause: "She comes from a Haryanvi family; he grew up in Delhi, and somewhere between their different worlds, they found a way of seeing life together.",
    reflection:
      "Their wedding felt less like the beginning of something entirely new and more like two already-full lives making room for one another.",
  },
].filter((story) => story.slug !== "abhigna-sagar")
  .sort((a, b) =>
    PUBLIC_STORY_ORDER.indexOf(a.slug) - PUBLIC_STORY_ORDER.indexOf(b.slug)
  );

export const storiesBySlug = Object.fromEntries(
  stories.map((s) => [s.slug, s])
);
