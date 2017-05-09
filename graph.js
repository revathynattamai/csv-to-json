
var margin = { top: 50, right: 50, bottom: 50, left: 50 };
var width = 500 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .1);
var yScale = d3.scale.linear().range([height, 0]);
var xDomain = [];
var yDomain = [13500, 14000];
var inputFile = 'indicators.json';
var numberOfCountries = 5;

var appendSVGtoDOM = function () {
    return d3.select('.chart1')
        .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
};

var appendChartToSVG = function() {
    return svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
};

/* Main */
var svg = appendSVGtoDOM();

var chart = appendChartToSVG();

d3.json(inputFile, function (error, json) {
    if (error) throw error;
    var data = getGraphData(json.data);
    data.forEach(function (d) { xDomain.push(d.country) });

    drawXaxis(xDomain, xScale);
    drawYaxis(yDomain, yScale);
    fillAllAxes(data, xScale, yScale);
});

var getGraphData = function(data) {
    var countryArray = [];
    data.forEach(function (line) {
        var flag = true;
        countryArray.forEach(function (country) {
            if (country.country === line.CountryCode) {
                country.value += +line.Value;
                flag = false;
            }
        });
        if (flag) {
            countryArray.push({
                country: line.CountryCode,
                value: +line.Value
            });
        }
    });
    countryArray.sort(function (a, b) {
        return b.value - a.value;
    });
    return countryArray.slice(0, numberOfCountries);
};

var drawXaxis = function(xDomain, xScale) {
    xScale.domain(xDomain);
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");
    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
};

var drawYaxis = function(yDomain, yScale) {
    yScale.domain(yDomain);
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Life Ex.");
};

var fillAllAxes = function(data, xScale, yScale) {
    chart.selectAll(".barRect")
    .data(data)
    .enter().append("rect")
    .attr("class", "barRect")
    .attr("x", function (d) { return xScale(d.country); })
    .attr("y", function (d) { return yScale(d.value); })
    .attr("height", function (d) { return height - yScale(d.value); })
    .attr("width", xScale.rangeBand());
};
