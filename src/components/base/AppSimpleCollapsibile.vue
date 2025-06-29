<script setup lang="ts">
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primevue'
</script>

<template>
  <Accordion unstyled class="app-simple-collapsibile">
    <AccordionPanel value="0">
      <AccordionHeader class="flex items-center gap-2 font-semibold text-brand-500">
        <slot name="header"></slot>
      </AccordionHeader>
      <AccordionContent>
        <slot name="content" />
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>

<style>
.app-simple-collapsibile .p-icon.p-accordionheader-toggle-icon {
  --p-icon-size: 0.7rem;
}
</style>
