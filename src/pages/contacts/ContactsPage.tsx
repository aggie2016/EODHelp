import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button,
    Paper,
    LinearProgress,
    Grid,
    CircularProgress,
    TableCell,
    TableRow,
    TableHead,
    Table,
    TableContainer,
    TableBody,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@material-ui/core';
import CallIcon from '@material-ui/icons/Call';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import { useAtom } from 'jotai';
import { Alert, AlertTitle } from '@material-ui/lab';

import { IUserInfo, userInfoAtom } from '../../utilties/hooks';

import chromeLogo from '../../images/chrome-logo.svg';
import firefoxLogo from '../../images/firefox-logo.svg';
import modernEdgeLogo from '../../images/modern-edge-logo.svg';
import safariLogo from '../../images/safari-logo.svg';

interface IApplicationOptions {
    mainPhoneNumber: string;
}

interface IContact {
    clientId: string;
    name: string;
    distanceMinutes: number;
}

interface IFormField<T> {
    value: T;
    isValid?: boolean;
}

interface ILinkInfo {
    sourceNumber?: string | null;
    targetNumber?: string | null;
}

export const ContactsPage: React.FC = (props) => {
    const [userInfo] = useAtom<IUserInfo>(userInfoAtom);
    const [appSettings, setAppSettings] = React.useState<IApplicationOptions | undefined>(
        undefined
    );

    const [isLocationWarningDialogOpen, setIsLocationWarningDialogOpen] = React.useState<boolean>(
        false
    );
    const [location, setLocation] = React.useState<GeolocationPosition | null>(null);
    const [isLinking, setIsLinking] = React.useState<boolean>(false);
    const [contacts, setContacts] = React.useState<IContact[] | undefined>(undefined);
    const [linkInfo, setLinkInfo] = React.useState<ILinkInfo | undefined>(undefined);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (location) => {
                    setLocation(location);
                },
                (positionError) => {
                    if (positionError.code === positionError.PERMISSION_DENIED) {
                        setIsLocationWarningDialogOpen(true);
                    }
                    setContacts([]);
                }
            );
        } else {
            setContacts([]);
        }
    };

    React.useEffect(() => {
        fetch('/api/settings/all')
            .then((response) => response.json())
            .then((settings) => setAppSettings(settings));

        getLocation();
    }, []);

    React.useEffect(() => {
        if (location) {
            try {
                fetch('/api/contacts/listNearby', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        clientId: userInfo.phoneNumber,
                        location: {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        },
                    }),
                })
                    .then((response) => response.json())
                    .then((contactData) => {
                        setContacts(
                            contactData.map((item: any) => {
                                return {
                                    name: item.name.first + ' ' + item.name.last,
                                    distanceMinutes: item.distanceMinutes.toFixed(0),
                                    clientId: item.userId,
                                };
                            })
                        );
                    });
            } catch (e) {}
        }
    }, [location]);

    const dialCall = (number: string) => {
        window.location.href = `tel:${number}`;
    };

    const getPhoneNumberContent = () => {
        if (appSettings && appSettings.mainPhoneNumber) {
            return `24 HR HOTLINE: ${appSettings.mainPhoneNumber}`;
        } else {
            return <CircularProgress variant={'indeterminate'} size={25} color={'inherit'} />;
        }
    };

    const getPhoneNumberAction = () => {
        if (appSettings && appSettings.mainPhoneNumber) {
            dialCall(appSettings.mainPhoneNumber);
        }
    };

    const linkCall = (sourceNumber: string | null, targetNumber: string | null) => {
        if (sourceNumber !== null && targetNumber !== null) {
            setIsLinking(true);

            fetch('/api/contacts/link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clientId: targetNumber,
                    incomingPhoneNumber: sourceNumber,
                }),
            })
                .then((response) => response.text())
                .then((twilioPhoneNumber) => {
                    // Received the Twilio number, call it
                    dialCall(twilioPhoneNumber);
                })
                .catch((reason) => {
                    console.log(reason);
                })
                .finally(() => {
                    setIsLinking(false);
                });

            return;
        }
    };

    React.useEffect(() => {
        if (linkInfo && linkInfo.sourceNumber && linkInfo.targetNumber) {
            linkCall(linkInfo.sourceNumber, linkInfo.targetNumber);
            setLinkInfo(undefined);
        }
    }, [linkInfo]);

    const triggerOutboundCall = async (clientIdentifier: string) => {
        try {
            const phoneNumber = userInfo.phoneNumber;

            if (phoneNumber) {
                setLinkInfo({
                    targetNumber: clientIdentifier,
                    sourceNumber: phoneNumber,
                });
                return;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const NavigationBar = () => {
        const history = useHistory();

        const goBack = () => {
            history.push('/');
        };

        return (
            <AppBar
                position='static'
                style={{
                    backgroundColor: '#292929',
                }}
            >
                <Toolbar>
                    <IconButton edge='start' color='inherit' aria-label='menu'>
                        <ArrowBackIcon onTouchEnd={goBack} onMouseUp={goBack} />
                    </IconButton>
                    <Typography variant='h6'>Nearby Contacts</Typography>
                </Toolbar>
            </AppBar>
        );
    };

    const ContactsTable = () => {
        if (contacts && contacts.length > 0) {
            return (
                <div
                    style={{
                        margin: '15px',
                    }}
                >
                    <TableContainer>
                        <Table
                            size={'small'}
                            style={{
                                backgroundColor: '#454545',
                                borderRadius: 0,
                            }}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        align={'center'}
                                        style={{
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                            borderColor: 'black',
                                        }}
                                    >
                                        People nearby willing to talk!
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {contacts.map((contact) => {
                                    return (
                                        <TableRow key={contact.clientId}>
                                            <TableCell
                                                align='left'
                                                style={{
                                                    color: 'white',
                                                    borderColor: 'black',
                                                }}
                                            >
                                                {contact.name}
                                            </TableCell>
                                            <TableCell
                                                align='center'
                                                style={{
                                                    color: 'white',
                                                    borderColor: 'black',
                                                }}
                                            >
                                                &lt; {contact.distanceMinutes} minutes away
                                            </TableCell>
                                            <TableCell
                                                align='right'
                                                style={{
                                                    borderColor: 'black',
                                                }}
                                            >
                                                <Button
                                                    variant={'contained'}
                                                    color={'primary'}
                                                    startIcon={<CallIcon />}
                                                    disabled={isLinking}
                                                    onClick={() =>
                                                        triggerOutboundCall(contact.clientId)
                                                    }
                                                >
                                                    CALL
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            );
        } else if (contacts && contacts.length === 0) {
            return (
                <Alert
                    severity={'info'}
                    style={{
                        margin: '15px',
                    }}
                >
                    <AlertTitle>No Users Found Within Driving Distance</AlertTitle>
                    If you would like to reach someone immediately, please click the button below to
                    be <b>IMMEDIATELY</b> connected to the EOD Support Line.
                </Alert>
            );
        } else {
            return <></>;
        }
    };

    return (
        <Grid container>
            <Grid
                item
                xs
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <NavigationBar />
                {contacts === undefined && (
                    <Grid container>
                        <Grid
                            item
                            xs
                            style={{
                                margin: '0 10px 10px 10px',
                            }}
                        >
                            <Paper
                                elevation={0}
                                style={{
                                    textAlign: 'center',
                                    margin: '10px 0 0 0',
                                }}
                            >
                                <Typography
                                    variant={'body1'}
                                    style={{
                                        paddingTop: '5px',
                                        paddingBottom: '5px',
                                        backgroundColor: '#7a7a7a',
                                    }}
                                >
                                    Searching for nearby contacts
                                </Typography>
                            </Paper>
                            <LinearProgress variant={'indeterminate'} />
                        </Grid>
                    </Grid>
                )}
                <Grid
                    container
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                    }}
                >
                    <Grid item xs>
                        <ContactsTable />
                    </Grid>
                </Grid>
                <Button
                    variant='contained'
                    color='primary'
                    disabled={appSettings === undefined}
                    style={{ margin: '15px' }}
                    startIcon={<CallIcon />}
                    onClick={getPhoneNumberAction}
                >
                    {getPhoneNumberContent()}
                </Button>
                <Dialog
                    open={isLocationWarningDialogOpen}
                    disableBackdropClick={true}
                    onClose={() => setIsLocationWarningDialogOpen(false)}
                >
                    <DialogTitle>One-Time Location Services Required</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To locate contacts in your local area, we need to query your location
                            once. To use this service, please re-enable location settings for this
                            website. Select your browser's icon below for more help:
                        </DialogContentText>
                        <Grid container>
                            <Grid item xs>
                                <IconButton
                                    onClick={() => {
                                        // Open Chrome Documentation for re-enabling location services:
                                        window.open(
                                            'https://support.google.com/chrome/answer/142065?co=GENIE.Platform%3DAndroid&hl=en&oco=0'
                                        );
                                    }}
                                >
                                    <img
                                        alt={'chrome-logo'}
                                        src={chromeLogo}
                                        style={{ height: '48px', width: '48px' }}
                                    />
                                </IconButton>
                            </Grid>
                            <Grid item xs>
                                <IconButton
                                    onClick={() => {
                                        // Open Firefox Documentation for re-enabling location services:
                                        window.open(
                                            'https://support.mozilla.org/en-US/kb/does-firefox-share-my-location-websites'
                                        );
                                    }}
                                >
                                    <img
                                        alt={'firefox-logo'}
                                        src={firefoxLogo}
                                        style={{ height: '48px', width: '48px' }}
                                    />
                                </IconButton>
                            </Grid>
                            <Grid item xs>
                                <IconButton
                                    onClick={() => {
                                        // Open Edge Documentation for re-enabling location services:
                                        window.open(
                                            'https://support.microsoft.com/en-us/microsoft-edge/location-and-privacy-in-microsoft-edge-31b5d154-0b1b-90ef-e389-7c7d4ffe7b04'
                                        );
                                    }}
                                >
                                    <img
                                        alt={'modern-edge-logo'}
                                        src={modernEdgeLogo}
                                        style={{ height: '48px', width: '48px' }}
                                    />
                                </IconButton>
                            </Grid>
                            <Grid item xs>
                                <IconButton
                                    onClick={() => {
                                        // Open Safari Documentation for re-enabling location services:
                                        window.open('https://support.apple.com/en-us/HT207092');
                                    }}
                                >
                                    <img
                                        alt={'safari-logo'}
                                        src={safariLogo}
                                        style={{ height: '48px', width: '48px' }}
                                    />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsLocationWarningDialogOpen(false)}>Close</Button>
                        <Button onClick={() => window.location.reload()}>Reload Page</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </Grid>
    );
};
