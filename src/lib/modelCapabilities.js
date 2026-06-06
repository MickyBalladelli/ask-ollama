export function getModelCapabilities(modelName) {
  const name = modelName.toLowerCase()
  const capabilities = ['text']

  if (['vision', 'llava', 'bakllava', 'moondream', 'minicpm-v', 'gemma3'].some(part => name.includes(part))) {
    capabilities.push('vision')
  }

  if (['code', 'coder', 'deepseek', 'qwen'].some(part => name.includes(part))) {
    capabilities.push('code')
  }

  if (['32k', '64k', '128k', '200k', '1m'].some(part => name.includes(part))) {
    capabilities.push('large context')
  }

  return capabilities
}
