$(function() {

    const { layer, form } = layui

    function initUserInfo() {

        axios.get('/my/userinfo').then(res => {
            if (res.status !== 0) {
                return layer.msg('获取失败')
            }
            const { data } = res
            form.val('edit-userinfo', data)



        })
    }

    initUserInfo()

    //表单验证
    form.verify({
        nick: [
            /^\w{1,6}$/,
            '昵称必须在1-6个字符之间'
        ]
    })

    //提交表单
    $(".base-info-form").submit(function(e) {
        e.preventDefault()

        axios.post('/my/userinfo', $(this).serialize())
            .then(res => {
                console.log(res);
                //提交修改
                if (res.status !== 0) return layer.msg('修改信息错误')

                layer.msg('修改信息成功')

                //更新用户信息，将用户信息渲染到个人信息上
                window.parent.getUserInfo()

            })


    })

    // 4 重置功能
    $('#reset-btn').click(function(e) {
        e.preventDefault()
            //重置
        initUserInfo()
    })





})