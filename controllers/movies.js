const axios = require("axios");



const fetchMovies = async (req,res)=>{
    try{
        const limit = req.query.limit
        const page = req.query.page
        const keyword = req.query.keyword

        const options = {
            method: 'GET',
            url: 'https://imdb8.p.rapidapi.com/title/v2/find',
            params: {title: keyword, limit: limit, paginationKey: page, sortArg: 'moviemeter,asc'},
            headers: {
              'X-RapidAPI-Key': '91b97c0bd3msh87fcde39a957e16p1673aejsn7d06c0f7c9b7',
              'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
            }
          };
        axios.request(options).then(function (response) {
            console.log(response)
            res.status(200).json(response.data);
        }).catch(function (error) {
            throw new Error(error);
        });
    }
    catch(err){
        res.status(500).json('error:' + err);
    }
}
module.exports = {fetchMovies}