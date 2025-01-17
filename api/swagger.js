const swaggerjsdoc=require('swagger-jsdoc');
const swaggerui = require('swagger-ui-express');

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "CuisineCove",
        version: "1.0.0",
        description: "Discover the best food, restaurants, and cuisines around you"
      },
      servers: [
        {
          url: "http://localhost:3000/",
        }
        
      ]
    }
    },
    apis: ['./routes/*.js'],
  };
  const specs=swaggerjsdoc(options);

  app.use(
    "/api-docs",
    swaggerui.serve,
    swaggerui.setup(specs)
  )