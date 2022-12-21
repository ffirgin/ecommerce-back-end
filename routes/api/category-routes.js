const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (request, response) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({
    include: [Product],
  })
    .then((categoryData) => response.json(categoryData))
    .catch((error) => response.json(error));
});

router.get('/:id', (request, response) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  Category.findOne({
    where: { id: request.params.id },
    include: [Product],
  })
    .then((categoryData) => response.json(categoryData))
    .catch((error) => response.json(error));
});

router.post('/', (request, response) => {
  // create a new category
  Category.create(request.body)
    .then((categoryData) => response.json(categoryData))
    .catch((error) => response.json(error));
});

router.put('/:id', (request, response) => {
  // update a category by its `id` value
  Category.update(request.body, {
    where: { id: request.params.id },
  })
    .then((categoryData) => response.json(categoryData))
    .catch((error) => response.json(error));
});

router.delete('/:id', (request, response) => {
  // delete a category by its `id` value
  Category.destroy({
    where: { id: request.params.id },
  })
    .then((categoryData) => response.json(categoryData))
    .catch((error) => response.json(error));
});

module.exports = router;
