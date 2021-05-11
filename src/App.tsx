import React from 'react';
import { useAtom } from 'jotai';
import { Route, Redirect, Switch, useHistory } from 'react-router-dom';
import { Button, createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import { IUserInfo, userInfoAtom } from './utilties/hooks';
import { ErrorBoundary, ErrorBoundaryProps, FallbackProps } from 'react-error-boundary';
import { HomePage } from './pages/home/HomePage';
import { ContactsPage } from './pages/contacts/ContactsPage';
import { RegisterPage } from './pages/register/RegisterPage';

import './App.css';
import { Alert, AlertTitle } from '@material-ui/lab';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
    },
});

function App() {
    const [userInfo] = useAtom<IUserInfo>(userInfoAtom);

    const getOptionalRoutes = () => {
        if (true) {
            return (
                <>
                    <Route path={'/contacts'} component={ContactsPage} />
                    <Route path={'/register'} component={RegisterPage} />
                </>
            );
        }

        return (
            <Route>
                <Redirect to={'/'} />
            </Route>
        );
    };

    const ErrorFallback = (props: FallbackProps) => {
        return (
            <Alert
                severity={'error'}
                style={{
                    margin: '15px',
                }}
            >
                <AlertTitle>Something went wrong:</AlertTitle>
                <pre>{props.error.message}</pre>
                <pre>{props.error.stack}</pre>
                <Button onClick={props.resetErrorBoundary}>Try again</Button>
            </Alert>
        );
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => {
                    window.location.reload();
                }}
            >
                <Switch>
                    <Route exact path='/' component={HomePage} />
                    {getOptionalRoutes()}
                </Switch>
            </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;
