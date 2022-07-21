const { request } = require("express");

// This is your test secret API key.
const stripe = require("stripe")('sk_test_51LIAmLFozueojb1JSxvHOOPdsCFCJkRNh7dzlvpKIIAVI76EgAYlsuDMa3KbkPJB7CABmmkIoXgO8yNbgAaxLzLE00PpxjLpjm');

exports.create_payment_intent = async (req, res) => {  
    // Create a PaymentIntent with the order amount and currency
    if(!req.body.amount){
      return res.status(419).send('invalid amount');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount*100,
      currency: "usd",
      // automatic_payment_methods: {
      //   enabled: true,
      // },
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
}