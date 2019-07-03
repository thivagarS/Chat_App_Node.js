const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 8080;
const app = express();

// TO serve the static files
app.use(express.static(publicPath));

app.listen(port, () => {
    console.log(`Application startd running on port ${port} ...`);
}); 