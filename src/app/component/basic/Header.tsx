import * as React from 'react';
import classNames = require('classnames');

/** */
export interface HeaderProps {
  /** */
  className?: string;

  /** */
  title: React.ReactNode;

  /** */
  actionBar?: React.ReactNode;
}

/** */
export function Header(props: HeaderProps) {
  /** */
  const headerClassNames = classNames([
    'netsparks-header',
    props.className,
  ]);

  /** */
  return (
    <div className={headerClassNames}>
      <div className='netsparks-header-title'>
        {props.title}
      </div>
      <div className='netsparks-header-action-bar'>
        {props.actionBar}
      </div>
    </div>
  );
}