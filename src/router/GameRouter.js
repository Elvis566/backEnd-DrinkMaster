import {createGame, finalyGame, getGame} from '../controller/GameController.js'

import { Router } from 'express'

const router = Router();

router.post('/create', createGame);
router.delete('/delete/:id', finalyGame);
router.get('/obtener/:id', getGame);


export const routerGame = router;