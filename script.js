$( function() {

  var readings = [];

  var start = new Date().getTime();
  var end = start - 1000 * 60 * 60 * 24 * 31;
  function randomDate() {
    return new Date(start + Math.random() * (end-start));
  }

  for (var i=0; i<200;i++) {
    readings.push({
      date: randomDate(start, end),
      sugar: 40 + Math.floor(Math.random()*240)
    });
  }

  readings = readings.sort(function(a,b){
    return (a.date < b.date) ? -1 : 1
  });

  draw_graph(readings);
});

function draw_graph(data) {
  var results,
  chart,
  dots,
  margin = 100,
  w = 8,
  h = 200,
  x, y,
  width = 500,
  xAxis, yAxis;

  chart = d3.select( '#chart' ).append( 'svg' )
  .attr( 'class', 'chart' )
  .attr( 'width', width )
  .attr( 'height', h )
  .append('g');

  d3.select('svg g')
  .attr('transform', 'translate(50, 50)');

  x = d3.time.scale()
  .domain( [data[0].date, d3.time.day.offset(data[data.length - 1].date, 1)] )
  .range( [0, width - margin] )

  y = d3.scale.linear()
  .domain( [0, d3.max( data, function( d ) { return d.sugar; } )] )
  .rangeRound( [0, h - margin] );

  // safety bars
  var safeties = {
    low: 70,
    high: 140,
    x: x.range()[0],
    y: (h - margin) - y(140) + .5,
    width: (width - margin),
    height: y(140) -  y(70)  + .5

  };
  var bars = chart.append('g')
  .attr('class', 'safety');

  bars.append('rect')
  .attr('class', 'safe-sugar')
  .attr( 'x', safeties.x)
  .attr( 'y', safeties.y)
  .attr( 'width', safeties.width)
  .attr( 'height', safeties.height)
  ;


  // Bars
  dots = chart.append('g')
  .attr('class', 'dots');

  dots.selectAll( 'circle' )
  .data( data )
  .enter().append( 'circle' )
  .attr( 'cx', function( d, i ) { return x( d.date ) - .5; } )
  .attr( 'cy', function( d ) { return (h - margin) - y( d.sugar ) + .5 } )
  .attr( 'r', '.05ex')
  // .attr( 'width', w )
  // .attr( 'height', function( d ) { return y( d.population ) } )
  .append('g');

  // Axis
  xAxis = d3.svg.axis()
  .scale(x)
  .ticks(4)
  // .tickFormat(d3.time.format('%m/%d/%y'))
  .tickSize(10, 20, 1);

  yAxis = d3.svg.axis()
  .scale(d3.scale.linear().domain( [0, d3.max( data, function( d ) { return d.sugar || 0; } )] ).rangeRound( [h - margin, 0] ))
  .ticks(7)
  .tickSize(6, 3, 1)
  .orient('left');
  // .orient('right');

  chart.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0, ' + (h - margin) + ')')
  .call(xAxis);

  chart.append('g')
  .attr('class', 'y axis')
  // .attr('transform', 'translate(' + x.range()[1] + ')')
  .call(yAxis);

}
