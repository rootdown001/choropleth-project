// define svg width, weight, margins
var margin = {top: 20, right: 10, bottom: 40, left: 100},
    width = 1150 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

// The svg
var svg = d3.select("#holder")
            .append("svg")
            .attr("id", "map")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                      "translate(" + margin.left + "," + margin.top + ")");

  // create tooltip div in #holder
  const tooltip = d3.select("body")
                  .append("div")
                  .attr("id", "tooltip")




var projection = d3.geoMercator()
            .scale(70)
            .center([0,20])
            .translate([width / 2 - margin.left, height / 2]);

  // define array for promises
  var promises = []

  // push json to promises array
  promises.push(d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"))
  promises.push(d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"))
  
  // start .then function
  myDataPromises = Promise.all(promises).then(function(my_data) {

  // find min and max of bachelorsOrHigher
  const degreeArr = [];
  for (let obj of my_data[1]) {
    degreeArr.push(obj.bachelorsOrHigher)
  }
  const degreeExt = d3.extent(degreeArr)
  
  // create colorScale
  const colorScale = d3.scaleLinear()
                    .range(["hsl(208, 48%, 80%)", "hsl(208, 48%, 20%)"])
                    .domain(degreeExt)

  // create topo for data in svg
  var topo = my_data[0]

  // create path for svg path elements
  var path = d3.geoPath();

  // create paths to draw map
  svg.append("g")
      .selectAll("path")
      .data(topojson.feature(topo, topo.objects.counties).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "county")
      .attr("stroke", "white")
      .attr("fill", (d => {
        let county = my_data[1].filter(obj => obj.fips === d.id)
        // console.log(county[0].bachelorsOrHigher)
        if (county[0]) {
          return colorScale(county[0].bachelorsOrHigher)
        } else {return colorScale(0)}
        }))
      .attr("data-fips", (d) => {
        let fips = my_data[1].filter(obj => obj.fips === d.id)
        if (fips[0]) {
          // console.log(fips[0].fips)
          return fips[0].fips
        } else {return 0}
        })
      .attr("data-education", (d) => {
        let ed = my_data[1].filter(obj => obj.fips === d.id)
        if (ed[0]) {
          // console.log(ed[0].bachelorsOrHigher)
          return ed[0].bachelorsOrHigher
        } else {return 0}
        })
      .on("mouseover", function(event, d) {
        tooltip.html(() => {
          let mouse = my_data[1].filter(obj => obj.fips === d.id)
          if (mouse[0]) {
            return (mouse[0].area_name + ", " + mouse[0].state + "<br>" + mouse[0].bachelorsOrHigher + " %")
          } else {
            return 0
          }


        })
            .style("display", "block")
            .style("left", event.pageX + 20 + "px")
            .style("top", event.pageY - 80 + "px")
            .style("background-color", "lightgray")
            .attr("id", "tooltip")
            .attr("data-education", () => {
              let ed2 = my_data[1].filter(obj => obj.fips === d.id)
              if (ed2[0]) {
                // console.log(ed[0].bachelorsOrHigher)
                return ed2[0].bachelorsOrHigher
              } else {return 0}
              })
      })
        .on("mouseout", function() {
          return tooltip.style("display", "none")
        })

      // create legend
      const legend = d3.legendColor()
      .scale(colorScale)
      .cells(8)

      // add g element and call legend obj
      svg.append("g")
      .attr("id", "legend")
      .attr("transform", "translate(" + (width - 100) + "," + (height/2) + ")")
      .call(legend);

      })