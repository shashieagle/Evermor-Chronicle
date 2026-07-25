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
      "There are weddings that feel like performances, and there are weddings that feel like a breath held for a very long time — finally released. Shaun and Sowmya's was the latter. In the warmth of a Bangalore afternoon, surrounded by people who had watched them separately become who they were, they chose each other. Quietly. Completely.",
    pause: "Some beginnings arrive without fanfare. They simply settle — like light through a window you forgot you'd left open.",
    reflection:
      "What stays, long after the flowers are pressed and the music has faded, is the weight of a hand held for the first time as husband and wife. The ceremony ends. The story begins.",
  },
  {
    slug: "saksham-chitkala",
    title: "The Beginning of Everything",
    couple: "Saksham & Chitkala",
    location: "Jaipur, India",
    heroImage: "/saksham-chitkala-1.jpg",
    photo2: "/saksham-chitkala-2.jpg",
    hasFilm: true,
    narrative:
      "Jaipur holds its celebrations differently to other cities. There is a grandeur in its stones, a memory in its arches that makes every moment feel older than it is — as if the walls themselves have been waiting. Saksham and Chitkala married in that weight, and carried it lightly.",
    pause: "To begin everything is to accept that nothing that came before was wasted. Every chapter led precisely here.",
    reflection:
      "The last guests will leave. The garlands will dry. But the light that fell that afternoon — the way it caught the gold in her dupatta as she turned — that does not go anywhere. We made sure of it.",
  },
  {
    slug: "yamini-chris",
    title: "Two Worlds, One Beginning",
    couple: "Yamini & Chris",
    location: "Goa, India",
    heroImage: "/beginnings-yamini-chris.jpg",
    photo2: "/b-yamini-chris-2.jpg",
    hasFilm: false,
    narrative:
      "The sea does not ask where you are from. It receives you the same way regardless. Yamini and Chris married where the land ends and the water begins — a threshold that felt entirely fitting for two people building something new from the best of two different worlds.",
    pause: "Love that crosses distance does not arrive easily. Which is why, when it arrives, it arrives knowing exactly what it is.",
    reflection:
      "They walked back from the water as the last light left the sky. Not toward anything finished — toward everything that was just beginning. The horizon, behind them now, felt like a promise kept.",
  },
  {
    slug: "abhigna-sagar",
    title: "A Quiet Promise",
    couple: "Abhigna & Sagar",
    location: "Hyderabad, India",
    heroImage: "/beginnings-abhigna-sagar.jpg",
    photo2: "/b-abhigna-sagar-2.jpg",
    hasFilm: true,
    narrative:
      "The most enduring promises are rarely the loudest. They are spoken in the small pauses between rituals — in a look held a moment longer than necessary, in a hand that finds another without needing to search. Abhigna and Sagar made their promises in Hyderabad, in the old way, surrounded by the scent of marigolds and sandalwood.",
    pause: "A quiet promise is not a small one. It is simply one that does not need an audience.",
    reflection:
      "What the photographs will show their children, and their children's children, is not the ceremony. It is the stillness within it. The way two people can be in an ancient ritual and simultaneously in a world entirely their own.",
  },
  {
    slug: "kaushik-sandhya",
    title: "Where the Light Was Softest",
    couple: "Kaushik & Sandhya",
    location: "Mysore, India",
    heroImage: "/beginnings-kaushik-sandhya.jpg",
    photo2: "/b-kaushik-sandhya-2.jpg",
    hasFilm: false,
    narrative:
      "Mysore in the late afternoon holds a particular quality of light — amber and unhurried, the kind that makes everything it touches look like it has always been there. Kaushik and Sandhya chose this light for their beginning, and the light, in return, was generous with them.",
    pause: "The softest light reveals the most. It asks nothing of the face — only that it be present.",
    reflection:
      "There will be other evenings in Mysore. Other amber light falling on other courtyards. But this one belonged entirely to them — and now, forever, it still does.",
  },
  {
    slug: "sakshi-rajat",
    title: "The Day That Began It All",
    couple: "Sakshi & Rajat",
    location: "Udaipur, India",
    heroImage: "/beginnings-sakshi-rajat.jpg",
    photo2: "/b-sakshi-rajat-2.jpg",
    hasFilm: true,
    narrative:
      "Udaipur is a city built on the edge of water, its palaces reflected in lakes that have no bottom you can find. It is a place that understands permanence — and impermanence — in equal measure. Sakshi and Rajat married here, at the hour when the city glows, and the water holds the sky.",
    pause: "Some days become the axis around which an entire life quietly turns. You do not always know which day it is — until you look back.",
    reflection:
      "The veil caught the wind on the rooftop, just once, and for a moment it looked like the beginning of something much larger than a wedding. It was. Every photograph we made that day is evidence of exactly that.",
  },
];

export const storiesBySlug = Object.fromEntries(
  stories.map((s) => [s.slug, s])
);
