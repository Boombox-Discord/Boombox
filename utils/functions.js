var timeout;

function modifyTimeout(value) {
  timeout = value;
}

function stopTimeout() {
  clearTimeout(timeout);
}

module.exports = modifyTimeout;
module.exports = stopTimeout;
