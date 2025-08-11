import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config/constants';
import '../css/songList.css';

const SongList = ({ songs = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const wallRef = useRef(null);     // .record-shelf-wall を監視
  const [itemsPerRow, setItemsPerRow] = useState(5); // 初期値

  // 列数を「実レイアウト」から計算
  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;

    let raf = 0;

    const calc = () => {
      const row = wall.querySelector('.record-row');
      const card = wall.querySelector('.record-card');
      if (!row || !card) return;

      const containerWidth = row.clientWidth;
      const rowStyle = getComputedStyle(row);
      const gap = parseFloat(rowStyle.columnGap || rowStyle.gap || '0') || 0;

      const cardWidth = card.getBoundingClientRect().width;
      if (!containerWidth || !cardWidth) return;

      // 列数を安定させるために境界付近を大きく引いておく（誤差補正ではなく意図的に1列少なく見積もる）
      const SAFETY_MARGIN = 50;
      const estimate = Math.floor((containerWidth + gap - SAFETY_MARGIN) / (cardWidth + gap));
      const next = Math.max(1, estimate);

      setItemsPerRow((prev) => (prev !== next ? next : prev));
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(calc);
    };

    const ro = new ResizeObserver(schedule);
    ro.observe(wall); // コンテナ幅の変化を監視（行refが変わっても問題なし）

    // 画像の読み込み後にサイズが変わるケースへの保険
    const imgs = wall.querySelectorAll('img');
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener('load', schedule, { once: true });
    });

    // 初回
    schedule();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      imgs.forEach((img) => img.removeEventListener('load', schedule));
    };
  }, [songs.length]);

  // itemsPerRow に基づいて chunk
  const chunked = useMemo(() => {
    if (!songs?.length) return [];
    const step = Math.max(1, itemsPerRow);
    const out = [];
    for (let i = 0; i < songs.length; i += step) {
      out.push(songs.slice(i, i + step));
    }
    return out;
  }, [songs, itemsPerRow]);

  if (!songs?.length && !id) return <p>No Songs</p>;

  const handleOpenModal = (sid) => {
    navigate(`/songs/modal/${sid}`, { state: { background: location } });
  };

  return (
    <>
      <div className="record-shelf-wall" ref={wallRef}>
        {chunked.map((row, i) => (
          <div className="record-shelf" key={i}>
            <div className="record-shelf-board" />
            <div className="record-row">
              {row.map((song) => (
                <div className="record-card" key={song._id}>
                  {song.imageFile && (
                    <button onClick={() => handleOpenModal(song._id)}>
                      <img
                        src={`${API_BASE_URL}/${song.imageFile}`}
                        alt={song.title}
                        className="song-image"
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SongList;

