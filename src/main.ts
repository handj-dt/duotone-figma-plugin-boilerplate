import { on, showUI } from '@create-figma-plugin/utilities'

// UI → 메인 스레드로 오는 이벤트 핸들러
function handleGetSelectedText() {
  const textNodes = figma.currentPage.selection.filter(
    (node): node is TextNode => node.type === 'TEXT'
  )

  const texts = textNodes.map((node) => ({
    id: node.id,
    text: node.characters,
  }))

  figma.ui.postMessage({ type: 'SELECTED_TEXT', texts })
}

async function handleApplyCorrection({
  nodeId,
  correctedText,
}: {
  nodeId: string
  correctedText: string
}) {
  const node = figma.getNodeById(nodeId) as TextNode | null
  if (!node || node.type !== 'TEXT') return

  await figma.loadFontAsync(node.fontName as FontName)
  node.characters = correctedText
}

export default function () {
  on('GET_SELECTED_TEXT', handleGetSelectedText)
  on('APPLY_CORRECTION', handleApplyCorrection)

  showUI({ height: 480, width: 360, title: '한스펠 맞춤법 검사' })
}
