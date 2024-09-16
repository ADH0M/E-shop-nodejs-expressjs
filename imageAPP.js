const express = require('express');
const multer = require('multer');
const { Sequelize, DataTypes } = require('sequelize');
const { logger } = require('./src/helper/logger');
const app = express();
const port = 3000;

const connectMysql = new Sequelize('eshop', 'root', 'adham', {
    host: 'localhost',
    dialect: 'mysql'
});

const Image = connectMysql.define('Image', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255) },
    data: { type: DataTypes.BLOB('medium') } // Use BLOB with size specification
});

// Set up storage engine for multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle image upload
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const name = req.file.originalname;
        const data = req.file.buffer;

        await Image.create({ name, data });
        res.send('Image uploaded and saved to database');
    } catch (err) {
        res.status(500).send('Error saving image to database');
        console.error(err);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

(async function () {
    try {
        await connectMysql.authenticate();
        console.log('Connected to database');
        await connectMysql.sync(); // Ensure the table is created
        logger.info('Database synchronized');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
})();
