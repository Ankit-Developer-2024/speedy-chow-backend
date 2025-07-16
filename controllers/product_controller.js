const Product = require('../models/product_model')
const express = require('express')

exports.createProduct=async(req,res)=>{
   res.json({"p":"p created"})
}