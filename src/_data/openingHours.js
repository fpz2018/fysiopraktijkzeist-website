const hours = require("./hours.json");

const dayMap = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday"
};

function parseRange(str) {
  if (!str || typeof str !== "string") return null;
  const m = str.replace(/–/g, "-").match(/(\d{1,2})[:.]?(\d{2})?\s*-\s*(\d{1,2})[:.]?(\d{2})?/);
  if (!m) return null;
  const pad = n => String(n).padStart(2, "0");
  return {
    opens: `${pad(parseInt(m[1], 10))}:${pad(parseInt(m[2] || "0", 10))}`,
    closes: `${pad(parseInt(m[3], 10))}:${pad(parseInt(m[4] || "0", 10))}`
  };
}

module.exports = Object.entries(dayMap)
  .map(([key, day]) => {
    const r = parseRange(hours[key]);
    return r ? { day, opens: r.opens, closes: r.closes } : null;
  })
  .filter(Boolean);
