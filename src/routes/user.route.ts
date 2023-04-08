import { Router } from 'express'
import { check } from 'express-validator'

import auth from '../middlewares/auth'
import { signup, login, getUser } from '../controllers/user.controller'

const router = Router()

router.post(
    '/signup',
    [
        check('username', 'Please Enter a Valid Username').not().isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a valid password').isLength({
            min: 6,
        }),
    ],
    signup
)

router.post('/login', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a valid password').isLength({
        min: 6,
    }),
    login,
])

router.get('/', auth, getUser)

export default router
