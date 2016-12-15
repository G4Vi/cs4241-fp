var DV; //global namespace for Data Visualization constants and functions
( function () {
    "use strict";

    DV = {

        displayMode : 0,

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

        getChartDataInteractive: function () {
            var data = [];
            var categories = [
                'information',
                'organization',
                'linked',
                'embedded',
                'text',
                'media',
                'interactive',
                'other'
            ];

            categories.forEach(function(curCat){
               data.push({category: curCat, tags: [], count: 0, total: 0});
            });

            var els = document.getElementsByClassName("bardata");
            //iterate through the elements
            [].forEach.call(els, function (el) {
                var pair = el.innerHTML.split(' ');

                if (DV.isInformation(pair[0])) {
                    data[0].tags.push({tag: pair[0], count: parseInt(pair[1], 10)});
                    data[0].count += 1;
                    data[0].total += parseInt(pair[1], 10);
                } else if (DV.isOrg(pair[0])) {
                    data[1].tags.push({tag: pair[0], count: parseInt(pair[1], 10)});
                    data[1].count += 1;
                    data[1].total += parseInt(pair[1], 10);
                } else if (DV.isLinked(pair[0])) {
                    data[2].tags.push({tag: pair[0], count: parseInt(pair[1], 10)});
                    data[2].count += 1;
                    data[2].total += parseInt(pair[1], 10);
                } else if (DV.isEmbed(pair[0])) {
                    data[3].tags.push({tag: pair[0], count: parseInt(pair[1], 10)});
                    data[3].count += 1;
                    data[3].total += parseInt(pair[1], 10);
                } else if (DV.isText(pair[0])) {
                    data[4].tags.push({tag: pair[0], count: parseInt(pair[1], 10)});
                    data[4].count += 1;
                    data[4].total += parseInt(pair[1], 10);
                } else if (DV.isMedia(pair[0])) {
                    data[5].tags.push({tag: pair[0], count: parseInt(pair[1], 10)});
                    data[5].count += 1;
                    data[5].total += parseInt(pair[1], 10);
                } else if (DV.isInteract(pair[0])) {
                    data[6].tags.push({tag: pair[0], count: parseInt(pair[1], 10)});
                    data[6].count += 1;
                    data[6].total += parseInt(pair[1], 10);
                } else {
                    data[7].tags.push({tag: pair[0], count: parseInt(pair[1], 10)});
                    data[7].count += 1;
                    data[7].total += parseInt(pair[1], 10);
                }
                    });

            //sort the lists in descending order by number of appearences
            data.forEach(function(category){
               category.tags.sort(function (a, b) {
                   return b.count - a.count;
               });
            });

            /*
            return data.sort(function (a, b) {
                return b.count - a.count;
            });
            */

            return data;
        },

        isInformation : function(name) {
            var tags = [
                'meta',
                'title',
                'address'
            ];
            var found =  false;
            tags.forEach(function(tag){
                if (tag === name) {
                    found = true;
                }
            });
            return found;
        },

        isOrg : function(name) {
            var tags = [
                'head',
                'foot',
                'div,',
                'span',
                'table',
                'th',
                'tr',
                'td',
                'ol',
                'ul',
                'li',
                'col',
                'colgroup'
            ];
            var found =  false;
            tags.forEach(function(tag){
                if (tag === name) {
                    found = true;
                }
            });
            return found;
        },

        isLinked : function(name) {
            var tags = [
                'link',
                'script',
                'style'
            ];
            var found =  false;
            tags.forEach(function(tag){
                if (tag === name) {
                    found = true;
                }
            });
            return found;
        },

        isEmbed : function(name) {
            var tags = [
                'embed',
                'frame',
                'iframe'
            ];
            var found =  false;
            tags.forEach(function(tag){
                if (tag === name) {
                    found = true;
                }
            });
            return found;
        },

        isText : function(name) {
            var tags = [
                'p',
                'center',
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
                'b',
                'em',
                'br',
                'i'
            ];
            var found =  false;
            tags.forEach(function(tag){
                if (tag === name) {
                    found = true;
                }
            });
            return found;
        },

        isMedia : function(name) {
            var tags = [
                'video',
                'svg',
                'canvas',
                'img'
            ];
            var found =  false;
            tags.forEach(function(tag){
                if (tag === name) {
                    found = true;
                }
            });
            return found;
        },

        isInteract : function(name) {
            var tags = [
                'form',
                'input',
                'button',
                'textarea',
                'a'
            ];
            var found =  false;
            tags.forEach(function(tag){
                if (tag === name) {
                    found = true;
                }
            });
            return found;
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
            var data = DV.getChartDataInteractive();
            document.getElementById("chart").innerHTML += '<h2 class="incategory hidden">Tags Used by Category</h2>';

            data.forEach(function(catData){

                document.getElementById("chart").innerHTML += '<h3 class="incategory hidden">' + catData.category + ': ' + catData.count + ' tags used. Total: ' + catData.total + '</h3>';

                var svg = d3.select('.chart')
                    .append("div")
                    .classed("svg-container", true) //container class to make it responsive
                    .classed("hidden", true)
                    .classed("incategory", true)
                    .append('svg')        // create an <svg> element
                    //responsive SVG needs these 2 attributes and no width and height attr
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 " + (width * 2) + " " + ((barHeight + 2) * catData.tags.length) * 2)
                    //class to make it responsive
                    .classed("svg-content-responsive", true);

                var x = d3.scaleLinear()
                    .range([0, width])
                    .domain([0, d3.max(catData.tags, function (d) {
                        return d.count
                    })]);

                var bar = svg.selectAll("g")
                    .data(catData.tags)
                    .enter().append("g")
                    .attr("transform", function (d, i) {
                        return "translate(0," + i * barHeight + ")";
                    });

                bar.append("rect")
                    .classed("interbar", true)
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
                [].forEach.call(cont, function (el, i) {
                    if (i != 0 && i != 8) {
                        var newwidth = (100.00 * ((barHeight + 2.00) * data[i-1].tags.length) / (width * 2.00) + "%");
                        console.log(newwidth);
                        el.style.paddingBottom = newwidth;
                    }
                });
            });

            //create the chart

            document.getElementById("chart").innerHTML += '<h3 class="category">Frequency of Categories of Tags</h3>';

            var svg = d3.select('.chart')
                .append("div")
                .classed("svg-container", true) //container class to make it responsive
                .classed("category", true)
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
                .classed("interbar", true)
                .attr("width", function (d) {
                    return x(d.total);
                })
                .attr("height", barHeight - 1);

            bar.append("text")
                .attr("x", function (d) {
                    return 5;
                })
                .attr("y", barHeight / 2)
                .attr("dy", ".35em")
                .text(function (d) {
                    return d.category + ': ' + d.total;
                });

            var cont = document.getElementsByClassName("svg-container");
            [].forEach.call(cont, function (el, i) {
                if (i == 8) {
                    var newwidth = (100.00 * ((barHeight + 2.00) * data.length) / (width * 2.00) + "%");
                    console.log(newwidth);
                    el.style.paddingBottom = newwidth;
                }
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

            document.getElementById("chart").innerHTML += '<h3 class="individual hidden">Frequency of Tags Used:</h3>';

            //create the chart

            var svg = d3.select('.chart')
                .append("div")
                .classed("svg-container", true) //container class to make it responsive
                .classed("hidden", true)
                .classed("individual", true)
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
                .classed("interbar", true)
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

        loadCharts : function() {
            DV.createChart();
            DV.createInteractiveChart();
            document.getElementById("chart").addEventListener("click", function(){
                switch(DV.displayMode) {
                    case 0:
                        d3.selectAll(".category").classed("hidden", true);
                        d3.selectAll(".incategory").classed("hidden", false);
                        DV.displayMode = 1;
                        break;
                    case 1:
                        d3.selectAll(".incategory").classed("hidden", true);
                        d3.selectAll(".individual").classed("hidden", false);
                        DV.displayMode = 2;
                        break;
                    case 2:
                        d3.selectAll(".individual").classed("hidden", true);
                        d3.selectAll(".category").classed("hidden", false);
                        DV.displayMode = 0;
                        break;
                }
            })
        }
    };//end of DV namespace

    document.addEventListener("DOMContentLoaded", DV.loadCharts);

}() );
