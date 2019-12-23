import React, {useMemo} from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import AlterationsSelect from './alterations.js'
import ProfileSelect from './profiles.js'

const useStyles = makeStyles(theme => ({
  dataSelect: {
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
  urls,
  setProfileData,
  setAlterationData,
  initValues,
}) => {
  const classes = useStyles()
  const initProfile = useMemo( () => ({
    initType: initValues.profileType ? initValues.profileType : '',
    initSource: initValues.profileSource ? initValues.profileSource : '',
    initTarget: initValues.profileTarget ? initValues.profileTarget : 'BRAF',
  }), [initValues])

  const initAlterations = useMemo( () => {
    let parsedAlterations = initValues.alterations
    if (!parsedAlterations) parsedAlterations = ['KRAS_A']
    else if (typeof parsedAlterations === 'string') parsedAlterations = [parsedAlterations]
    return {initAlterations: parsedAlterations}
  }, [initValues])

  // Render
  return (
    <Grid id="DataSelect" item className={classes.dataSelect}>
      <Typography variant="h5">Select Data</Typography>
      <AlterationsSelect {...initAlterations} url={urls.events} setPayload={setAlterationData} />
      <ProfileSelect {...initProfile} urls={urls.scores} setPayload={setProfileData}  />
    </Grid>
  )
}

export default DataSelect
