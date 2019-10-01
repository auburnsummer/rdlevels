var Fuse = require('fuse.js');
var _ = require('lodash');

/* Fuse options for general terms */
const fuse_options = {
    shouldSort: false,
    includeScore: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      {name:"song",weight:0.28},
      {name:"artist",weight:0.26},
      {name:"author",weight:0.26},
      {name:"description",weight:0.12},
      {name:"tags",weight:0.08}
    ]                   
};

const difficulty_filter = (data, matches) => {
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

const tag_filter = (data, matches) => {
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

/* REGEXES */
const filters = [
    {
        regex: /diff(?:iculty)? ?([>=<]) ?((?:easy)|(?:medium)|(?:tough)|(?:hard)|(?:very tough))/i,
        func: difficulty_filter
    },
    {
        regex: /\[([\w ]+)\]/,
        func: tag_filter
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
    self.addEventListener('message', function (ev) {
        console.log(ev.data);
        let result;
        let relevanceAllowed = false; // should we allows relevance?
        if (ev.data[0] === 'search') {
            // run through the filters.
            let docs = ev.data[1];
            let query = ev.data[2];
            for (const pair of filters) {
                let match = pair.regex.exec(query);
                while (match) {
                    console.log(`matched: ${match}`);
                    docs = pair.func(docs, match);
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
        }

        console.log(result);
        self.postMessage([relevanceAllowed, result]);
    })
}