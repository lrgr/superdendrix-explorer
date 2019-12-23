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
  },
}))

const Explorer = ({
  alterationData,
  profileData,
  legend,
}) => {
  const classes = useStyles()

  // State
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Memos
  const scoreData = useMemo( () => profileData && profileData.scores ? profileData.scores : {}, [profileData])
  const scoreType = useMemo( () => scoreData.type ? scoreData.type : '', [scoreData])
  const source = useMemo( () => scoreData.source ? scoreData.source : '', [scoreData])
  const target = useMemo( () => scoreData.target ? scoreData.target : '', [scoreData])
  const scores = useMemo( () => scoreData.scores ? scoreData.scores : {}, [scoreData])
  const sampleToTissue = useMemo( () => profileData.sampleToTissue ? profileData.sampleToTissue : {}, [profileData])
  const alterations = useMemo( () => alterationData && alterationData.alterations ? alterationData.alterations : {}, [alterationData])
  const sampleToAlterationCount = useMemo( () => alterationData && alterationData.sampleToAlterationCount ? alterationData.sampleToAlterationCount : {}, [alterationData])

  // Render
  return (
    <Grid id="Explorer" xs item className={classes.chart}>
      <Grid container justify="space-between" direction="row">
        <Grid item xs={1}>
          <Typography variant="h5">Explorer</Typography>
        </Grid>
        <Grid item xs={1}>
          <Button onClick={() => setDrawerOpen(true)}>View Data</Button>
        </Grid>
      </Grid>
      <Grid container>
        <Chart
          alterations={alterations}
          sampleToAlterationCount={sampleToAlterationCount}
          scores={scores}
          scoreType={scoreType}
          sampleToTissue={sampleToTissue}
          target={target}
          source={source}
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
