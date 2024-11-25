import * as React from 'react';
import { useDrop } from 'react-dnd';
import * as classNames from 'classnames';
import { IoC } from '@andcreations/common';

import { LIST_ENTRY_DND_ITEM, ListEntryDndItem } from '../dnd';
import { ListEntryService } from '../service';
import { Log } from '../../log';

/** */
export interface ListEntryDropBarProps {
  /** */
  listId: number;

  /** */
  dstIndex: number;
}

/** */
const listEntryService = IoC.resolve(ListEntryService);

/** */
export function ListEntryDropBar(props: ListEntryDropBarProps) {
  /** */
  const [{ isOver }, drop ] = useDrop({
    accept: LIST_ENTRY_DND_ITEM,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    drop: (item: ListEntryDndItem) => {
      listEntryService
        .moveListEntry(item.listEntryId, props.listId, props.dstIndex)
        .catch(error => {
          Log.e('Failed to drag&drop list entry', error);
        });
    },
  });  

  /** */
  const dropBarClassNames = classNames([
    'netsparks-list-entry-drop-bar',
    ...(isOver ? ['netsparks-list-entry-drop-bar-over'] : [])
  ]);

  /** */
  return (
    <div className='netsparks-list-entry-drop-bar-wrapper'>
      <div
        className={dropBarClassNames}
        ref={drop}
      >
      </div>
    </div>
  )
}