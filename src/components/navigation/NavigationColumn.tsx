import React from 'react';
import styled from 'styled-components';

import {
    Row as BootstrapRow,
    Col as BootstrapColumn
} from "react-bootstrap";

import {
    Button,
    InputGroup, Intent
} from '@blueprintjs/core';

import {
    faAddressBook,
    faCalculator,
    faCaretLeft,
    faCaretRight,
    faCircle, faCog,
    faSearch,
    faTachometerAlt
} from "@fortawesome/free-solid-svg-icons";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


/**
 *  Properties for the {@see NavigationColumn} React component.
 */
interface INavigationColumnProps {

}


interface ICollapsableProps {
    isCollapsed : boolean;
}

const NavColumnContainer = styled.div<ICollapsableProps>`
    position: relative;  
    display: flex;
    flex-direction: column;
    height: 100vh;
    
    // Collapse animations
    @keyframes collapseAnimation {
        from { left: 0%; }
        to { left: -100%; }
    }
    
    // Expand animations
    @keyframes expandAnimation {
        from { left: -17%; }
        to { left: 0%; }
    }
    
    ${(props : ICollapsableProps) => {
            if(props.isCollapsed) {
                return "animation-name: collapseAnimation;";
            }
            else {
                //return "animation-name: expandAnimation;";
            }
        }
    }

    animation-fill-mode: forwards;
    animation-duration: 0.5s;
`;

const NavContent = styled.div`
    flex-grow: 1;
    background-color: grey;
    overflow-x: hidden;
`;

const NavFooter = styled.div`
    padding: 10px 5px;
    background-color: #3D3D3D;
    overflow-x: hidden;
    display: flex;
    flex-direction: row;
`;

const NavRowIcon = styled.div`
    margin: 5px 20px;
`;

const NavRow = styled.div`
    background-color: darkgrey;
    padding: 5px;
    
    &:hover {
        background-color: #878787;
        color: black;
    }
    
    ${NavRowIcon} {
        display: inline-block;
    }
    
    & > * {
        display: inline-block;
    }
    
    & > p {
        font-family: "Segoe UI",Arial,sans-serif;
    }
`;

const NavCollapseButton = styled.div`
    position: absolute;
    left: 100%;
    top: 50%;
    background-color: lightgrey;
    padding: 30px 6px;
    max-width: fit-content;
    z-index: 10;    
    
    &:hover {
        background-color: darkgrey;
    }
`

const SignInButton = styled(Button)`

    && {
        background-color: darkgrey;
        color: white;
    }
    
`;

/**
 *  <insert comments here>
 *  Provides all of the properties defined in {@see INavigationColumnProps}
 */
export const NavigationColumn: React.FC<INavigationColumnProps> = props => {
    const [isNavigationCollapsed, setIsNavigationCollapsed] = React.useState<boolean>(false);


    const onCollapseToggle = () => {
        setIsNavigationCollapsed(collapsed => !collapsed);
    }

    const searchInputIcon = (
      <Button icon={<FontAwesomeIcon icon={faSearch}/>} intent={Intent.WARNING} minimal/>
    );

    return (
        <NavColumnContainer isCollapsed={isNavigationCollapsed}>
            <NavContent>
                <NavRow>
                    <InputGroup rightElement={searchInputIcon} placeholder={"Type to search everything"} fill={true}/>
                </NavRow>
                <NavRow>
                    <NavRowIcon>
                        <FontAwesomeIcon icon={faTachometerAlt} size={"lg"} />
                    </NavRowIcon>
                    <p>Dashboard</p>
                </NavRow>
                <NavRow>
                    <NavRowIcon>
                        <FontAwesomeIcon icon={faAddressBook} size={"lg"} />
                    </NavRowIcon>
                    <p>AEODPS</p>
                </NavRow>
                <NavRow>
                    <NavRowIcon>
                        <FontAwesomeIcon icon={faCalculator} size={"lg"} />
                    </NavRowIcon>
                    <p>TDA</p>
                </NavRow>
                <NavRow>
                    <NavRowIcon>
                        <FontAwesomeIcon icon={faAddressBook} />
                    </NavRowIcon>
                    <p>Hello</p>
                </NavRow>
                <NavCollapseButton onClick={onCollapseToggle}>
                    <FontAwesomeIcon icon={isNavigationCollapsed ? faCaretRight : faCaretLeft} color={"white"}/>
                </NavCollapseButton>
            </NavContent>
            <NavFooter>
                <div style={{margin: "auto"}}>
                    <FontAwesomeIcon icon={faCircle} size={"3x"} />
                </div>
                <div style={{flexGrow: 1, margin: "0px 10px"}}>
                    <p style={{textAlign: "center", color: "white"}}>You are not signed in</p>
                    <Button fill={true} text={"Sign In"} />
                </div>
                <div style={{margin: "auto"}}>
                    <Button minimal icon={<FontAwesomeIcon icon={faCog} color={"white"} size={"lg"} />} />
                </div>
            </NavFooter>
        </NavColumnContainer>
    );
};