import React from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

/**
 * Properties for the {@link LocationAlertDialog}
 */
interface ILocationAlertDialog {
    isOpen: boolean;
    onClose?: () => void;
}

/**
 * Provides a dialog that displays a message that explains the need for location
 * services. This dialog can be used prior to requesting location information.
 * @param props properties for {@link LocationAlertDialog}
 */
export const LocationAlertDialog: React.FC<ILocationAlertDialog> = (props) => {
    return (
        <Dialog open={props.isOpen} disableBackdropClick={true} onClose={props.onClose}>
            <DialogTitle>One-Time Location Services Required</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To register for this site, we need to query your location to match you with
                    other users in your area. Please allow location services if prompted by your
                    browser.
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
};
