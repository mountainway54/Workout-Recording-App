const URL =
  "https://script.google.com/macros/s/AKfycbz6K4mVziukDdad0UqS5p3myt6nh3jg57oaJoDyajuj7-5HNJNcT4SyJwautA6AwM2b/exec";

try {
  const a = await fetch(URL, {
    method: "POST",
    body: JSON.stringify({
      action: "getMonthRecords",
      startDate: "2026-04-20", // 這裡放你表裡面有的日期範圍
      endDate: "2026-04-21",
    }),
  });
  const b = await a.json();
  console.log(b);
} catch (err) {
  console.log(err);
}
