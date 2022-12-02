const router = require('express').Router()
const User = require('../models/user')
const i18n = require('../i18n')

router.post('/user', async (req, res) => {
  if(req.body.id && req.body.id > 0 && req.body.email && req.body.email.length > 0 && req.body.loginToken && req.body.loginToken.length > 0){
    const user = new User({id: req.body.id, email: req.body.email, loginToken: req.body.loginToken})
    try {
      const result = await user.save()
      result.loginToken = undefined
      res.send({ message: 'Success', result: result })
    } catch (error) {
      res.status(400).send({ message: 'Error while saving', error: error })
    }
  }else{
    return res.status(400).send({ message: 'Missing id' })
  }
})

router.get('/rules', async (req, res) => {
  if(req.query.id && parseInt(req.query.id) > 0){
    const user = await User.findOne({ id: parseInt(req.query.id) })
    if(user){
      res.send({ message: 'Success', data: user.rules})
    }else{
      res.status(204).send({ message: 'No user with id ' + parseInt(req.query.id) })
    }
  }else{
    return res.status(400).send({ message: 'Missing id' })
  }
})

router.post('/rules', async (req, res) => {
  if(req.body.id && req.body.id > 0){
    const user = await User.findOne({ id: req.body.id })
    if(user){
      user.rules.push(req.body.rule)
      user.markModified('rules')
      try {
        const result = await user.save()
        res.send({ message: 'Success', result: result.rules })
      } catch (error) {
        res.status(400).send({ message: 'Error while saving', error: error })
      }
    }else{
      res.status(204).send({ message: 'No user with id ' + req.body.id })
    }
  }else{
    return res.status(400).send({ message: 'Missing id' })
  }
})

module.exports = router
