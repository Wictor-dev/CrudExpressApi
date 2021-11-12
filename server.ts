import * as admin from 'firebase-admin'
import express, {request, Request, Response} from 'express'
import cors from 'cors'

const app = express()
const port = 3000

var serviceAccount = require("./library-79a27-firebase-adminsdk-9u1cm-6690b15e31.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()

app.use(express.json())
app.use(cors())
app.get('/books', async (req: Request, res: Response)=>{
    const booksRef = db.collection('books')

    const booksDoc = await booksRef.get()

    const books: any[] = []
    booksDoc.forEach(doc => books.push({id:doc.id, ...doc.data()}))  

    return res.status(200).json(books)
})

app.post('/books/criar', async (req: Request, res: Response)=>{
    const {title, year, category} = req.body

    const book = {title, year: Number(year), category}

    const result = await db.collection('books').add(book)

    return res.status(201).json({id: result.id, ...book})
})

app.get('/books/:id', async (req: Request, res: Response)=>{
    const id = req.params.id

    const book = await db.collection('books').doc(id).get()

    return res.json({id: book.id, ...book.data()})
})

app.put('/books/:id', async (req, res)=>{
    const {title, year, category} = req.body
    const id = req.params.id
    const book = {title, year: Number(year), category}

    const result = await db.collection('books').doc(id).set(book)

    return res.status(200).json({id: id, ...book})
})

app.delete('/books/:id',async (req, res)=>{
    const { id }= req.params

    const result = await db.collection('books').doc(id).delete()

    return res.json(204).send()
})

app.listen(port, ()=>{
    console.log(`Example app listening at http://localhost:${port}`)
})