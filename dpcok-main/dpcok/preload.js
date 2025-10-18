const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
    downloadYouTube: (data) => ipcRenderer.invoke('download-youtube', data),
    onDownloadProgress: (callback) => {
        ipcRenderer.on('download-progress', (event, progress) => callback(progress))
    }
})