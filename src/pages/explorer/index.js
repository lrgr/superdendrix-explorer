import React, { useState, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import { ascending } from 'd3-array';
import { json as d3Json } from 'd3-fetch';
import Grid from '@material-ui/core/Grid';
import queryString from 'query-string';
import DataSelect from './data/index.js';
import Explorer from './charts/index.js';
import Legend from './legend/index.js';

const useStyles = makeStyles(theme => ({
  dataExplorer: {
    flexWrap: 'nowrap',
  }
}));

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
  const [profileData, setProfileData] = useState({});
  const [samplesData, setSamplesData] = useState({
    samples: [],
    sampleToTissue: {},
    sampleToEssentialScore: {},
    sampleToAlterationCount: {},
  });
  const [alterationData, setAlterationData] = useState({});

  const [selectedDataset, setSelectedDataset] = useState('19Q1');
  const [selectedProfile, setSelectedProfile] = useState('BRAF');
  const [selectedAlterations, setSelectedAlterations] = useState(['BRAF_A']);

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

  useEffect( () => {
    const newSearch = queryString.stringify({
      alterations: selectedAlterations.sort(ascending),
      profileName: selectedProfile,
      dataset: selectedDataset,
    });
    if (newSearch !== location.search){
      history.push({
        pathname: '/',
        search: newSearch,
      });
    }
  }, [selectedProfile, selectedAlterations, selectedDataset, location.search, history]);

  useEffect( () => {
    const {
      alterations,
      dataset,
      profileName,
    } = queryString.parse(location.search);

    if (alterations){
      if (typeof alterations !== typeof []){
        setSelectedAlterations([ alterations ]);
      } else {
        setSelectedAlterations(alterations);
      }
    }

    if (profileName){
      setSelectedProfile(profileName);
    }

    if (dataset){
      setSelectedDataset(dataset);
    }
  }, []);

  // Render
  const selections = {
    selectedDataset,
    setSelectedDataset,
    selectedAlterations,
    setSelectedAlterations,
    selectedProfile,
    setSelectedProfile,
  };

  return (
    <Grid container className={classes.dataExplorer} style={{ height: 'calc(100% - 64px)' }}>
      <DataSelect
        selections={selections}
        setProfileData={setProfileData}
        setAlterationData={setAlterationData}
        setSamplesData={setSamplesData}
        datasets={datasets}
      />
      <Explorer {...payload} legend={legend} />
      <Legend {...payload} setLegend={setLegend} />
    </Grid>
  )
})

export default DataExplorer
