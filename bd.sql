CREATE DATABASE Netflix;
USE netflix;
CREATE TABLE Movies(
idMovies INT auto_increment not null primary key,
title varchar(45) not null,
genre varchar(45) not null,
image varchar(1000) not null,
category varchar(45) not null,
year int
);
CREATE TABLE Users(
idUsers INT auto_increment not null primary key,
user varchar(45) not null,
password varchar(45) not null,
name varchar(45) not null,
email varchar(45) not null,
plan_details varchar(45) not null
);
CREATE TABLE Actors(
idActors INT auto_increment not null primary key,
name varchar(45) not null,
lastName varchar(45) not null,
country varchar(45) not null,
birthday date
);idActors