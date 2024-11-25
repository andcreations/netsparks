import * as React from 'react';
import { useState } from 'react';
import { MaterialIcon, MaterialIconProps } from './MaterialIcon';
import classNames = require('classnames');

/** */
export interface MaterialIconCheckProps extends MaterialIconProps {
  /** */
  checked: boolean;

  /** */
  onChange: (checked: boolean) => void;
}

/** */
interface MaterialIconCheckState {
  /** */
  checked: boolean;
}

/** */
export function MaterialIconCheck(props: MaterialIconCheckProps) {
  /** */
  const [state, setState] = useState<MaterialIconCheckState>({
    checked: props.checked,
  })

  /** */
  const onClick = () => {
    const checked = !state.checked;
    setState({
      ...state,
      checked,
    });
    props.onChange(checked);
  };

  /** */
  const checkClassNames = classNames([
    'netsparks-material-icon-check',
    { 'netsparks-material-icon-check-checked': state.checked },
  ]);

  /** */
  return (
    <div
      className={checkClassNames}
      onClick={onClick}
    >
      <MaterialIcon {...props}/>
    </div>
  );
}