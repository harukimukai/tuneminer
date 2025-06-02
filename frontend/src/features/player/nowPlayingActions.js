import {
  setPausedSnapshot,
  setNowPlaying,
  togglePlay,
  setCurrentTime,
  clearPausedSnapshot,
  setIsPlaying
} from './nowPlayingSlice';

export const pauseAndSaveSnapshot = () => (dispatch, getState) => {
  const { nowPlaying } = getState();
  const { currentSong, currentTime, isPlaying } = nowPlaying;

  if (!currentSong) return;

  dispatch(setPausedSnapshot({
    song: currentSong,
    currentTime,
    isPlaying,
  }));

  dispatch(setIsPlaying(false)); // togglePlay() ではダメ！現在が再生中か停止中かわからないので、必ず setIsPlaying(false) を使うこと！
};

export const resumeFromSnapshot = () => (dispatch, getState) => {
  const snapshot = getState().nowPlaying.pausedSnapshot;
  if (!snapshot) return;

  dispatch(setNowPlaying(snapshot.song));
  dispatch(setCurrentTime(snapshot.currentTime));
  if (snapshot.isPlaying) {
    dispatch(togglePlay()); // 再生
  }

  dispatch(clearPausedSnapshot());
};
