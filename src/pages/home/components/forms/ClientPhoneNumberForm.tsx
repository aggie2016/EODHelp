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
import { sendGenerateCodeRequest, verifyCodeRequest, VerifyType } from 'db-core';

interface IClientPhoneNumberForm {
    onSave: (phoneNumber: string) => void;
}

interface IFormProps {
    verificationType: VerifyType;
    phoneNumber: string;
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
        sendGenerateCodeRequest({
            resendCode: resend,
            phoneNumber: formData.phoneNumber,
            verificationType: formData.verificationType,
        }).then((result) => {
            if (result.errorCode || result.errorMessage) {
                console.error(`Error [${result.errorCode}]: ${result.errorMessage}`);
            } else {
                if (result.isSent) {
                    setChallengeToken(result.challengeId);
                    setIsValidationDialogOpen(true);
                }
            }

            setIsGeneratingCode(false);
        });
    };

    const validateCode = async (challengeId: string, code: string): Promise<boolean> => {
        const result = await verifyCodeRequest({
            challengeId: challengeId,
            verificationCode: code,
        });

        if (result.errorCode || result.errorMessage) {
            console.error(`Error [${result.errorCode}]: ${result.errorMessage}`);
        }

        return result.isValid;
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
                                    autoFormat={false}
                                    country={'us'}
                                    preferredCountries={['us', 'uk']}
                                    specialLabel={''}
                                    inputStyle={{ width: '100%' }}
                                    enableSearch={true}
                                    inputProps={{
                                        name: 'phone',
                                        required: true,
                                        autoFocus: true,
                                    }}
                                    value={formData.phoneNumber}
                                    onChange={(
                                        value: string,
                                        data: any,
                                        event: React.ChangeEvent<HTMLInputElement>,
                                        formattedValue: string
                                    ) =>
                                        setFormData({
                                            ...formData,
                                            phoneNumber: formattedValue,
                                        })
                                    }
                                    isValid={(value: string) => {
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
