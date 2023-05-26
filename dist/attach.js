'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachHeadersListener = attachHeadersListener;
function attachHeadersListener(_ref) {
  var declarativeNetRequest = _ref.declarativeNetRequest,
      hosts = _ref.hosts,
      iframeHosts = _ref.iframeHosts,
      overrideFrameOptions = _ref.overrideFrameOptions;

  if (typeof hosts !== 'string') {
    if (hosts) {
      hosts = hosts.join(' ');
    } else {
      throw new Error('`hosts` option must be a string or array');
    }
  }

  if (typeof iframeHosts !== 'string') {
    if (iframeHosts) {
      iframeHosts = iframeHosts.join(' ');
    } else {
      throw new Error('`iframeHosts` option must be a string or array');
    }
  }

  var types = ['main_frame'];

  if (overrideFrameOptions) {
    types.push('sub_frame');
  }

  declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [513, 531],
    addRules: [{
      id: 513, // Unique ID for the rule
      priority: 1, // Rule priority
      action: {
        type: 'modifyHeaders',
        responseHeaders: [{
          header: 'content-security-policy',
          operation: 'set',
          value: 'default-src \'self\'; script-src \'self\' ' + hosts + '; style-src \'self\' ' + hosts + '; frame-src \'self\' ' + iframeHosts + '; child-src \'self\' ' + hosts + ';'
        }]
      },
      condition: {
        urlFilter: hosts.split(' ').map(function (host) {
          return '*://' + host + '/*';
        }).join(', '),
        resourceTypes: ['main_frame']
      }
    }, {
      id: 531,
      priority: 2,
      action: {
        type: 'modifyHeaders',
        responseHeaders: [{
          header: 'content-security-policy',
          operation: 'set',
          value: 'default-src \'self\'; script-src \'self\' ' + hosts + '; style-src \'self\' ' + hosts + '; frame-src \'self\' ' + iframeHosts + '; child-src \'self\' ' + hosts + ';'
        }]
      },
      condition: {
        urlFilter: iframeHosts.split(' ').map(function (host) {
          return '*://' + host + '/*';
        }).join(', '),
        resourceTypes: ['sub_frame']
      }
    }]
  }, function () {
    console.log('Rules updated successfully');
  });
}

exports.default = {
  attachHeadersListener: attachHeadersListener
};