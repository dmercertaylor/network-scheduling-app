import React from 'react';
import { Card, CardMedia, CardContent,
    makeStyles, useTheme, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    avatar: {
        width: 100,
        height: 100,
        borderRadius: '50%'
    }
}));

export default function UserCard(props){
    const theme = useTheme();
    const classes = useStyles(theme);
    const {profile} = props;

    return (
        <Card>
            <div>
                <CardMedia
                    image={profile.avatar_url}
                    className={classes.avatar}
                />
                <CardContent>

                </CardContent>
            </div>
        </Card>
    )
}