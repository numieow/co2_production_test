import { loadAndProcessData } from './loadAndProcessData.js';
import { colorLegend } from './colorLegend.js'

const svg = d3.select('svg');
const g = svg.append('g');

// La représentation Mercator du globe
//const projection = d3.geoNaturalEarth1();
const projection = d3.geoEquirectangular();

// PathGenerator -> l'input de geoPath est la projection définie au-dessus
const pathGenerator = d3.geoPath().projection(projection);

const colorLegendG = svg.append('g')
      .attr('transform', `translate(40, 300)`);

g.append('path')
      .attr('class', 'sphere')
      .attr('d', pathGenerator({type: "Sphere"}))

svg.call(d3.zoom()
            .on('zoom', (event) => {
                  //g est le "group element"
                  g.attr('transform', event.transform);
            }));

loadAndProcessData().then(countries => {

      const colorValue = d => d.properties.cat;

      const domaine = countries.features.map(colorValue);

      const colorScale = d3.scaleOrdinal()
                         .domain(domaine);

      const dom_tri = colorScale.domain().sort();
      const pas_def = dom_tri.pop();
      dom_tri.unshift(pas_def);
      dom_tri.reverse();

      //console.log(dom_tri);

      colorScale
            .domain(dom_tri)
            //Pour faire ça, faut créer entre 3 et 11 catégories de couleurs.
            .range(d3.schemeSpectral[colorScale.domain().length]);

      colorLegendG
            .call(colorLegend, {
                  colorScale, 
                  rectHeight: 23,
                  spacing: 28,
                  textOffset: 20, 
                  backgroundRectWidth: 180
            });

      g.selectAll('path')
            .data(countries.features)
            .enter().append('path')
                  .attr('d', pathGenerator)
                  .attr('class', 'country')
                  .attr('fill', d => colorScale(colorValue(d)))
            .append('title')
                  .text(d => d.properties.name + "\n Emitted CO2 : " + d.properties.co2 + " million tons");

});