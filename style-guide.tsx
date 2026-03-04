import React from 'react';

import { border, colors, radius, shadows, spacing, typography, zIndex } from './style-tokens';

type TokenValue = unknown;
type FlatToken = { name: string; value: TokenValue };

type TypographyStyleToken = {
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  lineHeight: number;
  letterSpacing?: number;
};

type ShadowToken = {
  css: string;
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'Pretendard, system-ui, sans-serif',
  fontSize: 28,
  fontWeight: 700,
  margin: '40px 0 16px',
  letterSpacing: -0.4,
};

const tokenPathStyle: React.CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 12,
  color: '#5e636e',
  marginBottom: 8,
  wordBreak: 'break-all',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && /^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value);
}

function isTypographyToken(value: unknown): value is TypographyStyleToken {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.fontFamily === 'string' &&
    typeof value.fontSize === 'number' &&
    (typeof value.fontWeight === 'number' || typeof value.fontWeight === 'string') &&
    typeof value.lineHeight === 'number'
  );
}

function isShadowToken(value: unknown): value is ShadowToken {
  return isRecord(value) && typeof value.css === 'string';
}

function flattenTokens(node: unknown, prefix = ''): FlatToken[] {
  if (!isRecord(node)) {
    return prefix ? [{ name: prefix, value: node }] : [];
  }

  if (isTypographyToken(node) || isShadowToken(node)) {
    return prefix ? [{ name: prefix, value: node }] : [];
  }

  const entries = Object.entries(node);
  if (entries.length === 0) {
    return prefix ? [{ name: prefix, value: node }] : [];
  }

  return entries.flatMap(([key, value]) => {
    const name = prefix ? `${prefix}.${key}` : key;
    return flattenTokens(value, name);
  });
}

function renderColorSection(data: unknown) {
  const tokens = flattenTokens(data).filter((token) => isHexColor(token.value));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
      {tokens.map((token) => (
        <article
          key={token.name}
          style={{
            border: '1px solid #e3e7ed',
            borderRadius: 12,
            overflow: 'hidden',
            background: '#ffffff',
          }}
        >
          <div style={{ height: 76, background: token.value }} />
          <div style={{ padding: 10 }}>
            <div style={tokenPathStyle}>{token.name}</div>
            <code style={{ fontSize: 12, color: '#14151a' }}>{token.value}</code>
          </div>
        </article>
      ))}
    </div>
  );
}

function renderNumericSection(data: unknown, unit: string) {
  const tokens = flattenTokens(data).filter((token) => typeof token.value === 'number');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
      {tokens.map((token) => {
        const value = token.value as number;
        return (
          <article
            key={token.name}
            style={{
              border: '1px solid #e3e7ed',
              borderRadius: 12,
              padding: 12,
              background: '#ffffff',
            }}
          >
            <div style={tokenPathStyle}>{token.name}</div>
            <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', marginBottom: 10 }}>
              {value}
              {unit}
            </div>
            <div
              style={{
                height: 10,
                width: `${Math.max(2, Math.min(200, value * 2))}px`,
                borderRadius: 999,
                background: '#4f7cff',
              }}
            />
          </article>
        );
      })}
    </div>
  );
}

function renderTypographySection(data: unknown) {
  const tokens = flattenTokens(data).filter((token) => isTypographyToken(token.value));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
      {tokens.map((token) => {
        const value = token.value as TypographyStyleToken;
        return (
          <article
            key={token.name}
            style={{
              border: '1px solid #e3e7ed',
              borderRadius: 12,
              padding: 14,
              background: '#ffffff',
            }}
          >
            <div style={tokenPathStyle}>{token.name}</div>
            <p
              style={{
                margin: 0,
                fontFamily: value.fontFamily,
                fontSize: value.fontSize,
                fontWeight: value.fontWeight,
                lineHeight: `${value.lineHeight}px`,
                letterSpacing: value.letterSpacing ?? 0,
              }}
            >
              The quick brown fox jumps over the lazy dog.
            </p>
            <div
              style={{
                marginTop: 10,
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 6,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 12,
                color: '#333333',
              }}
            >
              <span>fontFamily: {value.fontFamily}</span>
              <span>fontSize: {value.fontSize}px</span>
              <span>fontWeight: {value.fontWeight}</span>
              <span>lineHeight: {value.lineHeight}px</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function renderShadowSection(data: unknown) {
  const tokens = flattenTokens(data).filter((token) => isShadowToken(token.value));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
      {tokens.map((token) => {
        const value = token.value as ShadowToken;
        return (
          <article
            key={token.name}
            style={{
              border: '1px solid #e3e7ed',
              borderRadius: 12,
              padding: 14,
              background: '#ffffff',
            }}
          >
            <div style={tokenPathStyle}>{token.name}</div>
            <div
              style={{
                height: 72,
                borderRadius: 10,
                background: '#ffffff',
                boxShadow: value.css,
                border: '1px solid #eef1f6',
                marginBottom: 10,
              }}
            />
            <code style={{ fontSize: 12, color: '#14151a', wordBreak: 'break-all' }}>{value.css}</code>
          </article>
        );
      })}
    </div>
  );
}

export default function StyleGuidePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f7f9fc 0%, #ffffff 40%)',
        color: '#14151a',
        padding: '32px 20px 64px',
      }}
    >
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <header style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontFamily: 'Pretendard, system-ui, sans-serif',
              fontSize: 'clamp(32px, 5vw, 52px)',
              lineHeight: 1.05,
              margin: '0 0 10px',
              letterSpacing: -1,
            }}
          >
            Design System Style Foundation
          </h1>
          <p
            style={{
              margin: 0,
              fontFamily: 'Pretendard, system-ui, sans-serif',
              fontSize: 16,
              color: '#333333',
              maxWidth: 940,
            }}
          >
            Single Source of Truth: all values on this page are rendered directly from{' '}
            <code>/Users/309agent/cursor/309-design-library/style-tokens.ts</code>.
          </p>
        </header>

        <section>
          <h2 style={sectionTitleStyle}>Usage Recommendations</h2>
          <div
            style={{
              border: '1px solid #e3e7ed',
              borderRadius: 14,
              padding: 16,
              background: '#ffffff',
              fontFamily: 'Pretendard, system-ui, sans-serif',
              lineHeight: 1.5,
            }}
          >
            <p style={{ margin: '0 0 8px' }}>Use semantic tokens (`colors.semantic.*`, `border.color.theme.*`) in UI code.</p>
            <p style={{ margin: '0 0 8px' }}>
              Keep primitive scales (`colors.primitive.*`, `spacing.primitive`, `radius.primitive`) for token definition and
              theme extension layers.
            </p>
            <p style={{ margin: '0 0 8px' }}>
              Consume typography through `typography.scale` style objects to preserve family, size, weight, letter spacing,
              and line height together.
            </p>
            <p style={{ margin: 0 }}>
              Do not hardcode style values in components. Add or update values in `style-tokens.ts` and consume by token key.
            </p>
          </div>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>Colors</h2>
          {renderColorSection(colors)}
        </section>

        <section>
          <h2 style={sectionTitleStyle}>Typography</h2>
          {renderTypographySection(typography.scale)}
        </section>

        <section>
          <h2 style={sectionTitleStyle}>Spacing</h2>
          {renderNumericSection(spacing, 'px')}
        </section>

        <section>
          <h2 style={sectionTitleStyle}>Radius</h2>
          {renderNumericSection(radius, 'px')}
        </section>

        <section>
          <h2 style={sectionTitleStyle}>Shadows</h2>
          {renderShadowSection(shadows)}
        </section>

        <section>
          <h2 style={sectionTitleStyle}>Border</h2>
          {renderColorSection(border.color)}
          <div style={{ height: 12 }} />
          {renderNumericSection(border.width, 'px')}
        </section>

        <section>
          <h2 style={sectionTitleStyle}>Z-Index</h2>
          {Object.keys(zIndex).length > 0 ? (
            renderNumericSection(zIndex, '')
          ) : (
            <p style={{ margin: 0, fontFamily: 'Pretendard, system-ui, sans-serif', color: '#5e636e' }}>
              No explicit z-index tokens were present in the MCP token source.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
