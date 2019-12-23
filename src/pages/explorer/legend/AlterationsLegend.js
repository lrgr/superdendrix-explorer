import React, {useState, useMemo, useCallback} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import SortIcon from '../../../components/SortIcon.js'
import {fromPairs} from 'lodash'

const useStyles = makeStyles( theme => ({
  multipleAlterations: { background: 'black' },
  noAlterations: { background: 'lightgray' },
}))

const AlterationsLegend = ({
  samples,
  events,
  eventColors,
  alterations,
  setAlterationsSortOrder,
}) => {
  const classes = useStyles()
  const sampleToAlterationCount = useMemo( () => {
    const counter = fromPairs(samples.map( s => [s, 0]))
    events.forEach( event => {
      Object.keys(alterations[event]).forEach( sample => {
        counter[sample] += 1
      })
    })
    return counter
  }, [events, samples, alterations])

  const sampleSet = useMemo( () => new Set(samples), [samples])

  const filterAlterationCount = useCallback( (alteredSamples) => (
    alteredSamples.filter( s => sampleSet.has(s) && sampleToAlterationCount[s] === 1 )
  ), [sampleSet, sampleToAlterationCount])

  const samplesWithMultipleAlterations = useMemo( () => (
    samples.filter( s => sampleToAlterationCount[s] > 1)
  ), [samples, sampleToAlterationCount])

  const samplesWithNoAlterations = useMemo( () => (
    samples.filter( s => sampleToAlterationCount[s] === 0)
  ), [samples, sampleToAlterationCount])

  return (
    <Grid container>
      <Grid container>
        <Typography variant="overline">Alterations</Typography>
        <SortIcon onChange={setAlterationsSortOrder} />
      </Grid>
      <List dense={true}>
        {
          events.map( (event, i) => (
            <ListItem key={event}>
              <ListItemIcon>
                <div style={{backgroundColor: eventColors[event]}} />
              </ListItemIcon>
              <ListItemText
                primary={`${event} (${filterAlterationCount(Object.keys(alterations[event])).length})`}
              />
            </ListItem>
          ))
        }
        <ListItem key={'multiple'}>
          <ListItemIcon>
            <div className={classes.multipleAlterations} />
          </ListItemIcon>
          <ListItemText
            primary={`Multiple (${samplesWithMultipleAlterations.length})`}
          />
        </ListItem>
        <ListItem key={'none'}>
          <ListItemIcon className={classes.legendIcon}>
            <div className={classes.noAlterations} />
          </ListItemIcon>
          <ListItemText
            primary={`None (${samplesWithNoAlterations.length})`}
          />
        </ListItem>
      </List>
    </Grid>
  )
}

export default AlterationsLegend
