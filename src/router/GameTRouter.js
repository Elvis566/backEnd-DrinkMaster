import {saveTypeGame, getTypeGame, getTypeGameId} from '../controller/TypeGameController.js';
import { Router } from 'express';

const router = Router();

router.post('/create', saveTypeGame);
router.get('/obtener', getTypeGame);
router.get('/obtener/:id', getTypeGameId);


export const routerGameT = router