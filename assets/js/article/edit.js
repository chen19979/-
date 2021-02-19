$(function() {

    const { form } = layui

    let state = ''


    //打印
    console.log(123);
    console.log(location.search) // ?id=

    //获取查询参数的id
    const arr = location.search.slice(1).split('=')
    const id = arr[1]
    console.log(arr[1])

    function getA(id) {
        axios.get(`/my/article/${id}`).then(res => {
            console.log(res)
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }
            //给form赋值
            form.val('edit-form', res.data)
                //初始化富文本编辑器
            initEditor(
                //替换裁剪区的封面图片
                $image.cropper('replace', 'http://api-breakingnews-web.itheima.net' + res.data.cover_img)
            )
        })
    }
    getA(id)


    //  1   从服务器获取文章分类列表
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

            getA(id)
                //更新全部
            form.render();

        })




    }
    // 2  调用富文本编辑器
    initEditor()


    // 3  获取要裁剪的图片
    var $image = $('#image');

    //  4  初始化裁剪区

    $image.cropper({
        aspectRatio: 400 / 280,
        //指定预览区
        preview: ".img-preview"

    });

    //  5 为选择封面按钮绑定点击事件
    $("#choose-btn").click(function() {
        $('#file').click()
    })

    //  6 给文件选择框绑定change事件
    $('#file').change(function() {
        // 6.1 获取所有文件列表
        console.log(this.files[0]);

        if (this.files.length !== 0) {
            // 6.2  把文件转换为blob格式的url
            let imgUrl = URL.createObjectURL(this.files[0])
                // 6.3 替换掉裁剪区的图片
            $image.cropper('replace', imgUrl)
        }

    })

    //7  监听表单提交事件
    $('.publish-form').submit(function(e) {
        e.preventDefault()

        //7.1 获取表单所有内容（formdata)
        const fd = new FormData(this)
        fd.forEach(item => {
            console.log(item);
        })

        //  7.2 向表单中增加state状态
        fd.append('state', state)

        //7.3 获取裁剪图片二进制格式
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280,
        }).toBlob(blob => {
            console.log(blob);
            fd.append('cover_img', blob)

            // 发送请求
            getPost(fd)
        })

    })

    // 8 点击发布和存为草稿按钮 改变state状态
    $('.last-row button').click(function() {
        // 8.1 获取自定义属性
        console.log($(this).data('state'));

        state = $(this).data('state')
    })


    //9 在最外层封装一个发布文章到服务器的函数。参数就是fd
    // 7 。4 发送请求
    function getPost(fd) {
        fd.append('Id', id)
        axios.post('/my/article/cates', fd).then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('编辑失败!')
            }
            layer.msg(state == '草稿' ? '保存草稿成功' : '发布文章成功')


            location.href = '../../../article/wenzhang.html'



            //更新左边的导航条
            window.parent.$('.layui-this').prev().find('a').click()


        })
    }

})