# 한스펠 (Hanspell) — Figma 플러그인

피그마 문서 내 텍스트 노드의 한국어 맞춤법을 검사하는 플러그인입니다.

> **이 저장소는 표준 템플릿으로도 사용할 수 있습니다.**  
> `@create-figma-plugin` 기반의 TypeScript + Preact + ESLint + Prettier 구성입니다.

---

## 시작 전 체크리스트

새 플러그인으로 사용할 때 반드시 수정해야 할 항목입니다.

- [ ] `package.json` → `figma-plugin.id` 를 Figma 개발자 설정에서 발급받은 ID로 교체  
      (현재 값: `TODO_REPLACE_WITH_FIGMA_PLUGIN_ID`)
- [ ] `package.json` → `figma-plugin.name` 을 플러그인 이름으로 변경
- [ ] `src/ui.tsx` → `checkSpelling()` 함수를 실제 한스펠 API 호출로 교체
- [ ] `src/main.ts` → 비즈니스 로직 구현

---

## 프로젝트 구조

```
src/
├── main.ts      # 메인 스레드: Figma API 접근, 노드 읽기/쓰기
├── ui.tsx       # UI 스레드: 사용자 인터페이스 (Preact)
└── global.d.ts  # Figma 플러그인 타입 참조
```

### 메인 스레드 ↔ UI 스레드 통신 패턴

```
UI 스레드               메인 스레드
─────────               ──────────
emit('EVENT', data) ──→ on('EVENT', handler)
                         ↓ Figma API 처리
postMessage(result)  ←── figma.ui.postMessage(result)
```

---

## 개발 환경

- [Node.js](https://nodejs.org) v22+
- [Figma 데스크탑 앱](https://figma.com/downloads/)

---

## 스크립트

```bash
npm run build    # 타입 체크 + 번들 빌드 (build/ 디렉토리 생성)
npm run watch    # 파일 변경 감지 후 자동 재빌드
npm run lint     # ESLint 검사
npm run format   # Prettier 자동 포맷
```

---

## 플러그인 설치 (로컬 개발)

1. `npm run build` 실행
2. Figma 데스크탑 앱에서 문서 열기
3. Quick Actions 검색창에서 `Import plugin from manifest…` 실행
4. 생성된 `manifest.json` 파일 선택

### 디버깅

`console.log` 를 사용하여 값을 확인하세요.  
Figma Quick Actions에서 `Show/Hide Console` 을 실행하면 개발자 콘솔이 열립니다.

---

## 참고 자료

- [Create Figma Plugin 문서](https://yuanqing.github.io/create-figma-plugin/)
- [Figma Plugin API 문서](https://figma.com/plugin-docs/)
- [figma/plugin-samples](https://github.com/figma/plugin-samples#readme)
