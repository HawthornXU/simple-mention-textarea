import React, { Suspense } from 'react';
import { AppRouter } from "./AppRouter";

function App() {
    return (
        <Suspense fallback={false}>
            <AppRouter/>
        </Suspense>);
}

export default App;
