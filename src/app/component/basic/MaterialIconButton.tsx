import * as React from 'react';
import { MaterialIcon, MaterialIconProps } from './MaterialIcon';

/** */
export interface MaterialIconButtonProps extends MaterialIconProps {
}

/** */
export function MaterialIconButton(props: MaterialIconButtonProps) {
  /** */
  return (
    <div className='netsparks-material-icon-button'>
      <MaterialIcon {...props}/>
    </div>
  );
}