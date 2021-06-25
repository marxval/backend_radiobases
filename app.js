import express from 'express'

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

app.use((req, res, next) => {
    res.status(404).send('Not Found')
})

export default app;