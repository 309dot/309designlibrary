import { colors, radius, shadows, spacing, typography } from '../../style-tokens';

import type {
  ProgressBarColor,
  ProgressBarDirection,
  ProgressBarInteractionState,
  ProgressBarProps,
  ProgressBarSize,
  ProgressBarTarget,
} from './ProgressBar.types';

type TypographyToken = {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
};

const TAIL_ICON_DEFAULT_SRC = '/components/ProgressBar/assets/tail-icon-default.svg';
const HELPER_ICON_DEFAULT_SRC = '/components/ProgressBar/assets/helper-icon-default.svg';
const HELPER_ICON_DESTRUCTIVE_SRC = '/components/ProgressBar/assets/helper-icon-destructive.svg';

const palette = colors.primitive.palette;
const textBase = colors.semantic.theme.text.base;
const textStatus = colors.semantic.theme.text.status;

const PROGRESS_MIN = spacing.scale['0'];
const PROGRESS_MAX = spacing.scale['10'] * spacing.scale['10'];

const SIZE_TO_LINE_HEIGHT: Record<ProgressBarSize, number> = {
  sm: spacing.scale['4'],
  md: spacing.scale['8'],
  lg: spacing.scale['12'],
};

const COLOR_TO_FILL: Record<ProgressBarColor, string> = {
  green: palette.green['8'],
  blue: palette.blue['8'],
  red: palette.red['8'],
  orange: palette.orange['8'],
  purple: palette.purple['8'],
};

function toTypographyStyle(token: TypographyToken) {
  return {
    fontFamily: token.fontFamily,
    fontSize: token.fontSize,
    fontWeight: token.fontWeight,
    lineHeight: `${token.lineHeight}px`,
    letterSpacing: `${token.letterSpacing}px`,
  };
}

function clampProgress(value: number): number {
  return Math.max(PROGRESS_MIN, Math.min(PROGRESS_MAX, value));
}

function resolveColor(target: ProgressBarTarget, color: ProgressBarColor | undefined): ProgressBarColor {
  if (color) {
    return color;
  }

  return target === 'destructive' ? 'red' : 'green';
}

function resolveShowProgressState(
  showProgressState: boolean | undefined,
  target: ProgressBarTarget,
): boolean {
  if (typeof showProgressState === 'boolean') {
    return showProgressState;
  }

  return target === 'default';
}

function resolveShowHelper(
  showHelper: boolean | undefined,
  direction: ProgressBarDirection,
): boolean {
  if (typeof showHelper === 'boolean') {
    return showHelper;
  }

  return direction === 'vertical';
}

function withFocusRing(interactionState: ProgressBarInteractionState): string {
  if (interactionState !== 'focus') {
    return 'none';
  }

  return shadows.focusRing.light.css;
}

function TailIcon({ disabled }: { disabled: boolean }) {
  return (
    <img
      src={TAIL_ICON_DEFAULT_SRC}
      alt=""
      aria-hidden="true"
      style={{
        width: spacing.scale['16'],
        height: spacing.scale['16'],
        display: 'block',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    />
  );
}

function HelperIcon({ destructive, disabled }: { destructive: boolean; disabled: boolean }) {
  return (
    <img
      src={destructive ? HELPER_ICON_DESTRUCTIVE_SRC : HELPER_ICON_DEFAULT_SRC}
      alt=""
      aria-hidden="true"
      style={{
        width: spacing.scale['16'],
        height: spacing.scale['16'],
        display: 'block',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    />
  );
}

function ShimmerOverlay({
  enabled,
  disabled,
}: {
  enabled: boolean;
  disabled: boolean;
}) {
  if (!enabled || disabled) {
    return null;
  }

  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: spacing.scale['0'],
        backgroundImage: `linear-gradient(90deg, ${palette.base.transparent} 0%, ${palette.white['8']} 50%, ${palette.base.transparent} 100%)`,
        backgroundSize: `${spacing.scale['40']}px 100%`,
        animationName: 'progress-bar-shimmer',
        animationDuration: `${spacing.scale['160'] * spacing.scale['10']}ms`,
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
      }}
    />
  );
}

export function ProgressBar({
  direction = 'vertical',
  target = 'default',
  size = 'md',
  color,
  interactionState = 'default',
  progressValue = spacing.scale['50'],
  width = spacing.scale['400'],
  label = 'Label',
  optionalLabel = '(optional)',
  helperText = 'Helper text',
  showLabel = true,
  showOptionalLabel = true,
  showProgressState,
  showTailIcon,
  showHelper,
  shimmering = false,
  valueText,
  className,
  style,
  ...props
}: ProgressBarProps) {
  const resolvedColor = resolveColor(target, color);
  const isDestructive = target === 'destructive';
  const disabled = interactionState === 'disabled';
  const lineHeight = SIZE_TO_LINE_HEIGHT[size];
  const progress = clampProgress(progressValue);
  const fillColor = disabled ? palette.gray['4'] : COLOR_TO_FILL[resolvedColor];
  const resolvedShowProgressState = resolveShowProgressState(showProgressState, target);
  const resolvedShowTailIcon = typeof showTailIcon === 'boolean' ? showTailIcon : resolvedShowProgressState;
  const resolvedShowHelper = resolveShowHelper(showHelper, direction);
  const helperColor = isDestructive ? textStatus.destructive : textBase.staticDarkTertiary;
  const optionalColor = disabled ? textBase.staticDarkQuaternary : textBase.staticDarkTertiary;
  const primaryTextColor = disabled ? textBase.staticDarkQuaternary : textBase.staticDark;
  const progressText = valueText ?? `${Math.round(progress)}%`;

  return (
    <div
      role="progressbar"
      aria-valuemin={PROGRESS_MIN}
      aria-valuemax={PROGRESS_MAX}
      aria-valuenow={Math.round(progress)}
      aria-label={label}
      className={className}
      style={{
        width,
        display: 'inline-flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        alignItems: direction === 'vertical' ? 'flex-start' : 'center',
        gap: direction === 'vertical' ? spacing.scale['8'] : spacing.scale['12'],
        boxSizing: 'border-box',
        boxShadow: withFocusRing(interactionState),
        ...style,
      }}
      {...props}
    >
      <style>{`@keyframes progress-bar-shimmer {0% {background-position: -${spacing.scale['40']}px 0;} 100% {background-position: ${spacing.scale['40']}px 0;}}`}</style>

      {showLabel ? (
        <div
          style={{
            width: direction === 'vertical' ? '100%' : 'auto',
            minHeight: spacing.scale['24'],
            display: 'inline-flex',
            alignItems: 'flex-start',
            justifyContent: direction === 'vertical' ? 'space-between' : 'flex-start',
            gap: direction === 'vertical' ? spacing.scale['8'] : spacing.scale['0'],
            flexShrink: 0,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.scale['4'],
              paddingInline: spacing.scale['0'],
              paddingBlock: spacing.scale['2'],
            }}
          >
            <span
              style={{
                color: primaryTextColor,
                whiteSpace: 'nowrap',
                ...toTypographyStyle(typography.scale.captionL.medium),
              }}
            >
              {label}
            </span>

            {showOptionalLabel ? (
              <span
                style={{
                  color: optionalColor,
                  whiteSpace: 'nowrap',
                  ...toTypographyStyle(typography.scale.captionL.medium),
                }}
              >
                {optionalLabel}
              </span>
            ) : null}
          </span>

          {direction === 'vertical' && resolvedShowProgressState ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: spacing.scale['4'],
                paddingInline: spacing.scale['0'],
                paddingBlock: spacing.scale['2'],
              }}
            >
              <span
                style={{
                  color: primaryTextColor,
                  whiteSpace: 'nowrap',
                  ...toTypographyStyle(typography.scale.captionL.regular),
                }}
              >
                {progressText}
              </span>
              {resolvedShowTailIcon ? <TailIcon disabled={disabled} /> : null}
            </span>
          ) : null}
        </div>
      ) : null}

      {direction === 'horizontal' ? (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing.scale['12'],
            width: showLabel ? 'auto' : '100%',
            flex: showLabel ? undefined : '1 0 0',
            minWidth: showLabel ? undefined : spacing.scale['0'],
          }}
        >
          <div
            style={{
              height: lineHeight,
              borderRadius: radius.scale.full,
              backgroundColor: palette.gray['2'],
              overflow: 'hidden',
              position: 'relative',
              flex: '1 0 0',
              minWidth: spacing.scale['0'],
            }}
          >
            <span
              style={{
                position: 'absolute',
                insetBlock: spacing.scale['0'],
                insetInlineStart: spacing.scale['0'],
                width: `${progress}%`,
                borderRadius: radius.scale.full,
                backgroundColor: fillColor,
                transitionProperty: 'width',
                transitionDuration: `${spacing.scale['160']}ms`,
                transitionTimingFunction: 'linear',
                overflow: 'hidden',
              }}
            >
              <ShimmerOverlay enabled={shimmering} disabled={disabled} />
            </span>
          </div>

          {resolvedShowProgressState ? (
            <span
              style={{
                minHeight: spacing.scale['24'],
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: spacing.scale['4'],
                paddingInline: spacing.scale['0'],
                paddingBlock: spacing.scale['2'],
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  color: primaryTextColor,
                  whiteSpace: 'nowrap',
                  ...toTypographyStyle(typography.scale.captionL.regular),
                }}
              >
                {progressText}
              </span>
              {resolvedShowTailIcon ? <TailIcon disabled={disabled} /> : null}
            </span>
          ) : null}
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            height: lineHeight,
            borderRadius: radius.scale.full,
            backgroundColor: palette.gray['2'],
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <span
            style={{
              position: 'absolute',
              insetBlock: spacing.scale['0'],
              insetInlineStart: spacing.scale['0'],
              width: `${progress}%`,
              borderRadius: radius.scale.full,
              backgroundColor: fillColor,
              transitionProperty: 'width',
              transitionDuration: `${spacing.scale['160']}ms`,
              transitionTimingFunction: 'linear',
              overflow: 'hidden',
            }}
          >
            <ShimmerOverlay enabled={shimmering} disabled={disabled} />
          </span>
        </div>
      )}

      {resolvedShowHelper ? (
        <span
          style={{
            width: '100%',
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing.scale['4'],
            paddingInline: spacing.scale['0'],
            paddingBlock: spacing.scale['2'],
          }}
        >
          <HelperIcon destructive={isDestructive} disabled={disabled} />
          <span
            style={{
              color: disabled ? textBase.staticDarkQuaternary : helperColor,
              whiteSpace: 'nowrap',
              ...toTypographyStyle(typography.scale.captionL.regular),
            }}
          >
            {helperText}
          </span>
        </span>
      ) : null}
    </div>
  );
}
