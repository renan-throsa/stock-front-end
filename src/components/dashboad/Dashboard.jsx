import React, { useState } from 'react';
import clsx from 'clsx';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { mainListItems, secondaryListItems } from './ListItems';
import Container from '@material-ui/core/Container';
import Switch from "@material-ui/core/Switch";
import { orange, lightBlue, deepPurple, deepOrange } from "@material-ui/core/colors";
import Routes from './Routes'
import NavBar from './NavBar';
import { Link } from "react-router-dom";

import useStyles from './styles'


export default function Dashboard() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [darkState, setDarkState] = useState(false);
    const palletType = darkState ? "dark" : "light";
    const mainPrimaryColor = darkState ? orange[500] : lightBlue[500];
    const mainSecondaryColor = darkState ? deepOrange[900] : deepPurple[500];

    const darkTheme = createMuiTheme({
        palette: {
            type: palletType,
            primary: {
                main: mainPrimaryColor
            },
            secondary: {
                main: mainSecondaryColor
            }
        }
    });
    const handleThemeChange = () => {
        setDarkState(!darkState);
    };
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                            <Link to="/" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                Estoque
                            </Link>
                        </Typography>

                        <NavBar />


                        <ThemeProvider theme={darkTheme}>
                            <Typography component="h2" color="inherit">
                                Tema <Switch checked={darkState} onChange={handleThemeChange} />
                            </Typography>
                        </ThemeProvider>

                    </Toolbar>
                </AppBar>

                <Drawer variant="permanent" open={open}
                    classes={{
                        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                    }}
                >
                    <div className={classes.toolbarIcon}>
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <List>{mainListItems}</List>
                    <Divider />
                    <List>{secondaryListItems}</List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />

                    <Container maxWidth="lg" className={classes.container}>
                        <Routes />
                    </Container>

                </main>
            </div>
        </ThemeProvider >
    );
}