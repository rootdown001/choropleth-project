var margin = {top: 20, right: 10, bottom: 40, left: 100},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// The svg
var svg = d3.select("svg")
 .attr("width", width + margin.left + margin.right)
 .attr("height", height + margin.top + margin.bottom)
 .append("g")
 .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var projection = d3.geoMercator()
.scale(70)
.center([0,20])
.translate([width / 2 - margin.left, height / 2]);

var domain = [100000000, 500000000]
var labels = ["< 100 M", "100 M - 500 M", "> 500 M"]
var range = ["#F8CAEE","#BF76AF","#852170"]
var colorScale = d3.scaleThreshold()
  .domain(domain)
  .range(range);


  var promises = []
  var data = d3.map();
  promises.push(d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"))
  promises.push(d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) { data.set(d.code, +d.pop); }))
  myDataPromises = Promise.all(promises).then(function(my_data) {
   var topo = my_data[0]

   var path = d3.geoPath();
   // do some stuff
//    svg.append("g")
//    .selectAll("path")
   
//    .data(topo.features)
//    .enter()
//    .append("path")
//    .attr("class", "topo")
//      // draw each country
//      .attr("d", d3.geoPath()
//        .projection(projection)
//      )
//      // set the color of each country
//      .attr("fill", function (d) {

//        d.total = data.get(d.id) || 0;
//        return colorScale(d.total);
//      })
//      .style("opacity", .7)
//     .on("mouseover", mouseOver )
//     .on("mouseleave", mouseLeave )

svg.append("g")
.selectAll("path")
.data(topojson.feature(topo, topo.objects.counties).features)
    .enter()
    .append("path")
  .attr("d", path)
  .attr("fill", "steelblue")
  .attr("stroke", "white")



  });
  