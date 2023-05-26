
export function attachHeadersListener({
  declarativeNetRequest,
  hosts,
  iframeHosts,
  overrideFrameOptions
}) {
  if (typeof hosts !== 'string') {
    if (hosts) {
      hosts = hosts.join(' ')
    } else {
      throw new Error('`hosts` option must be a string or array')
    }
  }

  if (typeof iframeHosts !== 'string') {
    if (iframeHosts) {
      iframeHosts = iframeHosts.join(' ')
    } else {
      throw new Error('`iframeHosts` option must be a string or array')
    }
  }

  const types  = ['main_frame']

  if (overrideFrameOptions) {
    types.push('sub_frame')
  }

  declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [513, 531],
    addRules: [
      {
        id: 513, // Unique ID for the rule
        priority: 1, // Rule priority
        action: {
          type: 'modifyHeaders',
          responseHeaders: [
            {
              header: 'content-security-policy',
              operation: 'set',
              value: 'default-src \'self\'; script-src \'self\' ' + hosts + '; style-src \'self\' ' + hosts + '; frame-src \'self\' ' + iframeHosts + '; child-src \'self\' ' + hosts + ';',
            },
          ],
        },
        condition: {
          urlFilter: hosts.split(' ').map(host => `*://${host}/*`).join(', '),
          resourceTypes: ['main_frame'],
        },
      },
      {
        id: 531,
        priority: 2,
        action: {
          type: 'modifyHeaders',
          responseHeaders: [
            {
              header: 'content-security-policy',
              operation: 'set',
              value: 'default-src \'self\'; script-src \'self\' ' + hosts + '; style-src \'self\' ' + hosts + '; frame-src \'self\' ' + iframeHosts + '; child-src \'self\' ' + hosts + ';',
            },
          ],
        },
        condition: {
          urlFilter: iframeHosts.split(' ').map(host => `*://${host}/*`).join(', '),
          resourceTypes: ['sub_frame'],
        },
      },
    ],
  }, () => {
    console.log('Rules updated successfully');
  });
}

export default {
  attachHeadersListener
}
