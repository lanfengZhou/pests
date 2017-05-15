$("#pestsList").jqGrid({
 	url:'/pests/query',
 	datatype:"json",
 	colNames:['名称','所属农作物','描述','添加时间','编辑'],
 	colModel:[
 		{name:'alias',index:'alias',width:50,align:'center',editable:true,editrules:{required:true},editoptions:{readonly:true}},
 		{name:'name',index:'name',width:60,align:'center',editable:false},
 		{name:'description',index:'description',width:180,align:'left',editable:true},
 		{name:'insertTime',index:'insertTime',width:60,align:'center',editable:false},
 		{name:'action',index:'act',width:50,align:'center',sortable:false,search:false}
 	],
 	jsonReader:{
 		root:'pests',
 		records:"total",
 		total:"pages"
 	},
 	rowNum:10,
 	rowList:[10,20,30],
 	pager:'#pager',
 	mtype : "post",
 	viewrecords:true,
 	caption:"病虫害信息管理",
 	rownumbers:true,
 	rownumWidth:40,
 	autowidth: true,
 	gridComplete:function(){
 		var ids=$("#pestsList").jqGrid('getDataIDs');
 		for(var i=0;i<ids.length;i++){
 			var cl=ids[i];
 			edit="<button style='height:30px;width:50px;' class='edit'>修改</button>";
 			del = "<button style='height:30px;width:50px;' class='delete'  onclick=\"jQuery('#pestsList').jqGrid('delGridRow','"
	                    + cl + "',{url:'/pests/delete',delData:{id:"+cl+"},});\" >删除</button>";
 			$("#pestsList").jqGrid('setRowData',ids[i],{
 			 	action:edit+del,
 			});
 		}
 		$(".edit").click(function(){
 			var id=$(this).closest("tr").prop("id");
 			$("#editNumbers").val(id);
 			$("#edit").show();
 			$("#add").hide();
 			$("#overlay").show();
			var gr=$("#pestsList").jqGrid('getRowData',id);
			$("#crops_id option").each(function(){  
		        if($(this).text() == gr.name){  
		            $(this).prop("selected",true);  
		        }  
		    });
		    $("#pestsForm input:text[name='name']").val(gr.alias);
		    $("#pestsForm input:text[name='description']").val(gr.description);
			$("#formDiv").slideDown("fast");
 		});
 	}
 });
 jQuery("#pestsList").jqGrid('navGrid','#pager',{edit:false,add:false,del:false,search:false})
 	.navButtonAdd('#pager',{
	caption:"添加定位对象",
	buttonicon:"ui-icon-add",
	onClickButton:function(){
		$("#overlay").show();
		$("#edit").hide();
 		$("#add").show();
 		$("input:text").val("");
 		$("#number").empty();
 		$("input:radio[value='false']").prop("checked",true);
 		$(".eleNumber").hide();
		$("#formDiv").slideDown("fast");
	},
	position:"last"
});
 $("#pestsList").jqGrid('setGridHeight',$(window).height()-240,true);
 $("#pestsList").jqGrid('filterToolbar',{stringResult: true,searchOnEnter : true});
 $("#cancle").click(function(){
 	$("#formDiv").slideUp("fast");
 	$("#overlay").hide();
 });
 $.get("/crops/getName", function(data){
 	for(var i=0;i<data.crops.length;i++){
 		$("#crops_id").append("<option value="+data.crops[i].id+">"+data.crops[i].name+"</option>");
 	}
 });
 $("#add,#edit").click(function(){
 	var name=$(this).prop("id");
 	$.ajax({
 		type:"POST",
 		url:"/pests/"+name,
 		datatype:"json",
 		data:$("#pestsForm").serialize(),
 		success:function(data){
 			// console.log(data);
 			$("#formDiv").slideUp("fast");
 			$("#overlay").hide();
 			$("#pestsList").jqGrid('setGridParam',{
 				url:'/pests/query',
 			}).trigger("reloadGrid");
 		}
 	})
 });