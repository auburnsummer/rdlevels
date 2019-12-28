var Fuse = require('fuse.js');
var _ = require('lodash');
var seedrandom = require('seedrandom');
var booster = require('./booster.js');

var current_random = 0;

/* Fuse options for general terms */
const fuse_options = {
    shouldSort: false,
    includeScore: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      {name:"song",weight:0.30},
      {name:"artist",weight:0.20},
      {name:"author",weight:0.32},
      {name:"description",weight:0.10},
      {name:"tags",weight:0.08}
    ]                   
};

const difficulty_filter = async (data, matches) => {
    let difficultyMap = {
        'Easy' : 0,
        'Medium' : 1,
        'Tough' : 2,
        'VeryTough' : 3
    };
    let inputMap = {
        'easy': 0,
        'medium': 1,
        'tough': 2,
        'hard': 2,
        'very tough': 3
    };
    let filterDifficulty = inputMap[_.lowerCase(matches[2])];
    return _.filter(data, (doc) => {
        let thisDifficulty = difficultyMap[doc.difficulty];
        if (matches[1] === '=') {
            return thisDifficulty === filterDifficulty;
        }
        if (matches[1] === '>') {
            return thisDifficulty > filterDifficulty;
        }
        if (matches[1] === '<') {
            return thisDifficulty < filterDifficulty;
        }
    })
}

const tag_filter = async (data, matches) => {
    let options = {
        threshold: 0.08,
        location: 0,
        distance: 32,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          "tags"
        ]
    };
    let tag_fuse = new Fuse(data, options);
    return tag_fuse.search(matches[1]);
}

const booster_filter = async (data, matches) => {
    seedrandom(current_random, {global: true});
    _ = _.runInContext();
    // get the sampler data.
    // we can poll here because this is inside a webworker
    let sampler_data = await booster.getBoosterPack(matches[1]);
    console.log(sampler_data)
    let urls = _.flatten(
        _.map(sampler_data, (pool) => {
            let indexes = _.sortBy(_.sampleSize(_.range(pool.levels.length), pool.take));
            return _.map(indexes, (index) => {
                return pool.levels[index];
            })
        })
    )
    console.log(urls);
    return _.map(urls, (url) =>  {
        return _.find(data, (level) => {
            return level.download_url === url
        })
    })
}

/* REGEXES */
const filters = [
    {
        regex: /diff(?:iculty)? ?([>=<]) ?((?:easy)|(?:medium)|(?:tough)|(?:hard)|(?:very tough))/i,
        func: difficulty_filter
    },
    {
        regex: /\[([\w ]+)\]/,
        func: tag_filter
    },
    {
        regex: /booster=(\w+)/,
        func: booster_filter
    }
]


const do_search = (fuse, query) => {
    let result = fuse.search(query);

    return _.map(result, (pair) => {
        pair.item.score = pair.score;
        return pair.item;
    })
}


module.exports = function (self) {
    self.addEventListener('message', async function (ev) {
        console.log(ev.data);
        let result;
        let relevanceAllowed = false; // should we allows relevance?
        let matched = []; // list of matched filters
        if (ev.data[0] === 'search') {
            // run through the filters.
            let docs = ev.data[1];
            let query = ev.data[2];
            for (const pair of filters) {
                let match = pair.regex.exec(query);
                while (match) {
                    matched.push(pair.func.name)
                    console.log(`matched: ${match}`);
                    docs = await pair.func(docs, match);
                    query = query.replace(match[0], '');
                    console.log(`query: ${query}`);
                    match = pair.regex.exec(query);
                }
            }
            let fuse = new Fuse(docs, fuse_options);
            query = _.trim(query);
            if (query === '') {
                result = docs;
            } else {
                relevanceAllowed = true;
                result = do_search(fuse, _.trim(query));
            }

            let nextState;
            if (_.includes(matched, "booster_filter")) {
                nextState = "sampler";
            } else if (relevanceAllowed) {
                nextState = "relevance";
            } else {
                nextState = "search";
            }

            console.log("==============");
            console.log(matched);
            console.log(nextState);
            console.log(current_random);

            self.postMessage([nextState, result]);
        }

        if (ev.data[0] === 'setrandom') {
            current_random = parseInt(ev.data[1]);
            // pass the phrase back
            self.postMessage(['setrandom', ev.data[2]]);
        }

    })
}