var eventMargin = {top: 30, right: 30, bottom: 30, left: 30},
    eventWidth = window.screen.width - eventMargin.left - eventMargin.right,
    eventHeight = (100 - eventMargin.top - eventMargin.bottom)*8;

// append the canonTimeline object to the body of the page
var svg = d3.select("#events_timeline")
  .append("svg")
    .attr("width", eventWidth + eventMargin.left + eventMargin.right)
    .attr("height", eventHeight + eventMargin.top + eventMargin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + eventMargin.left + "," + eventMargin.top + ")");

// Parse the Data
d3.csv("starwars - events.csv", function(data) {

	console.log(data)	

})	
