// // @TODO: YOUR CODE HERE!


var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;

var margin = {
    top: 50,
    right: 100,
    bottom: 50,
    left: 100
};


var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins. 
var svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g");


// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0.5)


// Pull data using d3.csv function
d3.csv("./assets/js/data.csv", function (err, data) {
    if (err) throw err;

    healthData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
    });

    // Initial Params to create scales
    var xScale = d3.scaleLinear().range([0, chartWidth]);
    var yLinearScale = d3.scaleLinear().range([chartHeight, 0]);

    var leftAxis = d3.axisLeft(yLinearScale);
    var bottomAxis = d3.axisBottom(xScale);

    var timeDuration = 750;

    // Scale the range of the data
    x.domain([0, d3.max(healthData, function (data) {
        return +data.poverty;
    })]);

    y.domain([0, d3.max(healthData, function (data) {
        return +data.healthcare;
    })]);

    // Defining tooltip
    var toolTip = d3.tip()
        .attr("class", "toolTip")
        .offset([-8, 0])
        .html(function (data) {
            var state = data.state;
            var povertyRate = +data.poverty;
            var healthcare = +data.healthcare;
            return (state + "<br> Poverty Rate (%): " +
                povertyRate + "<br> Health Rate (%): " + healthcare)
        });

    chart.call(toolTip);

    // Defining the circles on the chart
    chart.selectAll("circle")
        .data(healthData)
        .enter().append("circle")
        .attr("cx", function (data, index) {
            console.log(data.poverty);
            return x(data.poverty);
        })
        .attr("cy", function (data, index) {
            console.log(data.healthcare);
            return y(data.healthcare);
        })
        .attr('r', "10")
        .attr("fill", "blue")
        .style("opacity", 0.5)
        .on("click", function (data) {
            toolTip.show(data);
        });
    // Add x-axis
    chart.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // Add y-axis
    chart.append('g')
        .call(leftAxis);

    // Text for y-axis
    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (chartHeight))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .style("text-anchor", "margintop")
        .text("Population in Fair or Poor Health (%)")

    // Text for x-axis
    chart.append("text")
        .attr("transform", "translate(" + (chartWidth / 2) + ", " + (chartHeight + margin.top + 20) + ")")
        .attr("class", "axisText")
        .style("text-anchor", "middle")
        .text("Population Below the Poverty Line (%)");

    // Text for title
    chart.append("text")
        .style("text-anchor", "center")
        .attr("class", "axisText")
        .text("Correlation of Health vs. Poverty in USA");
})

