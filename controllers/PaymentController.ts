import { Request, Response } from "express";
import User from "../models/User";
import Stripe from 'stripe';

// This is your test secret API key.
const stripe: any = new Stripe('sk_test_51LIAmLFozueojb1JSxvHOOPdsCFCJkRNh7dzlvpKIIAVI76EgAYlsuDMa3KbkPJB7CABmmkIoXgO8yNbgAaxLzLE00PpxjLpjm', {apiVersion: '2020-08-27'});


const create_payment_intent = async (req: Request | any, res: Response, next: any) => {  
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

 const updateUserAccount = (req: Request | any, res: Response) =>{
  if(!req.body.amount){
    return res.status(402).send('Amount not specified or invalid amount')
  }

  User.findById(req.user.id).then((user: any)=>{
    const new_acc_bal = user.account_bal + req.body.amount
    user.account_bal = new_acc_bal
    user.save().then((updatedUser: {account_bal: number}) =>{
      res.json({account_bal: updatedUser.account_bal})
    }).catch((err: Error): void => {
      res.status(409).send(`error: ${err}`)
    })
  }).catch((err: Error): void => {
    res.status(400).send(`error: ${err}`)
  })
}

export { create_payment_intent, updateUserAccount }