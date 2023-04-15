export const colorLegend = (selection, props) => {
    const {
        colorScale, 
        rectHeight,
        spacing,
        textOffset, 
        backgroundRectWidth
    } = props;

    const backgroundRect = selection.selectAll('rect')
        .data([null]);
    const taille = colorScale.domain().length;
    backgroundRect
        .enter()
        .append('rect')
        .merge(backgroundRect)
        .attr('x', -rectHeight * 1.5)
        .attr('y', -rectHeight* 1.5)
        .attr('rx', rectHeight * 2)
        .attr('width', backgroundRectWidth)
        .attr('height', spacing * taille + rectHeight * 2)
        .attr('fill', 'white')
        .attr('opacity', 0.8);

    const groups = selection.selectAll('g')
        .data(colorScale.domain());
    const groupsEnter = groups
        .enter().append('g')
        .attr('class', 'tick');
    groupsEnter 
        .merge(groups)
        .attr('transform', (d, i) => 
            `translate (0, ${i * spacing})`
            );
    groups.exit().remove();

    groupsEnter.append('rect')
        .merge(groups.select('rect'))
            .attr('x', '-0.32em')
            .attr('y', '-0.75em')
            .attr('height', rectHeight)
            .attr('width', rectHeight)
            .attr('fill', colorScale);

    groupsEnter.append('text')
        .merge(groups.select('text'))
            .text(d => d)
            .attr('dy', '0.32em')
            .attr('x', textOffset);
}