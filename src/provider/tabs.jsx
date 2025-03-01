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
        let currentTabsIndex = 0;

        for (const tab of tabs) {
            if (tab.id === currentTabsIndex) break;
            currentTabsIndex++;
        }

        // Fix: Correct way to insert without mutating the array
        setTabs((prevTabs) => [
            ...prevTabs.slice(0, currentTabsIndex),
            { ...defaultTab, id },
            ...prevTabs.slice(currentTabsIndex),
        ]);
        setOpenTabId(id);
    };

    const removeTab = (tabId) => {
        setTabs((prevTabs) => prevTabs.filter((tab) => tabId !== tab.id));
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
    }, [tabs.length]); // Fix: Only check length, prevents infinite rerender

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
