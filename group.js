var weibo = new Mongo().getDB('weibo');

var words = ['失独', '失独老人', '失独家庭', '养老机构', '独生子女', '丧子', '特别扶助金'];

var timeline = weibo.getCollection('timeline0313');
var relation = weibo.getCollection('relation');

var coll_group = function(collname ,limitnum){
  var coll = weibo.getCollection(collname);
  var results = coll.aggregate(
    {$group: { _id : '$ouid', count: { $sum : 1 } } },
    {$sort : { count : -1} },
    {$limit : limitnum}
    );
  return results['result'];
};

var print_coll_group = function (words, limitnum){  
    words.forEach(function (word){
      var results = coll_group(word, limitnum);
      print(word);
      results.forEach(function (result){
        var x1 = result['_id']; 
        var x2 = result['count'];
        print(x1 + ',' + x2);
    });
  });
};
//print_coll_group(words, 20);

var findUserRelation = function (group_results){
  var results = group_results;
  var relation_list = [];
  results.forEach(function (result){
    var user_id = result['_id'];
    var cursor = relation.find({
      $or : [{
        user_id: new RegExp(user_id)
      }, {
        followee_uid : new RegExp(user_id)
      }, {
        follower_uid : new RegExp(user_id)
        }]
      });
    cursor.forEach(function (doc){
      if (doc['follow_type'] === 1) {
        //print(doc['user_id'] + ',' + doc['followee_uid']);
        relation_list.push([doc['user_id'], doc['followee_uid']]);
      }else if (doc['follow_type'] === 2) {
        //print(doc['follower_uid'] + ',' + doc['user_id']); 
        relation_list.push([doc['follower_uid'], doc['user_id']]);
      };
    });
  });
  return relation_list
};

//findUserRelation(coll_group('失独', 5));

var ListtoObject = function (relist){
  var dict = {};
  var new_list = [];
  relist.forEach(function (arr){
    
    dict['user_id'] = arr[0];
    dict['followee_uid'] = arr[1];
    new_list.push(dict);
    dict = {};
  });
  return new_list
};

var insertdb = function (cursor, collname){
  var coll = weibo.getCollection(collname);
  cursor.forEach(function (doc){
    coll.insert(doc);
  });
};

var insertRelationList = function (relist, collname){
  var new_list = ListtoObject(relist);
  insertdb(new_list, collname);
};

insertRelationList(findUserRelation(coll_group('失独', 5)), 'sort1516');

///use caculate_ration function , the resultlist must sort by user_id asce
    /*  
    {$group: { _id : '$ouid', count: { $sum : 1 } } },
    {$sort : { _id : 1} }
    );
    */

var coll_group_ratio = function(collname){
  var coll = weibo.getCollection(collname);
  var results = coll.aggregate(
    {$group: { _id : '$ouid', count: { $sum : 1 } } },
    {$sort : { _id : 1} }
    );
  return results['result'];
};

var caculate_ratio = function(resultlist, allset){
  var arr = new Array();
  var len1 = resultlist.length;
  var len2 = allset.length;

  var i = 0; var j = 0;
  while(!(i === len1 || j === len2)) {
    if (resultlist[i]['_id'] === allset[j]['_id']) {
      var ratio = (resultlist[i]['count'])/(allset[j]['count']);
      var ouid = resultlist[i]['_id'];
      dict = new Object();
      dict[ouid] = ratio;
      arr.push(dict);
      i++;j++;
    }
    else if(resultlist[i]['_id'] > allset[j]['_id']){
      j++;
    }
    else{
      i++;
    };
  };
  return arr;
};

var result = caculate_ratio(
    coll_group_ratio('失独'),
    coll_group_ratio('timeline0313'));


var mergeObject = function (listToMerge) {
  var oneObject = {};
  listToMerge.forEach(function (obj) {
    Object.keys(obj).forEach(function (key) {
      oneObject[key] = obj[key];
    });
  });

  return oneObject;
};

var objectItems = function (obj) {
  var list = [];
  Object.keys(obj).forEach(function (key) {
    list.push([key, obj[key]]);
  });
  return list;
};

var sortObjectByValue = function (obj) {
  var items = objectItems(obj);
  items.sort(function (item1, item2) {
    return item2[1] - item1[1];
  })
  items.forEach(function (item){
    print(item[0] + '\t' + item[1]);
  });
  return items;
};

//printjson(sortObjectByValue(mergeObject(result)));
//printjson(result);

var caculate_ra = function(a1, a2){
  var len1 = a1.length;
  var len2 = a2.length;
  var i = 0; var j = 0;
  while(!(i === len1 || j === len2)){
    if(a1[i] === a2[j]){
      i++;j++;
    };
    if (a1[i] < a2[j]) {
      i++;
    };
    if (a1[i] > a2[j]) {
      j++;
    };
  };
};

//caculate_ra([1,2,3,4],[1,3,4,5,6,7]);