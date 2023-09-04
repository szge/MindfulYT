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
        text: "OFF",
    });
});
const youtube = 'https://www.youtube.com/';
chrome.action.onClicked.addListener((tab) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = tab.url) === null || _a === void 0 ? void 0 : _a.startsWith(youtube)) {
        console.log(tab);
        // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
        const prevState = yield chrome.action.getBadgeText({ tabId: tab.id });
        // Next state will always be the opposite
        const nextState = prevState === 'ON' ? 'OFF' : 'ON';
        // Set the action badge to the next state
        yield chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState,
        });
        if (tab.id === undefined)
            return;
        if (nextState === "ON") {
            // Insert the CSS file when the user turns the extension on
            yield chrome.scripting.insertCSS({
                files: ["focus-mode.css"],
                target: { tabId: tab.id },
            });
        }
        else if (nextState === "OFF") {
            // Remove the CSS file when the user turns the extension off
            yield chrome.scripting.removeCSS({
                files: ["focus-mode.css"],
                target: { tabId: tab.id },
            });
        }
    }
}));
