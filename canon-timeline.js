// set the dimensions and timeMargins of the graph
var timeMargin = {top: 30, right: 30, bottom: 30, left: 30},
    timeWidth = window.screen.width - timeMargin.left - timeMargin.right,
    timeHeight = (100 - timeMargin.top - timeMargin.bottom)*8;

// append the canonTimeline object to the body of the page
var canonTimeline = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", timeWidth + timeMargin.left + timeMargin.right)
    .attr("height", timeHeight + timeMargin.top + timeMargin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + timeMargin.left + "," + timeMargin.top + ")");

// Parse the Data
d3.csv("starwars - erasv2.csv", function(data) {

  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.era_label;})
    .entries(data);
  // data = data.filter(function(d) {return d.Section == 0})
  var eras = sumstat.map(function(d){return d.key});
  var sections = [0,1,2,3]

  // var swcolors = ["#D7C078", "#E7250A","#0087E9","#5AC2F0", "#32E6AC", "#00BFAA", "#AF639E"]
  var swcolors = ["#D7C078", "#E7250A","#0087E9","#5AC2F0", "#32E6AC", "#AF639E", "#343D9C"]
  var color = d3.scaleOrdinal()
  		.domain(eras)
  		// .range(["red", "orange", "yellow", "green", "blue", "purple"])
  		.range(swcolors)

  // y= d3.scaleBand()
  //   .domain(eras)
  //   .range([0,height - timeMargin.bottom - timeMargin.top])
  //   .padding(0.2)  
  var formatDate = d=> d < 0 ? `${d3.format(",")(-d)} BBY` : `${d} ABY`
  var x = {}

  y = d3.scaleBand()
	.domain(sections)
	.range([0,timeHeight - timeMargin.bottom - timeMargin.top])
	.padding(0.2)  

for (i = 0; i<= 3; i++) {
	var temp = data.filter(function(d) {return d.Section == i})
	// filtered.append(temp)
	x[i] = d3.scaleLinear()
      .domain([d3.min(temp, d => +d.start), d3.max(temp, d => +d.end)])
      .range([0, timeWidth - timeMargin.left - timeMargin.right]) 

    axisTop = d3.axisTop(x[i])
    .tickPadding(2)
    .tickFormat(formatDate)
    // .tickValues(x[i].domain().filter(function(d, i) { return d !=40 ; }))

    canonTimeline
	  .append("g")
	  .attr("class", "axis")
	  .attr("transform", "translate(0, " + y(i) + ")")
	  .call(axisTop)
}






    
// x = d3.scaleLinear()
//       .domain([d3.min(data, d => +d.start), d3.max(data, d => +d.end)])
//       // .range([0, width - timeMargin.left - timeMargin.right])    

  // Add X axis
  // var x = d3.scaleLinear()
  //   .domain([0, 13000])
  //   .range([ 0, width]);
  // canonTimeline.append("g")
  //   .attr("transform", "translate(0," + height + ")")
  //   .call(d3.axisBottom(x))
  //   .selectAll("text")
  //     .attr("transform", "translate(-10,0)rotate(-45)")
  //     .style("text-anchor", "end");

  // // Y axis
  // var y = d3.scaleBand()
  //   .range([ 0, height ])
  //   .domain(data.map(function(d) { return d.Country; }))
  //   .padding(.1);
  // canonTimeline.append("g")
  //   .call(d3.axisLeft(y))
  function isLabelRight(start, end, x) {

  	return Math.abs(x(start) - x(end)) > timeWidth/2;
  		// if (x(start) > width/2) {
  		// 	return x(end) < width;  			
  		// }
  		// else {
  		// 	return 2*x(start) - x(end) > 0;
  		// }
  }
  // //Bars

  canonTimeline.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d) {return x[d.Section](d.start)} )
    .attr("rx", y.bandwidth()/8)
    .attr("y", function(d) { return y(d.Section); })
    .attr("width", function(d) { return x[d.Section](d.end) - x[d.Section](d.start); })
    .attr("height", y.bandwidth()/2 )
    .attr("fill", function(d) {return color(d.era_label)})
    .attr("tranform", "translate(1,100)")

  canonTimeline.selectAll("myText")
    .data(data)
    .enter()
    .append("text")
    .text(function(d) {return d['sub-sub-era']})
    .attr("x", function(d) {return x[d.Section](d.start)-5} )
    .attr("x", function(d) {
    	if (!isLabelRight(d.start, d.end, x[d.Section])) {
    		return x[d.Section](d.start)-5; 
    	}
    	else {
			return (x[d.Section](d.end) + x[d.Section](d.start))/2 -5;
    	}
    })
    .attr("font-size", "10px")
    .attr("y", function(d, i) {
    	if (i % 2 == 0) {
    		return y(d.Section); 
    	}
    	else {
    		return y(d.Section) + y.bandwidth()/1.5; 
    	} 
    	
    })
    .attr("y", function(d, i) {
    		return y(d.Section) + y.bandwidth()/1.5; 
    	
    })    
    .attr("fill", "white")
    .attr("fill", function(d) {return color(d.era_label)})
    .attr("transform", "translate(" + y.bandwidth()/8 +", 2)")    // .attr("y", function(d) {

    var movieData = []

    movieData[0] = {"start": -32, "end": -19, "section": 2, "text": "Prequels", "text_x": -25}
    movieData[1] = {"start": 0, "end": 4, "section": 3, "text": "Original Trilogy", "text_x": 0}
    movieData[2] = {"start": 34, "end": 35, "section": 3, "text": "Sequels", "text_x": 34}



//draw movie annotations

	canonTimeline.selectAll("movieAnno")
	   .data(movieData)
	   .enter()
	   .append("line")
	   	.attr("x1", function(d) { return x[d.section](+d.start)})
	   	.attr("x2", function(d) {return x[d.section](+d.end)})
	   	.attr("y1", function(d) {return y(d.section)+y.bandwidth()*0.25})
	   	.attr("y2", function(d) {return y(d.section)+y.bandwidth()*0.25})
	   	.attr("stroke", "#DDDFEE")
	   	// .attr("stroke-width", 2)
	   	// .attr("stroke-dasharray", (3,2))
	   	.attr("class", "first")
	   	.attr("fill", "none")

	canonTimeline.selectAll("movieAnno")
	   .data(movieData)
	   .enter()
	   .append("text")
	   	.text(function(d) {return" " + d.text})
	   	.attr("x", function(d) {  return x[d.section](+d.start) + 5})
	   	.attr("y", function(d) {return y(d.section)+y.bandwidth()*0.25})
	   	.attr("fill", "#DDDFEE")
	   	.attr("font-size", "10px")
	   	// .attr("stroke-width", 2)
	   	.attr("class", "first")

	canonTimeline.selectAll("movieAnno")
	   .data(movieData)
	   .enter()
	   .append("line")
	   	.attr("x1", function(d) { return x[d.section](+d.start)})
	   	.attr("x2", function(d) { return x[d.section](+d.start)})
	   	.attr("y1", function(d) {return y(d.section)+y.bandwidth()*0.1})
	   	// .attr("y1", function(d) {return y(d.section)})
	   	.attr("y2", function(d) {return y(d.section)+y.bandwidth()*0.4})
	   	.attr("stroke", "#DDDFEE")
	   	// .attr("stroke-width", 2)
	   	.attr("class", "first")
	   	.attr("fill", "none")	

	canonTimeline.selectAll("movieAnno")
	   .data(movieData)
	   .enter()
	   .append("line")
	   	.attr("x1", function(d) { return x[d.section](+d.end)})
	   	.attr("x2", function(d) { return x[d.section](+d.end)})
	   	.attr('y1', 0)
	   	.attr("y1", function(d) {return y(d.section)+y.bandwidth()*0.1})
	   	.attr("y2", function(d) {return y(d.section)+y.bandwidth()*0.4})
	   	.attr("stroke", "#DDDFEE")
	   	// .attr("stroke-width", 2)
	   	.attr("class", "first")
	   	.attr("fill", "none")		   	   	


                  	
//draw horizontal legend
	const spacingBetweenLegend  = 10
	var timeMarginLeft = 8;
    const legend = canonTimeline.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(0,0)')

    const lg = legend.selectAll('g')
      .data(eras)
      .enter()
      .append('g')

    lg.append('rect')
      .style('fill', d => color(d))
      .attr('x', 8)
      .attr('y', -timeMargin.top-10)
      .attr('height', 10)
      .attr('width', 10)
      // .attr('cx', 8)
      // .attr('cy', -timeMargin.top-4)
      // .attr('r', 5)

    lg.append('text')
      .style('font-size', '12px')
      .attr('x', 25)
      .attr('y', -timeMargin.top)
      .attr('fill', 'white')
      .text(d => d)

    const nodeWidth = (d) => d.getBBox().width

    var x_min;
    let offset = 0
    lg.each(function(d, i) {
      const x = offset
      offset += nodeWidth(this) + 10
      x_min = x;
    });

    var nextLine = (timeWidth - 2*timeMargin.left - 2*timeMargin.right) < x_min;
    var target;
    if (window.innerWidth <= 800) {
        target = timeWidth - timeMargin.left
    } else {
        target =  timeWidth / 1.6;
    }

    timeMarginLeft = nextLine == true? timeMarginLeft: 0;
    offset = timeMarginLeft;
    var yValue = 10;

    lg.attr('transform', function(d, i) {
      var x = offset      
      offset += nodeWidth(this) + spacingBetweenLegend
      var ret;
      if(offset >= target && nextLine) {
          offset = nodeWidth(this) + spacingBetweenLegend + timeMarginLeft;
          yValue +=20;
          ret = `translate(${ timeMarginLeft }, ${yValue})`
      } else {
          ret = `translate(${x}, ${yValue})`
      }
      return  ret;
    })

    legend.attr('transform', function() {
        if(window.innerWidth < 400 && nextLine) {
            return `translate(${(timeWidth - nodeWidth(this)) /  2},${-20})`
        } else {
            return `translate(${(timeWidth - nodeWidth(this)) /  2},${0})`
        }
    })   

    // 	if (isLabelRight(d.start, d.end)) {
    // 		return 0;
    // 	}
    // 	else {
    // 		return height;
    // 	}
    // })
    // // .attr("y", function(d) { return y(d.era_label); })


    // .attr("x", function(d) { return x(d.Country); })
    // .attr("y", function(d) { return y(d.Value); })
    // .attr("width", x.bandwidth())
    // .attr("height", function(d) { return height - y(d.Value); })
    // .attr("fill", "#69b3a2")

})
