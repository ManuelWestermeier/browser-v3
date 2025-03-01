import React from 'react'
import { useTabsContext } from '../../provider/tabs';
import Tab from '../tab';
import "./index.css"
import TabData from '../tab-data';

export default function Tabs({ active }) {
    const { tabs, openTabId, setOpenTabId } = useTabsContext();

    return <div className={"tabs page " + (active ? "show" : "hide")}>
        <TabData />
        <div className='web-views' onScroll={e => {
            const selectedTabIndex = Math.round(e.target.scrollLeft / e.target?.children?.[0]?.scrollWidth);
            const selectedTabId = tabs[selectedTabIndex]?.id;
            if (openTabId != selectedTabId)
                setOpenTabId(selectedTabId);
        }}>
            {tabs.map(tab => {
                return <Tab key={tab.id} tab={tab} />
            })}
        </div>
    </div>;
}
