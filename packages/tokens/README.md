# Tokens

로컬 `tokens.json`(Token Studio 내보내기)을 CSS 변수와 TypeScript 상수로 변환합니다.

## 생성 방법
```bash
python3 /Users/a309/Documents/Agent309/wOpenclaw/scripts/build_tokens.py
```

## 출력 파일
- `/Users/a309/Documents/Agent309/wOpenclaw/packages/tokens/src/tokens.css`
- `/Users/a309/Documents/Agent309/wOpenclaw/packages/tokens/src/tokens.ts`

## 사용 예시 (CSS)
```css
@import "./tokens.css";

:root {
  /* 필요 시 theme/device data-attribute 지정 */
  /* data-theme="light|dark", data-device="desktop|mobile" */
}
```

## 사용 예시 (TS)
```ts
import { theme, device } from "./tokens";
```
