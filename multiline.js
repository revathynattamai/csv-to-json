var margin = { top: 50, right: 50, bottom: 50, left: 50 };
var width = 1000 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
var xScale = d3.scaleTime().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);
var zScale = d3.scaleOrdinal(d3.schemeCategory10);

var svg = (function () {
  return d3.select('.chart1')
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
})();

var chart = (function () {
  return svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
})();

/* Main */

var line = d3.line()
  .curve(d3.curveBasis)
  .x(function (d) { return xScale(d.year); })
  .y(function (d) { return yScale(d.value); });

d3.json("indicators.json", function (error, json) {
  if (error) throw error;
  var data = getGraphData(json.data);

  var params = [];
  data.forEach(function (d) {
    var flag = true;
    params.forEach(function (param) {
      if (param.indicator === d.IndicatorName) {
        param.values.push({
          value: d.Value,
          year: d.Year
        });
        flag = false;
      }
    });
    if (flag) {
      params.push({
        indicator: d.IndicatorName,
        values: [{ value: d.Value, year: d.Year }]
      });
    }
  });

  xScale.domain(d3.extent(data, function (d) { return d.Year; }));

  yScale.domain([
    d3.min(params, function (c) { return d3.min(c.values, function (d) { return +d.value; }); }),
    d3.max(params, function (c) { return d3.max(c.values, function (d) { return +d.value; }); })
  ]);

  zScale.domain(params.map(function (c) { console.log(c); return c.indicator; }));

  chart
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  chart
    .append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(yScale))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("fill", "#000")
    .text("Rate");

  var param = chart.selectAll(".param")
    .data(params)
    .enter().append("g")
    .attr("class", "param");

  param.append("path")
    .attr("class", "line")
    .attr("d", function (d) { return line(d.values); })
    .style("stroke", function (d) { return zScale(d.indicator); });


  param.append("text")
    .datum(function (d) { return { value: d.values[d.values.length - 1].value, indicator: d.indicator, year: d.values[d.values.length - 1].year } })
    .attr("transform", function (d) { console.log('dd', d); return "translate(" + xScale(+d.year) + "," + yScale(+d.value) + ")"; })
    .attr("x", 3)
    .attr("dy", "0.35em")
    .style("font", "10px sans-serif")
    .text(function (d) { return d.indicator; });
});

var getGraphData = function (data) {
  return data.filter(function (line) {
    return line.CountryName === 'India' && (line.IndicatorName === 'Birth rate, crude (per 1,000 people)' || line.IndicatorName === 'Death rate, crude (per 1,000 people)');
  });
};