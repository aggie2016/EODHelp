import React from 'react';
import styled from 'styled-components';

import {
    Button,
    Classes,
    Dialog,
    FormGroup,
    InputGroup
} from "@blueprintjs/core";

import {
    Col as BootstrapColumn,
    Container as BootstrapContainer,
    Row as BootstrapRow
} from "react-bootstrap";


export enum DialogMode {
    Add,
    Edit,
    View
}


export interface IContentItemDialogProps {
    /**
     *  Controls the visibility of the dialog. This prop is required because the component is controlled by the parent.
     */
    isOpen : boolean,

    /**
     *  A callback that is invoked when the user clicks the dialog's close button.
     */
    onClose : () => void,

    /**
     *  Sets the initial mode of the dialog to either adding, editing, or simply viewing a content item.
     */
    initialMode : DialogMode

}

interface IButtonState {
    isEnabled : boolean,
    isVisible: boolean,
    isLoading : boolean,
}

interface IActionButtons {
    close : IButtonState,
    save : IButtonState,
    saveAndClose : IButtonState
}


const ButtonArea = styled.div`
    text-align: right;
    
    & > * {
       margin-left: 3px;
    }
`;

export const ContentItemDialog : React.FC<IContentItemDialogProps> = props => {
    const [isOpen, setIsOpen] = React.useState<boolean>(props.isOpen);
    const [mode, setMode] = React.useState<DialogMode>(props.initialMode);
    const [actionsState, setActionsState] = React.useState<IActionButtons>({
        close: {
            isEnabled: true,
            isVisible: true,
            isLoading: false,
        },
        save: {
            isEnabled: true,
            isVisible: mode === DialogMode.Add  ||  mode === DialogMode.Edit,
            isLoading: false
        },
        saveAndClose: {
            isEnabled: true,
            isVisible: mode === DialogMode.Add  ||  mode === DialogMode.Edit,
            isLoading: false
        }
    })


    React.useEffect(() => {
        setIsOpen(props.isOpen);
    }, [props.isOpen]);


    const getDialogTitle = () : string => {
        switch(mode) {
            case DialogMode.Add:
                return "Add Content Item";
            case DialogMode.Edit:
                return "Edit Content Item";
            case DialogMode.View:
                return "View Content Item";
        }
    }

    const getRequiredLabelInfo = () : string => {
        if(mode === DialogMode.Add  ||  mode === DialogMode.Edit) {
            return "(required)";
        }

        return "";
    }


    const onSaveClicked = () => {
        setActionsState({
            close: {
                ...actionsState.close,
                isEnabled: false
            },
            save: {
                ...actionsState.save,
                isLoading: true,
                isEnabled: false
            },
            saveAndClose: {
                ...actionsState.saveAndClose,
                isLoading: false,
                isEnabled: false
            }
        });

        window.setTimeout(() => {
            setActionsState({
                close: {
                    ...actionsState.close,
                    isEnabled: true
                },
                save: {
                    ...actionsState.save,
                    isLoading: false,
                    isEnabled: true
                },
                saveAndClose: {
                    ...actionsState.saveAndClose,
                    isLoading: false,
                    isEnabled: true
                }
            });
        }, 2000);
    }

    const onSaveAndCloseClicked = () => {
        setActionsState({
            close: {
                ...actionsState.close,
                isEnabled: false
            },
            save: {
                ...actionsState.save,
                isLoading: false,
                isEnabled: false
            },
            saveAndClose: {
                ...actionsState.saveAndClose,
                isLoading: true,
                isEnabled: false
            }
        });

        window.setTimeout(() => {
            setActionsState({
                close: {
                    ...actionsState.close,
                    isEnabled: true
                },
                save: {
                    ...actionsState.save,
                    isLoading: false,
                    isEnabled: true
                },
                saveAndClose: {
                    ...actionsState.saveAndClose,
                    isLoading: false,
                    isEnabled: true
                }
            });
        }, 2000);
    }

    const onCloseClicked = () => {

    }

    return (
        <Dialog
            isOpen={props.isOpen}
            isCloseButtonShown={true}
            title={getDialogTitle()}
            onClose={props.onClose}
            style={{width: "600px"}}
            canOutsideClickClose={false}
        >
            <div className={Classes.DIALOG_BODY}>
                <BootstrapContainer fluid>
                    <BootstrapRow>
                        <BootstrapColumn>
                            <FormGroup
                                inline={false}
                                label="Title"
                                labelFor="text-input"
                                labelInfo={getRequiredLabelInfo()}
                                disabled={ mode === DialogMode.View }
                            >
                                <InputGroup id="content-item-title-input" placeholder="Type a title here" fill={true} />
                            </FormGroup>
                            <FormGroup
                                inline={false}
                                label="Description"
                                labelFor="content-item-description-input"
                                disabled={ mode === DialogMode.View }
                            >
                                <textarea id="content-item-description-input" className="bp3-input bp3-fill" />
                            </FormGroup>
                        </BootstrapColumn>
                    </BootstrapRow>
                </BootstrapContainer>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <ButtonArea>
                    <Button title={"Save"}
                            disabled={!actionsState.save.isEnabled}
                            loading={actionsState.save.isLoading}
                            onClick={onSaveClicked}
                    >
                        Save
                    </Button>
                    <Button
                        title={"Save and Close"}
                        disabled={!actionsState.saveAndClose.isEnabled}
                        loading={actionsState.saveAndClose.isLoading}
                        onClick={onSaveAndCloseClicked}
                    >
                        Save And Close
                    </Button>
                    <Button
                        title={"Close"}
                        disabled={!actionsState.close.isEnabled}
                        onClick={onCloseClicked}
                    >
                        Close
                    </Button>
                </ButtonArea>
            </div>
        </Dialog>
    )
}