import * as React from 'react';
import { useState, useEffect } from 'react';
import classNames = require('classnames');
import { IoC } from '@andcreations/common';

import { Log } from '../../log';
import { Header, HeaderProps } from './Header';
import { MaterialIconButton } from './MaterialIconButton';
import { NoDataPrompt } from './NoDataPrompt';
import { CollapsibleSectionService } from '../service';

/** */
export interface CollapsibleSectionProps {
  /** */
  id?: string;

  /** */
  className?: string;

  /** */
  header: HeaderProps;

  /** */
  collapsed?: boolean;
}

/** */
interface CollapsibleSectionState {
  /** */
  collapsed: boolean;

  /** */
  loaded: boolean;
  loadFailed?: boolean;
}

/** */
const collapsibleSectionService = IoC.resolve(CollapsibleSectionService);

/** */
export function CollapsibleSection(
  props: React.PropsWithChildren<CollapsibleSectionProps>,
) {
  /** */
  const [state, setState] = useState<CollapsibleSectionState>({
    collapsed: props.collapsed ?? false,
    loaded: false,
  });

  /** */
  useEffect(() => {
    if (state.loaded || state.loadFailed || !props.id) {
      return;
    }
    collapsibleSectionService.isCollapsed(props.id)
      .then(collapsed => {
        setState({
          ...state,
          collapsed,
          loaded: true,
        });
      })
      .catch(error => {
        Log.e('Failed to get collapsible section settings', error);
        setState({
          ...state,
          loadFailed: true,
        });
      });
  });

  /** */
  const onChangeCollapse = () => {
    const collapsed = !state.collapsed;

  // state
    setState({
      ...state,
      collapsed,
    });

  // settings
    collapsibleSectionService.setCollapsed(props.id, collapsed)
    .catch(error => {
      Log.e('Failed to set collapsible section settings', error);
      setState({
        ...state,
        loadFailed: true,
      });
    });
};

  /** */
  const headerTitle = (
    <div
      className='netsparks-collapsible-section-header-title'
      onClick={onChangeCollapse}
    >
      {props.header.title}
      <MaterialIconButton
        icon={state.collapsed ? 'keyboard_arrow_right' : 'keyboard_arrow_down'}
        onClick={onChangeCollapse}
      />
    </div>
  );

  /** */
  const sectionClassNames = classNames([
    'netsparks-collapsible-section',
    props.className,
  ]);

  /** */
  return (
    <div className={sectionClassNames}>
      <Header
        {...props.header}
        title={headerTitle}
      />
      { !state.collapsed &&
        <div className='netsparks-collapsible-section-content'>
          {props.children}
        </div>
      }
      { state.collapsed &&
        <NoDataPrompt
          details='Collapsed. Click on the header to show content.'
        />
      }
    </div>
  );
}