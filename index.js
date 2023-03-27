// define svg width, weight, margins
var margin = {top: 20, right: 10, bottom: 40, left: 100},
    width = 1200 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

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

  // define array for promises
  var promises = []

  promises.push(d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"))
  promises.push(d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"))
  myDataPromises = Promise.all(promises).then(function(my_data) {


  // find min and max of bachelorsOrHigher
  const degreeArr = [];
  for (let obj of my_data[1]) {
    degreeArr.push(obj.bachelorsOrHigher)
  }
  const degreeExt = d3.extent(degreeArr)
  // console.log(degreeExt)

  // create colorScale
  const colorScale = d3.scaleLinear()
                    .range(["hsl(208, 48%, 80%)", "hsl(208, 48%, 20%)"])
                    .domain(degreeExt)


  // create topo for data in svg
  var topo = my_data[0]
  // create path for svg path elements
  var path = d3.geoPath();


svg.append("g")
.selectAll("path")
.data(topojson.feature(topo, topo.objects.counties).features)
    .enter()
    .append("path")
  .attr("d", path)
  .attr("fill", "steelblue")
  .attr("stroke", "white")
  .attr("fill", (d => {
    let county = my_data[1].filter(obj => obj.fips === d.id)
    // console.log(county[0].bachelorsOrHigher)
    if (county[0]) {
      return colorScale(county[0].bachelorsOrHigher)
     } else {return colorScale(0)}

  }))


  });
  