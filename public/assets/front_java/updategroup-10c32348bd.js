let filePreview=function(o){$(o).change(function(i){let e=$("+img",$(o));if($(o)[0].files&&$(o)[0].files[0]){let i=new FileReader;i.onload=function(i){$(e).prop("src",i.target.result),$("#pic-remove").css("display","block")},i.readAsDataURL($(o)[0].files[0])}})},button_display=function(i){""==$(i).prop("src")?$("#pic-remove").css("display","none"):$("#pic-remove").css("display","block")},img_remove=function(o){$("#pic-remove").click(function(i){var e=$("+img",$(o));$(e).prop("src",""),$(o).val(""),$("#pic-remove").css("display","none")})},profile_pic=$("#profile-pic>input");button_display(profile_pic),filePreview(profile_pic),img_remove(profile_pic);