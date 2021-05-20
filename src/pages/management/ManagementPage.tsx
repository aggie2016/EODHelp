import { Card, CardContent, CardHeader, Grid, Typography } from '@material-ui/core';
import GoogleMapReact from 'google-map-react';
import RoomIcon from '@material-ui/icons/Room';
import React from 'react';

const AnyReactComponent: React.FC<{ title: string; caption: string; lat: number; lng: number }> = (
    props
) => (
    <div
        style={{
            display: 'flex',
            width: '200px',
        }}
    >
        <RoomIcon />
        <div
            style={{
                backgroundColor: 'rgba(146,146,146,0.5)',
                display: 'flex',
                borderRadius: '4px',
                padding: '5px 5px 5px 5px',
            }}
        >
            <div style={{ display: 'none', flexDirection: 'column' }}>
                <Typography variant={'body2'}>{props.title}</Typography>
                <Typography variant={'caption'}>{props.caption}</Typography>
            </div>
        </div>
    </div>
);

export const ManagementPage: React.FC = () => {
    return (
        <Grid container>
            <Grid item xs>
                <Card>
                    <CardHeader title={'Map of Registered Users'} />
                    <CardContent>
                        <div style={{ height: '400px', width: '100%' }}>
                            <GoogleMapReact
                                bootstrapURLKeys={{
                                    key: 'AIzaSyB3zz5M_jNJowN0LsVe9sRio0HXey3-6Zw',
                                }}
                                defaultCenter={{
                                    lat: 38.3023196664105,
                                    lng: -76.54421423535837,
                                }}
                                defaultZoom={11}
                            >
                                <AnyReactComponent
                                    lat={38.3023196664105}
                                    lng={-76.54421423535837}
                                    title='Christopher Miller'
                                    caption='(713) 591-5877'
                                />
                            </GoogleMapReact>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item />
        </Grid>
    );
};
