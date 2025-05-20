import express from 'express';
import upload from '../middlewares/upload.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { createProduct,updateProduct,getAllProducts,getNewCollectionProducts,getProductsByPriceRange,getProductById,searchProducts,getProductsByCategory,deleteProduct } from '../controllers/product.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.post('/',authMiddleware,isAdmin, upload.single('image'),createProduct);
router.put('/:id',authMiddleware, isAdmin,upload.single('image'), updateProduct); 
router.delete('/:id',authMiddleware,isAdmin, deleteProduct);

router.get('/', getAllProducts);
router.get('/new-collection', getNewCollectionProducts);
router.get('/price-range', getProductsByPriceRange);
router.get('/search', searchProducts);
router.get('/:id', getProductById);
router.get('/category/:category', getProductsByCategory);


export default router;






