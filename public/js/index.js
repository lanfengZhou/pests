$(".list").click(function(){
	$(this).closest('li').find('ul').slideToggle("slow");
	$(this).closest('li').toggleClass('selected');
});
$("#pests,#crops").click(function(){
	var name=$(this).prop('name');
	$.get('/'+name+'/',function(data){
		$("#changeHtml").html(data);
	})
})