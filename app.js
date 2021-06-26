import express from 'express'
import cors from 'cors'
import fs from 'fs'
import csv from 'fast-csv'

const dbFilename = './data/db.csv'

const app = express();
let radiobases = {}
let allRadioBases = {}
let dates = {}

fs.createReadStream(dbFilename)
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => {
        const { RADIOBASE, FECHA, REGION, TRAFICO } = row

        if (!radiobases[REGION]) {
            radiobases[REGION] = {}
        }
        if (!radiobases[REGION][RADIOBASE]) {
            radiobases[REGION][RADIOBASE] = {
                id: RADIOBASE,
            }
            allRadioBases[RADIOBASE] = {
                id: RADIOBASE
            }
        }

        allRadioBases[RADIOBASE][FECHA] = TRAFICO
        radiobases[REGION][RADIOBASE][FECHA] = TRAFICO
        dates[FECHA] = true;
    })
    .on('end', (rowCount) => {
        console.log(`Finished Parsing Rows`)
    });



app.use(cors({
    origin: 'http://localhost:3000'
}))

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use('/radiobases', (req, res) => {

    const { region } = req?.query;

    console.log(region)


    if (!region) {
        res.send(
            {
                dates: Object.keys(dates),
                bases: Object.values(allRadioBases)
            }
        )
    } else {
        res.send({
            dates: Object.keys(dates),
            bases: Object.values(radiobases[region])
        })
    }
})

app.use('/regions', (req, res) => {
    res.send(Object.keys(radiobases))
})
app.use((req, res, next) => {
    res.status(404).send('Not Found')
})

export default app;