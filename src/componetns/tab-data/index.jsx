import { useTabsContext } from "../../provider/tabs";
import React, { useEffect } from "react";
import "./index.css";
import getURL from "../../utils/get-url";

const { ipcRenderer } = require("electron");

export default function TabData({ setTabToScrollPos }) {
  const { tabs, openTabId, addTab, removeTab, defaultTab } = useTabsContext();

  const openTab = tabs.find(({ id }) => id == openTabId);

  useEffect(() => {
    const handleKeyPress = (_, key) => {
      if (!openTab) return;

      const tabElement = document.getElementById(openTabId);
      if (key === "Alt+Left") {
        tabElement?.goBack?.();
      } else if (key === "Alt+Right") {
        tabElement?.goForward?.();
      } else if (key === "Alt+R") {
        tabElement?.reload?.();
      } else if (key === "Alt+X" || key === "Alt+W") {
        removeTab(openTabId);
      } else if (key === "Alt+A" || key === "Alt+T") {
        addTab();
      } else if (key === "Alt+S") {
        document.querySelector(".top-tab form input")?.focus();
      }
    };

    ipcRenderer.on("key-pressed", handleKeyPress);

    return () => {
      ipcRenderer.removeListener("key-pressed", handleKeyPress);
    };
  }, [openTab, openTabId, removeTab, addTab]);

  if (!openTab) {
    setTabToScrollPos({ target: document.querySelector(".web-views") });
    return "loading...";
  }

  return (
    <div className="top-tab">
      <span className="name" title={openTab.title}>
        {openTab.title}
      </span>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          document.getElementById("url-input").blur();
          const currentWebview = document.getElementById(openTabId);
          currentWebview.loadURL(getURL(e.target.url.value, defaultTab.url));
          currentWebview.focus();
        }}
      >
        <input
          autoFocus
          defaultValue={openTab.url}
          key={openTabId}
          id="url-input"
          type="text"
          name="url"
          placeholder="url..."
        />
        <button title="GO" type="submit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
          </svg>
        </button>
      </form>
      <div className="navigation">
        <button
          title="Go Back"
          type="button"
          onClick={() => document.getElementById(openTabId)?.goBack?.()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
          </svg>{" "}
        </button>
        <button
          title="Go Forward"
          type="button"
          onClick={() => document.getElementById(openTabId)?.goForward?.()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
          </svg>
        </button>
        <button
          id="reload-button"
          className={
            document.getElementById(openTabId)?.isLoading?.() ? "loading" : ""
          }
          title="Reload"
          type="button"
          onClick={() => document.getElementById(openTabId)?.reload?.()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
          </svg>{" "}
        </button>
        <button
          title="Close Tab"
          type="button"
          onClick={() => removeTab(openTabId)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </button>
        <button title="Add Tab" type="button" onClick={addTab}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
