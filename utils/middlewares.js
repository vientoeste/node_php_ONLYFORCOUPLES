export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
  res.redirect('/auth/login');
}

export const isNotLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  next();
}
