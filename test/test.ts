import { Element } from 'hastscript/lib/core'
import { getHighlighter, Highlighter } from 'shiki'
import { toHtml } from 'hast-util-to-html'
import { codeToHast, renderToHast } from '../src'

let globalHighlighter: Highlighter
let globalTree: Element

beforeAll(async () => {
  globalHighlighter = await getHighlighter({
    theme: 'nord',
  })

  const tokens = globalHighlighter.codeToThemedTokens('const x = 1', 'js')

  globalTree = renderToHast(tokens)
})

it('has background color', async () => {
  expect(globalTree.properties?.style).toContain('background-color')
})

it('has a code child', async () => {
  // @ts-expect-error this does exists
  expect(globalTree.children[0].tagName).toBe('code')
})

it('renders html', () => {
  expect(toHtml(globalTree)).toMatchInlineSnapshot(
    `"<pre class=\\"shiki\\" style=\\"background-color: #fff\\"><code><span class=\\"line\\"><span style=\\"color: #81A1C1\\">const</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #D8DEE9\\">x</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #81A1C1\\">=</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #B48EAD\\">1</span></span></code></pre>"`
  )
})

it('has defaults with theme', () => {
  const tree = codeToHast(
    globalHighlighter,
    'const test = () => {\n  console.log("Hello World!")\n}',
    'js'
  )

  expect(toHtml(tree)).toMatchInlineSnapshot(
    `"<pre class=\\"shiki\\" style=\\"background-color: #2e3440ff\\"><code><span class=\\"line\\"><span style=\\"color: #81A1C1\\">const</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #88C0D0\\">test</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #81A1C1\\">=</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #ECEFF4\\">()</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #81A1C1\\">=&#x26;gt;</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #ECEFF4\\">{</span></span><span class=\\"line\\"><span style=\\"color: #D8DEE9FF\\">  </span><span style=\\"color: #D8DEE9\\">console</span><span style=\\"color: #ECEFF4\\">.</span><span style=\\"color: #88C0D0\\">log</span><span style=\\"color: #D8DEE9FF\\">(</span><span style=\\"color: #ECEFF4\\">&#x26;quot;</span><span style=\\"color: #A3BE8C\\">Hello World!</span><span style=\\"color: #ECEFF4\\">&#x26;quot;</span><span style=\\"color: #D8DEE9FF\\">)</span></span><span class=\\"line\\"><span style=\\"color: #ECEFF4\\">}</span></span></code></pre>"`
  )
})

it('uses correct theme', async () => {
  const highlighter = await getHighlighter({
    themes: ['nord', 'poimandres'],
  })

  const tree = codeToHast(
    highlighter,
    'const test = () => {\n  console.log("Hello World!")\n}',
    'js'
  )

  expect(toHtml(tree)).toMatchInlineSnapshot(
    `"<pre class=\\"shiki\\" style=\\"background-color: #2e3440ff\\"><code><span class=\\"line\\"><span style=\\"color: #81A1C1\\">const</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #88C0D0\\">test</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #81A1C1\\">=</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #ECEFF4\\">()</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #81A1C1\\">=&#x26;gt;</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #ECEFF4\\">{</span></span><span class=\\"line\\"><span style=\\"color: #D8DEE9FF\\">  </span><span style=\\"color: #D8DEE9\\">console</span><span style=\\"color: #ECEFF4\\">.</span><span style=\\"color: #88C0D0\\">log</span><span style=\\"color: #D8DEE9FF\\">(</span><span style=\\"color: #ECEFF4\\">&#x26;quot;</span><span style=\\"color: #A3BE8C\\">Hello World!</span><span style=\\"color: #ECEFF4\\">&#x26;quot;</span><span style=\\"color: #D8DEE9FF\\">)</span></span><span class=\\"line\\"><span style=\\"color: #ECEFF4\\">}</span></span></code></pre>"`
  )
})
