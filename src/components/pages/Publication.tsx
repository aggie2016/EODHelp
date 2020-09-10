import React from 'react';
import styled from 'styled-components';

import {Col as BootstrapColumn, Row as BootstrapRow} from 'react-bootstrap';

import {Button} from "@blueprintjs/core";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {faCommentAlt, faStar} from "@fortawesome/free-solid-svg-icons";

import {ISection, TableOfContents} from "../TableOfContents";
import {ClassificationBanner, ClassificationLevel} from "../ClassificationBanner";

/**
 *  Properties for the {@see Publication} React component.
 */
interface IPublicationProps {
    id : number
}


const DetailsBox = styled.div`
    border: 1px solid grey;
    padding: 10px;
    
    h3 {
       margin: 0px;
    }
`;

const StyledDetailsList = styled.ul`
    list-style: none;
    padding-left: 5px;
    
    li {
        margin-bottom: 10px;
    }
`;


/**
 *  <insert comments here>
 *  Provides all of the properties defined in {@see IPublicationProps}
 */
export const Publication: React.FC<IPublicationProps> = props => {
    const [sections, setSections] = React.useState<ISection[]>([]);

    return (
        <BootstrapRow noGutters>
            <BootstrapColumn xs={3} sm={3} md={3} lg={3} xl={3}>
                <BootstrapRow noGutters>
                    <BootstrapColumn>
                        <TableOfContents sections={sections} />
                        <DetailsBox>
                            <h3><b>PUBLICATION DETAILS</b></h3>
                            <StyledDetailsList>
                                <li><a>Title Page</a></li>
                                <li><a>Promulgation</a></li>
                                <li><a>Messages</a></li>
                                <li><a>EOD Subjects</a></li>
                                <li><a>Glossary</a></li>
                                <li><a>Classification Sources</a></li>
                            </StyledDetailsList>
                        </DetailsBox>
                        <DetailsBox>
                            <h3><b>PUBLICATION MEDIA</b></h3>
                            <StyledDetailsList>
                                <li><a>Images</a></li>
                                <li><a>Video</a></li>
                                <li><a>Other</a></li>
                            </StyledDetailsList>
                        </DetailsBox>
                        <DetailsBox>
                            <Button icon={<FontAwesomeIcon icon={faStar} />} text={"Add Publication to Favorite Group"} minimal />
                        </DetailsBox>
                        <DetailsBox>
                            <Button icon={<FontAwesomeIcon icon={faCommentAlt} />} text={"Feedback"} minimal />
                        </DetailsBox>
                    </BootstrapColumn>
                </BootstrapRow>
            </BootstrapColumn>
            <BootstrapColumn xs={9} sm={9} md={9} lg={9} xl={9}>
                <ClassificationBanner level={ClassificationLevel.Unclassified} />
            </BootstrapColumn>
        </BootstrapRow>
    );
};