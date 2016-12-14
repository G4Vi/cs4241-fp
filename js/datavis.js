var DV; //global namespace for Data Visualization constants and functions
( function () {
    "use strict";

    DV = {

        getChartData : function () {
            var data = [];

            var els = document.getElementsByClassName("bardata");
            //iterate through the elements
            [].forEach.call(els, function (el) {
                var pair = el.innerHTML.split(' ');
                data.push({tag: pair[0], count: parseInt(pair[1],10)});
            });

            return data;
        },

        createChart: function () {
            var width = 420,
                barHeight = 20;

            /*var data = [
                {tag: 'p', count: 4},
                {tag: 'div', count: 8},
                {tag: 'html', count: 15},
                {tag: 'body', count: 16},
                {tag: 'a', count: 23},
                {tag: 'head', count: 42}
            ];*/

            var data = DV.getChartData();
            document.getElementById("chart").innerHTML = '';

            var svg = d3.select('.chart')
                .attr('width', width) // set its dimentions
                .attr('height', (barHeight + 5) * data.length)
                .append('svg')        // create an <svg> element
                .attr('width', width) // set its dimentions
                .attr('height', (barHeight + 5) * data.length);

            var x = d3.scaleLinear()
                .range([0, width])
                .domain([0,d3.max(data, function(d) { return d.count })]);

            var bar = svg.selectAll("g")
                .data(data)
                .enter().append("g")
                .attr("transform", function (d, i) {
                    return "translate(0," + i * barHeight + ")";
                });

            bar.append("rect")
                .attr("width", function (d) {
                    return x(d.count);
                })
                .attr("height", barHeight - 1);

            bar.append("text")
                .attr("x", function (d) {
                    return x(d.count) - 3;
                })
                .attr("y", barHeight / 2)
                .attr("dy", ".35em")
                .text(function (d) {
                    return d.tag + ': ' + d.count;
                });
        }
    };//end of DV namespace

    document.addEventListener("DOMContentLoaded", DV.createChart);

}() );