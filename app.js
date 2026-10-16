// Brazalete Deportivo Inteligente — demo visual con datos simulados.
// Más adelante, las funciones de simulación pueden reemplazarse por datos reales del servidor.

const $ = (id) => document.getElementById(id);
const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const state = {
  pulse: 78, spo2: 98, bodyTemp: 36.6, humidity: 54,
  ambientTemp: 24.8, altitude: 842, pressure: 914,
  range: 12, labels: [], pulse: [], spo2History: [], bodyTempHistory: [],
  humidityHistory: [], ambientTempHistory: []
};

function timeLabel(date = new Date()) {
  return date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
function round(value, decimals = 1) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
function seedHistory() {
  const now = Date.now();
  for (let i = 29; i >= 0; i--) {
    const t = new Date(now - i * 3000);
    state.labels.push(t.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    state.pulse.push(Math.round(74 + Math.sin(i / 3) * 5 + Math.random() * 5));
    state.spo2History.push(Math.min(99, Math.max(95, Math.round(97.5 + Math.sin(i / 4) * 1.1 + Math.random() * 1.2))));
    state.ambientTempHistory.push(round(24 + Math.sin(i / 7) * 1.2 + Math.random() * .5, 1));
    state.humidityHistory.push(Math.round(52 + Math.sin(i / 5) * 4 + Math.random() * 3));
    state.bodyTempHistory.push(round(36.5 + Math.sin(i / 8) * .15 + Math.random() * .1, 1));
  }
}
function pushHistory() {
  state.labels.push(timeLabel());
  state.pulse.push(state.pulse.at(-1) + Math.round((Math.random() - .48) * 5));
  state.pulse[state.pulse.length - 1] = Math.min(125, Math.max(58, state.pulse.at(-1)));
  state.spo2History.push(Math.min(100, Math.max(95, Math.round(state.spo2History.at(-1) + (Math.random() > .7 ? (Math.random() > .5 ? 1 : -1) : 0)))));
  state.ambientTempHistory.push(round(Math.min(31, Math.max(17, state.ambientTempHistory.at(-1) + (Math.random() - .5) * .4)), 1));
  state.humidityHistory.push(Math.min(85, Math.max(25, Math.round(state.humidityHistory.at(-1) + (Math.random() - .5) * 3))));
  state.bodyTempHistory.push(round(Math.min(38, Math.max(35.5, state.bodyTempHistory.at(-1) + (Math.random() - .5) * .1)), 1));
  for (const key of ["labels", "pulse", "spo2History", "ambientTempHistory", "humidityHistory", "bodyTempHistory"]) {
    if (state[key].length > 30) state[key].shift();
  }
  state.pulse = state.pulse.map((v) => Math.min(125, Math.max(58, v)));
  state.spo2 = state.spo2History.at(-1);
  state.pulse = state.pulse;
  state.ambientTemp = state.ambientTempHistory.at(-1);
  state.humidity = state.humidityHistory.at(-1);
  state.bodyTemp = state.bodyTempHistory.at(-1);
}

const commonOptions = {
  responsive: true, maintainAspectRatio: false, animation: { duration: 450 },
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor: "#10182b", borderColor: "rgba(145,165,210,.22)", borderWidth: 1, titleColor: "#eef3ff", bodyColor: "#aebbd7", padding: 10, displayColors: true }
  },
  scales: {
    x: { grid: { color: "rgba(145,165,210,.07)", drawBorder: false }, ticks: { color: "#7785a4", maxTicksLimit: 6, maxRotation: 0, font: { size: 9 } },
      border: { display: false } },
    y: { grid: { color: "rgba(145,165,210,.09)", drawBorder: false }, ticks: { color: "#7785a4", font: { size: 9 } }, border: { display: false } }
  }
};
function gradient(ctx, color) {
  const g = ctx.createLinearGradient(0, 0, 0, 240);
  g.addColorStop(0, color.replace(")", ", .22)").replace("rgb", "rgba"));
  g.addColorStop(1, "rgba(8,13,26,0)");
  return g;
}
function makeDataset(label, data, color, fill = false, yAxisID = "y") {
  return { label, data, borderColor: color, backgroundColor: fill ? color + "18" : "transparent",
    borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, pointHoverBackgroundColor: color,
    tension: .36, fill, yAxisID };
}
let bioChart, envChart, pulseSpark;

function initCharts() {
  const bioCtx = $("bioChart").getContext("2d");
  bioChart = new Chart(bioCtx, {
    type: "line", data: { labels: state.labels, datasets: [
      makeDataset("Pulso (lpm)", state.pulse, css("--cyan"), true, "y"),
      makeDataset("SpO₂ (%)", state.spo2History, css("--violet"), false, "y1")
    ]},
    options: { ...structuredClone(commonOptions), scales: {
      ...structuredClone(commonOptions.scales),
      y: { ...structuredClone(commonOptions.scales.y), suggestedMin: 55, suggestedMax: 125, title: { display: true, text: "lpm", color: "#7c8aa8", font: { size: 9 } } },
      y1: { position: "right", min: 90, max: 100, grid: { drawOnChartArea: false }, ticks: { color: "#7785a4", font: { size: 9 } }, border: { display: false }, title: { display: true, text: "%", color: "#7c8aa8", font: { size: 9 } } }
    }}
  });
  envChart = new Chart($("envChart").getContext("2d"), {
    type: "line", data: { labels: state.labels, datasets: [
      makeDataset("Temperatura (°C)", state.ambientTempHistory, css("--orange"), true, "y"),
      makeDataset("Humedad (%)", state.humidityHistory, css("--green"), false, "y1")
    ]},
    options: { ...structuredClone(commonOptions), scales: {
      ...structuredClone(commonOptions.scales),
      y: { ...structuredClone(commonOptions.scales.y), suggestedMin: 15, suggestedMax: 32, title: { display: true, text: "°C", color: "#7c8aa8", font: { size: 9 } } },
      y1: { position: "right", min: 0, max: 100, grid: { drawOnChartArea: false }, ticks: { color: "#7785a4", font: { size: 9 } }, border: { display: false }, title: { display: true, text: "%", color: "#7c8aa8", font: { size: 9 } } }
    }}
  });
  pulseSpark = new Chart($("pulseSpark").getContext("2d"), {
    type: "line", data: { labels: state.labels.slice(-12), datasets: [makeDataset("Pulso", state.pulse.slice(-12), css("--cyan"), true)] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false, suggestedMin: 55, suggestedMax: 125 } }, elements: { line: { borderWidth: 1.7 }, point: { radius: 0 } } }
  });
  updateCharts();
}
function visibleSlice(arr) { return arr.slice(-state.range); }
function updateCharts() {
  const labels = visibleSlice(state.labels);
  bioChart.data.labels = labels;
  bioChart.data.datasets[0].data = visibleSlice(state.pulse);
  bioChart.data.datasets[1].data = visibleSlice(state.spo2History);
  bioChart.update("none");
  envChart.data.labels = labels;
  envChart.data.datasets[0].data = visibleSlice(state.ambientTempHistory);
  envChart.data.datasets[1].data = visibleSlice(state.humidityHistory);
  envChart.update("none");
  pulseSpark.data.labels = state.labels.slice(-12);
  pulseSpark.data.datasets[0].data = state.pulse.slice(-12);
  pulseSpark.update("none");
}
function renderValues() {
  $("pulseValue").textContent = state.pulse.at(-1);
  $("pulseDelta").textContent = `${state.pulse.at(-1) - state.pulse.at(-2) >= 0 ? "+" : ""}${state.pulse.at(-1) - state.pulse.at(-2)}`;
  $("spo2Value").textContent = state.spo2;
  $("spo2Gauge").textContent = `${state.spo2}%`;
  $("spo2State").textContent = state.spo2 >= 97 ? "Estable" : "Variación demo";
  const gauge = document.querySelector(".gauge");
  gauge.style.background = `conic-gradient(${css("--violet")} 0deg ${state.spo2 * 3.6}deg, rgba(167,139,250,.12) ${state.spo2 * 3.6}deg 360deg)`;
  $("bodyTempValue").textContent = Number(state.bodyTemp).toFixed(1);
  $("bodyTempMarker").style.left = `${Math.min(100, Math.max(0, (state.bodyTemp - 35) / 5 * 100))}%`;
  $("humidityValue").textContent = state.humidity;
  $("humidityBar").style.width = `${state.humidity}%`;
  $("ambientTempValue").textContent = Number(state.ambientTemp).toFixed(1);
  $("altitudeValue").textContent = state.altitude;
  $("pressureValue").textContent = state.pressure;
  $("clock").textContent = timeLabel();
  $("year").textContent = new Date().getFullYear();
}
document.querySelectorAll(".range-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".range-btn").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    state.range = Number(button.dataset.range);
    updateCharts();
  });
});

seedHistory();
initCharts();
renderValues();
setInterval(() => {
  pushHistory();
  renderValues();
  updateCharts();
}, 3000);
setInterval(() => { $("clock").textContent = timeLabel(); }, 1000);
