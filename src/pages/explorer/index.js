import React, { useState, useEffect, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {withRouter} from 'react-router'
import {ascending} from 'd3-array'
import {json as d3Json} from 'd3-fetch'
import Grid from '@material-ui/core/Grid';
import queryString from 'query-string'
import DataSelect from './data/index.js'
import Explorer from './charts/index.js'
import Legend from './legend/index.js'

const useStyles = makeStyles(theme => ({
  dataExplorer: {
    flexWrap: 'nowrap',
  }
}))

const DataExplorer = withRouter(({
  location,
  history,
}) => {
  // Constants
  const classes = useStyles();
  const dataURL = `${process.env.REACT_APP_SUPERDENDRIX_DATA_URL}/manifest.json`;

  // State
  const [legend, setLegend] = useState({})
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('19Q1');
  const [profileData, setProfileData] = useState({})
  const [samplesData, setSamplesData] = useState({
    samples: [],
    sampleToTissue: {},
    sampleToEssentialScore: {},
    sampleToAlterationCount: {},
  })
  const [alterationData, setAlterationData] = useState({})
  const [initValues, setInitValues] = useState({})

  // Memo
  const payload = useMemo( () => ({
    profileData,
    alterationData,
    samplesData,
    legend,
  }), [profileData, alterationData, samplesData, legend]);

  // Effects
  useEffect( () => {
    d3Json(dataURL)
      .then(({ datasets }) => setDatasets(datasets))
      .catch((error) => {
        console.error(error)
      })
  }, [dataURL]);

  useEffect(() => {
    if (datasets.length > 0){
      setSelectedDataset(datasets[0])
    }
  }, [datasets]);

  useEffect( () => {
    if (!profileData.scores || !alterationData.alterations) return
    history.push({
      pathname: '/',
      search: queryString.stringify({
        alterations: Object.keys(alterationData.alterations).sort(ascending),
        profileName: profileData.profileName,
      })
    })
  }, [profileData, alterationData]);

  useEffect( () => {
    setInitValues(queryString.parse(location.search))
  }, []);

  // Render

  return (
    <Grid container className={classes.dataExplorer} style={{ height: 'calc(100% - 64px)' }}>
      <DataSelect
        initValues={initValues}
        setProfileData={setProfileData}
        setAlterationData={setAlterationData}
        setSamplesData={setSamplesData}
        selectedDataset={selectedDataset}
        setSelectedDataset={setSelectedDataset}
        datasets={datasets}
      />
      <Explorer {...payload} legend={legend} />
      <Legend {...payload} setLegend={setLegend} />
    </Grid>
  )
})

export default DataExplorer
