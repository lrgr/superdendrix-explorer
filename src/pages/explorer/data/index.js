import React, { useEffect, useMemo } from 'react'
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
  datasets,
  selections,
}) => {
  const classes = useStyles();

  // Handle changing state on the samples file
  const { selectedDataset, setSelectedDataset } = selections;
  useEffect(() => {
    if (selectedDataset !== null){
      console.log('updating sample data', selectedDataset)
      d3Json(`${process.env.REACT_APP_SUPERDENDRIX_DATA_URL}/${selectedDataset}/samples.json`)
        .then((jsonData) => {
          setSamplesData({
            samples: Object.keys(jsonData.sampleToTissue).sort(),
            sampleToTissue: jsonData.sampleToTissue,
            sampleToEssentialScore: jsonData.sampleToEssentialScore,
            sampleToAlterationCount: jsonData.sampleToAlterationCount,
          });
        }).catch( (error) => {
          console.error(error)
        })
    }
  }, [selectedDataset, setSamplesData]);

  // Render
  return (
    <Grid id="DataSelect" item className={classes.dataSelect}>
      <Typography variant="h5">Select Data</Typography>
      <Grid container>
        <FormControl fullWidth>
          <InputLabel id="dataset-select">Dataset</InputLabel>
          <Select
            labelId="dataset-select"
            value={datasets.includes(selectedDataset) ? selectedDataset : ''}
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
      <AlterationsSelect {...selections} setPayload={setAlterationData} />
      <ProfileSelect {...selections} setPayload={setProfileData}  />
    </Grid>
  )
}

export default DataSelect
