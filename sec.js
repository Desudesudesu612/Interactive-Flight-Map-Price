d3.json("world.json").then((world) => {
  // Assuming 'data' contains GeoJSON features
  console.log(world);
  const outline = { type: "Sphere" };

  const graticule = d3.geoGraticule10();

  const land = topojson.feature(world, world.objects.land);

  const borders = topojson.mesh(
    world,
    world.objects.countries,
    (a, b) => a !== b
  );
  const projection = d3.geoEqualEarth();

  const path = d3.geoPath(projection);
  const map = htl.html`<svg viewBox="0 0 ${500} ${500}" style="display: block;">
    <path d="${path(outline)}" fill="#fff"></path>
    <path d="${path(graticule)}" stroke="#ccc" fill="none"></path>
    <path d="${path(land)}"></path>
    <path d="${path(borders)}" fill="none" stroke="#fff"></path>
    <path d="${path(outline)}" fill="none" stroke="#000"></path>
</svg>`;
});
