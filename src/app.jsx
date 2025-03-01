import React, { useState } from 'react'
import Tabs from './componetns/tabs';

export default function App() {
    const [appState, setAppStalte] = useState("websites");

    return <>
        <Tabs active={appState == "websites"} />
    </>
}