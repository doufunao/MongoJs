//寻找出现这些词的微博的条数
var weibo = new Mongo().getDB('weibo');

var words = ['失独', '失独老人', '失独家庭', '养老机构', '独生子女', '丧子', '特别扶助金'];

var id_arr = [1219859717, 2813805830, 2732038281, 2807754904, 2394254754, 1667729187, 2807587880, 2426339760, 1878846264, 2732293055, 2903473347, 2774454084, 2732726341, 2238163910, 2710330057, 2807967564, 2732529357, 2013835867, 2806599390, 2732290021, 1890743667, 2096802421, 2616127863]

var timeline = weibo.getCollection('timeline0313');



var findWord = function (word) {
    var result = weibo.timeline0313.find({content: new RegExp(word)});
    return result
};

var findId = function (uid){
    var result = weibo.timeline0313.find({ouid: new RegExp(uid)})
    print(result.length());
    return result
};
// findId(2807577540);

var findIdsNum = function (id_arr){
    for (var i = id_arr.length - 1; i >= 0; i--) {
      print(id_arr[i]);
      findId(id_arr[i]);
    };

  };

findIdsNum(id_arr);

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