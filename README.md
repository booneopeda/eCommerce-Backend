# CSP2 Demo App Overview:

### E-COMMERCE API DOCUMENTATION

**Installation:**
- Admin User:

`npm install`

**Backend URL:**
- http://ec2-18-222-62-228.us-east-2.compute.amazonaws.com/b7

**User Credentials:**

- Admin User:
  - email: admin@mail.com
  - pwd: admin1234
- Dummy Customer:
  - email: customer@mail.com
  - pwd: custom1234

**ROUTES:**

**_User Resource_**

- User registration (POST)
  - /users/
    - auth token required: NO
    - request body:
      - firstName (string)
      - lastName (string)
      - email (string)
      - mobileNo (string)
      - password (string)
- User authentication (POST)
  - /users/login
    - auth token required: NO
    - request body:
      - email (string)
      - password (string)
- Get user details (GET)
  - /users/login
    - auth token required: YES
    - request body: n/a
- Set user to admin(Admin only) (PUT)
  - /users/:userId/set-as-admin
    - auth token required: YES
    - request body: n/a
- Update password (PUT)
  - /users/update-password
    - auth token required: YES
    - request body:
      -newPassword

**_Product Resource_**

- Product creation (Admin only) (POST)
  - /products/
    - auth token required: YES
    - request body:
      - name (string)
      - descriptionm (string)
      - price (number)
- Retrieve all products (Admin only) (GET)
  - /products/all
    - auth token required: YES
    - request body:n/a
- Retreieve all active products (GET)
  - /products/
    - auth token required: No
    - request body:n/a
- Retrieve single products (GET)
  - /products/:productId
    - auth token required: No
    - request body:n/a
- Update product info (Admin only) (PATCH)
  - /products/:productId/update
    - auth token required: Yes
    - request body:
      - name (string)
      - descriptionm (string)
      - price (number)
- Archive product (Admin only) (PATCH)
  - /products/:productId/archive
    - auth token required: Yes
    - request body:n/a
- Activate product (Admin only) (PATCH)
  - /products/:productId/activate
    - auth token required: Yes
    - request body:n/a
- Search product by Name (POST)
  - /products/searchByName
    - auth token required: No
    - request body:
      -productName (string)
- Search product by Price Range (POST)
  - /products/searchByPrice
    - auth token required: No
    - request body:
      -minPrice (number)
      -maxPrice (number)

**_Cart Resource_**

- Cart Retrieval (GET)
  - /cart/add-to-cart
    - auth token required: YES
    - request body:n/a
- Add to Cart (POST)
  - /cart/add-to-cart
    - auth token required: YES
    - request body:
      - cartItem (array)
      - totalPrice (number)
- Update Product Quantity (POST)
  - /cart/update-cart-quantity
    - auth token required: YES
    - request body:
      - cartItem (array)
- Remove item from cart (PATCH)
  - /cart/:productId/remove-from-cart
    - auth token required: YES
    - request body:n/a
- Clear Cart (PATCH)

  - /cart/clear-cart

    - auth token required: YES
    - request body:n/a

**_Order Resource_**

- Create Order (POST)
  - /orders/checkout
  - auth token required: Yes
  - request body:n/a
- Retrieve logged in user's orders (POST)
  - /orders/my-orders
    - auth token required: Yes
    - request body:n/a
- Retrieve all user's orders (Admin only) (GET)
  - /orders/all-orders
    - auth token required: Yes
    - request body:n/a
