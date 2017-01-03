function timeUpdate()
{
	var t=setTimeout("update()",500);
}


function update()
{
	var states = filter(gblStates);
    
	var i = 0;
	var maxPopulation = 0.0;
	var maxDeaths = 0.0;
	var maxRate = 0.0;
	var minRate = 10000.0;
	
	for(i = 0;i<states.length;i++)
	{
		var currentVal = states[i].Population;
		if(maxPopulation < currentVal) {
			maxPopulation = currentVal;
		}
		
		var currentDeaths = states[i].Deaths;
		if(maxDeaths < currentDeaths) {
			maxDeaths = currentDeaths;
		}
		
		var currentRate = states[i]['Crude Rate'];
		if(maxRate < currentRate) {
			maxRate = currentRate;
		}
		if(minRate > currentRate) {
			minRate = currentRate;
		}
	}
	
	d3.selectAll("path") <!--selects all the SVG paths for the states-->
	  .data(states)
	  .style("stroke","silver")
	  .style("stroke-opacity","0.8")
	  .style("fill", "red")
	  .style("fill-opacity",
		function(d,i) {  <!-- color state depending on population of each state -->
			var pathId = d3.select(this).attr("id");
			if (maxPopulation == 0)
				return 0;
			if (abbrev[d.State] == pathId)
				// return (d.Population/maxPopulation + .02);
				// return (d.Deaths/maxDeaths);
				return ((d['Crude Rate']-minRate)/(maxRate-minRate));
			else
				return 1.0
		})
	  
	  .on("mouseover",
		function(d,i) {
			d3.select("body")
				.select("dod")
				.html( "<b>"+d.State+"</b><br/>"+
					"<b>Gender</b> : "+d.Gender+"<br/>"+
					"<b>Ages</b> : "+d.AgeGroup+"<br/>"+
					"<b>Race</b> : "+d.Race+"<br/>"+ 
					"<b>Population</b> : "+d.Population+"<br/>"+
					"<b>Year</b> : "+d.Year+"<br/>"+
					"<br/>"+
					"<b>Deaths</b> : "+d.Deaths+"<br/>"+
					"<b>Crude Rate</b> : "+d['Crude Rate'].toFixed(2)+"<br/>"
					);
			
			// Build scales for bar charts
			var x = d3.scale.linear()
					.domain([0, d3.max(d.YearlyStats, function(k, l) { return k.Deaths })])
					.range([0, 200]);

			var y = d3.scale.ordinal()
					.domain(['1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009'])
					.rangeBands([0, 220]);

			// Show bar graph of state data by year
			var barChart = d3.select("body")
							 .select("grph")
							 .append("svg")
							 .attr("class", "chart")
							 .attr("width", 240)
							 .attr("height", 240)
							 .append("g")
							 .attr("transform", "translate(10,15)");

			barChart.selectAll("line")
				.data(x.ticks(10))
				.enter().append("line")
				.attr("x1", x)
				.attr("x2", x)
				.attr("y1", 0)
				.attr("y2", 220)
				.style("stroke", "#ccc");

			barChart.selectAll("rect")
					.data(d.YearlyStats)
					.enter()
					.append("rect")
					.attr("y", function(d) { return y(d.Year) })
					.attr("width", function(d) { return x(d.Deaths) })
					.attr("height", y.rangeBand());

			var enter = barChart.selectAll("text")
					.data(d.YearlyStats)
					.enter();

			enter.append("text")
				.attr("x", 5)
				.attr("y", function (d) { return y(d.Year) + y.rangeBand() / 2; })
				.attr("dy", ".35em")
				.attr("text-anchor", "start")
				.style("fill", "white")
				.style("font-family", "sans-serif")
				.style("font-size", "10px")
				.text(function(d) { return d.Year });  

			enter.append("text")
				.attr("x", function(d) { return x(d.Deaths) })
				.attr("y", function (d) { return y(d.Year) + y.rangeBand() / 2; })
				.attr("dx", -3)
				.attr("dy", ".35em")
				.attr("text-anchor", "end")
				.style("fill", "white")
				.style("font-family", "sans-serif")
				.style("font-size", "10px")
				.text(function(d) { return d.Deaths });

			barChart.selectAll(".rule")
				.data(x.ticks(2))
				.enter()
				.append("text")
				.attr("class", "rule")
				.attr("x", x)
				.attr("y", 0)
				.attr("dy", -3)
				.attr("text-anchor", "middle")
				.style("font-family", "sans-serif")
				.style("font-size", "10px")
				.text(String);
				
		}
	  )
	
	  .on("mouseout",
		function(d,i) {
			d3.select("body")
				.select("dod")
				.html("Heart disease is the #1 cause of death in the United States. This data collected by the CDC is available to explore using this interactive tool.<br/><br/>The states are ranked in the order of least to most heart disease cases.<br/><br/>We invite you to educate yourself using the filtering options above the map.<br/><br/>Together, lets understand the state of our country's health is in and make strides to lower these numbers!");
				// .html( "State : Hover over a State.<br/>"+
				// 					"Gender : --<br/>"+
				// 					"Ages : --<br/>"+
				// 					"Race : --<br/>"+ 
				// 					"Population : --<br/>"+
				// 					"Death : --<br/>"+
				// 					"Crude Rate : --<br/>"+
				// 					"Year : --<br/>");
				
		});
		
		// .on("mouseclick",
		// function(d,i) {
		// 	d3.select("body").select("dod").style("fill", "red");
		// });
	
//	alert('map updated');
}