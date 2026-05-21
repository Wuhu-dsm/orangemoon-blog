import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
  "b",
  "a",
];

const IGNORED_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

export function useOwnerLoginEasterEgg() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let buffer: string[] = [];

    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName;

      if (tagName && IGNORED_TAGS.has(tagName)) {
        return;
      }

      const key = event.key;

      // 只记录方向键和 b/a
      if (
        !key.startsWith("Arrow") &&
        key !== "b" &&
        key !== "a" &&
        key !== "B" &&
        key !== "A"
      ) {
        buffer = [];
        return;
      }

      buffer.push(key);

      if (buffer.length > KONAMI_SEQUENCE.length) {
        buffer = buffer.slice(-KONAMI_SEQUENCE.length);
      }

      if (
        buffer.length === KONAMI_SEQUENCE.length &&
        buffer.every((k, i) => k === KONAMI_SEQUENCE[i])
      ) {
        const returnTo = `${location.pathname}${location.search}`;
        navigate(`/owner-login?returnTo=${encodeURIComponent(returnTo)}`);
        buffer = [];
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [location.pathname, location.search, navigate]);
}
