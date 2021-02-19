$(function() {

    //定义弹出层的地址
    let index
    const { form } = layui


    // 第一步 添加表单类别

    // 1 页面开始从服务器获取列表数据 并进行渲染
    getCateList()

    function getCateList() {
        //1.1 发送ajax请求
        axios.get('/my/article/cates').then(res => {
            console.log(res);
            // 1.2 判断请求是否失败
            if (res.status !== 0) {
                return layer.msg('获取分类列表失败!')
            }

            //1.3 请求成功
            //使用模板引擎函数 
            const htmlStr = template('tpl', res)
            console.log(htmlStr);

            //渲染页面之前先清理页面
            // $('tbody').empty()

            //渲染到页面
            $('tbody').html(htmlStr)

        })
    }

    // 第二步 编辑按钮的修改事件  有弹出层

    //点击编辑按钮  
    $("#add-btn").click(function() {

        index = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $(".add-form-container").html() //这里content是一个普通的String
        });
    })


    // 第三步 监听  弹出层  修改事件添加表单的内容

    //注意：这个表单点击事件之后再去添加的，后创建的元素绑定事件统一使用“事件委托”
    $(document).on('submit', '.add-form', function(e) {
        e.preventDefault()

        //发送请求 把表单数据提交给服务器
        axios.post('/my/article/addcates', $(this).serialize())
            .then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('提交失败!')
                }
                //提交成功
                layer.msg('提交成功!')
                    //关闭弹出层
                layer.close(index)

                //重新再调用函数渲染页面
                getCateList()
            })

    })

    // 第四步  编辑按钮点击事件  有弹出层

    //监听修改表单内容
    $(document).on('click', '#edit-add', function(e) {
        e.preventDefault()
        console.log(1213);
        //点击之后，弹回层
        index = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $(".edit-form-container").html() //这里content是一个普通的String
        });
        //获取自定义属性值
        console.log($(this).data('id'));
        const id = $(this).data('id')

        //发送数据请求到服务器
        axios.get(`/my/article/cates/${id}`).then(res => {
            console.log(res);

            if (res.status !== 0) {
                return layer.msg('获取失败!')

            }

            //如果表单获取成功
            form.val('edit-form', res.data)
        })
    })

    // 第五步    监听  弹出层  修改事件添加表单的内容


    $(document).on('submit', '.edit-form', function(e) {
        e.preventDefault()
        axios.post('/my/article/updatecate', $(this).serialize()).then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }
            //获取成功
            //关闭弹出层
            layer.close(index)

            //重新再调用函数渲染页面
            getCateList()

        })

    })

    // 第六步   点击删除按钮的修改事件  有弹出层
    $(document).on('click', '.pass-form', function(e) {
        e.preventDefault()
        console.log(1);
        //获取自定义属性值
        console.log($(this).data('id'));
        const id = $(this).data('id')
            //弹出层
        layer.confirm('确定删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            //发送数据请求到服务器
            axios.get(`/my/article/deletecate/${id}`).then(res => {
                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                }
                layer.msg('获取成功!')
                    //如果表单获取成功
                    // $('res.id').parent().parent().empty()
                    //重新再调用函数渲染页面
                getCateList()
            })
            layer.close(index)
        });

    })



})