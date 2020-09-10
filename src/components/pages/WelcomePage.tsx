import React from 'react';

import {
    Row as BootstrapRow,
    Col as BootstrapColumn,
    Container as BootstrapContainer
} from 'react-bootstrap';

import {
    Button,
    Card,
    Elevation
} from "@blueprintjs/core";

/**
 *  Properties for the {@see WelcomePage} React component.
 */
interface IWelcomePageProps {

}


/**
 *  <insert comments here>
 *  Provides all of the properties defined in {@see IWelcomePageProps}
 */
export const WelcomePage: React.FC<IWelcomePageProps> = props => {
    return (
        <BootstrapContainer fluid>
            <BootstrapRow>
                <BootstrapColumn xs={3} sm={3} md={3} lg={3} xl={3}>
                    <Card elevation={Elevation.TWO} style={{marginTop: "10px", marginBottom: "20px"}}>
                        <h3>AEODPS Animation Video Survey</h3>
                        <BootstrapRow>
                            <BootstrapColumn>
                                <p>Seeking your feedback regarding AEODPS Animation Videos in AEODPS Publications. Your suggestions are needed!</p>
                            </BootstrapColumn>
                            <BootstrapColumn>
                            </BootstrapColumn>
                        </BootstrapRow>
                        <BootstrapRow>
                            <BootstrapColumn>
                                <Button fill>TAKE SURVEY</Button>
                            </BootstrapColumn>
                        </BootstrapRow>
                    </Card>
                    <Card elevation={Elevation.TWO} style={{marginTop: "10px", marginBottom: "20px"}}>
                        <h3>AEODPS Animation Video Survey</h3>
                        <BootstrapRow>
                            <BootstrapColumn>
                                <p>Seeking your feedback regarding AEODPS Animation Videos in AEODPS Publications. Your suggestions are needed!</p>
                            </BootstrapColumn>
                            <BootstrapColumn>
                            </BootstrapColumn>
                        </BootstrapRow>
                        <BootstrapRow>
                            <BootstrapColumn>
                                <Button fill>TAKE SURVEY</Button>
                            </BootstrapColumn>
                        </BootstrapRow>
                    </Card>
                </BootstrapColumn>
                <BootstrapColumn>

                </BootstrapColumn>
                <BootstrapColumn xs={3} sm={3} md={3} lg={3} xl={3}>

                </BootstrapColumn>
            </BootstrapRow>
        </BootstrapContainer>
    );
};