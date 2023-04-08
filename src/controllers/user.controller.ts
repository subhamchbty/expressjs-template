import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

import User from '../models/user.model'
import { AuthenticatedRequest } from '../middlewares/auth'

const signup = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        })
    }

    const { username, email, password } = req.body
    try {
        let user = await User.findOne({
            email,
        }).select('+password')

        if (user) {
            return res.status(400).json({
                msg: 'User Already Exists',
            })
        }

        user = new User({
            username,
            email,
            password,
        })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        await user.save()

        const payload = {
            user: {
                id: user.id,
            },
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            },
            (err, token) => {
                if (err) throw err
                res.status(200).json({
                    token,
                })
            }
        )
    } catch (err) {
        console.log((err as Error).message)
        res.status(500).send('Error in Saving')
    }
}

const login = async (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        })
    }

    const { email, password } = req.body
    try {
        let user = await User.findOne({
            email,
        })
        if (!user)
            return res.status(400).json({
                message: 'User Not Exist',
            })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.status(400).json({
                message: 'Incorrect Password !',
            })

        const payload = {
            user: {
                id: user.id,
            },
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            },
            (err, token) => {
                if (err) throw err
                res.status(200).json({
                    token,
                })
            }
        )
    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: 'Server Error',
        })
    }
}

const getUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?.id)
        res.json(user)
    } catch (e) {
        res.send({ message: 'Error in Fetching user' })
    }
}

export { signup, login, getUser }
