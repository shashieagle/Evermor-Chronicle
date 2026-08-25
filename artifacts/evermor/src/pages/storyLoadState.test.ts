import assert from "node:assert/strict";
import test from "node:test";
import { isStoryReadyForSlug } from "./storyLoadState";

test("does not render a previous story while the route changes", () => {
  assert.equal(
    isStoryReadyForSlug("ready", "shaun-sowmya", "saksham-chitkala"),
    false,
  );
});

test("renders only after the active story response is ready", () => {
  assert.equal(
    isStoryReadyForSlug("ready", "saksham-chitkala", "saksham-chitkala"),
    true,
  );
  assert.equal(
    isStoryReadyForSlug("loading", "saksham-chitkala", "saksham-chitkala"),
    false,
  );
});