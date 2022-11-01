import express from 'express'
import redis from 'redis'

const app = express()

app.use(express.json())

// Redis Connection
const client = redis.createClient({
    host: 'localhost',
    port: 6379
})
client.on('error', (err) => console.log('Redis Client Error', err))
await client.connect()


app.get('/', (req, res) => {
    res.send("Estudiantes")
})

app.get('/student/:codigo', async (req, res) => {
 
    let paramCodigo = req.params.codigo

    let student = await client.get(paramCodigo.toString())

    if (!student) return res.status(404).json("Not found")

    res.json(JSON.parse(student))
})


app.post('/student', async (req, res) => {

    let { codigo, informacion } = req.query
    
    let datos = informacion.split(',')

    let student = {
        codigo,
        "name": datos[0],
        "email": datos[1],
        "career": datos[2],
        "level": datos[3]  
    }

    await client.set(codigo, JSON.stringify(student))

    res.status(201).send('Add Student')
    
})

app.listen(5000, () => console.log('Server Running'))