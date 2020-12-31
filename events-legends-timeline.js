var eventLegMargin = {top: 30, right: 30, bottom: 30, left: 50},
    eventLegWidth = window.screen.width - eventLegMargin.left - eventLegMargin.right,
    eventLegHeight = (100 - eventLegMargin.top - eventLegMargin.bottom)*5;

// append the canoneventLegline object to the body of the page
var legendEvents = d3.select("#legends_timeline")
  .append("svg")
    .attr("width", eventLegWidth + eventLegMargin.left + eventLegMargin.right)
    .attr("height", eventLegHeight + eventLegMargin.top + eventLegMargin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + eventLegMargin.left + "," + eventLegMargin.top + ")");

// Parse the Data
d3.csv("starwars - legends.csv", function(data) {

	var formatDate = d=> d < 0 ? `${d3.format(",")(-d)} BBY` : `${d} ABY`

	var num_cols = 5;

	var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
	.key(function(d) { return d.era;})
	.entries(data);
	// data = data.filter(function(d) {return d.Section == 0})
	var eras = sumstat.map(function(d){return d.key});    

	// var swcolors = ["#D7C078", "#E7250A","#0087E9","#5AC2F0", "#32E6AC", "#AF639E", "#343D9C"]
	var swcolors = ["#A1A333", "#EFAF82", "#9E5A60", "#0E5AA1", "#5FA0DE", "#453010",
					"#FBFFFE", "#3D5E78", "#D8DA8E", "#0C9197", "#353D9E",  "#007693",
					"#A7281C", "#FAA312", "#F26C28", "#BFAB87", "#E7250A", "#8A2238", "#1D652F"]
	var color = d3.scaleOrdinal()
			.domain(eras)
			// .range(["red", "orange", "yellow", "green", "blue", "purple"])
			.range(swcolors)	

	var years = d3.set(data.map(function(d) {return d.start})).values();

	var xOrd = d3.scaleBand()
		.domain(years)
		.range([0, eventLegWidth - eventLegMargin.left - eventLegMargin.right])

	var x = d3.scaleLinear()
      .domain([d3.min(data, d => +d.start), d3.max(data, d => +d.start)])
      .range([0, eventLegWidth - eventLegMargin.left - eventLegMargin.right])	

	var y = d3.scaleLinear()
	.domain([0, d3.max(data, function(d) { return +d["y-key"]; })])
	// .range([eventLegHeight - eventLegMargin.bottom - eventLegMargin.top, 0])
	.range([0, eventLegHeight - eventLegMargin.bottom - eventLegMargin.top])

    axisTop = d3.axisTop(xOrd)
    // .tickPadding(2)
    .tickFormat(formatDate) 
    .tickValues(xOrd.domain().filter(function(d,i){ return !(i%50)}));


	var startDate = d3.min(data, function(d) { return +d.start; });
	var endDate = d3.max(data, function(d) { return +d.start; });
	var num_days = (endDate)- (startDate)
	var w_axis = x(endDate)-x(startDate)
	// var scale_factor_2 = (w_axis)/num_days/num_cols	

  	var sz = xOrd.bandwidth();
  	var szH = (eventLegHeight - eventLegMargin.bottom - eventLegMargin.top)/d3.max(data, function(d) { return +d["y-key"]; });
  	var scale_factor_2 = sz;
  	// szH = 2;
    legendEvents
	  .append("g")
	  .attr("class", "axis")
	  // .attr("transform", (d,i)=>`translate(${0} ${eventLegHeight-eventLegMargin.bottom})`)
	  .call(axisTop)

	legendEvents.selectAll("rect")
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
	 		// return szH*(+d["y-key"]) 
	 })
	 .attr("width", sz*0.75)
	 .attr("height", szH*0.75)
	 .style("fill", function(d) {
	 		return color(d.era)
	 })
	   
	const spacingBetweenLegend  = 10
	var eventLegMarginLeft = 8;
    const legend = legendEvents.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(0,0)')

    const lg = legend.selectAll('g')
      .data(eras)
      .enter()
      .append('g')
      .attr('transform', 'translate(0,'+ -eventLegHeight/2 +')')

    lg.append('rect')
      .style('fill', d => color(d))
      .attr('x', 8)
      .attr('y', eventLegHeight/2-10)
      .attr('height', 10)
      .attr('width', 10)
      // .attr('cx', 8)
      // .attr('cy', -eventLegMargin.top-4)
      // .attr('r', 5)

    lg.append('text')
      .style('font-size', '12px')
      .attr('x', 25)
      .attr('y', eventLegHeight/2)
      .attr('fill', 'white')
      .text(d => d)

    const nodeWidth = (d) => d.getBBox().width

    var x_min;
    let offset = 0
    lg.each(function(d, i) {
      const x = offset
      offset += nodeWidth(this)
      x_min = x;
    });

    var nextLine = (eventLegWidth - eventLegMargin.left - eventLegMargin.right) < x_min;
    var target;
    // if (window.innerWidth <= 800) {
    //     target = eventLegWidth - eventLegMargin.left
    // } else {
    //     target =  eventLegWidth / 1.6;
    // }

    target = eventLegWidth - eventLegMargin.left;
    eventLegMarginLeft = nextLine == true? eventLegMarginLeft: 0;
    offset = eventLegMarginLeft;
    var yValue = eventLegHeight/2;

    lg.attr('transform', function(d, i) {
      var x = offset      
      offset += nodeWidth(this) + spacingBetweenLegend
      var ret;
      if(offset >= target && nextLine) {
          offset = nodeWidth(this) + spacingBetweenLegend + eventLegMarginLeft;
          yValue +=20;
          ret = `translate(${ eventLegMarginLeft }, ${yValue})`
      } else {
          ret = `translate(${x}, ${yValue})`
      }
      return  ret;
    })


    // legend.attr('transform', function() {
    //     if(window.innerWidth < 400 && nextLine) {
    //         return `translate(${(eventLegWidth - nodeWidth(this)) /  2},${-20})`
    //     } else {
    //         return `translate(${(eventLegWidth - nodeWidth(this)) /  2},${0})`
    //     }
    // })   	 

	 legendEvents.append("line")
	 	.attr("x1", xOrd("0"))
	 	.attr("x2", xOrd("0"))  
	 	.attr("y1", 0)
	 	.attr("y2", eventLegHeight-45) 
	 	.attr("stroke", "red")
	 	.attr("stroke-width", 0.5)
	 	.attr("transform", "translate(" + -sz*0.25/2 + ", 0)")
	 legendEvents.append("line")
	 	.attr("x1", xOrd("0")-100)
	 	.attr("x2", xOrd("0")+100)  
	 	.attr("y1", eventLegHeight-45)
	 	.attr("y2", eventLegHeight-45) 
	 	.attr("stroke", "red")
	 	.attr("stroke-width", 0.5)
	 	.attr("transform", "translate(" + -sz*0.25/2 + ", 0)")	
	 
	 legendEvents.append("text")
	 	.text("Battle of Yavin (0 BBY)")
	 	.attr("x", xOrd("0"))	 	 	
	 	.attr("y", eventLegHeight-25)
	 	.attr("fill", "white")
	 	.attr("text-anchor", "middle")
	 	.attr("font-size", "15px")

	 legendEvents.append("text")
	 	.text("Legends Timeline")
	 	.attr("x", xOrd("-14000000000"))	 	 	
	 	.attr("y", eventLegHeight/2)
	 	.attr("fill", "white")
	 	// .attr("text-anchor", "middle")
	 	.attr("font-size", "25px")	 	

})	