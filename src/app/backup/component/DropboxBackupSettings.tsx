import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { IoC } from '@andcreations/common';

import { Log } from '../../log';
import { CollapsibleSection } from '../../component';
import { SettingsService } from '../../setting';
import {
  DROPBOX_BACKUP_SETTINGS_KEY,
  DropboxBackupSettingsModel,
} from '../model';

/** */
interface DropboxBackupSettingsState {
  /** Dropbox settings */
  enabled: boolean;
  accessToken: string;
  path: string;

  /** */
  isDirty: boolean;

  /** */
  loaded: boolean;
  loadFailed?: boolean;
}

/** */
const settingsService = IoC.resolve(SettingsService);

/** */
export function DropboxBackupSettings() {
  /** */
  const [state, setState] = useState<DropboxBackupSettingsState>({
    enabled: false,
    accessToken: '',
    path: '',
    isDirty: false,
    loaded: false,
  });

  /** */
  useEffect(() => {
    if (state.loaded || state.loadFailed) {
      return;
    }
    settingsService.get<DropboxBackupSettingsModel>(
      DROPBOX_BACKUP_SETTINGS_KEY
    )
    .then(loadedSettings => {
      setState({
        ...state,
        enabled: loadedSettings.enabled,
        accessToken: loadedSettings.accessToken,
        path: loadedSettings.path,
        loaded: true,
      })
    })
    .catch(error => {
      Log.e('Failed to get dropbox backup settings', error);
      setState({
        ...state,
        loadFailed: true,
      });
    });
  });

  /** */
  const onChangeEnabled = () => {
    const enabled = !state.enabled;
    setState({
      ...state,
      enabled,
      isDirty: true,
    })
  };

  /** */
  const onAccessTokenChange = (event) => {
    const value = event.target.value;
    setState({
      ...state,
      accessToken: value,
      isDirty: true,
    })
  };

  /** */
  const onDirectoryChange = (event) => {
    const value = event.target.value;
    setState({
      ...state,
      path: value,
      isDirty: true,
    });
  };

  /** */
  const onApplySettings = () => {
    settingsService.set(
      DROPBOX_BACKUP_SETTINGS_KEY,
      {
        enabled: state.enabled,
        accessToken: state.accessToken,
        path: state.path,
      },
    )
    .then(() => {
      setState({
        ...state,
        isDirty: false,
      });
    })
    .catch(error => {
      Log.e('Failed to apply settings', error);
    });
  };

  /** */
  return (
    <CollapsibleSection
      id='dropboxBackupSettings'
      header={{
        title: 'Dropbox backup',
      }}
    >
      <Form className='netsparks-dropbox-backup-settings-form'>
        <Form.Check
          type='switch'
          label='Enabled'
          checked={state.enabled}
          onChange={onChangeEnabled}
        />
        <Form.Group className='netsparks-modal-form-group'>
          <Form.Label>Access token</Form.Label>
          <Form.Control
            type='password'
            disabled={!state.enabled}
            value={state.accessToken}
            onChange={onAccessTokenChange}
          />
        </Form.Group>
        <Form.Group className='netsparks-modal-form-group'>
          <Form.Label>Directory</Form.Label>
          <Form.Control
            type='text'
            disabled={!state.enabled}
            value={state.path}
            onChange={onDirectoryChange}
          />
        </Form.Group>
        <Button className='netsparks-modal-form-group'
          variant='primary'
          size='sm'
          disabled={!state.isDirty}
          onClick={onApplySettings}
        >
          Apply settings
        </Button>
      </Form>
    </CollapsibleSection>
  );
}