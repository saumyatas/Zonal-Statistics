# Zonal-Statistics
Google Earth Engine(GEE) is an open-source platform for geospatial data analysis and its fast computation. We all know how tedious it is to download each satellite data tile and then curate it according to our need for further analysis. Even their analysis might need a high-end system with fast computing software if we are dealing with time-series data. All this could be done in just a few minutes and very little coding on GEE. Geospatial data computation on GEE not only saves time and storage but also provides flexibility. They have open-source [data catalog](https://developers.google.com/earth-engine/datasets/) including `Landsat` datasets, `Sentinel` datasets, `MODIS` Datasets, `NAIP` data, precipitation data, sea surface temperature data, `CHIRPS` climate data, and elevation data. You can check out this paper to know more about the GEE platform. - [Google Earth Engine: Planetary-scale geospatial analysis for everyone](https://www.sciencedirect.com/science/article/pii/S0034425717302900)

There are different types of spatial-temporal analysis with their respective real-world application. With the help of a wide variety of satellite data collected since the start of the Landsat series in 1972, one can compute various indices across both space and time. This repository will cover most of the zonal computation along with its example in a real-world implementation. It results in creating a `Comma delimited table` for each analysis until mentioned otherwise.

## Installing
```bash
git clone https://github.com/saumyatas/Zonal-Statistics.git
```

## Contents[^note]
[^note]: You can provide your suggestion with any other examples of zonal statistics. I will update this repository with new examples in time.
1. Extract NDVI using MODIS data at each GPS points.
2. Extracting mean vegetation index for each year.

### 1. Extract NDVI using MODIS data at each GPS points.
We often conduct ground survey to analyse the land use of our study area. As one of the example, I have witnessed that we often need land use of animal camera trap points collected over the period of time, in order to anlyze their migration pattern and movement analysis. This example is inspired by [Enhancing Animal Movement Analyses: Spatiotemporal Matching of Animal Positions with Remotely Sensed Data Using Google Earth Engine and R](https://www.mdpi.com/2072-4292/13/20/4154) paper. They have analyzed vegetation index and temperature index using MODIS and ERA5 data respectively on R. `MODIS` dataset have 250 meter spatial and 16 days temporal resolution, thus we can use this for closely spaced points. But as per for the temperature index, as ERA5-Land Hourly data have 11132 meter as spatial resolution, so I will use other methods to extract it. For this particular example I have used their open source [data](https://github.com/Smithsonian/SpatiotemporalMatchingOfAnimalPositionsWithRemotelySensedDataUsingGoogleEarthEngineAndR/blob/main/Data/Data.csv). 

### 2. Extracting mean vegetation index for each year.

