# shiki-renderer-hast

hast renderer for Shiki

## Installation

```shell
npm install shiki-renderer-hast
```

## Usage

```js
import shiki from 'shiki'
import { codeToHast } from 'shiki-renderer-hast'
;(async () => {
  const highlighter = await shiki.getHighlighter({
    theme: 'nord',
  })

  const code = fs.readFileSync('gen-hast.js', 'utf-8')

  const tree = codeToHast(highlighter, code, 'js')

  // work with tree...
})()
```
