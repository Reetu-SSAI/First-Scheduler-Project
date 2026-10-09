// A day as the API expects it ("YYYY-MM-DD"): daysAgo(0) = today, daysAgo(1) = yesterday (UTC)
function daysAgo(days) {
  const day = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return day.toISOString().slice(0, 10);
}

module.exports = daysAgo;
