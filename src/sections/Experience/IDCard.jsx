import { Component, lazy, Suspense, useRef } from 'react';
import useSceneVisibility from '../../common/useSceneVisibility';
import frontImage from '../../assets/lanyard/front.svg';
import backImage from '../../assets/lanyard/back.svg';
import bandImage from '../../assets/lanyard/band.svg';
import styles from './IDCard.module.css';

const Lanyard = lazy(() => import('../../common/Lanyard/Lanyard'));

function CardPreview() {
  return <img className={styles.preview} src={frontImage} loading="lazy" decoding="async" width="512" height="774" alt="Fahru Rojak — IT Support & Web Developer. Open to work." />;
}

class CardBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <CardPreview /> : this.props.children; }
}

export default function IDCard() {
  const stage = useRef(null);
  const { ready, active } = useSceneVisibility(stage);
  return (
    <figure className={styles.lanyardContainer}>
      <div className={styles.stage} ref={stage}>
        <CardBoundary>
          <Suspense fallback={<CardPreview />}>
            {ready ? <Lanyard active={active} position={[0, 0, 14.5]} frontImage={frontImage} backImage={backImage}
              lanyardImage={bandImage} lanyardWidth={1} showStatus fallback={<CardPreview />} /> : <CardPreview />}
          </Suspense>
        </CardBoundary>
      </div>
    </figure>
  );
}
