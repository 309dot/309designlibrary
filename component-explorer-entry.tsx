import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { border, colors, radius, spacing, typography } from './style-tokens';
import { componentMetadata } from './component-explorer-metadata';

import AccordionPreview from './components/Accordion/Accordion.preview';
import BadgePreview from './components/Badge/Badge.preview';
import BannerPreview from './components/Banner/Banner.preview';
import BreadcrumbsPreview from './components/Breadcrumbs/Breadcrumbs.preview';
import ButtonPreview from './components/Button/Button.preview';
import ButtonGroupPreview from './components/ButtonGroup/ButtonGroup.preview';
import CalendarPreview from './components/Calendar/Calendar.preview';
import CheckboxPreview from './components/Checkbox/Checkbox.preview';
import CheckboxLabelPreview from './components/CheckboxLabel/CheckboxLabel.preview';
import DropdownPreview from './components/Dropdown/Dropdown.preview';
import FeatureCardPreview from './components/FeatureCard/FeatureCard.preview';
import IconsPreview from './components/Icons/Icons.preview';
import InputPreview from './components/Input/Input.preview';
import NavigationBarPreview from './components/NavigationBar/NavigationBar.preview';
import PagenationPreview from './components/Pagenation/Pagenation.preview';
import ProgressBarPreview from './components/ProgressBar/ProgressBar.preview';
import ProgressCirclePreview from './components/ProgressCircle/ProgressCircle.preview';
import QuantityStepperPreview from './components/QuantityStepper/QuantityStepper.preview';
import RadioPreview from './components/Radio/Radio.preview';
import RadioLabelPreview from './components/RadioLabel/RadioLabel.preview';
import SearchInputPreview from './components/SearchInput/SearchInput.preview';
import SelectInputPreview from './components/SelectInput/SelectInput.preview';
import TabMenuPreview from './components/TabMenu/TabMenu.preview';
import TogglePreview from './components/Toggle/Toggle.preview';
import TooltipPreview from './components/Tooltip/Tooltip.preview';
import TableCellPreview from './components/TableCell/TableCell.preview';
import TableHeaderPreview from './components/TableHeader/TableHeader.preview';
import TaskCardPreview from './components/TaskCard/TaskCard.preview';

type ComponentId = keyof typeof componentMetadata;

type ComponentEntry = {
  id: ComponentId;
  label: string;
  Preview: React.ComponentType;
};

const palette = colors.primitive.palette;
const textBase = colors.semantic.theme.text.base;

const COMPONENTS: ComponentEntry[] = [
  { id: 'Accordion', label: 'Accordion', Preview: AccordionPreview },
  { id: 'Badge', label: 'Badge', Preview: BadgePreview },
  { id: 'Banner', label: 'Banner', Preview: BannerPreview },
  { id: 'Breadcrumbs', label: 'Breadcrumbs', Preview: BreadcrumbsPreview },
  { id: 'Button', label: 'Button', Preview: ButtonPreview },
  { id: 'ButtonGroup', label: 'Button Group', Preview: ButtonGroupPreview },
  { id: 'Calendar', label: 'Calendar', Preview: CalendarPreview },
  { id: 'Checkbox', label: 'Checkbox', Preview: CheckboxPreview },
  { id: 'CheckboxLabel', label: 'Checkbox Label', Preview: CheckboxLabelPreview },
  { id: 'Dropdown', label: 'Dropdown', Preview: DropdownPreview },
  { id: 'FeatureCard', label: 'Feature Card', Preview: FeatureCardPreview },
  { id: 'Icons', label: 'Icons', Preview: IconsPreview },
  { id: 'Input', label: 'Input', Preview: InputPreview },
  { id: 'NavigationBar', label: 'Navigation Bar', Preview: NavigationBarPreview },
  { id: 'Pagenation', label: 'Pagenation', Preview: PagenationPreview },
  { id: 'ProgressBar', label: 'Progress Bar', Preview: ProgressBarPreview },
  { id: 'ProgressCircle', label: 'Progress Circle', Preview: ProgressCirclePreview },
  { id: 'QuantityStepper', label: 'Quantity Stepper', Preview: QuantityStepperPreview },
  { id: 'Radio', label: 'Radio', Preview: RadioPreview },
  { id: 'RadioLabel', label: 'Radio Label', Preview: RadioLabelPreview },
  { id: 'SearchInput', label: 'Search Input', Preview: SearchInputPreview },
  { id: 'SelectInput', label: 'Select Input', Preview: SelectInputPreview },
  { id: 'TabMenu', label: 'Tab Menu', Preview: TabMenuPreview },
  { id: 'Toggle', label: 'Toggle', Preview: TogglePreview },
  { id: 'Tooltip', label: 'Tooltip', Preview: TooltipPreview },
  { id: 'TableCell', label: 'Table Cell', Preview: TableCellPreview },
  { id: 'TableHeader', label: 'Table Header', Preview: TableHeaderPreview },
  { id: 'TaskCard', label: 'Task Card', Preview: TaskCardPreview },
];

const APP_CSS = `
  * { box-sizing: border-box; }
  html, body, #root { margin: 0; width: 100%; height: 100%; }
  body {
    font-family: "Pretendard", system-ui, -apple-system, sans-serif;
    background: linear-gradient(180deg, #f7f7f8 0%, #ffffff 100%);
    color: #14151a;
  }

  .explorer-layout {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr) 360px;
    background: linear-gradient(160deg, #f7f7f8 0%, #ffffff 80%);
  }

  .panel {
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    border-color: #e9eaec;
    border-style: solid;
  }

  .left-panel {
    border-width: 0 1px 0 0;
    background: #ffffffd9;
    backdrop-filter: blur(8px);
    display: grid;
    grid-template-rows: auto auto minmax(0, 1fr);
    gap: 12px;
    padding: 16px;
  }

  .main-panel {
    border-width: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    gap: 12px;
    padding: 16px;
  }

  .right-panel {
    border-width: 0 0 0 1px;
    background: #fcfcfd;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    gap: 12px;
    padding: 16px;
  }

  .component-list {
    min-height: 0;
    overflow: auto;
    display: grid;
    gap: 6px;
    padding-right: 4px;
  }

  .component-item {
    width: 100%;
    border: 1px solid #e9eaec;
    background: #ffffff;
    border-radius: 10px;
    padding: 10px 12px;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
  }

  .component-item:hover {
    border-color: #dee0e3;
    background: #f7f7f8;
  }

  .component-item.active {
    border-color: #4778f5;
    background: #f0f4fe;
    color: #133a9a;
  }

  .preview-shell {
    min-height: 0;
    overflow: auto;
    border: 1px solid #e9eaec;
    border-radius: 14px;
    background: #ffffff;
    box-shadow: 0 8px 24px -18px rgba(20, 21, 26, 0.28);
  }

  .meta-scroll {
    min-height: 0;
    overflow: auto;
    display: grid;
    gap: 14px;
    padding-right: 4px;
  }

  .meta-card {
    border: 1px solid #e9eaec;
    border-radius: 12px;
    background: #ffffff;
    padding: 12px;
    display: grid;
    gap: 10px;
  }

  .chip-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .chip {
    border: 1px solid #dee0e3;
    border-radius: 999px;
    background: #f7f7f8;
    color: #464a53;
    padding: 3px 8px;
    font-size: 12px;
    line-height: 16px;
    white-space: nowrap;
  }

  .token-list {
    margin: 0;
    padding: 0;
    list-style: none;
    max-height: 320px;
    overflow: auto;
    display: grid;
    gap: 6px;
  }

  .token-item {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 12px;
    line-height: 16px;
    color: #333333;
    background: #f7f7f8;
    border: 1px solid #e9eaec;
    border-radius: 8px;
    padding: 6px 8px;
    word-break: break-all;
  }

  @media (max-width: 1180px) {
    .explorer-layout {
      grid-template-columns: 250px minmax(0, 1fr);
    }

    .right-panel {
      grid-column: 1 / -1;
      border-width: 1px 0 0 0;
      max-height: 42vh;
    }

    .main-panel {
      border-left: 1px solid #e9eaec;
    }
  }

  @media (max-width: 840px) {
    .explorer-layout {
      grid-template-columns: 1fr;
      grid-template-rows: 240px minmax(0, 1fr) 42vh;
    }

    .left-panel {
      border-width: 0 0 1px 0;
    }

    .main-panel {
      border-left: 0;
      border-top: 0;
    }

    .right-panel {
      border-width: 1px 0 0 0;
    }
  }
`;

function textStyle(token: {
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

function StatsChips({ label, values }: { label: string; values: Array<string | number> }) {
  return (
    <div style={{ display: 'grid', gap: spacing.scale['6'] }}>
      <div style={{ ...textStyle(typography.scale.captionM.medium), color: textBase.staticDarkSecondary }}>{label}</div>
      <div className="chip-wrap">
        {values.length > 0 ? (
          values.map((value) => (
            <span key={`${label}-${value}`} className="chip">
              {value}
            </span>
          ))
        ) : (
          <span className="chip">없음</span>
        )}
      </div>
    </div>
  );
}

function ExplorerApp() {
  const [keyword, setKeyword] = useState('');
  const [selectedId, setSelectedId] = useState<ComponentId>(COMPONENTS[0].id);

  const filteredComponents = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();

    if (!normalized) {
      return COMPONENTS;
    }

    return COMPONENTS.filter((component) => {
      return component.label.toLowerCase().includes(normalized) || component.id.toLowerCase().includes(normalized);
    });
  }, [keyword]);

  const activeId = useMemo(() => {
    const hasSelected = filteredComponents.some((component) => component.id === selectedId);

    if (hasSelected) {
      return selectedId;
    }

    return filteredComponents[0]?.id ?? COMPONENTS[0].id;
  }, [filteredComponents, selectedId]);

  const selectedComponent = COMPONENTS.find((component) => component.id === activeId) ?? COMPONENTS[0];
  const SelectedPreview = selectedComponent.Preview;
  const metadata = componentMetadata[selectedComponent.id];

  return (
    <>
      <style>{APP_CSS}</style>
      <div className="explorer-layout">
        <aside className="panel left-panel">
          <header style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <h1
              style={{
                margin: spacing.scale['0'],
                ...textStyle(typography.scale.h5.semiBold),
                color: textBase.staticDark,
              }}
            >
              309 Design Explorer
            </h1>
            <p
              style={{
                margin: spacing.scale['0'],
                ...textStyle(typography.scale.captionM.regular),
                color: textBase.staticDarkSecondary,
              }}
            >
              컴포넌트 {COMPONENTS.length}개
            </p>
          </header>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span style={{ ...textStyle(typography.scale.captionM.medium), color: textBase.staticDarkSecondary }}>검색</span>
            <input
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="컴포넌트 이름"
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
                backgroundColor: palette.base.white,
                color: textBase.staticDark,
                outline: 'none',
                ...textStyle(typography.scale.captionL.regular),
              }}
            />
          </label>

          <div className="component-list">
            {filteredComponents.length > 0 ? (
              filteredComponents.map((component) => {
                const active = component.id === activeId;

                return (
                  <button
                    key={component.id}
                    type="button"
                    className={`component-item${active ? ' active' : ''}`}
                    onClick={() => setSelectedId(component.id)}
                  >
                    <span style={{ ...textStyle(typography.scale.captionL.medium) }}>{component.label}</span>
                    <span style={{ ...textStyle(typography.scale.captionM.regular), opacity: 0.75 }}>{component.id}</span>
                  </button>
                );
              })
            ) : (
              <div
                style={{
                  borderStyle: 'solid',
                  borderWidth: border.width['1'],
                  borderColor: palette.gray['3'],
                  borderRadius: radius.scale.md,
                  backgroundColor: palette.base.white,
                  padding: spacing.scale['12'],
                  color: textBase.staticDarkSecondary,
                  ...textStyle(typography.scale.captionL.regular),
                }}
              >
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </aside>

        <main className="panel main-panel">
          <header
            style={{
              borderStyle: 'solid',
              borderWidth: border.width['1'],
              borderColor: palette.gray['3'],
              borderRadius: radius.scale.xl,
              backgroundColor: palette.base.white,
              padding: spacing.scale['12'],
              display: 'grid',
              gap: spacing.scale['4'],
            }}
          >
            <h2
              style={{
                margin: spacing.scale['0'],
                ...textStyle(typography.scale.h6.medium),
                color: textBase.staticDark,
              }}
            >
              {selectedComponent.label} Preview
            </h2>
            <p
              style={{
                margin: spacing.scale['0'],
                ...textStyle(typography.scale.captionM.regular),
                color: textBase.staticDarkSecondary,
              }}
            >
              좌측 목록에서 컴포넌트를 선택하면 프리뷰와 메타데이터가 동기화됩니다.
            </p>
          </header>

          <section className="preview-shell">
            <SelectedPreview />
          </section>
        </main>

        <aside className="panel right-panel">
          <header style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <h3
              style={{
                margin: spacing.scale['0'],
                ...textStyle(typography.scale.h6.medium),
                color: textBase.staticDark,
              }}
            >
              Token & Style Inspector
            </h3>
            <p
              style={{
                margin: spacing.scale['0'],
                ...textStyle(typography.scale.captionM.regular),
                color: textBase.staticDarkSecondary,
              }}
            >
              {selectedComponent.id} 기준 추출 정보
            </p>
          </header>

          <div className="meta-scroll">
            <section className="meta-card">
              <div style={{ ...textStyle(typography.scale.captionM.medium), color: textBase.staticDarkSecondary }}>파일 경로</div>
              <div style={{ display: 'grid', gap: spacing.scale['4'] }}>
                <div className="token-item">Source: {metadata.sourcePath}</div>
                <div className="token-item">Docs: {metadata.docsPath}</div>
              </div>
            </section>

            <section className="meta-card">
              <div style={{ ...textStyle(typography.scale.captionM.medium), color: textBase.staticDarkSecondary }}>
                사용 토큰 ({metadata.tokens.length})
              </div>
              <ul className="token-list">
                {metadata.tokens.length > 0 ? (
                  metadata.tokens.map((token) => (
                    <li key={token} className="token-item">
                      {token}
                    </li>
                  ))
                ) : (
                  <li className="token-item">토큰 정보가 없습니다.</li>
                )}
              </ul>
            </section>

            <section className="meta-card">
              <div style={{ ...textStyle(typography.scale.captionM.medium), color: textBase.staticDarkSecondary }}>스타일 수치</div>
              <StatsChips label="Spacing Scale" values={metadata.styleNumbers.spacingScale} />
              <StatsChips label="Spacing Primitive" values={metadata.styleNumbers.spacingPrimitive} />
              <StatsChips label="Border Width" values={metadata.styleNumbers.borderWidths} />
              <StatsChips label="Radius Scale" values={metadata.styleNumbers.radiusScale} />
              <StatsChips label="Typography Scale" values={metadata.styleNumbers.typographyScale} />
            </section>
          </div>
        </aside>
      </div>
    </>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ExplorerApp />
  </React.StrictMode>,
);
