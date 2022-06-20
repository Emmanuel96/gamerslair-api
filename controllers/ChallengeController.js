const Challenge = require("../models/Challenge")
const User = require("../models/User")
const Gmae = require("../models/Game")
const GameController = require('./GameController')

exports.create = (req, res, next) => {
    const newChallenge = new Challenge({
        "console":req.body.console,
        "game":req.body.game,
        "bet_amount":req.body.bet_amount,
        "rules":req.body.rules
    })

    User.findOne({_id: req.user.id}).then(user => {
        newChallenge.sender = user
        User.findById(req.body.reciever_id).then(reciever => {
            if(!reciever){
                return res.status(400).json({
                    success: false,
                    message: "Challenge reciever not found"
                })
            }
            newChallenge.reciever = reciever
            newChallenge.save().then(savedChallenge => {
                res.status(201).json({
                    success: true,
                    message: "Challenge creation successfull",
                    "savedChallenge":savedChallenge
                })
                req.app.io.to(req.body.reciever_id).emit('new-challenge', {newChallenge:savedChallenge});
            }).catch(error => next(error))
        }).catch(error => next(error))
    }).catch(error => next(error))
}

exports.fetchAll=(req, res, next) => {
    Challenge.find({}).populate('sender','username').populate('reciever','username').then(challenges =>{
        if(challenges){
            return res.status(200).json(challenges)
        }
    }).catch(error => next(error))    
}

exports.fetchOne=(req, res, next) => {
    Challenge.findById(req.params.id).populate('sender','username').populate('reciever','username').then(challenge =>{
        if(challenge){
            return res.status(200).json(challenge)
        }

        return res.status(400).json({
            success: false,
            message:"Challenge not found"
        })
    }).catch(error => next(error))
}

exports.fetchIncoming=(req, res, next) => {
    User.findOne({_id: req.user.id}).then(user => {
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        Challenge.find({reciever:user, state:'created'})
        .populate('sender','username')
        .populate('reciever','username')
        .sort('-_id')
        .then(challenges =>{
            if(challenges){
                return res.status(200).json(challenges)
            }
            return res.status(400).json({
                success: false,
                message:"No incoming challenges found for this user"
            })
        }).catch(error => next(error))
    }).catch(error => next(error))   
}

exports.fetchOutgoing=(req, res, next) => {
    User.findOne({_id: req.user.id}).then(user => {
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        Challenge.find({sender:user, state:'created'}).populate('sender','username').populate('reciever','username').then(challenges =>{
            if(challenges){
                return res.status(200).json(challenges)
            }
            return res.status(400).json({
                success: false,
                message:"No incoming challenges found for this user"
            })
        }).catch(error => next(error))
    }).catch(error => next(error))
}

exports.update=(req, res, next) => {
    const challengeUpdate = {
        "console":req.body.console,
        "game":req.body.game,
        "bet_amount":req.body.bet_amount,
        "rules":req.body.rules
    }

    if(req.body.reciever_id != undefined){
        User.findById(req.body.reciever_id).then(reciever => {
            if(!reciever){
                return res.status(400).json({
                    success: false,
                    message: "Challenge reciever not found"
                })
            }
            challengeUpdate.reciever = reciever
        }).catch(error => next(error))
    }

    Challenge.findByIdAndUpdate(req.params.id, challengeUpdate, {returnDocument:'after'}).then(updatedChalenge =>{
        res.status(201).json({
            success: true,
            message: "Challenge update successfull",
            "updatedChalenge":updatedChalenge
        })
    }).catch(error => next(error))
}

exports.delete=(req, res, next) => {
    Challenge.findByIdAndDelete(req.params.id, {returnDocument:'after'}).then(deletedChalenge =>{
        res.status(201).json({
            success: true,
            message: "Challenge delete successfull",
            "deletedChalenge":deletedChalenge
        })
    }).catch(error => next(error))
}

exports.acceptOrReject=(req, res, next)=>{
    Challenge.findById(req.params.id).then(challenge =>{
        if(!challenge){
            return res.status(400).json({
                success: false,
                message:"Challenge not found"
            })    
        }
        if(challenge.reciever != req.user.id){
            res.status(403).json({
                success:false,
                message:"Forbiden"
            })
        }
        challengeUpdate={
            "state": req.body.state
        }
        
        Challenge.findByIdAndUpdate(req.params.id, challengeUpdate, {returnDocument:'after'}).populate('sender','username').populate('reciever','username').then(updatedChallenge =>{            
            if(req.body.state = "accepted"){
                GameController.createGame(updatedChallenge).then((createdGame =>{
                    req.app.io.to(createdGame.sender.id).to(createdGame.reciever.id).emit('challenge-response', {'response':'accepted', 'game':createdGame});
                })).catch(err =>{
                    console.log(err)
                    return res.status(501).send(new Error('Unable to create game from challenge'))
                })
            }
            res.status(201).json({
                success: true,
                message: "Challenge update successfull",
                "updatedChallenge":updatedChallenge
            })
        }).catch(error => next(error))
    }).catch(error => next(error))
}