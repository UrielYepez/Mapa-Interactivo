const GEOJSON_URL = "https://raw.githubusercontent.com/angelnmara/geojson/master/mexicoHigh.json";
const fmt = new Intl.NumberFormat("es-MX");
const palette = ["#e8f3ee", "#b9ddd0", "#79bca7", "#328f7c", "#145b53"];
const map = L.map("map", { scrollWheelZoom: true }).setView([23.7, -102.2], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let geoLayer = null;
let clusterLayer = null;
let geojsonData = null;
let indicatorData = null;
let selectedFeatureLayer = null;
let selectedState = null;
let currentYear = "2020";
let places = [];

const aliases = {
  "michoacan": "michoacan de ocampo",
  "coahuila": "coahuila de zaragoza",
  "veracruz": "veracruz de ignacio de la llave",
  "estado de mexico": "mexico",
  "mexico": "mexico",
  "cdmx": "ciudad de mexico"
};
function normalize(value) {
  let n = String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  n = n.replace(/\s+/g, " ");
  return aliases[n] || n;
}
function valueFor(name, year) {
  const key = normalize(name);
  const entry = Object.entries(indicatorData.datos).find(([state]) => normalize(state) === key);
  return entry ? entry[1][year] : null;
}
function getName(feature) {
  return feature.properties?.name || feature.properties?.NOMGEO || feature.properties?.name_1 || "Entidad";
}
function getValue(feature) { return valueFor(getName(feature), currentYear); }
function getBreaks(values) {
  const sorted = [...values].sort((a,b)=>a-b);
  return [0.2,0.4,0.6,0.8].map(q => sorted[Math.floor((sorted.length-1)*q)]);
}
function colorFor(value, breaks) {
  if (value == null) return "#d8dddd";
  let index = breaks.findIndex(limit => value <= limit);
  if (index < 0) index = 4;
  return palette[index];
}
function makeLegend(values, breaks) {
  const labels = [
    `Hasta ${fmt.format(breaks[0])}`,
    `${fmt.format(breaks[0]+1)} – ${fmt.format(breaks[1])}`,
    `${fmt.format(breaks[1]+1)} – ${fmt.format(breaks[2])}`,
    `${fmt.format(breaks[2]+1)} – ${fmt.format(breaks[3])}`,
    `Más de ${fmt.format(breaks[3])}`
  ];
  document.getElementById("legend").innerHTML = labels.map((label,i)=>
    `<div class="legend-row"><span class="legend-swatch" style="background:${palette[i]}"></span>${label}</div>`
  ).join("");
  document.getElementById("legendYear").textContent = currentYear;
}
function baseStyle(feature, breaks) {
  return { fillColor: colorFor(getValue(feature), breaks), weight: 1.15, opacity: 1,
    color: "#ffffff", fillOpacity: .86 };
}
function showDetail(name) {
  const row = Object.entries(indicatorData.datos).find(([state]) => normalize(state) === normalize(name));
  if (!row) return;
  selectedState = row[0];
  const [state, data] = row;
  const change = ((data["2020"] - data["2010"]) / data["2010"]) * 100;
  document.getElementById("detailTitle").textContent = state;
  document.getElementById("detailDescription").textContent = "Comparación de la población registrada en los censos de 2010 y 2020.";
  document.getElementById("detail2010").textContent = fmt.format(data["2010"]);
  document.getElementById("detail2020").textContent = fmt.format(data["2020"]);
  document.getElementById("detailChange").textContent = `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
  if (selectedFeatureLayer) selectedFeatureLayer.setStyle({weight:1.15,color:"#fff"});
}
function updateStats() {
  const all = Object.entries(indicatorData.datos).map(([name,data])=>({name,value:data[currentYear]}));
  const total = all.reduce((sum,x)=>sum+x.value,0);
  const largest = [...all].sort((a,b)=>b.value-a.value)[0];
  const smallest = [...all].sort((a,b)=>a.value-b.value)[0];
  document.getElementById("nationalTotal").textContent = fmt.format(total);
  document.getElementById("nationalYear").textContent = `Censo ${currentYear}`;
  document.getElementById("largestState").textContent = largest.name;
  document.getElementById("largestValue").textContent = `${fmt.format(largest.value)} habitantes`;
  document.getElementById("smallestState").textContent = smallest.name;
  document.getElementById("smallestValue").textContent = `${fmt.format(smallest.value)} habitantes`;
}
function renderStates() {
  const values = Object.values(indicatorData.datos).map(x=>x[currentYear]);
  const breaks = getBreaks(values);
  makeLegend(values,breaks);
  if (geoLayer) map.removeLayer(geoLayer);
  geoLayer = L.geoJSON(geojsonData, {
    style: feature => baseStyle(feature,breaks),
    onEachFeature: (feature,layer) => {
      const name = getName(feature);
      const value = getValue(feature);
      layer.bindTooltip(`<div class="state-tooltip"><b>${name}</b><span>${currentYear}: ${value == null ? "Dato no disponible" : fmt.format(value)+" habitantes"}</span></div>`,{sticky:true});
      layer.on("mouseover",()=>{ if(layer !== selectedFeatureLayer) layer.setStyle({weight:2.5,color:"#244c48",fillOpacity:1}); });
      layer.on("mouseout",()=>{ if(layer !== selectedFeatureLayer) geoLayer.resetStyle(layer); });
      layer.on("click",()=>{
        if(selectedFeatureLayer) geoLayer.resetStyle(selectedFeatureLayer);
        selectedFeatureLayer = layer;
        layer.setStyle({weight:3,color:"#173c38",fillOpacity:1});
        showDetail(name);
      });
    }
  }).addTo(map);
  updateStats();
  document.getElementById("mapStatus").textContent = `${geojsonData.features.length} entidades · Población ${currentYear}`;
  if (selectedState) showDetail(selectedState);
}
function addPlaces() {
  clusterLayer = L.markerClusterGroup({showCoverageOnHover:false, maxClusterRadius:45});
  places.forEach(place=>{
    const marker = L.marker([place.lat,place.lng]);
    marker.bindPopup(`<b>${place.nombre}</b><br>${place.tipo}<br><span style="color:#718087">${place.ciudad}</span>`);
    clusterLayer.addLayer(marker);
  });
  if(document.getElementById("placesToggle").checked) map.addLayer(clusterLayer);
}
async function init() {
  try {
    const [geoResponse, indicatorResponse, placesResponse] = await Promise.all([
      fetch(GEOJSON_URL), fetch("data/indicadores.json"), fetch("data/lugares.json")
    ]);
    if(!geoResponse.ok || !indicatorResponse.ok || !placesResponse.ok) throw new Error("No se pudieron cargar los archivos de datos.");
    geojsonData = await geoResponse.json();
    indicatorData = await indicatorResponse.json();
    places = await placesResponse.json();
    renderStates();
    addPlaces();
    document.getElementById("mapStatus").textContent = "32 entidades · Datos censales 2010 y 2020";
    document.getElementById("yearSelect").addEventListener("change",e=>{
      currentYear = e.target.value;
      renderStates();
    });
    document.getElementById("placesToggle").addEventListener("change",e=>{
      if(e.target.checked) map.addLayer(clusterLayer);
      else map.removeLayer(clusterLayer);
    });
    document.getElementById("resetMap").addEventListener("click",()=>{
      map.setView([23.7,-102.2],5);
      document.getElementById("stateSearch").value="";
      if(selectedFeatureLayer && geoLayer) geoLayer.resetStyle(selectedFeatureLayer);
      selectedFeatureLayer=null; selectedState=null;
      document.getElementById("detailTitle").textContent="Selecciona un estado";
      document.getElementById("detailDescription").textContent="Haz clic en cualquier estado del mapa para consultar su población y comparar los dos censos.";
      ["detail2010","detail2020","detailChange"].forEach(id=>document.getElementById(id).textContent="—");
    });
    document.getElementById("stateSearch").addEventListener("keydown",e=>{
      if(e.key!=="Enter") return;
      const query=normalize(e.target.value);
      const found=geojsonData.features.find(f=>normalize(getName(f)).includes(query));
      if(found){
        const layer=geoLayer.getLayers().find(l=>l.feature===found);
        if(layer){map.fitBounds(layer.getBounds(),{maxZoom:7});layer.fire("click");}
      } else showToast("No se encontró esa entidad. Revisa el nombre.");
    });
  } catch(error) {
    console.error(error);
    document.getElementById("mapStatus").textContent="Error al cargar datos";
    showToast("No se pudieron cargar los datos. Revisa tu conexión a Internet y abre el proyecto con Live Server.");
  }
}
let toastTimer;
function showToast(message){
  const toast=document.getElementById("toast");
  toast.textContent=message;toast.classList.add("show");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),3200);
}
init();
