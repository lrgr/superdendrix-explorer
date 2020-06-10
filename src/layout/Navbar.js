import React, {useState} from 'react'
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"


import {About, Credits, DataExplorer} from '../pages'

const useStyles = makeStyles(theme => ({
  appbar: {
    background: '#303030',
    color: '#F7F5F2',
  },
  navbar: {
    background: '#303030',
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    '& a': {
      color: '#fff',
      textDecoration: 'none',
    },
    '& a:hover': {
      textDecoration: 'underline',
    },
  },
}))

const Navbar = ({
  styles,
  css,
}) => {
  const classes = useStyles()
  return (
    <Router>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appbar}>
        <Toolbar variant="dense">
          <Grid container justify="space-between" direction="row" alignItems="center">
            <Grid item>
              <Typography variant="h6" className={classes.title}>
                SuperDendrix Explorer
              </Typography>
            </Grid>
            <Grid item>
              <List component="nav" className={classes.navbar}>
                <ListItem component="div"><ListItemText inset><Link to="/">Explorer</Link></ListItemText></ListItem>
                <ListItem component="div"><ListItemText inset><Link to="/about">About</Link></ListItemText></ListItem>
                <ListItem component="div"><ListItemText inset><Link to="/credits">Credits</Link></ListItemText></ListItem>
              </List>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/credits">
          <Credits />
        </Route>
        <Route path="/">
          <DataExplorer />
        </Route>
      </Switch>
    </Router>
  )
}

export default Navbar
