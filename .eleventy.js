const markdownIt = require("markdown-it");
const md = markdownIt({ html: true, linkify: true });

module.exports = function(eleventyConfig) {
  // Markdown filter voor gebruik in templates
  eleventyConfig.addFilter("markdownify", (content) => md.render(content || ""));
  // Limit filter voor Nunjucks
  eleventyConfig.addFilter("limit", function(value, count) {
    if (!Array.isArray(value)) return value;
    return value.slice(0, count);
  });

  // Compact: filter falsy values uit een array (voor schema sameAs e.d.)
  eleventyConfig.addFilter("compact", function(value) {
    if (!Array.isArray(value)) return value;
    return value.filter(v => v != null && v !== "");
  });

  // Strip trailing slash (voor canonical/sitemap site_url)
  eleventyConfig.addFilter("stripTrailingSlash", function(value) {
    if (typeof value !== "string") return value;
    return value.replace(/\/+$/, "");
  });

  // Absolute URL helper: combineer site_url met pad
  eleventyConfig.addFilter("absUrl", function(path, siteUrl) {
    const base = String(siteUrl || "").replace(/\/+$/, "");
    const p = String(path || "");
    return base + (p.startsWith("/") ? p : "/" + p);
  });

  // Kopieer statische bestanden
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/css");

  // Favicons & web app manifest (worden aangeroepen vanuit base.njk)
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/favicon-16x16.png");
  eleventyConfig.addPassthroughCopy("src/favicon-32x32.png");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("src/android-chrome-192x192.png");
  eleventyConfig.addPassthroughCopy("src/android-chrome-512x512.png");
  eleventyConfig.addPassthroughCopy("src/site.webmanifest");

  // Datum filter
  eleventyConfig.addFilter("dateformat", function(date) {
    return new Date(date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' });
  });

  // ISO 8601 datum voor sitemap.xml en schema.org
  eleventyConfig.addFilter("dateToISO", function(date) {
    return new Date(date || Date.now()).toISOString();
  });

  // YYYY-MM-DD voor schema.org datePublished
  eleventyConfig.addFilter("dateISODate", function(date) {
    return new Date(date || Date.now()).toISOString().slice(0, 10);
  });

  // Alleen gepubliceerde posts
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md")
      .filter(post => post.data.published !== false)
      .sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
};
