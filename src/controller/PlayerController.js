import { AvatarModel } from '../model/AvatarModel.js';
import { GameModel } from '../model/GameModel.js';
import {PlayersModel } from '../model/PlayersModel..js'
import { UserModel } from '../model/UserModel.js';

export const create = async(req, res)=> {
   try {
    const {user_id, game_id, codigo } = req.body;
    const score = 0;

    if(!user_id || !game_id || !codigo){
        res.status(401).json({message: 'Not input invalid'})
    }

    const sala = await GameModel.findByPk(game_id);

    if(codigo == sala.invite_code){
        const player = await PlayersModel.create({
            score: score,
            user_id: user_id,
            game_id: game_id
        })
    
        res.status(200).json({player: player})
    }

    res.status(401).json({message: 'Invalid code'})


 
   } catch (error) {
    
   }
}
 
export const getPlayers = async(req, res)=>{
    try {
        const id = req.params.id;
        const players = await PlayersModel.findAll({
            where: {game_id: id},
            include:{
                model: UserModel,
                as:'enlaceU',
                attributes: ['id', 'apodo'],
                include: {
                    model: AvatarModel,
                    as: 'enlaceA',
                    attributes: ['url']
                }
            }
        });

        const dataPlayers = players.map(result =>({
            id: result.id,
            user_id: result.enlaceU.id,
            apodo: result.enlaceU.apodo,
            avatar: result.enlaceU.enlaceA.url
        }));

        return res.status(200).json({dataPlayers: dataPlayers})

    } catch (error) {
       return res.status(500).json({message:error}) 
    }
}

export const getPlayersNotCreateP = async(req, res)=>{
    try {
        const id = req.params.id;
        const user_id = req.body.user_id;
        const players = await PlayersModel.findAll({
            where: {
                game_id: id, 
                user_id: {
                    $ne: user_id
                }
            },
            include:{
                model: UserModel,
                as:'enlaceU',
                attributes: ['id', 'apodo'],
                include: {
                    model: AvatarModel,
                    as: 'enlaceA',
                    attributes: ['url']
                }
            }
        });

        const dataPlayers = players.map(result =>({
            id: result.id,
            user_id: result.enlaceU.id,
            apodo: result.enlaceU.apodo,
            avatar: result.enlaceU.enlaceA.url
        }));

        return res.status(200).json({dataPlayers: dataPlayers})

    } catch (error) {
       return res.status(500).json({message:error}) 
    }
}


export const update = async(req, res)=> {
    try {
        const id = req.params.id;
        const {score} = req.body;
        const jugador = await PlayersModel.findByPk(id);

        if(!jugador){
            return res.status(401).json({message: 'Not found'});
        }

        jugador.set({
            score: score
        })

        jugador.save();

        return res.status(200).json({jugador:jugador})
        
    } catch (error) {
        return res.status(500).json({message: error})
    }
}