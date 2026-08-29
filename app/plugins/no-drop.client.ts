export default defineNuxtPlugin(() => {
  // 拖文件到页面时阻止浏览器默认的“打开文件”行为
  const preventFileDrag = (event: DragEvent) => {
    if (event.dataTransfer?.types.includes('Files')) event.preventDefault()
  }

  window.addEventListener('dragover', preventFileDrag)
  window.addEventListener('drop', preventFileDrag)
})
