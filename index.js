const express = require('express');
const jsonParser = require('body-parser').json();
const fs = require('fs');

const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.sendFile('./home.html', { root: __dirname });
});

app.post('/tasks', jsonParser, function(request, response) {
    let data = JSON.stringify(request.body);
    fs.writeFile('tasks.json', data, (err) => {
        if (err) throw err;
    });
})

app.post('/reward', jsonParser, function(request, response) {
    let data = JSON.stringify(request.body);
    fs.writeFile('nestime.json', data, (err) => {
        if (err) throw err;
    });
})



// Setting up the public directory
app.use(express.static('.'));
app.response;
app.listen(port, () => console.log(`listening on port ${port}!`));