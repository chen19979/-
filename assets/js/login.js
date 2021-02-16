$(function() {
    const { form } = layui

    $('.link a').click(function() {
        console.log(123);
        $('.layui-form').toggle()
    })


    form.verify({
        pass: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        samePass: function(value) {
            if (value !== $('#pass').val()) {
                return '两次密码不一样'
            }
        }
    })

    //实现注册事件
    $(".reg-form").submit(function(e) {
        //阻止默认行为
        e.preventDefault()
            //发送ajax 请求数据
        axios.post('/api/reguser',
            $(this).serialize()).then(res => {
            console.log(res)
                //校验失败
            if (res.status !== 0) {
                return layer.msg('注册失败')
            }
            layer.msg('注册成功')
            $('.reg-form a').click()

        })
    })

    //登录功能
    $(".login-form").submit(function(e) {
        e.preventDefault()
        axios.post('/api/login', $(this).serialize())
            .then(res => {
                console.log(res)
                    //校验失败
                if (res.status !== 0) {
                    return layer.msg('注册失败')
                }
                layer.msg('注册成功')
                localStorage.setItem('token', res.token)
                location.href = "index.html"


            })




    })







})