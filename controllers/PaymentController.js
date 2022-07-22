const { request } = require("express");
const User = require("../models/User")

// This is your test secret API key.
const stripe = require("stripe")('sk_test_51LIAmLFozueojb1JSxvHOOPdsCFCJkRNh7dzlvpKIIAVI76EgAYlsuDMa3KbkPJB7CABmmkIoXgO8yNbgAaxLzLE00PpxjLpjm');

exports.create_payment_intent = async (req, res) => {  
    // Create a PaymentIntent with the order amount and currency
    if(!req.body.amount){
      return res.status(419).send('invalid amount');
    }

    try{
      const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount*100,
        currency: "usd",
        payment_method_types: ['card'],
      });
    
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    }catch(err){
      console.log(err)
      res.status(422).send(`${err}`);
    }
}

exports.updateUserAccount = (req, res, next) =>{
  if(!req.body.amount){
    return res.status(402).send('Amount not specified or invalid amount')
  }

  User.findById(req.user.id).then(user=>{
    new_acc_bal = user.account_bal + req.body.amount
    user.account_bal = new_acc_bal
    user.save().then(updatedUser =>{
      res.json({account_bal:updatedUser.account_bal})
    }).catch(err =>{
      res.status(409).send(`error: ${err}`)
    })
  }).catch(err =>{
    res.status(400).send(`error: ${err}`)
  })
}