import React, { useEffect, useMemo, useState } from 'react'
import { json as d3Json } from 'd3-fetch';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import AlterationsSelect from './alterations.js';
import ProfileSelect from './profiles.js';

const useStyles = makeStyles(theme => ({
  dataSelect: {
    overflowY: 'scroll',
    paddingLeft: '15px !important',
    borderRight: '1px solid rgba(0,0,0,0.14)',
    flex: '0 0 250px',
    '& label':{
      fontFamily: "'Crimson Text', serif !important",
    },
    '& input[type="text"]':{
      fontFamily: "'Crimson Text', serif !important",
    },
    '& div.MuiSelect-select':{
      fontFamily: "'Crimson Text', serif !important",
    },
    '& span.MuiChip-label':{
      fontFamily: "'Crimson Text', serif !important",
    },
  },
}))


const DataSelect = ({
  setProfileData,
  setAlterationData,
  setSamplesData,
  setSelectedDataset,
  selectedDataset,
  datasets,
  initValues,
}) => {
  const classes = useStyles()

  // Set initial values for the profiles and alterations
  const initProfile = initValues.profileName ? initValues.profileName : 'BRAF';

  const initAlterations = useMemo( () => {
    let parsedAlterations = initValues.alterations
    if (!parsedAlterations) parsedAlterations = ['KRAS_A']
    else if (typeof parsedAlterations === 'string') parsedAlterations = [parsedAlterations]
    return { initAlterations: parsedAlterations };
  }, [initValues]);

  // Handle changing state on the samples file
  const samplesURL = `${process.env.REACT_APP_SUPERDENDRIX_DATA_URL}/${selectedDataset}/samples.json`;
  useEffect(() => {
    d3Json(samplesURL)
      .then((jsonData) => {
        setSamplesData({
          samples: Object.keys(jsonData.sampleToTissue).sort(),
          sampleToTissue: jsonData.sampleToTissue,
          sampleToEssentialScore: jsonData.sampleToEssentialScore,
          sampleToAlterationCount: jsonData.sampleToAlterationCount,
        })
      }).catch( (error) => {
        console.error(error)
      })
  }, [selectedDataset, samplesURL, setSamplesData]);

  // Render
  return (
    <Grid id="DataSelect" item className={classes.dataSelect}>
      <Typography variant="h5">Select Data</Typography>
      <Grid container>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Dataset</InputLabel>
          <Select
            labelId="dataset-select"
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value)}
          >
          {
            datasets.map((dataset) => (
              <MenuItem value={dataset} key={dataset}>DepMap { dataset }</MenuItem>
            ))
          }
          </Select>
        </FormControl>
      </Grid>
      <AlterationsSelect {...initAlterations} selectedDataset={selectedDataset} setPayload={setAlterationData} />
      <ProfileSelect initProfile={initProfile} selectedDataset={selectedDataset} setPayload={setProfileData}  />
    </Grid>
  )
}

export default DataSelect
