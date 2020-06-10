import React, {useEffect, useState} from 'react';
import {fromPairs} from 'lodash';
import {json as d3Json} from 'd3-fetch';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import {ListboxComponent} from '../../../helpers.js';

const AlterationsSelect = ({
  selectedDataset,
  setPayload,
  initAlterations,
}) => {
  // URL prefix
  const urlPrefix = `${process.env.REACT_APP_SUPERDENDRIX_DATA_URL}/${selectedDataset}/genes`;

  // State
  const [selectedAlterations, setSelectedAlterations] = useState([])
  const [alterations, setAlterations] = useState([])
  const [alterationPayload, setAlterationPayload] = useState({})

  // Effects
  useEffect( () => {
    const alterationsManifestURL = `${urlPrefix}/manifest.json`
    d3Json(alterationsManifestURL)
      .then((jsonData) => {
        setAlterations(jsonData.alterations);
        if (initAlterations) setSelectedAlterations(initAlterations)
      }).catch( (error) => {
        console.error(error);
      })
  }, [initAlterations, urlPrefix]);

  // Fetch the data and add it to state
  useEffect( () => {
    if (!selectedAlterations) return
    Promise.all(
      selectedAlterations.map( alteration => d3Json(`${urlPrefix}/${alteration}.json`)),
    )
    .then((jsonData) => {
      jsonData = typeof jsonData === 'undefined' ? [] : jsonData;
      setAlterationPayload({
        alterations: fromPairs(
          selectedAlterations.map((alteration, i) => [
            alteration,
            jsonData[i],
        ])),
      });
    });
  }, [selectedAlterations, urlPrefix]);

  // Send the payload whenever the data changes
  useEffect( () => {
    setPayload(alterationPayload);
  }, [alterationPayload, setPayload]);


  // Render
  return (
    <Grid container item direction="column">
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
            <TextField {...params} variant="standard" margin="normal" label="Alterations" fullWidth  />
          )}
        />
      </FormControl>
    </Grid>
  )
}

export default AlterationsSelect
