const es = require('event-stream'),
  JSONStream = require('JSONStream');

// Best practice is never to put secrets in source code. I've chosen to opt out for this demo.
const googleKey = 'AIzaSyAgBFeeDQzsioll868hmNN5rt-va0_G6qM';
const googleSearchEngineId = '015346676613456876914:bn3q1i8hojo';
const youtubeKey = 'AIzaSyAWoa7aqds2Cx_drrrb5FPsRObFa7Dxkfg';
const themoviedbKey = '18c79973656e8eebf57896336d3faab0';
module.exports = [
  { // This source isn't very robot friendly.
    id: 'gigablast',
    url: 'http://www.gigablast.com/search?format=json&rxivo=1&q=',
    formatter: body => {
      return JSON.parse(body).results.map(({url, title: text}) => ({
        url,
        text
      }));
    }
  },
  {
    id: 'youtube',
    url: `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${youtubeKey}&q=`,
    formatter: body => {
      return JSON.parse(body).items.map(result => ({
        url: `https://www.youtube.com/watch?v=${result.id.videoId}`,
        text: result.snippet.title
      }));
    }

  },
  /*
  { // This source has a pretty low daily request limit.
    id: 'google',
    url: `https://www.googleapis.com/customsearch/v1?key=${googleKey}&cx=${googleSearchEngineId}&q=`,
    formatter: body => {
      return JSON.parse(body).items.map(({link: url, title: text}) => ({
        url,
        text
      }));
    }
  },
  */
  { // This source has a low rate limit.
    id: 'github',
    url: 'https://api.github.com/search/repositories?q=',
    formatter: body => {
      return JSON.parse(body).items.map(({html_url: url, full_name: text}) => ({
        url,
        text
      }));
    }
  },
  {
    id: 'themoviedb',
    url: `https://api.themoviedb.org/3/search/movie?api_key=${themoviedbKey}&query=`,
    formatter: body => {
      return JSON.parse(body).results.map(({id, title: text}) => ({
        url: `https://www.themoviedb.org/movie/${id}`,
        text
      }));
    }
  }
];
