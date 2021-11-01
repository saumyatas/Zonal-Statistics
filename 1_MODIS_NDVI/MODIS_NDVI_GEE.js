Map.setCenter(36.021, -1.578, 10)
Map.addLayer(GPS_data.geometry(), {color: 'red'}, "data"); // to visualize the data on Map
print(GPS_data, "GPS Points") 

//-------------------------------------------Raster Data------------------------------------------

var modisCol = ee.ImageCollection('MODIS/006/MOD13Q1') 
                  .filter(ee.Filter.date('2010-01-01', '2013-01-01'));
print(modisCol, "Raster data used")

var addDate = function(feature) {
  var datefeat = ee.String(feature.get('timestamp')).split(' ').get(0) // to extract only date feature and excluding time
  var parsedate = ee.Date.parse('YYYY-MM-dd', datefeat) // change the format as per your data
  return feature.set({date: parsedate.millis()}); //'date' property added
};

// Map the date getting function over the FeatureCollection.
var data_update = GPS_data.map(addDate);
print(data_update, "GPS data with date")

var tempwin = 16 // temporal resolution of the raster dataset
var imgscale = 250 // spatial resolution of the raster dataset
var imagecoll = modisCol // image collection used
var band = "NDVI" // band or the pixel value to be extracted

//---------------------------------------Required functions------------------------------------------------

var maxDiffFilter = ee.Filter.maxDifference(tempwin*24*60*60*1000, "date",null,"system:time_start", null)

var saveBestJoin=ee.Join.saveBest("bestImage","timeDiff")

var add_value=function(feature){
  //Get the image selected by the join
  var img1 = ee.Image(feature.get("bestImage")).select(band)
  //Extract geometry from the feature
  var point = feature.geometry()
  //Get pixel value for each point at the desired spatial resolution (argument scale)
  var pixel_value = img1.sample(point, imgscale, null, null, null, 0, false , 16, false)
  //Return the data containing pixel value and image date.
  return feature.setMulti({
    NDVI: pixel_value.first().get(band) ,DateTimeImage: img1.get('system:index')}) // change the column name as per the band name 'NDVI
}

// Function to remove image property from features
var removeProperty= function(feature) {
  //Get the properties of the data
  var properties = feature.propertyNames()
  //Select all items except images
  var selectProperties = properties.filter(ee.Filter.neq("item", "bestImage"))
  //Return selected features
  return feature.select(selectProperties)
}


var data = data_update
var Data_match= saveBestJoin.apply(data, imagecoll, maxDiffFilter)
var DataFinal = Data_match.map(add_value)
var DataFinal = DataFinal.map(removeProperty)

print(DataFinal, "Extracted Pixel value database")

Export.table.toDrive({
  collection: DataFinal,
  description:'DataFinal'
});
