const Game = require("../models/Game")
const User = require("../models/User")

exports.createGame = async (challenge) => {
    const newGame = new Game({
        "sender":challenge.sender,
        "reciever":challenge.reciever,
        "console":challenge.console,
        "game":challenge.game,
        "bet_amount":challenge.bet_amount,
        "rules":challenge.rules,
        "progress":"created"
    })

    return await newGame.save().then(savedGame => {
        return true
    }).catch(error => error)
}

exports.fetchOngoing = (req, res, next)=>{
    User.findOne({_id: req.user.id}).then(user => {
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        Game.find({$or:[{reciever:user}, {sender:user}]}
        )
        .populate('sender','username')
        .populate('reciever','username')
        .populate('winner','username')
        .populate('reported_by','username')
        .then(games =>{
            if(games){
                return res.status(200).json(games)
            }
            return res.status(400).json({
                success: false,
                message:"No ongoing games found"
            })
        }).catch(error => next(error))
    }).catch(error => next(error)) 
}

exports.report= (req, res, next)=>{
    Game.findById(req.params.id).then(game =>{
        if(!game){
            return res.status(400).json({
                success: false,
                message:"Game not found"
            })    
        }
        gameUpdate={
            "progress": "reported",
            'reported_by':req.user.id
        }
        if(req.body.report == "win"){
            gameUpdate.winner = req.user.id
        }else if(req.body.report == "loss"){
            gameUpdate.winner = game.sender == req.user.id ? game.reciever : game.sender
        }
        
        Game.findByIdAndUpdate(req.params.id, gameUpdate, {returnDocument:'after'})
        .populate('sender','username')
        .populate('reciever','username')
        .populate('winner','username')
        .populate('reported_by','username')
        .then(reportedGame =>{
            res.status(201).json({
                success: true,
                message: "Game report successfull",
                "reportedGame":reportedGame
            })
        }).catch(error => next(error))
    }).catch(error => next(error))
}

exports.verify= (req, res, next)=>{
    Game.findById(req.params.id).then(game =>{
        if(!game){
            return res.status(400).json({
                success: false,
                message:"Game not found"
            })    
        }

        if(req.body.report == true){
            gameUpdate={
                "progress": "verified",
            }
        }else{
            gameUpdate={
                "progress":'created',
                "reported_by":null,
                "winner":null,
            }
        }
        
        Game.findByIdAndUpdate(req.params.id, gameUpdate, {returnDocument:'after'})
        .populate('sender','username')
        .populate('reciever','username')
        .populate('winner','username')
        .populate('reported_by','username')
        .then(verifiedGame =>{
            res.status(201).json({
                success: true,
                message: "Game report successfull",
                "verifiedGame":verifiedGame
            })
        }).catch(error => next(error))
    }).catch(error => next(error))
}