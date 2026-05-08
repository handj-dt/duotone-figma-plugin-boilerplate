import { emit, on, showUI } from '@create-figma-plugin/utilities'

// ─── 이벤트 핸들러 ────────────────────────────────────────────────────────────
// UI 스레드에서 emit()으로 보낸 이벤트를 여기서 on()으로 수신합니다.
// 실제 플러그인 로직을 아래 핸들러에 구현하세요.

function handleRun() {
  // TODO: 플러그인 핵심 로직 구현
  // 예시: 현재 선택된 노드 수를 UI로 전달
  const count = figma.currentPage.selection.length
  emit('RUN_RESULT', { count })
}

function handleClose() {
  figma.closePlugin()
}

// ─── 플러그인 진입점 ───────────────────────────────────────────────────────────
export default function () {
  on('RUN', handleRun)
  on('CLOSE', handleClose)

  // TODO: 플러그인에 맞게 width / height / title 수정
  showUI({ height: 320, width: 300, title: '플러그인 이름' })
}
