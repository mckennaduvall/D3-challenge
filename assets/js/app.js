// SVG wrapper dimensions are determined by the current width
// and height of the browser window.
var svgWidth = 1200;
var svgHeight = 600;

var margin = {
  top: 50,
  right: 50,
  bottom: 85,
  left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// create and svg wrapper and append svg group that will hold our chart
var svg = d3.select("#scatter")
.append("svg")
.attr("height", svgHeight)
.attr("width", svgWidth);

//append group element
var scatterGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import data from an external CSV file
d3.csv("assets/data/data.csv").then(function(healthData) {
    console.log(healthData);
    console.log([healthData]);

// Parse data as numbers
    healthData.forEach(function(data) {
        data.smokes = +data.smokes;
        data.age = +data.age;
});

// scales
var xScale = d3.scaleLinear()
.domain([30, d3.max(healthData, d => d.age)])
.range([0, width]);

var yScale = d3.scaleLinear()
.domain([8, d3.max(healthData, d => d.smokes)])
.range([height, 0]);

//create axis functions 
var leftAxis = d3.axisLeft(yScale);
var bottomAxis = d3.axisBottom(xScale);

//append axes to the chart
scatterGroup.append("g")
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

scatterGroup.append("g")
.call(leftAxis);

// append circles to data points
var circlesGroup = scatterGroup.selectAll("circle")
.data(healthData)
.enter()
.append("circle")
.attr("cx", d => xScale(d.age))
.attr("cy", d => yScale(d.smokes))
.attr("r", "10")
.attr("fill", "blue")
.attr("opacity", ".5");


// Initialize tool tip

var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
    return (`Age: ${d.age}<br>Smokers: ${d.smokes}`);
      });

// Create tooltip in the chart

scatterGroup.call(toolTip);

// Create event listeners to display and hide the tooltip

circlesGroup.on("click", function(data) {
toolTip.show(data, this);
})
// onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    scatterGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 0)
      .attr("x", 0 - (height / 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Percentage of Smokers in the US");

    scatterGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 0})`)
      .attr("class", "axisText")
      .text("Age");
  }).catch(function(error) {
    console.log(error);
  }); 
