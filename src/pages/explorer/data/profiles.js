import React, {useState, useEffect} from 'react'
import {json as d3Json} from 'd3-fetch'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import {ListboxComponent} from '../../../helpers.js'

const ProfileSelect = ({
  urls,
  setPayload,
  initType,
  initSource,
  initTarget,
}) => {
  // Constants
  const sources = urls === null ? [] : Object.keys(urls)

  // State and refs
  const [source, setSource] = useState('')
  const [scoreTypes, setScoreTypes] = useState([]) // type is a reserved word
  const [scoreType, setScoreType] = useState('')
  const [targets, setTargets] = useState([])
  const [target, setTarget] = useState('')

  const [urlPath, setURLPath] = useState(null)
  const [samples, setSamples] = useState([])
  const [sampleToTissue, setSampleToTissue] = useState({})

  // Effects
  useEffect( () => {
    // Sanity checking
    if (sources.length === 0 || source === '') return

    // Fetch the profile data
    const scoreDataURL = `${process.env.REACT_APP_SUPERDENDRIX_DATA_URL}/${urls[source]}`
    d3Json(scoreDataURL)
      .then((jsonData) => {
        setScoreTypes(jsonData.profile_types)
        setTargets(jsonData.profile_names)
        setURLPath(jsonData.profile_path)
        setSampleToTissue(jsonData.cellLineToTissue)
        setSamples(jsonData.cell_lines)

        if (initType !== '') setScoreType(initType)
        if (initTarget !== '') setTarget(initTarget)
        if (initSource !== '') setSource(initSource)
      })
      .catch((error) => {
        console.error(error)
      })

  }, [source, urls, sources.length])

  useEffect( () => {
    if (sources.length > 0){
      setSource(sources[0])
    }
  }, [sources])

  useEffect( () => {
    if (scoreTypes.length > 0){
      setScoreType(scoreTypes[0])
    }
  }, [scoreTypes])

  useEffect( () => {
    if (!target || target === '' || urlPath === null) return
    const scoreURL = `${process.env.REACT_APP_SUPERDENDRIX_DATA_URL}/${urlPath}/${target.toLowerCase()}.json`
    d3Json(scoreURL)
      .then((jsonData) => {
        setPayload({
          sampleToTissue: sampleToTissue,
          scores: {
            source: source,
            type: scoreType,
            target: target,
            samples: samples,
            scores: jsonData.profile[scoreType],
          },
        })
      }).catch( (error) => {
        console.error(error)
      })

  }, [source, scoreType, target, urlPath, sampleToTissue])

  // Render
  return (
    <Grid container item direction="column">
      <Typography variant="overline">Scores</Typography>
      <FormControl fullWidth>
        <InputLabel>Source</InputLabel>
        <Select
          id="scoreSource"
          value={source}
          onChange={event => setSource(event.target.value)}
        >
          {
            sources.map( (t,i) =>
              <MenuItem key={i} value={t}>{t}</MenuItem>
            )
          }
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Type</InputLabel>
        <Select
          id="scoreType"
          value={scoreType}
          onChange={ event => setScoreType(event.target.value) }
          fullWidth
        >
          {
            scoreTypes.map( (t, i) =>
              <MenuItem key={i} value={t}>{t}</MenuItem>
            )
          }
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <Autocomplete
          id="scoreTarget"
          ListboxComponent={ListboxComponent}
          value={target}
          options={targets}
          getOptionLabel={ d => d }
          onChange={ (event, value) => setTarget(value) }
          renderInput={params => (
            <TextField {...params} variant="standard" margin="normal" label="Target" fullWidth  />
          )}
        />
      </FormControl>
    </Grid>
  )
}

export default ProfileSelect
