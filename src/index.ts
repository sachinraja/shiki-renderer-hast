import { h } from 'hastscript'
import { IThemedToken, FontStyle, Theme, Lang, Highlighter } from 'shiki'

/**
 * @see https://github.com/shikijs/shiki/blob/main/packages/shiki/src/types.ts#L171-L176
 */
// necessary for autocomplete
// eslint-disable-next-line @typescript-eslint/ban-types
type StringLiteralUnion<T extends U, U = string> = T | (U & {})

type LineOption = { line: number; classes?: string[] }

export type HastRendererOptions = {
  langId?: string
  fg?: string
  bg?: string
  lineOptions?: LineOption[]
}

export const renderToHast = (
  lines: IThemedToken[][],
  options: HastRendererOptions = {}
) => {
  const bg = options.bg ?? '#fff'
  const optionsByLineNumber = groupBy(
    options.lineOptions ?? [],
    (option) => option.line
  )

  const root = h('pre', { class: 'shiki', style: { 'background-color': bg } })

  if (options.langId) {
    root.children.push(h('div', { class: 'language-id' }, options.langId))
  }

  const codeElement = h('code')
  root.children.push(codeElement)

  for (const [lineIndex, line] of lines.entries()) {
    const lineNumber = lineIndex + 1
    const lineOptions = optionsByLineNumber.get(lineNumber) ?? []
    const lineClasses = getLineClasses(lineOptions)
    const lineSpan = h('span', { className: lineClasses })

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

    codeElement.children.push(h('br'))
  }

  codeElement.children.pop()

  return root
}

/* eslint max-params: ["error", 5] */
export const codeToHast = (
  highlighter: Highlighter,
  code: string,
  lang: StringLiteralUnion<Lang> | undefined = 'text',
  theme?: StringLiteralUnion<Theme>,
  options?: HastRendererOptions
) => {
  const tokens = highlighter.codeToThemedTokens(code, lang, theme, {
    includeExplanation: false,
  })

  const loadedTheme = highlighter.getTheme(theme)

  return renderToHast(tokens, {
    fg: loadedTheme.fg,
    bg: loadedTheme.bg,
    ...options,
  })
}

function groupBy<T, K>(
  elements: T[],
  keyGetter: (element: T) => K
): Map<K, T[]> {
  const map = new Map<K, T[]>()

  for (const element of elements) {
    const key = keyGetter(element)
    if (map.has(key)) {
      const group = map.get(key)!
      group.push(element)
    } else {
      map.set(key, [element])
    }
  }

  return map
}

function getLineClasses(lineOptions: LineOption[]): string[] {
  const lineClasses = new Set(['line'])

  for (const lineOption of lineOptions) {
    for (const lineClass of lineOption.classes ?? []) {
      lineClasses.add(lineClass)
    }
  }

  return Array.from(lineClasses)
}
