$("#cropsList").jqGrid({
 	url:'/crops/query',
 	datatype:"json",
 	colNames:['名称','描述','添加时间','编辑'],
 	colModel:[
 		{name:'name',index:'name',width:50,align:'center',editable:true,editrules:{required:true},editoptions:{readonly:true}},
 		{name:'description',index:'description',width:180,align:'left',editable:true},
 		{name:'insertTime',index:'insertTime',width:60,align:'center',editable:false},
 		{name:'action',width:50,align:'center',sortable:false,frozen : true,search:false}
 	],
 	jsonReader:{
 		root:'crops',
 		records:"total",
 		total:"pages"
 	},
 	rowNum:10,
 	rowList:[10,20,30],
 	pager:'#pager',
 	mtype : "post",
 	viewrecords:true,
 	caption:"农作物信息管理",
 	rownumbers:true,
 	rownumWidth:40,
 	autowidth: true,
 	gridComplete:function(){
 		var ids=$("#cropsList").jqGrid('getDataIDs');
 		for(var i=0;i<ids.length;i++){
 			var cl=ids[i];
 			edit="<button style='height:30px;width:50px;' class='edit'>修改</button>";
 			del = "<button style='height:30px;width:50px;' class='delete'  onclick=\"$('#cropsList').jqGrid('delGridRow','"
	                    + cl + "',{url:'/crops/delete',delData:{id:"+cl+"},});\" >删除</button>";
 			$("#cropsList").jqGrid('setRowData',ids[i],{
 			 	action:edit+del,
 			});
 		}
 		$(".edit").click(function(){
 			var id=$(this).closest("tr").prop("id");
 			$('#cropsList').jqGrid('editGridRow',id,
 				{
 					url:'/crops/edit',
 					// editData:$("#cropsForm").serialize(),
 				});
 		})
 	}
 });
 $("#cropsList").jqGrid('navGrid','#pager',{edit:false,add:false,del:false,search:false})
 	.navButtonAdd('#pager',{
	caption:"添加农作物",
	buttonicon:"ui-icon-add",
	onClickButton:function(){
		$("#overlay").show();
		$("#formDiv").slideDown("fast");
	},
	position:"last"
});
 // $("#cropsList").jqGrid('setGridHeight',1000,true);
 $("#cropsList").jqGrid('setGridHeight',$(window).height()-240,true);
 $("#cropsList").jqGrid('filterToolbar',{stringResult: true,searchOnEnter : true});
 $("#cancle").click(function(){
 	$("#formDiv").slideUp("fast");
 	$("#overlay").hide();
 });
 //名称重复性检查
 $("#name").blur(function(){
 	$.post("/crops/checkName",{name:$(this).val()},function(data){
 		if(data.result=="exist"){
 			$("#name").closest("div").next().show()
 			.html('*该农作物已经存在');
 		}
 		else{
 			$("#name").closest("div").next().hide();
 		}
 	});
 })
 $("#add").click(function(){
 	$.ajax({
 		type:"POST",
 		url:"/crops/"+$(this).prop("id"),
 		datatype:"json",
 		data:$("#cropsForm").serialize(),
 		success:function(data){
 			// console.log(data);
 			$("#formDiv").slideUp("fast");
 			$("#overlay").hide();
 			$("#cropsList").jqGrid('setGridParam',{
 				url:'/crops/query',
 			}).trigger("reloadGrid");
 		}
 	})
 });