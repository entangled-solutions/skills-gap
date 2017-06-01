var f = d3.format(".1f");
var color = d3.scaleQuantize()
			.domain([-3, 3])
			.range(["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"])
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


	//All Skills
	results[2].forEach(function(d){
		skills.push(d.skill);
	})

	var sidebar = d3.select("#c0").append("svg")
			.attr("class", "jobs")
			.attr("width", 190)
			.attr("height", 750)

	sidebar.append("text")
			.attr("x", 190)
			.attr("y", 230)
			.style("text-anchor", "end")
			.style("font-size", 20)
			.text("Skill Type")

	sidebar.append("text")
			.attr("x", 170)
			.attr("y", 335)
			.style("text-anchor", "end")
			.style("font-size", 16)
			.text("Analytical")

	sidebar.append("path")
			.attr("d", "M 200 255 180 255 180 410 200 410")
			.style("stroke", "black")
			.style("stroke-width", 1)
			.style("fill", "none")

	sidebar.append("text")
			.attr("x", 160)
			.attr("y", 480)
			.style("text-anchor", "end")
			.style("font-size", 16)
			.text("Social")

	sidebar.append("path")
			.attr("d", "M 200 415 180 415 180 550 200 550")
			.style("stroke", "black")
			.style("stroke-width", 1)
			.style("fill", "none")

	sidebar.append("text")
			.attr("x", 160)
			.attr("y", 620)
			.style("text-anchor", "end")
			.style("font-size", 16)
			.text("Technical")

	sidebar.append("path")
			.attr("d", "M 200 555 180 555 180 685 200 685")
			.style("stroke", "black")
			.style("stroke-width", 1)
			.style("fill", "none")

	var yScale = d3.scalePoint()
				.domain(skills)
				.range([250, 680]);

	var yAxis = d3.axisLeft(yScale).tickSize(0);
	/*
	sidebar.append("g").attr("class", "axis")
			.attr("transform", "translate(190, 0)")
			.style("font-size", "10px")
			.call(yAxis); */

	//Make Em!!!
	nested.forEach(function(cluster){
		var button = document.createElement("button");
		button.innerHTML = cluster.key;
		button.setAttribute('id', "b" + (nested.indexOf(cluster) + 1)); 
		button.setAttribute('class', "button"); 
		document.getElementById('topnav').appendChild(button);

		//console.log(d)
		var titles = [];
		cluster.values.forEach(function(t){
			if (titles.indexOf(t.job_title) == -1){
				titles.push(t.job_title)
			}
		})

		var width = titles.length*15;

		var svg = d3.select("#c" + (nested.indexOf(cluster) + 1)).append("svg")
			.attr("class", "jobs")
			.attr("height", 750)
			.attr("width", width)
			.style("overflow", "visible")

		var tip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([-20, 10])
			  .html(function(d) {
			    return "<b>" + d.job_title + "</b><br>" + d.skill_name + ": <style='font-weight:700,color:" + color(d.skill_job) + "'>" + d.skill_job + "</style><br>Skill Education: " + d.skill_education + "<br>Skill Gap: " + d.skill_gap; 
			  })

		svg.call(tip); 

		svg.append("text")
			.attr("x", width/2)
			.attr("y", 720)
			.style("font-size", 20)
			.style("text-anchor", "middle")
			.text(cluster.key)
			.call(wrapt, 300)

		var xScale = d3.scalePoint()
				.domain(titles)
				.range([30, width])

		var xAxis = d3.axisTop(xScale).tickSize(0);

		/*
		svg.append("g").attr("class", "axis")
			.attr("transform", "translate(0, 240)")
			.style("font-size", "10px")
			.call(xAxis)
				.selectAll("text")
				.attr("transform", "rotate(-45)")
				.attr("text-anchor", "start");*/

		svg.selectAll(".heats")
		.data(cluster.values)
		.enter()
			.append("rect")
			.attr("width", 11)
			.attr("height", 11)
			.attr("x", function(d) {return xScale(d.job_title)})
			.attr("y", function(d) {return yScale(d.skill_name)})
			.style("fill", function(d) { return color(d.skill_gap)})
			.on("mouseenter", function(d){
				tip.show(d);
				d3.select(this)
					.style("stroke", "black")
					.style("stroke-width", 2);
			})
			.on("mouseleave", function(d){
				tip.hide(d);
				d3.select(this)
					.style("stroke", "none")
					.style("stroke-width", 0);
			})
	})

	d3.selectAll("button").on("click", function(){
		var index = this.getAttribute("id").substring(1);
		if (this.classList.contains("clicked") == true) {
			$("#c" + index).show();
			$("#b" + index).removeClass("clicked");
		} else {
			$("#c" + index).hide();
			$("#b" + index).addClass("clicked");
		}
	})
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
