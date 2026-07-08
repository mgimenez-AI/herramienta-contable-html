import { useHoverStyle } from '../utils/useHoverStyle';

export function Hoverable({ as: As = 'div', style, hoverStyle, children, ...rest }) {
  const hoverProps = useHoverStyle(style, hoverStyle);
  return (
    <As {...rest} style={hoverProps.style} onMouseEnter={hoverProps.onMouseEnter} onMouseLeave={hoverProps.onMouseLeave}>
      {children}
    </As>
  );
}
