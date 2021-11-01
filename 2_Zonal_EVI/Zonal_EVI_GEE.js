// Upload the dataset
var dataset = ee.ImageCollection('MODIS/006/MOD13Q1').select('EVI');
// Shapefile of the study area 
var poly = ee.FeatureCollection("FAO/GAUL/2015/level2").filter(ee.Filter.inList('ADM1_NAME', ['Maharashtra']));

// settings for the years to filter on
var interval = 1;
var increment = 'year';
var start_date = '2015-01-01';
var end_date = '2017-01-01';

// make a list of start years
var nIntervals = ee.Date(end_date).difference(start_date, increment).subtract(1);
var startDates = ee.List.sequence(0, nIntervals, interval);
var ranges = startDates.map(function(i) {
  var startRange = ee.Date(start_date).advance(i, increment);
  var endRange = startRange.advance(interval, increment);
  return ee.DateRange(startRange, endRange);
});
// print(ranges)

var myList = ee.List.sequence(0, ranges.length().subtract(1), 1)
var list = myList.map(function (number){
  var range1 = ee.DateRange(ranges.get(number)).start().millis()  
  return range1
})
// print(list)

var reducers = ee.Reducer.mean().combine({
  reducer2: ee.Reducer.stdDev(),
  sharedInputs: true
  }).combine({
  reducer2: ee.Reducer.variance(),
  sharedInputs: true
  });


//This function computes mean for each district
var NDVImean = function(feature) {
  var composites_value = function(date, feat){
    date = ee.Date(date)
    feat = ee.Feature(feat)
    var actualyear = date.get('year')
    var filtCol = dataset.filterDate(ee.Date(date), ee.Date(date).advance(interval, increment));
    var meanImage = filtCol.mean().clip(feature.geometry());
    // add the mean to every image
    var combineVal = meanImage.reduceRegion({
      reducer: reducers,
      geometry: feature.geometry(),
      scale: 250
    });
    var mean = ee.Number(combineVal.get("EVI_mean"));
    var mean_name = ee.String("EVI_mean_").cat(actualyear)
    
    var stdDev = ee.Number(combineVal.get("EVI_stdDev"));
    var stdDev_name = ee.String("EVI_stdDev_").cat(actualyear)
    
    var variance = ee.Number(combineVal.get("EVI_variance"));
    var variance_name = ee.String("EVI_variance_").cat(actualyear)
    
    return feat.set(mean_name, mean, stdDev_name, stdDev, variance_name, variance)
  };

// iterate over the sequence
  var newfeat = ee.Feature(list.iterate(composites_value, feature))

// return feature with new properties
  return newfeat 
  
};

var result = poly.map(NDVImean);
print(result)



Export.table.toDrive({
  collection: result,
  description:'zonal_EVI',
});

