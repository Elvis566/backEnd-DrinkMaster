import { create, update, getPlayers, getPlayersNotCreateP} from '../controller/PlayerController.js';
import { Router } from 'express';

const router = Router();

router.post('/create', create);
router.put('/update/:id', update);
router.get('/obtener/:id', getPlayers);
router.get('/obtenerNotCP/:id',getPlayersNotCreateP )

export const routerPlayer = router;
