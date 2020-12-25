var fullMargin = {top: 30, right: 30, bottom: 30, left: 30},
    fullHeight = 5000 - fullMargin.left - fullMargin.right,
    fullWidth = (1097.8010471204188 - fullMargin.top - fullMargin.bottom);

// append the canoneventline object to the body of the page
var svg = d3.select("#events_full_timeline")
  .append("svg")
    .attr("width", fullWidth + fullMargin.left + fullMargin.right)
    .attr("height", fullHeight + fullMargin.top + fullMargin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + fullMargin.left + "," + fullMargin.top + ")");

//Build checkboxes
var filter_list = ["Original Trilogy", "Prequel Trilogy", "Sequel Trilogy", "Anthology Films", "The Clone Wars", "The Mandalorian", "Rebels", "Resistance", "Extended Universe"]

var swcolors_media = ["#78ED74", "#A43837", "#E0AA5A", "#70318F" , "#EEF0F1", "#5F91CA", "#EF7219", "#8CDBE2", "#CC88D3"]
var media_color = d3.scaleOrdinal()
		 .domain(filter_list)
		 .range(swcolors_media)

d3.select("#filter")
    .selectAll("input")
    .data(filter_list)
    .enter()
    .append("label")
    .attr("class", "switch")
    .append("input")
    .attr("type", "checkbox")
    .attr("class", "filter-check")
    .property("checked", true)
    .attr("value", function (d) {
        return d
    })
    .attr("id", function (d) {
        return d
    });

var spans = d3.selectAll("label")
    .data(filter_list)
    // .attr("class", "checkbox")	    	    
    .append("span")
    .attr("class", "saber-switch")
    .attr("id", function(d, i) { return d.split(' ').join('_') +"sabers"; })
    // .data([1,2])
    // .enter()
    // .append("span")
    // .attr("class", "bar")

spans.append("span")
	.attr("class", "bar")
	.style("border-right-color", function(d) {
		return media_color(d);
	})
	.style("box-shadow", function(d) {
		return "0.4em 0 0.6em 0.1em " + media_color(d);
	})

spans.append("span")
	.attr("class", "bar")
	.style("border-right-color", function(d) {
		return media_color(d);
	})
	.style("box-shadow", function(d) {
		return "0.4em 0 0.6em 0.1em " + media_color(d);
	})

d3.selectAll("label")
    .data(filter_list)
    // .attr("class", "checkbox")	    	    
    .append("text")
    .attr("class", "text-label")
    .text(function (d) {
        return d
    })
    .style('color', function(d) {
    	return media_color(d)
    })
    // .style('color', "white")    

var formatDate = d=> d < 0 ? `${d3.format(",")(-d)} BBY` : `${d} ABY`
//unnecessary
var num_cols = 5;

function loadTimeline(choices, filter) {
	d3.csv("starwars_src_cleaned_v2.csv", function(data) {
		d3.selectAll(".rect-event").remove();
		d3.select("#vline").remove();
		d3.selectAll(".svg-label").remove()

		data = data.sort(function(a,b) {return a.start - b.start});
		var years = d3.set(data.map(function(d) {return d.start})).values();
		var sz = (fullHeight - fullMargin.bottom - fullMargin.top)/years.length;
		//master color scheme for eras
		var swcolors_master = ["#A1A333", "#D5BE78", "#EFAF82", "#E7250A", "#9E5B60", "#0E5AA1", "#5FA0DE", "#453110", "#FBFFFE", "#3D5E78", "#D8DA8E", "#0C9198", "#353E9F", "#027693", "#A7281C", "#FBA411", "#0387E9", "#F26C28", "#BFAB87", "#5AC2F1", "#E7250A", "#1D652F", "#8A2239", "#32E6AC", "#AF639E", "#343D9D"]

		var color;
		//nest data by era
		if (filter == "era_cleaned") {
			var sumstat = d3.nest()
				.key(function(d) { return d.era;})
				.entries(data);

			var eras = sumstat.map(function(d){return d.key});    

			color = d3.scaleOrdinal()
					.domain(eras)
					.range(swcolors_master)	
		}	
		else {
			color = media_color
		}

		if (choices.length > 0) {
		    data = data.filter(function (d, i) {
		    	return choices.indexOf(d["source_cleaned"]) >= 0;
		        // return _.includes(decodeURIComponent(choices), d["source_cleaned"]);
		    });
		} else {
		    data = csv; // so that no boxes checked shows all data
		}	

		var years = d3.set(data.map(function(d) {return d.start})).values();

		var y = d3.scaleBand()
			.domain(years)
			.range([0, fullHeight - fullMargin.top - fullMargin.bottom])

		var x = d3.scaleLinear()
			.domain([-d3.max(data, function(d) { return +d["y-key"]/2; }), d3.max(data, function(d) { return +d["y-key"]/2; })])
			.range([0, fullWidth - fullMargin.left - fullMargin.right])

		var startDate = d3.min(data, function(d) { return +d.start; });
		var endDate = d3.max(data, function(d) { return +d.start; });
		var num_days = (endDate)- (startDate)
		var w_axis = x(endDate)-x(startDate)


	    var movieData = []

	    movieData[0] = {"start": -32, "end": -19, "section": 2, "text": "Prequel Trilogy", "text_x": -25}
	    movieData[1] = {"start": 0, "end": 4, "section": 3, "text": "Original Trilogy", "text_x": 0}
	    movieData[2] = {"start": 34, "end": 35, "section": 3, "text": "Sequel Trilogy", "text_x": 34}	
	    
	    svg.selectAll(".myRects")
	    	.data(movieData)
	    	.enter()
	    	.append("rect")
	    	.attr("class", "movie-rect")
	    	.attr("x", 0)
	    	.attr("y", function(d) {return y(d.start)})		
	    	.attr("width", fullWidth)
	    	.attr("height", function(d) {return y(d.end) - y(d.start)})
	    	.style("fill", function(d) {
	    		if (d.text != "Sequel Trilogy") {
	    			return media_color(d.text);
	    		}
	    		return "yellow";
	    	})
	    	.style("fill-opacity", 0.33)

	    svg.selectAll(".myLabels")
	    	.data(movieData)
	    	.enter()
	    	.append("text")
	    	.attr("class", "movie-rect")
	    	.attr("x", 0+5)
	    	.attr("y", function(d) {return y(d.start)-5})		
	    	.text(function(d) {return d.text});

		var yrs = [-13000000000, -36453, -24500, -6900, -4250, -3976, -3959, -1100, -1000, -800, -200, -112, -82, -64, -52, -44, 20, 26, 40, 139]
		var events = ["The galaxy is formed", "The Je'daii Order is created", "First great schism in the Jedi Order", "The Sith empire is discovered", "The Dark Jedi wage war on Coruscant", 
			"The Mandalorian Wars begin", "The Jedi Civil War begins", "The Republic Dark Age begins", "Darth Bane establishes the Rule of Two", "Yoda begins to train Jedi", "Chewbacca is born",
			"C-3PO is created", "Darth Sidious is born", "Qui-Gon Jinn becomes a Jedi Knight", "Jango Fett becomes Mandalore", "The Great Clan Wars begin",
			"Luke Skywalker marries Mara Jade", "Ben Skywalker is born", "Jacen Solo falls to the dark side",
			"Ania Solo ends Darth Wredd's insurgency"]	

		yrs = yrs.map( function(x, i) { return {"year": x, "event": events[i]}});

		svg.selectAll(".annotation")
			.data(yrs)
			.enter()
			.append("line")
			.attr("class", "svg-label")
		 	.attr("x1", x(0) + sz*2)
		 	.attr("x2", x(0) + 300)  
		 	.attr("z-index", 0)
		 	// .attr("y1", y(-13000000000)+sz*1.4/4)
		 	.attr("y1", function(d) {return y(d.year) + sz*1.4/4})
		 	// .attr("y2", y(-13000000000)+sz*1.4/4)
		 	.attr("y2", function(d) {return y(d.year) + sz*1.4/4})
		 	.attr("stroke", "white")
		 	.attr("stroke-width", 1)

		svg.selectAll(".annotation")
			.data(yrs)
			.enter()
			.append("text")
			.attr("class", "svg-label")
		 	.attr("x", x(0) + sz*2)
		 	.attr("x", x(0) + 300)  
		 	// .attr("y", y(-13000000000)+sz*1.4/4)
		 	.attr("y", function(d) {return y(d.year) + sz*1.4/4})
		 	.text(function(d) {return d.event})	
		 	.attr("text-anchor", "end") 
		 	.attr("alignment-baseline", "hanging")	
		 	.style("font-weight", "lighter")	

		svg.selectAll(".annotation")
			.data(yrs)
			.enter()
			.append("text")
			.attr("class", "svg-label")
		 	.attr("x", x(0) + sz*2)
		 	.attr("x", x(0) + 300)  
		 	// .attr("y", y(-13000000000)+sz*1.4/4 - 5)
		 	.attr("y", function(d) {return y(d.year) + sz*1.4/4 - 5})
		 	.text("13,000,000 BBY")	
		 	.text(function(d) {return formatDate(d.year)})
		 	.attr("text-anchor", "end") 
		 	// .attr("alignment-baseline", "hanging")	
		 	.style("font-weight", "lighter")
	  	// var sz = (fullHeight - fullMargin.bottom - fullMargin.top)/years.length;

	  	//width calc
	  	//console.log(d3.max(data, function(d) { return +d["y-key"]})*sz + fullMargin.left + fullMargin.right)

		var tip = d3.tip()
		 .attr('class', 'd3-tip')
		 .offset(d => [-10, 0])
		 .html(function(d) {
		  // console.log(d);
		   return "<div>" +
		           // "<span style='color:black; font-weight:600'>" + formatDate(d.start) + "</span>" +
		           "<span style='color:black; font-weight:600'>" + d.yr_cleaned + "</span>"  +
		           "<span style='color:" + color(d.era) + "; font-weight:600'> (" + d.era + ")</span><br/>" +
		           "<span style='color:black'>" + d.event_cleaned + "</span><br/><br/>" +
		           "<span style='color:black'>Source Text: " + d.source_text + "</span><br/>"
		           "</div>"
		 })
		svg.call(tip)	  

		svg.selectAll(".eventRects")
		 .data(data)
		 .enter()
		 .append("rect")
		 .attr("class", "rect-event")
		 .attr("x", function(d, i) {
				if (d["type"] != "Legends") {	 			
		 			return x(-Math.floor((+d["sub-key"])/2)-1)
		 		}
		 		else {
		 			return x(Math.floor((+d["sub-key"])/2)+1)
		 		}
		 })
		 .attr("y", function(d, i) {
		 		// return y(Math.floor((+d["y-key"])/num_cols));
		 		return y(d["start"])
		 })
		 .attr("width", sz/1.4)
		 .attr("height", sz/1.4)
		 .attr("z-index", 10)
		 // .attr("height", y.bandwidth()*.8)
		 .style("fill", function(d) {
		 	if (filter == "era_cleaned") {		 		
		 		return color(d.era)
		 	}
		 	else {
		 		return color(d["source_cleaned"])
		 	}
		 })
		 .on('mouseover', function(d) {
		   tip.show(d, this)
		   d3.select(this).attr('fill', 'lightgray')                      
		  })
		 .on('mouseout', function(d) {
		   tip.hide(d, this)
		   d3.select(this).attr('fill', color(d.era_cleaned))
		 })	 

		svg.append("line")
			.attr("id", "vline")
		 	.attr("x1", x(0) + sz/2)
		 	.attr("x2", x(0) + sz/2)  
		 	.attr("y1", 0)
		 	.attr("y2", fullHeight - fullMargin.top - fullMargin.bottom) 
		 	.attr("stroke", "white")
		 	.attr("stroke-width", 1)	
		 	.attr("tranform", "translate(" + sz + "," + sz + ")")

		svg.append("line")
		 	.attr("x1", x(0) - 30 + sz)
		 	.attr("x2", x(0) + 30)  
		 	.attr("y1", 0 - 5)
		 	.attr("y2", 0 - 5) 
		 	.attr("stroke", "white")
		 	.attr("stroke-width", 1)	
		 	.attr("tranform", "translate(" + sz/2 + "," + -sz + ")")		 	


		svg.append("line")
		 	.attr("x1", x(0) - 30 + sz)
		 	.attr("x2", x(0) + 30)  
		 	.attr("y1", fullHeight - fullMargin.top - fullMargin.bottom + 5)
		 	.attr("y2", fullHeight - fullMargin.top - fullMargin.bottom + 5)
		 	.attr("stroke", "white")
		 	.attr("stroke-width", 1)	
		 	.attr("tranform", "translate(" + sz/2 + "," + -sz + ")")		 	


		svg.append("text")
			.text("CANON")
			.attr("class", "svg-label")
			.style("font-family", "trajan-pro-3")
			.style("font-size", "80px")
			.style("opacity", 0.7)
			.style("font-weight", 199)
			.attr("transform", "translate(" + fullMargin.left*2 + ",350) rotate(270)")

		svg.append("text")
			.text("LEGENDS")
			.attr("class", "svg-label")
			.attr("text-anchor", "middle")
			.style("font-family", "trajan-pro-3")
			.style("font-size", "80px")
			.style("opacity", 0.7)
			.style("font-weight", 199)
			.attr("transform", "translate(" + (fullWidth - fullMargin.right*2) + ",200) rotate(90)")
		 // .on("mouseover", etc.)
	})

 // Parse the Data
}

loadTimeline(filter_list, "era_cleaned");

var checkBox = d3.selectAll(".filter-check")

checkBox.on("change", function () {
	var choices = []
	var checkboxes = document.querySelectorAll('input[type=checkbox]')
	var unchecked = []

	for (var i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i]["checked"]) {
			choices.push((checkboxes[i].value))
		}
	    else {
	    	unchecked.push((checkboxes[i].value))
	    }
	}

	for (var i = 0; i <unchecked.length; i ++) {
		console.log(filter_list)
		console.log(unchecked[i])
		d3.select("#" + unchecked[i].split(' ').join('_') + "sabers").selectAll(".bar").style("box-shadow", "none").style("border-right-color", "#d6d6d6")
	}

	for (var i = 0; i <choices.length; i ++) {
		d3.select("#" + choices[i].split(' ').join('_') + "sabers").selectAll(".bar")
			.style("box-shadow", function(d) {
				return "0.4em 0 0.6em 0.1em " + media_color(d);
			})
			.style("border-right-color", function(d) {
				return media_color(d);
			})
	}

	var form = document.getElementById("color_filter")
	var form_val;
	for(var i=0; i<form.length; i++) {		
		if (form[i].checked) {
			form_val = form[i].id;
		}		
	}	

	console.log(choices)

	loadTimeline(choices, form_val);	 
})

var radioButtons = d3.selectAll(".filter-radio")

radioButtons.on("change", function() {	
	var choices = []
	var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
	for (var i = 0; i < checkboxes.length; i++) {
	    choices.push(checkboxes[i].value)
	}

	var form = document.getElementById("color_filter")
	var form_val;
	for(var i=0; i<form.length; i++) {		
		if (form[i].checked) {
			form_val = form[i].id;
		}
	}	

	loadTimeline(choices, form_val);
})