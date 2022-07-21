import { Request, Response } from 'express';
import Game from "../models/Game"
import User from "../models/User"

interface challengeObj {
  sender?: string,
  reciever?: string,
  console?: string,
  game?: string,
  bet_amount?: string,
  rules?: string
}

const createGame = async (challenge: challengeObj) => {
    const newGame = new Game({
        "sender":challenge.sender,
        "reciever":challenge.reciever,
        "console":challenge.console,
        "game":challenge.game,
        "bet_amount":challenge.bet_amount,
        "rules":challenge.rules,
        "progress":"created"
    })

    return await newGame.save().then((savedGame: object) => {
        return savedGame
    }).catch((error: Error) => error)
}

const fetchOngoing = (req: Request | any, res: Response, next: any)=>{
    User.findOne({_id: req.user.id}).then((user: object): any => {
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
        }).catch((error: Error): void => next(error))
    }).catch((error: Error): void => next(error)) 
}


const report = (req: Request | any, res: Response, next: any)=>{
    Game.findById(req.params.id).then((game: challengeObj) =>{
        if(!game){
          return res.status(400).json({
            success: false,
            message:"Game not found"
          })    
        }

        interface gameObj {
          progress: string, 
          reported_by: number, 
          winner?: string 
        }

        const gameUpdate: gameObj={
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
        .then((reportedGame) =>{
            res.status(201).json({
                success: true,
                message: "Game report successfull",
                "reportedGame":reportedGame
            })

            const toSocketAddr: number = reportedGame.sender.id == req.user.id ? reportedGame.reciever.id : reportedGame.sender.id
            req.app.io.to(toSocketAddr).emit('game-report',reportedGame)
        }).catch((error: Error): void => next(error))
    }).catch((error: Error): void => next(error))
}

const verify = (req: Request | any, res: Response, next: any)=>{
    Game.findById(req.params.id).then((game: challengeObj) =>{
        if(!game){
            return res.status(400).json({
                success: false,
                message:"Game not found"
            })    
        }

        interface gameObj {
          progress?: string, 
          reported_by?: number | null, 
          winner?: string | null
        }

        let gameUpdate: gameObj;

        if(req.body.report){
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
            const toSocketAddr: number = verifiedGame.sender.id == req.user.id ? verifiedGame.reciever.id : verifiedGame.sender.id
            req.app.io.to(toSocketAddr).emit('game-verified',verifiedGame)
        }).catch((error: Error): void => next(error))
    }).catch((error: Error): void => next(error))
}

const fetch_profile = (req: Request | any, res: Response, next: any)=>{
    const user: Request = req.user.id
    Game.find({$or:[{reciever:user}, {sender:user}]}).then((games: object) => {
        const total_games= Object.keys(games).length;

        const games_as_array = Object.entries(games);

        const won_games = games_as_array.filter(([key, value]) => {
            if(value.winner == user){
                return [key, value]
            }
        })
        const total_games_won = won_games.length;

         const ongoing_games: object[] = games_as_array.filter(([key, value])=>{
            if(['created', 'reported'].includes(value.progress)){
                return [key, value]
            }
        })
        const total_ongoing_games: number = ongoing_games.length
        
        res.status(201).json({
            total_games,
            total_games_won,
            total_ongoing_games
        })
    }).catch((error: Error): void => next(error))
}

export {  
  createGame,
  fetchOngoing,
  report,
  verify,
  fetch_profile
}