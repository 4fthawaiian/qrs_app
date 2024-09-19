const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

let host = "http://localhost:3000";

if(process.env.production) {
    host = "https://qrs.4ft.me";
}
passport.serializeUser((user , done) => {
    done(null , user);
})
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
        clientID: "402148756534-3hhsjqrcgca7rqp9351isrkjjjn9ckml.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL:`${host}/auth/callback`,
        passReqToCallback:true
    },
    function(request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

    // "project_id": "qrsapp-436112",
    // "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    // "token_uri": "https://oauth2.googleapis.com/token",
    // "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
