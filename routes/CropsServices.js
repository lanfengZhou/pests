function queryAll(filters,start,limit){
	var sql='select * from crops as c'
	if (filters!=null&&filters!='') {
		var filter=JSON.parse(filters);
		var rules=filter.rules;
		if(rules.length>0){
			sql+=' where ';
		}
		for(var i=0;i<rules.length;i++){
			var filter=rules[i];
			sql+=filter.field;
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
