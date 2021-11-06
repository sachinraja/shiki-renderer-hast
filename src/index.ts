import { h } from 'hastscript'
import { IThemedToken, FontStyle, Theme, Lang, Highlighter } from 'shiki'

/**
 * @see https://github.com/shikijs/shiki/blob/main/packages/shiki/src/types.ts#L171-L176
 */
// necessary for autocomplete
// eslint-disable-next-line @typescript-eslint/ban-types
type StringLiteralUnion<T extends U, U = string> = T | (U & {})

export type HastRendererOptions = {
  langId?: string
  fg?: string
  bg?: string
}

export const renderToHast = (
  lines: IThemedToken[][],
  options: HastRendererOptions = {}
) => {
  const bg = options.bg ?? '#fff'

  const root = h('pre', { class: 'shiki', style: { 'background-color': bg } })

  if (options.langId) {
    root.children.push(h('div', { class: 'language-id' }, options.langId))
  }

  const codeElement = h('code')
  root.children.push(codeElement)

  for (const line of lines) {
    const lineSpan = h('span', { class: 'line' })

    codeElement.children.push(lineSpan)

    for (const token of line) {
      const cssDeclarations: Record<string, string> = {}

      const color = token.color ?? options.fg
      if (color) cssDeclarations.color = color

      if (token.fontStyle) {
        if (FontStyle.Italic) {
          cssDeclarations['font-style'] = 'italic'
        } else if (FontStyle.Bold) {
          cssDeclarations['font-weight'] = 'bold'
        } else if (FontStyle.Underline) {
          cssDeclarations['text-decoration'] = 'underline'
        }
      }

      const properties: Record<string, Record<string, string>> = {}
      if (Object.keys(cssDeclarations).length > 0) {
        properties.style = cssDeclarations
      }

      lineSpan.children.push(h('span', properties, token.content))
    }

    lineSpan.children.push(h('br'))
  }

  return root
}

export const codeToHast = (
  highlighter: Highlighter,
  code: string,
  lang: StringLiteralUnion<Lang> | undefined = 'text',
  theme?: StringLiteralUnion<Theme>
) => {
  const tokens = highlighter.codeToThemedTokens(code, lang, theme, {
    includeExplanation: false,
  })

  const loadedTheme = highlighter.getTheme(theme)

  return renderToHast(tokens, {
    fg: loadedTheme.fg,
    bg: loadedTheme.bg,
  })
}
