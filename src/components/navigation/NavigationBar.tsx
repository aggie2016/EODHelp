import React from 'react';
import styled from 'styled-components';

import {
    Row as BootstrapRow,
    Col as BootstrapColumn
} from 'react-bootstrap';

import {
    InputGroup
} from '@blueprintjs/core';

import {
    FontAwesomeIcon,
} from "@fortawesome/react-fontawesome";

import {
    faBook,
    faCalculator,
    faGlobe,
    faGlobeAmericas,
    faPhone,
    faQuestionCircle,
    faSearch,
    faUser
} from "@fortawesome/free-solid-svg-icons";

/**
 *  Properties for the {@see NavigationBar} React component.
 */
interface INavigationBarProps {

}


const NavigationBarContainer = styled.div`
    background-color: #2E2E2E;
    color: #333333;
    padding: 10px 5px;
    margin-bottom: 10px;
    
    span {
        color: #CCCCCC;
    }
`;

const NavigationBarButton = styled.div`
    height: 100%;
    margin: 0px 5px;
    
    span {
        margin-left: 5px;
        margin-right: 10px;
    }
`;

const NavigationSearchInput = styled(InputGroup)`
    span {
        height: 100%;
        padding: 0px 5px;
    }
    
    svg {
        height: 100%;
    }
    
    input {
        background-color: #555555;
        color: #f9f9f9;
    }
    
    input::placeholder {
        color: #f9f9f9;
    }
`;

const PlaceholderLogo = styled.div`
    width: 120px;
    height: 59.63px;
    background-color: blue;
    margin-left: 10px;
    margin-right: 10px;
`;


const NavigationBarMenuButton = styled.div`
    height: 30px;
    color: white;    
    margin: 0 10px;
    
    p {
        margin-bottom: 0;
        font-weight: bold;
    }
`;

const NavigationBarMenuArea = styled.div`
    display: inline-block;
    width: 100%;
    
    & > ${NavigationBarMenuButton} {
        display: inline-block;    
    }
`;

/**
 *  <insert comments here>
 *  Provides all of the properties defined in {@see INavigationBarProps}
 */
export const NavigationBar: React.FC<INavigationBarProps> = props => {
    return (
        <NavigationBarContainer>
            <BootstrapRow style={{marginBottom: "10px"}}>
                <BootstrapColumn sm={1} md={1} lg={1} xl={1} xs={1}>
                    <PlaceholderLogo />
                </BootstrapColumn>
                <BootstrapColumn style={{marginTop: "auto", marginBottom: "auto"}}>
                    <BootstrapRow>
                        <BootstrapColumn>
                            <NavigationSearchInput
                                fill={true}
                                leftElement={<FontAwesomeIcon icon={faSearch} />}
                                placeholder={"Click here to search the JEOD Portal (AEODPS, Incident Reports, RFI)..."}

                            />
                        </BootstrapColumn>
                        <BootstrapColumn  xs={9} sm={8} md={7} lg={6} xl={4} style={{marginTop: "auto", marginBottom: "auto"}}>
                            <BootstrapRow>
                                <NavigationBarButton>
                                    <FontAwesomeIcon
                                        icon={faQuestionCircle}
                                        color={"white"}
                                        size={"lg"}
                                    />
                                    <span>RFI</span>
                                </NavigationBarButton>
                                <NavigationBarButton>
                                    <FontAwesomeIcon
                                        icon={faGlobeAmericas}
                                        color={"white"}
                                        size={"lg"}
                                    />
                                    <span>SA Map</span>
                                </NavigationBarButton>
                                <NavigationBarButton>
                                    <FontAwesomeIcon
                                        icon={faBook}
                                        color={"white"}
                                        size={"lg"}
                                    />
                                    <span>AEODPS</span>
                                </NavigationBarButton>
                                <NavigationBarButton>
                                    <FontAwesomeIcon
                                        icon={faCalculator}
                                        color={"white"}
                                        size={"lg"}
                                    />
                                    <span>TDA</span>
                                </NavigationBarButton>
                                <NavigationBarButton>
                                    <FontAwesomeIcon
                                        icon={faPhone}
                                        color={"white"}
                                        size={"lg"}
                                    />
                                    <span>Mobile Apps</span>
                                </NavigationBarButton>

                                <NavigationBarButton style={{marginLeft: "auto", marginRight: "30px"}}>
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        color={"white"}
                                        size={"lg"}
                                    />
                                </NavigationBarButton>
                            </BootstrapRow>
                        </BootstrapColumn>
                    </BootstrapRow>
                </BootstrapColumn>
            </BootstrapRow>
            <BootstrapRow style={{borderTop: "solid grey 1px"}}>
                <BootstrapColumn>
                    <NavigationBarMenuArea>
                        <NavigationBarMenuButton>
                            <p>TOOLS</p>
                        </NavigationBarMenuButton>
                        <NavigationBarMenuButton>
                            <p>REPORTING</p>
                        </NavigationBarMenuButton>
                        <NavigationBarMenuButton>
                            <p>EOD INFORMATION</p>
                        </NavigationBarMenuButton>
                        <NavigationBarMenuButton>
                            <p>RESOURCES/TRAINING</p>
                        </NavigationBarMenuButton>
                        <NavigationBarMenuButton>
                            <p>EXPLOSIVE DETECTED EQUIPMENT</p>
                        </NavigationBarMenuButton>
                        <NavigationBarMenuButton>
                            <p>SUPPORT</p>
                        </NavigationBarMenuButton>
                    </NavigationBarMenuArea>
                </BootstrapColumn>
            </BootstrapRow>
        </NavigationBarContainer>
    );
};