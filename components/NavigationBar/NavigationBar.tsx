import React from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { border, colors, radius, shadows, spacing, typography } from '../../style-tokens';

import type { NavigationBarInteractionState, NavigationBarLinkItem, NavigationBarProps, NavigationBarType } from './NavigationBar.types';

type TypographyToken = {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
};

const LOGO_SRC = '/components/NavigationBar/assets/logo.png';
const CHEVRON_DOWN_SRC = '/components/NavigationBar/assets/chevron-down.png';
const PRO_ACCESS_ICON_SRC = '/components/NavigationBar/assets/pro-access.png';
const DEFAULT_AVATAR_SRC = '/components/NavigationBar/assets/avatar.png';

const palette = colors.primitive.palette;
const textBase = colors.semantic.theme.text.base;
const textAccent = colors.semantic.theme.text.accent;

const NAV_DEFAULT_WIDTH = spacing.scale['1440'];
const NAV_HEIGHT = spacing.scale['64'];
const NAV_HEIGHT_DOUBLE = spacing.scale['112'];
const LOGO_FRAME_SIZE = spacing.scale['32'];
const LOGO_SIZE = spacing.scale['32'] - spacing.scale['2'];
const ICON_SIZE = spacing.scale['16'];
const SEARCH_MAX_WIDTH = spacing.primitive['360'];

const DEFAULT_MAIN_LINKS: NavigationBarLinkItem[] = [
  { id: 'library', label: 'Library' },
  { id: 'studio', label: 'Studio' },
  { id: 'pronunciation-dictionary', label: 'Pronunciation Dictionary' },
  { id: 'voice', label: 'Voice' },
];

const TYPE06_DEFAULT_LINKS: NavigationBarLinkItem[] = [
  { id: 'explore', label: 'Explore' },
  { id: 'pro-access', label: 'Pro Access', accent: true },
];

const TYPE07_DEFAULT_LINKS: NavigationBarLinkItem[] = [
  { id: 'library', label: 'Library' },
  { id: 'studio', label: 'Studio' },
  { id: 'pronunciation-dictionary', label: 'Pronunciation Dictionary' },
  { id: 'voice-cloning', label: 'Voice Cloning', hasChevron: true },
];

const TYPE08_DEFAULT_BOTTOM_LINKS: NavigationBarLinkItem[] = [
  { id: 'library', label: 'Library' },
  { id: 'studio', label: 'Studio', badgeText: '12' },
  { id: 'pronunciation-dictionary', label: 'Pronunciation Dictionary' },
  { id: 'voice-cloning', label: 'Voice Cloning', badgeText: '08' },
];

function toTypographyStyle(token: TypographyToken): CSSProperties {
  return {
    fontFamily: token.fontFamily,
    fontSize: token.fontSize,
    fontWeight: token.fontWeight,
    lineHeight: `${token.lineHeight}px`,
    letterSpacing: `${token.letterSpacing}px`,
  };
}

function withFocusRing(baseShadow: string, interactionState: NavigationBarInteractionState, disabled: boolean): string {
  if (interactionState === 'focus' && !disabled) {
    return `${baseShadow}, ${shadows.focusRing.light.css}`;
  }

  return baseShadow;
}

function getMainLinks(type: NavigationBarType, links: NavigationBarLinkItem[] | undefined): NavigationBarLinkItem[] {
  if (links && links.length > 0) {
    return links;
  }

  if (type === '06') {
    return TYPE06_DEFAULT_LINKS;
  }

  if (type === '07') {
    return TYPE07_DEFAULT_LINKS;
  }

  return DEFAULT_MAIN_LINKS;
}

function getBottomLinks(bottomLinks: NavigationBarLinkItem[] | undefined): NavigationBarLinkItem[] {
  if (bottomLinks && bottomLinks.length > 0) {
    return bottomLinks;
  }

  return TYPE08_DEFAULT_BOTTOM_LINKS;
}

function IconImage({ src, size = ICON_SIZE }: { src: string; size?: number }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        display: 'block',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    />
  );
}

function LogoMark() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: LOGO_FRAME_SIZE,
        height: LOGO_FRAME_SIZE,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <img
        src={LOGO_SRC}
        alt=""
        style={{
          width: LOGO_SIZE,
          height: LOGO_SIZE,
          display: 'block',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />
    </span>
  );
}

function SearchField({
  placeholder,
  shortcutLabel,
  interactionState,
  disabled,
}: {
  placeholder: string;
  shortcutLabel: string;
  interactionState: NavigationBarInteractionState;
  disabled: boolean;
}) {
  const fieldBorderColor = disabled ? palette.gray['2'] : palette.gray['3'];
  const fieldBackground = disabled ? palette.gray['1'] : palette.base.white;
  const placeholderColor = disabled ? textBase.staticDarkQuaternary : textBase.staticDarkTertiary;
  const shortcutColor = disabled ? textBase.staticDarkQuaternary : textBase.staticDarkSecondary;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: SEARCH_MAX_WIDTH,
        minWidth: spacing.scale['144'],
        boxShadow: withFocusRing(shadows.elevation.xs.css, interactionState, disabled),
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: spacing.scale['4'],
          borderStyle: 'solid',
          borderWidth: border.width['1'],
          borderColor: fieldBorderColor,
          borderRadius: radius.scale.lg,
          backgroundColor: fieldBackground,
          paddingInline: spacing.scale['8'],
          paddingBlock: spacing.scale['6'],
          boxSizing: 'border-box',
        }}
      >
        <span
          style={{
            flex: '1 0 0',
            minWidth: spacing.scale['0'],
            color: placeholderColor,
            ...toTypographyStyle(typography.scale.captionL.regular),
          }}
        >
          {placeholder}
        </span>

        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: radius.scale.sm,
            backgroundColor: disabled ? palette.gray['2a'] : palette.gray['2'],
            paddingInline: spacing.scale['8'],
            paddingBlock: spacing.scale['2'],
            color: shortcutColor,
            ...toTypographyStyle(typography.scale.captionL.medium),
            whiteSpace: 'nowrap',
          }}
        >
          {shortcutLabel}
        </span>
      </div>
    </div>
  );
}

function NavigationMainItem({
  item,
  interactionState,
  componentDisabled,
  onClick,
}: {
  item: NavigationBarLinkItem;
  interactionState: NavigationBarInteractionState;
  componentDisabled: boolean;
  onClick?: (id: string) => void;
}) {
  const disabled = componentDisabled || item.disabled;
  const textColor = disabled ? textBase.staticDarkQuaternary : item.accent ? textAccent.blueAccent : textBase.staticDarkSecondary;
  const hasProIcon = item.id === 'pro-access';
  const hasLeadingIcon = Boolean(item.icon) || hasProIcon;
  const hasTrailingChevron = item.hasChevron;
  const isInteractive = Boolean(onClick) && !disabled;

  let iconNode: ReactNode = null;

  if (item.icon) {
    iconNode = item.icon;
  } else if (hasProIcon) {
    iconNode = <IconImage src={PRO_ACCESS_ICON_SRC} />;
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={isInteractive ? () => onClick?.(item.id) : undefined}
      aria-disabled={disabled || undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: hasLeadingIcon || hasTrailingChevron ? spacing.scale['6'] : spacing.scale['0'],
        borderStyle: 'solid',
        borderWidth: border.width['0'],
        backgroundColor: palette.base.transparent,
        paddingInline: spacing.scale['0'],
        paddingBlock: spacing.scale['0'],
        margin: spacing.scale['0'],
        color: textColor,
        cursor: isInteractive ? 'pointer' : 'default',
        boxShadow: interactionState === 'focus' && !disabled ? shadows.focusRing.light.css : 'none',
      }}
    >
      {iconNode}

      <span
        style={{
          whiteSpace: 'nowrap',
          textAlign: 'center',
          ...toTypographyStyle(typography.scale.captionL.medium),
        }}
      >
        {item.label}
      </span>

      {hasTrailingChevron ? <IconImage src={CHEVRON_DOWN_SRC} /> : null}
    </button>
  );
}

function NavigationBottomTabItem({
  item,
  active,
  interactionState,
  componentDisabled,
  onClick,
}: {
  item: NavigationBarLinkItem;
  active: boolean;
  interactionState: NavigationBarInteractionState;
  componentDisabled: boolean;
  onClick?: (id: string) => void;
}) {
  const disabled = componentDisabled || item.disabled;
  const textColor = disabled ? textBase.staticDarkQuaternary : textBase.staticDarkSecondary;
  const badgeBackground = disabled ? palette.gray['2a'] : palette.gray['1a'];
  const badgeTextColor = disabled ? textBase.staticDarkQuaternary : active ? textBase.staticDark : textBase.staticDarkSecondary;
  const isInteractive = Boolean(onClick) && !disabled;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={isInteractive ? () => onClick?.(item.id) : undefined}
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.scale['8'],
        borderStyle: 'solid',
        borderWidth: border.width['0'],
        borderBottomWidth: active ? border.width['2'] : border.width['0'],
        borderBottomColor: active ? border.color.theme.select.primary : palette.base.transparent,
        backgroundColor: palette.base.transparent,
        paddingInline: spacing.scale['0'],
        paddingTop: spacing.scale['10'],
        paddingBottom: spacing.scale['14'],
        margin: spacing.scale['0'],
        cursor: isInteractive ? 'pointer' : 'default',
        boxShadow: interactionState === 'focus' && !disabled ? shadows.focusRing.light.css : 'none',
      }}
    >
      <span
        style={{
          whiteSpace: 'nowrap',
          textAlign: 'center',
          color: textColor,
          ...toTypographyStyle(typography.scale.captionL.medium),
        }}
      >
        {item.label}
      </span>

      {item.badgeText ? (
        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: radius.scale.md,
            backgroundColor: badgeBackground,
            paddingInline: spacing.scale['8'],
            paddingBlock: spacing.scale['2'],
            color: badgeTextColor,
            ...toTypographyStyle(typography.scale.captionL.medium),
            whiteSpace: 'nowrap',
          }}
        >
          {item.badgeText}
        </span>
      ) : null}
    </button>
  );
}

function BaseCenterLinks({
  links,
  interactionState,
  componentDisabled,
  onLinkClick,
  justify,
}: {
  links: NavigationBarLinkItem[];
  interactionState: NavigationBarInteractionState;
  componentDisabled: boolean;
  onLinkClick?: (id: string) => void;
  justify: 'flex-start' | 'center';
}) {
  return (
    <div
      style={{
        display: 'flex',
        flex: '1 0 0',
        alignItems: 'center',
        justifyContent: justify,
        gap: spacing.scale['24'],
        minWidth: spacing.scale['0'],
      }}
    >
      {links.map((item) => (
        <NavigationMainItem
          key={item.id}
          item={item}
          interactionState={interactionState}
          componentDisabled={componentDisabled}
          onClick={onLinkClick}
        />
      ))}
    </div>
  );
}

export function NavigationBar({
  id,
  className,
  style,
  type = '01',
  width = NAV_DEFAULT_WIDTH,
  interactionState = 'default',
  links,
  bottomLinks,
  activeBottomLinkId,
  searchPlaceholder = 'Search...',
  searchShortcutLabel = '/',
  ctaLabel = 'Try for free',
  helpLabel = 'Help',
  avatarSrc,
  onLinkClick,
  onCtaClick,
  onBottomLinkClick,
  ...props
}: NavigationBarProps) {
  const componentDisabled = interactionState === 'disabled';
  const resolvedMainLinks = getMainLinks(type, links);
  const resolvedBottomLinks = getBottomLinks(bottomLinks);
  const resolvedActiveBottomLinkId =
    activeBottomLinkId ?? resolvedBottomLinks[spacing.scale['1']]?.id ?? resolvedBottomLinks[spacing.scale['0']]?.id ?? '';

  const commonRootStyle: CSSProperties = {
    width,
    boxSizing: 'border-box',
  };

  if (type === '07') {
    const ctaTextColor = componentDisabled ? textBase.staticDarkQuaternary : textBase.staticWhite;
    const ctaBackground = componentDisabled ? palette.gray['3'] : palette.gray['13'];

    return (
      <header
        id={id}
        className={className}
        aria-disabled={componentDisabled || undefined}
        style={{
          ...commonRootStyle,
          minHeight: NAV_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingInline: spacing.scale['120'],
          paddingBlock: spacing.scale['16'],
          ...style,
        }}
        {...props}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.scale['32'],
            paddingInline: spacing.scale['16'],
            paddingBlock: spacing.scale['8'],
            borderStyle: 'solid',
            borderWidth: border.width['1'],
            borderColor: componentDisabled ? palette.gray['2'] : palette.gray['3'],
            borderRadius: radius.scale.xxl,
            backgroundColor: palette.base.white,
            boxShadow: shadows.elevation.lg.css,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: '1 0 0',
              alignItems: 'center',
            }}
          >
            <LogoMark />
          </div>

          <BaseCenterLinks
            links={resolvedMainLinks}
            interactionState={interactionState}
            componentDisabled={componentDisabled}
            onLinkClick={onLinkClick}
            justify="center"
          />

          <div
            style={{
              display: 'flex',
              flex: '1 0 0',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <button
              type="button"
              disabled={componentDisabled}
              onClick={!componentDisabled ? onCtaClick : undefined}
              aria-disabled={componentDisabled || undefined}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderStyle: 'solid',
                borderWidth: border.width['0'],
                borderRadius: radius.scale.lg,
                backgroundColor: ctaBackground,
                color: ctaTextColor,
                paddingInline: spacing.scale['10'],
                paddingBlock: spacing.scale['6'],
                boxShadow: withFocusRing(shadows.elevation.xs.css, interactionState, componentDisabled),
                cursor: componentDisabled ? 'default' : 'pointer',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingInline: spacing.scale['4'],
                  paddingBlock: spacing.scale['0'],
                  whiteSpace: 'nowrap',
                  ...toTypographyStyle(typography.scale.captionL.medium),
                }}
              >
                {ctaLabel}
              </span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  if (type === '08') {
    const helpTextColor = componentDisabled ? textBase.staticDarkQuaternary : textBase.staticDarkSecondary;

    return (
      <header
        id={id}
        className={className}
        aria-disabled={componentDisabled || undefined}
        style={{
          ...commonRootStyle,
          minHeight: NAV_HEIGHT_DOUBLE,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: palette.base.white,
          ...style,
        }}
        {...props}
      >
        <div
          style={{
            width: '100%',
            minHeight: NAV_HEIGHT,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.scale['32'],
            paddingLeft: spacing.scale['24'],
            paddingRight: spacing.scale['64'],
            paddingTop: spacing.scale['16'],
            paddingBottom: spacing.scale['16'],
            boxSizing: 'border-box',
          }}
        >
          <LogoMark />

          <div
            style={{
              display: 'flex',
              flex: '1 0 0',
              justifyContent: 'center',
              minWidth: spacing.scale['0'],
            }}
          >
            <SearchField
              placeholder={searchPlaceholder}
              shortcutLabel={searchShortcutLabel}
              interactionState={interactionState}
              disabled={componentDisabled}
            />
          </div>

          <span
            style={{
              width: spacing.scale['32'],
              height: spacing.scale['32'],
              borderRadius: radius.scale.full,
              overflow: 'hidden',
              flexShrink: 0,
              display: 'inline-flex',
            }}
          >
            <img
              src={avatarSrc ?? DEFAULT_AVATAR_SRC}
              alt=""
              aria-hidden="true"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
          </span>
        </div>

        <div
          style={{
            width: '100%',
            minHeight: NAV_HEIGHT - spacing.scale['16'],
            display: 'flex',
            alignItems: 'center',
            gap: spacing.scale['32'],
            paddingLeft: spacing.scale['24'],
            paddingRight: spacing.scale['64'],
            borderBottomStyle: 'solid',
            borderBottomWidth: border.width['1'],
            borderBottomColor: palette.gray['2'],
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: '1 0 0',
              alignItems: 'center',
              minWidth: spacing.scale['0'],
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing.scale['24'],
              }}
            >
              {resolvedBottomLinks.map((item) => (
                <NavigationBottomTabItem
                  key={item.id}
                  item={item}
                  active={item.id === resolvedActiveBottomLinkId}
                  interactionState={interactionState}
                  componentDisabled={componentDisabled}
                  onClick={onBottomLinkClick}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={componentDisabled}
            onClick={!componentDisabled ? () => onBottomLinkClick?.('help') : undefined}
            aria-disabled={componentDisabled || undefined}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.scale['6'],
              borderStyle: 'solid',
              borderWidth: border.width['0'],
              backgroundColor: palette.base.transparent,
              paddingInline: spacing.scale['0'],
              paddingBlock: spacing.scale['0'],
              color: helpTextColor,
              cursor: componentDisabled ? 'default' : 'pointer',
            }}
          >
            <span
              style={{
                whiteSpace: 'nowrap',
                textAlign: 'center',
                ...toTypographyStyle(typography.scale.captionL.medium),
              }}
            >
              {helpLabel}
            </span>
            <IconImage src={CHEVRON_DOWN_SRC} />
          </button>
        </div>
      </header>
    );
  }

  if (type === '05') {
    return (
      <header
        id={id}
        className={className}
        aria-disabled={componentDisabled || undefined}
        style={{
          ...commonRootStyle,
          minHeight: NAV_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.scale['32'],
          paddingLeft: spacing.scale['24'],
          paddingRight: spacing.scale['64'],
          paddingTop: spacing.scale['16'],
          paddingBottom: spacing.scale['16'],
          borderBottomStyle: 'solid',
          borderBottomWidth: border.width['1'],
          borderBottomColor: componentDisabled ? palette.gray['2'] : palette.gray['3'],
          backgroundColor: palette.base.white,
          boxSizing: 'border-box',
          ...style,
        }}
        {...props}
      >
        <div
          style={{
            display: 'flex',
            flex: '1 0 0',
            alignItems: 'center',
            minWidth: spacing.scale['0'],
          }}
        >
          <LogoMark />
        </div>

        <BaseCenterLinks
          links={resolvedMainLinks}
          interactionState={interactionState}
          componentDisabled={componentDisabled}
          onLinkClick={onLinkClick}
          justify="center"
        />

        <div
          style={{
            display: 'flex',
            flex: '1 0 0',
            minWidth: spacing.scale['0'],
            minHeight: spacing.scale['0'],
          }}
        />
      </header>
    );
  }

  if (type === '06') {
    return (
      <header
        id={id}
        className={className}
        aria-disabled={componentDisabled || undefined}
        style={{
          ...commonRootStyle,
          minHeight: NAV_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.scale['32'],
          paddingLeft: spacing.scale['24'],
          paddingRight: spacing.scale['64'],
          paddingTop: spacing.scale['16'],
          paddingBottom: spacing.scale['16'],
          borderBottomStyle: 'solid',
          borderBottomWidth: border.width['1'],
          borderBottomColor: componentDisabled ? palette.gray['2'] : palette.gray['3'],
          backgroundColor: palette.base.white,
          boxSizing: 'border-box',
          ...style,
        }}
        {...props}
      >
        <LogoMark />

        <div
          style={{
            display: 'flex',
            flex: '1 0 0',
            alignItems: 'center',
            gap: spacing.scale['24'],
            minWidth: spacing.scale['0'],
          }}
        >
          <SearchField
            placeholder={searchPlaceholder}
            shortcutLabel={searchShortcutLabel}
            interactionState={interactionState}
            disabled={componentDisabled}
          />

          {resolvedMainLinks.map((item) => (
            <NavigationMainItem
              key={item.id}
              item={item}
              interactionState={interactionState}
              componentDisabled={componentDisabled}
              onClick={onLinkClick}
            />
          ))}
        </div>
      </header>
    );
  }

  return (
    <header
      id={id}
      className={className}
      aria-disabled={componentDisabled || undefined}
      style={{
        ...commonRootStyle,
        minHeight: NAV_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        gap: spacing.scale['32'],
        paddingLeft: spacing.scale['24'],
        paddingRight: spacing.scale['64'],
        paddingTop: spacing.scale['16'],
        paddingBottom: spacing.scale['16'],
        borderBottomStyle: 'solid',
        borderBottomWidth: border.width['1'],
        borderBottomColor: componentDisabled ? palette.gray['2'] : palette.gray['3'],
        backgroundColor: palette.base.white,
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      <LogoMark />

      <BaseCenterLinks
        links={resolvedMainLinks}
        interactionState={interactionState}
        componentDisabled={componentDisabled}
        onLinkClick={onLinkClick}
        justify="flex-start"
      />
    </header>
  );
}
