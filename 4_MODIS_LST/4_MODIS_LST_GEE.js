Map.setCenter(76.2316, 17.7771, 10)
Map.addLayer(data.geometry(), {color: 'red'}, "data"); 
print(data, "GPS data original")

//-------------------------------------------Raster Data------------------------------------------

var modisCol = ee.ImageCollection('MODIS/006/MOD11A2') 
                  .filter(ee.Filter.date('2010-10-01', '2012-10-01'));
print(modisCol, "Image collection")

var addDate = function(feature) {
  var datefeat = ee.String(feature.get('timestamp')).split(' ').get(0)
  var parsedate = ee.Date.parse('YYYY-MM-dd', datefeat) // change the format as per your data
  return feature.set({date: parsedate.millis()}); //'date' property added
};

// Map the date getting function over the FeatureCollection.
var data_update = data.map(addDate);
print(data_update, "GPS data with date")

var tempwin = 8 
var imgscale = 1000
var imagecoll = modisCol
var band = "LST_Day_1km" 

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
    LST_Day_1km: pixel_value.first().get(band) ,DateTimeImage: img1.get('system:index')}) // change the column name according to the band info
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
print(Data_match.first(), "Data_match")
var DataFinal = Data_match.map(add_value)
var DataFinal = DataFinal.map(removeProperty)

print(DataFinal.first(), "DataFinal")


Export.table.toDrive({
  collection: DataFinal,
  description:'DataFinal_LST'
});
