passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        // Здесь вы можете сохранить профиль пользователя в базу данных или выполнить другие действия
        console.log(profile);
        return done(null, profile);
      }
    )
  );
  