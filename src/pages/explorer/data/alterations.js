import React, {useEffect, useState} from 'react'
import {fromPairs} from 'lodash'
import {json as d3Json} from 'd3-fetch'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import {ListboxComponent} from '../../../helpers.js'

const AlterationsSelect = ({
  url,
  setPayload,
  initAlterations,
}) => {
  // State
  const [selectedAlterations, setSelectedAlterations] = useState([])
  const [alterations, setAlterations] = useState([])
  const [alterationURLPath, setAlterationURLPath] = useState(null)
  const [sampleToAlterationCount, setSampleToAlterationCount] = useState([])
  const [alterationPayload, setAlterationPayload] = useState({})

  // Effects
  useEffect( () => {
    if (typeof url === 'undefined' || url === null) return
    const alterationsManifestURL = `${process.env.REACT_APP_SUPERDENDRIX_DATA_URL}/${url}`
    d3Json(alterationsManifestURL)
      .then((jsonData) => {
        setAlterationURLPath(jsonData.events_path)
        setAlterations(jsonData.events)
        setSampleToAlterationCount(jsonData.cellLineToMutationCount)
        if (initAlterations) setSelectedAlterations(initAlterations)
      }).catch( (error) => {
        console.error(error)
      })
  }, [url])

  // Fetch the data and add it to state
  useEffect( () => {
    if (alterationURLPath === null || !selectedAlterations) return
    Promise.all(
      selectedAlterations.map( d =>
        d3Json(`${process.env.REACT_APP_SUPERDENDRIX_DATA_URL}/${alterationURLPath}/${d.toLowerCase()}.json`)
      )
    )
    .then((jsonData) => {
      jsonData = typeof jsonData === 'undefined' ? [] : jsonData
      setAlterationPayload(fromPairs(jsonData.map( d => ([
        d.event, d.mutation_info,
      ]))))
    })
  }, [selectedAlterations, alterationURLPath])

  // Send the payload whenever the data changes
  useEffect( () => {
    setPayload({
      sampleToAlterationCount: sampleToAlterationCount,
      alterations: alterationPayload,
    })
  }, [alterationPayload, sampleToAlterationCount, setPayload])

  // Render
  return (
    <Grid container item direction="column">
      <Typography variant="overline">Alterations</Typography>
      <FormControl fullWidth>
        <InputLabel>Source</InputLabel>
        <Select id="alterationsSource" disabled defaultValue={'CCLE'}>
          <MenuItem value={'CCLE'}>CCLE</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <Autocomplete
          id="alterationGenes"
          multiple
          ListboxComponent={ListboxComponent}
          value={selectedAlterations}
          options={alterations}
          getOptionLabel={ d => d }
          onChange={ (event, value) => setSelectedAlterations(value) }
          renderInput={params => (
            <TextField {...params} variant="standard" margin="normal" label="Genes" fullWidth  />
          )}
        />
      </FormControl>
    </Grid>
  )
}

export default AlterationsSelect
