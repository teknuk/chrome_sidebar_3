import { attachHeadersListener } from 'chrome-sidebar'
import { hosts, iframeHosts } from './settings'

chrome.action.onClicked.addListener(tab => {
  console.log('Browser Action Triggered')
	chrome.scripting.executeScript({
    target: {
      tabId: tab.id
    },
    files: ['entry.js'],
  });
});

attachHeadersListener({
  declarativeNetRequest: chrome.declarativeNetRequest,
  hosts,
  iframeHosts,
  overrideFrameOptions: true
});
