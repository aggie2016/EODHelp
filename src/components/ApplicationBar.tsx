import React from 'react';
import styled from 'styled-components';

const ApplicationTheme = styled.div`
    background-color: #1a1a1a;   
`

const ApplicationBarContainer = styled.div`
    background-color: rgb(197 197 197);
    padding: 10px 20px;
`;

const ApplicationButton = styled.div`
    padding: 10px 20px;
    width: fit-content;
    display: inline-block;
  
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
   
    &:active {
        transform: translateY(2px);
    }
    
    &:hover {
        background-color: rgb(150 150 150);
    }
`;

const ApplicationBar = styled.div`
    background-color: rgb(210 210 210);
    border-radius: 20px;
    width: fit-content;
    margin: auto;
    box-shadow: 0px 1px 4px white;  
    
    & :first-child {
      border-radius: 20px 0 0 20px;  
    }
    
    & :last-child {
      border-radius: 0 20px 20px 0;  
    }
`;