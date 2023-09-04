"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "ON",
    });
});
const YOUTUBE = "https://www.youtube.com/";
const SHORTS = "https://www.youtube.com/shorts";
const MAIN_CSS = ["styles/shorts.css", "styles/focus-mode.css"];
const SHORTS_CSS = ["styles/nuke-shorts.css", "styles/shorts.css", "styles/focus-mode.css"];
// automatically turn on the extension
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        console.log("tab updated");
        update(tab);
    }
});
chrome.action.onClicked.addListener((tab) => __awaiter(void 0, void 0, void 0, function* () {
    const prevState = yield chrome.action.getBadgeText({ tabId: tab.id });
    const nextState = prevState === "ON" ? "OFF" : "ON";
    yield chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState,
    });
    update(tab);
}));
function update(tab) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        if (((_a = tab.url) === null || _a === void 0 ? void 0 : _a.startsWith(YOUTUBE)) && tab.id !== undefined) {
            // get the current state of the extension
            const currentState = yield chrome.action.getBadgeText({
                tabId: tab.id,
            });
            if ((_b = tab.url) === null || _b === void 0 ? void 0 : _b.startsWith(SHORTS)) {
                if (currentState === "ON") {
                    // Insert the CSS file when the user turns the extension on
                    yield chrome.scripting.insertCSS({
                        files: SHORTS_CSS,
                        target: { tabId: tab.id },
                    });
                    yield chrome.tabs.update(tab.id, { muted: true });
                    console.log((_c = tab.mutedInfo) === null || _c === void 0 ? void 0 : _c.muted);
                }
                else if (currentState === "OFF") {
                    // Remove the CSS file when the user turns the extension off
                    yield chrome.scripting.removeCSS({
                        files: SHORTS_CSS,
                        target: { tabId: tab.id },
                    });
                    yield chrome.tabs.update(tab.id, { muted: false });
                }
            }
            else if ((_d = tab.url) === null || _d === void 0 ? void 0 : _d.startsWith(YOUTUBE)) {
                if (currentState === "ON") {
                    // Insert the CSS file when the user turns the extension on
                    yield chrome.scripting.insertCSS({
                        files: MAIN_CSS,
                        target: { tabId: tab.id },
                    });
                }
                else if (currentState === "OFF") {
                    // Remove the CSS file when the user turns the extension off
                    yield chrome.scripting.removeCSS({
                        files: MAIN_CSS,
                        target: { tabId: tab.id },
                    });
                }
            }
        }
    });
}
