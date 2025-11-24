export default function(axios, https) {
    let operations = {
        get
    };

    async function get(req, res) {
        const config = {
            params: {
                latitude: req.query.latitude,
                longitude: req.query.longitude,
                current: "temperature_2m",
                timeformat: "unixtime"
            },
            httpsAgent: new https.Agent({  
                rejectUnauthorized: false
            })
        };
        const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, config);
        const data = response.data;
        res.status(200).json({
            latitude: data.latitude,
            longitude: data.longitude,
            elevation: data.elevation,
            timezone: data.timezone,
            time: new Date(data.current.time * 1000).toISOString(),
            temperature: data.current.temperature_2m
        });
    }

    return operations;
}
