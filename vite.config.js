import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import electron, { onstart } from 'vite-plugin-electron'

export default defineConfig({
    resolve: {
        alias: {
            '@': path.join(__dirname, 'src'),
        },
    },
    plugins: [
        react(),
        electron({
            main: {
                entry: 'electron/main/index.js',
                vite: {
                    build: {
                        outDir: 'dist/electron/main',
                    }
                },
            },
            preload: {
                vite: {
                    build: {
                        outDir: 'dist/electron/preload',
                    }
                },
            },

            // Enables use of Node.js API in the Electron-Renderer
            renderer: {},
        }),
    ]
})
