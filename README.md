# Aggregator

This is a proof of concept for a minimalistic streaming JSON API aggregation service. While websockets would be trivial to implement and work great for this use-case, this project explores means of streaming a regular HTTP response such that the client can process the payload progressively. While the `master` branch implementation uses node streams, the `early_version` branch chunks the response in a more vanilla flavor.

## Usage:
```
npm install
node server.js
```

[Live demo](https://pacific-springs-70424.herokuapp.com/)

While a lightweight UI is included, it may be more obvious to observe what is meant above by the term "streaming" by opening a browser console and entering `makeRequest('cats', onData, onComplete)`.
