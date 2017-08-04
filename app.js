const express = require('express');
const bodyparser=require('body-parser');
const fs = require('fs');
var path=require('path');
var JSONStream=require('JSONStream');
var engines=require('consolidate');
var lodash=require('lodash');
const app = express();

app.engine('hbs',engines.handlebars);
app.set('view engine', 'hbs');// khi render thì app nó hiểu index trong thư mục view rồi, còn nếu không có mục này thì khi render phải chỉ ra đường dẫn tuyệt đối

app.set('views','./views');
app.use('/profilepics', express.static('images'));
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));


app.get('/',(req,res)=>{
   let users = [];
   fs.readdir('users',function(err,files){
       if(err) throw err
        files.forEach(function(file){
                 fs.readFile(path.join(__dirname,'users',file) ,{encoding:'utf8'},function(err,data){
                       if(err) throw err
                        const user = JSON.parse(data);
                       user.name.full = lodash.startCase(user.name.first + ' ' + user.name.last);
                       users.push(user);
                       if(users.length==files.length){
                        //    res.send(users);
                         res.render('index', {users: users})
                       }
            } )
        })
   })
})

// app.get('/:username',(req,res)=>{
//     var username = req.params.username
//     var user = getuser(username);
//     //res.send(user);
//     res.render('user',{
//         user: user,
//         address: user.location
//     });
// });
app.get('/:username', (req, res)=>{
    var username = req.params.username
    var user = getUser(username)
    // res.send(user);
    res.render('user', {
        user : user,
        address : user.location
    })
})

// function getuser(username){
//     var user =  JSON.parse(fs.readFileSync(getuserfilepath(username),{encoding:'utf8'}));
//     user.name.full = lodash.startCase(user.name.first +' '+ user.name.last);
//     lodash.keys(user.location).forEach(function(key){
//         user.location[key] = lodash.startCase(user.location[key])
//     })
//     return user;
// }
function getUser(username){
    var user = JSON.parse(fs.readFileSync(getUserFilePath(username),{encoding:'utf-8'}))
    user.name.full = lodash.startCase(user.name.first + ' ' + user.name.last)
    lodash.keys(user.location).forEach((key)=>{
        user.location[key] = lodash.startCase(user.location[key])
    })
    return user
}

// function getuserfilepath(username){
//     return path.join(__dirname,'users',username)+'.json';
// }

function getUserFilePath(username){
    return path.join(__dirname, 'users', username) + '.json'
}

// app.put('/:username',(req,res)=>{
//     var username = req.params.username
//     var user = getuser(username)
//     user.location = req.body
//     saveUser(username, req.body)
//     res.end()
// })

app.put('/:username',(req, res)=>{
    var username = req.params.username
    var user = getUser(username)
    user.location = req.body
    saveUser(username, user)
    res.end()
})

// function saveUser(username,data){
//     var fp = getuserfilepath(username)
    // fs.unlinkSync(fp);
//     fs.writeFileSync(fp,JSON.stringify(data,null,2),{encoding:'utf8'})
// }

function saveUser(username, data){
    var fp = getUserFilePath(username)
    fs.unlink(fp)
    fs.writeFileSync(fp, JSON.stringify(data, null, 2), {encoding : 'utf-8'})
}

app.listen(3000,()=>{
    console.log('app running at port 3000 ');
});








