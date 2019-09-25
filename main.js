const Vue = require('vue');
const _ = require('lodash');

const API_URL='https://script.google.com/macros/s/AKfycbzm3I9ENulE7uOmze53cyDuj7Igi7fmGiQ6w045fCRxs_sK3D4/exec';

var app = new Vue({
    el: '#app',
    data: {
      target: null,
      state: 'LOADING', // initial state
      error: null,
      limit: 10,
      startIndex: 0
    }, 
    computed: {
      test: function() {
        return 'Hello!';
      },
      truncated: function() {
          return _.slice(this.target, this.startIndex, this.startIndex+this.limit);
      },
      numberOfPages: function() {
        return Math.ceil(this.target.length / this.limit);
      },
      currentPage: function() {
        let proposal = Math.floor(this.startIndex / this.limit) + 1;
        return Math.min(proposal, this.numberOfPages);
      }
    },
    methods: {
      switchPage: function(pageNo) {
        this.startIndex = this.limit * (pageNo - 1);
      }
    },
    mounted: function () {
        axios.get(API_URL)
        .then( (data) => {
            // insert data and change the state
            console.log(data.data);
            this.target = data.data;
            this.state = "LOADED";
        })
        .catch( (err) => {
            // change the state
            this.state = "ERROR";
            this.error = err;
        });
    }
  })

  window.app = app;