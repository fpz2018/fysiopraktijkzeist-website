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

  // Kopieer statische bestanden
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Datum filter
  eleventyConfig.addFilter("dateformat", function(date) {
    return new Date(date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' });
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
