import React from 'react';
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

const About = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h5">About</Typography>
      This web application is for exploring genetic dependencies <i>profiles </i>
      and <i>alterations</i> in cancer cell line data (Park et al. <i>in submission</i>).
      (See <Link to="/credits">Credits</Link> for details on the data.)
      Users select a profile and set of alterations to view, and the web application
      creates a waterfall plot of the dependency scores and alterations.
      <br/><br/>
      SuperDendrix refers to a computational pipeline for identifying sets of alterations
      and cancer types that are significantly associated with genetic dependencies.
      These results are available in <Link to="/superdendrix-results">SuperDendrix Results</Link>.
      <br/><br/>
      <Typography variant="overline">Contributors*</Typography>
      <ul style={{ marginTop: '0px' }}>
        <li><a href="https://www.ceplas.eu/en/research/principal-investigators/prof-dr-gunnar-w-klau/" target="_new">Gunnar Klau</a> (Heinrich Heine U.)</li>
        <li><a href="https://lsi.princeton.edu/tyler-park" target="_new">Tyler Park</a> (Princeton U.)</li>
        <li><a href="https://lsi.princeton.edu/ben-raphael" target="_new">Ben Raphael</a> (Princeton U.)</li>
        <li><a href="https://lrgr.io/people/max-leiserson" target="_new">Max Leiserson</a> (U. Maryland)</li>
      </ul>
      <i>*Strict random order</i>
    </Container>
  )
}

export default About
