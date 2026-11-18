
// 1. Initialize globe
const world = Globe()
  .backgroundColor('#0a0a0c')
  .showAtmosphere(false)
  .showGraticules(false)
  (document.getElementById('globe'));

// 2. Configure the globe's built-in sphere material
const sphereMaterial = world.globeMaterial();
sphereMaterial.color.set('#212121');
sphereMaterial.transparent = true;
sphereMaterial.opacity = 0.0;
sphereMaterial.depthWrite = false;

// 3. Helper to extract lines and attach their style config directly
function extractLines(geojson, cfg) {
  if (!geojson || !geojson.features) return [];
  return geojson.features.flatMap(f => {
    if (!f.geometry) return [];
    const coordsList =
      f.geometry.type === 'LineString' ? [f.geometry.coordinates] :
      f.geometry.type === 'MultiLineString' ? f.geometry.coordinates : [];
    return coordsList.map(coords => ({
      cfg,
      // Embed the layer's altitude directly as the 3rd value [lng, lat, alt] of each point
      coords: coords.map(p => [p[0], p[1], cfg.altitude])
    }));
  });
}

// 4. Automatically fetch and render every layer defined in layers.js
Promise.all(
  Object.values(LAYERS).map(cfg =>
    fetch(cfg.file)
      .then(res => res.json())
      .then(geojson => extractLines(geojson, cfg))
  )
).then(results => {
  const allLines = results.flat();

  world
    .pathsData(allLines)
    .pathPoints(d => d.coords)
    .pathPointLat(p => p[1])
    .pathPointLng(p => p[0])
    .pathPointAlt(p => p[2])
    .pathColor(d => d.cfg.visible ? d.cfg.color : 'rgba(0,0,0,0)')
    .pathStroke(d => d.cfg.stroke);
});

// 5. Connect transparency slider
document.getElementById('opacitySlider').addEventListener('input', (e) => {
  sphereMaterial.opacity = parseFloat(e.target.value);
});

// 6. Generate layer toggle checkboxes automatically from layers.js
const togglesContainer = document.getElementById('layerToggles');

Object.values(LAYERS).forEach(cfg => {
  const label = document.createElement('label');
  label.className = 'layer-toggle';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = cfg.visible;

  const swatch = document.createElement('span');
  swatch.className = 'layer-swatch';
  swatch.style.backgroundColor = cfg.color;

  const text = document.createElement('span');
  text.textContent = cfg.name;

  checkbox.addEventListener('change', (e) => {
    cfg.visible = e.target.checked;
    // Re-trigger pathColor so Globe.gl immediately updates visibility
    world.pathColor(d => d.cfg.visible ? d.cfg.color : 'rgba(0,0,0,0)');
  });

  label.append(checkbox, swatch, text);
  togglesContainer.appendChild(label);
});