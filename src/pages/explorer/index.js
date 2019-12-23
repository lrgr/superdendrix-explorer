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
  const classes = useStyles()
  const dataURL = `${process.env.REACT_APP_SUPERDENDRIX_DATA_URL}/data/superdendrix-data.json`

  // State
  const [profileURLs, setProfileURLs] = useState({})
  const [sampleLists, setSampleLists] = useState({})
  const [legend, setLegend] = useState({})
  const [eventsURLs, setEventsURLs] = useState(null)
  const [profileData, setProfileData] = useState({})
  const [alterationData, setAlterationData] = useState({})
  const [initValues, setInitValues] = useState({})

  // Memo
  const payload = useMemo( () => (
    { profileData, alterationData, legend }
  ), [profileData, alterationData, legend])

  // Effects
  useEffect( () => {
    d3Json(dataURL)
      .then((jsonData) => {
        setProfileURLs(jsonData.profile_datasets)
        setEventsURLs(jsonData.events)
        setSampleLists(jsonData.sample_lists)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [dataURL])

  useEffect( () => {
    if (!profileData.scores || !alterationData.alterations) return
    history.push({
      pathname: '/',
      search: queryString.stringify({
        alterations: Object.keys(alterationData.alterations).sort(ascending),
        profileSource: profileData.scores.source,
        profileType: profileData.scores.type,
        profileTarget: profileData.scores.target,
      })
    })
  }, [profileData, alterationData])

  useEffect( () => {
    setInitValues(queryString.parse(location.search))
  }, [])

  // Render
  return (
    <Grid container className={classes.dataExplorer}>
      <DataSelect
        urls={{scores: profileURLs, events: eventsURLs }}
        initValues={initValues}
        setProfileData={setProfileData}
        setAlterationData={setAlterationData}
      />
      <Explorer {...payload} legend={legend} />
      <Legend {...payload} setLegend={setLegend} />
    </Grid>
  )
})

export default DataExplorer
