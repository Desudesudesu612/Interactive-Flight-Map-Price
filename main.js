// Dimensionality of the map
const width = 1000;
const height = 500;

const svg = d3
  .select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const projection = d3
  .geoMercator()
  .scale(150) // Adjust for zoom level
  .translate([width / 2, height / 2]); // Center map on the canvas

const path = d3.geoPath().projection(projection);

// Add the outline of the globe
const outline = { type: "Sphere" };

svg
  .append("path")
  .datum(outline)
  .attr("d", path)
  .attr("fill", "none") // No fill for the outline
  .attr("stroke", "#000") // Black stroke
  .attr("stroke-width", 1.5); // Adjust stroke width

// Add the graticule (the latitudes and longitudes)
const graticule = d3.geoGraticule10();
svg
  .append("path")
  .datum(graticule)
  .attr("d", path)
  .attr("fill", "none") // No fill for the outline
  .attr("stroke", "#ccc") // grey
  .attr("stroke-width", 1.0); // Adjust stroke width

// Load TopoJSON data
d3.json("countries-50m.json")
  .then((world) => {
    // Convert TopoJSON to GeoJSON
    const land = topojson.feature(world, world.objects.land);

    // Draw the land feature
    svg
      .append("path")
      .datum(land)
      .attr("d", path)
      .attr("fill", "#d3d3d3") // Land fill color
      .attr("stroke", "none"); // No border for the land

    // Optionally, draw country borders if available
    if (world.objects.countries) {
      const countries = topojson.feature(world, world.objects.countries);

      svg
        .selectAll("path.countries")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("class", "countries")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-width", 0.5); // Country borders
    }
    // const borders = topojson.mesh(
    //   world,
    //   world.objects.countries,
    //   (a, b) => a !== b
    // );
    // svg
    //   .append("path")
    //   .datum(borders)
    //   .attr("d", path)
    //   .attr("fill", "none")
    //   .attr("stroke", "#000")
    //   .attr("stroke-width", 1.0);
  })
  .catch((error) => console.error("Error loading TopoJSON:", error));

const zoom = d3
  .zoom()
  .scaleExtent([1, 8]) // Zoom limits
  .on("zoom", (event) => {
    svg.selectAll("path, circle").attr("transform", event.transform);
  });

svg.call(zoom);

svg
  .selectAll("path")
  .on("mouseover", function () {
    d3.select(this).attr("fill", "#ffcc00");
  })
  .on("mouseout", function () {
    d3.select(this).attr("fill", "#d3d3d3");
  });

d3.json("filtered_airports.json").then((airports) => {
  console.log(airports);
  svg
    .selectAll("circle")
    .data(airports)
    .enter()
    .append("circle")
    .attr("cx", (d) => projection([d.longitude_deg, d.latitude_deg])[0])
    .attr("cy", (d) => projection([d.longitude_deg, d.latitude_deg])[1])
    .attr("r", 0.5)
    .attr("fill", "red");
});
