const fs = require("fs");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt = "", sizes = "(min-width: 800px) 800px, 100vw") {
  if(!src) return "";
  const metadata = await Image(src, {
    widths: [480, 800, 1200],
    formats: ["avif", "webp", "jpeg"],
    urlPath: process.env.PATH_PREFIX ? process.env.PATH_PREFIX + "img/" : "/img/",
    outputDir: "_site/img/"
  });
  const imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async"
  };
  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function(eleventyConfig) {
  // Static passthrough
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });

  // Site metadata access (index.json)
  eleventyConfig.addCollection("siteMeta", () => {
    const raw = fs.readFileSync("./index.json", "utf8");
    return JSON.parse(raw);
  });

  // Canonical content collections
  const byDateDesc = (a, b) => (new Date(b.date) - new Date(a.date));
  eleventyConfig.addCollection("modulesCol", (api) =>
    api.getFilteredByGlob("content/modules/*.md").sort(byDateDesc)
  );
  eleventyConfig.addCollection("essaysCol", (api) =>
    api.getFilteredByGlob("content/essays/*.md").sort(byDateDesc)
  );
  eleventyConfig.addCollection("publicationsCol", (api) =>
    api.getFilteredByGlob("content/publications/*.md").sort(byDateDesc)
  );
  eleventyConfig.addCollection("residenciesCol", (api) =>
    api.getFilteredByGlob("content/residencies/*.md").sort(byDateDesc)
  );

  // Tags
  eleventyConfig.addCollection("tagList", (api) => {
    const tags = new Set();
    api.getAll().forEach(i => (i.data.tags || []).forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  });

  // Filters
  eleventyConfig.addFilter("abstract60", (s = "") => s.length <= 360 ? s : s.slice(0,357) + "…");

  // Shortcodes
  eleventyConfig.addNunjucksAsyncShortcode("labImage", imageShortcode);

  // Plugins
  eleventyConfig.addPlugin(pluginRss);

  return {
    dir: { input: "site", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
    pathPrefix: process.env.PATH_PREFIX || "/the-pedagogy-lab/"
  };
};
