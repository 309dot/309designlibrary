import React from 'react';

import { border, colors, radius, shadows, spacing, typography } from '../../style-tokens';

import { Checkbox } from '../Checkbox/Checkbox';
import { Radio } from '../Radio/Radio';

import type {
  TableCellAvatarItem,
  TableCellAvatarTone,
  TableCellBadgeItem,
  TableCellBadgeTone,
  TableCellDirection,
  TableCellProps,
  TableCellSize,
  TableCellType,
} from './TableCell.types';

const palette = colors.primitive.palette;
const textBase = colors.semantic.theme.text.base;

const DEFAULT_LEAD_TITLE = 'Title';
const DEFAULT_LEAD_CAPTION = 'Caption';
const DEFAULT_BADGE_LABEL = 'Badge';

const DEFAULT_BADGES: TableCellBadgeItem[] = [
  { label: 'Badge', tone: 'blue' },
  { label: 'Badge', tone: 'green' },
  { label: '+2', tone: 'gray' },
];

const DEFAULT_AVATARS: TableCellAvatarItem[] = [
  { id: 'avatar-1', label: 'A', tone: 'purple' },
  { id: 'avatar-2', label: 'B', tone: 'orange' },
  { id: 'avatar-3', label: 'C', tone: 'blue' },
  { id: 'avatar-4', label: 'D', tone: 'gray' },
];

const DEFAULT_CHART_POINTS: number[] = [14, 14, 24, 46, 40, 56, 82];
const HUNDRED = spacing.scale['40'] + spacing.scale['40'] + spacing.scale['20'];

type SizeConfig = {
  rowHeight: number;
  textPaddingX: number;
  actionPaddingX: number;
  chartPaddingY: number;

  iconButtonPadding: number;
  iconButtonGap: number;
  iconButtonRadius: number;
  iconSize: number;

  leadAvatarSize: number;
  avatarSize: number;
  leadTextGap: number;

  leadIconPadding: number;
  leadIconSize: number;
  leadIconHasContainer: boolean;
  leadIconContainerBorderWidth: number;

  avatarGroupOverlap: number;
  avatarGroupEndPadding: number;
  avatarOverflowTypography: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: number;
  };
};

const SIZE_CONFIG: Record<TableCellSize, SizeConfig> = {
  lg: {
    rowHeight: spacing.scale['64'],
    textPaddingX: spacing.scale['12'],
    actionPaddingX: spacing.scale['16'],
    chartPaddingY: spacing.scale['12'],

    iconButtonPadding: spacing.scale['8'],
    iconButtonGap: spacing.scale['2'],
    iconButtonRadius: radius.scale.lg,
    iconSize: spacing.scale['16'],

    leadAvatarSize: spacing.scale['40'],
    avatarSize: spacing.scale['40'],
    leadTextGap: spacing.scale['2'],

    leadIconPadding: spacing.scale['12'],
    leadIconSize: spacing.scale['16'],
    leadIconHasContainer: true,
    leadIconContainerBorderWidth: border.width['1'],

    avatarGroupOverlap: spacing.scale['12'],
    avatarGroupEndPadding: spacing.scale['12'],
    avatarOverflowTypography: typography.scale.bodyS.medium,
  },
  md: {
    rowHeight: spacing.scale['48'] + spacing.scale['6'],
    textPaddingX: spacing.scale['12'],
    actionPaddingX: spacing.scale['16'],
    chartPaddingY: spacing.scale['8'],

    iconButtonPadding: spacing.scale['8'],
    iconButtonGap: spacing.scale['2'],
    iconButtonRadius: radius.scale.lg,
    iconSize: spacing.scale['16'],

    leadAvatarSize: spacing.scale['32'],
    avatarSize: spacing.scale['32'],
    leadTextGap: spacing.scale['2'],

    leadIconPadding: spacing.scale['8'],
    leadIconSize: spacing.scale['16'],
    leadIconHasContainer: true,
    leadIconContainerBorderWidth: border.width['1'],

    avatarGroupOverlap: spacing.scale['8'],
    avatarGroupEndPadding: spacing.scale['8'],
    avatarOverflowTypography: typography.scale.captionL.medium,
  },
  sm: {
    rowHeight: spacing.scale['40'],
    textPaddingX: spacing.scale['12'],
    actionPaddingX: spacing.scale['12'],
    chartPaddingY: spacing.scale['8'],

    iconButtonPadding: spacing.primitive['5'],
    iconButtonGap: spacing.scale['0'],
    iconButtonRadius: radius.scale.md,
    iconSize: spacing.scale['14'],

    leadAvatarSize: spacing.scale['24'],
    avatarSize: spacing.scale['20'],
    leadTextGap: spacing.scale['0'],

    leadIconPadding: spacing.scale['2'],
    leadIconSize: spacing.scale['20'],
    leadIconHasContainer: false,
    leadIconContainerBorderWidth: border.width['0'],

    avatarGroupOverlap: spacing.scale['4'],
    avatarGroupEndPadding: spacing.scale['4'],
    avatarOverflowTypography: typography.scale.captionM.medium,
  },
};

const WIDTH_BY_TYPE: Record<TableCellType, Record<TableCellSize, number>> = {
  leadPrimary: {
    lg: spacing.scale['224'] + spacing.scale['56'],
    md: spacing.scale['224'] + spacing.scale['56'],
    sm: spacing.scale['224'] + spacing.scale['56'],
  },
  text: {
    lg: spacing.scale['224'] + spacing.scale['56'],
    md: spacing.scale['224'] + spacing.scale['56'],
    sm: spacing.scale['224'] + spacing.scale['56'],
  },
  button: {
    lg: spacing.scale['64'],
    md: spacing.scale['64'],
    sm: spacing.scale['48'],
  },
  circleCheckbox: {
    lg: spacing.scale['48'] + spacing.scale['4'],
    md: spacing.scale['48'] + spacing.scale['4'],
    sm: spacing.scale['40'] + spacing.scale['4'],
  },
  checkbox: {
    lg: spacing.scale['48'] + spacing.scale['4'],
    md: spacing.scale['48'] + spacing.scale['4'],
    sm: spacing.scale['40'] + spacing.scale['4'],
  },
  radioButton: {
    lg: spacing.scale['48'] + spacing.scale['4'],
    md: spacing.scale['48'] + spacing.scale['4'],
    sm: spacing.scale['40'] + spacing.scale['4'],
  },
  buttonGroup: {
    lg: spacing.scale['80'] + spacing.scale['20'],
    md: spacing.scale['80'] + spacing.scale['20'],
    sm: spacing.scale['72'] + spacing.scale['4'],
  },
  toggle: {
    lg: spacing.scale['56'] + spacing.scale['4'],
    md: spacing.scale['56'] + spacing.scale['4'],
    sm: spacing.scale['48'] + spacing.scale['4'],
  },
  badge: {
    lg: spacing.scale['72'] + spacing.primitive['7'],
    md: spacing.scale['72'] + spacing.primitive['7'],
    sm: spacing.scale['64'] + spacing.primitive['7'],
  },
  badgeGroup: {
    lg: spacing.scale['160'] + spacing.primitive['9'],
    md: spacing.scale['160'] + spacing.primitive['9'],
    sm: spacing.scale['160'] + spacing.primitive['1'],
  },
  avatar: {
    lg: spacing.scale['72'],
    md: spacing.scale['64'],
    sm: spacing.scale['40'] + spacing.scale['4'],
  },
  avatarGroup: {
    lg: spacing.scale['160'] + spacing.scale['24'],
    md: spacing.scale['160'],
    sm: spacing.scale['96'] + spacing.scale['12'],
  },
  progress: {
    lg: spacing.scale['160'] + spacing.scale['20'],
    md: spacing.scale['160'] + spacing.scale['20'],
    sm: spacing.scale['160'] + spacing.scale['20'],
  },
  chart: {
    lg: spacing.scale['160'] + spacing.scale['20'],
    md: spacing.scale['160'] + spacing.scale['20'],
    sm: spacing.scale['160'] + spacing.scale['20'],
  },
};

function toTypographyStyle(token: {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
}) {
  return {
    fontFamily: token.fontFamily,
    fontSize: token.fontSize,
    fontWeight: token.fontWeight,
    lineHeight: `${token.lineHeight}px`,
    letterSpacing: `${token.letterSpacing}px`,
  };
}

function getBadgeToneStyle(tone: TableCellBadgeTone): { backgroundColor: string; color: string } {
  if (tone === 'green') {
    return {
      backgroundColor: palette.green['2'],
      color: palette.green['11'],
    };
  }

  if (tone === 'gray') {
    return {
      backgroundColor: palette.gray['2'],
      color: textBase.staticDarkSecondary,
    };
  }

  return {
    backgroundColor: palette.blue['2'],
    color: palette.blue['11'],
  };
}

function getAvatarToneStyle(tone: TableCellAvatarTone): { backgroundColor: string; color: string } {
  if (tone === 'orange') {
    return { backgroundColor: palette.orange['3'], color: palette.orange['11'] };
  }

  if (tone === 'blue') {
    return { backgroundColor: palette.blue['3'], color: palette.blue['11'] };
  }

  if (tone === 'gray') {
    return { backgroundColor: palette.gray['3'], color: textBase.staticDarkSecondary };
  }

  return { backgroundColor: palette.purple['3'], color: palette.purple['11'] };
}

function getJustifyContent(direction: TableCellDirection): 'flex-start' | 'center' | 'flex-end' {
  if (direction === 'center') {
    return 'center';
  }

  if (direction === 'right') {
    return 'flex-end';
  }

  return 'flex-start';
}

function getCellPaddingX(type: TableCellType, config: SizeConfig): number {
  if (type === 'leadPrimary' || type === 'text') {
    return config.textPaddingX;
  }

  return config.actionPaddingX;
}

function getCellGap(type: TableCellType): number {
  if (type === 'leadPrimary') {
    return spacing.scale['12'];
  }

  if (type === 'buttonGroup') {
    return spacing.scale['4'];
  }

  if (type === 'badgeGroup') {
    return spacing.scale['8'];
  }

  if (type === 'text') {
    return spacing.scale['8'];
  }

  return spacing.scale['8'];
}

function resolveDirectionTextAlignment(direction: TableCellDirection): {
  alignItems: 'flex-start' | 'center' | 'flex-end';
  textAlign: 'left' | 'center' | 'right';
} {
  if (direction === 'center') {
    return { alignItems: 'center', textAlign: 'center' };
  }

  if (direction === 'right') {
    return { alignItems: 'flex-end', textAlign: 'right' };
  }

  return { alignItems: 'flex-start', textAlign: 'left' };
}

function VerticalDotsIcon({ size, color }: { size: number; color: string }) {
  const dotRadius = size / 8;
  const centerX = size / 2;

  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" style={{ width: size, height: size, display: 'block' }}>
      <circle cx={centerX} cy={size * 0.25} r={dotRadius} fill={color} />
      <circle cx={centerX} cy={size * 0.5} r={dotRadius} fill={color} />
      <circle cx={centerX} cy={size * 0.75} r={dotRadius} fill={color} />
    </svg>
  );
}

function RefreshIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" style={{ width: size, height: size, display: 'block' }}>
      <path
        d="M10 3.25C6.272 3.25 3.25 6.272 3.25 10C3.25 13.728 6.272 16.75 10 16.75C12.393 16.75 14.495 15.505 15.694 13.625"
        fill="none"
        stroke={color}
        strokeWidth={border.width['2']}
        strokeLinecap="round"
      />
      <path
        d="M15.75 7.75V3.75H11.75"
        fill="none"
        stroke={color}
        strokeWidth={border.width['2']}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" style={{ width: size, height: size, display: 'block' }}>
      <path
        d="M4.75 5.75H15.25"
        fill="none"
        stroke={color}
        strokeWidth={border.width['2']}
        strokeLinecap="round"
      />
      <path
        d="M7.5 5.75V4.75C7.5 4.198 7.948 3.75 8.5 3.75H11.5C12.052 3.75 12.5 4.198 12.5 4.75V5.75"
        fill="none"
        stroke={color}
        strokeWidth={border.width['2']}
        strokeLinecap="round"
      />
      <path
        d="M6.5 7.75V14.25C6.5 14.802 6.948 15.25 7.5 15.25H12.5C13.052 15.25 13.5 14.802 13.5 14.25V7.75"
        fill="none"
        stroke={color}
        strokeWidth={border.width['2']}
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpinnerIcon({ size }: { size: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" style={{ width: size, height: size, display: 'block' }}>
      <circle cx="10" cy="10" r="6.5" fill="none" stroke={palette.gray['3']} strokeWidth={border.width['2']} />
      <path
        d="M10 3.5C12.45 3.5 14.582 4.854 15.683 6.852"
        fill="none"
        stroke={palette.gray['7']}
        strokeWidth={border.width['2']}
        strokeLinecap="round"
      />
    </svg>
  );
}

function CircleCheckboxIcon({ size, checked }: { size: number; checked: boolean }) {
  const strokeColor = checked ? palette.green['8'] : palette.gray['8'];

  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" style={{ width: size, height: size, display: 'block' }}>
      <circle cx="10" cy="10" r="7" fill="none" stroke={strokeColor} strokeWidth={border.width['2']} />
      <path
        d="M6.5 10.5L9 13L13.5 8.5"
        fill="none"
        stroke={strokeColor}
        strokeWidth={border.width['2']}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconButton({
  padding,
  radiusValue,
  disabled,
  onClick,
  icon,
  gap,
}: {
  padding: number;
  radiusValue: number;
  disabled: boolean;
  onClick?: () => void;
  icon: React.ReactNode;
  gap: number;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={!disabled ? onClick : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap,
        padding,
        borderStyle: 'solid',
        borderWidth: border.width['0'],
        borderRadius: radiusValue,
        backgroundColor: palette.base.transparent,
        color: textBase.staticDarkSecondary,
        cursor: disabled || !onClick ? 'default' : 'pointer',
      }}
    >
      {icon}
    </button>
  );
}

function AvatarItem({
  size,
  label,
  tone = 'gray',
  imageSrc,
}: {
  size: number;
  label: string;
  tone?: TableCellAvatarTone;
  imageSrc?: string;
}) {
  const toneStyle = getAvatarToneStyle(tone);

  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: radius.scale.full,
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: toneStyle.backgroundColor,
        color: toneStyle.color,
        flexShrink: 0,
      }}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        <span
          style={{
            ...toTypographyStyle(size >= spacing.scale['32'] ? typography.scale.captionL.medium : typography.scale.captionM.medium),
            lineHeight: `${size}px`,
          }}
        >
          {label}
        </span>
      )}
    </span>
  );
}

function renderChart(points: number[]) {
  const normalized = points.length >= 2 ? points : DEFAULT_CHART_POINTS;
  const clamped = normalized.map((point) => Math.max(spacing.scale['0'], Math.min(HUNDRED, point)));
  const step = 100 / (clamped.length - 1);

  const linePoints = clamped
    .map((point, index) => `${(index * step).toFixed(2)},${(100 - point).toFixed(2)}`)
    .join(' ');

  const areaPoints = `0,100 ${linePoints} 100,100`;

  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <polygon points={areaPoints} fill={palette.blue['2']} />
      <polyline
        points={linePoints}
        fill="none"
        stroke={palette.blue['8']}
        strokeWidth={border.width['2']}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function renderTextBlock({
  title,
  caption,
  showCaption,
  direction,
  stretched,
}: {
  title: string;
  caption: string;
  showCaption: boolean;
  direction: TableCellDirection;
  stretched: boolean;
}) {
  const directionStyle = resolveDirectionTextAlignment(direction);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: directionStyle.alignItems,
        justifyContent: 'center',
        gap: showCaption ? spacing.scale['2'] : spacing.scale['0'],
        minWidth: spacing.scale['0'],
        minHeight: spacing.scale['0'],
        flex: stretched ? '1 0 0' : undefined,
        textAlign: directionStyle.textAlign,
      }}
    >
      <span
        style={{
          ...toTypographyStyle(typography.scale.captionL.regular),
          color: textBase.staticDark,
          width: stretched ? '100%' : 'auto',
        }}
      >
        {title}
      </span>
      {showCaption ? (
        <span
          style={{
            ...toTypographyStyle(typography.scale.captionM.regular),
            color: textBase.staticDarkSecondary,
            width: stretched ? '100%' : 'auto',
          }}
        >
          {caption}
        </span>
      ) : null}
    </div>
  );
}

export function TableCell({
  id,
  className,
  style,
  type = 'text',
  size = 'md',
  direction = 'left',
  disabled = false,

  title = DEFAULT_LEAD_TITLE,
  caption = DEFAULT_LEAD_CAPTION,
  showCaption,

  showLeadIcon = false,
  showTailButton = true,
  showAvatar = true,
  leadIcon,
  tailIcon,

  checked = false,
  radioChecked = false,
  toggleChecked = false,
  onCheckedChange,
  onRadioCheckedChange,
  onToggleCheckedChange,

  buttonIcon,
  buttonGroupPrimaryIcon,
  buttonGroupSecondaryIcon,

  badgeLabel = DEFAULT_BADGE_LABEL,
  badges,

  avatarLabel = 'A',
  avatarSrc,
  avatars,
  avatarOverflowLabel = '+5',

  progressValue = spacing.scale['48'] + spacing.scale['2'],
  progressLabel,
  chartPoints,
}: TableCellProps) {
  const config = SIZE_CONFIG[size];
  const rowHeight = config.rowHeight;
  const rowWidth = WIDTH_BY_TYPE[type][size];
  const cellPaddingX = getCellPaddingX(type, config);
  const justifyContent = getJustifyContent(direction);
  const resolvedProgress = Math.max(spacing.scale['0'], Math.min(HUNDRED, progressValue));

  const resolvedShowCaption = (() => {
    if (typeof showCaption === 'boolean') {
      return showCaption;
    }

    if (type === 'leadPrimary' || type === 'text') {
      return size !== 'sm';
    }

    return false;
  })();

  const content = (() => {
    if (type === 'leadPrimary') {
      const leadTextTypography = typography.scale.captionL.medium;
      const leadCaptionTypography = typography.scale.captionM.regular;

      return (
        <>
          {showLeadIcon ? (
            <span
              aria-hidden="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: config.leadIconPadding,
                borderStyle: 'solid',
                borderWidth: config.leadIconContainerBorderWidth,
                borderColor: config.leadIconHasContainer ? palette.gray['2a'] : palette.base.transparent,
                borderRadius: config.leadIconHasContainer ? radius.scale.full : radius.scale['0'],
                backgroundColor: palette.base.white,
                flexShrink: spacing.scale['0'],
              }}
            >
              {leadIcon ?? <VerticalDotsIcon size={config.leadIconSize} color={textBase.staticDarkSecondary} />}
            </span>
          ) : null}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.scale['8'],
              minWidth: spacing.scale['0'],
              minHeight: spacing.scale['0'],
              flex: direction === 'left' ? '1 0 0' : undefined,
            }}
          >
            {showAvatar ? (
              <AvatarItem size={config.leadAvatarSize} label={avatarLabel} imageSrc={avatarSrc} tone="gray" />
            ) : null}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                gap: config.leadTextGap,
                minWidth: spacing.scale['0'],
                minHeight: spacing.scale['0'],
                flex: direction === 'left' ? '1 0 0' : undefined,
              }}
            >
              <span
                style={{
                  ...toTypographyStyle(leadTextTypography),
                  color: textBase.staticDark,
                  width: direction === 'left' ? '100%' : 'auto',
                }}
              >
                {title}
              </span>
              {resolvedShowCaption ? (
                <span
                  style={{
                    ...toTypographyStyle(leadCaptionTypography),
                    color: textBase.staticDarkSecondary,
                    width: direction === 'left' ? '100%' : 'auto',
                  }}
                >
                  {caption}
                </span>
              ) : null}
            </div>
          </div>

          {showTailButton ? (
            <IconButton
              padding={config.iconButtonPadding}
              radiusValue={config.iconButtonRadius}
              disabled={disabled}
              onClick={undefined}
              icon={tailIcon ?? <VerticalDotsIcon size={config.iconSize} color={textBase.staticDarkSecondary} />}
              gap={config.iconButtonGap}
            />
          ) : null}
        </>
      );
    }

    if (type === 'text') {
      return renderTextBlock({
        title,
        caption,
        showCaption: resolvedShowCaption,
        direction,
        stretched: true,
      });
    }

    if (type === 'button') {
      return (
        <IconButton
          padding={config.iconButtonPadding}
          radiusValue={config.iconButtonRadius}
          disabled={disabled}
          onClick={undefined}
          icon={buttonIcon ?? <VerticalDotsIcon size={config.iconSize} color={textBase.staticDarkSecondary} />}
          gap={config.iconButtonGap}
        />
      );
    }

    if (type === 'circleCheckbox') {
      return (
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          aria-disabled={disabled || undefined}
          disabled={disabled}
          onClick={!disabled && onCheckedChange ? () => onCheckedChange(!checked) : undefined}
          style={{
            width: spacing.scale['20'],
            height: spacing.scale['20'],
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing.scale['0'],
            borderStyle: 'solid',
            borderWidth: border.width['0'],
            borderRadius: radius.scale.full,
            backgroundColor: palette.base.transparent,
            cursor: disabled || !onCheckedChange ? 'default' : 'pointer',
          }}
        >
          <CircleCheckboxIcon size={spacing.scale['20']} checked={checked} />
        </button>
      );
    }

    if (type === 'checkbox') {
      return (
        <span
          style={{
            width: spacing.scale['20'],
            height: spacing.scale['20'],
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: spacing.scale['0'],
          }}
        >
          <Checkbox
            size="sm"
            checked={checked}
            disabled={disabled}
            onCheckedChange={onCheckedChange}
            ariaLabel="Table cell checkbox"
          />
        </span>
      );
    }

    if (type === 'radioButton') {
      return (
        <span
          style={{
            width: spacing.scale['20'],
            height: spacing.scale['20'],
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: spacing.scale['0'],
          }}
        >
          <Radio
            size="sm"
            checked={radioChecked}
            disabled={disabled}
            onCheckedChange={onRadioCheckedChange}
            ariaLabel="Table cell radio"
          />
        </span>
      );
    }

    if (type === 'buttonGroup') {
      return (
        <>
          <IconButton
            padding={config.iconButtonPadding}
            radiusValue={config.iconButtonRadius}
            disabled={disabled}
            onClick={undefined}
            icon={buttonGroupPrimaryIcon ?? <RefreshIcon size={config.iconSize} color={textBase.staticDarkSecondary} />}
            gap={config.iconButtonGap}
          />
          <IconButton
            padding={config.iconButtonPadding}
            radiusValue={config.iconButtonRadius}
            disabled={disabled}
            onClick={undefined}
            icon={buttonGroupSecondaryIcon ?? <TrashIcon size={config.iconSize} color={textBase.staticDarkSecondary} />}
            gap={config.iconButtonGap}
          />
        </>
      );
    }

    if (type === 'toggle') {
      const handleSize = spacing.scale['12'];
      const trackPaddingStart = spacing.scale['2'];
      const trackPaddingEnd = spacing.scale['14'];
      const trackPaddingBlock = spacing.scale['2'];

      return (
        <button
          type="button"
          role="switch"
          aria-checked={toggleChecked}
          aria-disabled={disabled || undefined}
          disabled={disabled}
          onClick={!disabled && onToggleCheckedChange ? () => onToggleCheckedChange(!toggleChecked) : undefined}
          style={{
            display: 'inline-flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            paddingLeft: toggleChecked ? trackPaddingEnd : trackPaddingStart,
            paddingRight: toggleChecked ? trackPaddingStart : trackPaddingEnd,
            paddingBlock: trackPaddingBlock,
            borderStyle: 'solid',
            borderWidth: border.width['0'],
            borderRadius: radius.scale.full,
            backgroundColor: toggleChecked ? palette.green['8'] : palette.gray['5'],
            cursor: disabled || !onToggleCheckedChange ? 'default' : 'pointer',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: handleSize,
              height: handleSize,
              borderRadius: radius.scale.full,
              backgroundColor: palette.base.white,
              boxShadow: shadows.elevation.xs.css,
              display: 'block',
              flexShrink: spacing.scale['0'],
            }}
          />
        </button>
      );
    }

    if (type === 'badge') {
      const badgeTone = getBadgeToneStyle('blue');

      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingInline: spacing.primitive['3'],
            paddingBlock: spacing.scale['2'],
            borderRadius: radius.scale.sm,
            backgroundColor: badgeTone.backgroundColor,
            color: badgeTone.color,
          }}
        >
          <span style={toTypographyStyle(typography.scale.captionM.medium)}>{badgeLabel}</span>
        </span>
      );
    }

    if (type === 'badgeGroup') {
      const items = badges && badges.length > 0 ? badges : DEFAULT_BADGES;

      return (
        <>
          {items.map((item, index) => {
            const toneStyle = getBadgeToneStyle(item.tone ?? 'blue');

            return (
              <span
                key={`${item.label}-${index}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingInline: spacing.primitive['3'],
                  paddingBlock: spacing.scale['2'],
                  borderRadius: radius.scale.sm,
                  backgroundColor: toneStyle.backgroundColor,
                  color: toneStyle.color,
                }}
              >
                <span style={toTypographyStyle(typography.scale.captionM.medium)}>{item.label}</span>
              </span>
            );
          })}
        </>
      );
    }

    if (type === 'avatar') {
      return (
        <AvatarItem
          size={config.avatarSize}
          label={avatarLabel}
          tone="gray"
          imageSrc={avatarSrc}
        />
      );
    }

    if (type === 'avatarGroup') {
      const items = avatars && avatars.length > 0 ? avatars : DEFAULT_AVATARS;

      return (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'flex-start',
            paddingLeft: spacing.scale['0'],
            paddingRight: config.avatarGroupEndPadding,
            paddingBlock: spacing.scale['0'],
          }}
        >
          {items.map((item) => (
            <span
              key={item.id}
              style={{
                width: config.avatarSize,
                height: config.avatarSize,
                borderRadius: radius.scale.full,
                borderStyle: 'solid',
                borderWidth: border.width['2'],
                borderColor: palette.base.white,
                marginRight: -config.avatarGroupOverlap,
                overflow: 'hidden',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: spacing.scale['0'],
              }}
            >
              <AvatarItem
                size={config.avatarSize}
                label={item.label ?? 'A'}
                tone={item.tone ?? 'gray'}
                imageSrc={item.imageSrc}
              />
            </span>
          ))}

          <span
            style={{
              width: config.avatarSize,
              height: config.avatarSize,
              borderRadius: radius.scale.full,
              borderStyle: 'solid',
              borderWidth: border.width['2'],
              borderColor: palette.base.white,
              marginRight: -config.avatarGroupOverlap,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: palette.orange['2'],
              color: palette.orange['11'],
              flexShrink: spacing.scale['0'],
            }}
          >
            <span style={toTypographyStyle(config.avatarOverflowTypography)}>{avatarOverflowLabel}</span>
          </span>
        </div>
      );
    }

    if (type === 'progress') {
      const resolvedLabel = progressLabel ?? `${Math.round(resolvedProgress)}%`;

      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.scale['12'],
            minWidth: spacing.scale['0'],
            minHeight: spacing.scale['0'],
            flex: '1 0 0',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              height: spacing.scale['8'],
              borderRadius: radius.scale.full,
              backgroundColor: palette.gray['2'],
              overflow: 'hidden',
              minWidth: spacing.scale['0'],
              flex: '1 0 0',
            }}
          >
            <span
              style={{
                display: 'block',
                width: `${resolvedProgress}%`,
                height: '100%',
                borderRadius: radius.scale.full,
                backgroundColor: palette.green['8'],
              }}
            />
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: spacing.scale['4'],
              minHeight: spacing.scale['24'],
              paddingBlock: spacing.scale['2'],
            }}
          >
            <span style={{ ...toTypographyStyle(typography.scale.captionL.regular), color: textBase.staticDark }}>{resolvedLabel}</span>
            <SpinnerIcon size={spacing.scale['16']} />
          </span>
        </div>
      );
    }

    return (
      <div style={{ width: '100%', height: '100%', minWidth: spacing.scale['0'], minHeight: spacing.scale['0'] }}>
        {renderChart(chartPoints ?? DEFAULT_CHART_POINTS)}
      </div>
    );
  })();

  return (
    <div
      id={id}
      className={className}
      style={{
        width: rowWidth,
        height: rowHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent,
        gap: getCellGap(type),
        paddingInline: cellPaddingX,
        paddingBlock: type === 'chart' ? config.chartPaddingY : spacing.scale['0'],
        borderBottomStyle: 'solid',
        borderBottomWidth: border.width['1'],
        borderBottomColor: palette.gray['2'],
        backgroundColor: palette.base.white,
        boxSizing: 'border-box',
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
      aria-disabled={disabled || undefined}
    >
      {content}
    </div>
  );
}
