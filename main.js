const Vue = require('vue');
const _ = require('lodash');
const ClipboardJS = require('clipboard');
const moment = require('moment');

const API_URL='https://script.google.com/macros/s/AKfycbzm3I9ENulE7uOmze53cyDuj7Igi7fmGiQ6w045fCRxs_sK3D4/exec';

var app = new Vue({
    el: '#app',
    data: {
      target: null,
      state: 'LOADING', // initial state
      error: null,
      limit: 10,
      startIndex: 0,
      sort_by: 'last_updated',
      display_type: 'cards',
    }, 
    computed: {
      sorted: function() {
        let sorting_functions = {
          'last_updated': (a, b) => {
            return (moment(a.last_updated) > moment(b.last_updated) ? -1 : 1);
          },
          'song': (a, b) => {
            return a.song.localeCompare(b.song);
          },
          'difficulty': (a, b) => {
            let difficultyMap = {
              'Easy' : 0,
              'Medium' : 1,
              'Tough' : 2,
              'VeryTough' : 3
            };
            return difficultyMap[a.difficulty] < difficultyMap[b.difficulty] ? -1 : 1;
          },
          'author': (a, b) => {
            return a.author.localeCompare(b.author);
          }
        };
        this.target.sort(sorting_functions[this.sort_by]);
        return this.target;
      },
      truncated: function() {
        let sorted = this.sorted;
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
            return this.$nextTick()
        })
        .then( () => {
          new ClipboardJS('.copy-link');
        })
        .catch( (err) => {
            // change the state
            this.state = "ERROR";
            this.error = err;
        });
    }
  })

  window.app = app;