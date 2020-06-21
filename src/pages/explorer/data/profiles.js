import React, {useState, useEffect} from 'react';
import {json as d3Json} from 'd3-fetch';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from '@material-ui/core/FormControl';
import {ListboxComponent} from '../../../helpers.js';

const ProfileSelect = ({
  selectedDataset,
  selectedProfile,
  setSelectedProfile,
  setPayload,
}) => {
  // Constants
  const urlPrefix = `${process.env.REACT_APP_SUPERDENDRIX_DATA_URL}/${selectedDataset}/profiles`;

  // State and refs
  const [profileNames, setProfileNames] = useState([]);

  // Effects
  useEffect( () => {
    // Fetch the profile data
    if (!selectedDataset) return;
    const scoreDataURL = `${urlPrefix}/manifest.json`;
    d3Json(scoreDataURL)
      .then((jsonData) => {
        setProfileNames(jsonData.profiles);
      })
      .catch((error) => {
        console.error(error);
      });

  }, [urlPrefix, selectedProfile, setSelectedProfile, selectedDataset]);

  useEffect( () => {
    if (!selectedProfile || selectedProfile === '') return;
    const scoreURL = `${urlPrefix}/${selectedProfile}.json`;
    d3Json(scoreURL)
      .then((jsonData) => {
        setPayload({
          profileName: selectedProfile,
          scores: jsonData.scores,
          thresholdScore: jsonData.thresholdScore,
          direction: jsonData.direction,
        });
      }).catch( (error) => {
        console.error(error);
      });

  }, [urlPrefix, setPayload, selectedProfile]);

  // Render
  return (
    <Grid container item direction="column">
      <FormControl fullWidth>
        <Autocomplete
          id="scoreTarget"
          ListboxComponent={ListboxComponent}
          value={selectedProfile}
          options={profileNames}
          getOptionLabel={ d => d }
          onChange={ (event, value) => setSelectedProfile(value) }
          renderInput={params => (
            <TextField {...params} variant="standard" margin="normal" label="Target" fullWidth  />
          )}
        />
      </FormControl>
    </Grid>
  )
}

export default ProfileSelect
