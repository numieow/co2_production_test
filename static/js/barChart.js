const margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


const svg = d3.select('#barChart')
                .append('svg')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr('border', '1px solid blue');

const g = svg.append('g');

const data = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5];

g.selectAll("bar")
    .data(data.sort())
    .enter()    
    .append("rect")
        .attr('class', 'bar')
        .attr('x', (d, i) => {
            for (i > 0; i < data.length; i++) {
                return i*21;
            }
        })
        .attr('y', d => height - d*50)
        .attr('fill', 'steelblue')
        .attr('width', 20)
        .attr('height', d => d*50);