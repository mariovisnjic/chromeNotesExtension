'use strict';

chrome.runtime.onInstalled.addListener(() => {
    setBadgeText("");
});

chrome.tabs.onActivated.addListener(async () => {
    await manageExtensionIcon()
});

chrome.tabs.onUpdated.addListener(async () => {
    await manageExtensionIcon()
});
