const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()

// Ruta para obtener datos de clientes en chunks (streaming)
router.get('/', async (req, res) => {
  try {
    // Path al archivo de datos de clientes
    const dataPath = path.join(__dirname, '..', '..', 'data_clients.json')
    
    // Verificar si el archivo existe
    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({ error: 'Client data file not found' })
    }

    // Leer el archivo
    const data = fs.readFileSync(dataPath, 'utf8')
    const clients = JSON.parse(data)
    
    // Dividir en chunks para simular streaming
    const chunkSize = 100 // 100 clientes por chunk
    const chunks = []
    
    for (let i = 0; i < clients.length; i += chunkSize) {
      const chunk = clients.slice(i, i + chunkSize)
      chunks.push(JSON.stringify(chunk))
    }
    
    // Enviar como texto con chunks separados por saltos de línea
    res.setHeader('Content-Type', 'text/plain')
    res.send(chunks.join('\n'))
    
  } catch (error) {
    console.error('Error loading client data:', error)
    res.status(500).json({ error: 'Failed to load client data' })
  }
})

module.exports = router
