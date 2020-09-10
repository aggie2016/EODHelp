import React from 'react';
import styled from 'styled-components';
import {
    HashRouter as Router,
    Link,
    Route,
    Switch,
    useHistory
} from 'react-router-dom';

import {
    Row as BootstrapRow,
    Col as BootstrapColumn
} from 'react-bootstrap';

import {
    Button, Callout, Dialog,
    FormGroup,
    InputGroup
} from "@blueprintjs/core";
import {NavigationColumn} from "./components/navigation/NavigationColumn";

const LoginContainer = styled.div`
   height: 100vh;
   display: flex;
   flex-direction: column;
`;

const LoginContainerContent = styled.div`
    margin: auto;
    width: 800px;
`;

const LoginGroup = styled.div`
    display: flex;
    flex-direction: row;
    box-shadow: 1px 1px 8px 2px #3D3D3D;
`;

const LoginArea = styled.div`
    width: 500px;
    padding: 20px;
    background-color: #3D3D3D;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
`;

const WhatsNewArea = styled.div`
    margin-left: 1px;
    width: 300px;
    padding: 20px;
    background-color: #4E4E4E;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
`;

const SECONDS_TO_MILLISECONDS: number = 1000;
const SESSION_MAX_DURATION_SECONDS: number = 120;
const SESSION_WARNING_THRESHOLD_SECONDS: number = SESSION_MAX_DURATION_SECONDS * 0.5;

interface ISessionTimerHandles {
    countdownHandle: number,
    expiredHandle: number,
    reminderHandle: number
}

function App() {
    const [isContentItemDialogOpen, setIsContentItemDialogOpen] = React.useState<boolean>(false);

    const [isSessionReminderDialogOpen, setIsSessionReminderDialogOpen] = React.useState<boolean>(false);
    const [sessionTimeLeftSeconds, setSessionTimeLeftSeconds] = React.useState<number>(SESSION_WARNING_THRESHOLD_SECONDS);

    const [sessionTimerHandles, setSessionTimerHandles] = React.useState<ISessionTimerHandles | undefined>(undefined);

    const history = useHistory();

    React.useEffect(() => {
        if(sessionTimerHandles === undefined) {
            console.log("Timers created");
            let expiredHandle = window.setTimeout(() => {
                setIsSessionReminderDialogOpen(false);
                history.push("/session-expired");
            }, SESSION_MAX_DURATION_SECONDS * SECONDS_TO_MILLISECONDS);

            let reminderHandle = window.setTimeout(() => {
                setIsSessionReminderDialogOpen(true);
            }, SESSION_WARNING_THRESHOLD_SECONDS * SECONDS_TO_MILLISECONDS);

            setSessionTimerHandles({
                countdownHandle: 0,
                expiredHandle: expiredHandle,
                reminderHandle: reminderHandle
            })
        }

        return () => {
            window.clearTimeout(sessionTimerHandles?.expiredHandle);
            window.clearTimeout(sessionTimerHandles?.reminderHandle);
        }
    }, [history, sessionTimerHandles, sessionTimeLeftSeconds]);

    React.useEffect(() => {
        let countdownHandle: number;

        if (isSessionReminderDialogOpen) {
            countdownHandle = window.setInterval(() => {
                if (sessionTimeLeftSeconds <= 0) {
                    window.clearInterval(countdownHandle);
                }

                setSessionTimeLeftSeconds(seconds => seconds - 1);
            }, 1000);
        }

        return () => window.clearInterval(countdownHandle);
    }, [sessionTimeLeftSeconds, isSessionReminderDialogOpen])

    const onContentItemDialogClosed = () => {
        setIsContentItemDialogOpen(false);
    }

    const resetSession = () => {
        setIsSessionReminderDialogOpen(false);
        setSessionTimeLeftSeconds(SESSION_MAX_DURATION_SECONDS);
    }


    return (
        <>
            {/* <ClassificationBanner level={ClassificationLevel.Unclassified} caveat={"FOR OFFICIAL USE ONLY"}/>
          <NavigationBar /> */}
            <BootstrapRow noGutters className={"bp3-dark"} style={{backgroundColor: "#1D1D1D"}} onClick={() => {

            }}>
                <BootstrapColumn>
                    <Switch>
                        <Route path={"/login"}>
                            <LoginContainer>
                                <LoginContainerContent>
                                    <Callout intent={"warning"} title={"Application Status"}
                                             style={{marginBottom: "10px"}}>
                                        Please note, we are currently experiencing a high volume of traffic on this
                                        application. During this time, if you have any additional issues, please
                                        report them here.
                                    </Callout>
                                    <LoginGroup>
                                        <LoginArea>
                                            <BootstrapRow>
                                                <BootstrapColumn>
                                                    <p style={{
                                                        color: "white",
                                                        fontWeight: "bold",
                                                        textAlign: "center"
                                                    }}> Welcome Back</p>
                                                    <p style={{
                                                        color: "grey",
                                                        fontWeight: "bolder",
                                                        textAlign: "center"
                                                    }}> We're so excited to see you again!</p>
                                                    <div>
                                                        <FormGroup
                                                            label={"Username"}
                                                            labelFor={"username-input"}
                                                            labelInfo={"(required)"}>
                                                            <InputGroup id="username-input" fill/>
                                                        </FormGroup>
                                                        <FormGroup
                                                            label={"Password"}
                                                            labelFor={"password-input"}
                                                            labelInfo={"(required)"}
                                                            helperText={"Forgot your password?"}>
                                                            <InputGroup id="password-input" fill type={"password"}/>
                                                        </FormGroup>
                                                        <Button text={"Login"} fill/>
                                                    </div>
                                                </BootstrapColumn>
                                            </BootstrapRow>
                                        </LoginArea>
                                        <WhatsNewArea>
                                            <p style={{
                                                color: "white",
                                                fontWeight: "bold",
                                                textAlign: "center"
                                            }}> What's New</p>
                                            <p style={{
                                                color: "grey",
                                                fontWeight: "bolder",
                                                textAlign: "center"
                                            }}> Q3 Update (v3.0.0)</p>
                                            <hr/>
                                            <i>We've completely resigned the entire user interface from the ground
                                                up! You can now expect
                                                a modern and seamless experience on all device formats while using
                                                this application! <a>Click here</a> to learn more!</i>
                                            <br/>
                                            <br/>
                                            <i>To submit a bug report or provide any feedback, <a>click
                                                here.</a></i>
                                        </WhatsNewArea>
                                    </LoginGroup>
                                </LoginContainerContent>
                            </LoginContainer>
                        </Route>
                        <Route exact path={"/session-expired"}>
                            <Callout intent={"danger"} title={"Your Session Has Timed Out"}
                                     style={{margin: "0px 20px"}}>
                                Please note, due to security concerns and policies in place, your session has
                                expired. If you
                                would like to continue where you left off, please <Link to={"/login"}>click
                                here</Link> to sign in again.
                            </Callout>
                        </Route>
                        <Route>
                            <BootstrapRow noGutters>
                                <BootstrapColumn xs={4} sm={4} md={4} lg={4} xl={2}>
                                    <NavigationColumn/>
                                </BootstrapColumn>
                                <BootstrapColumn>
                                    <Route exact path={"/dashboard"}>
                                        <p>Hello there</p>
                                    </Route>
                                </BootstrapColumn>
                            </BootstrapRow>
                        </Route>
                    </Switch>
                </BootstrapColumn>
            </BootstrapRow>
            <Dialog isOpen={isSessionReminderDialogOpen} isCloseButtonShown={true} title={"Session Expiration Warning"}>
                <Callout intent={"warning"} title={"Your Session Will Soon Expire"}>
                    Please note, due to security concerns and policies in place, your session has
                    will soon expire. If you to extend your session, please <Button onClick={resetSession} text={"click here"} minimal/>.
                        <p>Time Left: 00:{sessionTimeLeftSeconds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</p>
                </Callout>
            </Dialog>
        </>
    );
}

export default App;
