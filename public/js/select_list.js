/*
 * 基于 select2 和 jquery
 * 仅适用于以下 特征的 select 元素
 * 1. 带有 multi = "multi" 属性
 * 2. 内置了 class = "my-hidden-input" 的input
 *
 * 例如：
     <div>
         <label>屏蔽机型:</label>
         <select multiple="multiple">
         </select>
         <input class="my-hidden-input" type="hidden"/>
     </div>
 */
function init_select(dom, all, selected)
{
    var data = [];
    for (i in all) {
        var p = all[i];
        if (selected.indexOf(p) >= 0) {
            data.push({"id":i, "text":p, "selected":true});
        } else {
            data.push({"id":i, "text":p});
        }
    }

    $(dom).empty();
    $(dom).select2({data:data});
    $(dom).change(function(){
        var data = $(this).select2("data");
        var input = [];
        for (i in data) {
            input.push(data[i].text);
        }
        $(this).parent().find("input.my-hidden-input").val(input.join(","));
    });

}
