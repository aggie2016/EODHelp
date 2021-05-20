// Libraries
import React from 'react';
import ReactDOM from 'react-dom';

// Components
import { HashRouter as Router } from 'react-router-dom';
import App from './App';

// PWA Resources
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { Button, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

/**
 *  Provides a service worker that caches assets for offline usage.
 *  When an updated application is available for download, provides the ability
 *  to force a hard refresh of the SPA.
 */
const ServiceWorkerWrapper = () => {
    const [showReload, setShowReload] = React.useState(false);
    const [waitingWorker, setWaitingWorker] = React.useState<ServiceWorker | null>(null);

    const onSWUpdate = (registration: ServiceWorkerRegistration) => {
        setShowReload(true);
        setWaitingWorker(registration.waiting);
    };

    React.useEffect(() => {
        // If you want your app to work offline and load faster, you can change
        // unregister() to register() below. Note this comes with some pitfalls.
        // Learn more about service workers: https://cra.link/PWA
        serviceWorkerRegistration.register({ onUpdate: onSWUpdate });
    }, []);

    const reloadPage = () => {
        waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
        setShowReload(false);
        window.location.reload(true);
    };

    return (
        <Snackbar
            open={showReload}
            onClick={reloadPage}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert
                severity='info'
                action={
                    <Button color='inherit' size='small' onClick={reloadPage}>
                        Reload
                    </Button>
                }
            >
                A new version is available!
            </Alert>
        </Snackbar>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <ServiceWorkerWrapper />
        <Router>
            <App />
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
