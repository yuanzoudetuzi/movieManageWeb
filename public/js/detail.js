/**
 * Created by Administrator on 2017/10/22.
 * 处理回复评论
 */

$(function () {
    $('.comment').click(function (e) {
        var target = $(this);
        var toId = target.data('tid');
        var commentId = target.data('cid');
        /*判断隐藏域是否已经存在，存在是之前已经点击过了。直接进行赋值*/
        if($('#toId').lenghth >0 ) {
            $('#toId').val(toId);
        } else {
            $('<input>').attr({
                type:'hidden',
                id:'toId',
                name:'comment[tid]',
                value:toId
            }).appendTo('#commentForm');
        }

        if($('#commentId'.length > 0)) {
            ('#commentId').val(commentId);
        } else {
            $('<input>').attr({
                type:'hidden',
                id:'commentId',
                name:'comment[cid]',
                value:commentId
            }).appendTo('#commentForm');
        }
    });
});


