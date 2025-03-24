
<template>
  <div>
    <label :for="id">{{ label }}</label>
    <input :id="id" type="text" v-model="value" :placeholder="placeholder" />
  </div>
</template>
  
<script setup>

  import { defineProps, defineEmits, ref } from 'vue';
  
  const props = defineProps({
    id: String,
    label: String,
    modelValue: String,
    placeholder: String
  });
  
  const emit = defineEmits(['update:modelValue']);
  const value = ref(props.modelValue);
  
  watch(value, (newValue) => {
    emit('update:modelValue', newValue);
  });

</script>
