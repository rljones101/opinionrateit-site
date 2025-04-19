<template>
  <TransitionGroup name="slide-fade" tag="div" class="transition-wrapper">
    <slot />
  </TransitionGroup>
</template>
<style scoped>
.transition-wrapper {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  width: 100%;
}
</style>
