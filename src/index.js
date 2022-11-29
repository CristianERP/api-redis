import express from 'express'
import redis from 'redis'

const app = express()

app.use(express.json())

// Redis Connection
const client = redis.createClient({
    url: 'redis://redis-service:6379'
})

client.on('error', (err) => console.log('Redis Client Error', err))
await client.connect()


app.get('/', async (req, res) => {
    let codeStudents = await client.keys('*')
    if (!codeStudents.length) return res.json(["There are no students"])
    res.json(codeStudents)
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