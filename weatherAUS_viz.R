install.packages("rattle")
install.packages("magrittr")
library(rattle)
library(magrittr)
library(ggplot2)
## Rattle: A free graphical interface for data science with R.
## Version 5.1.0 Copyright (c) 2006-2017 Togaware Pty Ltd.
## Type 'rattle()' to shake, rattle, and roll your data.
weatherAUS <- read.csv("weatherAUS2.csv")

# To generate a density plot.

cities <- c("Sydney","Melbourne","Adelaide","Perth","Brisbane")
ds <- subset(weatherAUS, Location %in% cities & ! is.na(Temp3pm))

p  <- ggplot(ds, aes(Temp3pm, colour=Location, fill=Location))
p  <- p + geom_density(alpha=0.55)
p
##########################Sydney#############
weathersydney <- weatherAUS[weatherAUS$Location == 'Sydney',]
cities <- c("Sydney")
ds <- subset(weatherAUS, Location %in% cities & ! is.na(Temp3pm))

p  <- ggplot(ds, aes(Temp3pm, colour=Location, fill=Location))
p  <- p + geom_density(alpha=0.55)
p
##########################Melbourne#############
weathermelbourne <- weatherAUS[weatherAUS$Location == 'Melbourne',]
cities <- c("Melbourne")
ds <- subset(weatherAUS, Location %in% cities & ! is.na(Temp3pm))

p  <- ggplot(ds, aes(Temp3pm, colour=Location, fill=Location))
p  <- p + geom_density(alpha=0.55)
p
##########################Adelaide#############
weatheradelaide <- weatherAUS[weatherAUS$Location == 'Adelaide',]
cities <- c("Adelaide")
ds <- subset(weatherAUS, Location %in% cities & ! is.na(Temp3pm))

p  <- ggplot(ds, aes(Temp3pm, colour=Location, fill=Location))
p  <- p + geom_density(alpha=0.55)
p
##########################Perth#############
weatherperth <- weatherAUS[weatherAUS$Location == 'Perth',]
cities <- c("Perth")
ds <- subset(weatherAUS, Location %in% cities & ! is.na(Temp3pm))

p  <- ggplot(ds, aes(Temp3pm, colour=Location, fill=Location))
p  <- p + geom_density(alpha=0.55)
p
##########################Brisbane#############
weatherbrisbane <- weatherAUS[weatherAUS$Location == 'Brisbane',]
cities <- c("Brisbane")
ds <- subset(weatherAUS, Location %in% cities & ! is.na(Temp3pm))

p  <- ggplot(ds, aes(Temp3pm, colour=Location, fill=Location))
p  <- p + geom_density(alpha=0.55)
p
