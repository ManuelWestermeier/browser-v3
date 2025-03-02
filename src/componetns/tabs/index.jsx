import { useTabsContext } from "../../provider/tabs";
import TabData from "../tab-data";
import React, { useEffect } from "react";
import Tab from "../tab";
import "./index.css";

const { ipcRenderer } = require("electron");

export default function Tabs({ active }) {
  const { tabs, openTabId, setOpenTabId } = useTabsContext();

  const onScroll = (e) => {
    if (window.isScrolling) return;
    const selectedTabIndex = Math.round(
      e.target.scrollLeft / e.target?.children?.[0]?.scrollWidth
    );
    const selectedTabId = tabs[selectedTabIndex]?.id;
    if (openTabId != selectedTabId) setOpenTabId(selectedTabId);
  };

  const chengeTabIndexBy = (times) => {
    const webviewsElem = document.querySelector(".web-views");
    const selectedTabIndex =
      Math.round(webviewsElem.scrollLeft / webviewsElem?.children?.[0]?.scrollWidth) +
      times;

    if (selectedTabIndex < 0 || selectedTabIndex > webviewsElem.children.length)
      return;

    window.isScrolling = true;

    const bevorScrollListener = webviewsElem.onscroll;

    const checkScroll = () => {
      clearTimeout(window.scrollTimeout); // Reset timeout if still scrolling
      window.scrollTimeout = setTimeout(() => {
        window.isScrolling = false;
        webviewsElem.onscroll = bevorScrollListener;
      }, 100); // Adjust timeout to detect stop (200ms is reasonable)
    };

    // Store a reference to the function to properly remove it later
    webviewsElem.onscroll = checkScroll;

    webviewsElem.children?.[selectedTabIndex]?.scrollIntoView?.({
      behavior: "smooth",
      block: "center",
    });
  };

  useEffect(() => {
    ipcRenderer.on("key-pressed", (_, key) => {
      if (key == "CommandOrControl+Alt+Left") {
        chengeTabIndexBy(-1);
      } else if (key == "CommandOrControl+Alt+Right") {
        chengeTabIndexBy(1);
      }
    });
  }, []);

  return (
    <div className={"tabs page " + (active ? "show" : "hide")}>
      <TabData setTabToScrollPos={onScroll} key={openTabId} />
      <div className="web-views" onScroll={onScroll}>
        {tabs.map((tab) => {
          return <Tab key={tab.id} tab={tab} />;
        })}
      </div>
    </div>
  );
}
