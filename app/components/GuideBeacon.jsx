import React from 'react';

export default function GuideBeacon({
  text,
  position = 'top',
  show = true,
  pulse = true,
  children
}) {
  if (!show) return <>{children}</>;

  return (
    <div className="rf-guide-beacon-wrap" style={{ position: 'relative', display: 'inline-flex' }}>
      {children}
      {pulse && <div className="rf-beacon-pulse-ring" />}
      {text && (
        <div className={`rf-guide-hint-tooltip ${position}`}>
          <span className="rf-beacon-dot" />
          <span>{text}</span>
        </div>
      )}
    </div>
  );
}
