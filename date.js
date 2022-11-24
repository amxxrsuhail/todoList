module.exports = getDate;

function getDate() {
  let today = new Date();
  let dayName = today.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return dayName;
}
