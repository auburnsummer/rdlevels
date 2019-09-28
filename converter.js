// Converter.js - a bastardized markedjs for parsing the descriptions

const marked = require('marked');

marked.setOptions({
    'gfm': true,
    'breaks': true
})




module.exports = marked;