$(function() {
    //1  获取元素  $image是cropper插件里面固有的样式
    var $image = $('#image');
    //2  初始化区域
    $image.cropper({
        //宽高比
        aspectRatio: 1,
        crop: function(event) {
            console.log(event.detail.x);
            console.log(event.detail.y);
            // console.log(event.detail.width);
            // console.log(event.detail.height);
            // console.log(event.detail.rotate);
            // console.log(event.detail.scaleX);
            // console.log(event.detail.scaleY);
        },
        //指定区域
        preview: ".img-preview"
    });

    //3  点击事件
    $("#upload-btn").click(function() {
        //3.1 手动触发文件筐点击事件
        $("#file").click()
    })

    //4 监听文件状态改变事件change ：file checkbox selick
    $("#file").change(function() {
        // 4.1 获取用户文件上传列表
        console.log(this.files); //伪数组

        //判断用户是否上传图片
        if (this.files.length == 0) return


        //4 2 把文件转化成URL地址的形式
        const imgUrl = URL.createObjectURL(this.files[0])
        console.log(imgUrl);
        // 4.3 替换照片 第一种方法
        $image.cropper('replace', imgUrl)

        // 4.3 替换照片 第二种方法
        // $image.cropper('destory').prop('src', imgUrl).cropper({
        //     //宽高比
        //     aspectRatio: 1,
        //     //指定区域
        //     preview: ".img-preview"
        // })

    })


    //5  点击   确定事件
    $("#save-btn").click(function() {
        console.log(123);
        //5.1 获取裁剪后图片的base64格式
        const dataUrl = $image.cropper('getCroppedCanvas', {
                //设置截取图片的宽高
                width: 100,
                height: 100
            }).toDataURL('image/jpeg')
            // console.log(dataUrl);

        // 5.2 手动构建查询参数
        const search = new URLSearchParams()
            //使用append()添加一条参数
        search.append('avatar', dataUrl)


        // 5.2 发起请求
        axios.post('/my/update/avatar', search)
            .then(res => {
                console.log(res);
                if (res.status !== 0) return layer.msg('上传失败')

                layer.msg('上传成功')

                window.parent.getUserInfo()
            })
    })

})