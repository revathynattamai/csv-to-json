var margin = {top: 20, right: 50, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var asianCountries = ["ARB", "EAS", "ECS", "BGD", "BRN", "HKG", "IND", "IRN", "IRQ", "JOR", "KAZ", "MAC", "MDV", "MUS"];

d3.json('indicators.json', function(error, json) {
    main(json);
});

function filteredData(fullData) {
    return fullData.filter(function(element) {
        return asianCountries.indexOf(element.CountryCode) !== -1 && (element.IndicatorName === 'Life expectancy at birth, male (years)' || element.IndicatorName === 'Life expectancy at birth, female (years)');
    });
}

function main(json) {
    var fd = filteredData(json.data); //contains from all years but we need the cumulative data
    var data = [];
    fd.forEach(function(d) {
        var ff = data.find(function(dd) {
            return dd.country === d.CountryCode;
        });
        if (ff) {
            ff.male = d.IndicatorName === 'Life expectancy at birth, male (years)' ? +d.Value +ff.male : ff.male;
            ff.female = d.IndicatorName === 'Life expectancy at birth, female (years)' ? +d.Value +ff.female : ff.female;
        } else {
            data.push({
                country: d.CountryCode,
                male: d.IndicatorName === 'Life expectancy at birth, male (years)' ? +d.Value : 0,
                female: d.IndicatorName === 'Life expectancy at birth, female (years)' ? +d.Value : 0
            });
        }
    });
    var xData = ["male", "female"];
    drawGraph(xData, data);
}

function drawGraph(xData, data) {
    var x = d3.scale.ordinal().rangeRoundBands([0, width], .35);
    var y = d3.scale.linear().rangeRound([height, 0]);
    
    var color = d3.scale.category20();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var dataIntermediate = xData.map(function (c) {
        return data.map(function (d) {
            return {x: d.country, y: +d[c]};
        });
    });
    
    var dataStackLayout = d3.layout.stack()(dataIntermediate);
    
    x.domain(dataStackLayout[0].map(function (d) {
        return d.x;
    }));
    
    y.domain([0,
        d3.max(dataStackLayout[dataStackLayout.length - 1],
                function (d) { return d.y0 + d.y;})
        ])
    .nice();
    
    var layer = svg.selectAll(".stack")
        .data(dataStackLayout)
        .enter().append("g")
        .attr("class", "stack")
        .style("fill", function (d, i) {
            return color(i);
        });

    layer.selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter().append("rect")
        .attr("x", function (d) {
            return x(d.x);
        })
        .attr("y", function (d) {
            return y(d.y + d.y0);
        })
        .attr("height", function (d) {
            return y(d.y0) - y(d.y + d.y0);
        })
        .attr("width", x.rangeBand());
    
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
}




