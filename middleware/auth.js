module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('warning_msg', '尚未登入無法瀏覽該頁面')
    return res.redirect('/users/login')
  }
}
