require('dotenv').config();
const express  = require('express');
const swagger =require('swagger-ui-express');
const YAML   =require('yamljs');
const path  = require('path');
const client   = require('prom-client');
const  bcrypt  = require('bcrypt')
const {logger} = require('./src/helper/logger');
const { connectMysql } = require('./src/database/connectMysql');
const v1Route = require('./src/v1Routes/v1Routes');
const app  = express();
const PORT = process.env.PORT ||3000 ;
const Redis = require('ioredis');
const axios =require('axios');
const cheerio =require('cheerio');
const helmet = require('helmet');

const cors = require('cors');
app.options('*',cors())

const globalError = require('./src/middleware/errorMiddleware');

app.use(express.static('./src/upload'))
app.use(express.json());
const swaggerDoc  = YAML.load('./swagger.yaml');
app.use('/api-docs' , swagger.serve , swagger.setup(swaggerDoc))

app.use(express.static(path.join(__dirname,'./images')));
app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use(helmet())


// app level middleware 
client.collectDefaultMetrics()
app.use('/metrics' ,async (req,res,next)=>{
    res.set('Content-Type' ,client.register.contentType );
    res.send(await client.register.metrics())
} )





// Error handler middelware ;
app.use(( error , req , res , next ) => {
    logger.error(error);
    res.status(500).send('Internal Server Error')
})

// Router middelware....
app.use('/api' ,v1Route )

// Redis Server ;
const redis = new Redis() ;
app.get('/cach-data' ,async ( req , res , next ) => {
    const cashData = await redis.get('connect to cash . . . ')
    if(cashData){
        return res.send(JSON.parse(cashData));
    }else{
        const dataCash = { ms : ' connect redis...'}
       await redis.set('cachedData' ,JSON.stringify(dataCash) ,'EX' , 3600);
       res.json(dataCash)
    }

})




// Hash password;
app.get('/test-hash' , ( req , res , next )=>{
    const password = '1234';
    debugger
    const hashPassword = bcrypt.hashSync(password ,8);
    const isValidHash  = bcrypt.compareSync(password ,hashPassword);

    res.json({ password , hashPassword , isValidHash })
    
} )

debugger
// ex middlewera to test database on table Images
// app.get('/product' , async ( req , res , next )=>{
//     const myProdcut = await Product.findAll()
//     res.json({ myProdcut })
// } )


app.get('/webScrabing',async (req,res,next)=>{
    const {data} = await axios.get('https://www.cafelax.com/?gad_source=1&gclid=Cj0KCQjw8--2BhCHARIsAF_w1gy9gPj8Jd1h9bbSPsU97wUVQd3ZcjTMcPnBXFy_vKaz92Wmt9ngFi0aAgR-EALw_wcB')
    const $ = cheerio.load(data);
    let ti =[];
    $('div.card__text.product-item__text.gutter--regular.spacing--xlarge.remove-empty-space.text-align--left > a > div').each((index,elm)=>{
        const title =$(elm).text();
        ti.push([index + 1 ,title] )

    })
    res.status(200).json({title:ti})

})

app.use(globalError)

app.listen(PORT,()=>{
    logger.info(`server is runnig on port ${PORT}`)
});
(async function () {
    logger.info('connected db')
   await connectMysql.authenticate()
})()


