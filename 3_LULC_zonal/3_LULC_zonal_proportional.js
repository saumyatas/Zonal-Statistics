var poly = ee.FeatureCollection("FAO/GAUL/2015/level2").filter(ee.Filter.inList('ADM1_NAME', ['Maharashtra']));
// Map.addLayer(poly, {color: 'FF0000'}, 'poly');

var collection = ee.ImageCollection('MODIS/006/MCD12Q1').select('LC_Type1');
var LandCoverVis = {
  min: 1.0,
  max: 17.0,
  palette: [
    '05450a', '086a10', '54a708', '78d203', '009900', 'c6b044', 'dcd159',
    'dade48', 'fbff13', 'b6ff05', '27ff87', 'c24f44', 'a5a5a5', 'ff6d4c',
    '69fff8', 'f9ffa4', '1c0dff'
  ],
};
Map.setCenter(79.36997849547254,19.62635609320887, 12);
//Map.addLayer(collection, LandCoverVis, 'MODIS Land Cover');


var splitdataset = function(img){
  var class1 = img.lte(1).selfMask().set('val', 1);
  var class2 = img.gt(1).and(img.lte(2)).selfMask().set('val', 2);
  var class3 = img.gt(2).and(img.lte(3)).selfMask().set('val', 3);
  var class4 = img.gt(3).and(img.lte(4)).selfMask().set('val', 4);
  var class5 = img.gt(4).and(img.lte(5)).selfMask().set('val', 5);
  var class6 = img.gt(5).and(img.lte(6)).selfMask().set('val', 6);
  var class7 = img.gt(6).and(img.lte(7)).selfMask().set('val', 7);
  var class8 = img.gt(7).and(img.lte(8)).selfMask().set('val', 8);
  var class9 = img.gt(8).and(img.lte(9)).selfMask().set('val', 9);
  var class10 = img.gt(9).and(img.lte(10)).selfMask().set('val', 10);
  var class11 = img.gt(10).and(img.lte(11)).selfMask().set('val', 11);
  var class12 = img.gt(11).and(img.lte(12)).selfMask().set('val', 12);
  var class13 = img.gt(12).and(img.lte(13)).selfMask().set('val', 13);
  var class14 = img.gt(13).and(img.lte(14)).selfMask().set('val', 14);
  var class15 = img.gt(14).and(img.lte(15)).selfMask().set('val', 15);
  var class16 = img.gt(15).and(img.lte(16)).selfMask().set('val', 16);
  var class17 = img.gte(17).selfMask().set('val', 17);
  return ee.ImageCollection.fromImages([
    class1, class2, class3, class4, class5, class6, class7, class8, class9, class10, class11, 
    class12, class13, class14, class15, class16, class17
    ]);
};

var dataset
var feat
var year
var nd

//2005 onwards
var list = ee.List.sequence(1, 15); // total 15 years analysis is done here, from 2005-2019

var LULC = function(feature) {
  var addBands = function(year, feat){
    var totalClass = 17; // total no. of class in that particular LULC classification
    year = ee.Number(year).toInt()
    var actual_year = ee.Number(2004).add(year) // analysis start from the year 2005, so -1 year is added to it.
    var date = ee.Date(ee.String(actual_year))
    dataset = collection.filterDate(date).mean().clip(poly)
    nd = splitdataset(dataset);
    feat = ee.Feature(feat);
    var palette = [
      '05450a', '086a10', '54a708', '78d203', '009900', 'c6b044', 'dcd159',
      'dade48', 'fbff13', 'b6ff05', '27ff87', 'c24f44', 'a5a5a5', 'ff6d4c',
      '69fff8', 'f9ffa4', '1c0dff']
      
    for(var a=0; a<totalClass; a++){
      var showList = nd.filterMetadata('val', 'equals', a+1).map(function(img){
        return img.clip(feat);
      })
      //Map.addLayer(showList, {palette: palette[a]}, 'Class'+ ''+ (a+1), false)
      var combineVal = showList.toBands().reduceRegion({
        reducer: ee.Reducer.sum(),
        geometry: feature.geometry(),
        scale: 500
      });
      var cls = ee.String(ee.Number(a)).cat(ee.String("_LC_Type1"));
      var area = ee.Number(combineVal.getNumber(cls).multiply(250000))
      var name = ee.String(ee.Number(actual_year)).cat(ee.String("_Class_")).cat(ee.Number(a+1))
      if ((a+1)===1){var area_1 = area; var name_1 = name;}
      if ((a+1)===2){var area_2 = area; var name_2 = name;}
      if ((a+1)===3){var area_3 = area; var name_3 = name;}
      if ((a+1)===4){var area_4 = area; var name_4 = name;}
      if ((a+1)===5){var area_5 = area; var name_5 = name;}
      if ((a+1)===6){var area_6 = area; var name_6 = name;}
      if ((a+1)===7){var area_7 = area; var name_7 = name;}
      if ((a+1)===8){var area_8 = area; var name_8 = name;}
      if ((a+1)===9){var area_9 = area; var name_9 = name;}
      if ((a+1)===10){var area_10 = area; var name_10 = name;}
      if ((a+1)===11){var area_11 = area; var name_11 = name;}
      if ((a+1)===12){var area_12 = area; var name_12 = name;}
      if ((a+1)===13){var area_13 = area; var name_13 = name;}
      if ((a+1)===14){var area_14 = area; var name_14 = name;}
      if ((a+1)===15){var area_15 = area; var name_15 = name;}
      if ((a+1)===16){var area_16 = area; var name_16 = name;}
      if ((a+1)===17){var area_17 = area; var name_17 = name;}
    }
    // Map.centerObject(feature.geometry(), 12)
    return feat.set(name_1, area_1, name_2, area_2, name_3, area_3, name_4, area_4, name_5, area_5, 
    name_6, area_6, name_7, area_7, name_8, area_8, name_9, area_9, name_10, area_10, name_11, area_11, 
    name_12, area_12, name_13, area_13, name_14, area_14, name_15, area_15, name_16, area_16, name_17, area_17)
  };
  var newfeat = ee.Feature(list.iterate(addBands, feature));
  return newfeat;
};

var result = poly.map(LULC);
print(result)

Export.table.toDrive({
  collection: result,
  description:'LULC_zonal_proportional'
});
