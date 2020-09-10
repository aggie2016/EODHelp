import React from 'react';
import styled from 'styled-components';

import {
    Row as BootstrapRow,
    Col as BootstrapColumn,
    Container as BootstrapContainer
} from 'react-bootstrap';
import {Tree} from "@blueprintjs/core";

export interface ISection {
    id: number | string,
    label: string,
    onClick: () => void
}

/**
 *  Properties for the {@see TableOfContents} React component.
 */
interface ITableOfContentsProps {
    sections : ISection[];
}


const ComponentContainer = styled.div`
    border: 1px solid grey;
`;

const TableOfContentsBox = styled.div`
    b {
        padding: 5px 10px;
    }
`;

const TableOfContentsTitle = styled.div`
    text-align: center;
    padding: 5px 5px;
        
    p {
        margin: 0px;
    }
`;

const StyledTree = styled(Tree)`
    max-height: 100px;
    overflow-y: scroll;
`;

/**
 *  <insert comments here>
 *  Provides all of the properties defined in {@see ITableOfContentsProps}
 */
export const TableOfContents: React.FC<ITableOfContentsProps> = props => {
    return (
        <ComponentContainer>
            <BootstrapRow>
                <BootstrapColumn>
                    <BootstrapRow>
                        <BootstrapColumn>
                            <TableOfContentsTitle>
                                <p>Publication Title</p>
                            </TableOfContentsTitle>
                        </BootstrapColumn>
                    </BootstrapRow>
                    <BootstrapRow>
                        <BootstrapColumn>
                            <TableOfContentsBox>
                                <b>TABLE OF CONTENTS</b>
                                <StyledTree contents={[{
                                    id: 0,
                                    hasCaret: true,
                                    childNodes: [],
                                    label: "INTRODUCTION"
                                },
                                {
                                    id: 0,
                                    hasCaret: true,
                                    childNodes: [],
                                    label: "INTRODUCTION"
                                },
                                {
                                    id: 0,
                                    hasCaret: true,
                                    childNodes: [],
                                    label: "INTRODUCTION"
                                },
                                {
                                    id: 0,
                                    hasCaret: true,
                                    childNodes: [],
                                    label: "INTRODUCTION"
                                }]} />
                            </TableOfContentsBox>
                        </BootstrapColumn>
                    </BootstrapRow>
                </BootstrapColumn>
            </BootstrapRow>
        </ComponentContainer>
    );
};