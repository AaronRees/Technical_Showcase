const axios = require('axios').default;

const url = "https://jsonplaceholder.typicode.com/photos";

function getJSON(func, numInput){
    axios.get(url + '?albumId=' + numInput)
    .then((response) => func(response.data))
    .catch((error) => console.log(error.response.status));
}

module.exports = {
    getJSON
};
