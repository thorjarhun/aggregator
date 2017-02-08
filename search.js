const router = require('express').Router(),
  request = require('request'),
  es = require('event-stream'),
  JSONStream = require('JSONStream'),
  datasources = require('./datasources');

const makeRequest = url => request.get({
  url,
  headers: { 'User-Agent': 'request' } // github requires a 'User-Agent' string
});

const recordCounter = id => {
  var count = 0;
  return es.through(function(data) {
    count++;
    this.queue(data);
  }, function() {
    console.log(`Parsed ${count} records from ${id}`);
    this.queue(null);
  });
};

router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  es.merge(datasources.map(({id, url, parser}) => {
      return makeRequest(url+req.query.q).pipe(parser())
        .on('error', function(err) {
          console.error(`error parsing ${id}`, err);
          this.emit('end');
        })
        .pipe(recordCounter(id));
    }))
    //.pipe(es.mapSync(x => (console.log('data', x), x)))
    .pipe(JSONStream.stringify('[', ',', ']'))
    .pipe(res);
});
module.exports = router;
