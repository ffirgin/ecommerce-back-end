const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (request, response) => {
  // TODO: find all products
  // be sure to include its associated Category and Tag data
  Product.findAll({
    include: [
      Category,
      {
        model: Tag,
        through: ProductTag,
      },
    ],
  })// Then return the data in json format, and if there is an error, return it.
    .then((productData) => response.json(productData))
    .catch((error) => {
      console.log(error);
      response.status(500).json(error);
    })
});

// get one product
router.get('/:id', (request, response) => {
  // TODO: find a single product by its `id`
  // be sure to include its associated Category and Tag data
  Product.findOne({
    where: {
      id: request.params.id,
    },
    include: [
      Category,
      {
        model: Tag,
        through: ProductTag,
      },
    ],
  })
    .then((productData) => { response.json(productData); })
    .catch((error) => { 
      console.log(error);
      res.status(500).json(error);
    })
});

// create new product
router.post('/', (request, response) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(request.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (request.body.tagIds.length) {
        const productTagIdArr = request.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      response.status(200).json(product);
    })
    .then((productTagIds) => response.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      response.status(400).json(err);
    });
});

// update product
router.put('/:id', (request, response) => {
  // update product data
  Product.update(request.body, {
    where: {
      id: request.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: request.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = request.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: request.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !request.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => response.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      response.status(400).json(err);
    });
});

router.delete('/:id', (request, response) => {
  // TODO: delete one product by its `id` value
  Product.destroy({
    where: {
      id: request.params.id,
    },
  })
    .then((productData) => { response.json(productData); })
    .catch((error) => { 
      console.log(error); 
      response.status(500).json(error); 
    })
});

module.exports = router;
