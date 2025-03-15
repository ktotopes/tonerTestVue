<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthService from '../auth/service';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  try {
    const code = route.query.code;
    if (code) {
      await AuthService.handlePKCECallback(code);
      await router.push('/');
    }
  } catch (error) {
    console.error('Authentication failed:', error);
    await router.push('/login');
  }
});
</script>

<template>
  <div class="callback">
    <p>Processing authentication...</p>
  </div>
</template>
