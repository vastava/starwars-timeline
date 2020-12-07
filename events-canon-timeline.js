var eventMargin = {top: 30, right: 30, bottom: 30, left: 30},
    eventWidth = window.screen.width - eventMargin.left - eventMargin.right,
    eventHeight = (100 - eventMargin.top - eventMargin.bottom)*8;

// append the canonTimeline object to the body of the page
var canonEvents = d3.select("#events_timeline")
  .append("svg")
    .attr("width", eventWidth + eventMargin.left + eventMargin.right)
    .attr("height", eventHeight + eventMargin.top + eventMargin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + eventMargin.left + "," + eventMargin.top + ")");

// Parse the Data
d3.csv("starwars - Sheet6.csv", function(data) {

	console.log(data)	
	var formatDate = d=> d < 0 ? `${d3.format(",")(-d)} BBY` : `${d} ABY`

	var num_cols = 1;

	var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
	.key(function(d) { return d.era;})
	.entries(data);
	// data = data.filter(function(d) {return d.Section == 0})
	var eras = sumstat.map(function(d){return d.key});    

	var swcolors = ["#D7C078", "#E7250A","#0087E9","#5AC2F0", "#32E6AC", "#AF639E", "#343D9C"]
	var color = d3.scaleOrdinal()
			.domain(eras)
			// .range(["red", "orange", "yellow", "green", "blue", "purple"])
			.range(swcolors)	
	// data = data.filter(function(d) {return +d.start <= -5000 })	
	// data = data.filter(function(d) {return +d.start >= -20 })	

	var years = d3.set(data.map(function(d) {return d.start})).values();

	var xOrd = d3.scaleBand()
		.domain(years)
		.range([0, eventWidth - eventMargin.left - eventMargin.right])

	var x = d3.scaleLinear()
      .domain([d3.min(data, d => +d.start), d3.max(data, d => +d.start)])
      .range([0, eventWidth - eventMargin.left - eventMargin.right])	

	var y = d3.scaleLinear()
	.domain([0, d3.max(data, function(d) { return +d["y-key"]; })])
	.range([eventHeight - eventMargin.bottom - eventMargin.top, 0])

    axisBottom = d3.axisBottom(xOrd)
    // .tickPadding(2)
    .tickFormat(formatDate) 
    .tickValues(xOrd.domain().filter(function(d,i){ return !(i%10)}));

    //comment out
         

	var startDate = d3.min(data, function(d) { return +d.start; });
	var endDate = d3.max(data, function(d) { return +d.start; });
	var num_days = (endDate)- (startDate)
	var w_axis = x(endDate)-x(startDate)

	// var scale_factor_2 = (w_axis)/num_days/num_cols	

  	var sz = xOrd.bandwidth();
  	var scale_factor_2 = sz;
    canonEvents
	  .append("g")
	  .attr("class", "axis")
	  .attr("transform", (d,i)=>`translate(${0} ${eventHeight-eventMargin.bottom})`)
	  .call(axisBottom)

	canonEvents.selectAll("rect")
	 .data(data)
	 .enter()
	 .append("rect")
	 .attr("x", function(d) {
	 		// console.log(xOrd(d.start))
	 		// return x(+d.start);
	 		return xOrd(d.start)
	 })
	 // .attr("transform", function(d) {
	 // 		return "translate(" + scale_factor_2*((+d["y-key"]) % num_cols) + ",0)";
	 // 		// return "translate(0, " + sz*0.5 + ""
	 // })
	 .attr("y", function(d, i) {
	 		// return y(Math.floor((+d["y-key"])/num_cols));
	 		return y(+d["y-key"])
	 })
	 .attr("width", sz*0.75)
	 .attr("height", sz*0.175)
	 .style("fill", function(d) {
	 		return color(d.era)
	 })	   
	console.log('sz' + sz*0.175)
	 canonEvents.append("line")
	 	.attr("x1", xOrd("0"))
	 	.attr("x2", xOrd("0"))  
	 	.attr("y1", 0)
	 	.attr("y2", y(0)+sz*0.175) 
	 	.attr("stroke", "red")
	 	.attr("stroke-width", 0.5)
	 	.attr("transform", "translate(" + -sz*0.25/2 + ", 0)")
	 canonEvents.append("line")
	 	.attr("x1", xOrd("0")-100)
	 	.attr("x2", xOrd("0")+100)  
	 	.attr("y1", 0)
	 	.attr("y2", 0) 
	 	.attr("stroke", "red")
	 	.attr("stroke-width", 0.5)
	 	.attr("transform", "translate(" + -sz*0.25/2 + ", 0)")	
	 
	 canonEvents.append("text")
	 	.text("Battle of Yavin (0 BBY)")
	 	.attr("x", xOrd("0"))	 	 	
	 	.attr("y", 0-5)
	 	.attr("fill", "white")
	 	.attr("text-anchor", "middle")
	 	.attr("font-size", "15px")
	 
	 canonEvents.append("text")
	 	.text("Canon Timeline")
	 	.attr("x", xOrd("-35000"))	 	 	
	 	.attr("y", 0-5)
	 	.attr("fill", "white")
	 	// .attr("text-anchor", "middle")
	 	.attr("font-size", "25px")	

})	