import './CartoonShadow.css';

/**
 * Decorative, solid oval. Set --surface-color on the containing section.
 * width/height accept CSS lengths or numbers (pixels); darkness is a percentage.
 * Layout and positioning belong to the parent; style overrides take precedence.
 */
export default function CartoonShadow({
  width = '66%',
  height = '38px',
  darkness = 12,
  className = '',
  style,
}) {
  return <div
    className={`cartoon-shadow${className ? ` ${className}` : ''}`}
    aria-hidden="true"
    style={{ width, height, '--cartoon-shadow-darkness': `${darkness}%`, ...style }}
  />;
}
