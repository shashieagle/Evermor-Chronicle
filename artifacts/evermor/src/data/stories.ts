export interface Story {
  slug: string;
  title: string;
  couple: string;
  location: string;
  heroImage: string;
  hasFilm: boolean;
}

export const stories: Story[] = [
  {
    slug: "shaun-sowmya",
    title: "A Second Beginning",
    couple: "Shaun & Sowmya",
    location: "Bangalore, India",
    heroImage: "/beginnings-shaun-sowmya.jpg",
    hasFilm: true,
  },
  {
    slug: "saksham-chitkala",
    title: "The Beginning of Everything",
    couple: "Saksham & Chitkala",
    location: "Jaipur, India",
    heroImage: "/beginnings-saksham-chitkala.jpg",
    hasFilm: true,
  },
  {
    slug: "yamini-chris",
    title: "Two Worlds, One Beginning",
    couple: "Yamini & Chris",
    location: "Goa, India",
    heroImage: "/beginnings-yamini-chris.jpg",
    hasFilm: false,
  },
  {
    slug: "abhigna-sagar",
    title: "A Quiet Promise",
    couple: "Abhigna & Sagar",
    location: "Hyderabad, India",
    heroImage: "/beginnings-abhigna-sagar.jpg",
    hasFilm: true,
  },
  {
    slug: "kaushik-sandhya",
    title: "Where the Light Was Softest",
    couple: "Kaushik & Sandhya",
    location: "Mysore, India",
    heroImage: "/beginnings-kaushik-sandhya.jpg",
    hasFilm: false,
  },
  {
    slug: "sakshi-rajat",
    title: "The Day That Began It All",
    couple: "Sakshi & Rajat",
    location: "Udaipur, India",
    heroImage: "/beginnings-sakshi-rajat.jpg",
    hasFilm: true,
  },
];

export const storiesBySlug = Object.fromEntries(
  stories.map((s) => [s.slug, s])
);
