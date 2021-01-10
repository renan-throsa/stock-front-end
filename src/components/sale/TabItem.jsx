import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { ManualTabPanel } from '../sale/ManualTabPanel'
import { AutomaticTabPanel } from '../sale/AutomaticTabPanel'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

export function TabItem(props) {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    }

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs value={selectedTab} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="Busca automática" />
                    <Tab label="Busca manual" />
                </Tabs>
            </AppBar>
            {selectedTab === 0 && <AutomaticTabPanel onAdd={props.onAdd} />}
            {selectedTab === 1 && <ManualTabPanel onAdd={props.onAdd} />}
        </div>
    );

}


