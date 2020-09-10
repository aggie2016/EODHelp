import React from 'react';
import styled from 'styled-components';
import { HashRouter as Router } from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface ITabManagerProps {

}

const Tab = styled.div`
    background-color: lightgrey;
    padding: 5px 10px 5px 10px;
    display: inline-block;
    border-radius: 4px 4px 0px 0px;
    margin: 0px 2px 0px 2px;
    
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                          supported by Chrome, Edge, Opera and Firefox */
`;

const TabTitle = styled.span`
    display: inline-block;
`;

const TabCloseButton = styled.div`
    background-color: grey;
    padding: 2px 10px 2px 10px;
    margin: 0 5px 0 10px;
    border-radius: 2px;
    display: inline-block;
    
    &:hover {
        background-color: #2e2e2e;
    }
`

export const TabManager : React.FC<ITabManagerProps> = props => {
    return (
        <>
            <Tab>
                <TabTitle>Welcome</TabTitle>
                <TabCloseButton>
                    <FontAwesomeIcon icon={faTimes} color="white" />
                </TabCloseButton>
            </Tab>
            <Tab>
                <TabTitle>Welcome</TabTitle>
                <TabCloseButton>
                    <FontAwesomeIcon icon={faTimes} color="white" />
                </TabCloseButton>
            </Tab>
            <Tab>
                <TabTitle>Welcome</TabTitle>
                <TabCloseButton>
                    <FontAwesomeIcon icon={faTimes} color="white" />
                </TabCloseButton>
            </Tab>
            {/* Tab bar */}
            {/* Routing */}
        </>
    )
}