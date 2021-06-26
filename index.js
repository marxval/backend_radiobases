import dotenv from 'dotenv'
import app from './app.js'


const NODE_ENV = process.env['NODE_ENV'] || 'development'

dotenv.config({
    path: `.env.${NODE_ENV}`
})

const port = process.env.PORT || 3500;

app.listen(port, () => {
    console.log(`Backend Running on PORT -> ${process.env.HOST}:${port}`)
})

