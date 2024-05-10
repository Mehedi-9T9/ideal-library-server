const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000
const app = express()


//Middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Ideal library server is running')
})

//Port Define
app.listen(port, () => {
    console.log(`The server running Port: ${port}`);
})