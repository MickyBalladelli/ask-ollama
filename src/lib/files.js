export const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp']

export function isImageFile(file) {
  const fileName = file.name.toLowerCase()

  return file.type.startsWith('image/') || imageExtensions.some(extension => fileName.endsWith(extension))
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('load', () => resolve(reader.result))
    reader.addEventListener('error', () => reject(reader.error))
    reader.readAsDataURL(file)
  })
}
