import React from 'react';
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

const Credits = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h5">Credits</Typography>
      <Typography variant="overline">Technology</Typography><br/>
      This web application was built with open-source tools, including:
      <ul>
        <li><a href="https://d3js.org/" target="_new">D3</a></li>
        <li><a href="https://material-ui.com/" target="_new">Material UI</a></li>
        <li><a href="https://reactjs.org/" target="_new">React</a></li>
      </ul>
      It is hosted on Heroku and GitHub Pages, and is <a href="https://github.com/lrgr/superdendrix-explorer" target="_new">open-source</a>.
      <br/><br/>
      <Typography variant="overline">Data</Typography><br/>
      This web application uses public data from two projects from the Broad Institute:
      <ul>
        <li><a href="https://portals.broadinstitute.org/ccle" target="_new">Cancer Cell Line Encylopedia (CCLE)</a></li>
        <li><a href="https://depmap.org/portal/" target="_new">DepMap</a></li>
      </ul>
      For more details on this project, see the <Link to="/about">About</Link> page.
    </Container>
  )
}

export default Credits
