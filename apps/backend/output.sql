CREATE TYPE "UserStatus" AS ENUM (
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED'
);

CREATE TYPE "OrderStatus" AS ENUM (
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
);

CREATE TABLE "users" (
  "id" INTEGER -- Primary key,
  "username" VARCHAR(50) -- Unique username,
  "email" VARCHAR(255) -- User email,
  "password_hash" VARCHAR(255) -- Hashed password,
  "status" USERSTATUS -- User status,
  "created_at" TIMESTAMP -- Creation timestamp,
  "updated_at" TIMESTAMP -- Last update timestamp
);

COMMENT ON COLUMN "users"."id" IS 'Primary key';
COMMENT ON COLUMN "users"."username" IS 'Unique username';
COMMENT ON COLUMN "users"."email" IS 'User email';
COMMENT ON COLUMN "users"."password_hash" IS 'Hashed password';
COMMENT ON COLUMN "users"."status" IS 'User status';
COMMENT ON COLUMN "users"."created_at" IS 'Creation timestamp';
COMMENT ON COLUMN "users"."updated_at" IS 'Last update timestamp';

CREATE TABLE "profiles" (
  "id" INTEGER,
  "user_id" INTEGER -- Foreign key to users,
  "first_name" VARCHAR(100) -- First name,
  "last_name" VARCHAR(100) -- Last name,
  "bio" TEXT -- User biography,
  "avatar_url" VARCHAR(255) -- Profile picture URL,
  "date_of_birth" DATE -- Birth date,
  "phone" VARCHAR(20) -- Phone number
);

COMMENT ON COLUMN "profiles"."user_id" IS 'Foreign key to users';
COMMENT ON COLUMN "profiles"."first_name" IS 'First name';
COMMENT ON COLUMN "profiles"."last_name" IS 'Last name';
COMMENT ON COLUMN "profiles"."bio" IS 'User biography';
COMMENT ON COLUMN "profiles"."avatar_url" IS 'Profile picture URL';
COMMENT ON COLUMN "profiles"."date_of_birth" IS 'Birth date';
COMMENT ON COLUMN "profiles"."phone" IS 'Phone number';

CREATE TABLE "orders" (
  "id" INTEGER,
  "user_id" INTEGER -- Foreign key to users,
  "order_number" VARCHAR(50) -- Unique order number,
  "status" ORDERSTATUS -- Order status,
  "total_amount" DECIMAL(10,2) -- Total order amount,
  "shipping_address" TEXT -- Shipping address,
  "billing_address" TEXT -- Billing address,
  "created_at" TIMESTAMP -- Order creation time,
  "updated_at" TIMESTAMP -- Last update time
);

COMMENT ON COLUMN "orders"."user_id" IS 'Foreign key to users';
COMMENT ON COLUMN "orders"."order_number" IS 'Unique order number';
COMMENT ON COLUMN "orders"."status" IS 'Order status';
COMMENT ON COLUMN "orders"."total_amount" IS 'Total order amount';
COMMENT ON COLUMN "orders"."shipping_address" IS 'Shipping address';
COMMENT ON COLUMN "orders"."billing_address" IS 'Billing address';
COMMENT ON COLUMN "orders"."created_at" IS 'Order creation time';
COMMENT ON COLUMN "orders"."updated_at" IS 'Last update time';

CREATE TABLE "order_items" (
  "id" INTEGER,
  "order_id" INTEGER -- Foreign key to orders,
  "product_id" INTEGER -- Foreign key to products,
  "quantity" INTEGER -- Item quantity,
  "unit_price" DECIMAL(10,2) -- Unit price,
  "total_price" DECIMAL(10,2) -- Total price for this item
);

COMMENT ON COLUMN "order_items"."order_id" IS 'Foreign key to orders';
COMMENT ON COLUMN "order_items"."product_id" IS 'Foreign key to products';
COMMENT ON COLUMN "order_items"."quantity" IS 'Item quantity';
COMMENT ON COLUMN "order_items"."unit_price" IS 'Unit price';
COMMENT ON COLUMN "order_items"."total_price" IS 'Total price for this item';

CREATE TABLE "products" (
  "id" INTEGER,
  "name" VARCHAR(255) -- Product name,
  "description" TEXT -- Product description,
  "price" DECIMAL(10,2) -- Product price,
  "stock_quantity" INTEGER DEFAULT : -- Available stock,
  "category_id" INTEGER -- Foreign key to categories,
  "is_active" BOOLEAN -- Product availability,
  "created_at" TIMESTAMP -- Creation timestamp,
  "updated_at" TIMESTAMP -- Last update timestamp
);

COMMENT ON COLUMN "products"."name" IS 'Product name';
COMMENT ON COLUMN "products"."description" IS 'Product description';
COMMENT ON COLUMN "products"."price" IS 'Product price';
COMMENT ON COLUMN "products"."stock_quantity" IS 'Available stock';
COMMENT ON COLUMN "products"."category_id" IS 'Foreign key to categories';
COMMENT ON COLUMN "products"."is_active" IS 'Product availability';
COMMENT ON COLUMN "products"."created_at" IS 'Creation timestamp';
COMMENT ON COLUMN "products"."updated_at" IS 'Last update timestamp';

CREATE TABLE "categories" (
  "id" INTEGER,
  "name" VARCHAR(100) -- Category name,
  "description" TEXT -- Category description,
  "parent_id" INTEGER -- Self-referencing foreign key,
  "is_active" BOOLEAN -- Category availability
);

COMMENT ON COLUMN "categories"."name" IS 'Category name';
COMMENT ON COLUMN "categories"."description" IS 'Category description';
COMMENT ON COLUMN "categories"."parent_id" IS 'Self-referencing foreign key';
COMMENT ON COLUMN "categories"."is_active" IS 'Category availability';