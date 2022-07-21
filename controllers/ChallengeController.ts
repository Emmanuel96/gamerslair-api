import { Request, Response } from 'express';
import Challenge from "../models/Challenge"
import User from "../models/User"
import { createGame } from './GameController'

interface challengeObj {
    sender?: string,
    reciever?: string | object,
    console?: string,
    game?: string,
    bet_amount?: string,
    rules?: string
  }
  
const create = (req: Request | any, res: Response, next?: any) => {
    const newChallenge = new Challenge({
        "console":req.body.console,
        "game":req.body.game,
        "bet_amount":req.body.bet_amount,
        "rules":req.body.rules
    })

    User.findOne({_id: req.user.id}).then((user: object) => {
        newChallenge.sender = user
        User.findById(req.body.reciever_id).then((reciever: object) => {
            if(!reciever){
              return res.status(400).json({
                success: false,
                message: "Challenge reciever not found"
              })
            }
            newChallenge.reciever = reciever
            newChallenge.save().then((savedChallenge: object) => {
                res.status(201).json({
                    success: true,
                    message: "Challenge creation successfull",
                    "savedChallenge":savedChallenge
                })
                req.app.io.to(req.body.reciever_id).emit('new-challenge', {newChallenge:savedChallenge});
            }).catch((error: Error): void => next(error))
        }).catch((error: Error): void => next(error))
    }).catch((error: Error): void => next(error))
}

const fetchAll = (req: Request | any, res: Response, next?: any): void => {
    Challenge.find({}).populate('sender','username').populate('reciever','username').then((challenges: object) =>{
        if(challenges){
            return res.status(200).json(challenges)
        }
    }).catch((error: Error): void => next(error))    
}

const fetchOne = (req: Request | any, res: Response, next?: any): void => {
    Challenge.findById(req.params.id).populate('sender','username').populate('reciever','username').then((challenge: object) =>{
        if(challenge){
            return res.status(200).json(challenge)
        }

        return res.status(400).json({
            success: false,
            message:"Challenge not found"
        })
    }).catch((error: Error): void => next(error))
}

const fetchIncoming = (req: Request | any, res: Response, next?: any): void => {
    User.findOne({_id: req.user.id}).then((user: object) => {
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
        }).catch((error: Error): void => next(error))
    }).catch((error: Error): void => next(error))   
}

const fetchOutgoing = (req: Request | any, res: Response, next?: any): void => {
    User.findOne({_id: req.user.id}).then((user: object) => {
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        Challenge.find({sender:user, state:'created'}).populate('sender','username').populate('reciever','username').then((challenges: object) =>{
            if(challenges){
                return res.status(200).json(challenges)
            }
            return res.status(400).json({
                success: false,
                message:"No incoming challenges found for this user"
            })
        }).catch((error: Error): void => next(error))
    }).catch((error: Error): void => next(error))
}

const update = (req: Request | any, res: Response, next?: any) => {
    const challengeUpdate: challengeObj = {
        "console":req.body.console,
        "game":req.body.game,
        "bet_amount":req.body.bet_amount,
        "rules":req.body.rules
    }

    if(req.body.reciever_id != undefined){
        User.findById(req.body.reciever_id).then((reciever: object) => {
            if(!reciever){
                return res.status(400).json({
                    success: false,
                    message: "Challenge reciever not found"
                })
            }
            challengeUpdate.reciever = reciever
        }).catch((error: Error): void => next(error))
    }

    Challenge.findByIdAndUpdate(req.params.id, challengeUpdate, {returnDocument:'after'}).then((updatedChalenge: object) =>{
        res.status(201).json({
            success: true,
            message: "Challenge update successfull",
            "updatedChalenge":updatedChalenge
        })
    }).catch((error: Error): void => next(error))
}

const delete_challenge = (req: Request | any, res: Response, next?: any) => {
    Challenge.findByIdAndDelete(req.params.id, {returnDocument:'after'}).then((): Response => {
        return res.status(201).json({
            success: true,
            message: "Challenge delete successfull"
        })
    }).catch((error: Error): void => next(error))
}

const acceptOrReject = (req: Request | any, res: Response, next?: any): void => {
    Challenge.findById(req.params.id).then((challenge: challengeObj): Response | void => {
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
        const challengeUpdate={
            "state": req.body.state
        }
        
        Challenge.findByIdAndUpdate(req.params.id, challengeUpdate, {returnDocument:'after'}).populate('sender','username').populate('reciever','username').then((updatedChallenge: object) =>{            
            if(req.body.state === "accepted"){
                createGame(updatedChallenge).then(((createdGame: { reciever: any, sender: any }) =>{
                    req.app.io.to(createdGame.sender.id).to(createdGame.reciever.id).emit('challenge-response', {'response':'accepted', 'game':createdGame});
                })).catch((err: Error): Response => {
                    console.log(err)
                    return res.status(501).send(new Error('Unable to create game from challenge'))
                })
            }
            res.status(201).json({
                success: true,
                message: "Challenge update successfull",
                "updatedChallenge":updatedChallenge
            })
        }).catch((error: Error): void => next(error))
    }).catch((error: Error): void => next(error))
}

export {
    create,
    fetchAll,
    fetchIncoming,
    fetchOutgoing,
    delete_challenge,
    acceptOrReject,
    update,
    fetchOne
}