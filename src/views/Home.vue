<template>
  <div class="profile">
    <h2>Данные пользователя</h2>

    <div v-if="user">
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Имя:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
    </div>

    <div class="tokens">
      <h3>Токены</h3>
      <p><strong>Access Token:</strong> {{ accessToken }}</p>
      <p><strong>Refresh Token:</strong> {{ refreshToken }}</p>
    </div>

    <button @click="handleLogout">Выход</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import AuthService from '../auth/service.js'

const router = useRouter()
const user = ref(null)
const accessToken = ref(AuthService.state.accessToken)
const refreshToken = ref(localStorage.getItem('refresh_token'))

// Получаем данные пользователя
onMounted(async () => {
  try {
    const response = await axios.get('https://tonerTest.test/api/user', {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
    user.value = response.data
  } catch (error) {
    console.error('Ошибка получения данных:', error)
  }
})

// Выход из системы
const handleLogout = () => {
  AuthService.logout()
  router.push('/login')
}
</script>

<style scoped>
.profile {
  margin: 20px auto;
  padding: 20px;
}

.tokens {
  margin-top: 30px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
