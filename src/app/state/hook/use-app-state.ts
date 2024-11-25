import { IoC } from '@andcreations/common';
import { useEffect } from 'react';

import { AppStateValues } from '../model';
import { AppStateListener, AppStateService } from '../service';

/** */
const appState = IoC.resolve(AppStateService);

/** */
export function useAppState(
  keys: string[],
  appStateChanged: (values: AppStateValues) => void,
): void {
  useEffect(() => {
    const listener: AppStateListener = {
      appStateChanged: (values) => {
      // matching keys
        const matchingKeys = Object.keys(values)
          .filter(key => keys.includes(key));
        if (!matchingKeys.length) {
          return;
        }

      // matching values
        const matchingValues: AppStateValues = {};
        matchingKeys.forEach(key => matchingValues[key] = values[key]);

      // notify
        appStateChanged(matchingValues);
      },
    };
    appState.addListener(listener);
    return () => {
      appState.removeListener(listener);
    };
  });
}