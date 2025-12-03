import { useEffect } from "react";

export default function Seo({ title, description }) {
  useEffect(() => {
    if (title) {
      document.title = title;
      const ogTitle = getOrCreateMeta("property", "og:title");
      ogTitle.setAttribute("content", title);
    }

    if (description) {
      const metaDesc = getOrCreateMeta("name", "description");
      metaDesc.setAttribute("content", description);

      const ogDesc = getOrCreateMeta("property", "og:description");
      ogDesc.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
}

function getOrCreateMeta(key, value) {
  let tag = document.head.querySelector(`meta[${key}="${value}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(key, value);
    document.head.appendChild(tag);
  }
  return tag;
}
