function getUserInfo() {

    axios.get('/my/userinfo').then(res => {
        console.log(res)
        if (res.status !== 0) return layer.msg('获取信息失败')
        const { data } = res
        // 1 获取用户名称
        const name = data.nickname || data.username
            // 2 渲染用户名称

        $(".nickname").text(`欢迎 ${name}`).show()
            // 3 渲染头像
        if (data.user_pic) {
            $(".avatar").prop('src', data.user_pic).show()
            $('.text-avatar').hide()
        } else {
            $(".text-avatar").text(name[0].toUpperCase()).show()
            $('.avatar').hide()
        }

    })


}
getUserInfo()
$(function() {

    $("#logout").click(function() {
        //清理token
        localStorage.removeItem('token')
        location.href = "../../login.html"

    })
})