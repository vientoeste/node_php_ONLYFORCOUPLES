export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
  if (!req.isAuthenticated()) {
    res.redirect('/auth/login');
  }
}

export const isNotLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  if (!req.isAuthenticated()) {
    next();
  }
}
