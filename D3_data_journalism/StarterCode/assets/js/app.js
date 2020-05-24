// @TODO: YOUR CODE HERE!

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params for choosing each axis (set defaults)
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
    // create x scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenXAxis]),
        d3.max(censusData, d => d[chosenXAxis])
      ])
      .range([0, chartWidth]);
  
    return xLinearScale;
  }

// Load data from forcepoints.csv
d3.csv("assets/data/data.csv").then(function(censusData, err) {
    if (err) throw err;
  // Print the forceData
  console.log(censusData);

  // Format the date and cast the force value to a number
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d.healthcare)])
    .range([chartHeight, 0]);

  // Create two new functions passing the scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 15)
    .attr("fill", "blue")
    .attr("opacity", ".5");

    var circleLabels = chartGroup.selectAll(null).data(censusData).enter().append("text");

circleLabels
  .attr("x", function(d) {
    return xLinearScale(d.poverty);
  })
  .attr("y", function(d) {
    return yLinearScale(d.healthcare);
  })
  .text(function(d) {
    return d.abbr;
  })
  .attr("font-family", "sans-serif")
  .attr("font-size", "10px")
  .attr("text-anchor", "middle")
  .attr("fill", "white");

 // Create group for  x-axis
 var labelsGroup = chartGroup.append("g")
 .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

var povertyLabel = labelsGroup.append("text")
 .attr("x", 0)
 .attr("y", 20)
 .text("Poverty (%)");

// append y axis
chartGroup.append("text")
 .attr("transform", "rotate(-90)")
 .attr("y", 0 - margin.left)
 .attr("x", 0 - (chartHeight / 2))
 .attr("dy", "1em")
 .text("Healthcare (%)");

});