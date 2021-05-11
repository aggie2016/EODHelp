import React from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

interface ILocationAlertDialog {
    isOpen: boolean;
    onClose?: () => void;
}

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
