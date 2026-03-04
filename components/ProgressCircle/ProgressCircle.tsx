import { colors, shadows, spacing, typography } from '../../style-tokens';

import type { ProgressCircleColor, ProgressCircleInteractionState, ProgressCircleProps, ProgressCircleSize } from './ProgressCircle.types';

type SizeConfig = {
  circleSize: number;
  strokeWidth: number;
  labelWidth: number;
  showLabelByDefault: boolean;
};

const palette = colors.primitive.palette;
const textBase = colors.semantic.theme.text.base;

const PROGRESS_MIN = spacing.scale['0'];
const PROGRESS_MAX = spacing.scale['10'] * spacing.scale['10'];

const SIZE_CONFIG: Record<ProgressCircleSize, SizeConfig> = {
  xs: {
    circleSize: spacing.scale['32'],
    strokeWidth: spacing.scale['4'],
    labelWidth: spacing.scale['0'],
    showLabelByDefault: false,
  },
  sm: {
    circleSize: spacing.scale['64'] + spacing.scale['4'],
    strokeWidth: spacing.scale['4'],
    labelWidth: spacing.scale['64'],
    showLabelByDefault: true,
  },
  md: {
    circleSize: spacing.scale['96'],
    strokeWidth: spacing.scale['8'],
    labelWidth: spacing.scale['64'],
    showLabelByDefault: true,
  },
  lg: {
    circleSize: spacing.scale['120'],
    strokeWidth: spacing.scale['8'],
    labelWidth: spacing.scale['64'],
    showLabelByDefault: true,
  },
};

const COLOR_TO_STROKE: Record<ProgressCircleColor, string> = {
  green: palette.green['8'],
  purple: palette.purple['8'],
  red: palette.red['8'],
};

function clampProgress(value: number): number {
  return Math.max(PROGRESS_MIN, Math.min(PROGRESS_MAX, value));
}

function withFocusRing(interactionState: ProgressCircleInteractionState): string {
  if (interactionState !== 'focus') {
    return 'none';
  }

  return shadows.focusRing.light.css;
}

export function ProgressCircle({
  size = 'md',
  color = 'green',
  interactionState = 'default',
  progressValue = spacing.scale['50'],
  showLabel,
  label,
  className,
  style,
  ...props
}: ProgressCircleProps) {
  const config = SIZE_CONFIG[size];
  const disabled = interactionState === 'disabled';
  const progress = clampProgress(progressValue);

  const radius = (config.circleSize - config.strokeWidth) / spacing.scale['2'];
  const circumference = spacing.scale['2'] * Math.PI * radius;
  const dashOffset = circumference - (progress / PROGRESS_MAX) * circumference;

  const trackColor = palette.gray['2'];
  const fillColor = disabled ? palette.gray['4'] : COLOR_TO_STROKE[color];
  const shouldShowLabel = typeof showLabel === 'boolean' ? showLabel : config.showLabelByDefault;
  const progressText = label ?? `${Math.round(progress)}%`;

  return (
    <div
      className={className}
      role="progressbar"
      aria-valuemin={PROGRESS_MIN}
      aria-valuemax={PROGRESS_MAX}
      aria-valuenow={Math.round(progress)}
      aria-label={progressText}
      style={{
        width: config.circleSize,
        height: config.circleSize,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: withFocusRing(interactionState),
        ...style,
      }}
      {...props}
    >
      <svg
        width={config.circleSize}
        height={config.circleSize}
        viewBox={`0 0 ${config.circleSize} ${config.circleSize}`}
        style={{
          display: 'block',
          transform: `rotate(-${spacing.scale['80'] + spacing.scale['10']}deg)`,
        }}
        aria-hidden="true"
      >
        <circle
          cx={config.circleSize / spacing.scale['2']}
          cy={config.circleSize / spacing.scale['2']}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={config.strokeWidth}
        />
        <circle
          cx={config.circleSize / spacing.scale['2']}
          cy={config.circleSize / spacing.scale['2']}
          r={radius}
          fill="none"
          stroke={fillColor}
          strokeWidth={config.strokeWidth}
          strokeLinecap={progress <= PROGRESS_MIN ? 'butt' : 'round'}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transitionProperty: 'stroke-dashoffset, stroke',
            transitionDuration: `${spacing.scale['160']}ms`,
            transitionTimingFunction: 'linear',
          }}
        />
      </svg>

      {shouldShowLabel ? (
        <span
          style={{
            position: 'absolute',
            width: config.labelWidth,
            left: `calc(50% - ${config.labelWidth / spacing.scale['2']}px)`,
            top: `calc(50% - ${typography.scale.captionL.medium.lineHeight / spacing.scale['2']}px)`,
            color: disabled ? textBase.staticDarkQuaternary : textBase.staticDark,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            ...{
              fontFamily: typography.scale.captionL.medium.fontFamily,
              fontSize: typography.scale.captionL.medium.fontSize,
              fontWeight: typography.scale.captionL.medium.fontWeight,
              lineHeight: `${typography.scale.captionL.medium.lineHeight}px`,
              letterSpacing: `${typography.scale.captionL.medium.letterSpacing}px`,
            },
          }}
        >
          {progressText}
        </span>
      ) : null}
    </div>
  );
}
