DROP DATABASE IF EXISTS HDB;
CREATE DATABASE HDB;

USE HDB;

DROP USER IF EXISTS 'shanath'@'%';
CREATE USER 'shanath'@'%' IDENTIFIED WITH mysql_native_password BY 'midterm'; 
GRANT ALL ON HDB.* TO 'shanath'@'%';
