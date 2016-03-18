Originally forked from [frikille/promised-xhr](https://github.com/frikille/promised-xhr)

# XHR Promise

This module wraps XMLHttpRequest with in promise object. The promise implementation is [Promises/A+](https://promisesaplus.com/) compliant and is provided by the [promise.js](https://www.npmjs.com/package/promise) Promise library.

## Installation

Install via [npm](https://www.npmjs.com/package/xhr-promise-redux) ![NPM version](https://badge.fury.io/js/xhr-promise-redux.svg)

```bash
$ npm install xhr-promise-redux
```

## API
```javascript
var xhr = require('xhr-promise-redux');

xhr.get(url, options)
xhr.post(url, options)
xhr.send(url, options)
```

## Examples

1. Sending a GET request

  ```javascript
    xhr.get('/test-url', {
      data: {
        param: 'value'
      },
      headers: {
        'Header-name': 'Header value'
      },
      responseType: 'json'
    })
    .then(function (response) {
      console.log(`Success! The response JSON object: ${response.body}`);
    })
    .catch(function(response) {
      console.log(`Error! Response Status Code: ${response.statusCode}`)
    });
  ```
2. Sending a POST request with JSON

  ```javascript
    xhr.post('/test-url', {
      json: {
        param: 'value'
      },
      headers: {
        'Header-name': 'Header value'
      },
      responseType: 'json'
    })
    .then(function (response) {
      console.log(`Success! The response JSON object: ${response.body}`);
    })
    .catch(function(response) {
      console.log(`Error! Response Status Code: ${response.statusCode}`)
    });
  ```
3. Sending a request with any method

  ```javascript
    xhr.send('/test-url', {
      method: 'PUT',
      json: {
        param: 'value'
      },
      headers: {
        'Header-name': 'Header value'
      }
    })
    .then(function (response) {
      console.log(`Success! The response JSON object: ${response.body}`);
    })
    .catch(function(response) {
      console.log(`Error! Response Status Code: ${response.statusCode}`)
    });
  ```
