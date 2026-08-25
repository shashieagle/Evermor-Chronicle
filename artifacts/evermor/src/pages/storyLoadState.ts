export type StoryLoadStatus = "loading" | "ready" | "error";

/**
 * A story may render only when its response belongs to the active route.
 * This prevents a previously loaded story from flashing during navigation.
 */
export function isStoryReadyForSlug(
  status: StoryLoadStatus,
  loadedSlug: string | null,
  currentSlug: string | undefined,
): boolean {
  return status === "ready" && currentSlug !== undefined && loadedSlug === currentSlug;
}