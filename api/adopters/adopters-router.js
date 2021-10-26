const express = require('express')
const Adopter = require('./adopters-model.js')
const router = express.Router()

// endpoints here that have to do with adopters
// every request falling through here is assumed
// to start with /api/adopters
router.get('/', (req, res) => {
  // 1- req.params /:foo/:bar
  // 2- req.body   { "foo": "bar" }
  // 3- req.headers
  // 4- req.query [GET] /?search=cats
  Adopter.find(req.query)
    .then(adopters => {
      res.status(200).json(adopters);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the adopters',
      });
    });
});

router.get('/:id', (req, res) => {
  Adopter.findById(req.params.id)
    .then(adopter => {
      if (adopter) {
        res.status(200).json(adopter);
      } else {
        res.status(404).json({ message: 'Adopter not found' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the adopter',
      });
    });
});

router.get('/:id/dogs', async (req, res) => {
  console.log('async/await version')
  try {
    const dogs = await Adopter.findDogs(req.params.id)
    if (!dogs.length) {
      res.status(404).json({ message: 'No dogs for this adopter' })
    } else {
      res.status(200).json(dogs)
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error retrieving the dogs for this adopter',
      rawError: err.message,
    });
  }
});

router.get('/:id/dogs', (req, res) => {
  console.log('ES6 promise version')
  Adopter.findDogs(req.params.id)
    .then(dogs => {
      if (dogs.length > 0) {
        res.status(200).json(dogs);
      } else {
        res.status(404).json({ message: 'No dogs for this adopter' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the dogs for this adopter',
      });
    });
});

router.post('/', (req, res) => {
  Adopter.add(req.body)
    .then(adopter => {
      res.status(201).json(adopter);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error adding the adopter',
      });
    });
});

router.delete('/:id', (req, res) => {
  Adopter.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: 'The adopter has been nuked' });
      } else {
        res.status(404).json({ message: 'The adopter could not be found' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error removing the adopter',
      });
    });
});

router.put('/:id', (req, res) => {
  const changes = req.body;
  Adopter.update(req.params.id, changes)
    .then(adopter => {
      if (adopter) {
        res.status(200).json(adopter);
      } else {
        res.status(404).json({ message: 'The adopter could not be found' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error updating the adopter',
      });
    });
});

module.exports = router