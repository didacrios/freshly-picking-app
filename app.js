// We’ll declare all our dependencies here
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');


mongoose.Promise = global.Promise; mongoose.connect("mongodb://localhost:27017/freshly-picking");


//Initialize our app variable
const app = express();

//Declaring Port
const port = 5656;

//Middleware for CORS
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));


app.post('/api/order', (req, res) => {

  // do something
  var order = req.body;
  var datet = new Date();
  console.log(`[${datet}] Incoming request to ${req.route.path}`);
  console.log(order.id_order);
  if (order.id_order) {

    // check if order exists in database
    var query = Order.find({ id_order: order.id_order });
    query.exec(function (err, retrievedOrders) {

      if (retrievedOrders.length) {
        let retrievedOrder = new Order(retrievedOrders[0]); // Should only be one, another options is to use Order.findOneBy

        // Order exist, lets check the status
        if (order.status === Enums.Status.ENVIADO || order.status === Enums.Status.ACEPTADO) {
          console.log('############ Order found');
          console.log(retrievedOrder);

          // update saved order with new order info
          Order.findOneAndUpdate({ _id: retrievedOrder.id }, order, function (error, orderUpdated) {
            if (error) return handleError(error, res);
            res.status(200).send({
              success: 'true',
              message: 'Order updated successfully',
              data: { id_order: orderUpdated.id_order }
            })
          });
        } else {
          Order.findByIdAndRemove(retrievedOrder.id, function (error) {
            if (error) return handleError(error, res);
            res.status(200).send({
              success: 'true',
              message: 'Order deleted successfully',
              data: { id_order: retrievedOrder.id_order }
            })
          });

        }
      } else {
        // Order do not exist, check status
        // Only insert Status Enviados y Aceptados (case study requirement)
        if (order.status === Enums.Status.ENVIADO || order.status === Enums.Status.ACEPTADO) {
          console.log('############ Order NOT found');
          console.log(order);
          let newOrder = new Order(order);
          newOrder.save();

          res.status(200).send({
            success: 'true',
            message: 'Order saved successfully',
            data: newOrder
          })
        }
      }
    });



  } else {
    res.status(500).send({
      success: 'false',
      message: 'Malformed order, missing order id',
      data: order,
    });
  }
});


app.get('/api/getOrders', function (req, res) {
  Order.find({}, function (err, orders) {
    res.send(orders);
  });

});

function handleError(error, res) {
  res.status(500).send({
    success: 'false',
    message: 'error'
  });
}