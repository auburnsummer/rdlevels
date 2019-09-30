const Vue = require('vue');
const _ = require('lodash');
const ClipboardJS = require('clipboard');
const moment = require('moment');
const axios = require('axios');
const convert = require('./converter.js');
const createDOMPurify = require('dompurify');
const DOMPurify = createDOMPurify(window);

const API_URL='https://script.google.com/macros/s/AKfycbzm3I9ENulE7uOmze53cyDuj7Igi7fmGiQ6w045fCRxs_sK3D4/exec';

var app = new Vue({
    el: '#app',
    data: {
      target: null,
      state: 'LOADING', // initial state
      error: null,
      limit: 10,
      limit_options: [
        { text: '10', value: 10 },
        { text: '25', value: 25 },
        { text: '50', value: 50 },
        { text: '100', value: 100 },
        { text: 'All', value: 9999 },
      ],
      startIndex: 0,
      sort_by: 'last_updated',
      sort_direction: 'ascending',
      display_type: 'cards',
      order_texts: {
        'score': {
          'ascending': 'most relevant',
          'desecending': 'least relevant'
        },
        'last_updated': {
          'ascending': 'newest',
          'descending': 'oldest'
        },
        'song':{
          'ascending': 'a to z',
          'descending': 'z to a'
        },
        'author':{
          'ascending': 'a to z',
          'descending': 'z to a'
        },
        'difficulty': {
          'ascending': 'easiest',
          'descending': 'hardest'
        }
      },
      trayOpen: false
    }, 
    computed: {
      sorted: function() {
        let reverse = (func) => {
          let inner = (a, b) => {
            return func(b, a);
          }
          return inner;
        };
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
        let sort_func = sorting_functions[this.sort_by];
        if (this.sort_direction === 'descending') {
          sort_func = reverse(sort_func);
        }
        this.target.sort(sort_func);
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
      },
    },
    methods: {
      switchPage: function(pageNo) {
        this.startIndex = this.limit * (pageNo - 1);
      },
      switchType: function() {
        if (this.display_type === 'cards') {
          this.display_type = 'list';
        } else {
          this.display_type = 'cards';
        }
      },
      switchDirection: function() {
        if (this.sort_direction === 'ascending') {
          this.sort_direction = 'descending';
        } else {
          this.sort_direction = 'ascending';
        }
      },
      convertToHtml : function(text) {
        let proposedHtml = convert(text);
        return DOMPurify.sanitize(proposedHtml);
      },
      getBPMText : function(min_bpm, max_bpm) {
        if (min_bpm === max_bpm) {
          return max_bpm;
        }
        return `${min_bpm}-${max_bpm}`
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