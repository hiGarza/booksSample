const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const stripe = require('stripe')('sk_test_51JAkbeESKeZcfmxwp1Ma9bRuZzkn1giUz8MtZmy6DHK2M1JY4yPVlWqDyel8UNTNknXElkrrY1jkxIaSvaNOpvv700tFuOFiB5');

exports.getPaymentIntent = functions.https.onCall((data, context) => {
    return stripe.paymentIntents.create({
        amount: data.price,
        currency: 'usd',
        // Verify your integration in this guide by including this parameter
        metadata: { integration_check: 'accept_a_payment' },
    })
});

exports.getCharge = functions.https.onCall((data, context) => {
    return stripe.charges.list({
        payment_intent: data.paymentIntentId,
    });
});

exports.paymentSuccess = functions.https.onRequest((req, res) => {
    let paymentIntent = db.collection('paymentIntentsToBooks').doc(req.body.data.object.id)
    paymentIntent.get().then((doc) => {
        if (doc.exists) {
            let bookId = doc.data().bookId
            db.collection('books').doc(bookId).update({ stock: 0 }).then(() => {
                    res.status(200).send()
                })
                .catch((error) => {
                    res.status(404).send()
                });
        } else {
            res.status(404).send()
        }
    }).catch((error) => {
        res.status(404).send()
    });
});