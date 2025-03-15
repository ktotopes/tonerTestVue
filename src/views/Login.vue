<template>
  <div class="auth-form">
    <h2>Login</h2>
    <button @click="initiatePKCE">Login with PKCE</button>
  </div>
</template>

<script setup>
import AuthService from '../auth/service';

const initiatePKCE = () => {
  AuthService.initiatePKCE();
};
</script>
