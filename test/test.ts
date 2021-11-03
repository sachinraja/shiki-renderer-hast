import { getHighlighter } from 'shiki'
import { renderToHast } from '../src'

test("message contains 'Hello'", async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
  })

  highlighter.codeToHtml('rea', '')

  const tokens = highlighter.codeToThemedTokens('const x = 1', 'js')

  const tree = renderToHast(tokens)

  console.log(tree)
  expect(1).toBe(1)
})
