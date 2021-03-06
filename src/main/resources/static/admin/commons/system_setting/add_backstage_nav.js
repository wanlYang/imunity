layui.use(['form', 'layer', 'laydate'], function() {
	var form = layui.form
	layer = parent.layer === undefined ? layui.layer : top.layer,
		$ = layui.jquery,
		laydate = layui.laydate;
	var date = new Date();
	//获取权限信息
	$.ajax({
		type: "POST",
		url: getRealPath() + "/admin/manager/role/get/list",
		data:{"flag":1},
		success: function(result) {
			if(result.status == 200) {
				var roleCheckboxHtml = "";
				$.each(result.data, function(index,item) {
					roleCheckboxHtml += "<input type='checkbox' name='rolesString' value="+item.id+" title="+item.name+">";
				});
				$(".stringRoles-super-admin").html(roleCheckboxHtml);
				$(".stringRoles-super-admin input[value='3']").attr("checked","checked");
			}
			form.render();
		}
	});
	// 获取所有导航,最高到二级
	$.ajax({
		type: "POST",
		url: getRealPath() + "/admin/manager/nav/page/nav/top",
		data:{"flag":2},
		success: function(result) {
			if(result.status == 200) {
				var navHtml = '';
				$.each(result.data, function(index,item) {
					navHtml += '<option value="'+item.navId+'">'+item.title+'</option>';
				});
				$("#parentLevel").append(navHtml);
			}
			form.render();
		}
	});
	// 添加自定义表单验证
	form.verify({});
	// 监听表单
	form.on("submit(addNav)", function(data) {
		var roleArr = new Array();
		$("input:checkbox[name='rolesString']:checked").each(function(i) {
			roleArr[i] = $(this).val();
		});
		if(roleArr.length == 0) {
			top.layer.msg("还未选择权限", {
				icon: 5,
				time: 1500,
				anim: 6,
				shade: 0.2,
        		shadeClose: true //开启遮罩关闭
			});
			return false;
		}
		data.field.rolesString = roleArr.join(","); // 将数组合并成字符串
		var index = top.layer.msg('数据提交中,请稍候', {
			icon: 16,
			time: false,
			shade: 0.8
		});
		// 实际使用时的提交信息
		$.ajax({
			type: "POST",
			url: getRealPath() + "/admin/manager/nav/submit/nav",
			data: data.field,
			success: function(result) {
				if(result.status == 200) {
					setTimeout(function() {
						top.layer.close(index);
						top.layer.msg("导航添加成功！");
						layer.closeAll("iframe");
						parent.location.reload();
					}, 500);
				}else{
					top.layer.close(index);
					top.layer.msg(result.message);
				}
			},
			complete: function (XMLHttpRequest,textStatus) {
				top.layer.close(index);
			}
		});
		return false;
	})
	
})