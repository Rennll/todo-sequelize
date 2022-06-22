const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const db = require('../../models')
const User = db.User

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ where: { email } }).then(user => {
    const errors = []
    if (user) {
      errors.push({ message: 'User already exists' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: '兩個密碼必須相等' })
    }
    if (errors.length) {
      return res.render('register', {
        name,
        email,
        password,
        confirmPassword,
        errors
      })
    }

    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

router.post('/logout', (req, res) => {
  req.flash('success_msg', '成功登出')
  req.logout()
  res.redirect('/users/login')
})

module.exports = router
