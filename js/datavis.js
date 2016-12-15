var DV; //global namespace for Data Visualization constants and functions
( function () {
    "use strict";

    DV = {

        getChartData: function () {
            var data = [];

            var els = document.getElementsByClassName("bardata");
            //iterate through the elements
            [].forEach.call(els, function (el) {
                var pair = el.innerHTML.split(' ');
                data.push({tag: pair[0], count: parseInt(pair[1], 10)});
            });

            //sort the list in descending order by number of appearences
            return data.sort(function (a, b) {
                return b.count - a.count
            });
        },

        createInteractiveChart: function () {
            var width = 600,
                barHeight = 40;

            /*var data = [
             {tag: 'p', count: 4},
             {tag: 'div', count: 8},
             {tag: 'html', count: 15},
             {tag: 'body', count: 16},
             {tag: 'a', count: 23},
             {tag: 'head', count: 42}
             ];*/

            //get data and clear the chart div
            var data = DV.getChartData();
            document.getElementById("chart").innerHTML = '<h2>Frequency of Tags Used:</h2>';

            //create the chart

            var svg = d3.select('.chart')
                .append("div")
                .classed("svg-container", true) //container class to make it responsive
                .append('svg')        // create an <svg> element
                //responsive SVG needs these 2 attributes and no width and height attr
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 " + (width * 2) + " " + ((barHeight + 2) * data.length) * 2)
                //class to make it responsive
                .classed("svg-content-responsive", true);

            var x = d3.scaleLinear()
                .range([0, width])
                .domain([0, d3.max(data, function (d) {
                    return d.count
                })]);

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
                    return 5;
                })
                .attr("y", barHeight / 2)
                .attr("dy", ".35em")
                .text(function (d) {
                    return d.tag + ': ' + d.count;
                });

            var cont = document.getElementsByClassName("svg-container");
            [].forEach.call(cont, function (el) {
                var newwidth = (100.00 * ((barHeight + 2.00) * data.length) / (width * 2.00) + "%");
                console.log(newwidth);
                el.style.paddingBottom = newwidth;
            });
        },

        createChart: function () {
            var width = 600,
                barHeight = 40;

            /*var data = [
             {tag: 'p', count: 4},
             {tag: 'div', count: 8},
             {tag: 'html', count: 15},
             {tag: 'body', count: 16},
             {tag: 'a', count: 23},
             {tag: 'head', count: 42}
             ];*/

            //get data and clear the chart div
            var data = DV.getChartData();

            document.getElementById("chart").innerHTML = '<h3>Frequency of Tags Used:</h3>';

            //create the chart

            var svg = d3.select('.chart')
                .append("div")
                .classed("svg-container", true) //container class to make it responsive
                .append('svg')        // create an <svg> element
                //responsive SVG needs these 2 attributes and no width and height attr
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 " + (width * 2) + " " + ((barHeight + 2) * data.length) * 2)
                //class to make it responsive
                .classed("svg-content-responsive", true);

            var x = d3.scaleLinear()
                .range([0, width])
                .domain([0, d3.max(data, function (d) {
                    return d.count
                })]);

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
                    return 5;
                })
                .attr("y", barHeight / 2)
                .attr("dy", ".35em")
                .text(function (d) {
                    return d.tag + ': ' + d.count;
                });

            var cont = document.getElementsByClassName("svg-container");
            [].forEach.call(cont, function (el) {
                var newwidth = (100.00 * ((barHeight + 2.00) * data.length) / (width * 2.00) + "%");
                console.log(newwidth);
                el.style.paddingBottom = newwidth;
            });
        }
    };//end of DV namespace

    document.addEventListener("DOMContentLoaded", DV.createChart);

}() );
