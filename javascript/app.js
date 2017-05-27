var f = d3.format(".1f");
var color = d3.scaleLinear()
			.domain([-5, 0, 5])
			.range(["red", "yellow", "green"])
d3.queue()
	.defer(d3.csv, "data/data.csv")
	.defer(d3.csv, "data/clusters.csv")
	.defer(d3.csv, "data/skills.csv")
	.awaitAll(function(error, results){ 

	var data = results[0]; 
	var clusters = [];
	var skills = [];

	var nested = d3.nest()
		.key(function(d){ return d.career_cluster })
		.entries(data)

	//All Clusters
	results[1].forEach(function(d){
		clusters.push(d.cluster);
	})

	//All Skills
	results[2].forEach(function(d){
		skills.push(d.skill);
	})

	//Make Em!!!
	nested.forEach(function(cluster){
		//console.log(d)
		var titles = [];
		cluster.values.forEach(function(t){
			if (titles.indexOf(t.job_title) == -1){
				titles.push(t.job_title)
			}
		})

		var width = titles.length*15 + 200;

		var svg = d3.select("#bigtable").append("svg")
		.attr("class", "jobs")
		.attr("height", 700)
		.attr("width", width)
		.style("overflow", "visible")

		svg.append("text")
			.attr("x", 100)
			.attr("y", 100)
			.style("font-size", 20)
			.text(cluster.key)
			.call(wrapt, 200)

		var xScale = d3.scalePoint()
				.domain(titles)
				.range([200, width])

		var yScale = d3.scalePoint()
				.domain(skills)
				.range([250, 680])

		var xAxis = d3.axisTop(xScale).tickSize(0);
		var yAxis = d3.axisLeft(yScale).tickSize(0);

		svg.append("g").attr("class", "axis")
			.attr("transform", "translate(0, 240)")
			.style("font-size", "10px")
			.call(xAxis)
				.selectAll("text")
				.attr("transform", "rotate(-45)")
				.attr("text-anchor", "start");
		
		svg.append("g").attr("class", "axis")
			.attr("transform", "translate(190, 0)")
			.style("font-size", "10px")
			.call(yAxis); 

		svg.selectAll(".heats")
		.data(cluster.values)
		.enter()
			.append("rect")
			.attr("width", 10)
			.attr("height", 10)
			.attr("x", function(d) {return xScale(d.job_title)})
			.attr("y", function(d) {return yScale(d.skill_name)})
			.style("fill", function(d) { return color(d.skill_gap)})
	})

	
/*
	var svg = d3.select("#bigtable").append("svg")
		.attr("id", "jobs")
		.attr("width", 1500)
		.attr("height", 500)

	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([0, 10])
	  .html(function(d) {
	    return d.job_title;
	  })

	svg.call(tip); 

	var x = d3.scalePoint()
				.domain(clusters)
				.range([0, 5500])

	var y = d3.scalePoint()
				.domain(skills)
				.range([50, 450])

	//var xAxis = d3.axisBottom(x).tickSize(-400, 0, 0);

	svg.selectAll(".heats")
		.data(data)
		.enter()
			.append("rect")
			.attr("width", 10)
			.attr("height", 10)
			.attr("x", function(d) {return x(d.career_cluster) + Math.random()*100})
			.attr("y", function(d) {return y(d.skill_name)})
			.style("fill", function(d) { return color(d.skill_gap)})
*/
})


function wrapt(text, width) {
    text.each(function () {
        var text = d3.select(this),
        	words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}