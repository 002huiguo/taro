import * as webpack from 'webpack'
import { getOptions, stringifyRequest } from 'loader-utils'
import * as path from 'path'

export default function (this: webpack.loader.LoaderContext) {
  const options = getOptions(this)
  const stringify = (s: string): string => stringifyRequest(this, s)
  let componentPath = options.framework === 'vue'
    ? `${this.resourcePath}`
    : this.request.split('!').slice(1).join('!')
  const prerender = `
if (typeof PRERENDER !== 'undefined') {
  global._prerender = inst
}`
  componentPath = componentPath.replace(path.basename(componentPath), options.oriFile)
  return `import { createPageConfig } from '@tarojs/runtime'
import component from ${stringify(componentPath)}
var inst = Page(createPageConfig(component, '${options.name}'))
${options.prerender ? prerender : ''}
`
}
