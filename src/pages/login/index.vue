<template>
  <div>
    <div class="fx p-32">
      <svg-icon icon-class="logo" class="wh-35"/>
      <span class="pl-8 font-bold text-lg text-primary">Admin of Fendy blog</span>
    </div>
    <div class="login shadow">
      <h3 class="text-primary text-center">登录</h3>
      <q-form @submit="handleLogin" class="login-form mx-auto">
        <div class="pb-32">
          <q-input :rules="[val => val && val.length > 0 || '请输入用户名']" color="primary" v-model="loginForm.username"
                   label="用户名">
            <template v-slot:prepend>
              <q-icon name="person"/>
            </template>
          </q-input>
        </div>
        <div class="pb-32">
          <q-input :rules="[val => val && val.length>=8 || '密码不可少于8位']" color="primary" type="password"
                   v-model="loginForm.password" label="密码">
            <template v-slot:prepend>
              <q-icon name="password"/>
            </template>
          </q-input>
        </div>
        <div class="pb-32 pt-16">
          <q-btn :loading="loading" type="submit" class="w-full" color="primary">登录</q-btn>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { loginApi } from 'src/api/login'
import { useRouter } from 'vue-router'
import { useStore } from 'src/store'

export default defineComponent({
  name: 'Login',
  setup () {
    const loginForm = reactive({
      username: '',
      password: ''
    })
    const loading = ref(false)
    const $router = useRouter()
    const store = useStore()

    const handleLogin = () => {
      loading.value = true
      void loginApi(loginForm).then((value: any) => {
        void store.dispatch('userModule/setTokenAction', value.data.token)
        void $router.push('/')
      }).finally(() => {
        loading.value = false
      })
    }
    return {
      loginForm,
      handleLogin,
      loading
    }
  }
})

</script>

<style lang="scss" scoped>
.login {
  width: 500px;
  height: 560px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  padding: 32px;

  .login-form {
    width: 350px;
  }
}

@media (max-width: 500px) {
  .login {
    height: 100%;
    width: 100%;

    .login-form {
      width: 90%;
    }
  }
}
</style>
