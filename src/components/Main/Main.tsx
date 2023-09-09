import { Show } from 'solid-js';
import { Player } from '../Player/Player';
import styles from './Main.module.scss';
import { Routes, Route, Outlet } from '@solidjs/router';
import { currentMediaItem } from '../../stores/store';
import { Home } from '../../pages/Home/Home';

export function Main() {
  return (
    <div class={styles.main}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Outlet />
    </div>
  );
}
