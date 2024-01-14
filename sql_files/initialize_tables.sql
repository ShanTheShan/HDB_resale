USE HDB;

DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS sale_info;
DROP TABLE IF EXISTS location;
DROP TABLE IF EXISTS storey;
DROP TABLE IF EXISTS unit_model;
DROP TABLE IF EXISTS unit_type;

CREATE TABLE unit_type (
  flat_type_id INT PRIMARY KEY,
  flat_type VARCHAR(50) NOT NULL
);

CREATE TABLE unit_model (
  model_id INT PRIMARY KEY,
  flat_model VARCHAR(100) NOT NULL
);

CREATE TABLE location (
  location_id INT PRIMARY KEY NOT NULL,
  town VARCHAR(250) NOT NULL
);

CREATE TABLE storey (
  storey_id INT PRIMARY KEY,
  storey_range VARCHAR(50) NOT NULL
);

CREATE TABLE sale_info (
  sale_info_id INT PRIMARY KEY,
  date_sold date NOT NULL,
  floor_area_sqm FLOAT(4),
  lease_left INT NOT NULL,
  location_id INT NOT NULL,
  flat_type_id INT NOT NULL,
  model_id INT NOT NULL,
  storey_id INT NOT NULL,
  FOREIGN KEY (location_id) REFERENCES location (location_id),
  FOREIGN KEY (flat_type_id) REFERENCES unit_type (flat_type_id),
  FOREIGN KEY (model_id) REFERENCES unit_model (model_id),
  FOREIGN KEY (storey_id) REFERENCES storey (storey_id)
);

CREATE TABLE sales (
  sale_id INT PRIMARY KEY,
  price INT,
  FOREIGN KEY (sale_id) REFERENCES sale_info (sale_info_id)
);