import * as React from 'react';
import { MaterialIconButton } from '../../component';

/** */
export interface ListBottomToolbarProps {
  /** */
  onCreateList: () => void;
}

/** */
export function ListBottomToolbar(props: ListBottomToolbarProps) {
  /** */
  return (
    <div className='netsparks-lists-bottom-toolbar'>
      <div className='netsparks-lists-bottom-toolbar-content'>
        <MaterialIconButton
          icon='add_circle'
          title='Create list'
          onClick={() => props.onCreateList()}
        />
      </div>
    </div>
  );
}
