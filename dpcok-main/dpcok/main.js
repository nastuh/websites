const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const ytdl = require('ytdl-core')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('ffmpeg-static').replace('app.asar', 'app.asar.unpacked')
ffmpeg.setFfmpegPath(ffmpegPath)

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        title: 'Electron Music Player',
        icon: path.join(__dirname, 'assets', 'icon.png')
    })

    mainWindow.loadFile('index.html')

    // Открываем DevTools в режиме разработки
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools()
    }

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

// API для взаимодействия с интерфейсом
ipcMain.handle('show-open-dialog', async (event, options) => {
    return await dialog.showOpenDialog(mainWindow, options)
})

ipcMain.handle('download-youtube', async (event, { url, folder }) => {
    try {
        // Проверяем URL
        if (!ytdl.validateURL(url)) {
            throw new Error('Неверная ссылка на YouTube')
        }

        // Получаем информацию о видео
        const info = await ytdl.getInfo(url)
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '')
        const outputPath = path.join(folder, `${title}.mp3`)

        // Создаем поток для скачивания
        const videoStream = ytdl(url, { quality: 'highestaudio' })
        
        // Конвертируем в MP3
        await new Promise((resolve, reject) => {
            ffmpeg(videoStream)
                .audioBitrate(128)
                .save(outputPath)
                .on('progress', (progress) => {
                    // Отправляем прогресс в интерфейс
                    mainWindow.webContents.send('download-progress', {
                        percent: Math.round(progress.percent),
                        transferred: progress.targetSize
                    })
                })
                .on('end', () => {
                    resolve()
                })
                .on('error', (err) => {
                    reject(err)
                })
        })

        return { success: true, path: outputPath, title }
    } catch (err) {
        return { success: false, error: err.message }
    }
})

// Другие IPC обработчики для управления музыкой...