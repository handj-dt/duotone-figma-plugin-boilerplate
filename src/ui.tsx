import { Button, Container, render, Text, VerticalSpace } from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

// ─── 타입 정의 ─────────────────────────────────────────────────────────────────
// TODO: 플러그인에 필요한 데이터 타입을 여기에 정의하세요.

// ─── 메인 컴포넌트 ──────────────────────────────────────────────────────────────
function Plugin() {
  // TODO: 플러그인 상태를 여기에 추가하세요.
  const [result, setResult] = useState<string | null>(null)

  // 메인 스레드 → UI 로 오는 메시지 수신
  useEffect(() => {
    on('RUN_RESULT', ({ count }: { count: number }) => {
      setResult(`선택된 노드: ${count}개`)
    })
  }, [])

  // UI → 메인 스레드로 이벤트 emit
  const handleRun = useCallback(() => {
    // TODO: 실행할 작업 이름과 데이터를 emit으로 전달하세요.
    emit('RUN')
  }, [])

  const handleClose = useCallback(() => {
    emit('CLOSE')
  }, [])

  return (
    <Container space="medium">
      <VerticalSpace space="large" />

      {/* TODO: 플러그인 UI를 여기에 구성하세요. */}
      <Text>{result ?? '실행 버튼을 눌러 시작하세요.'}</Text>

      <VerticalSpace space="medium" />
      <Button fullWidth onClick={handleRun}>
        실행
      </Button>
      <VerticalSpace space="small" />
      <Button fullWidth onClick={handleClose} secondary>
        닫기
      </Button>
      <VerticalSpace space="medium" />
    </Container>
  )
}

export default render(Plugin)
