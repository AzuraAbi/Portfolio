import express from "express"
import cors from "cors"
import jwt, { decode } from "jsonwebtoken"
import bodyParser from "body-parser"

const app = express()
app.use(cors())
app.use(bodyParser.json())

const SECRET_KEY = 'azura_abi_14_06_2007_miel_15_01_2006_setlove_26_04_2025'
const DEV_ACCOUNT = {
    username: 'azura_abi_14_06_2007',
    password: '140620071501200626042025'
}

app.post('/api/login', (req, res) => {
    const { username, password } = req.body


    if (
        username === DEV_ACCOUNT.username &&
        password === DEV_ACCOUNT.password
    ) {
        const token = jwt.sign(
            { username },
            SECRET_KEY,
            { expiresIn: '2h' }
        )

        res.json({ token, role: 'dev' })
    } else {
        res.status(401).json({ error: 'Failed' })
    }
})

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) return res.status(403).json({ error: 'No token' });

    const token = authHeader.split(' ')[1]

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token expired or invalid' });

        if (decoded.username !== DEV_ACCOUNT.username) return res.status(403).json({ error: "Not dev" });
        req.user = decoded
        next()
    })
}

app.get('/api/dev', verifyToken, (req, res) => {
    res.json({ message: "Welcome, dev" })
})

app.listen(5000, () => console.log("🚀 Server is running on port 5000"))