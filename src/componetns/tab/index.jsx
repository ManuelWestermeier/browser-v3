import React, { useEffect, useRef } from 'react';
import { useTabsContext } from '../../provider/tabs';

export default function Tab({ tab }) {
    const { updateTabData, openTabId } = useTabsContext();
    const webviewElem = useRef(null);
    const initialUrl = useRef(tab.url); // Store the initial URL

    useEffect(() => {
        const webview = webviewElem.current;
        if (!webview) return;

        function updateURL() {
            if (openTabId !== tab.id) return;
            const urlInput = document.getElementById("url-input");
            if (document.activeElement === urlInput) return;
            urlInput.value = webview.getURL();
        }

        const handleDidNavigate = () => {
            updateTabData(tab.id, {
                title: webview.getTitle(),
                url: webview.getURL(),
            });
            updateURL();
        };

        const handlePageTitleUpdated = (event) => {
            updateTabData(tab.id, {
                title: event.title,
                url: webview.getURL(),
            });
            updateURL();
        };

        webview.addEventListener('did-navigate', handleDidNavigate);
        webview.addEventListener('page-title-updated', handlePageTitleUpdated);

        if (openTabId == tab.id) {
            const reloadButton = document.getElementById("reload-button");

            webview.onloadstart = () => reloadButton.classList.add("loading");
            webview.onloadedmetadata = () => reloadButton.classList.remove("loading");
            webview.onloadeddata = () => reloadButton.classList.remove("loading");

            setTimeout(() => {
                reloadButton.classList.remove("loading")
            }, 2000);
        }

        return () => {
            webview.removeEventListener('did-navigate', handleDidNavigate);
            webview.removeEventListener('page-title-updated', handlePageTitleUpdated);
        };
    }, [tab.id, updateTabData]);

    return (
        <webview
            id={tab.id}
            ref={webviewElem}
            src={initialUrl.current} // Use the initial URL only
            className="tab webview"
        />
    );
}
