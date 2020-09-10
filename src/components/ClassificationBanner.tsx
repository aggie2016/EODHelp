import React from 'react';
import styled from 'styled-components';

export enum ClassificationLevel {
    Unclassified,
    Confidential,
    Secret,
    TopSecret
}

/**
 *  Properties for the {@see ClassificationBanner} React component.
 */
interface IClassificationBannerProps {
    level: ClassificationLevel,
    caveat?: string
}


const Banner = styled.div`
    width: 100%;
    padding: 2px 0;
    
    p {
        color: white;
        margin: 0px;
        text-align: center;
        font-weight: bold;
    }
`;

const UnclassifiedBanner = styled(Banner)`
    background-color: #006000;
`;


/**
 *  <insert comments here>
 *  Provides all of the properties defined in {@see IClassificationBannerProps}
 */
export const ClassificationBanner: React.FC<IClassificationBannerProps> = props => {
    return (
        <>
            <UnclassifiedBanner>
                <p>UNCLASSIFIED {props.caveat && `(${props.caveat})`}</p>
            </UnclassifiedBanner>
        </>
    );
};