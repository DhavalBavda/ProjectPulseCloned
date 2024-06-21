import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import DbConnection from './utils/db.js'
import AuthRoutes from './routes/Auth.js'
import AdminRoute from './routes/AdminRoute.js'


dotenv.config()
const PORT=process.env.PORT || 3000
const app=express()

//mongodb
DbConnection()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin:"http://localhost:5173"
}))
app.use('/api/auth',AuthRoutes)
app.use('/api/admin',AdminRoute)
app.get('/', (req,res)=>{
    res.send('test')
})

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})