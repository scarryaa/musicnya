import { Show } from 'solid-js';
import { mergeProps } from 'solid-js/web';
import { Player } from '../Player/Player';
import styles from './Main.module.scss';
import { Routes, Route, Outlet } from '@solidjs/router';
import { currentMediaItem } from '../../stores/store';
import { Home } from '../../pages/Home/Home';

export function Main(props) {
  return (
    <div class={`${styles.main} ${props.libraryAddedVisible ? styles.mainLibraryAdded : ''}`}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Outlet />
    </div>
  );
}
