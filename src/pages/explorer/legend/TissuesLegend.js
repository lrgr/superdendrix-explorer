import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SortIcon from '../../../components/SortIcon.js';
import { fromPairs } from 'lodash';

const useStyles = makeStyles({
  tissueList: {
    flexGrow: 1,
    flexShrink: 1,
    overflowY: 'scroll',
  },
});

const TissuesLegend = ({
  samples,
  tissues,
  tissueColors,
  sampleToTissue,
  setTissuesSortOrder,
}) => {
  // Create a map from tissue to samples, so we can easily compute the number of
  // samples per tissue
  const tissueToSamples = useMemo( () => {
    const d = fromPairs(tissues.map( t => [t, []]))
    samples.forEach( s => d[sampleToTissue[s]].push(s))
    return d
  }, [samples, tissues, sampleToTissue])

  const classes = useStyles();

  return (
    <>
      <Grid item container>
        <Typography variant="overline">Tissue Types</Typography>
        <SortIcon onChange={setTissuesSortOrder} />
      </Grid>
      <Grid item className={classes.tissueList}>
        <List dense={true}>
          {
            tissues.map( tissue => {
              return (
                <ListItem key={tissue}>
                  <ListItemIcon>
                    <div style={{backgroundColor: tissueColors[tissue]}} />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${tissue.split('_').join(' ')} (${tissueToSamples[tissue].length})`}
                  />
                </ListItem>
              )
            })
          }
        </List>
      </Grid>
    </>
  )
}

export default TissuesLegend
