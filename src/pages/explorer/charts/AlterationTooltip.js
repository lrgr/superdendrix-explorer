import React, {useState, useEffect, useRef} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Box from '@material-ui/core/Box'
import Popover from '@material-ui/core/Popover'

const useStyles = makeStyles(theme => ({
  popover: {
    width: '300px',
    height: '150px',
    padding: '5px',
  },
}));

const AlterationTooltip = ({
  anchorEl,
  sample,
  score,
  tissue,
  alterationCount,
  alterations,
  onMouseLeave,
}) => {
  const classes = useStyles()

  return (
    <Popover
      style={{pointerEvents: 'none', height: `250px`, width: '300px'}}
      disableRestoreFocus
      className={classes.popover}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onMouseLeave}
      transitionDuration={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Box>
        <Table size="small">
          <TableHead>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell><b>Sample</b></TableCell>
              <TableCell>{sample}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>Tissue</b></TableCell>
              <TableCell>{tissue}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>Alteration Count</b></TableCell>
              <TableCell>{alterationCount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>Score</b></TableCell>
              <TableCell>{score.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>Alterations</b></TableCell>
              <TableCell align="left">{alterations.join(', ')}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Popover>
  )
}

export default AlterationTooltip
