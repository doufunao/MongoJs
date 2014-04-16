var weibo = new Mongo().getDB('weibo');
var relation = weibo.getCollection('relation');

var getFollowType = function (doc){
	///1 : followee 2: follower 0:error
	if (String(doc.followee_uid) != "undefined"){
		return 1
	}else if(String(doc.follower_uid) != "undefined"){
		return 2
	}else{
		return 0
	};

};

var printRelationList = function (results){

	results.forEach(function (doc) {
		var b = getFollowType(doc);
		if(b === 1){
			print(Number(doc.user_id) + ',' + Number(doc.followee_uid));
		}
		else if(b === 2){
			print(Number(doc.follower_uid) + ',' + Number(doc.user_id));
		}else{
			print('error')
			}
		}
	);

};
printRelationList(relation.find())