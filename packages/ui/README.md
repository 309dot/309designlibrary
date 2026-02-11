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
