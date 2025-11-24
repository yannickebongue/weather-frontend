export default function(axios, https) {
    let operations = {
        get
    };

    async function get(req, res) {
        const config = {
            params: {
                name: req.query.name,
                count: req.query.count,
                language: req.query.language,
                countryCode: req.query.countryCode
            },
            httpsAgent: new https.Agent({  
                rejectUnauthorized: false
            })
        };
        const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search`, config);
        const results = response.data.results || [];
        res.status(200).json(results.map(element => ({
            id: element.id,
            name: element.name,
            latitude: element.latitude,
            longitude: element.longitude,
            elevation: element.elevation,
            timezone: element.timezone,
            country_code: element.country_code,
            country: element.country,
            population: element.population
        })));
    }

    return operations;
}
