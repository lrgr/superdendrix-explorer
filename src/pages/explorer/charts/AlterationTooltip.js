import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';

const useStyles = makeStyles(theme => ({
  popover: {
    padding: '5px',
    '& .MuiTableCell-root': {
      padding: '0px 5px 0px 5px',
      fontSize: '10px',
    },
  },
}));

const AlterationTooltip = ({
  anchorPosition,
  sample,
  score,
  tissue,
  alterationCount,
  alterations,
  onMouseLeave,
}) => {
  const classes = useStyles();

  return (
    <Popover
      style={{ pointerEvents: 'none' }}
      disableRestoreFocus
      className={classes.popover}
      open={anchorPosition.open}
      anchorReference="anchorPosition"
      anchorPosition={{ top: anchorPosition.top, left: anchorPosition.left }}
      onClose={onMouseLeave}
      transitionDuration={0}
      anchorOrigin={{
        vertical: 'center',
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
              <TableCell><b>Non-Silent Mutations</b></TableCell>
              <TableCell>{alterationCount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>Score</b></TableCell>
              <TableCell>{score.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>Alterations</b></TableCell>
              <TableCell align="left">
                {
                  alterations.map(({ alteration, proteinChanges}) => (
                    `${alteration} (${proteinChanges.join(', ')})`
                  )).join(', ')
                }
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Popover>
  );
};

export default AlterationTooltip;
