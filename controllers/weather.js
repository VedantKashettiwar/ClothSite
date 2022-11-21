const fetch = require("node-fetch")

const url = 'https://weatherbit-v1-mashape.p.rapidapi.com/forecast/3hourly?lat=35.5&lon=-78.5';
const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '91b97c0bd3msh87fcde39a957e16p1673aejsn7d06c0f7c9b7',
      'X-RapidAPI-Host': 'weatherbit-v1-mashape.p.rapidapi.com'
    }
  };
const fetchWeather = async (req, res) => {
    try {
        const fetchData = await fetch(url,options).then((res)=> res.json())
        res.status(200).json(fetchData)
    }
    catch (err) {
        res.status(500).json('error:' + err)
    }
}

module.exports = {fetchWeather}