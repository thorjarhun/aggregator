// For the sake of the consumer, we'll return only the newly arrived data in the onData callback.
var onData = data => console.log('onData', data);
var onComplete = event => console.log('onComplete', event);
const makeRequest = (query, onData, onComplete) => {
  // This basic implementation would fail if chunks are split in the wrong places
  // but this has yet been unobserved. If it does, Lazy.parseJSON should work instead.
  const onDataProxy = (() => {
    var charactersRead = 0;
    return event => {
      var data = event.currentTarget.response.slice(charactersRead);
      if (charactersRead) {
        // If anything but the first chunk
        data = '[' + data.slice(1);
      }
      charactersRead += data.length;
      if (data.slice(-1) !== ']') {
        // If anything but the last chunk
        data = data + ']';
      }
      onData(JSON.parse(data));
    };
  })();
  const req = new XMLHttpRequest();
  req.addEventListener("progress", onDataProxy);
  req.addEventListener("loadend", onComplete);

  req.open('get', `/search?q=${query}`);
  req.send(null);
};
const debounce = (fn, delay) => {
  var timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
};
const makeDebouncedRequest = debounce(makeRequest, 500);
var requestId = 0;
const App = React.createClass({
  getInitialState() {
    return {
      results: []
    };
  },
  onChange({ target }) {
    this.setState({ results: [] });
    const currentRequestId = ++requestId;
    const onData = data => {
      if (currentRequestId === requestId) {
        this.setState({
          results: this.state.results.concat(data)
        });
      }
    };
    makeDebouncedRequest(target.value, onData);
  },
  render() {
    return React.createElement('div', null,
      React.createElement('input', { onChange: this.onChange }),
      React.createElement('ul', null,
        this.state.results.map(result => React.createElement('li', { key: result.url + result.text },
          React.createElement('a', { href: result.url },
            result.text
          )
        ))
      )
    );
  }
});
ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
