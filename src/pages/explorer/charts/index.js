import React, {useMemo, useState} from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import Chart from './Chart.js'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  chart: {
    paddingLeft: '15px !important',
    flexGrow: 1,
    flexShrink: 1,
    minWidth: '0px',
    overflowY: 'scroll',
  },
}))

const Explorer = ({
  alterationData,
  profileData,
  samplesData,
  legend,
}) => {
  const classes = useStyles()

  // State
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Memos
  const scores = useMemo( () => profileData && profileData.scores ? profileData.scores : {}, [profileData]);
  const profileName = useMemo(() => profileData.profileName ? profileData.profileName : '', [profileData]);
  const direction = useMemo(() => profileData.direction ? profileData.direction : '', [profileData]);
  const thresholdScore = useMemo(() => profileData.thresholdScore ? profileData.thresholdScore : -1, [profileData]);
  const alterations = useMemo( () => alterationData && alterationData.alterations ? alterationData.alterations : {}, [alterationData])
  const sampleToTissue = useMemo( () => samplesData.sampleToTissue ? samplesData.sampleToTissue : {}, [samplesData])
  const sampleToAlterationCount = useMemo( () => samplesData && samplesData.sampleToAlterationCount ? samplesData.sampleToAlterationCount : {}, [samplesData])

  // Render
  return (
    <Grid id="Explorer" item className={classes.chart}>
      <Grid container justify="space-between" direction="row">
        <Grid item>
          <Typography variant="h5">Explorer</Typography>
        </Grid>
        <Grid item>
          <Button onClick={() => setDrawerOpen(true)}>View Data</Button>
        </Grid>
      </Grid>
      <Grid container>
        <Chart
          alterations={alterations}
          sampleToAlterationCount={sampleToAlterationCount}
          scores={scores}
          sampleToTissue={sampleToTissue}
          profileName={profileName}
          thresholdScore={thresholdScore}
          direction={direction}
          legend={legend}
        />
      </Grid>
      <Drawer anchor="bottom" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Typography variant="h6">Data</Typography>
            <pre style={{height: '300px', overflowY: 'scroll', width: '100%'}}>
              {JSON.stringify({alterations: alterations, scores: scores, legend: legend}, null, 2)}
            </pre>
          </Grid>
        </Grid>
      </Drawer>
    </Grid>
  )
}

export default Explorer
