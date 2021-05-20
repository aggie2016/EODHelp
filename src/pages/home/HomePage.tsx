import React from 'react';
import styles from './HomePage.module.css';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';
import CallIcon from '@material-ui/icons/Call';

import eodHelpIcon from '../../images/eod-help-main-icon.png';
import { PulseButton } from './components/buttons/PulseButton';
import { useHistory } from 'react-router-dom';
import { ClientPhoneNumberForm } from './components/forms/ClientPhoneNumberForm';

import { useAtom } from 'jotai';
import { IUserInfo, userInfoAtom } from '../../utilties/hooks';
import { sendGetAllSettingsRequest } from 'db-core';

/**
 *  The application settings that can be retrieved from the server.
 */
interface IApplicationOptions {
    /**
     *  The main support line number for users to contact on-demand.
     */
    mainPhoneNumber: string;
}

/**
 * React component that builds the home page content for the application.
 */
export const HomePage: React.FC = () => {
    const [userInfo, setUserInfo] = useAtom<IUserInfo, IUserInfo>(userInfoAtom);
    const [appSettings, setAppSettings] = React.useState<IApplicationOptions | undefined>(
        undefined
    );

    const history = useHistory();

    /**
     *  Triggered when the main "Find a Friend" button is clicked.
     */
    const onPulseButtonClicked = () => {
        history.push('/contacts');
    };

    /**
     *  Triggered when the registration button is clicked.
     */
    const onRegisterButtonClicked = () => {
        history.push('/register');
    };

    React.useEffect(() => {
        sendGetAllSettingsRequest({}).then((result) => {
            if (result.errorCode || result.errorMessage) {
                console.error(`Error [${result.errorCode}]: ${result.errorMessage}`);
            } else {
                setAppSettings({
                    ...appSettings,
                    mainPhoneNumber: result.mainPhoneNumber,
                });
            }
        });
    }, []);

    /**
     *  Returns a loading animation for the main support number or the number itself
     *  when available.
     */
    const getPhoneNumberContent = () => {
        if (appSettings && appSettings.mainPhoneNumber) {
            return `24 HR HOTLINE: ${appSettings.mainPhoneNumber}`;
        } else {
            return <CircularProgress variant={'indeterminate'} size={25} color={'inherit'} />;
        }
    };

    /**
     * Triggered when the hotline button is clicked. Forwards the hotline number
     * to an application or service that can process the request.
     */
    const getPhoneNumberAction = () => {
        if (appSettings && appSettings.mainPhoneNumber) {
            window.location.href = `tel:${appSettings?.mainPhoneNumber}`;
        }
    };

    /**
     * Returns a form to active the application with a valid phone number or
     * a pulsing button if the phone number is saved in localStorage.
     */
    const getCenterContent = () => {
        if (!userInfo.phoneNumber || userInfo.phoneNumber === '') {
            return (
                <ClientPhoneNumberForm
                    onSave={(phoneNumber) => {
                        setUserInfo({
                            phoneNumber: phoneNumber,
                        });
                    }}
                />
            );
        } else {
            return <PulseButton onClick={onPulseButtonClicked} />;
        }
    };

    return (
        <div className={styles.container}>
            <div>
                <img src={eodHelpIcon} className={styles.eodHelpImage} alt={'EOD Help Icon'} />
                <div className={styles.pushButtonContainer}>{getCenterContent()}</div>
                <div className={styles.actionsContainer}>
                    <Button
                        variant='contained'
                        color='primary'
                        disabled={appSettings === undefined}
                        style={{ marginBottom: '15px', marginTop: '10px' }}
                        startIcon={<CallIcon />}
                        onClick={getPhoneNumberAction}
                    >
                        {getPhoneNumberContent()}
                    </Button>
                    <Button variant='contained' color='default' onClick={onRegisterButtonClicked}>
                        WANT TO HELP? TAP HERE TO SIGN UP!
                    </Button>
                </div>
            </div>
        </div>
    );
};
