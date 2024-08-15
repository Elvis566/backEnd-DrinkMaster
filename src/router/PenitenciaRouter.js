import {savePenitencia, getPenitenciaPlay } from '../controller/PenitenciaController.js';
import { Router } from 'express';

const router = Router();

router.post('/create',savePenitencia );
router.get('/obtener/:id', getPenitenciaPlay);

export const routerPenitencia = router;