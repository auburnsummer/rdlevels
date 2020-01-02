const axios = require('axios');
const YAML = require('yaml')

/* booster.js - stuff to do with the booster packs */

const BOOSTER_API_URL = "https://raw.githubusercontent.com/auburnsummer/rd-boosters/master/"

async function getBoosterPacks() {
    let data = await axios.get(BOOSTER_API_URL + "boosters.yaml");
    return YAML.parse(data.data);
}

async function getBoosterPack(name) {
    return axios.get(BOOSTER_API_URL + `${name}.yaml`)
    .then( (data) => {
        return YAML.parse(data.data);
    })
    .catch( (err) => {
        console.log("Yaml parse error, I'm printing it now...");
        console.log(err);
        return [];
    })
}


module.exports = {
    getBoosterPacks: getBoosterPacks,
    getBoosterPack : getBoosterPack
}