const router = require('express').Router(),
  request = require('request'),
  datasources = require('./datasources');

router.get('/', (req, res) => {
  res.write('['); // Include opening and closing brackets so regular XHR abstractions work on the client
  const tasks = datasources.map(datasource => callback => requestAndFormat(datasource, req.query.q, callback));
  const onTaskComplete = (err, items, last) => {
    // In this error-handled strategy, a data source may fail silently. Depending
    // on business requirements, an alternative strategy may be prefered.
    if (!err) {
      // Chunks may be merged in transit. This formatting allows the total payload to be valid JSON.
      // The first part *erases the square brackets enclosing each chunk* while the latter appends necessary delimiters.
      res.write(JSON.stringify(items).slice(1, -1) + (last ? ']' : ','));
    }
    if (last) {
      res.end();
    }
  }
  asyncIncremental(tasks, onTaskComplete);
});

const asyncIncremental = (tasks, onTaskComplete) => {
  var completed = 0;
  const taskCallback = (...args) => onTaskComplete(...args, ++completed === tasks.length);
  tasks.forEach(task => task(taskCallback));
};

const requestAndFormat = (datasource, query, callback) => {
  const { url, formatter } = datasource;
  const options = {
    url: url + query,
    headers: {
      'User-Agent': 'request'
    }
  };
  request(options, (err, res, body) => {
    if (err) {
      console.warn(`error fetching [${options.url}]`, err);
      callback(err);
    } else {
      callback(null, formatter(body));
    }
  });
}


module.exports = router;
