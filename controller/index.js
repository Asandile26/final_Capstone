const express = require('express');
//Path
const path = require('path');
//Body-Parser
const bodyParser = require('body-parser');
//Router
const route = express.Router();
//Model
const { User, Product, Cart } = require('../model');
//Creating a user instance
const user = new User();
//Creating a product instance
const product = new Product();
//Creating a cart instance
const cart = new Cart();


route.get('^/$|/RUN IT', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../view/index.html'));
});

//Login route
route.post('/login', bodyParser.json(), (req, res) => {
  user.login(req, res);
});
//showing all users
route.get('/users', (req, res) => {
  user.fetchUsers(req, res);
});
//show one user
route.get('/user/:id', (req, res) => {
  user.fetchUser(req, res);
});
//Updating a user info
route.put('/user/:id', bodyParser.json(), (req, res) => {
  user.updateUser(req, res);
});
//creating an account
route.post('/register', bodyParser.json(), (req, res) => {
  user.createUser(req, res);
});
//Removing a user by id
route.delete('/user/:id', (req, res) => {
  user.deleteUser(req, res);
});
//Showing all products 
route.get('/products', (req, res) => {
  product.fetchProducts(req, res);
});
//showing a single product by id
route.get('/product/:id', (req, res) => {
  product.fetchProduct(req, res);
});
//Inserting a new product
route.post('/product', bodyParser.json(), (req, res) => {
  product.addProduct(req, res);
});
//Updating a single product by id
route.put('/product/:id', bodyParser.json(), (req, res) => {
  product.updateProduct(req, res);
});
//Removing a single product by id
route.delete('/product/:id', (req, res) => {
  product.deleteProduct(req, res);
});
//Showing cart 
route.get('/cart', (req, res) => {
  cart.fetchCart(req, res);
});
//showing a cart by id
route.get('/user/:id/cart', (req, res) => {
  cart.fetchCartById(req, res);
});
//Inserting a new product
route.post('/cart', bodyParser.json(), (req, res) => {
  cart.addToCart(req, res);
});
//user to cart
route.post('/user/:id/cart', bodyParser.json(), (req, res) => {
  cart.addToCart(req, res);
});
//Updating a single product by id
route.put('/user/:id/cart', bodyParser.json(), (req, res) => {
  cart.updateCart(req, res);
});
//Removing a single product by id
route.delete('/user/:id/cart', (req, res) => {
  cart.deleteCart(req, res);
});
route.delete('/user/:id/cart/:id', (req, res) => {
  cart.deleteCart(req, res);
});
module.exports = route;