const fs = require("fs");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({"assets": "assets"});
  eleventyConfig.addCollection("indexData", () => {
    const raw = fs.readFileSync("./index.json","utf8");
    return JSON.parse(raw);
  });

  eleventyConfig.addFilter("abstract60", (s="") => s.length <= 360 ? s : s.slice(0,357)+"…");

  return {
    dir: { input: "site", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"]
  };
};
