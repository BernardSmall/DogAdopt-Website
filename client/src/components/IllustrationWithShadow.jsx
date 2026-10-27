import CartoonShadow from './CartoonShadow';
import './IllustrationWithShadow.css';

const baseShadow = { width: '72%', height: '14%', top: '80%', left: '50%', darkness: 12 };
const frontShadow = { width: '40%', height: '10%', top: '91%', left: '50%', darkness: 12 };

function GroundShadow({ settings, className }) {
  return <CartoonShadow
    className={className}
    width={settings.width}
    height={settings.height}
    darkness={settings.darkness}
    style={{ top: settings.top, left: settings.left }}
  />;
}

/**
 * Two approved flat ovals behind an untouched, naturally proportioned image.
 * Shadow dimensions and top/left offsets are relative to the image canvas.
 * Set --surface-color on the parent, or pass surfaceColor to match its background.
 */
export default function IllustrationWithShadow({
  src,
  alt,
  imageWidth,
  imageHeight,
  width = '100%',
  surfaceColor,
  largeShadow = {},
  smallShadow = {},
  className = '',
}) {
  return <div
    className={`illustration-with-shadow${className ? ` ${className}` : ''}`}
    style={{ width, ...(surfaceColor ? { '--surface-color': surfaceColor } : {}) }}
  >
    <div className="illustration-with-shadow__canvas">
      <GroundShadow className="illustration-with-shadow__base" settings={{ ...baseShadow, ...largeShadow }}/>
      <GroundShadow className="illustration-with-shadow__front" settings={{ ...frontShadow, ...smallShadow }}/>
      <img className="illustration-with-shadow__image" src={src} alt={alt} width={imageWidth} height={imageHeight} loading="lazy"/>
    </div>
  </div>;
}
