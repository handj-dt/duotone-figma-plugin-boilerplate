# Duotone Figma Plugin Boilerplate

듀오톤 사내 표준 피그마 플러그인 보일러플레이트입니다.  
새 플러그인을 시작할 때 이 저장소를 복사해 사용하세요.

260426 한대진 ver 1.0

---

## 기술 스택

| 항목 | 선택 | 이유 |
|---|---|---|
| 빌드 도구 | `@create-figma-plugin/build` (esbuild 기반) | 공식 커뮤니티 표준, 번들 최적화 |
| 언어 | TypeScript | 타입 안전성, Figma API 자동완성 |
| UI 프레임워크 | Preact + `@create-figma-plugin/ui` | Figma 네이티브 UI 컴포넌트 제공 |
| 린터 | ESLint + TypeScript ESLint | 코드 품질 |
| 포매터 | Prettier | 코드 스타일 일관성 |

---

## 새 플러그인 시작하기

### 1. 저장소 복제

```bash
npx degit handj-dt/duotone-figma-plugin-boilerplate 프로젝트명

cd 프로젝트명
npm install
```

### 2. 필수 수정 항목 (체크리스트)

- [ ] `package.json` → `name`: 플러그인 저장소 이름으로 변경  
      예) `"duotone-figma-plugin-my-feature"`
- [ ] `package.json` → `figma-plugin.id`: Figma 개발자 설정에서 발급한 ID로 교체  
      → Figma 데스크탑 앱 ▸ 플러그인 탭 ▸ 개발 중 ▸ `+` 버튼 ▸ 새 ID 발급
- [ ] `package.json` → `figma-plugin.name`: 사용자에게 보이는 플러그인 이름으로 변경
- [ ] `src/main.ts` → `showUI` 의 `title` / `width` / `height` 수정
- [ ] `src/main.ts` → `handleRun()` 에 플러그인 핵심 로직 구현
- [ ] `src/ui.tsx` → 플러그인 UI 구성

---

## 프로젝트 구조

```
src/
├── main.ts      # 메인 스레드: Figma API 접근 전담 (DOM 없음)
├── ui.tsx       # UI 스레드: 사용자 인터페이스 (Preact)
└── global.d.ts  # @figma/plugin-typings 타입 참조
```

### 두 스레드의 역할 분리

| | 메인 스레드 (`main.ts`) | UI 스레드 (`ui.tsx`) |
|---|---|---|
| 접근 가능 | `figma.*` API | DOM, 브라우저 API |
| 접근 불가 | DOM, fetch | `figma.*` API |
| 역할 | 노드 읽기/쓰기, 폰트 로딩 | 입력 받기, 결과 표시 |

### 스레드 간 통신 패턴

```
UI 스레드                          메인 스레드
─────────                          ──────────
emit('RUN')              ────────▶ on('RUN', handler)
                                    ↓ Figma API 처리
setResult(count)  ◀──────────────  figma.ui.postMessage(...)
```

`@create-figma-plugin/utilities`의 `emit` / `on` 을 사용합니다.  
메인 → UI 방향은 `figma.ui.postMessage()` + UI에서 `on()`으로 수신합니다.

---

## 개발 가이드

### 환경 요구사항

- [Node.js](https://nodejs.org) v22+
- [Figma 데스크탑 앱](https://figma.com/downloads/)

### 개발 스크립트

```bash
npm run build    # 타입 체크 + 프로덕션 번들 빌드
npm run watch    # 파일 변경 감지 → 자동 재빌드 (개발 시 사용)
npm run lint     # ESLint 검사
npm run format   # Prettier 자동 포맷
```

### 로컬 설치 및 테스트

1. `npm run build` 실행 → `build/` 와 `manifest.json` 생성
2. Figma 데스크탑 앱에서 피그마 문서 열기
3. Quick Actions (`Cmd/Ctrl + /`) → `Import plugin from manifest…` 검색 후 실행
4. 생성된 `manifest.json` 파일 선택

### 디버깅

`console.log()` 로 값을 출력한 뒤, Figma Quick Actions에서 `Show/Hide Console` 을 실행하면 개발자 콘솔을 열 수 있습니다.

> **주의**: 메인 스레드(`main.ts`)와 UI 스레드(`ui.tsx`)의 콘솔은 별개입니다.

---

## 코딩 컨벤션

- 이벤트 이름은 `SCREAMING_SNAKE_CASE` 사용 (예: `'RUN'`, `'APPLY_CHANGE'`)
- 메인 스레드에서 UI로 데이터를 보낼 때는 항상 `type` 필드를 포함한 객체 사용
- `async` 핸들러에서 폰트 접근 시 반드시 `figma.loadFontAsync()` 선행 호출

---

## 참고 자료

- [Create Figma Plugin 문서](https://yuanqing.github.io/create-figma-plugin/)
- [Figma Plugin API 문서](https://figma.com/plugin-docs/)
- [figma/plugin-samples](https://github.com/figma/plugin-samples#readme)
