var router = require('express').Router();
var mid = require('../middleware');
var Quedada = require('../models/quedada.js');

var users = {
    mike: 'mike123',
    carlos: 'carlos123',
    jc: 'jc123'
}


// GET /
router.get('/', function(req, res, next) {
    res.json({status: "Online"})    
});


router.post('/login', mid.loggedOut, function(req, res, next){
    if (req.body.password === users[req.body.user] && users[req.body.user]) {
        req.session.username = req.body.user;
        return res.json({success: true});
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
        if (err) return next(err)
        return res.json({success: true})
    })
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
            next(err);
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
       res.json({success: true});
     }
    });
  }
});




module.exports = router;
