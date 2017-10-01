const dataUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

const width = 1200
const height = 700
const radius = 7
const margin = {
  top: 20,
  right: 110,
  bottom: 50,
  left: 50
}

d3.json(dataUrl, data => {
  const minTime = data[0].Seconds

  data.map(d => {
    d.Seconds = d.Seconds - minTime
  })

  const svg = d3.select('svg')

  // format seconds
  const formatTime = d3.timeFormat('%H:%M')
  const formatMinutes = (d) => {
    const t = new Date(2012, 0, 1, 0, d)
    t.setSeconds(t.getSeconds() + d)
    return formatTime(t)
  }

  // scales for x
  const xMax = d3.max(data, d => d.Seconds)
  const xMin = d3.min(data, d => d.Seconds)

  const xScale = d3.scaleLinear()
    .domain([xMin, xMax + 10])
    .range([width - margin.right, margin.left])

  // scale for y
  const yMax = d3.max(data, d => d.Place)
  const yMin = d3.min(data, d => d.Place)

  const yScale = d3.scaleLinear()
    .domain([yMin, yMax + 3])
    .range([margin.top, height - margin.bottom])

  // define axis 
  const xAxis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(formatMinutes)

  const yAxis = d3.axisLeft()
    .scale(yScale)

  // render circles
  svg.selectAll('circle')
    .data(data)
    .enter().append('circle')
    .attr('r', radius)
    .attr('cx', d => xScale(d.Seconds))
    .attr('cy', d => yScale(d.Place))
    .style('fill', d => {
      if (d.Doping) {
        return 'red'
      } else {
        return 'green'
      }
    })
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut)

  // render names next to circles
  svg.selectAll('text')
    .data(data)
    .enter().append('text')
    .text(d => d.Name)
    .attr('x', d => xScale(d.Seconds))
    .attr('y', d => yScale(d.Place))
    .style('fill', d => '#000')
    .attr('transform', 'translate(20, 5)')

  // render legend
  svg.append('circle')
    .attr('r', radius)
    .attr('fill', 'green')
    .attr('cx', d => xScale(40))
    .attr('cy', d => yScale(20))

  svg.append('text')
    .text('No doping allegations')
    .style('font-size', '20')
    .attr('x', d => xScale(38))
    .attr('y', d => yScale(20))
    .attr('transform', 'translate(0, 5)')

  svg.append('circle')
    .attr('r', radius)
    .attr('fill', 'red')
    .attr('cx', d => xScale(40))
    .attr('cy', d => yScale(22))

  svg.append('text')
    .text('Riders with doping allegations')
    .style('font-size', '20')
    .attr('x', d => xScale(38))
    .attr('y', d => yScale(22))
    .attr('transform', 'translate(0, 5)')

  // append axis to chart
  svg.append('g')
    .attr('transform', `translate(${[0, height - margin.bottom]})`)
    .call(xAxis)
    .append('text')
    .attr('x', 1000)
    .attr('y', 45)
    .style('text-anchor', 'middle')
    .text('Minutes Behind Fastest Time')

  svg.append('g')
    .attr('transform', `translate(${[margin.left, 0]})`)
    .call(yAxis)
    .append('text')
    .attr('x', -30)
    .attr('y', -25)
    .style('text-anchor', 'end')
    .attr('transform', 'rotate(-90)')
    .text('Ranking')


  // show/hide tooltipe on mouse hover
  const divTooltip = d3.select('body')
    .append('div')
    .attr('class', 'tool-tip')

  function handleMouseOver(d) {
    d3.select(this)
      .attr('cursor', 'pointer')
      .attr('r', radius * 2)
    divTooltip.style('left', d3.event.pageX + 20 + 'px')
    divTooltip.style('top', d3.event.pageY - 25 + 'px')
    divTooltip.style('display', 'inline-block')
    divTooltip.transition()
      .duration(300)
      .style('opacity', 1)
    divTooltip.html(d.Name + ': ' + d.Nationality + '<br/>' +
      'Year: ' + d.Year + ', Time: ' + d.Time + '<br/><br/>' +
      d.Doping)
  }

  function handleMouseOut(d) {
    d3.select(this)
      .attr('r', radius)
    divTooltip.style('display', 'none')
    divTooltip.transition()
      .duration(300)
      .style('opacity', 0)
  }

  // style elements
  d3.selectAll('text')
    .attr('fill', '#000')
    .attr('font-size', '15')

})
