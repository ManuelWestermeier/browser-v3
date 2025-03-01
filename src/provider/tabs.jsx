import { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";

const TabsContext = createContext(null);

export const TabsProvider = ({ children }) => {
    const [defaultTab, setDefaultTab] = useLocalStorage("browser-v3-default-tab", {
        url: "https://manuelwestermeier.github.io/fsRch/",
        title: "new tab",
    });

    const [tabs, setTabs] = useLocalStorage("browser-v3-tabs", [
        {
            ...defaultTab,
            id: crypto.randomUUID(),
        },
    ]);

    const [openTabId, setOpenTabId] = useState(tabs?.[0]?.id || null);

    const addTab = () => {
        const id = crypto.randomUUID();
        const openTabIndex = tabs.findIndex(tab => tab.id == openTabId) + 1;

        setTabs((prevTabs) => [
            ...prevTabs.slice(0, openTabIndex),
            { ...defaultTab, id },
            ...prevTabs.slice(openTabIndex),
        ]);

        setOpenTabId(id);

        setTimeout(() => {
            document.querySelector(".web-views")?.children?.[openTabIndex]?.scrollIntoView?.({ behavior: "smooth", block: "center" });
        }, 100);
    };

    const removeTab = (tabId) => {
        const openTabIndex = tabs.findIndex(({ id }) => id == openTabId);
        setTabs((prevTabs) => prevTabs.filter((tab) => tabId !== tab.id));
        if (tabs.length <= 2) {

        }
        setOpenTabId(tabs[openTabIndex]?.id || tabs[openTabIndex - 1]?.id || tabs[openTabIndex + 1]?.id || tabs[0]?.id);
        setTimeout(() => {
            document.querySelector(".web-views")?.children?.[openTabIndex]?.scrollIntoView?.({ behavior: "smooth", block: "center" });
        }, 100);
    };

    const updateTabData = (tabId = "", data = {}) => {
        setTabs((old) =>
            old.map((tab) => (tab.id === tabId ? { ...tab, ...data } : tab))
        );
    };

    useEffect(() => {
        if (tabs.length === 0) {
            const id = crypto.randomUUID();
            setTabs([
                {
                    ...defaultTab,
                    id,
                },
            ]);
            setOpenTabId(id);
        }
    }, [tabs.length]);

    return (
        <TabsContext.Provider
            value={{
                tabs,
                addTab,
                removeTab,
                openTabId,
                setOpenTabId,
                defaultTab,
                setDefaultTab,
                updateTabData,
            }}
        >
            {children}
        </TabsContext.Provider>
    );
};

/**
 * 
 * @returns {{ tabs, addTab, removeTab, openTabId, setOpenTabId, defaultTab, setDefaultTab, updateTabData }}
 */
export const useTabsContext = () => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error("useTabsContext must be used within a TabsProvider");
    }
    return context;
};
