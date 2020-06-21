import React, { useCallback, useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { ExpandLess, ExpandMore, Remove } from '@material-ui/icons';
import { ASCENDING, DESCENDING, NO_SORT } from '../constants.js';

const SortIcon = ({
  onChange,
}) => {
  // State
  const [sortOrder, setSortOrder] = useState(NO_SORT);

  // Callbacks
  const handleClick = useCallback( () => {
    if (sortOrder === DESCENDING) setSortOrder(NO_SORT);
    else if (sortOrder === NO_SORT) setSortOrder(ASCENDING);
    else setSortOrder(DESCENDING);
  }, [sortOrder, setSortOrder]);

  // Effects
  useEffect(() => onChange(sortOrder), [sortOrder, onChange]);

  // Render
  let icon
  if (sortOrder === ASCENDING){
    icon = <ExpandLess fontSize="small" />
  } else if (sortOrder === DESCENDING) {
    icon = <ExpandMore fontSize="small" />
  } else {
    icon = <Remove fontSize="small" />
  }

  return (
    <Grid onClick={handleClick} style={{position: 'relative', top: '5px'}}>
      {icon}
    </Grid>
  );
};

export default SortIcon;
