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
];

export const storiesBySlug = Object.fromEntries(
  stories.map((s) => [s.slug, s])
);
