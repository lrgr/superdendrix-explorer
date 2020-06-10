import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {json as d3Json} from 'd3-fetch';
import {ascending} from 'd3-array';
import queryString from 'query-string';
import {withRouter} from 'react-router';

const SuperDendrixResults = withRouter(({
  history,
  location,
}) => {
  // Load the manifest with the list of datasets
  const dataURL = `${process.env.REACT_APP_SUPERDENDRIX_DATA_URL}/manifest.json`;
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('19Q1');
  useEffect( () => {
    d3Json(dataURL)
      .then((jsonData) => setDatasets(jsonData.datasets))
      .catch((error) => {
        console.error(error)
      })
  }, [dataURL]);

  // Load the SuperDendrix results
  const superDendrixResultsURL = `${process.env.REACT_APP_SUPERDENDRIX_DATA_URL}/${selectedDataset}/superdendrix-results.json`;
  const [superDendrixResults, setSuperDendrixResults] = useState([]);
  useEffect(() => {
    d3Json(superDendrixResultsURL)
      .then((jsonData) => setSuperDendrixResults(jsonData.sets))
      .catch( (error) => {
        console.error(error)
      })
  }, [selectedDataset, superDendrixResultsURL, setSuperDendrixResults]);

  return (
    <Container maxWidth="md" style={{ height: 'calc(100% - 64px)'}}>
      <Grid container direction="column" style={{ height: '100%', flexWrap: 'nowrap' }}>
        <Grid item>
          <Typography variant="h5">SuperDendrix Results</Typography>
        </Grid>
        <Grid item>
          <FormControl fullWidth>
            <InputLabel id="dataset-select">Dataset</InputLabel>
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
        <Grid item style={{ marginTop: '10px' }}>
          Click on the row to view the set in the Explorer!
        </Grid>
        <Grid item style={{ marginTop: '10px' }}>
          <TableContainer component="div">
            <Table aria-label="superdendrix results table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell><b>Profile Name</b></TableCell>
                  <TableCell><b>Alterations</b></TableCell>
                  <TableCell align="right"><b>Weight <i>W(M)</i></b></TableCell>
                  <TableCell align="right"><b>FDR</b></TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item style={{ overflowY: 'scroll', flexGrow: 1, flexShrink: 1 }}>
          <TableContainer component="div">
            <Table aria-label="superdendrix results table" size="small">
              <TableBody>
                {
                  superDendrixResults.map(({
                    profile,
                    alterations,
                    weight,
                    fdr,
                  }, i) => (
                  <TableRow
                    key={i}
                    onClick={() => {
                      history.push({
                        pathname: '/',
                        search: queryString.stringify({
                          alterations: alterations.sort(ascending),
                          profileName: profile,
                        })
                      })
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell>{profile}</TableCell>
                    <TableCell>{alterations.join(', ')}</TableCell>
                    <TableCell align="right">{ weight }</TableCell>
                    <TableCell align="right">{ fdr }</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
});

export default SuperDendrixResults;
