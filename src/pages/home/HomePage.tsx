import React from 'react';
import styles from './HomePage.module.css';
import Button from '@material-ui/core/Button';
import { AppBar, CircularProgress, Typography } from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import CallIcon from '@material-ui/icons/Call';
import SettingsIcon from '@material-ui/icons/Settings';

import eodHelpIcon from '../../images/eod-help-main-icon.png';
import { PulseButton } from './components/PulseButton';
import { useHistory } from 'react-router-dom';
import { ClientPhoneNumberForm } from './components/ClientPhoneNumberForm';

import { useAtom } from 'jotai';
import { IUserInfo, userInfoAtom } from '../../utilties/hooks';

interface IApplicationOptions {
    mainPhoneNumber: string;
}

export const HomePage: React.FC = (props) => {
    const [userInfo, setUserInfo] = useAtom<IUserInfo, IUserInfo>(userInfoAtom);
    const [appSettings, setAppSettings] = React.useState<IApplicationOptions | undefined>(
        undefined
    );

    const history = useHistory();

    const onPulseButtonClicked = () => {
        history.push('/contacts');
    };

    const onRegisterButtonClicked = () => {
        history.push('/register');
    };

    React.useEffect(() => {
        fetch('/api/settings/all')
            .then((response) => response.json())
            .then((settings) => setAppSettings(settings));
    }, []);

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
