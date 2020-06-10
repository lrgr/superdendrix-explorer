import React, {useState, useMemo, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {ascending} from 'd3-array';
import {schemeCategory10, interpolateSinebow} from 'd3-scale-chromatic';
import {scaleBand} from 'd3-scale';
import {fromPairs, values} from 'lodash';
import AlterationsLegend from './AlterationsLegend.js';
import TissuesLegend from './TissuesLegend.js';

const useStyles = makeStyles(theme => ({
  legend: {
    flex: '0 0 225px',
    flexWrap: 'nowrap',
    paddingLeft: '15px !important',
    borderLeft: '1px solid rgba(0,0,0,0.14)',
    '& div.MuiListItemIcon-root': {
      width: '20px !important',
      minWidth: '14px !important',
      '& div':{
        width: '14px',
        height: '14px',
      },
    },
    '& span.MuiTypography-root':{
      fontFamily: "'Crimson Text', serif !important",
    },
    '& .MuiListItem-dense': {
      padding: '0px 0px 0px 0px',
    },
  },
}));

const Legend = ({
  alterationData,
  profileData,
  samplesData,
  setLegend,
}) => {
  // Props and state
  const classes = useStyles();
  const [eventColors, setEventColors] = useState({});
  const [tissueColors, setTissueColors] = useState({});
  const [alterationsSortOrder, setAlterationsSortOrder] = useState({});
  const [tissuesSortOrder, setTissuesSortOrder] = useState({});

  // Memo
  const alterations = useMemo( () => alterationData && alterationData.alterations ? alterationData.alterations : {}, [alterationData])
  const events = useMemo( () => Object.keys(alterations).sort(ascending), [alterations])

  const samples = useMemo( () => samplesData ? samplesData.samples : [], [samplesData])
  const sampleToTissue = useMemo( () => samplesData && samplesData.sampleToTissue ? samplesData.sampleToTissue : {}, [samplesData])
  const tissues = useMemo( () => Array.from(new Set(values(sampleToTissue))).sort(), [sampleToTissue])
  const tissueScale = useMemo( () => scaleBand().domain(tissues).range([0, 1]), [tissues])

  // Effects
  useEffect( () => {
    setEventColors(fromPairs(events.map( (e, i) => [e, schemeCategory10[i%10]])))
  }, [events])

  useEffect( () => {
    setTissueColors(fromPairs(tissues.map( (t, i) => [t, interpolateSinebow(tissueScale(t))])))
  }, [tissues, tissueScale])

  useEffect( () => {
    setLegend({
      eventColors: eventColors,
      tissueColors: tissueColors,
      sort: {
        alterations: alterationsSortOrder,
        tissues: tissuesSortOrder,
      },
    })
  }, [eventColors, setLegend, alterationsSortOrder, tissueColors, tissuesSortOrder])

  // Render
  return (
    <Grid id="Legend" container item className={classes.legend}>
      <Grid container direction="column" justify="flex-start" style={{ flexWrap: 'nowrap' }}>
        <Grid item style={{ flexGrow: 0, flexShrink: 0 }}>
          <Typography variant="h5">Legend</Typography>
        </Grid>
        <AlterationsLegend
          events={events}
          samples={samples}
          alterations={alterations}
          setAlterationsSortOrder={setAlterationsSortOrder}
          eventColors={eventColors}
        />
        <TissuesLegend
          samples={samples}
          tissues={tissues}
          sampleToTissue={sampleToTissue}
          tissueColors={tissueColors}
          setTissuesSortOrder={setTissuesSortOrder}
        />
      </Grid>
    </Grid>
  );
};

export default Legend;
