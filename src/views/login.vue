<script setup>
import { login } from "@/api";
import { setToken } from "@/utils/auth"
import { useRouter } from "vue-router"

const router = useRouter();

function submit(){
    login({
        "account":"admin",
        "password":"000000"
    }).then(function(response){
        console.log(response)
        setToken(response.data.data)
        router.push('/')
    })
}
</script>

<template>
    <div>
        <el-button type="primary" @click="submit">登录</el-button>
    </div>
</template>