import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import { fromPairs } from 'lodash';
import {select, event as d3Event} from 'd3-selection';
import { brushX } from 'd3-brush';
import { scaleLinear, scaleBand } from 'd3-scale';
import { extent, max, ascending } from 'd3-array';
import { axisLeft } from 'd3-axis';

import AlterationTooltip from './AlterationTooltip.js';
import './style.css';
import { fieldSorter } from '../../../helpers.js';
import { ASCENDING, NO_SORT } from '../../../constants.js';

// Constants
const margin = {
  left: 100,
  top: 10,
  right: 30,
  bottom: 30
};
const paddingInner = 0;

const Chart = ({
  alterations,
  sampleToAlterationCount,
  sampleToTissue,
  scores,
  profileName,
  thresholdScore,
  direction,
  legend,
}) => {
  // State and refs
  const [containerWidth, setContainerWidth] = useState(500)
  const [visibleSamples, setVisibleSamples] = useState([])
  const [anchorPosition, setAnchorPosition] = useState({ top: 0, left: 0, open: false });
  const [highlightedSample, setHighlightedSample] = useState(null)

  const barEl = useRef(null)
  const brushEl = useRef(null)
  const brushLeftAxisEl = useRef(null)
  const svgParentEl = useRef(null)
  const barLeftAxisEl = useRef(null)

  //////////////////////////////////////////////////////////////////////////////
  // CHART COMPUTATION
  //////////////////////////////////////////////////////////////////////////////
  // Data preprocessing
  const width = useMemo(() => containerWidth - margin.left - margin.right, [containerWidth]);
  const samples = useMemo(() => Object.keys(scores), [scores]);
  const values = useMemo(() => samples.map( s => scores[s]), [scores, samples]);
  const events = useMemo(() => Object.keys(alterations), [alterations]);
  const alterationCounts = useMemo(() => samples.map(s => sampleToAlterationCount[s]).map((c) => c ? c : 1), [samples, sampleToAlterationCount]);
  const maxAlterationCount = useMemo(() => max(alterationCounts), [alterationCounts]);

  const alterationMap = useMemo( () => (
    fromPairs(
      Object.keys(alterations).map( e => (
        [e, new Set(Object.keys(alterations[e]))]
      ))
    )
  ), [alterations]);

  const sampleToAlterations = useMemo( () => (
    fromPairs(
      samples.map( s => (
        [ s, events.filter(e => alterationMap[e].has(s)) ]
      ))
    )
  ), [alterationMap, samples, events]);

  const sortedSamples = useMemo( () => {
    // If we don't have any sort information, then we just do ascending by score
    if (!legend.sort) return samples.sort((a, b) => ascending(scores[a], scores[b]))

    // Otherwise we assemble an array of sample objects, so we can sort on the
    // sample fields
    const eventIndices = fromPairs(events.map((e, i) => [e ,i] ))
    const sampleData = samples.map( s => {
      const alterations = Array.from(sampleToAlterations[s])
      let alterationIndex
      if (alterations.length === 0) alterationIndex = events.length + 2
      else if (alterations.length === 1) alterationIndex = eventIndices[alterations[0]]
      else alterationIndex = events.length + 1
      return {
        name: s,
        score: scores[s],
        tissue: sampleToTissue[s],
        alterations: alterationIndex,
      };
    });

    // Do some custom sorting, always sorting by sample at the end
    const fields = [ ]
    if (legend.sort.alterations !== NO_SORT){
      fields.push( legend.sort.alterations === ASCENDING ? 'alterations' : '-alterations' )
    }
    if (legend.sort.tissues !== NO_SORT){
      fields.push( legend.sort.tissues === ASCENDING ? 'tissue' : '-tissue' )
    }
    fields.push('score')

    sampleData.sort(fieldSorter(fields))

    return sampleData.map( d => d.name )

  }, [samples, scores, events, sampleToAlterations, legend.sort, sampleToTissue])

  // Scales etc
  const barHeight = 450//useMemo( () => heightPerGene * alterations.length, [alterations])
  const brushHeight = 50
  const heatmapHeight = 20
  const containerHeight = useMemo( () => barHeight + brushHeight + margin.top + margin.bottom, [barHeight, brushHeight])

  const brushXScale = useMemo( () => (
    scaleBand().domain(sortedSamples).range([0, width]).paddingInner(paddingInner)
  ), [sortedSamples, width]);
  const brushYScale = useMemo( () => (
    scaleLinear().domain([1, maxAlterationCount+1]).range([brushHeight, 0])
  ), [maxAlterationCount]);

  const barXScale = useMemo( () => {
    return scaleBand().domain(visibleSamples).range([0, width]).paddingInner(paddingInner)
  }, [visibleSamples, width]);
  const barYScale = useMemo( () => {
    const domain = samples.length === 0 ? [-100, 100] : extent(values);
    return scaleLinear().domain(domain).range([barHeight, 0])
  }, [samples, values, barHeight]);

  //////////////////////////////////////////////////////////////////////////////
  // THRESHOLD SCORE LOGIC
  //////////////////////////////////////////////////////////////////////////////
  const thresholdXIndex = useMemo( () => {
    // Handle the increased dependency
    if (direction === 'increased_dependency'){
      let index = -1;
      sortedSamples.forEach((sample, i) => {
        if (scores[sample] > thresholdScore && index === -1){
          index = i - 1;
        }
      });
      return index === -1 ? null : sortedSamples[index];
    }
    // Handle the decreased dependency
    let index = -1;
    [...sortedSamples].reverse().forEach((sample, i) => {
      if (scores[sample] < thresholdScore && index === -1){
        index = sortedSamples.length - (i - 1);
      }
    });
    return index === -1 ? null : sortedSamples[index];
  }, [direction, scores, sortedSamples, thresholdScore]);

  const thresholdOpacity = useMemo(() => {
    if (thresholdXIndex === null) return 0;
    if (legend.sort){
      if (legend.sort.alterations !== 'NO_SORT' || legend.sort.tissues !== 'NO_SORT'){
        return 0;
      }
    } else {
      return 0.2
    }
    return 1;
  }, [legend.sort, thresholdXIndex]);

  //////////////////////////////////////////////////////////////////////////////
  // EFFECTS
  //////////////////////////////////////////////////////////////////////////////
  // Turn on brushing
  useEffect( () => {
    if (samples.length === 0) return
    const el = brushEl.current // need this for destructor
    const brushExtent = [
      [margin.left, margin.top], // x0, y0
      [margin.left + width, brushHeight + margin.top] // x1, y1
    ]
    const brush = brushX().extent(brushExtent).on('brush', () => {
      if (d3Event.selection !== null){
        const [x1, x2] = d3Event.selection.map(x => x-margin.left) // values are relative to the SVG
        setVisibleSamples(sortedSamples.filter( s => brushXScale(s) >= x1 && brushXScale(s) <= x2))
      } else { // reset
        setVisibleSamples(sortedSamples)
      }
    });

    select(el).on('click', () => {
      select(el).call(brush.move, null) // reset on click
    }).call(brush)

    // When visibile samples is zero, we almost certainly just loaded
    setVisibleSamples(sortedSamples)
    select(el).call(brush.move, null) // reset on click

    return () => select(el).on(".brush", null) // destruct
  }, [brushXScale, samples, sortedSamples, width]);


  // Add axes
  useEffect( () => {
    select(brushLeftAxisEl.current).call(axisLeft(brushYScale).ticks(5))
  }, [brushYScale])

  useEffect( () => {
    select(barLeftAxisEl.current).call(axisLeft(barYScale).ticks(10))
  }, [barYScale])

  // Resize
  useEffect( () => {
    setContainerWidth(svgParentEl.current.clientWidth)
  }, [])

  useEffect(() => { // see https://gist.github.com/gaearon/cb5add26336003ed8c0004c4ba820eae
     const handleResize = () => setContainerWidth(svgParentEl.current.clientWidth)
     window.addEventListener('resize', handleResize)
     return () => {
       window.removeEventListener('resize', handleResize)
     }
   });

   // Change the data
   useEffect(() => setHighlightedSample(null), [samples, alterations]);

   //////////////////////////////////////////////////////////////////////////////
   // EVENT HANDLERS
   //////////////////////////////////////////////////////////////////////////////
   const handleMouseEnter = (event, sample) => {
     const { x, y} = event.nativeEvent;
     setAnchorPosition({ top: y + 10, left: x, open: true });
     setHighlightedSample(sample);
   }
   const handleMouseLeave = () => setAnchorPosition({ top: 0, left: 0, open: false });

   //////////////////////////////////////////////////////////////////////////////
   // HELPERS
   //////////////////////////////////////////////////////////////////////////////
   const sampleFill = useCallback( (s) => {
     const sampleAlterations = sampleToAlterations[s] || [];
     if (sampleAlterations.length === 0) return 'lightgray';
     else if (sampleAlterations.length > 1) return 'black';
     else return legend.eventColors[sampleAlterations[0]];
   }, [legend, sampleToAlterations]);

   const sampleOpacity = useCallback((s) => {
     if (direction === 'increased_dependency'){
       return scores[s] < thresholdScore ? 1 : 1;
     }
     return scores[s] > thresholdScore ? 1 : 1;
   }, [scores, thresholdScore, direction]);

  //////////////////////////////////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////////////////////////////////
  return (
    <Grid container ref={svgParentEl}>
      <svg className="BrushChart" ref={brushEl} width={containerWidth} height={brushHeight + margin.top + margin.bottom}>
        <g className="axes">
          <g transform={`translate(${margin.left-5}, ${margin.top})`} ref={brushLeftAxisEl}></g>
          <g transform={`translate(40,${margin.top+(brushHeight/2)}) rotate(-90)`}>
            <text x="0" y="0" className="legend">Alterations/</text>
            <text x="0" y="1em" className="legend">Sample</text>
          </g>
        </g>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <g id="Brush">
            {
              sortedSamples.map( s => (
                <rect
                  key={s}
                  x={brushXScale(s)}
                  y={sampleToAlterationCount[s] ? brushYScale(sampleToAlterationCount[s]) : brushYScale(1)}
                  width={brushXScale.bandwidth()}
                  height={sampleToAlterationCount[s] ? brushHeight-brushYScale(sampleToAlterationCount[s]) : brushHeight - brushYScale(1)}
                  fill={sampleFill(s)}
                  onMouseEnter={(e) => handleMouseEnter(e, s)}
                  onMouseLeave={handleMouseLeave}
                />
              ))
            }
          </g>
        </g>
      </svg>
      <svg className="Heatmap" width={containerWidth} height={heatmapHeight}>
        <g className="axes">
          <text transform={`translate(${margin.left-5}, ${(heatmapHeight)/2+3})`}>Tissue type</text>
        </g>
        <g transform={`translate(${margin.left}, 0)`}>
          {
            visibleSamples.map( s => (
              <rect
                key={s}
                x={barXScale(s)}
                y={0}
                height={heatmapHeight}
                width={barXScale.bandwidth()}
                fill={legend.tissueColors[sampleToTissue[s]]}
                onMouseEnter={(e) => handleMouseEnter(e, s)}
                onMouseLeave={handleMouseLeave}
              />
            ))
          }
        </g>
      </svg>
      <svg className="BarChart" ref={barEl} width={containerWidth} height={containerHeight}>
        <g className="axes">
          <g transform={`translate(${margin.left-5}, ${margin.top})`} ref={barLeftAxisEl}></g>
          <g transform={`translate(40,${margin.top+(barHeight/2)}) rotate(-90)`}>
            <text x="0" y="0" className="legend" style={{fontSize: '14px'}}>{profileName} (2C)</text>
          </g>
        </g>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <line
            id="thresholdScore"
            x1={thresholdXIndex !== null ? barXScale(thresholdXIndex) : 0}
            y1={0}
            x2={thresholdXIndex !== null ? barXScale(thresholdXIndex) : 0}
            y2={barHeight}
            stroke="green"
            strokeWidth="2px"
            strokeDasharray="4"
            opacity={thresholdOpacity}
          />
          <g id="Bars">
            {
              visibleSamples.map(s => (
                <rect
                  key={s}
                  x={barXScale(s)}
                  y={barYScale(Math.max(0, scores[s] ? scores[s] : 0))}
                  width={barXScale.bandwidth()}
                  height={Math.abs(barYScale(scores[s] ? scores[s] : 0) - barYScale(0))}
                  fillOpacity={sampleOpacity(s)}
                  fill={sampleFill(s)}
                  onMouseEnter={(e) => handleMouseEnter(e, s)}
                  onMouseLeave={handleMouseLeave}
                />
              ))
            }
          </g>
        </g>
      </svg>
      <Grid container direction="column">
        <Grid item>
          <b>Direction</b>: { direction === 'increased_dependency' ? 'Increased' : 'Decreased' } Dependency
        </Grid>
        <Grid item>
          <b>Score equivalent to CERES essential</b>: { thresholdScore.toFixed(2) }
        </Grid>
      </Grid>
        {
          highlightedSample !== null &&
          <AlterationTooltip
            anchorPosition={anchorPosition}
            onMouseLeave={handleMouseLeave}
            sample={highlightedSample}
            tissue={sampleToTissue[highlightedSample]}
            score={scores[highlightedSample]}
            alterationCount={sampleToAlterationCount[highlightedSample]}
            alterations={
              sampleToAlterations[highlightedSample].map((d) => ({
                alteration: d,
                proteinChanges: alterations[d][highlightedSample],
              }))
            }
          />
        }
    </Grid>
  );
};

export default Chart;
