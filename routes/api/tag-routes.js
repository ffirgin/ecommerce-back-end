const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (request, response) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll({
    include: [
      {
        model: Product,
        through: ProductTag,
      },
    ],
  })
    .then((tagData) => response.json(tagData))
    .catch((error) => response.json(error));
});

router.get('/:id', (request, response) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findOne({
    where: {
      id: request.params.id,
    },
    include: [
      {
        model: Product,
        through: ProductTag,
      }
    ],
  })
  .then((tagData) => response.json(tagData))
  .catch((error) => response.json(error));
});

router.post('/', (request, response) => {
  // create a new tag
  Tag.create(request.body)
    .then((tagData) => response.json(tagData))
    .catch((error) => response.json(error));
});

router.put('/:id', (request, response) => {
  // update a tag's name by its `id` value
  Tag.update(request.body, {
    where: { id: request.params.id },
  })
    .then((tagData) => response.json(tagData))
    .catch((error) => response.json(error));
});

router.delete('/:id', (request, response) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: { id: request.params.id },
  })
    .then((tagData) => response.json(tagData))
    .catch((error) => response.json(error));
});

module.exports = router;
