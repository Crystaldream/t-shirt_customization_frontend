
<template>
  <div class="modal">
    <div class="modal-content">
      <h2>Upload Image for {{ config.color }} - {{ config.fabric }}</h2>
      <input type="file" @change="handleFileChange" />
      <button @click="upload">Upload</button>
      <button @click="$emit('close')">Cancel</button>
    </div>
  </div>
</template>
  
<script setup>

  import { ref } from 'vue';
  
  const props = defineProps(['config']);
  const emit = defineEmits(['upload', 'close']);
  const file = ref(null);
  
  const handleFileChange = (event) => {
    file.value = event.target.files[0];
  };
  
  const upload = async () => {

    if (!file.value) {

      alert('Select a file first!');
      return;
      
    }
  
    const formData = new FormData();

    formData.append('file', file.value);
    formData.append('itemId', props.config.itemId);
    formData.append('colorId', props.config.colorId);
    formData.append('fabricId', props.config.fabricId);
  
    await fetch(`http://localhost:5047/api/images/upload`, { method: 'POST', body: formData });

    emit('upload');
    emit('close');

  };

</script>
  