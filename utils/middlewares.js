export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect('/auth/login');
  } else {
    next();
  }
}

export const isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
}
