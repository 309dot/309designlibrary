# UI

React 기반 최소 컴포넌트 세트입니다.

## 사용
```tsx
import "@309design/ui/src/styles.css";
import { Button, Badge, Tag } from "@309design/ui/src";
```

## 토큰 연동
먼저 토큰 CSS를 로드해야 합니다.
```css
@import "../../tokens/src/tokens.css";
```

앱 루트에 테마/디바이스를 지정하세요.
```html
<html data-theme="light" data-device="desktop">
```

## 타이포 스케일

유틸리티 클래스:
- `ui-text-display`
- `ui-text-h1` ~ `ui-text-h6`
- `ui-text-body-l` / `ui-text-body-m` / `ui-text-body-s`
- `ui-text-caption-l` / `ui-text-caption-m` / `ui-text-caption-s`

Spacing 변수:
- `--ui-space-0/1/2/3/4/5/6/8/10/12`
