import {createGame, finalyGame, getGame, obtenerGame, startGame, updateGame} from '../controller/GameController.js'

import { Router } from 'express'

const router = Router();

router.post('/create', createGame);
router.delete('/delete/:id', finalyGame);
router.get('/obtener/:id', getGame);
router.post('/inico', startGame)
router.get('/consultar/:id', obtenerGame)
router.put('/update/:id', updateGame)


export const routerGame = router;