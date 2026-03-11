const officialData = {
  year: 2024,
  appeared: 2333297,
  registered: 2406079,
  qualified: 1315853,
  maxScore: 720,
  sourceNote: "NTA official result bulletin and counselling notifications"
};

const stats = [
  ["Registered", officialData.registered.toLocaleString("en-IN")],
  ["Appeared", officialData.appeared.toLocaleString("en-IN")],
  ["Qualified", officialData.qualified.toLocaleString("en-IN")],
  ["Highest Score", `${officialData.maxScore}/720`]
];

const statsGrid = document.getElementById("stats-grid");
stats.forEach(([label, value]) => {
  const card = document.createElement("article");
  card.className = "stat";
  card.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
  statsGrid.appendChild(card);
});

function estimateRank(marks, candidatesAppeared) {
  const ratio = Math.max(0, Math.min(1, marks / 720));
  const competitionCurve = Math.pow(1 - ratio, 2.15);
  return Math.max(1, Math.round(1 + competitionCurve * (candidatesAppeared - 1)));
}

document.getElementById("predictor-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const marks = Number(document.getElementById("marks").value);
  const customCandidates = Number(document.getElementById("candidates").value);
  const candidates = Number.isFinite(customCandidates) && customCandidates > 0
    ? customCandidates
    : officialData.appeared;

  const predictedRank = estimateRank(marks, candidates);
  const topBand = Math.max(1, Math.round(predictedRank * 0.9));
  const lowBand = Math.round(predictedRank * 1.1);

  document.getElementById("result").innerHTML = `
    <strong>Estimated AIR:</strong> ${predictedRank.toLocaleString("en-IN")}<br>
    <strong>Likely range:</strong> ${topBand.toLocaleString("en-IN")} - ${lowBand.toLocaleString("en-IN")}<br>
    <small>Projection calibrated to NEET UG ${officialData.year} participation volume.</small>
  `;
});
