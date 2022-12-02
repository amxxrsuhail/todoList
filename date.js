module.exports = getDate;

function getDate() {
  let today = new Date();
  let dayName = today.toLocaleString("en-US", {
    weekday: "long",
  });
  return dayName;
}