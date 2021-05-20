import React from 'react';
import { useAtom } from 'jotai';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Button, createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import { IUserInfo, userInfoAtom } from './utilties/hooks';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { HomePage } from './pages/home/HomePage';
import { ContactsPage } from './pages/contacts/ContactsPage';
import { RegisterPage } from './pages/register/RegisterPage';
import { Alert, AlertTitle } from '@material-ui/lab';

import './App.css';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
    },
});

const App: React.FC = () => {
    const [userInfo] = useAtom<IUserInfo>(userInfoAtom);

    /**
     *  Returns the routes that are only available when the user has a valid phone
     *  number associated with their application.
     */
    const getOptionalRoutes = () => {
        if (userInfo.phoneNumber) {
            return (
                <>
                    <Route path={'/contacts'} component={ContactsPage} />
                </>
            );
        }

        return (
            <Route>
                <Redirect to={'/'} />
            </Route>
        );
    };

    /**
     *  Provides a fallback component that prints the error message caught along
     *  with a stack trace for diagnostics
     * @param props the fallback props
     */
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
                    <Route path={'/register'} component={RegisterPage} />
                    {getOptionalRoutes()}
                </Switch>
            </ErrorBoundary>
        </ThemeProvider>
    );
};

export default App;
