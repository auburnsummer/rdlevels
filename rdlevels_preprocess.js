_ = require('lodash');

const NAME_PARSER = /\s*?(?:,|&|\/|\\|,? ,?and )\s*?/;

module.exports = function(data) {
    return _.map(data, (level) => {
        level.author = _.map(level.author.split(NAME_PARSER), _.trim);
        return level;
    })
}