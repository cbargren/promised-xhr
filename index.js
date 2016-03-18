const xhrObject = require('./lib/xhr-object.js');
const Promise = require('promise');

function buildParamsAsQueryString(params) {
  const queryString = [];

  for (const p in params) {
    if (params.hasOwnProperty(p)) {
      queryString.push(`${p}=${params[p]}`);
    }
  }

  return queryString.length > 0 ? `?${queryString.join('&')}` : '';
}

function parseHeaders(headerStrings) {
  const headers = {};
  const regexp = /^([^:]+): (.*)/;

  for (const i of headerStrings) {
    const match = headerStrings[i].match(regexp);
    if (match) {
      headers[match[1].toLowerCase()] = match[2];
    }
  }

  return headers;
}

function sendRequest(options) {
  const xhr = xhrObject();
  let url = options.url;
  const { headers, method, responseType } = options;

  if (method === 'GET') {
    url += buildParamsAsQueryString(options.data);
  }

  let body = options.body || options.data || null;
  if ('json' in options) {
    if (!headers.accept && !headers.Accept) {
      headers.Accept = 'application/json';
    }
    if (method !== 'GET' && method !== 'HEAD') {
      if (!headers['content-type'] && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }
      body = JSON.stringify(options.json);
    }
  }

  if (headers) {
    for (const key in headers) {
      if (headers.hasOwnProperty(key)) {
        xhr.setRequestHeader(key, headers[key]);
      }
    }
  }

  if (options.onUploadProgress) {
    xhr.upload.onprogress = function onUploadProgress(e) {
      if (e.lengthComputable) {
        const percentLoaded = Math.round((e.loaded / e.total) * 100);
        options.onUploadProgress(percentLoaded);
      }
    };
  }

  if (responseType) {
    xhr.responseType = responseType;
  }

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;

      let responseBody = null;
      if (xhr.response) {
        responseBody = xhr.response;
      } else if (xhr.responseType === 'text' || !xhr.responseType) {
        responseBody = xhr.responseText || xhr.responseXML;
      }

      if (xhr.responseType === 'json') {
        try {
          responseBody = JSON.parse(responseBody);
        } catch (e) {}  // eslint-disable-line no-empty
      }

      let responseHeaders = xhr.getAllResponseHeaders();
      if (headers !== null) {
        responseHeaders = parseHeaders(headers.split('\n'));
      }
      const response = {
        body: responseBody,
        headers: responseHeaders,
        method: xhr.method,
        statusCode: xhr.status,
        url,
        xhr
      };
      if (xhr.status >= 100 && xhr.status < 400) {
        resolve(response);
      } else {
        reject(response);
      }
    };

    xhr.onerror = reject;

    xhr.open(method || 'GET', url, true, options.username, options.password);
    xhr.send(body);
  });
}

module.exports = {
  base: null,
  get: (url, options = {}) => {
    options.headers = options.headers || {};

    options.method = 'GET';

    if (typeof url === 'string') {
      options.base = options.base || this.base || '';
      options.url = options.base + url;
    }

    return sendRequest(options);
  },

  post: (url, options = {}) => {
    options.headers = options.headers || {};

    if (typeof url === 'string') {
      options.base = options.base || this.base || '';
      options.url = options.base + url;
    }

    options.method = 'POST';

    return sendRequest(options);
  },

  send: (url, options = {}) => {
    options.headers = options.headers || {};

    if (typeof url === 'string') {
      options.base = options.base || this.base || '';
      options.url = options.base + url;
    }

    return sendRequest(options);
  },

  sendFormData: (url, options = {}) => {
    options.headers = options.headers || {};

    if (typeof url === 'string') {
      options.base = options.base || this.base || '';
      options.url = options.base + url;
    }

    options.method = options.method || 'POST';

    if (typeof options.data === 'object') {
      const formData = new FormData();

      for (const key in options.data) {
        if (options.data.hasOwnProperty(key)) {
          formData.append(key, options.data[key]);
        }
      }

      options.data = formData;
    }

    return sendRequest(options);
  }
};
