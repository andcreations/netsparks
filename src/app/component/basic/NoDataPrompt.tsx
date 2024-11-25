import * as React from 'react';
import classNames = require('classnames');

import { htmlToReact } from '../../util';

/** */
export interface NoDataPromptProps {
  /** */
  className?: string;

  /** */
  info?: string;

  /** */
  details?: string;
}

/** */
export function NoDataPrompt(props: NoDataPromptProps) {
  /** */
  const noDataPromptClassNames = classNames([
    'netsparks-no-data-prompt',
    props.className,
  ]);

  /** */
  return (
    <div className={noDataPromptClassNames}>
      { props.info &&
        <div className='netsparks-no-data-prompt-info'>
          {htmlToReact(props.info)}
        </div>
      }
      { props.details &&
        <div className='netsparks-no-data-prompt-details'>
          {htmlToReact(props.details)}
        </div>
      }
    </div>
  );
}