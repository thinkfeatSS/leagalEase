const express = require('express');
const {getKalam,getKalamById,createKalam,updateKalam,deleteKalam} = require('../controllers/kalamController');

const router  = express.Router();

// GET
router.get('/kalam',getKalam);
router.get('/kalam/:id',getKalamById); // Update example
// POST
router.post('/kalam',createKalam);
// PUT
router .put('/kalam/:id',updateKalam); // Update example
// DELETE
router.delete('/kalam/:id',deleteKalam); // Delete example


module.exports = router ;