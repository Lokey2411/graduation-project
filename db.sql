-- Tạo bảng categories
CREATE TABLE
    categories (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        isNewArrival BOOLEAN,
        isDelete BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (id)
    );

-- Tạo bảng users
CREATE TABLE
    users (
        id INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        fullName VARCHAR(200) NOT NULL,
        email VARCHAR(200) NOT NULL UNIQUE,
        password VARCHAR(200) NOT NULL,
        isDelete BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (id)
    );

-- Tạo bảng permissions
CREATE TABLE
    permissions (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) UNIQUE,
        description TEXT,
        isDelete boolean DEFAULT FALSE,
        PRIMARY KEY (id)
    );

-- Tạo bảng user_has_permissions
CREATE TABLE
    user_has_permissions (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        permission_id INT NOT NULL,
        isDelete boolean DEFAULT FALSE,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (permission_id) REFERENCES permissions (id)
    );

-- Tạo bảng addresses
CREATE TABLE
    addresses (
        id INT NOT NULL AUTO_INCREMENT,
        userId INT NOT NULL,
        address TEXT NOT NULL,
        isPrimaryAddress BOOLEAN NOT NULL,
        isDelete BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (userId) REFERENCES users (id)
    );

-- Tạo bảng products
CREATE TABLE
    products (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        price VARCHAR(50),
        discount VARCHAR(20),
        priceAfterDiscount VARCHAR(50),
        category_id INT NOT NULL,
        isBestSale BOOLEAN,
        isDelete BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (id),
        FOREIGN KEY (category_id) REFERENCES categories (id)
    );

-- Tạo bảng related_products
CREATE TABLE
    related_products (
        id INT NOT NULL AUTO_INCREMENT,
        product_id INT NOT NULL,
        related_product_id INT NOT NULL,
        priority INT DEFAULT -1,
        isDelete BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (id),
        FOREIGN KEY (product_id) REFERENCES products (id),
        FOREIGN KEY (related_product_id) REFERENCES products (id)
    );

-- Tạo bảng variants
CREATE TABLE
    variants (
        id INT NOT NULL AUTO_INCREMENT,
        product_id INT NOT NULL,
        name VARCHAR(200),
        variantType VARCHAR(200),
        isDelete BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
    );

-- Tạo bảng product_images
CREATE TABLE
    product_images (
        id INT NOT NULL AUTO_INCREMENT,
        product_id INT NOT NULL,
        imageUrl TEXT,
        isPrimaryImage BOOLEAN NOT NULL,
        isDelete BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
    );

-- Tạo bảng orders
CREATE TABLE
    orders (
        id INT NOT NULL AUTO_INCREMENT,
        userId INT NOT NULL,
        orderDate DATE NOT NULL,
        price VARCHAR(200) NOT NULL,
        status VARCHAR(30),
        isDelete BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (id),
        FOREIGN KEY (userId) REFERENCES users (id)
    );

-- Tạo bảng product_orders
CREATE TABLE
    product_orders (
        id INT NOT NULL AUTO_INCREMENT,
        product_id INT NOT NULL,
        order_id INT NOT NULL,
        variant_id INT NOT NULL,
        quantity INT UNSIGNED NOT NULL,
        status ENUM ('carting', 'favorite'),
        isDelete BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (id),
        FOREIGN KEY (product_id) REFERENCES products (id),
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (variant_id) REFERENCES variants (id)
    );