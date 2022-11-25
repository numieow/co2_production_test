export const loadAndProcessData = () => 
    Promise
    .all([        
    d3.csv('https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.csv'),
    //On import le json avec les frontières
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'), 
    //On import le csv avec les données qu'on veut, dans lequel on va filtrer pour n'avoir que ce qu'on veut
    d3.csv('static/data/owid-co2-data.csv')
])
    .then(([csvData, topoJSONdata, csvCO2]) => {

        const iso_alpha3 = {};
        csvData.forEach(d => {
            iso_alpha3[d['alpha-3']] = {code : d['country-code']};
        });

        //console.log(iso_alpha3);

        const csv_done = {};
        csvCO2.forEach(d => {
            if (d.iso_code && d.year == 2018) {
                if (iso_alpha3[d.iso_code]) {
                    const code = iso_alpha3[d.iso_code].code;
                    const co2 = parseFloat(d.co2) || 0;
                    csv_done[code] = {co2 : co2};
                    if (co2 <= 1) {
                        csv_done[code] = {co2 : co2, cat : "<= 1 million tons"};
                    } else if (co2 <= 10) {
                        csv_done[code] = {co2 : co2, cat : "<= 10 million tons"};
                    } else if (co2 <= 100) {
                        csv_done[code] = {co2 : co2, cat : "<= 100 million tons"};
                    } else if (co2 <= 1000) {
                        csv_done[code] = {co2 : co2, cat : "<= 1000 million tons"};
                    } else if (co2 <= 10000) {
                        csv_done[code] = {co2 : co2, cat : "<= 10000 million tons"};
                    } else if (co2 > 10000) {
                        csv_done[code] = {co2 : co2, cat : "> 10000 million tons"};
                    };
                };
            };
        });

        const countryName = {};
        csvData.forEach(d => {  
          countryName[d['country-code']] = d.name;
        });

        const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries);

        countries.features.forEach(d => {

            Object.assign(d.properties, countryName[d.id]);
            if (d.id && csv_done[d.id]) {
                Object.assign(d.properties, csv_done[d.id]);
            } else {
                const doc = {co2 : "Pas défini", cat : "Pas défini"};
                Object.assign(d.properties, doc);
            };
            
        });

        //console.log(countries);

        return countries;
});