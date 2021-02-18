$(function() {

    const { form } = layui
    form.verify({
        pass: [
            /^\w{6,12}$/,
            '密码6-12位，不能有空格'
        ],
        confirmPass: function(val) {
            if (val !== $("#pass").val())
                return '两次密码不一样'
        }

    })

    $('.layui-form').submit(function(e) {
        e.preventDefault()
            //发起ajax请求
        axios.post('/my/updatepwd', $(this).serialize())
            .then(res => {
                console.log(res)
                if (res.status !== 0) return layer.msg('修改密码错误')
                layer.msg('修改密码成功')
                localStorage.removeItem('token')

                window.parent.location.href = "../../../login.html"

            })

    })



})