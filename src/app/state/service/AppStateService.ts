import * as _ from 'lodash';
import { Service } from '@andcreations/common';

import { BusService } from '../../bus';
import { AppStateValues } from '../model';
import { AppStateBusEvents, AppStateChangedBusEvent } from '../bus';

/** */
export interface AppStateListener {
  /** */
  appStateChanged: (values: AppStateValues) => void;
}

/** */
@Service()
export class AppStateService {
  /** */
  private readonly values: AppStateValues = {};

  /** */
  private readonly listeners: AppStateListener[] = [];

  /** */
  constructor(private readonly bus: BusService) {
  }

  /** */
  addListener(listener: AppStateListener): void {
    this.listeners.push(listener);
  }

  /** */
  removeListener(listener: AppStateListener): void {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) {
      this.listeners.splice(index, 1);
    }
  }

  /** */
  private async notifyValuesChanged(values: AppStateValues): Promise<void> {
    await this.bus.emit<AppStateChangedBusEvent>(
      AppStateBusEvents.AppStateChanged,
      {
        values,
      },
    );
    this.listeners.forEach(listener => {
      listener.appStateChanged(values);
    });
  }

  /** */
  async get<T>(key: string, defaultValue?: T): Promise<T> {
    const value = this.values[key] as T;
    if (value === undefined) {
      const content = localStorage.getItem(key);
      if (content) {
        const restoredValue = JSON.parse(content);
        this.values[key] = restoredValue;
        return restoredValue;
      }
    }
    return value ?? defaultValue;
  }

  /** */
  private async setOne(key: string, value: any): Promise<{ changed: boolean }> {
  // compare
    const currentAsString = localStorage.getItem(key);
    if (currentAsString !== null) {
      const current = JSON.parse(currentAsString);
      if (_.isEqual(value, current)) {
        return { changed: false };
      }
    }

  // set & store
    this.values[key] = value;
    localStorage.setItem(key, JSON.stringify(value));

    return { changed: true };
  }

  /** */
  async set(values: AppStateValues): Promise<void> {
    const changedValues: AppStateValues = {};
    const keys = Object.keys(values);
    if (!keys.length) {
      return;
    }

  // set one-by-one
    for (const key of keys) {
      const { changed } = await this.setOne(key, values[key]);
      if (changed) {
        changedValues[key] = values[key];
      }
    }

  // notify
    await this.notifyValuesChanged(changedValues);
  }

  /** */
  createSnapshot(): AppStateValues {
    return JSON.parse(JSON.stringify(this.values));
  }
}