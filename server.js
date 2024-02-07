const express = require('express')
const articleRouter = require('./routes/articles')
const mongoose = require('mongoose')
const Article = require('./models/article')
const methodOverride = require('method-override')
const app = express()

mongoose.connect('mongodb://localhost/blog',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreateIndex:true
})

app.set('view engine','ejs')
app.use(express.static('public'));

app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'))
app.get('/',async (req,res) => {
    // res.send('Hello world')
    const articles = await Article.find().sort({
        createdAt:'desc' })
    res.render('articles/index',{articles:articles})
})


const page = 1; // This is the page number you want to fetch
const limit = 5; // Number of documents per page

app.get('/frontend', async (req,res)=> {
    // Calculate the number of documents to skip

    // Query MongoDB to get the articles with pagination
    const articles = await Article.find()
        .sort({ createdAt: 'desc' })
        .limit(limit);

    const totalArticles = await Article.countDocuments();
    
    const totalPages = Math.ceil(totalArticles / limit);

    res.render('frontend/index',{articles:articles , prevpage: parseInt(page) -1 , nextpage: parseInt(page) +1, totalPages:totalPages});
})


app.get('/frontend/page/:page', async (req,res)=> {
    // Calculate the number of documents to skip
    const skip = (req.params.page - 1) * limit;

    // Query MongoDB to get the articles with pagination
    const articles = await Article.find()
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(limit);

    const totalArticles = await Article.countDocuments();

    const totalPages = Math.ceil(totalArticles / limit);

    res.render('frontend/index',{articles:articles, prevpage: parseInt(req.params.page) -1 , nextpage: parseInt(req.params.page) +1, totalPages:totalPages });
})

app.use('/articles',articleRouter)
app.listen(3000)