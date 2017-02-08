# Aggregator

The project is meant to be a minimalistic streaming JSON API aggregation service. While websockets would be trivial to implement and work great for this use-case, this project explores the management of asynchronous IO with node streams.

## Usage:
```
npm install
node server.js
```

While a lightweight UI is included, it may be more obvious to observe what is meant above by the term "streaming" by opening a browser console and entering `makeRequest('cats', onData, onComplete)`.
