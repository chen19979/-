$(function() {

    const { form, laypage } = layui

    // 1 获取文章的分类列表数据

    getCateList()

    function getCateList() {
        axios.get('/my/article/cates').then(res => {
            console.log(res);

            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }

            res.data.forEach(item => {
                    $('#cate-sel').append(`<option value="${item.Id}">${item.name}</option>`)

                })
                //更新全部
            form.render();

        })




    }

    // 2 定义一个查询对象
    const query = {

        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''

    }

    // 3 发送请求到服务器，获取文章列表数据
    randerTable()

    function randerTable() {
        axios.get('/my/article/list', { params: query }).then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }
            //调用模板函数之前去注册过滤器
            template.defaults.imports.dateFormat = function(date) {
                return moment(date).format('YYYY/MM/DD HH:mm:ss')
            }


            //获取成功后渲染页面
            const htmlStr = template('tpl', res)
            console.log(htmlStr);

            //添加到tbody中
            $('tbody').html(htmlStr)

            //调用分页器函数
            renderPage(res.total)
        })

    }

    //4 分页符函数
    function renderPage(total) {
        laypage.render({
            elem: 'pagination', //这里是分页内容的ID
            count: total, //数据总数，从服务器得到
            limit: query.pagesize, //没页显示数
            limits: [2, 3, 4, 5], //每页的数据条目
            curr: query.pagenum, //当前的页码值
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //分页器分布排版
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数

                //4.1 修改查询对象的参数
                query.pagenum = obj.curr
                query.pagesize = obj.limit

                //首次不执行
                if (!first) {
                    //do something
                    //非首次进入页面  需要重新渲染表格数据
                    randerTable()

                }
            }
        })

    }

    //5 表单筛选功能
    $(".layui-form").submit(function(e) {
        e.preventDefault()

        // 5.1 获取下拉选择器分类和状态 this.seralize()
        const cate_id = $('#cate-sel').val()
        const state = $('#state').val()
        console.log(cate_id, state);

        //5.2 把获取的元素重新赋值给query

        query.cate_id = cate_id
        query.state = state
            //将页码值归1
        query.pagenum = 1
            //重新调用渲染表格的方法
        randerTable()
    })

    //6 点击删除按钮
    $(document).on('click', '.del-btn', function() {
        // 6.1 获取自定义属性
        const id = $(this).data("id")
        console.log(id);
        // 6.2 弹出询问框

        layer.confirm('确定删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            //发送数据请求到服务器
            axios.get(`/my/article/delete/${id}`).then(res => {
                if (res.status !== 0) {
                    return layer.msg('删除失败!')
                }
                layer.msg('删除成功!')

                //优化处理  当前页只有一条数据且不在第一页时候，点击删除数据后，手动更新上一页的数据
                if ($('.del-btn').length == 1 && query.pagenum !== 1) {
                    query.pagenum = query.pagenum - 1
                }

                //重新渲染表格
                randerTable()
            })
            layer.close(index)
        });

    })

    //7 点击编辑按钮，跳转到文章编辑页面

    $(document).on('click', '.edit-btn', function() {
        //获取当前的ID
        const id = $(this).data('id')
            //如何在有两个页面之间进行数据传递，使用查询参数
        location.href = `../../../article/edit.html?id=${id}`
        window.parent.$('.layui-this').next().find('a').click()

    })





})