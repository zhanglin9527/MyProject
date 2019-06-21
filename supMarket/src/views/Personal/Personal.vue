<template>
    <div class="personal">
        <h1>个人中心</h1>
        <h2>用户ID: {{ userInfo.id }}</h2>
        <h2>账号:  {{ userInfo.account }}</h2>
        <h2>密码:  {{ userInfo.password }}</h2>
        <h2>用户组:  {{ userInfo.user_group }}</h2>
        <h2>创建时间:  {{userInfo.ctime | filterCtime  }}</h2>

        <div style="margin-top: 30px;">
            <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :http-request="uploadAvatar"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </div>
    </div>
</template>

<script>
// 引入请求函数
import { getInfo } from '@/api/account'

// 引入事件处理模块
import moment from 'moment'

// 引入axios
import axios from 'axios';

export default {
    data() {
        return {
            userInfo: {},
            imageUrl: ''
        }
    },
    methods: {
        // 获取用户信息
        getUserInfo() {
            // 发送请求 获取用户信息
            getInfo()
                .then(res => {
                    // 接收数据
                    let { data } = res;
                    this.userInfo = data[0] // 渲染
                })  
                .catch(err => {
                    console.log(err)
                })
        },
        // 头像上传成功
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        // 头上上传之前限制
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        // 上传函数
        uploadAvatar(file) {
            // 创建formData实例对象
            let formData = new FormData();

            // 把文件信息添加进如对象
            formData.append('file', file.file)

            // 发送文件信息给后端
            axios.post('/uploadavatar', formData)
                .then(response => {
                    // 获取地址
                    let { avatarUrl } = response.data;
                    // 回填
                    this.imageUrl = 'http://172.16.12.183:4396' + avatarUrl;

                    // 传递给父组件
                    this.$emit('自定义事件')
                })
                .catch(err => {
                    console.log(err)
                })
        }
    },
    created() {
        this.getUserInfo();
    },
    filters: {
        filterCtime(ctime) {
            return moment(ctime).format('YYYY-MM-DD HH:mm:ss')
        }
    }
}
</script>

<style lang="less">
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>