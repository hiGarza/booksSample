<template>
    <div>
        <h1>Hey there!</h1>
        <p>Your total amount for <b>{{book.name}}</b> by {{book.author}} is <b>{{book.price}}</b></p>
        <div ref="card" style="max-width: 500px;" class="mx-auto rounded border p-2"></div>
        <div v-if="chargeID !==''">
            <p>Your payment was a success! (chargeID: {{chargeID}})</p>
        </div>
        <b-spinner variant="primary" v-if="paying"></b-spinner>
        <b-button v-else class="mt-2" variant="primary" :disabled="book.stock<1" @click="pay">{{book.stock > 0?'Buy':'Out of Stock'}}</b-button>
    </div>
</template>
<script>
import { db } from '../firebase';
import { functions } from '../firebase';
var stripe = window.Stripe('pk_test_51JAkbeESKeZcfmxw0ev8or4nLkHlng5IfcXdUsBIlbeOiqnIPkLojmfk974HLKMO1JO9LmXhypJGrOiUZlFvirhQ00Xt58Ief4');
export default {
    data() {
        return {
            book: undefined,
            paymentIntent: undefined,
            card: undefined,
            paying: false,
            chargeID: ""
        }
    },
    watch: {
        book: function() {
            if (this.book.price && this.book.stock > 0) {
                // functions.useFunctionsEmulator("http://localhost:5001");
                var testFunc = functions.httpsCallable('getPaymentIntent');
                testFunc({ price: this.book.price * 100 })
                    .then((result) => {
                        this.paymentIntent = result.data;
                        this.$firestore.paymentIntents.doc(this.paymentIntent.id).set({
                            bookId: this.book['.key']
                        });
                    })
                    .catch((error) => {
                        console.log("ERROR", error)
                    });
            }
        }
    },
    methods: {
        pay: function() {
            this.paying = true;
            stripe.confirmCardPayment(this.paymentIntent.client_secret, {
                payment_method: {
                    card: this.card,
                    billing_details: {}
                }
            }).then((result) => {
                if (result.error) {
                    this.paying = false;
                } else {
                    if (result.paymentIntent.status === 'succeeded') {
                        this.getCharge(result.paymentIntent.id)
                    }
                }
            });
        },
        getCharge: function(paymentIntentId) {
            var getCharge = functions.httpsCallable('getCharge');
            getCharge({ paymentIntentId: paymentIntentId })
                .then((result) => {
                    this.chargeID = result.data.data[0].id
                    this.paying = false;
                })
                .catch((error) => {
                    console.log("ERROR", error)
                });
        }
    },
    mounted: function() {
        this.card = stripe.elements().create('card');
        this.card.mount(this.$refs.card);
    },
    firestore() {
        return {
            book: db.collection('books').doc(this.$route.params.id),
            paymentIntents: db.collection('paymentIntentsToBooks')
        }
    }
}
</script>