const Challenge = require("../models/Challenge")
const User = require("../models/User")

exports.create = (req, res, next) => {
    let sender_id = req.body.sender_id
    let reciever_id = req.body.reciever_id
    let console = req.body.console
    let game = req.body.game
    let bet_amount = req.body.bet_amount
    let rules = req.body.rules
    
    const newChallenge = new Challenge({
        "sender":sender_id,
        "reciever":reciever_id,
        "console":console,
        "game":game,
        "bet_amount":bet_amount,
        "rules":rules
    })

    let challenge_sender = User.findById(sender_id).then(sender =>{
        if(!sender){
            return res.status(400).json({
                success: false,
                message: "The sender of this challenge does not exist"
            })
        }
    }).catch(error => next(error))
    
    let challenge_reciever = User.findById(reciever_id).then(reciever => {
        if(!reciever){
            return res.status(400).json({
                success: false,
                message: "The reciever of this challenge does not exist"
            })
        }
    }).catch(error => next(error))

    newChallenge.save().then(savedChallenge => {
        res.status(201).json({
            success: true,
            message: "Challenge creation successfull",
            "savedChallenge":savedChallenge
        })
    }).catch(error => next(error))
}

exports.fetchAll=(req, res, next) => {
    Challenge.find({}).then(challenges =>{
        if(challenges){
            return res.status(200).json(challenges)
        }
    }).catch(error => next(error))
}

exports.fetchOne=(req, res, next) => {
    let id = req.params.id
    Challenge.findById(id).then(challenge =>{
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
    let user_id = req.params.user_id
    Challenge.find({reciever:user_id}).then(challenge =>{
        if(challenge){
            return res.status(200).json(challenge)
        }

        return res.status(400).json({
            success: false,
            message:"No incoming challenges found for this user"
        })
    }).catch(error => next(error))
}

exports.fetchOutgoing=(req, res, next) => {
    let user_id = req.params.user_id
    Challenge.find({sender:user_id}).then(challenge =>{
        if(challenge){
            return res.status(200).json(challenge)
        }

        return res.status(400).json({
            success: false,
            message:"No outgoing challenges found for this user"
        })
    }).catch(error => next(error))
}

exports.update=(req, res, next) => {
    let id = req.params.id
    let sender_id = req.body.sender_id
    let reciever_id = req.body.reciever_id
    let console = req.body.console
    let game = req.body.game
    let bet_amount = req.body.bet_amount
    let rules = req.body.rules
    
    const challengeUpdate = {
        "sender":sender_id,
        "reciever":reciever_id,
        "console":console,
        "game":game,
        "bet_amount":bet_amount,
        "rules":rules
    }

    Challenge.findByIdAndUpdate(id, {returnDocument:'after'}).then(updatedChalenge =>{
        res.status(201).json({
            success: true,
            message: "Challenge update successfull",
            "updatedChalenge":updatedChalenge
        })
    }).catch(error => next(error))
}

exports.delete=(req, res, next) => {
    let id = req.params.id
    Challenge.findByIdAndDelete(id, {returnDocument:'after'}).then(deletedChalenge =>{
        res.status(201).json({
            success: true,
            message: "Challenge delete successfull",
            "deletedChalenge":deletedChalenge
        })
    }).catch(error => next(error))
}