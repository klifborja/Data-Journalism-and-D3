// // @TODO: YOUR CODE HERE!


var svgWidth = 950;
var svgHeight = 500;

var margin = {
    top: 50,
    right: 35,
    bottom: 100,
    left: 100
};


var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins. 
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g");


// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// d3.select("body")
//     .append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0.5)


// Pull data using d3.csv function
d3.csv("assets/data/data.csv").then(function (healthData, err) {
    if (err) throw err;
    console.log(healthData)

    healthData.forEach(function (data) {
        data.state = data.state;
        data.abbr = data.abbr;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    // Initial Params to create scales

    var xAxisClick = "poverty";
    var yAxisClick = "healthcare";

    // Function to update xScale
    function xScale(healthData, xAxisClick) {
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(healthData, d => d[xAxisClick]) * 0.8,
            d3.max(healthData, d => d[xAxisClick]) * 1.1
            ])
            .range([0, width])

        return xLinearScale;
    }


    // Function to update yScale
    function yScale(healthData, yAxisClick) {
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(healthData, d => d[yAxisClick]) * 0.8,
            d3.max(healthData, d => d[yAxisClick]) * 1.1
            ])
            .range([height, 0])

        return yLinearScale;
    }

    // Function to update xAxis
    function renderXAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);

        return xAxis;
    }

    // Function to update yAxis
    function renderYAxes(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);

        yAxis.transition()
            .duration(1000)
            .call(leftAxis);

        return yAxis;
    }

    // Function to update xCircles
    function renderXCircles(circlesGroup, newXScale, xAxisClick) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cx", d => newXScale(d[xAxisClick]));

        return circlesGroup;
    }

    // Function to update yCircles
    function renderYCircles(circlesGroup, newYScale, yAxisClick) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cy", d => newYScale(d[yAxisClick]));

        return circlesGroup;
    }


    // Function to update xText
    function renderXText(textGroup, newXScale, xAxisClick) {

        textGroup.transition()
            .duration(1000)
            .attr("x", d => newXScale(d[xAxisClick]));

        return textGroup;
    }

    // Function to update yText
    function renderYText(textGroup, newYScale, yAxisClick) {

        textGroup.transition()
            .duration(1000)
            .attr("y", d => newYScale(d[yAxisClick]) + 5); // offset to the north need to adjust to center in circle

        return textGroup;
    }

    //Define the ToolTip
    // Function to update ToolTip circles
    function updateToolTip(xAxisClick, yAxisClick, circlesGroup) {
        if (xAxisClick === "poverty") {
            var labelX = "Poverty(%): "
        }
        else if (xAxisClick === "age") {
            var labelX = "Age: "
        }
        else if (xAxisClick === "income") {
            var labelX = "Income: "
        }

        if (yAxisClick === "healthcare") {
            var labelY = "Healthcare(%): "
        }
        else if (yAxisClick === "smokes") {
            var labelY = "Smokes(%): "
        }
        else if (yAxisClick === "obesity") {
            var labelY = "Obese(%): "
        }

        var toolTip = d3.tip()
            .attr("class", "d3-tip")  // d3-tip better looking pop out than "tooltip"
            .offset([-5, 0])  // add some space between the tag and circle
            .html(function (d) {
                return (`${d.state}<br>${labelX} ${d[xAxisClick]}<br>${labelY} ${d[yAxisClick]}`)
            });

        circlesGroup.call(toolTip).on("mouseover", toolTip.show).on("mouseout", toolTip.hide)

        return circlesGroup
    };


    // xLinearScale 
    var xLinearScale = xScale(healthData, xAxisClick);

    // yLinearScale 
    var yLinearScale = yScale(healthData, yAxisClick);


    // Create Axes
    var bottomAxis = d3.axisBottom(xLinearScale)
    var leftAxis = d3.axisLeft(yLinearScale)

    // Appens xAxis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Append yAxis 
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // Append text
    var textGroup = chartGroup.append("g")
        .selectAll("text")
        .data(healthData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[xAxisClick]))
        .attr("y", d => yLinearScale(d[yAxisClick]) + 5)
        .text(d => d.abbr)
        .attr("font-size", "13px")
        .attr("stroke", "#ff1a1a")
        .attr("text-anchor", "middle")
        .attr("fill", "#ff1a1a");


    // Append circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[xAxisClick]))
        .attr("cy", d => yLinearScale(d[yAxisClick]))
        .attr("r", 12)
        .attr("fill", "#99b3ff")
        .attr("stroke", "e3e3e3")
        .attr("opacity", "0.5");

    // Create xGroup
    var xGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyData = xGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");

    var ageData = xGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (median)");

    var incomeData = xGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (median)");


    // Create yGroup
    var yGroup = chartGroup.append("g")
        .attr("transform", `translate(${width - 840}, ${height / 2})`);

    var healthCareData = yGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -20)
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    var smokesData = yGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -40)
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokes (%)");

    var obeseData = yGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -60)
        .attr("value", "obesity")
        .classed("inactive", true)
        .text("Obese (%)");


    // updateToolTip 
    var circlesGroup = updateToolTip(xAxisClick, yAxisClick, circlesGroup, textGroup)

    // xGroup event listener
    xGroup.selectAll("text")
        .on("click", function () {
            // Pull value and swap with xAxisClick
            var value = d3.select(this).attr("value");
            if (value !== xAxisClick) {
                xAxisClick = value;
                console.log(xAxisClick)

                // Update xScale, xAxis, circles, toolTip, and text
                xLinearScale = xScale(healthData, xAxisClick);
                xAxis = renderXAxes(xLinearScale, xAxis);
                circlesGroup = renderXCircles(circlesGroup, xLinearScale, xAxisClick);
                circlesGroup = updateToolTip(xAxisClick, yAxisClick, circlesGroup, textGroup);
                textGroup = renderXText(textGroup, xLinearScale, xAxisClick)



                // Highlights selected xAxis 
                if (xAxisClick === "age") {
                    ageData
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyData
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeData
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (xAxisClick === "poverty") {
                    ageData
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyData
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeData
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (xAxisClick === "income") {
                    ageData
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyData
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeData
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });

    // yGroup event listener
    yGroup.selectAll("text")
        .on("click", function () {
            // Pull value and swap with yAxisClick
            var value = d3.select(this).attr("value");
            if (value !== yAxisClick) {
                yAxisClick = value;
                console.log(yAxisClick)

                // Update yScale, yAxis, circles, toolTip, and text
                yLinearScale = yScale(healthData, yAxisClick);
                yAxis = renderYAxes(yLinearScale, yAxis);
                circlesGroup = renderYCircles(circlesGroup, yLinearScale, yAxisClick);
                circlesGroup = updateToolTip(xAxisClick, yAxisClick, circlesGroup, textGroup);
                textGroup = renderYText(textGroup, yLinearScale, yAxisClick)



                // Highlights selected yAxis
                if (yAxisClick === "healthcare") {
                    healthCareData
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesData
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseData
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (yAxisClick === "smokes") {
                    healthCareData
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesData
                        .classed("active", true)
                        .classed("inactive", false);
                    obeseData
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (yAxisClick === "obesity") {
                    healthCareData
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesData
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseData
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
});



