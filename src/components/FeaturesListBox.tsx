import React from 'react';
import styled from 'styled-components';

interface IFeaturesListBoxProps {

}


const FeatureListBoxContainer = styled.div`
    background-color: black;
    padding: 10px 15px 10px 15px;
`

export const FeatureListBox : React.FC<IFeaturesListBoxProps> = props => {
    return (
        <FeatureListBoxContainer>
            {props.children}
        </FeatureListBoxContainer>
    )
}