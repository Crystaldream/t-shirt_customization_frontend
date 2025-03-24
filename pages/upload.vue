
<template>
  <div v-if="item">
    <div style="margin-left: 225px; margin-top: 50px; color: #808080; font-weight: normal; font-family: Verdana, sans-serif; font-size: 24px; display: inline-block;">Item Id: {{ item.id }}</div>
    <div style="margin-left: 170px; color: #808080; font-weight: normal; font-family: Verdana, sans-serif; font-size: 24px; display: inline-block;"> Item Name: {{ item.name }}</div>

    <div class="table-container">
      <table class="fixed-table upload-table">
        <thead>
          <tr>
            <th style="border-right: 5px solid #ddd; border-bottom: 5px solid #ddd; border-top: 0px; border-left: 0px; "></th>
            <th v-for="color in uniqueColors" :key="color.id" style="border-top: 0px; border-bottom: 5px solid #ddd; border-right: 5px solid #ddd; color: #808080; font-weight: normal; font-family: Verdana, sans-serif; font-size: 16px;">{{ color.name }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fabric in uniqueFabrics" :key="fabric.id">
            <td style="border-left: 0px; border-bottom: 0px; color: #808080; font-weight: normal; font-family: Verdana, sans-serif; font-size: 16px;">{{ fabric.name }}</td>
            <td v-for="color in uniqueColors" :key="color.id" style="border-bottom: 0px; border-left: 5px solid #ddd; border-right: 5px solid #ddd;">
              <div class="cell-content">

                <div class="thumbnail-row">
                  <div div v-if="getImages(color.id, fabric.id).length" class="image-container">
                    <div
                      v-for="image in getImages(color.id, fabric.id)"
                      :key="image.id"
                      class="image-wrapper">
                        <img :src="image.imageUrl" />
                        <button class="delete-button" @click="deleteImage(image.id)">✖</button>
                    </div>
                  </div>
                </div>

                <div class="add-wrapper">
                  <button class="add-button" @click="triggerFileInput(color.id, fabric.id)">Add</button>
                  <input
                    type="file"
                    :ref="el => setFileInputRef(el, color.id, fabric.id)"
                    style="display: none"
                    @change="handleFileUpload($event, color.id, fabric.id)"
                  />
                </div>

              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>

  import { ref, computed, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const item = ref(null);
  const selectedColorId = ref(null);
  const selectedFabricId = ref(null);

  const fileInputs = ref({});

  const setFileInputRef = (el, colorId, fabricId) => {

    if (!el) 
      return;

    fileInputs.value[`${colorId}-${fabricId}`] = el;

  };
  
  const triggerFileInput = (colorId, fabricId) => {

    selectedColorId.value = colorId;
    selectedFabricId.value = fabricId;

    const inputRef = fileInputs.value[`${colorId}-${fabricId}`];

    if (inputRef) {
      inputRef.click();
    }

  };

  const handleFileUpload = async (event, colorId, fabricId) => {

    const file = event.target.files[0];
    
    if (!file) 
      return;
    
    const formData = new FormData();

    formData.append("file", file);
    formData.append("itemId", item.value.id);
    formData.append("colorId", colorId);
    formData.append("fabricId", fabricId);
    
    try {

        const response = await fetch("http://localhost:5047/api/images/upload", {

          method: "POST",
          body: formData,
          headers: { "Accept": "application/json" }

        });

        const text = await response.text();

        try {

          const data = JSON.parse(text);

          if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
          }

          const config = item.value.configurations.find(c => c.colorId === colorId && c.fabricId === fabricId);

          if (config) {
            config.images = [...(config.images || []), { id: data.imageId, imageUrl: data.imageUrl }];
          }
          
        } catch (error) {
          alert(`Upload failed: ${error.message}\n Server response: ${text}`);
        }
        
        if (!response.ok) {
          throw new Error(response.Error || 'Upload failed');
        }

    } catch (error) {
      console.error("Upload error:", error);
    }

  };

  const fetchItemDetails = async () => {
    
    try {
      
      const response = await fetch(`http://localhost:5047/api/items/${route.query.id}`);
      item.value = await response.json();

      console.log("Full API Response in Vue:", item.value);
      console.log("Configurations in Vue:", item.value?.configurations);
      
    } catch (error) {
      console.error("Error fetching item details:", error);
    }

  };

  const uniqueColors = computed(() => {

    if (!item.value || !item.value.configurations) 
      return [];
    
    return [...new Map(item.value.configurations.map(c => [c.colorId, { id: c.colorId, name: c.colorName }])).values()];

  });

  const uniqueFabrics = computed(() => {

    if (!item.value || !item.value.configurations) 
      return [];

    return [...new Map(item.value.configurations.map(c => [c.fabricId, { id: c.fabricId, name: c.fabricName }])).values()];

  });

  const getImages = (colorId, fabricId) => {

    return item.value?.configurations
      ?.filter(c => c.colorId === colorId && c.fabricId === fabricId)
      ?.flatMap(c => c.images || []) || [];

  };

  const deleteImage = async (imageId) => {

    try {

      const deleteResponse = await fetch(`http://localhost:5047/api/images/${imageId}`, { method: 'DELETE' });

      if (!deleteResponse.ok) {

        const errorText =  await deleteResponse.text();
        throw new Error(`Failed to delete image: ${errorText}`);

      }

      item.value.configurations.forEach(config => {
        config.images = config.images.filter(img => img.id !== imageId);
      });

    } catch (error) {
      console.error("Error deleting image:", error);
    }

  };

  onMounted(fetchItemDetails);

  watch(() => item.value, (newItem) => {
    
    console.log("Item Updated in Vue:", newItem);
    console.log("Configurations in Vue:", newItem?.configurations);

    uniqueColors.value.forEach(color => {
      uniqueFabrics.value.forEach(fabric => {
        console.log(`getImages(${color.id}, ${fabric.id}):`, getImages(color.id, fabric.id));
      });
    });

  }, { deep: true, immediate: true });

</script>

<style scoped>

  .upload-table {
    width: 100%;
    border-collapse: collapse;
  }

  .upload-table th, .upload-table td {
    border: 1px solid #ccc;
    text-align: center;
    padding: 10px;
  }

  .upload-table tr td:last-child {
    border-right: none !important;
  }
  .upload-table tr th:last-child {
    border-right: none !important;
  }

  .image-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .image-container {
    position: relative;
    display: inline-block;
  }

  .image-container img {
    border: 1px solid #ddd;
    padding: 2px;
  }

  .delete-button {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #808080;
    color: white;
    border: none;
    cursor: pointer;
  }

  .add-button {
    background: #f0f0f0;
    color: #808080; 
    font-weight: normal; 
    font-family: Verdana, sans-serif; 
    font-size: 14px;
    border: none;
    width: 100px;
    height: 50px;
    padding: 5px;
    cursor: pointer;
  }

  .image-wrapper {
    position: relative;
    width: 100px;
    height: 100px;
  }

  .image-wrapper img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .cell-content {
    display: flex;
    align-items: center;
    justify-content: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .thumbnail-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    align-items: flex-start;
  }

  .thumbnail-row img {
    height: auto;
  }

  .table-container {
    width: 80%;
    margin-left: 10%;
    margin-top: 5%;
    overflow-x: auto;
  }

  .fixed-table th, .fixed-table td {
    width: 50px;
    vertical-align: middle;
    text-align: center;
    overflow: hidden;
  }

  .image-container {
    display: flex;
    min-width: 100px;
    flex-direction: row;
    min-height: 100px;
    position: relative;
    flex-wrap: wrap;
    border-radius: 4px;
    align-items: center;
    gap: 10px;
  }

  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }

</style>
