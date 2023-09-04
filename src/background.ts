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
        console.log("tab updated")
        update(tab);
    }
});

chrome.action.onClicked.addListener(async (tab) => {
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    const nextState = prevState === "ON" ? "OFF" : "ON";

    await chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState,
    });

    update(tab);
});

async function update(tab: chrome.tabs.Tab) {
    if (tab.url?.startsWith(YOUTUBE) && tab.id !== undefined) {
        // get the current state of the extension
        const currentState = await chrome.action.getBadgeText({
            tabId: tab.id,
        });

        if (tab.url?.startsWith(SHORTS)) {
            if (currentState === "ON") {
                // Insert the CSS file when the user turns the extension on
                await chrome.scripting.insertCSS({
                    files: SHORTS_CSS,
                    target: { tabId: tab.id },
                });
                await chrome.tabs.update(tab.id, { muted: true });
                console.log(tab.mutedInfo?.muted)
            } else if (currentState === "OFF") {
                // Remove the CSS file when the user turns the extension off
                await chrome.scripting.removeCSS({
                    files: SHORTS_CSS,
                    target: { tabId: tab.id },
                });
                await chrome.tabs.update(tab.id, { muted: false }); 
            }
        } else if (tab.url?.startsWith(YOUTUBE)) {
            if (currentState === "ON") {
                // Insert the CSS file when the user turns the extension on
                await chrome.scripting.insertCSS({
                    files: MAIN_CSS,
                    target: { tabId: tab.id },
                });
            } else if (currentState === "OFF") {
                // Remove the CSS file when the user turns the extension off
                await chrome.scripting.removeCSS({
                    files: MAIN_CSS,
                    target: { tabId: tab.id },
                });
            }
        }
    }
}
