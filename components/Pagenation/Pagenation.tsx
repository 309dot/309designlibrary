import { border, colors, radius, shadows, spacing, typography } from '../../style-tokens';

import type { PagenationInteractionState, PagenationNumberItem, PagenationProps, PagenationSize, PagenationType } from './Pagenation.types';

type TypographyToken = {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
};

type SizeConfig = {
  iconSize: number;
  iconPadding: number;
  iconGap: number;
  numberItemSize: number;
  numberRadius: number;
  numberTypography: TypographyToken;
  buttonPaddingX: number;
  buttonPaddingY: number;
  buttonGap: number;
  buttonRadius: number;
  buttonTypography: TypographyToken;
  numbersContainerWidth: number;
};

const ARROW_LEFT_ICON_MD_SRC = '/components/Pagenation/assets/arrow-left-md.svg';
const ARROW_RIGHT_ICON_MD_SRC = '/components/Pagenation/assets/arrow-right-md.svg';
const ARROW_LEFT_ICON_SM_SRC = '/components/Pagenation/assets/arrow-left-sm.svg';
const ARROW_RIGHT_ICON_SM_SRC = '/components/Pagenation/assets/arrow-right-sm.svg';

const palette = colors.primitive.palette;
const textBase = colors.semantic.theme.text.base;

const SIZE_CONFIG: Record<PagenationSize, SizeConfig> = {
  md: {
    iconSize: spacing.scale['20'],
    iconPadding: spacing.scale['10'],
    iconGap: spacing.scale['4'],
    numberItemSize: spacing.scale['40'],
    numberRadius: radius.scale.xl,
    numberTypography: typography.scale.bodyS.medium,
    buttonPaddingX: spacing.scale['12'],
    buttonPaddingY: spacing.scale['10'],
    buttonGap: spacing.scale['4'],
    buttonRadius: radius.scale.xl,
    buttonTypography: typography.scale.captionL.medium,
    numbersContainerWidth: spacing.scale['400'] + spacing.scale['24'],
  },
  sm: {
    iconSize: spacing.scale['16'],
    iconPadding: spacing.scale['8'],
    iconGap: spacing.scale['2'],
    numberItemSize: spacing.scale['32'],
    numberRadius: radius.scale.lg,
    numberTypography: typography.scale.captionL.medium,
    buttonPaddingX: spacing.scale['10'],
    buttonPaddingY: spacing.scale['6'],
    buttonGap: spacing.scale['2'],
    buttonRadius: radius.scale.lg,
    buttonTypography: typography.scale.captionL.medium,
    numbersContainerWidth: spacing.scale['320'] + spacing.scale['32'],
  },
};

const TYPE_CONTAINER_WIDTH: Record<PagenationType, Record<PagenationSize, number>> = {
  arrows: {
    md: spacing.scale['400'],
    sm: spacing.scale['400'],
  },
  numbers: {
    md: spacing.scale['400'] + spacing.scale['24'],
    sm: spacing.scale['320'] + spacing.scale['32'],
  },
  buttons: {
    md: spacing.scale['400'],
    sm: spacing.scale['400'],
  },
};

const DEFAULT_NUMBER_ITEMS: PagenationNumberItem[] = [
  { id: 'page-1', label: '1' },
  { id: 'more-left', label: '...', kind: 'more', disabled: true },
  { id: 'page-56', label: '56' },
  { id: 'page-57', label: '57', active: true },
  { id: 'page-58', label: '58' },
  { id: 'more-right', label: '...', kind: 'more', disabled: true },
  { id: 'page-100', label: '100' },
];

function toTypographyStyle(token: TypographyToken) {
  return {
    fontFamily: token.fontFamily,
    fontSize: token.fontSize,
    fontWeight: token.fontWeight,
    lineHeight: `${token.lineHeight}px`,
    letterSpacing: `${token.letterSpacing}px`,
  };
}

function withFocusRing(baseShadow: string, interactionState: PagenationInteractionState, disabled: boolean): string {
  if (interactionState !== 'focus' || disabled) {
    return baseShadow;
  }

  if (baseShadow === 'none') {
    return shadows.focusRing.light.css;
  }

  return `${baseShadow}, ${shadows.focusRing.light.css}`;
}

function ArrowIcon({ direction, size }: { direction: 'left' | 'right'; size: PagenationSize }) {
  const config = SIZE_CONFIG[size];
  const iconSrc = direction === 'left'
    ? size === 'md'
      ? ARROW_LEFT_ICON_MD_SRC
      : ARROW_LEFT_ICON_SM_SRC
    : size === 'md'
      ? ARROW_RIGHT_ICON_MD_SRC
      : ARROW_RIGHT_ICON_SM_SRC;

  return (
    <img
      src={iconSrc}
      alt=""
      aria-hidden="true"
      style={{
        width: config.iconSize,
        height: config.iconSize,
        display: 'block',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    />
  );
}

function ArrowControlButton({
  size,
  direction,
  interactionState,
  disabled,
  onClick,
  ghost,
}: {
  size: PagenationSize;
  direction: 'left' | 'right';
  interactionState: PagenationInteractionState;
  disabled: boolean;
  onClick?: () => void;
  ghost: boolean;
}) {
  const config = SIZE_CONFIG[size];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={!disabled ? onClick : undefined}
      aria-disabled={disabled || undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: config.iconGap,
        borderStyle: 'solid',
        borderWidth: border.width['0'],
        borderRadius: ghost ? config.numberRadius : radius.scale.full,
        backgroundColor: ghost ? palette.base.transparent : palette.gray['1a'],
        padding: config.iconPadding,
        cursor: disabled ? 'default' : 'pointer',
        boxShadow: withFocusRing('none', interactionState, disabled),
      }}
    >
      <ArrowIcon direction={direction} size={size} />
    </button>
  );
}

function Dots({
  count,
  activeIndex,
}: {
  count: number;
  activeIndex: number;
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing.scale['4'],
      }}
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={`dot-${index}`}
          aria-hidden="true"
          style={{
            width: spacing.scale['6'],
            height: spacing.scale['6'],
            borderRadius: radius.scale.full,
            backgroundColor: index === activeIndex ? palette.base.dark1 : palette.gray['2'],
            display: 'inline-flex',
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

function NumberItemButton({
  item,
  size,
  interactionState,
  disabled,
  onNumberClick,
}: {
  item: PagenationNumberItem;
  size: PagenationSize;
  interactionState: PagenationInteractionState;
  disabled: boolean;
  onNumberClick?: (id: string) => void;
}) {
  const config = SIZE_CONFIG[size];
  const itemDisabled = disabled || item.disabled;
  const isActive = Boolean(item.active) && !itemDisabled;

  return (
    <button
      type="button"
      disabled={itemDisabled}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={itemDisabled || undefined}
      onClick={!itemDisabled && item.kind !== 'more' ? () => onNumberClick?.(item.id) : undefined}
      style={{
        width: config.numberItemSize,
        height: config.numberItemSize,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'solid',
        borderWidth: border.width['0'],
        borderRadius: config.numberRadius,
        backgroundColor: isActive ? palette.gray['1a'] : palette.base.transparent,
        padding: spacing.scale['0'],
        cursor: itemDisabled || item.kind === 'more' ? 'default' : 'pointer',
        boxShadow: withFocusRing('none', interactionState, itemDisabled),
      }}
    >
      <span
        style={{
          color: itemDisabled
            ? textBase.staticDarkQuaternary
            : isActive
              ? textBase.staticDark
              : textBase.staticDarkSecondary,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          ...toTypographyStyle(config.numberTypography),
        }}
      >
        {item.label}
      </span>
    </button>
  );
}

function ActionButton({
  size,
  interactionState,
  disabled,
  label,
  primary,
  onClick,
}: {
  size: PagenationSize;
  interactionState: PagenationInteractionState;
  disabled: boolean;
  label: string;
  primary: boolean;
  onClick?: () => void;
}) {
  const config = SIZE_CONFIG[size];

  return (
    <button
      type="button"
      disabled={disabled}
      aria-disabled={disabled || undefined}
      onClick={!disabled ? onClick : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: config.buttonGap,
        borderStyle: 'solid',
        borderWidth: primary ? border.width['0'] : border.width['1'],
        borderColor: primary ? palette.base.transparent : palette.gray['3'],
        borderRadius: config.buttonRadius,
        backgroundColor: primary ? palette.gray['13'] : palette.base.white,
        paddingInline: config.buttonPaddingX,
        paddingBlock: config.buttonPaddingY,
        cursor: disabled ? 'default' : 'pointer',
        boxShadow: withFocusRing(shadows.elevation.xs.css, interactionState, disabled),
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingInline: spacing.scale['4'],
          paddingBlock: spacing.scale['0'],
          color: disabled
            ? textBase.staticDarkQuaternary
            : primary
              ? textBase.staticWhite
              : textBase.staticDark,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          ...toTypographyStyle(config.buttonTypography),
        }}
      >
        {label}
      </span>
    </button>
  );
}

export function Pagenation({
  type = 'numbers',
  size = 'md',
  interactionState = 'default',
  showDots = true,
  dotCount = spacing.scale['6'],
  activeDotIndex = spacing.scale['0'],
  leftButtonLabel = 'Button',
  rightButtonLabel = 'Button',
  numberItems = DEFAULT_NUMBER_ITEMS,
  onPrevClick,
  onNextClick,
  onNumberClick,
  onLeftButtonClick,
  onRightButtonClick,
  className,
  style,
  ...props
}: PagenationProps) {
  const config = SIZE_CONFIG[size];
  const disabled = interactionState === 'disabled';
  const width = TYPE_CONTAINER_WIDTH[type][size];

  if (type === 'arrows') {
    return (
      <div
        role="navigation"
        aria-label="Pagination"
        className={className}
        style={{
          width,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: spacing.scale['0'],
          boxSizing: 'border-box',
          ...style,
        }}
        {...props}
      >
        <ArrowControlButton
          size={size}
          direction="left"
          interactionState={interactionState}
          disabled={disabled}
          onClick={onPrevClick}
          ghost={false}
        />

        {showDots ? <Dots count={dotCount} activeIndex={activeDotIndex} /> : null}

        <ArrowControlButton
          size={size}
          direction="right"
          interactionState={interactionState}
          disabled={disabled}
          onClick={onNextClick}
          ghost={false}
        />
      </div>
    );
  }

  if (type === 'buttons') {
    return (
      <div
        role="navigation"
        aria-label="Pagination"
        className={className}
        style={{
          width,
          display: 'inline-flex',
          alignItems: 'center',
          gap: spacing.scale['16'],
          padding: spacing.scale['0'],
          boxSizing: 'border-box',
          ...style,
        }}
        {...props}
      >
        <div
          style={{
            flex: '1 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            minWidth: spacing.scale['0'],
          }}
        >
          <ActionButton
            size={size}
            interactionState={interactionState}
            disabled={disabled}
            label={leftButtonLabel}
            primary={false}
            onClick={onLeftButtonClick}
          />
        </div>

        {showDots ? <Dots count={dotCount} activeIndex={activeDotIndex} /> : null}

        <div
          style={{
            flex: '1 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            minWidth: spacing.scale['0'],
          }}
        >
          <ActionButton
            size={size}
            interactionState={interactionState}
            disabled={disabled}
            label={rightButtonLabel}
            primary
            onClick={onRightButtonClick}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      role="navigation"
      aria-label="Pagination"
      className={className}
      style={{
        width: config.numbersContainerWidth,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.scale['8'],
        padding: spacing.scale['0'],
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      <ArrowControlButton
        size={size}
        direction="left"
        interactionState={interactionState}
        disabled={disabled}
        onClick={onPrevClick}
        ghost
      />

      {numberItems.map((item) => (
        <NumberItemButton
          key={item.id}
          item={item}
          size={size}
          interactionState={interactionState}
          disabled={disabled}
          onNumberClick={onNumberClick}
        />
      ))}

      <ArrowControlButton
        size={size}
        direction="right"
        interactionState={interactionState}
        disabled={disabled}
        onClick={onNextClick}
        ghost
      />
    </div>
  );
}

