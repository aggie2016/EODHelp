import React, {ReactNode} from 'react';
import styled from 'styled-components';

import { Tooltip } from 'antd';

interface IFeatureBoxProps {
    name : string,
    isActive : boolean,
    icon : ReactNode
}

const StyledFeatureBoxContainer = styled.div`
    background-color: #575757;
    padding: 10px;
    border-radius: 3px;
    width: 40px;
    height: 40px;
    text-align: center;
    
    margin-left: 5px;
    margin-right: 5px;
    
    display: inline-block;
    cursor: pointer;
    
    &:hover {
        background-color: #2e2e2e;
    }
`

export const FeatureBox : React.FC<IFeatureBoxProps> = props => {
    return (
        <Tooltip placement="bottomLeft" title={props.name}>
            <StyledFeatureBoxContainer>
                {props.icon}
            </StyledFeatureBoxContainer>
        </Tooltip>
    )
}