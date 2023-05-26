import { attachHeadersListener } from 'chrome-sidebar'
import { hosts, iframeHosts } from './settings'

console.log('Chrome Github Trending Sidebar Extension Registered')

chrome.action.onClicked.addListener((tab) => {
  console.log('Browser Action Triggered')
	// for the current tab, inject the "inject.js" file & execute it
	chrome.scripting.executeScript({
    target: {
      tabId: tab.id
    },
    files: ['entry.js'],
	})
})

attachHeadersListener({
  webRequest: chrome.webRequest,
  hosts,
  iframeHosts,
  overrideFrameOptions: true
})
