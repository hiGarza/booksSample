# BookStore Sample

## Project setup
Project can be found up and running at: https://stripe-contactless.web.app/#/


To run the project locally create a new project in firebase. Clone the repo and replace the config object at ```src/firebase.js``` with your project's values. Once that's set up run 
```npm install``` followed by```npm run serve```

## Design
This integration was built from the ground up using 2 main technologies. The **Vue.js** framework to handle the project’s FrontEnd and Google’s **Firebase** to act as a Backend.

The main reasoning behind using these two technologies together is their great compatibility. Vue’s reactive virtual DOM pairs perfectly with the auto update capabilities of the Firestore database in Firebase. This allows us to implement real time changes in the frontend when anything triggers a change in the Database. *e.g. This project automatically marks a book as out of stock in every instance of the site when the payment_intent.succeded webhook reaches the corresponding endpoint.*

Also, Firebase was selected as a backend piece to take advantage of their serverless services. Deploying the site to a production environment was easily achieved with the firebase CLI while avoiding the need to spin up extra resources, as well as any extra costs by the hour. This helped me focus on the actual code that needed to be implemented but still have a URL to present the project working live.

## Aproach
The main approach to implementing this solution was to divide the required features into smaller tasks and following the natural order of implementation which unlocks the next features in the backlog. It all started by creating the /admin route that allows the creation of new books, followed by the rendering of said data, and lastly implementing the payment flow to “purchase” the books. 

For the purchase flow I implemented a serverless cloudFunction that can be directly called by the firebase client in the app. This function creates a paymentIntent with a price sent to it at execution. The clientSecret in the returned object is then combined with the card information obtained from Stripe Elements in order to complete the transaction. To display the chargeID another cloudFunction is called with the paymentIntentID as a parameter. This cloud function uses the Stripe /charges API to translate the payment Intent into the corresponding charge. 

As an extra I implemented a function that’s triggered by the payment_intent.succeded webhook at Stripe. This allows the backend to mark a book as out of stock. Immediately locking any further transactions in the front end. 

The use of the webhooks posed a bit of an extra challenge in regards to the cloud functions implementation. To properly move forward with the coding of the webhook function I first had to make sure I got all the necessary emulators up and running to code and test at the same time. This included the firebase cloud functions emulator plus the stripe-cli webhook emulation. Although a bit tricky to fully configure this allowed me to avoid the tedious task of coding, uploading the function into production, and testing it live.

## Extending this Solution
The current solution only displays a message when a charge is succesful. In case there are any errors the pay button simply appears again prompting the user to try again. Given more time I would like to fully understand the different possible scenarios that Stripe Elements can detect and properly handle and communicate all states to the user.

It would also be interesting to check out all the steps of a transaction that are covered by the Stripe webhook events. Combining the webhooks with the serverless cloudFunctions plus the autoupdate capabilities of the FireStore database is definitely a powerful tool that I would like to further explore.

