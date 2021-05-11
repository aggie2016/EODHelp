import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button,
    Paper,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    CircularProgress,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom';
import { Alert, AlertTitle } from '@material-ui/lab';

import chromeLogo from '../../images/chrome-logo.svg';
import firefoxLogo from '../../images/firefox-logo.svg';
import modernEdgeLogo from '../../images/modern-edge-logo.svg';
import safariLogo from '../../images/safari-logo.svg';
import eodHelplineLogo from '../../images/eod-help-main-icon.png';

import PhoneInput from 'react-phone-input-2';
import { LocationAlertDialog } from '../../components/LocationAlertDialog';
import CallIcon from '@material-ui/icons/Call';
import { useAtom } from 'jotai';
import { IUserInfo, userInfoAtom } from '../../utilties/hooks';
import { makeStyles } from '@material-ui/styles';

interface IApplicationOptions {
    mainPhoneNumber: string;
}

enum VerifyType {
    Voice,
    SMS,
}

interface IFormProps {
    firstName: string;
    lastName: string;
    emailAddress: string;
    additionalInformation: string;
    verificationType: VerifyType;
    phoneNumber: string;
}

const styles = makeStyles(() => ({
    inputLabel: {
        color: 'black',
        '&': {
            color: 'black',
            backgroundColor: 'white',
            padding: '2px 5px',
            borderRadius: '3px',
        },
    },
}));

const VALIDATION_NUMBER_LENGTH = 6;
const RESEND_INTERVAL_SECONDS = 15 * 1000;

export const RegisterPage: React.FC = (props) => {
    const [userInfo, setUserInfo] = useAtom<IUserInfo, IUserInfo>(userInfoAtom);
    const [appSettings, setAppSettings] = React.useState<IApplicationOptions | undefined>(
        undefined
    );

    const classes = styles();

    const [
        isLocationNotificationDialogOpen,
        setIsLocationNotificationDialogOpen,
    ] = React.useState<boolean>(false);
    const [isLocationErrorDialogOpen, setIsLocationErrorDialogOpen] = React.useState<boolean>(
        false
    );
    const [location, setLocation] = React.useState<GeolocationPosition | null>(null);
    const [formData, setFormData] = React.useState<IFormProps>({
        firstName: '',
        lastName: '',
        emailAddress: '',
        additionalInformation: '',
        phoneNumber: '',
        verificationType: VerifyType.SMS,
    });

    const [isRegistered, setIsRegistered] = React.useState<boolean>(false);
    const [isAccountDisabled, setIsAccountDisabled] = React.useState<boolean>(false);
    const [isDisablingAccount, setIsDisablingAccount] = React.useState<boolean>(false);
    const [isRemovingAccount, setIsRemovingAccount] = React.useState<boolean>(false);

    const [showResendButton, setShowResendButton] = React.useState<boolean>(false);
    const [isSecondCodeSent, setIsSecondCodeSent] = React.useState<boolean>(false);
    const [isGeneratingCode, setIsGeneratingCode] = React.useState<boolean>(false);
    const [isPhoneNumberValid, setIsPhoneNumberValid] = React.useState<boolean>(false);

    const [isContactCardDownloading, setIsContactCardDownloading] = React.useState<boolean>(false);

    const [isContactCardDialogOpen, setIsContactCardDialogOpen] = React.useState<boolean>(false);
    const [isConfirmRemoveDialogOpen, setIsConfirmRemoveDialogOpen] = React.useState<boolean>(
        false
    );
    const [isValidationDialogOpen, setIsValidationDialogOpen] = React.useState<boolean>(false);

    const [validationCode, setValidationCode] = React.useState<string>('');
    const [challengeToken, setChallengeToken] = React.useState<string>('');
    const [verificationResult, setVerificationResult] = React.useState<string | undefined>(
        undefined
    );
    const [registerErrorMessage, setRegisterErrorMessage] = React.useState<string | undefined>(
        undefined
    );

    const getContactsCard = () => {
        setIsContactCardDownloading(true);
        fetch('/api/contacts/contactCard')
            .then((response) => response.blob())
            .then((contactCardFile) => {
                setIsContactCardDialogOpen(true);
                setIsContactCardDownloading(false);

                // Create block link to download
                const downloadUrl = window.URL.createObjectURL(new Blob([contactCardFile]));
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', `EODHelpLineContactCard.vcf`);

                // Append to HTML page
                document.body.appendChild(link);

                // Force download
                link.click();

                // Clean up and remove the link
                // @ts-ignore
                link.parentNode.removeChild(link);
            });
    };

    const generateCode = (resend?: boolean) => {
        fetch('/api/auth/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: formData.phoneNumber,
                verificationType: formData.verificationType,
                isPhoneNumberValid: isPhoneNumberValid,
                resendCode: resend,
            }),
        })
            .then((response) => response.json())
            .then((tokenData) => {
                if (tokenData.isSent) {
                    setChallengeToken(tokenData.challengeId);
                    setIsValidationDialogOpen(true);
                } else {
                    // Show error dialog
                }
            })
            .catch((reason) => {
                console.log(reason);
                // Show error dialog
            })
            .finally(() => {
                setIsGeneratingCode(false);
            });
    };

    const registerUser = () => {
        fetch('/api/contacts/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: formData.firstName,
                lastName: formData.lastName,
                emailAddress: formData.emailAddress,
                location: {
                    latitude: location?.coords.latitude,
                    longitude: location?.coords.longitude,
                },
                phoneNumber: formData.phoneNumber,
                additionalInformation: formData.additionalInformation,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    response.text().then((errorMessage) => {
                        setRegisterErrorMessage(errorMessage);
                    });
                }
            })
            .then((registrationResult) => {
                if (registrationResult.isRegistered) {
                    setIsRegistered(true);
                    setUserInfo({
                        ...userInfo,
                        phoneNumber: registrationResult.phoneNumber,
                    });
                } else {
                    // Show error dialog
                    setRegisterErrorMessage(
                        'An unknown error occurred while registering. Please contact the EOD Help Line for more information.'
                    );
                }
            })
            .catch((reason) => {
                console.log(reason);
                // Show error dialog
                setRegisterErrorMessage(reason.toString());
            });
    };

    const validateCode = async (challengeId: string, code: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    challengeId: challengeId,
                    verificationCode: code,
                }),
            });

            const validationResult = await response.json();
            return validationResult && validationResult.isValid;
        } catch (e) {
            return false;
        }
    };

    const validInputFields = (): boolean => {
        return (
            formData.firstName !== '' &&
            formData.lastName !== '' &&
            formData.emailAddress !== '' &&
            isPhoneNumberValid
        );
    };

    const onSubmitButtonClicked = () => {
        setIsGeneratingCode(true);
        getLocation();
    };

    const onVerifyButtonClicked = async () => {
        if (await validateCode(challengeToken, validationCode)) {
            setIsValidationDialogOpen(false);
            setValidationCode('');
            setShowResendButton(false);
            registerUser();
        } else {
            setVerificationResult('Code is invalid');
        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            setIsLocationNotificationDialogOpen(true);
            navigator.geolocation.getCurrentPosition(
                (deviceLocation) => {
                    setIsLocationNotificationDialogOpen(false);
                    setLocation(deviceLocation);
                    generateCode();
                },
                (positionError) => {
                    if (positionError.code === positionError.PERMISSION_DENIED) {
                        setIsLocationErrorDialogOpen(true);
                    }
                }
            );
        }
    };

    const onDisableAccountClicked = () => {
        setIsDisablingAccount(true);
        fetch('/api/contacts/changeStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: userInfo.phoneNumber,
                status: 'disable',
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then((registrationStatus) => {
                if (registrationStatus.isRegistered !== undefined) {
                    setIsRegistered(registrationStatus.isRegistered);
                }
                if (registrationStatus.isActive !== undefined) {
                    setIsAccountDisabled(!registrationStatus.isActive);
                }
            })
            .finally(() => {
                setIsDisablingAccount(false);
            });
    };

    const onEnableAccountClicked = () => {
        setIsDisablingAccount(true);
        fetch('/api/contacts/changeStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: userInfo.phoneNumber,
                status: 'enable',
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then((registrationStatus) => {
                if (registrationStatus.isRegistered !== undefined) {
                    setIsRegistered(registrationStatus.isRegistered);
                }
                if (registrationStatus.isActive !== undefined) {
                    setIsAccountDisabled(!registrationStatus.isActive);
                }
            })
            .finally(() => {
                setIsDisablingAccount(false);
            });
    };

    const removeAccount = () => {
        setIsConfirmRemoveDialogOpen(false);
        setIsRemovingAccount(true);
        fetch('/api/contacts/changeStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: userInfo.phoneNumber,
                status: 'remove',
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then((registrationStatus) => {
                if (registrationStatus.isRegistered !== undefined) {
                    setIsRegistered(registrationStatus.isRegistered);
                }
                if (registrationStatus.isActive !== undefined) {
                    setIsAccountDisabled(!registrationStatus.isActive);
                }
            })
            .finally(() => {
                setIsRemovingAccount(false);
                setFormData({
                    firstName: '',
                    lastName: '',
                    emailAddress: '',
                    additionalInformation: '',
                    verificationType: VerifyType.SMS,
                    phoneNumber: '',
                });
            });
    };

    const onRemoveAccountClicked = () => {
        setIsConfirmRemoveDialogOpen(true);
    };

    React.useEffect(() => {
        if (isValidationDialogOpen) {
            window.setTimeout(() => {
                setShowResendButton(true);
            }, RESEND_INTERVAL_SECONDS);
        }
    }, [isValidationDialogOpen]);

    React.useEffect(() => {
        // Download all application specific settings
        fetch('/api/settings/all')
            .then((response) => response.json())
            .then((settings) => setAppSettings(settings));

        // Check for user registration on load
        fetch('/api/contacts/checkRegistration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: userInfo.phoneNumber,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then((registrationStatus) => {
                if (registrationStatus.isRegistered) {
                    setIsRegistered(true);
                }
                if (registrationStatus.isActive !== undefined) {
                    setIsAccountDisabled(!registrationStatus.isActive);
                }
            })
            .catch((error) => {
                setIsRegistered(false);
            });
    }, [userInfo]);

    const NavigationBar = () => {
        const history = useHistory();

        const goBack = () => {
            history.push('/');
        };

        const isNavigationDisabled = () => {
            return isDisablingAccount || isRemovingAccount || isGeneratingCode;
        };

        return (
            <AppBar
                position='sticky'
                style={{
                    backgroundColor: '#292929',
                }}
            >
                <Toolbar>
                    <IconButton
                        disabled={isNavigationDisabled()}
                        edge='start'
                        color='inherit'
                        aria-label='menu'
                    >
                        <ArrowBackIcon onTouchEnd={goBack} onMouseUp={goBack} />
                    </IconButton>
                    <Typography variant='h6'>Register As A Volunteer</Typography>
                </Toolbar>
            </AppBar>
        );
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
            window.location.href = `tel:${appSettings?.mainPhoneNumber}`;
        }
    };

    const getFormContent = () => {
        if (isRegistered) {
            return (
                <>
                    <Alert severity={'success'}>
                        <AlertTitle>You're Registered!</AlertTitle>
                        Thank for your joining the EOD Support Community. Any calls forwarded to
                        your number will come from the 24 Hotline number. We'll send a text message
                        to your phone once every 3 months to let you opt-out of this service.
                        Otherwise, please click the button below to disable or remove your account.
                    </Alert>
                    <Paper
                        onClick={() => getContactsCard()}
                        elevation={4}
                        style={{
                            margin: '15px 0 0 0',
                        }}
                    >
                        {!isContactCardDownloading && (
                            <>
                                <Grid container>
                                    <Grid item>
                                        <img
                                            alt={'EOD Crab Logo'}
                                            src={eodHelplineLogo}
                                            style={{
                                                margin: '10px',
                                                maxWidth: '50px',
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs
                                        style={{ marginTop: 'auto', marginBottom: 'auto' }}
                                    >
                                        <Typography variant={'body1'}>
                                            EOD 24-Hour Helpline
                                        </Typography>
                                        <Typography variant={'caption'}>
                                            {appSettings?.mainPhoneNumber}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <div
                                    style={{
                                        textAlign: 'center',
                                        backgroundColor: '#a7a7a7',
                                        borderBottomLeftRadius: '5px',
                                        borderBottomRightRadius: '5px',
                                    }}
                                >
                                    <Typography variant={'caption'}>
                                        Tap to add me to your contacts
                                    </Typography>
                                </div>
                            </>
                        )}
                        {isContactCardDownloading && (
                            <Grid container>
                                <Grid item xs style={{ textAlign: 'center', padding: '15px' }}>
                                    <CircularProgress />
                                </Grid>
                            </Grid>
                        )}
                    </Paper>
                    <Grid container>
                        <Grid item xs>
                            <Button
                                fullWidth
                                variant={'contained'}
                                color={'default'}
                                style={{ marginTop: '15px', marginBottom: '5px' }}
                                disabled={isRemovingAccount || isDisablingAccount}
                                onClick={
                                    isAccountDisabled
                                        ? onEnableAccountClicked
                                        : onDisableAccountClicked
                                }
                            >
                                {isDisablingAccount ? (
                                    <CircularProgress size={20} />
                                ) : isAccountDisabled ? (
                                    'Enable My Account'
                                ) : (
                                    'Disable My Account'
                                )}
                            </Button>
                            <Button
                                fullWidth
                                variant={'contained'}
                                style={{
                                    backgroundColor: '#7e021f',
                                    color: 'white',
                                }}
                                disabled={isRemovingAccount || isDisablingAccount}
                                onClick={onRemoveAccountClicked}
                            >
                                {isRemovingAccount ? (
                                    <CircularProgress size={20} />
                                ) : (
                                    'Remove My Account'
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </>
            );
        } else {
            return (
                <>
                    {registerErrorMessage && (
                        <Alert severity={'error'} style={{ marginBottom: '10px' }}>
                            <AlertTitle>Registration Error</AlertTitle>
                            {registerErrorMessage}
                        </Alert>
                    )}
                    {!registerErrorMessage && (
                        <Alert severity={'warning'} icon={false} style={{ marginBottom: '10px' }}>
                            <AlertTitle>Join The Team</AlertTitle>
                            Fill out the form below to register as a point-of-contact for other EOD
                            professionals in your local area. Your contact information will remain
                            completely anonymous. Any calls forwarded to your number will come from
                            the 24 Hotline number below.
                        </Alert>
                    )}
                    <Grid container>
                        <Grid item xs>
                            <TextField
                                type={'text'}
                                label={'First Name'}
                                variant={'outlined'}
                                InputLabelProps={{
                                    classes: {
                                        root: classes.inputLabel,
                                        focused: 'focused',
                                    },
                                }}
                                style={{
                                    marginBottom: '10px',
                                    marginRight: '5px',
                                    backgroundColor: 'white',
                                    borderRadius: '4px',
                                }}
                                error={formData.firstName === ''}
                                value={formData.firstName}
                                onChange={(event) => {
                                    setFormData({
                                        ...formData,
                                        firstName: event.currentTarget.value,
                                    });
                                }}
                            />
                        </Grid>
                        <Grid item xs>
                            <TextField
                                fullWidth
                                type={'text'}
                                label={'Last Name'}
                                variant={'outlined'}
                                InputLabelProps={{
                                    classes: {
                                        root: classes.inputLabel,
                                        focused: 'focused',
                                    },
                                }}
                                style={{
                                    marginBottom: '10px',
                                    backgroundColor: 'white',
                                    borderRadius: '4px',
                                }}
                                error={formData.lastName === ''}
                                value={formData.lastName}
                                onChange={(event) => {
                                    setFormData({
                                        ...formData,
                                        lastName: event.currentTarget.value,
                                    });
                                }}
                            />
                        </Grid>
                        <TextField
                            fullWidth
                            type={'email'}
                            label={'Email Address'}
                            variant={'outlined'}
                            InputLabelProps={{
                                classes: {
                                    root: classes.inputLabel,
                                    focused: 'focused',
                                },
                            }}
                            style={{
                                marginBottom: '10px',
                                backgroundColor: 'white',
                                borderRadius: '4px',
                            }}
                            error={formData.emailAddress === ''}
                            value={formData.emailAddress}
                            onChange={(event) => {
                                setFormData({
                                    ...formData,
                                    emailAddress: event.currentTarget.value,
                                });
                            }}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            type={'text'}
                            label={'Additional Information'}
                            variant={'outlined'}
                            InputLabelProps={{
                                classes: {
                                    root: classes.inputLabel,
                                    focused: 'focused',
                                },
                            }}
                            value={formData.additionalInformation}
                            style={{
                                marginBottom: '10px',
                                backgroundColor: 'white',
                                borderRadius: '4px',
                            }}
                            onChange={(event) => {
                                setFormData({
                                    ...formData,
                                    additionalInformation: event.currentTarget.value,
                                });
                            }}
                        />
                    </Grid>
                    <Grid container>
                        <Grid item xs>
                            <PhoneInput
                                country={'us'}
                                specialLabel={''}
                                inputStyle={{ width: '100%' }}
                                inputProps={{
                                    name: 'phone',
                                    required: true,
                                }}
                                countryCodeEditable={false}
                                value={formData.phoneNumber}
                                onChange={(phone) =>
                                    setFormData({
                                        ...formData,
                                        phoneNumber: phone,
                                    })
                                }
                                isValid={(value, country) => {
                                    const isValidNumber = /\+?([\d|\(][\h|\(\d{3}\)|\.|\-|\d]{4,}\d)/.test(
                                        value
                                    );

                                    setIsPhoneNumberValid(isValidNumber);
                                    return isValidNumber;
                                }}
                            />
                        </Grid>
                    </Grid>
                    <RadioGroup row>
                        <FormControlLabel
                            value='Verify via Phone'
                            style={{ marginLeft: 'auto' }}
                            control={
                                <Radio
                                    name='radio-verify-type'
                                    checked={formData.verificationType === VerifyType.SMS}
                                    value={VerifyType.SMS}
                                    style={{
                                        color: 'white',
                                    }}
                                    onChange={(event, checked) => {
                                        if (checked) {
                                            setFormData({
                                                ...formData,
                                                verificationType: VerifyType.SMS,
                                            });
                                        }
                                    }}
                                />
                            }
                            label={
                                <p style={{ color: 'white', fontSize: '12px' }}>Verify via Text</p>
                            }
                            labelPlacement='end'
                        />
                        <FormControlLabel
                            value='Verify via Text'
                            style={{ marginRight: 'auto' }}
                            control={
                                <Radio
                                    name='radio-verify-type'
                                    checked={formData.verificationType === VerifyType.Voice}
                                    value={VerifyType.Voice}
                                    style={{
                                        color: 'white',
                                    }}
                                    onChange={(event, checked) => {
                                        if (checked) {
                                            setFormData({
                                                ...formData,
                                                verificationType: VerifyType.Voice,
                                            });
                                        }
                                    }}
                                />
                            }
                            label={
                                <p style={{ color: 'white', fontSize: '12px' }}>Verify via Phone</p>
                            }
                            labelPlacement='end'
                        />
                    </RadioGroup>
                    <Grid container>
                        <Grid item xs>
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                fullWidth
                                style={{
                                    marginBottom: '5px',
                                }}
                                disabled={!validInputFields()}
                                onClick={onSubmitButtonClicked}
                            >
                                {isGeneratingCode ? (
                                    <CircularProgress size={25} style={{ color: 'white' }} />
                                ) : (
                                    'Register'
                                )}
                            </Button>
                            <Button
                                fullWidth
                                variant='contained'
                                color='default'
                                disabled={appSettings === undefined}
                                style={{ marginBottom: '15px' }}
                                startIcon={<CallIcon />}
                                onClick={getPhoneNumberAction}
                            >
                                {getPhoneNumberContent()}
                            </Button>
                        </Grid>
                    </Grid>
                </>
            );
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
                <Paper
                    elevation={3}
                    style={{
                        minWidth: '250px',
                        maxWidth: '450px',
                        padding: '10px',
                        margin: 'auto',
                        backgroundColor: '#3f3f3f',
                    }}
                >
                    {getFormContent()}
                </Paper>
                <Dialog
                    open={isValidationDialogOpen}
                    disableBackdropClick={true}
                    onClose={() => {
                        setIsValidationDialogOpen(false);
                    }}
                >
                    <DialogTitle>Verify Your Phone Number</DialogTitle>
                    <DialogContent>
                        {showResendButton && (
                            <Alert
                                severity={isSecondCodeSent ? 'success' : 'warning'}
                                style={{
                                    marginBottom: '15px',
                                }}
                            >
                                <AlertTitle>
                                    {isSecondCodeSent ? 'Check your device!' : 'No Code?'}
                                </AlertTitle>
                                <>
                                    {isSecondCodeSent && <>Your replacement code is on its way!</>}
                                    {!isSecondCodeSent && (
                                        <Button
                                            variant={'outlined'}
                                            onClick={() => {
                                                generateCode(true);
                                                setIsSecondCodeSent(true);
                                            }}
                                        >
                                            Resend Code
                                        </Button>
                                    )}
                                </>
                            </Alert>
                        )}
                        {verificationResult && (
                            <Alert
                                severity={'error'}
                                style={{
                                    marginBottom: '15px',
                                }}
                            >
                                <AlertTitle>Invalid Code Entered</AlertTitle>
                                For support please call <b>+1 888 412 0470</b>.
                            </Alert>
                        )}
                        <Alert severity={'info'}>
                            <AlertTitle>Verification Required</AlertTitle>
                            We just sent an {VALIDATION_NUMBER_LENGTH} digit code to the number your
                            provided. Please enter it below to continue:
                            <TextField
                                autoFocus
                                margin='dense'
                                id='validationCode'
                                label='Verification Code'
                                type='number'
                                value={validationCode}
                                error={validationCode.length < VALIDATION_NUMBER_LENGTH}
                                onChange={(event) => {
                                    if (event.currentTarget.value) {
                                        if (
                                            event.currentTarget.value.length <=
                                            VALIDATION_NUMBER_LENGTH
                                        ) {
                                            setValidationCode(event.currentTarget.value);
                                        }
                                    } else {
                                        setValidationCode('');
                                    }
                                }}
                                fullWidth
                            />
                        </Alert>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setShowResendButton(false);
                                setIsSecondCodeSent(false);
                                setIsValidationDialogOpen(false);
                            }}
                            color='primary'
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onVerifyButtonClicked}
                            disabled={validationCode.length != VALIDATION_NUMBER_LENGTH}
                            color='primary'
                        >
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={isLocationErrorDialogOpen}
                    disableBackdropClick={true}
                    onClose={() => setIsLocationErrorDialogOpen(false)}
                >
                    <DialogTitle>One-Time Location Services Required</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To match you with other users in your area, we need to know your
                            location. To register, please re-enable location settings for this
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
                        <Button onClick={() => setIsLocationErrorDialogOpen(false)}>Close</Button>
                        <Button onClick={() => window.location.reload()}>Reload Page</Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={isContactCardDialogOpen}
                    onClose={() => setIsContactCardDialogOpen(false)}
                >
                    <DialogContent>
                        <Grid container>
                            <Grid
                                item
                                xs
                                style={{
                                    textAlign: 'center',
                                }}
                            >
                                <GetAppIcon />
                                <Typography variant={'body1'}>
                                    Your contact card is currently downloading. Check your phone's
                                    notification area for more information.
                                </Typography>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
                <Dialog
                    open={isConfirmRemoveDialogOpen}
                    onClose={() => setIsConfirmRemoveDialogOpen(false)}
                    disableBackdropClick={true}
                >
                    <DialogContent>
                        <Typography style={{ marginBottom: '10px' }}>
                            This action will delete all of your user data. You can re-register at
                            any time.
                        </Typography>
                        <Grid container>
                            <Grid
                                item
                                style={{
                                    marginLeft: 'auto',
                                    marginRight: '5px',
                                }}
                            >
                                <Button
                                    variant={'contained'}
                                    color={'default'}
                                    disabled={isRemovingAccount || isDisablingAccount}
                                    onClick={() => setIsConfirmRemoveDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant={'contained'}
                                    style={{
                                        backgroundColor: '#7e021f',
                                        color: 'white',
                                    }}
                                    disabled={isRemovingAccount || isDisablingAccount}
                                    startIcon={<DeleteIcon />}
                                    onClick={removeAccount}
                                >
                                    Delete
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
                <LocationAlertDialog isOpen={isLocationNotificationDialogOpen} />
            </Grid>
        </Grid>
    );
};
