import React, { useContext } from 'react'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link } from "react-router-dom";
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { context } from '../context/AuthContext'

const useStyles = makeStyles(() => ({
    navDisplayFlex: {
        display: 'flex',
        flexDirection: 'row',
        padding: 0
    },
}));

export default function NavBar() {
    const classes = useStyles();
    const { authenticated } = useContext(context);

    return (
        <MenuList className={classes.navDisplayFlex}>
            <MenuItem button component={Link} to="/">
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Estoque" />
            </MenuItem>
            {authenticated ?
                (<MenuItem button component={Link} to="/logout">
                    <ListItemIcon>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </MenuItem>)
                :
                (<MenuItem button component={Link} to="/login">
                    <ListItemIcon>
                        <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Login" />
                </MenuItem>)}

        </MenuList>
    );
}