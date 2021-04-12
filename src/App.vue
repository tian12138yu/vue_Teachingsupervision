<template>
  <div id="app">
    <transition name="fade-transform" mode="out-in">
      <router-view  />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style>
.slide-fade{
  position: fixed;left:0;right: 0;
  width: 100%;
  background-color: white;
}
.slide-fade-enter, .slide-fade-leave-to
{
  left:0;top: 0;right: 0;
  position: absolute;
  transform:translateX(-500px) translateY(-500px) rotate(-150deg) scale(0.5);
  opacity:1;
}
.slide-fade-enter-active {
  background-color: white;
  transition: all 0.6s ease;
}
.slide-fade-leave-active {
  transition: all 0.7s ease;
  background-color: white;
  transform:translateX(500px) translateY(500px) rotate(150deg) scale(1) ;
  z-index: 100;
}
</style>
