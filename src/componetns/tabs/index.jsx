import { useTabsContext } from "../../provider/tabs";
import TabData from "../tab-data";
import React from "react";
import Tab from "../tab";
import "./index.css";

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
