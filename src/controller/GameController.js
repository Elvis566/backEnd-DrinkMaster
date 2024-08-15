import { measureMemory } from 'vm';
import {GameModel} from '../model/GameModel.js';
import crypto from 'crypto';
import { PlayersModel } from '../model/PlayersModel..js';
import { UserModel } from '../model/UserModel.js';
import { AvatarModel } from '../model/AvatarModel.js';
export const createGame = async(req, res)=>{
   try {
    const {user_id, game_id } = req.body;

    if(!user_id || !game_id){
        return res.status(401).json({message: 'input no invalid' })
    }

    const codigo = codigoShare();

    const partida = await GameModel.create({
        invite_code: codigo,
        user_create_id: user_id,
        type_game_id:game_id
    })

    return res.status(200).json({partida: partida})
   } catch (error) {
    return res.status(500).json({message: error})
   }
}

export const updateGame = async(req, res)=>{
    try {
        const id = req.params.id;
        const {cardJugada, penitenciaJugada} = req.body

        const encontrado = await GameModel.findByPk(id)

        if(!encontrado){
        return res.status(401).json({message:'Not found'})
            
        }

        encontrado.set({
            cardJugada: cardJugada,
            penitenciaJugada: penitenciaJugada
        })

        encontrado.save();
    } catch (error) {
        return res.status(500).json({message:error})
    }
}

export const getGame = async(req, res)=>{
    try {
        const id = req.params.id;

    const sala = await GameModel.findAll({
        where:{'id': id},
        include:{
            model: UserModel,
            as: 'enlaceUser',
            attributes: ['apodo'],
            include:{
                model: AvatarModel,
                as: 'enlaceA',
                attributes: ['url'],
                
            }
        }
    });

   
    const dataSala = sala.map(result => ({
        id: result.id,
        cardJugada: result.cardJugada,
        penitenciaJugada: result.penitenciaJugada,
        invite_code: result.invite_code,
        status: result.status,
        apodo: result.enlaceUser.apodo,
        avatar: result.enlaceUser.enlaceA.url
      }));
  
      return res.status(200).json({dataSala: dataSala});
    
    } catch (error) {
        return res.status(500).json({message:error})
    }
}

export const finalyGame = async(req, res)=> {
    try {
        const id = req.params.id;

    const fGame = await GameModel.findByPk(id)

    if(!fGame){
        return res.status(401).json({message: 'Not found'});
    }else{
        fGame.set({status: 'ended'});
        fGame.save();
        return res.status(200).json({message:'Finaly game'})
    }
    } catch (error) {
        return res.status(500).json({message: error})
    }


}

// Iniciar partida
export const startGame = async (req, res) => {
    try {
        const { gameId } = req.body; // Asumiendo que el ID del juego se pasa en el body de la solicitud

        const game = await GameModel.findByPk(gameId);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        game.set({ status: 'started' }); // Actualiza el estado del juego a 'started'
        game.save()
        return res.status(200).json({ message: 'Game started successfully' });
    } catch (err) {
        console.error('Error starting the game:', err);
        return res.status(500).json({ message: 'Error starting the game' });
    }
};

export const obtenerGame= async(req, res)=>{
    try {
        const id = req.params.id;

    const encontrada =await GameModel.findByPk(id);

    return res.status(200).json({encontrada: encontrada})
    } catch (error) {
        res.status(500).json({message: error})
    }
}


function codigoShare(){
    return crypto.randomBytes(4).toString('hex');
}