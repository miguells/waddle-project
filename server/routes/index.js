var router = require('express').Router();
var mid = require('../middleware');
var Quedada = require('../models/quedada.js');




/*
Quedada.find({},function(err, data){
    if (err) return next(err);
    data = data.map(quedada => {
        m = new Date(quedada.fecha)
        m =  m.getUTCFullYear() +"/"+
        ("0" + (m.getUTCMonth()+1)).slice(-2) +"/"+
        ("0" + m.getUTCDate()).slice(-2) + " " +
        ("0" + m.getUTCHours()).slice(-2) + ":" +
        ("0" + m.getUTCMinutes()).slice(-2);
        console.log("Valor de m"+m)
        quedada.fecha = m;
        return quedada;
    })
    quedadas = data;
    console.log(quedadas[0])
})
*/



var users = {
    mike: 'mike123',
    carlos: 'carlos123',
    jc: 'jc123'
}

var amigos = {
    mike: ['nadie'],
    carlos: ['pepito', 'manolito','pepito', 'manolito','pepito', 'manolito','pepito', 'manolito','pepito', 'manolito'],
    jc: ['caca', 'pedo']
}


// GET /
router.get('/', function(req, res, next) {
    if (!req.session.username) return res.render('index', { title: 'Welcome' });
    Quedada.find({},function(err, quedadas){
        if (err) return next(err);
        return res.render('home', { title: 'Home', quedadas: quedadas, nuevas: quedadas });
    })
    
});


router.get('/profile', mid.requiresLogin, function(req, res, next) {
  return res.render('profile', { title: 'Profile' });
});


router.post('/', mid.loggedOut, function(req, res, next){
    if (req.body.password === users[req.body.user]) {
        req.session.username = req.body.user;
        return res.redirect('/');
    }
    
    var err = new Error('Bad login')
    err.status = 401;
    return next(err);    
})


router.get('/quedadas', mid.requiresLogin, function(req, res, next) {
    var page = Number(req.query.page);
    var limit = Number(req.query.limit);
    if (page === undefined || limit === undefined) return res.json(quedadas);
    Quedada.find({},function(err, quedadas){
        if (err) return next(err);
        return res.json([quedadas.length, quedadas.slice(page*limit, (page*limit)+limit)])
    })
});

router.get('/nueva', mid.requiresLogin, function(req, res, next) {
    return res.render('nueva', {title: 'Nueva quedada'})
});

router.post('/nueva', mid.requiresLogin, function(req, res, next) {
    Quedada.create({
        tipo: req.body.tipo,
        fecha: req.body.fecha,
        hora: req.body.hora,
        participantes: req.body.participantes.trim().split(','),
        tareas: {
            hacer: req.body.hacer.trim().split('\r\n')
        },
        hecha: false
    }, function(err, quedada){
        console.log(err)
    })

    return res.end('Hecho!')
});

router.get('/edit/:id', mid.requiresLogin, function(req, res, next) {
    return res.render('edit', {title: 'Editar quedada'})
});

router.post('/edit/:id', mid.requiresLogin, function(req, res, next) {
    var quedadaEditada = {
        tipo: req.body.tipo,
        fecha: req.body.fecha,
        hora: req.body.hora,
        participantes: req.body.participantes.trim().split(','),
        tareas: {
            hacer: req.body.hacer.trim().split('\r\n')
        },
        hecha: false
    }
    Quedada.findOneAndUpdate({_id: req.params.id}, quedadaEditada, function(err, doc){
        if (err) {
            console.error(err);
            return res.json({success: false})
        }
        return res.json({success: true})
    })
});

router.delete('/delete/:id', mid.requiresLogin, function(req, res, next) {
    Quedada.findOneAndRemove({_id: req.params.id}, function(err, doc){
        if (err) {
            console.error(err);
            return res.json({success: false})
        }
        return res.json({success: true})
    })
});


// GET /logout
router.get('/logout', mid.requiresLogin, function(req, res, next) {
  if (req.session) {
    //delete session object
    req.session.destroy(function(err){
      if (err) {
        return next(err);
      }
     else {
       res.redirect('/');
     }
    });
  }
});




module.exports = router;
