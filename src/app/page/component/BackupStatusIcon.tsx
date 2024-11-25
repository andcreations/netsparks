import * as React from 'react';
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { IoC } from '@andcreations/common';

import { MaterialIcon } from '../../component';
import { BackupListener, BackupService } from '../../backup';

/** */
enum BackupStatus {
  Synced,
  Running,
  Failed,
};

/** */
interface BackupStatusIconState {
  /** */
  status: BackupStatus;

  /** */
  title: string;
}

/** */
const backupService = IoC.resolve(BackupService);

/** */
export function BackupStatusIcon() {
  /** */
  const [state, setState] = useState<BackupStatusIconState>({
    status: BackupStatus.Synced,
    title: 'Synced',
  });
  const { status } = state;

  /** */
  useEffect(() => {
    const listener: BackupListener = {
      backupStarted: () => {
        setState({
          ...state,
          status: BackupStatus.Running,
          title: 'Backup running',
        });
      },
      backupFinished: () => {
        setState({
          ...state,
          status: BackupStatus.Synced,
          title: 'Synced',
        });
      },
      backupFailed: () => {
        setState({
          ...state,
          status: BackupStatus.Failed,
          title: 'Backup failed',
        });
      },
    };
    backupService.addListener(listener);

    /** */
    return () => {
      backupService.removeListener(listener);
    };
  });

  /** */
  const iconClassNames = classNames({
    'netsparks-backup-status-icon-running': status === BackupStatus.Running,
    'netsparks-backup-status-icon-failed': status === BackupStatus.Failed,
  });

  /** */
  return (
    <MaterialIcon
      className={iconClassNames}
      icon='cloud'
      title={state.title}
    />
  );
}