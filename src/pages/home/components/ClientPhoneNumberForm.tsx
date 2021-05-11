import React from 'react';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from '@material-ui/core';
import PhoneInput from 'react-phone-input-2';
import { Alert, AlertTitle } from '@material-ui/lab';

import 'react-phone-input-2/lib/material.css';

interface IClientPhoneNumberForm {
    onSave: (phoneNumber: string) => void;
}

enum VerifyType {
    Voice,
    SMS,
}

interface IFormProps {
    verificationType: VerifyType;
    phoneNumber: string;
}

interface IVerificationProps {
    challengeId: number;
}

const VALIDATION_NUMBER_LENGTH = 6;
const RESEND_INTERVAL_SECONDS = 15 * 1000;

export const ClientPhoneNumberForm: React.FC<IClientPhoneNumberForm> = (props) => {
    const [formData, setFormData] = React.useState<IFormProps>({
        phoneNumber: '',
        verificationType: VerifyType.SMS,
    });

    const [isValidationDialogOpen, setIsValidationDialogOpen] = React.useState<boolean>(false);
    const [showResendButton, setShowResendButton] = React.useState<boolean>(false);
    const [isSecondCodeSent, setIsSecondCodeSent] = React.useState<boolean>(false);
    const [isGeneratingCode, setIsGeneratingCode] = React.useState<boolean>(false);
    const [isPhoneNumberValid, setIsPhoneNumberValid] = React.useState<boolean>(false);
    const [validationCode, setValidationCode] = React.useState<string>('');
    const [challengeToken, setChallengeToken] = React.useState<string>('');
    const [verificationResult, setVerificationResult] = React.useState<string | undefined>(
        undefined
    );

    React.useEffect(() => {
        if (isValidationDialogOpen) {
            window.setTimeout(() => {
                setShowResendButton(true);
            }, RESEND_INTERVAL_SECONDS);
        }
    }, [isValidationDialogOpen]);

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

    const onPhoneSubmitButtonClicked = () => {
        setIsGeneratingCode(true);
        generateCode();
    };

    const onVerifyButtonClicked = async () => {
        if (await validateCode(challengeToken, validationCode)) {
            setIsValidationDialogOpen(false);
            props.onSave(formData.phoneNumber);
        } else {
            setVerificationResult('Code is invalid');
        }
    };

    return (
        <>
            <Paper
                elevation={3}
                style={{
                    backgroundColor: '#4f4f4f',
                    marginLeft: '15px',
                    marginRight: '15px',
                    marginTop: 'auto',
                    marginBottom: 'auto',
                    padding: '15px',
                }}
            >
                <Grid container>
                    <Grid item xs>
                        <Typography
                            variant={'body1'}
                            style={{
                                color: 'white',
                                marginBottom: '10px',
                            }}
                        >
                            Enter your phone number to continue
                        </Typography>
                        <Grid container>
                            <Grid item xs>
                                <PhoneInput
                                    country={'us'}
                                    specialLabel={''}
                                    inputStyle={{ width: '100%' }}
                                    inputProps={{
                                        name: 'phone',
                                        required: true,
                                        autoFocus: true,
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
                                    <p style={{ color: 'white', fontSize: '12px' }}>
                                        Verify via Text
                                    </p>
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
                                    <p style={{ color: 'white', fontSize: '12px' }}>
                                        Verify via Phone
                                    </p>
                                }
                                labelPlacement='end'
                            />
                        </RadioGroup>
                        <Grid container>
                            <Grid
                                item
                                xs
                                style={{
                                    textAlign: 'center',
                                }}
                            >
                                <Button
                                    variant={'contained'}
                                    color={'primary'}
                                    disabled={isGeneratingCode || !isPhoneNumberValid}
                                    onClick={onPhoneSubmitButtonClicked}
                                >
                                    {isGeneratingCode ? (
                                        <CircularProgress size={25} style={{ color: 'white' }} />
                                    ) : (
                                        'Submit'
                                    )}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
            <Dialog
                open={isValidationDialogOpen}
                disableBackdropClick={true}
                onClose={() => {
                    setIsSecondCodeSent(false);
                    setShowResendButton(false);
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
                                        event.currentTarget.value.length <= VALIDATION_NUMBER_LENGTH
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
                            setIsSecondCodeSent(false);
                            setShowResendButton(false);
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
        </>
    );
};
