import {
  Button,
  Container,
  Divider,
  render,
  Stack,
  Text,
  Textbox,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities'
import { h, JSX } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

// TODO: 실제 한스펠 API 연동 시 이 타입과 함수를 교체하세요
interface SpellError {
  token: string
  suggestions: string[]
  help: string
}

interface TextItem {
  id: string
  text: string
  errors?: SpellError[]
}

// TODO: 서버 또는 npm 패키지(node-hanspell 등)를 통해 실제 맞춤법 검사 로직으로 교체
async function checkSpelling(text: string): Promise<SpellError[]> {
  console.log('맞춤법 검사 요청:', text)
  // 예시: 항상 빈 배열 반환 (실제 API 연동 전 placeholder)
  return []
}

function Plugin() {
  const [items, setItems] = useState<TextItem[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [manualText, setManualText] = useState('')

  // 메인 스레드에서 선택된 텍스트 노드 데이터 수신
  useEffect(() => {
    on('SELECTED_TEXT', ({ texts }: { texts: { id: string; text: string }[] }) => {
      setItems(texts.map((t) => ({ ...t })))
    })
  }, [])

  const handleGetSelected = useCallback(() => {
    emit('GET_SELECTED_TEXT')
  }, [])

  const handleCheck = useCallback(async () => {
    setIsChecking(true)
    const targets = items.length > 0 ? items : [{ id: '__manual__', text: manualText }]
    const results = await Promise.all(
      targets.map(async (item) => ({
        ...item,
        errors: await checkSpelling(item.text),
      }))
    )
    setItems(results)
    setIsChecking(false)
  }, [items, manualText])

  const handleApply = useCallback((nodeId: string, correctedText: string) => {
    emit('APPLY_CORRECTION', { nodeId, correctedText })
  }, [])

  const hasSelection = items.length > 0

  return (
    <Container space="medium">
      <VerticalSpace space="medium" />

      <Stack space="small">
        <Button fullWidth onClick={handleGetSelected} secondary>
          선택한 텍스트 가져오기
        </Button>

        {!hasSelection && (
          <Textbox
            onValueInput={setManualText}
            placeholder="또는 여기에 텍스트를 직접 입력하세요"
            value={manualText}
          />
        )}
      </Stack>

      <VerticalSpace space="small" />
      <Divider />
      <VerticalSpace space="small" />

      {hasSelection && (
        <Stack space="extraSmall">
          <Text>선택된 텍스트 노드 ({items.length}개)</Text>
          {items.map((item) => (
            <ItemRow key={item.id} item={item} onApply={handleApply} />
          ))}
        </Stack>
      )}

      <VerticalSpace space="medium" />
      <Button
        disabled={isChecking || (!hasSelection && manualText.trim() === '')}
        fullWidth
        loading={isChecking}
        onClick={handleCheck}
      >
        {isChecking ? '검사 중...' : '맞춤법 검사'}
      </Button>
      <VerticalSpace space="medium" />
    </Container>
  )
}

function ItemRow({
  item,
  onApply,
}: {
  item: TextItem
  onApply: (nodeId: string, corrected: string) => void
}): JSX.Element {
  const [corrected, setCorrected] = useState(item.text)
  const hasErrors = item.errors && item.errors.length > 0

  return (
    <Stack space="extraSmall">
      <Textbox onValueInput={setCorrected} value={corrected} />
      {hasErrors && (
        <Stack space="extraSmall">
          {item.errors!.map((err, i) => (
            <Text key={i}>
              {err.token} → {err.suggestions[0] ?? '?'} ({err.help})
            </Text>
          ))}
        </Stack>
      )}
      {item.id !== '__manual__' && (
        <Button onClick={() => onApply(item.id, corrected)} secondary>
          피그마에 적용
        </Button>
      )}
    </Stack>
  )
}

export default render(Plugin)
