import { Element } from 'hastscript/lib/core'
import { getHighlighter, Highlighter } from 'shiki'
import { toHtml } from 'hast-util-to-html'
import { codeToHast, renderToHast } from '../src'
import fs from 'fs'
let globalHighlighter: Highlighter
let globalTree: Element

beforeAll(async () => {
  globalHighlighter = await getHighlighter({
    theme: 'nord',
  })

  const tokens = globalHighlighter.codeToThemedTokens(
    'console.log("Hello World")',
    'js'
  )

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
    `"<pre class=\\"shiki\\" style=\\"background-color: #fff\\"><code><span class=\\"line\\"><span style=\\"color: #D8DEE9\\">console</span><span style=\\"color: #ECEFF4\\">.</span><span style=\\"color: #88C0D0\\">log</span><span style=\\"color: #D8DEE9FF\\">(</span><span style=\\"color: #ECEFF4\\">\\"</span><span style=\\"color: #A3BE8C\\">Hello World</span><span style=\\"color: #ECEFF4\\">\\"</span><span style=\\"color: #D8DEE9FF\\">)</span></span></code></pre>"`
  )
})

it('has defaults with theme', () => {
  const tree = codeToHast(
    globalHighlighter,
    'const test = () => {\n  console.log("Hello World!")\n}',
    'js'
  )

  expect(toHtml(tree)).toMatchInlineSnapshot(`
    "<pre class=\\"shiki\\" style=\\"background-color: #2e3440ff\\"><code><span class=\\"line\\"><span style=\\"color: #81A1C1\\">const</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #88C0D0\\">test</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #81A1C1\\">=</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #ECEFF4\\">()</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #81A1C1\\">=></span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #ECEFF4\\">{</span></span>
    <span class=\\"line\\"><span style=\\"color: #D8DEE9FF\\">  </span><span style=\\"color: #D8DEE9\\">console</span><span style=\\"color: #ECEFF4\\">.</span><span style=\\"color: #88C0D0\\">log</span><span style=\\"color: #D8DEE9FF\\">(</span><span style=\\"color: #ECEFF4\\">\\"</span><span style=\\"color: #A3BE8C\\">Hello World!</span><span style=\\"color: #ECEFF4\\">\\"</span><span style=\\"color: #D8DEE9FF\\">)</span></span>
    <span class=\\"line\\"><span style=\\"color: #ECEFF4\\">}</span></span></code></pre>"
  `)
})

it('uses correct theme', async () => {
  const highlighter = await getHighlighter({
    themes: ['nord', 'poimandres'],
  })

  const tree = codeToHast(
    highlighter,
    'const test = () => {\n  console.log("Hello World!")\n}',
    'js',
    'poimandres'
  )

  expect(toHtml(tree)).toMatchInlineSnapshot(`
    "<pre class=\\"shiki\\" style=\\"background-color: #1b1e28\\"><code><span class=\\"line\\"><span style=\\"color: #91B4D5\\">const</span><span style=\\"color: #A6ACCD\\"> </span><span style=\\"color: #ADD7FF\\">test</span><span style=\\"color: #A6ACCD\\"> </span><span style=\\"color: #91B4D5\\">=</span><span style=\\"color: #A6ACCD\\"> () </span><span style=\\"color: #91B4D5\\">=></span><span style=\\"color: #A6ACCD\\"> {</span></span>
    <span class=\\"line\\"><span style=\\"color: #A6ACCD\\">  </span><span style=\\"color: #E4F0FB\\">console</span><span style=\\"color: #A6ACCD\\">.</span><span style=\\"color: #E4F0FBD0\\">log</span><span style=\\"color: #A6ACCD\\">(</span><span style=\\"color: #A6ACCD\\">\\"</span><span style=\\"color: #5DE4C7\\">Hello World!</span><span style=\\"color: #A6ACCD\\">\\"</span><span style=\\"color: #A6ACCD\\">)</span></span>
    <span class=\\"line\\"><span style=\\"color: #A6ACCD\\">}</span></span></code></pre>"
  `)
})

it('has proper encoding', async () => {
  const tree = codeToHast(
    globalHighlighter,
    `<div>
      <span>hello</span>
    </div>`,
    'html'
  )

  expect(toHtml(tree)).toMatchInlineSnapshot(`
    "<pre class=\\"shiki\\" style=\\"background-color: #2e3440ff\\"><code><span class=\\"line\\"><span style=\\"color: #81A1C1\\">&#x3C;div></span></span>
    <span class=\\"line\\"><span style=\\"color: #D8DEE9FF\\">      </span><span style=\\"color: #81A1C1\\">&#x3C;span></span><span style=\\"color: #D8DEE9FF\\">hello</span><span style=\\"color: #81A1C1\\">&#x3C;/span></span></span>
    <span class=\\"line\\"><span style=\\"color: #D8DEE9FF\\">    </span><span style=\\"color: #81A1C1\\">&#x3C;/div></span></span></code></pre>"
  `)
})

it('adds optional line classes', () => {
  const tree = codeToHast(
    globalHighlighter,
    'const test = () => {\n  console.log("Hello World!")\n}',
    'js',
    undefined,
    { lineOptions: [{ line: 2, classes: ['highlighted'] }] }
  )

  expect(toHtml(tree)).toMatchInlineSnapshot(`
    "<pre class=\\"shiki\\" style=\\"background-color: #2e3440ff\\"><code><span class=\\"line\\"><span style=\\"color: #81A1C1\\">const</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #88C0D0\\">test</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #81A1C1\\">=</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #ECEFF4\\">()</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #81A1C1\\">=></span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #ECEFF4\\">{</span></span>
    <span class=\\"line highlighted\\"><span style=\\"color: #D8DEE9FF\\">  </span><span style=\\"color: #D8DEE9\\">console</span><span style=\\"color: #ECEFF4\\">.</span><span style=\\"color: #88C0D0\\">log</span><span style=\\"color: #D8DEE9FF\\">(</span><span style=\\"color: #ECEFF4\\">\\"</span><span style=\\"color: #A3BE8C\\">Hello World!</span><span style=\\"color: #ECEFF4\\">\\"</span><span style=\\"color: #D8DEE9FF\\">)</span></span>
    <span class=\\"line\\"><span style=\\"color: #ECEFF4\\">}</span></span></code></pre>"
  `)
})
