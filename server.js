require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const userRouter = require('./router/user')
const commendRouter = require('./router/commend')
const recordRouter = require('./router/record')
const bookRouter = require('./router/book')

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))

app.use(morgan('dev'))
app.use(cors())

const connectDB = require('./config/database')
connectDB()

app.use('/uploads', express.static('uploads'))

app.use('/user', userRouter)
app.use('/commend', commendRouter)
app.use('/record', recordRouter)
app.use('/book', bookRouter)

const PORT = process.env.PORT || 7000

app.listen(PORT, console.log("connected server..."))