export function attachHeadersListener({ hosts, iframeHosts, overrideFrameOptions }) {
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

  const addRules = [
    {
      "id": 501,
      "priority": 1,
      "action": {
        "type": "modifyHeaders",
        "responseHeaders": [
          {
            "header": "Content-Security-Policy",
            "operation": "append",
            "value": `script-src 'self' 'unsafe-inline' ${hosts}; style-src 'self' 'unsafe-inline' ${hosts}; frame-src ${iframeHosts}; child-src ${hosts}`
          }
        ]
      },
      "condition": {
        "urlFilter": "https://*/*, http://*/*",
        "resourceTypes": ["main_frame"]
      }
    }
  ];

  if (overrideFrameOptions) {
    addRules[0].action.responseHeaders.push({
      "header": "X-Frame-Options",
      "operation": "set",
      "value": "ALLOWALL"
    });
  }
  const removeRuleIds = [501]
  chrome.declarativeNetRequest.updateDynamicRules({ addRules, removeRuleIds }, () => {
    console.log("Rules updated.");
  });
}

export default {
  attachHeadersListener
}
