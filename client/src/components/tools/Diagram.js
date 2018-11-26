import * as React from "react";
import { connect } from "react-redux";

import { clearDiagram, setProjection, setSlice, setRenderer } from "~/state/actions/diagram";
import { getDiagram, getSlice, getProjection, getSliceBounds, getRenderer } from "~/state/store/diagram";

import Tool, { Control } from "~/components/Tool";

export const DiagramTool = ({
  diagram,
  slice,
  sliceBounds,
  projection,
  renderer,
  onClearDiagram,
  onSetSlice,
  onSetProjection,
  onSetRenderer
}) => {
  if (diagram == null) {
    return null;
  }

  return (
    <Tool title="Diagram" actions={[
      { label: "Clear diagram", icon: "close", onClick: onClearDiagram }
    ]}>
      <Control label="Dimension">{diagram.n}</Control>
      <RendererControl value={renderer} onChange={onSetRenderer} />
      <ProjectionControl value={projection} dimension={diagram.n} onChange={onSetProjection} />
      <SliceControl slice={slice} bounds={sliceBounds} onChange={onSetSlice} />
    </Tool>
  );
};

export default connect(
  state => ({
    diagram: getDiagram(state),
    slice: getSlice(state),
    projection: getProjection(state),
    sliceBounds: getSliceBounds(state),
    renderer: getRenderer(state)
  }),
  dispatch => ({
    onClearDiagram: () => dispatch(clearDiagram()),
    onSetProjection: (projection) => dispatch(setProjection(projection)),
    onSetSlice: (index, height) => dispatch(setSlice(index, height)),
    onSetRenderer: (renderer) => dispatch(setRenderer(renderer))
  })
)(DiagramTool);

export const ProjectionControl = ({
  value,
  dimension,
  onChange
}) => {
  let options = [];
  for (let i = 0; i <= dimension; i++) {
    options.push(i);
  }

  return (
    <Control label="Projection">
      <select onChange={e => onChange(Number(e.target.value)) } value={value}>
        {options.map(option =>
          <option value={option} key={option}>
            {option}
          </option>
        )}
      </select>
    </Control>
  );
};

export const SliceControl = ({
  slice,
  bounds,
  onChange
}) => {
  let selections = [];
  for (let max of bounds) {
    let options = [];
    for (let j = -1; j <= max + 1; j++) {
      options.push({index: j, boundary: j == -1 ? 'S' : j == max + 1 ? 'T' : null});
      /*
      if (j == max + 1) {
        options.push(-2);
      } else {
        options.push(j);
      }
      */
    }
    selections.push(options);
  }

  return (
    <Control label="Slice">
      {selections.map((options, i) =>
        <select onChange={e => onChange(i, Number(e.target.value))} value={slice[i]} key={i}>
          {options.map(option =>
            <option value={option.index} key={option.index}>
              {option.boundary ? option.boundary : Math.floor(option.index / 2) + (option.index % 2 == 0 ? '' : '*')}
            </option>
          )}
        </select>
      )}
    </Control>
  );
};

export const RendererControl = ({
  value,
  onChange
}) => {
  return (
    <Control label="Renderer">
      <select onChange={e => onChange(Number(e.target.value))} value={value}>
        <option value={2}>2D</option>
        <option value={3}>3D</option>
      </select>
    </Control>
  );
}