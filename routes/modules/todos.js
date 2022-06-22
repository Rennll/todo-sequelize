const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/new', (req, res) => {
  const { name } = req.body
  const user = req.user
  return Todo.create({
    name,
    isDone: 0,
    UserId: user.id
  })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('edit', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

router.put('/:id', async (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body

  try {
    const todo = await Todo.findByPk(id)
    todo.name = name
    todo.isDone = !!isDone
    await todo.save()
    res.redirect(`/todos/${id}`)
  } catch (error) {
    console.log(error)
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id

  try {
    const todo = await Todo.findByPk(id)
    await todo.destroy()
    res.redirect('/')
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
