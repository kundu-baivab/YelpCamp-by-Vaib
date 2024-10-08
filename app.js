if(process.env.NODE_ENV!=='production'){
    require('dotenv').config()
}

const express=require('express')
const app=express()
const path=require('path')
const ejsMate=require('ejs-mate')
const mongoose=require('mongoose')
const methodOverride=require('method-override')
const session=require('express-session')
const flash=require('connect-flash')
const passport=require('passport')
const LocalStrategy=require('passport-local')
const mongoSanitize=require('express-mongo-sanitize')
const MongoStore = require('connect-mongo');


const User=require('./models/user')

const ExpressError=require('./utils/ExpressError')

const userRoutes=require('./routes/users')
const campgroundRoutes=require('./routes/campgrounds.js')
const reviewRoutes=require('./routes/reviews')

const dbUrl='mongodb://127.0.0.1:27017/yelp-camp'

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
    console.log("DATABASE CONNECTED!!")
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize({
    replaceWith:'_'
}))//removes $ sign prefixed queries from req.query


const sessionConfig={
    store:MongoStore.create({
        mongoUrl:dbUrl,
        secret:'asecret',
        touchAfter: 24*60*60 //secs
    }),
    name:'session',//not using default name of session cookie
    secret:'asecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        //the line below means only people r only accessing the site over http (applied after deployment)
        // secure:true,
        expires: Date.now()+1000*60*60*24*7, //millisecs
        maxAge:1000*60*60*24*7
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

//storing and unstoring the user in session
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next();
})

app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)


app.get('/',(req,res)=>{
    res.render('home')
})


app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found',404))
})

app.use((err,req,res,next)=>{
    const {status=500}=err
    if(!err.message) err.message='Page not found'
    res.status(status).render('error',{err});
})

app.listen(5000,()=>{
    console.log('Serving on port 5000')
})