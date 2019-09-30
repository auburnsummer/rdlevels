var Fuse = require('fuse.js');
var _ = require('lodash');

/* Fuse options for general terms */
const fuse_options = {
    shouldSort: false,
    includeScore: true,
    threshold: 0.5,
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

var init = (self, packet) => {
    console.log("I am the init!");
    self.data = packet.data;
}

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
        if (ev.data[0] === 'search') {
            let fuse = new Fuse(ev.data[1], fuse_options);
            result = do_search(fuse, ev.data[2]);
        }
        console.log(result);
        self.postMessage(result);
    })
}