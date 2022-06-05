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
        ).populate('sender','username').populate('reciever','username').then(games =>{
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