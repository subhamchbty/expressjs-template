import mongoose, { ConnectOptions } from 'mongoose'
import 'dotenv/config'

const { DB_USER, DB_PASSWORD, DB_CLUSTER } = process.env

const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}.3oygnoj.mongodb.net/?retryWrites=true&w=majority`

const InitiateMongoServer = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
        } as ConnectOptions)
        console.log('Connected to DB !!')
    } catch (e) {
        console.log(e)
        throw e
    }
}

export default InitiateMongoServer
