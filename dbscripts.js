//寻找出现这些词的微博的条数
var weibo = new Mongo().getDB('weibo');

var words = ['失独', '失独老人', '失独家庭', '养老机构', '独生子女', '丧子', '特别扶助金'];

// var id_arr = [1219859717, 2813805830, 2732038281, 2807754904, 2394254754, 1667729187, 2807587880, 2426339760, 1878846264, 2732293055, 2903473347, 2774454084, 2732726341, 2238163910, 2710330057, 2807967564, 2732529357, 2013835867, 2806599390, 2732290021, 1890743667, 2096802421, 2616127863];
// var id_arr = [2807571972, 1219859717, 2813805830, 2732038281, 2552489752, 2807754904, 2732726341, 2394254754, 1667729187, 2238163910, 2807587880, 2806774954, 2732036267, 1259082415, 2426339760, 1878846264, 2732293055, 2903473347, 2774454084, 1097414213, 2806601670, 2710330057, 2807967564, 2732529357, 1996362704, 2013835867, 2806585820, 2806599390, 2732689251, 2732290021, 1646479337, 2732349041, 1281908722, 1890743667, 2096802421, 2616127863, 2806806650];
//var id_arr = [1219859717, 2813805830, 2732038281, 2732126477, 2807576980, 2807754904, 2812125724, 1714192160, 2394254754, 1667729187, 2807587880, 1890743667, 2426339760, 2732353395, 1878846264, 2807925562, 2732293055, 2903473347, 2774454084, 2732726341, 2238163910, 2710330057, 2807967564, 2732529357, 2808816592, 2013835867, 2363937500, 2806599390, 2732290021, 2732159987, 2096802421, 2616127863, 1625486207];
//var id_arr = [1219859717, 2813805830, 2732038281, 2807754904, 2806655774, 2732726341, 2394254754, 1667729187, 2807587880, 2476713901, 2426339760, 2806620574, 1878846264, 2732293055, 2903473347, 2774454084, 2686518341, 2238163910, 2732096711, 2710330057, 2807967564, 2732529357, 2013835867, 2806599390, 2522887395, 2732290021, 1890743667, 2096802421, 2616127863];
// var id_arr = [1219859717, 2813805830, 2732038281, 2807754904, 2807577540, 2394254754, 1667729187, 2807587880, 2426339760, 1878846264, 2732293055, 2903473347, 2774454084, 2732726341, 2238163910, 2710330057, 2807967564, 2732529357, 2013835867, 2806599390, 2732290021, 1869065701, 1890743667, 2096802421, 2616127863];
// var id_arr = [1614274951];
var id_arr = [2013835867,3680148261,2807577540,3872563974,2732096711,1246025491,1614274951,3481079677,1235313783,2526688941];

var timeline = weibo.getCollection('timeline0313');



var findWord = function (word) {
    var result = weibo.timeline0313.find({content: new RegExp(word)});
    return result
};

var findId = function (uid){
    var result = weibo.timeline0313.find({ouid: new RegExp(uid)});
    // print(result.length());
    return result
};
// findId(2732096711);

var findIdsNum = function (id_arr){
    for (var i = id_arr.length - 1; i >= 0; i--) {
      print(id_arr[i] + ' : ' + findId(id_arr[i]).length());
      ;
    };

  };
var joinText = function (uid){
    var cursor = findId(uid);
    var text = "";
    cursor.forEach(function (doc) {
      text += doc.content.trim();
        }
      );
    return text
};
// findIdsNum(id_arr);
var printIdsText = function (id_arr){
   for (var i = id_arr.length - 1; i >= 0; i--) {
     print(id_arr[i] + ',' + joinText(id_arr[i]));
   };
};
printIdsText(id_arr);

var printCursor = function (result){
  for (var i = 0; i< result.length(); i++){
    printjson(result[i]);
  };
};

// printCursor(findId(2807577540));
var insertdb = function (cursor, collname){
  var coll = weibo.getCollection(collname);
  cursor.forEach(function (doc){
    coll.insert(doc);
  });
};
var insertWords = function (words){
  words.forEach(function (word){
    var cursor = findWord(word);
    insertdb(cursor, String(word));
  });
};

//insertWords(words);

//共现词的微博
var coword_print_len = function (word1, word2) {
  var words_result = weibo.timeline0313.find({
    $and: [{ content: new RegExp(word2)}, { content: new RegExp(word2)}]
  });
  /*
  words_result.forEach(function (result) {
    printjson(result['ouid']);
    printjson(result['content']);
  });*/
  print(word1 + ' and ' + word2 + ':' + words_result.length());
}

var print_len2 = function (words){
  for (var i = 0; i< words.length; i++){
    for (var j = i + 1; j< words.length; j++) {
      coword_print_len(words[i],words[j]);
      };   
    };
  };

//print_len2(words);

var distinct = function(words){

  for (var i = 0; i < words.length; i++) {
    var coll_i = weibo.getCollection(words[i]);
    print(words[i])
    print(coll_i.distinct('ouid'));
    }
};

//distinct(words);