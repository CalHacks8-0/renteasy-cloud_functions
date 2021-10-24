/* eslint-disable */

const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

exports.aggregateReviews = functions.firestore
    .document('rentalListings/{rentalID}/reviews/{reviewID}')
    .onWrite((change, context) => {

        // get path ID
        const rentalID = context.params.rentalID;

        // ref to rentalListings collection
        const rentalRef = admin.firestore().collection('rentalListings')
            .doc(rentalID);

        // calculate average rating and update rentalListing
        rentalRef.collection('reviews')
            .get()
            .then(reviews => {
                // calculate totalReviews
                const totalReviews = reviews.size;
                // console.log(totalReviews);

                // array of starRating for each review 
                const starArray = [];

                // loop through reviews and push starRating to starArray
                reviews.forEach(review => {
                    starArray.push(review.data().starRating);
                });

                // console.log(starArray);
                // calculate average starRating
                const averageStarRating = starArray.reduce((a, b) => a + b) / starArray.length;
                

                return rentalRef.update({
                    totalReviews: totalReviews,
                    averageRating: averageStarRating.toString()
                });

            });
    });
