function queryAll(filters,start,limit){
	var sql='select p.*,c.name from pests as p left join crops as c on p.crops_id=c.id'
	if (filters!=null&&filters!='') {
		var filter=JSON.parse(filters);
		var rules=filter.rules;
		if(rules.length>0){
			sql+=' where ';
		}
		for(var i=0;i<rules.length;i++){
			var filter=rules[i];
			if(filter.field=="description"){
				sql+='p.'+filter.field;
			}else{
				sql+=filter.field;
			}
			sql+=" like '%"+filter.data+"%'";
			if (i<rules.length-1) {
				sql+=' and ';
			}
		}
	}
	sql+=' limit '+start+','+limit; 
	return sql;

}

module.exports=queryAll;
