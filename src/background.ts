chrome.runtime.onInstalled.addListener(() => {
    setEnabled(true);
});

const YOUTUBE = "https://www.youtube.com/";
const SHORTS = "https://www.youtube.com/shorts";
const MAIN_CSS = ["styles/shorts.css", "styles/focus-mode.css"];
const SHORTS_CSS = ["styles/nuke-shorts.css", "styles/shorts.css", "styles/focus-mode.css"];

// automatically turn on the extension
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        update(tab);
    }
});

chrome.action.onClicked.addListener(async (tab) => {
    console.log("clicked");
    const prevState = await getEnabled();
    await setEnabled(!prevState);
    update(tab);
});

async function update(tab: chrome.tabs.Tab) {
    if (tab.url?.startsWith(YOUTUBE) && tab.id !== undefined) {
        const currentState = await getEnabled() ? "ON" : "OFF";

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

async function setEnabled(enabled: boolean) {
    await chrome.storage.sync.set({ enabled });
    // update the badge
    await chrome.action.setBadgeText({
        text: enabled ? "ON" : "OFF",
    });
}

function getEnabled(): Promise<boolean> {
    return new Promise((resolve) => {
        chrome.storage.sync.get("enabled", (result) => {
            resolve(result.enabled);
        });
    });
}
