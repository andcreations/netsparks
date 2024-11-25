import * as React from 'react';
import {
  HashRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { DashboardPage } from '../../dashboard';
import { SettingsPage } from '../../setting';
import { NotFoundPage } from '../../404';

/** */
export function AppRouter() {
  /** */
  return (
    <DndProvider backend={HTML5Backend}>
      <HashRouter>
        <Routes>
          <Route path='/dashboard' element={<DashboardPage/>}/>
          <Route path='/settings' element={<SettingsPage/>}/>
          <Route path='*' element={<NotFoundPage/>}/>
        </Routes>
      </HashRouter>
    </DndProvider>
  );
}