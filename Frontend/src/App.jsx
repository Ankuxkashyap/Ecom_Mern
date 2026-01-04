import './App.css';
// import { Route } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './pages/auth';
import { Home } from './pages/Home';
import Cart from './components/Cart';
import Profile from './pages/Profile';
import { Toaster } from 'react-hot-toast';
import Checkout from './pages/ChackoutPage';
import ProductList from './components/ProductList';
import AddProducts from './pages/AddProducts';
import Success from './components/Success';
import Error from './components/Error';
import ProductPage from './pages/ProductPage';

function App() {

  return (
    <>
    <Toaster/>
     <Router>
       <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/checkout" element={<Checkout/>} />
         <Route path="/products" element={<ProductList />} />
         <Route path="/success" element={<Success />} />
         <Route path="/error" element={<Error />} />
        <Route path="/add-product" element={<AddProducts />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path='/profile' element={<Profile/>} />
        <Route path='/cart' element={<Cart/>}/>
        <Route path="/auth" element={<AuthForm />}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
